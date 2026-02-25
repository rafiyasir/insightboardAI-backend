import { Task } from "../types/task";

export function propagateBlockedTasks(
  tasks: Task[],
  initialBlocked: Set<string>
) {
  const blocked = new Set(initialBlocked);

  let changed = true;

  while (changed) {
    changed = false;

    for (const task of tasks) {
      if (blocked.has(task.id)) continue;

      const dependsOnBlocked = task.dependencies.some(dep =>
        blocked.has(dep)
      );

      if (dependsOnBlocked) {
        blocked.add(task.id);
        changed = true;
      }
    }
  }

  return blocked;
}

export function detectCycles(tasks: Task[]) {
  const graph = new Map<string, string[]>();

  tasks.forEach((task) => {
    graph.set(task.id, task.dependencies);
  });

  const visited = new Set<string>();
  const inStack = new Set<string>();
  const cycleNodes = new Set<string>();

  function dfs(node: string) {
    if (inStack.has(node)) {
      inStack.forEach((n) => cycleNodes.add(n));
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

  tasks.forEach((task) => dfs(task.id));

  return cycleNodes;
}