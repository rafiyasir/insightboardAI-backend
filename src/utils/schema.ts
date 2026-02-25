import { z } from "zod";

export const TaskSchema = z.object({
  id: z.string(),
  description: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  dependencies: z.array(z.string())
});

export const TaskListSchema = z.object({
  tasks: z.array(TaskSchema)
});