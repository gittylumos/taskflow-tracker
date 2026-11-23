import { cn } from "@/lib/utils";
import { pixelSprite } from "@/lib/avatars";

const initials = (name: string) => name.trim().slice(0, 2).toUpperCase() || "?";

export function UserAvatar({ name, avatar = "initials", className }: { name: string; avatar?: string; className?: string }) {
  const base = "inline-grid shrink-0 place-items-center overflow-hidden rounded-full select-none size-6 text-[10px] font-medium";
  if (avatar.startsWith("emoji:")) {
    return (
      <span data-avatar title={name} className={cn(base, "bg-muted text-[1.1em] leading-none", className)} aria-label={name}>
        {avatar.slice(6)}
      </span>
    );
  }
  if (avatar.startsWith("pixel:")) {
    const { cells, hue } = pixelSprite(avatar.slice(6));
    return (
      <span data-avatar title={name} className={cn(base, className)} aria-label={name}>
        <svg viewBox="0 0 5 5" className="size-full" shapeRendering="crispEdges" aria-hidden>
          <rect width="5" height="5" fill={`hsl(${hue} 45% 22%)`} />
          {cells.flatMap((row, y) =>
            row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={`hsl(${hue} 80% 70%)`} /> : null)),
          )}
        </svg>
      </span>
    );
  }
  return (
    <span data-avatar title={name} className={cn(base, "bg-primary text-primary-foreground", className)} aria-label={name}>
      {initials(name)}
    </span>
  );
}
