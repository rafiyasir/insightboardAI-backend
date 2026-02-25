import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { Task } from "../entities/Task";
import { sanitizeDependencies } from "../utils/sanitizeDependencies";
import { detectCycles } from "../utils/cycleDetection";
import { generateTasksFromTranscript } from "../services/llm.service";
import { TaskListSchema } from "../utils/schema";

export const generateTask = async (req: Request, res: Response) => {
  try {
    const transcript =
    typeof req.body === "string"
      ? req.body
      : req.body?.transcript;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript required" });
    }

    const raw = await generateTasksFromTranscript(transcript);

    let parsed = JSON.parse(raw as string);

    const validation = TaskListSchema.safeParse(parsed);

    if (!validation.success) {
      return res.status(500).json({
        error: "LLM schema invalid",
        details: validation.error.format(),
      });
    }

    const tasks = validation.data.tasks;

    const sanitized = sanitizeDependencies(tasks);

    const cycleNodes = detectCycles(sanitized);

    const finalTasks = sanitized.map((task) => ({
      ...task,
      status: cycleNodes.has(task.id) ? "Blocked/Error" : "Valid",
    }));

    const repo = AppDataSource.getRepository(Task);

    const saved = await repo.save({
      content: transcript,
      graph: finalTasks,
    });

    const hasCycle = cycleNodes.size > 0;

    return res.json({
      success: true,
      taskId: saved.id,
      taskCount: finalTasks.length,
      hasCycle,
      tasks: finalTasks,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const repo = AppDataSource.getRepository(Task);

  const task = await repo.findOneBy( { id: req.params.id as string});

  if (!task) {
    return res.status(404).json({ error: "Not found" });
  }

  return res.json(task);
};
