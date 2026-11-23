"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import type { Task } from "@/lib/types";
import { initials, isOverdue, memberName, priorityClass } from "./helpers";

export function TaskCardView({ task, overlay }: { task: Task; overlay?: boolean }) {
  const members = useStore((s) => s.members);
  const name = memberName(members, task.assigneeId);
  const overdue = isOverdue(task);
  return (
    <div
      className={cn(
        "elevated rounded-lg border bg-surface-raised p-3 text-left",
        "transition-shadow hover:shadow-elev-2",
        overlay && "shadow-elev-3 rotate-1 cursor-grabbing",
      )}
    >
      <p className="mb-2 text-sm font-medium leading-snug break-words">{task.title}</p>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline" className={priorityClass[task.priority]}>{task.priority}</Badge>
        {task.due && (
          <span className={cn("inline-flex items-center gap-1", overdue && "font-medium text-danger")}>
            <CalendarDays className="size-3" />
            {overdue ? "Overdue · " : ""}
            {format(parseISO(task.due), "MMM d")}
          </span>
        )}
        {name && (
          <Avatar className="ml-auto size-6" title={name}>
            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground">{initials(name)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}

export function SortableTask({ task, onOpen }: { task: Task; onOpen: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: "task", status: task.status },
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("touch-manipulation rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50", isDragging && "opacity-40")}
      onClick={() => onOpen(task.id)}
      {...attributes}
      {...listeners}
      onKeyDown={(e) => {
        if (e.key === "Enter") onOpen(task.id);
        else listeners?.onKeyDown?.(e);
      }}
    >
      <TaskCardView task={task} />
    </div>
  );
}
