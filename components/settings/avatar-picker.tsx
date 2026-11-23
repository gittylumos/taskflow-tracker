"use client";
import { Check } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { avatarOptions } from "@/lib/avatars";
import { cn } from "@/lib/utils";

export function AvatarPicker({ name, value, onChange }: { name: string; value?: string; onChange: (v: string) => void }) {
  const current = value ?? "initials";
  return (
    <div role="radiogroup" aria-label="Choose an avatar" className="grid grid-cols-6 gap-2 sm:grid-cols-8">
      {avatarOptions.map((opt) => {
        const on = current === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={opt === "initials" ? "Initials" : opt.replace(":", " ")}
            onClick={() => onChange(opt)}
            className={cn(
              "relative grid place-items-center rounded-lg border p-1.5 outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
              on && "border-ring bg-muted",
            )}
          >
            <UserAvatar name={name} avatar={opt} className="size-9 text-xs" />
            {on && <Check className="absolute -right-1 -top-1 size-4 rounded-full bg-primary p-0.5 text-primary-foreground" />}
          </button>
        );
      })}
    </div>
  );
}
