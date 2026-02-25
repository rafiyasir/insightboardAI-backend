import { AppDataSource } from "../config/data-source";
import { Job } from "../entities/Job";
import { generateTasksFromTranscript } from "./llm.service";
import { sanitizeDependencies } from "../utils/sanitizeDependencies";
import { detectCycles } from "../utils/cycleDetection";
import { TaskListSchema } from "../utils/schema";

export async function processJob(jobId: string) {
  const jobRepo = AppDataSource.getRepository(Job);

  const job = await jobRepo.findOne({
    where: { id: jobId }
  });

  if (!job) return;

  try {
    const raw = await generateTasksFromTranscript(job.transcript);
    const parsed = JSON.parse(raw as string);

    const validation = TaskListSchema.safeParse(parsed);

    if (!validation.success) {
      job.status = "failed";
      await jobRepo.save(job);
      return;
    }

    let tasks = validation.data.tasks;
    tasks = sanitizeDependencies(tasks);
    const cycleNodes = detectCycles(tasks);

    const finalTasks = tasks.map(task => ({
      ...task,
      status: cycleNodes.has(task.id) ? "Blocked/Error" : "Valid",
    }));

    job.result = finalTasks;
    job.status = "completed";

    await jobRepo.save(job);

  } catch (err) {
    job.status = "failed";
    await jobRepo.save(job);
  }
}