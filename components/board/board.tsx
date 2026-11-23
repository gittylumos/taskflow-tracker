"use client";
import { useMemo, useState } from "react";
import {
  DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCorners,
  useSensor, useSensors, type DragEndEvent, type DragOverEvent, type DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useStore } from "@/lib/store";
import { COLUMNS, type StatusId, type Task } from "@/lib/types";
import { Column } from "./column";
import { TaskCardView } from "./task-card";

export function Board({
  tasks, onOpen, onAdd,
}: { tasks: Task[]; onOpen: (id: string) => void; onAdd: (s: StatusId) => void }) {
  const moveTask = useStore((s) => s.moveTask);
  const allTasks = useStore((s) => s.tasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const byStatus = useMemo(
    () => Object.fromEntries(COLUMNS.map((c) => [c.id, tasks.filter((t) => t.status === c.id)])) as Record<StatusId, Task[]>,
    [tasks],
  );
  const active = allTasks.find((t) => t.id === activeId);

  const targetOf = (overId: string, overType?: string) => {
    if (overType === "column") return { status: overId as StatusId, before: null as string | null };
    const t = allTasks.find((x) => x.id === overId);
    return t ? { status: t.status, before: t.id } : null;
  };

  const onDragStart = (e: DragStartEvent) => setActiveId(String(e.active.id));
  // Move across columns live so the card follows the pointer.
  const onDragOver = (e: DragOverEvent) => {
    if (!e.over) return;
    const cur = allTasks.find((t) => t.id === e.active.id);
    const target = targetOf(String(e.over.id), e.over.data.current?.type);
    if (cur && target && cur.status !== target.status) moveTask(cur.id, target.status, target.before);
  };
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (!e.over || e.active.id === e.over.id) return;
    const target = targetOf(String(e.over.id), e.over.data.current?.type);
    if (target) moveTask(String(e.active.id), target.status, target.before);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart}
      onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="flex flex-1 items-start gap-3 overflow-x-auto px-4 pb-6 md:px-6">
        {COLUMNS.map((c) => (
          <Column key={c.id} id={c.id} name={c.name} tasks={byStatus[c.id]} onOpen={onOpen} onAdd={onAdd} />
        ))}
      </div>
      <DragOverlay>{active ? <TaskCardView task={active} overlay /> : null}</DragOverlay>
    </DndContext>
  );
}
