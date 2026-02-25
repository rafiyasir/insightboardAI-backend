import { Task } from "../types/task";

export function detectCycles(tasks: Task[]) {
  const graph = new Map<string, string[]>();
  tasks.forEach(task => {
    graph.set(task.id, task.dependencies);
  });

  const visited = new Set<string>();
  const inStack = new Set<string>();
  const cycleNodes = new Set<string>();

  function dfs(node: string) {
    if (inStack.has(node)) {
      cycleNodes.add(node);
      return;
    }

    if (visited.has(node)) return;

    visited.add(node);
    inStack.add(node);

    for (const dep of graph.get(node) || []) {
      dfs(dep);
    }

    inStack.delete(node);
  }

  tasks.forEach(task => dfs(task.id));

  return cycleNodes;
}