"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type TrackerStyle = "default" | "pixel" | "ascii" | "toon";
export const STYLES: { id: TrackerStyle; name: string; blurb: string }[] = [
  { id: "default", name: "Default", blurb: "Clean and modern." },
  { id: "pixel", name: "Pixel", blurb: "Retro 8-bit with hard shadows." },
  { id: "ascii", name: "ASCII", blurb: "Terminal look, monospace and dashed lines." },
  { id: "toon", name: "Toon", blurb: "Chunky, round and playful." },
];

export type PaletteId = "default" | "blue" | "red" | "green" | "cb-red-green" | "cb-blue-yellow" | "contrast";
export const PALETTES: { id: PaletteId; name: string; blurb: string; group: "Color" | "Accessible" }[] = [
  { id: "default", name: "Style default", blurb: "Uses the accent of the chosen style.", group: "Color" },
  { id: "blue", name: "Ocean Blue", blurb: "Calm, familiar blue.", group: "Color" },
  { id: "red", name: "Crimson Red", blurb: "Bold and warm.", group: "Color" },
  { id: "green", name: "Forest Green", blurb: "Fresh and natural.", group: "Color" },
  { id: "cb-red-green", name: "Red-green safe", blurb: "For deuteranopia and protanopia. Blue and orange, never red against green.", group: "Accessible" },
  { id: "cb-blue-yellow", name: "Blue-yellow safe", blurb: "For tritanopia. Magenta and teal, no blue against yellow.", group: "Accessible" },
  { id: "contrast", name: "High contrast", blurb: "Maximum text and border contrast.", group: "Accessible" },
];

interface Settings {
  profile: { name: string; avatar: string };
  style: TrackerStyle;
  palette: PaletteId;
  setPalette: (p: PaletteId) => void;
  setProfile: (p: Partial<Settings["profile"]>) => void;
  setStyle: (s: TrackerStyle) => void;
  reset: () => void;
}

const defaults = { profile: { name: "You", avatar: "pixel:fox" }, style: "default" as TrackerStyle, palette: "default" as PaletteId };
export const SETTINGS_KEY = "team-tracker-settings-v1";

export const useSettings = create<Settings>()(
  persist(
    (set) => ({
      ...defaults,
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setStyle: (style) => set({ style }),
      setPalette: (palette) => set({ palette }),
      reset: () => set(defaults),
    }),
    {
      name: SETTINGS_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ profile: s.profile, style: s.style, palette: s.palette }),
      skipHydration: true,
    },
  ),
);
