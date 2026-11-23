"use client";
import { useState } from "react";
import { CalendarDays, Trash2, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useStore } from "@/lib/store";
import { COLUMNS, PRIORITIES, type Priority, type StatusId } from "@/lib/types";

export type SheetTarget = { mode: "edit"; id: string } | { mode: "new"; status: StatusId } | null;
const NONE = "none";

interface Draft { title: string; description: string; assignee: string; priority: Priority; due: string | null; status: StatusId }

export function TaskSheet({ target, onClose }: { target: SheetTarget; onClose: () => void }) {
  if (!target) return null;
  return <TaskSheetBody key={target.mode === "edit" ? target.id : `new-${target.status}`} target={target} onClose={onClose} />;
}

function initialDraft(target: NonNullable<SheetTarget>): Draft | null {
  if (target.mode === "new") {
    return { title: "", description: "", assignee: NONE, priority: "Medium", due: null, status: target.status };
  }
  const t = useStore.getState().tasks.find((x) => x.id === target.id);
  return t ? { title: t.title, description: t.description, assignee: t.assigneeId ?? NONE, priority: t.priority, due: t.due, status: t.status } : null;
}

function TaskSheetBody({ target, onClose }: { target: NonNullable<SheetTarget>; onClose: () => void }) {
  const { tasks, members, addTask, updateTask, deleteTask, restoreTask } = useStore();
  const [draft, setDraft] = useState<Draft | null>(() => initialDraft(target));
  const [confirm, setConfirm] = useState(false);
  const editing = target.mode === "edit" ? tasks.find((t) => t.id === target.id) : undefined;

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => (d ? { ...d, [k]: v } : d));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || !draft.title.trim()) return;
    const data = {
      title: draft.title.trim(), description: draft.description, priority: draft.priority,
      due: draft.due, status: draft.status, assigneeId: draft.assignee === NONE ? null : draft.assignee,
    };
    if (editing) updateTask(editing.id, data);
    else addTask(data);
    toast.success(editing ? "Task updated" : "Task created");
    onClose();
  }

  function remove() {
    if (!editing) return;
    const removed = deleteTask(editing.id);
    setConfirm(false);
    onClose();
    if (removed) toast("Task deleted", { action: { label: "Undo", onClick: () => restoreTask(removed) } });
  }

  return (
    <>
      <Sheet open onOpenChange={(o) => !o && onClose()}>
        <SheetContent className="w-full gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit task" : "New task"}</SheetTitle>
            <SheetDescription>{editing ? "Update details, assignee and status." : "Assign work to someone on your team."}</SheetDescription>
          </SheetHeader>
          {draft && (
            <form id="task-form" onSubmit={submit} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-2">
              <div className="grid gap-1.5">
                <Label htmlFor="t-title">Title</Label>
                <Input id="t-title" value={draft.title} onChange={(e) => set("title", e.target.value)} required autoFocus />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="t-desc">Description</Label>
                <Textarea id="t-desc" rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label>Assignee</Label>
                  <Select value={draft.assignee} onValueChange={(v) => set("assignee", v ?? NONE)}>
                    <SelectTrigger className="w-full"><SelectValue>{(v: string) => (v === NONE ? "Unassigned" : members.find((m) => m.id === v)?.name)}</SelectValue></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NONE}>Unassigned</SelectItem>
                      {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Priority</Label>
                  <Select value={draft.priority} onValueChange={(v) => set("priority", (v ?? "Medium") as Priority)}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>{PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Status</Label>
                  <Select value={draft.status} onValueChange={(v) => set("status", (v ?? "todo") as StatusId)}>
                    <SelectTrigger className="w-full"><SelectValue>{(v: string) => COLUMNS.find((c) => c.id === v)?.name}</SelectValue></SelectTrigger>
                    <SelectContent>{COLUMNS.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label>Due date</Label>
                  <div className="flex gap-1">
                    <Popover>
                      <PopoverTrigger render={<Button type="button" variant="outline" className="flex-1 justify-start font-normal" />}>
                        <CalendarDays className="text-muted-foreground" />
                        {draft.due ? format(parseISO(draft.due), "MMM d, yyyy") : <span className="text-muted-foreground">Pick a date</span>}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={draft.due ? parseISO(draft.due) : undefined}
                          onSelect={(d) => set("due", d ? format(d, "yyyy-MM-dd") : null)} />
                      </PopoverContent>
                    </Popover>
                    {draft.due && (
                      <Button type="button" variant="ghost" size="icon" aria-label="Clear due date" onClick={() => set("due", null)}><X /></Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
          <SheetFooter className="flex-row justify-between border-t">
            {editing ? (
              <Button type="button" variant="ghost" className="text-danger" onClick={() => setConfirm(true)}><Trash2 /> Delete</Button>
            ) : <span />}
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit" form="task-form">{editing ? "Save" : "Create task"}</Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this task?</AlertDialogTitle>
            <AlertDialogDescription>You can undo right after from the toast.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
