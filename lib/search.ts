import type { Task } from "./types.ts";

export const ALL = "all";
export const UNASSIGNED = "none";

export interface TaskFilters {
  query: string;
  assignee: string; // ALL | UNASSIGNED | member id
  priority: string; // ALL | Priority
}

/** Case-insensitive substring match on title and description. Blank query matches everything. */
export function matchesQuery(task: Task, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q);
}

export function filterTasks(tasks: Task[], { query, assignee, priority }: TaskFilters): Task[] {
  return tasks.filter(
    (t) =>
      (assignee === ALL || (assignee === UNASSIGNED ? !t.assigneeId : t.assigneeId === assignee)) &&
      (priority === ALL || t.priority === priority) &&
      matchesQuery(t, query),
  );
}
