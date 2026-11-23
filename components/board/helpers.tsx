import { isBefore, parseISO, startOfToday } from "date-fns";
import type { Member, Priority, Task } from "@/lib/types";

export const priorityClass: Record<Priority, string> = {
  Low: "text-muted-foreground border-border",
  Medium: "text-info border-info/40",
  High: "text-warning border-warning/40",
  Urgent: "text-danger border-danger/40",
};

export const isOverdue = (t: Task) =>
  !!t.due && t.status !== "done" && isBefore(parseISO(t.due), startOfToday());

export const initials = (name: string) => name.trim().slice(0, 2).toUpperCase();

export const memberName = (members: Member[], id: string | null) =>
  members.find((m) => m.id === id)?.name;
