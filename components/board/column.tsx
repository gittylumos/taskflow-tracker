"use client";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StatusId, Task } from "@/lib/types";
import { SortableTask } from "./task-card";

export function Column({
  id, name, tasks, onOpen, onAdd,
}: { id: StatusId; name: string; tasks: Task[]; onOpen: (id: string) => void; onAdd: (s: StatusId) => void }) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { type: "column" } });
  return (
    <section
      aria-label={name}
      className={cn(
        "flex w-72 shrink-0 flex-col rounded-xl border border-transparent bg-surface-column p-2 transition-colors",
        isOver && "border-ring/60",
      )}
    >
      <header className="flex items-center justify-between px-2 py-1.5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{name}</h2>
        <span className="rounded-full bg-muted px-2 text-xs tabular-nums text-muted-foreground">{tasks.length}</span>
      </header>
      <div ref={setNodeRef} className="flex min-h-16 flex-1 flex-col gap-2 p-1">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => <SortableTask key={t.id} task={t} onOpen={onOpen} />)}
        </SortableContext>
        {tasks.length === 0 && (
          <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">No tasks</p>
        )}
      </div>
      <Button variant="ghost" size="sm" className="mt-1 justify-start text-muted-foreground" onClick={() => onAdd(id)}>
        <Plus /> Add task
      </Button>
    </section>
  );
}
