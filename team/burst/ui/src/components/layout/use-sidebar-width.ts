// SymNexus Team: sidebar width state for drag-to-resize, remembered per browser.

import { useCallback, useEffect, useState } from "react";

export const SIDEBAR_DEFAULT_WIDTH = 256;
export const SIDEBAR_MIN_WIDTH = 200;
export const SIDEBAR_MAX_WIDTH = 480;
const STORAGE_KEY = "symnexus-sidebar-width";


function clamp(width: number): number {
  // Never let the sidebar take more than half the window.
  const max = Math.min(SIDEBAR_MAX_WIDTH, Math.floor(window.innerWidth / 2));
  return Math.round(Math.min(Math.max(width, SIDEBAR_MIN_WIDTH), Math.max(max, SIDEBAR_MIN_WIDTH)));
}

function readStored(): number {
  try {
    const n = Number(localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(n) && n > 0 ? clamp(n) : SIDEBAR_DEFAULT_WIDTH;
  } catch {
    return SIDEBAR_DEFAULT_WIDTH;
  }
}

function store(width: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // Private mode or storage disabled: the width just isn't remembered.
  }
}

export function useSidebarWidth() {
  const [width, setWidth] = useState(readStored);

  // Keep the sidebar within bounds if the window shrinks.
  useEffect(() => {
    const onResize = () => setWidth((w) => clamp(w));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const update = useCallback((next: number, persist: boolean) => {
    const w = clamp(next);
    setWidth(w);
    if (persist) store(w);
  }, []);

  return { width, update };
}
