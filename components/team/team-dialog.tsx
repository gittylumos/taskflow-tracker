"use client";
import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStore } from "@/lib/store";

export function TeamDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { members, addMember, removeMember } = useStore();
  const [name, setName] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Team members</DialogTitle>
          <DialogDescription>People you can assign tasks to. Removing someone unassigns their tasks.</DialogDescription>
        </DialogHeader>
        <ul className="grid gap-1">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted">
              <UserAvatar name={m.name} avatar={m.avatar} className="size-7" />
              <span className="flex-1 text-sm">{m.name}</span>
              <Button variant="ghost" size="icon-sm" aria-label={`Remove ${m.name}`} onClick={() => removeMember(m.id)}><X /></Button>
            </li>
          ))}
          {members.length === 0 && <li className="py-4 text-center text-sm text-muted-foreground">No team members yet.</li>}
        </ul>
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (name.trim()) { addMember(name.trim()); setName(""); } }}>
          <Input aria-label="New member name" placeholder="Add a member…" value={name} onChange={(e) => setName(e.target.value)} />
          <Button type="submit"><UserPlus /> Add</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
