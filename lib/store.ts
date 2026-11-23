"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { addDays, format } from "date-fns";
import type { Member, StatusId, Task } from "./types";

const uid = () => Math.random().toString(36).slice(2, 10);
const day = (n: number) => format(addDays(new Date(), n), "yyyy-MM-dd");

function seed(): { members: Member[]; tasks: Task[] } {
  const members = ["Alex", "Priya", "Sam"].map((name) => ({ id: uid(), name }));
  const [alex, priya, sam] = members;
  const t = (title: string, m: Member | null, priority: Task["priority"], due: string | null, status: StatusId): Task => ({
    id: uid(), title, description: "", assigneeId: m?.id ?? null, priority, due, status,
  });
  return {
    members,
    tasks: [
      t("Draft Q1 roadmap", priya, "High", day(2), "in-progress"),
      t("Fix login bug", sam, "Urgent", day(-1), "todo"),
      t("Review pricing page copy", alex, "Medium", null, "in-review"),
      t("Set up weekly standup", null, "Low", day(5), "todo"),
      t("Ship onboarding emails", alex, "Medium", day(-3), "done"),
    ],
  };
}

interface State {
  members: Member[];
  tasks: Task[];
  addTask: (t: Omit<Task, "id">) => string;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => Task | undefined;
  restoreTask: (t: Task) => void;
  /** Move task to a column, placing it before `beforeId` (or at the end). */
  moveTask: (id: string, status: StatusId, beforeId?: string | null) => void;
  addMember: (name: string) => void;
  setMemberAvatar: (id: string, avatar: string) => void;
  removeMember: (id: string) => void;
  reset: () => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      ...seed(),
      addTask: (t) => {
        const id = uid();
        set((s) => ({ tasks: [...s.tasks, { ...t, id }] }));
        return id;
      },
      updateTask: (id, patch) =>
        set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
      deleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
        return task;
      },
      restoreTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
      moveTask: (id, status, beforeId) =>
        set((s) => {
          const task = s.tasks.find((t) => t.id === id);
          if (!task) return s;
          const rest = s.tasks.filter((t) => t.id !== id);
          const moved = { ...task, status };
          const idx = beforeId ? rest.findIndex((t) => t.id === beforeId) : -1;
          if (idx < 0) return { tasks: [...rest, moved] };
          return { tasks: [...rest.slice(0, idx), moved, ...rest.slice(idx)] };
        }),
      addMember: (name) =>
        set((s) =>
          s.members.some((m) => m.name.toLowerCase() === name.toLowerCase())
            ? s
            : { members: [...s.members, { id: uid(), name }] },
        ),
      setMemberAvatar: (id, avatar) =>
        set((s) => ({ members: s.members.map((m) => (m.id === id ? { ...m, avatar } : m)) })),
      removeMember: (id) =>
        set((s) => ({
          members: s.members.filter((m) => m.id !== id),
          tasks: s.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: null } : t)),
        })),
      reset: () => set(seed()),
    }),
    {
      name: "team-tracker-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ members: s.members, tasks: s.tasks }),
      skipHydration: true,
    },
  ),
);
