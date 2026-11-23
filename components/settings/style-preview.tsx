"use client";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrackerStyle } from "@/lib/settings";

/** Mini board rendered with the style's own tokens (scoped via data-style). */
export function StylePreview({
  id, name, blurb, selected, onSelect,
}: { id: TrackerStyle; name: string; blurb: string; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group grid gap-2 rounded-xl border p-2 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
        selected && "border-ring bg-muted",
      )}
    >
      <div
        data-style={id}
        style={{ fontFamily: "var(--font-sans)", borderRadius: "var(--radius)", background: "var(--surface-canvas)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
        className="grid gap-1.5 p-2.5 text-[10px]"
        aria-hidden
      >
        <div style={{ color: "var(--text-secondary)" }} className="font-semibold uppercase">{id === "ascii" ? "[ To Do ]" : "To Do"}</div>
        <div
          style={{ background: "var(--surface-raised)", border: "1px solid var(--border-strong)", borderRadius: "calc(var(--radius) * 0.6)", boxShadow: "var(--shadow-1)", borderStyle: id === "ascii" ? "dashed" : "solid" }}
          className="px-2 py-1.5"
        >
          Fix login bug
        </div>
        <div className="flex gap-1">
          <span style={{ background: "var(--brand)", color: "var(--on-brand)", borderRadius: "calc(var(--radius) * 0.5)" }} className="px-1.5 py-0.5">Urgent</span>
          <span style={{ background: "var(--surface-column)", borderRadius: "calc(var(--radius) * 0.5)" }} className="px-1.5 py-0.5">Nov 24</span>
        </div>
      </div>
      <div className="flex items-start justify-between gap-2 px-1">
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{blurb}</div>
        </div>
        {selected && <Check className="mt-0.5 size-4 shrink-0 text-primary" />}
      </div>
    </button>
  );
}
