export type Priority = "Low" | "Medium" | "High" | "Urgent";
export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Urgent"];

export type StatusId = "todo" | "in-progress" | "in-review" | "done";
export const COLUMNS: { id: StatusId; name: string }[] = [
  { id: "todo", name: "To Do" },
  { id: "in-progress", name: "In Progress" },
  { id: "in-review", name: "In Review" },
  { id: "done", name: "Done" },
];

export interface Member {
  id: string;
  name: string;
  avatar?: string; // see lib/avatars.ts
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  priority: Priority;
  due: string | null; // yyyy-MM-dd
  status: StatusId;
}
