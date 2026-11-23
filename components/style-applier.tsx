"use client";
import { useEffect } from "react";
import { useSettings } from "@/lib/settings";

/** Keeps <html data-style / data-palette> in sync with saved settings. */
export function StyleApplier() {
  useEffect(() => {
    let unsub = () => {};
    Promise.resolve(useSettings.persist.rehydrate()).finally(() => {
      const apply = () => {
        const { style, palette } = useSettings.getState();
        document.documentElement.dataset.style = style;
        if (palette === "default") delete document.documentElement.dataset.palette;
        else document.documentElement.dataset.palette = palette;
      };
      apply();
      unsub = useSettings.subscribe(apply);
    });
    return () => unsub();
  }, []);
  return null;
}
