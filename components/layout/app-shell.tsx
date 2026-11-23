"use client";
import { useMemo, useState } from "react";
import { Download, LayoutDashboard, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useStore } from "@/lib/store";
import { useHydrated } from "@/lib/use-hydrated";
import type { StatusId } from "@/lib/types";
import { PRIORITIES } from "@/lib/types";
import { Board } from "@/components/board/board";
import { TaskSheet, type SheetTarget } from "@/components/board/task-sheet";
import { TeamDialog } from "@/components/team/team-dialog";
import { initials, isOverdue } from "@/components/board/helpers";
import { ThemeToggle } from "./theme-toggle";

const ALL = "all";

export function AppShell() {
  const ready = useHydrated();
  const { tasks, members } = useStore();
  const [query, setQuery] = useState("");
  const [assignee, setAssignee] = useState(ALL);
  const [priority, setPriority] = useState(ALL);
  const [target, setTarget] = useState<SheetTarget>(null);
  const [teamOpen, setTeamOpen] = useState(false);

  const visible = useMemo(
    () => tasks.filter((t) =>
      (assignee === ALL || (assignee === "none" ? !t.assigneeId : t.assigneeId === assignee)) &&
      (priority === ALL || t.priority === priority) &&
      (!query || t.title.toLowerCase().includes(query.toLowerCase())),
    ),
    [tasks, assignee, priority, query],
  );
  const done = tasks.filter((t) => t.status === "done").length;
  const overdue = ready ? tasks.filter(isOverdue).length : 0;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  const exportJson = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify({ members, tasks }, null, 2)], { type: "application/json" }));
    a.download = "team-tracker.json";
    a.click();
  };
  const add = (status: StatusId) => setTarget({ mode: "new", status });

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="px-4 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground"><LayoutDashboard className="size-4" /></span>
            Team Tracker
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton isActive><LayoutDashboard /> Board</SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton onClick={() => setTeamOpen(true)}><Users /> Team</SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Members</SidebarGroupLabel>
            <SidebarMenu>
              {members.map((m) => (
                <SidebarMenuItem key={m.id}>
                  <SidebarMenuButton isActive={assignee === m.id} onClick={() => setAssignee(assignee === m.id ? ALL : m.id)}>
                    <Avatar className="size-5"><AvatarFallback className="bg-primary text-[9px] text-primary-foreground">{initials(m.name)}</AvatarFallback></Avatar>
                    {m.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="min-w-0 bg-background">
        <header className="flex flex-wrap items-center gap-2 border-b bg-surface-raised px-4 py-3 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <h1 className="mr-auto text-base font-semibold">Board</h1>
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
            <Input aria-label="Search tasks" placeholder="Search tasks" className="w-44 pl-8" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={assignee} onValueChange={(v) => setAssignee(v ?? ALL)}>
            <SelectTrigger aria-label="Filter by assignee" className="w-36"><SelectValue>{(v: string) => v === ALL ? "All assignees" : v === "none" ? "Unassigned" : members.find((m) => m.id === v)?.name}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All assignees</SelectItem>
              <SelectItem value="none">Unassigned</SelectItem>
              {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => setPriority(v ?? ALL)}>
            <SelectTrigger aria-label="Filter by priority" className="w-36"><SelectValue>{(v: string) => v === ALL ? "All priorities" : v}</SelectValue></SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All priorities</SelectItem>
              {PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" aria-label="Export JSON" onClick={exportJson}><Download /></Button>
          <ThemeToggle />
          <Button onClick={() => add("todo")}><Plus /> New task</Button>
        </header>

        <div className="flex items-center gap-4 px-4 py-3 text-sm text-muted-foreground md:px-6">
          <span>{tasks.length} tasks</span>
          <span className={overdue ? "text-danger" : ""}>{overdue} overdue</span>
          <div className="flex max-w-56 flex-1 items-center gap-2">
            <Progress value={pct} className="h-1.5" aria-label="Completion" />
            <span className="tabular-nums">{pct}%</span>
          </div>
        </div>

        {ready ? (
          <Board tasks={visible} onOpen={(id) => setTarget({ mode: "edit", id })} onAdd={add} />
        ) : (
          <div className="flex gap-3 px-4 md:px-6">
            {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-72 w-72 shrink-0 rounded-xl" />)}
          </div>
        )}
      </SidebarInset>

      <TaskSheet target={target} onClose={() => setTarget(null)} />
      <TeamDialog open={teamOpen} onOpenChange={setTeamOpen} />
    </SidebarProvider>
  );
}
