"use client";
import { useEffect, useState } from "react";
import { useStore } from "./store";
import { useSettings } from "./settings";

/** Rehydrates persisted stores on the client; avoids SSR/CSR mismatch. */
export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.all([useStore.persist.rehydrate(), useSettings.persist.rehydrate()]).finally(() => setReady(true));
  }, []);
  return ready;
}
