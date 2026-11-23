"use client";
import { Monitor, Moon, RotateCcw, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/ui/user-avatar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AvatarPicker } from "@/components/settings/avatar-picker";
import { StylePreview } from "@/components/settings/style-preview";
import { useStore } from "@/lib/store";
import { PALETTES, STYLES, useSettings } from "@/lib/settings";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "light", label: "Light", Icon: Sun },
  { id: "dark", label: "Dark", Icon: Moon },
  { id: "system", label: "System", Icon: Monitor },
] as const;

export function SettingsPage() {
  const ready = useHydrated();
  const { theme, setTheme } = useTheme();
  const { profile, style, palette, setProfile, setStyle, setPalette, reset } = useSettings();
  const { members, setMemberAvatar } = useStore();

  return (
    <SidebarProvider>
      <AppSidebar ready={ready} />
      <SidebarInset className="min-w-0 bg-background">
        <header className="flex items-center gap-2 border-b bg-surface-raised px-4 py-3 md:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <h1 className="mr-auto text-base font-semibold">Settings</h1>
          <Button variant="outline" onClick={() => { reset(); toast("Personalization reset"); }}>
            <RotateCcw /> Reset
          </Button>
        </header>

        {!ready ? (
          <div className="grid max-w-3xl gap-4 p-4 md:p-6"><Skeleton className="h-48" /><Skeleton className="h-64" /></div>
        ) : (
          <div className="grid max-w-3xl gap-6 p-4 pb-12 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>How you appear in the tracker. Saved on this device.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center gap-4">
                  <UserAvatar name={profile.name} avatar={profile.avatar} className="size-14 text-lg" />
                  <div className="grid flex-1 gap-1.5">
                    <Label htmlFor="display-name">Display name</Label>
                    <Input id="display-name" value={profile.name} maxLength={40} onChange={(e) => setProfile({ name: e.target.value })} />
                  </div>
                </div>
                <AvatarPicker name={profile.name || "You"} value={profile.avatar} onChange={(avatar) => setProfile({ avatar })} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Mode, tracker style and accent colors work together.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label>Mode</Label>
                  <div role="radiogroup" aria-label="Mode" className="flex flex-wrap gap-2">
                    {MODES.map(({ id, label, Icon }) => (
                      <Button key={id} type="button" role="radio" aria-checked={theme === id} variant={theme === id ? "default" : "outline"} onClick={() => setTheme(id)}>
                        <Icon /> {label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Tracker style</Label>
                  <div role="radiogroup" aria-label="Tracker style" className="grid gap-3 sm:grid-cols-2">
                    {STYLES.map((s) => (
                      <StylePreview key={s.id} id={s.id} name={s.name} blurb={s.blurb} selected={style === s.id} onSelect={() => setStyle(s.id)} />
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Accent color</Label>
                  {(["Color", "Accessible"] as const).map((group) => (
                    <div key={group} className="grid gap-1.5">
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{group}</p>
                      <div role="radiogroup" aria-label={`${group} palettes`} className="grid gap-2 sm:grid-cols-2">
                        {PALETTES.filter((p) => p.group === group).map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            role="radio"
                            aria-checked={palette === p.id}
                            onClick={() => setPalette(p.id)}
                            className={cn(
                              "flex items-start gap-3 rounded-lg border p-3 text-left outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50",
                              palette === p.id && "border-ring bg-muted",
                            )}
                          >
                            <span data-palette={p.id === "default" ? undefined : p.id} className="mt-0.5 size-4 shrink-0 rounded-full border" style={{ background: "var(--brand)" }} aria-hidden />
                            <span>
                              <span className="block text-sm font-medium">{p.name}</span>
                              <span className="block text-xs text-muted-foreground">{p.blurb}</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team avatars</CardTitle>
                <CardDescription>Pick an avatar for each person. It shows on their task cards.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                {members.length === 0 && <p className="text-sm text-muted-foreground">No team members yet. Add some from the Team page.</p>}
                {members.map((m) => (
                  <div key={m.id} className="grid gap-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <UserAvatar name={m.name} avatar={m.avatar} className="size-7" /> {m.name}
                    </div>
                    <AvatarPicker name={m.name} value={m.avatar} onChange={(a) => setMemberAvatar(m.id, a)} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
