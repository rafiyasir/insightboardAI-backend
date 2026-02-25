export interface Task {
  id: string;
  description: string;
  priority: "low" | "medium" | "high";
  dependencies: string[];
}