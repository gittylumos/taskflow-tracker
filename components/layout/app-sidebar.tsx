"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, Users } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { TeamDialog } from "@/components/team/team-dialog";
import { useStore } from "@/lib/store";
import { useSettings } from "@/lib/settings";

export function AppSidebar({ ready, assignee, onAssignee }: { ready: boolean; assignee?: string; onAssignee?: (id: string) => void }) {
  const pathname = usePathname();
  const members = useStore((s) => s.members);
  const profile = useSettings((s) => s.profile);
  const [teamOpen, setTeamOpen] = useState(false);
  return (
    <>
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
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/"} render={<Link href="/" />}><LayoutDashboard /> Board</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem><SidebarMenuButton onClick={() => setTeamOpen(true)}><Users /> Team</SidebarMenuButton></SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/settings"} render={<Link href="/settings" />}><Settings /> Settings</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          {ready && (
            <SidebarGroup>
              <SidebarGroupLabel>Members</SidebarGroupLabel>
              <SidebarMenu>
                {members.map((m) => (
                  <SidebarMenuItem key={m.id}>
                    <SidebarMenuButton isActive={assignee === m.id} onClick={() => onAssignee?.(m.id)}>
                      <UserAvatar name={m.name} avatar={m.avatar} className="size-5" />
                      {m.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>
        {ready && (
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" render={<Link href="/settings" />}>
                  <UserAvatar name={profile.name} avatar={profile.avatar} className="size-8" />
                  <span className="truncate text-sm font-medium">{profile.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}
      </Sidebar>
      <TeamDialog open={teamOpen} onOpenChange={setTeamOpen} />
    </>
  );
}
