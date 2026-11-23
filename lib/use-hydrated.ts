"use client";
import { useEffect, useState } from "react";
import { useStore } from "./store";

/** Rehydrates the persisted store on the client; avoids SSR/CSR mismatch. */
export function useHydrated() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    Promise.resolve(useStore.persist.rehydrate()).finally(() => setReady(true));
  }, []);
  return ready;
}
