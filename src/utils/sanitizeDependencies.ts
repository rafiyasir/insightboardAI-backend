export function sanitizeDependencies(tasks: any[]) {
  const validIds = new Set(tasks.map(t => t.id));

  return tasks.map(task => ({
    ...task,
    dependencies: task.dependencies.filter((dep: string) =>
      validIds.has(dep)
    )
  }));
}