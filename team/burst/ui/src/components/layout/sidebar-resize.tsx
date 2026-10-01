// SymNexus Team: drag handle that resizes the sidebar. Keyboard: focus the
// handle and use the arrow keys; Home or double-click resets to the default.

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { SIDEBAR_DEFAULT_WIDTH, SIDEBAR_MAX_WIDTH, SIDEBAR_MIN_WIDTH } from "./use-sidebar-width";

const KEY_STEP = 16;

export function SidebarResizeHandle({ width, onResize }: { width: number; onResize: (width: number, persist: boolean) => void }) {
  const drag = useRef<{ startX: number; startWidth: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  // While dragging, keep the resize cursor everywhere and stop text selection.
  useEffect(() => {
    if (!dragging) return;
    const { cursor, userSelect } = document.body.style;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.cursor = cursor;
      document.body.style.userSelect = userSelect;
    };
  }, [dragging]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startWidth: width };
    setDragging(true);
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    onResize(drag.current.startWidth + (e.clientX - drag.current.startX), false);
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    onResize(drag.current.startWidth + (e.clientX - drag.current.startX), true);
    drag.current = null;
    setDragging(false);
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const next =
      e.key === "ArrowLeft" ? width - KEY_STEP :
      e.key === "ArrowRight" ? width + KEY_STEP :
      e.key === "Home" ? SIDEBAR_DEFAULT_WIDTH :
      null;
    if (next === null) return;
    e.preventDefault();
    onResize(next, true);
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={width}
      aria-valuemin={SIDEBAR_MIN_WIDTH}
      aria-valuemax={SIDEBAR_MAX_WIDTH}
      tabIndex={0}
      title="Drag to resize. Double-click to reset."
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => onResize(SIDEBAR_DEFAULT_WIDTH, true)}
      onKeyDown={onKeyDown}
      className="group absolute inset-y-0 -right-1.5 z-20 w-3 cursor-col-resize touch-none outline-none"
    >
      {/* The visible line: shows on hover, focus and while dragging. */}
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 transition-colors ${
          dragging ? "bg-teal-600" : "bg-transparent group-hover:bg-teal-600/60 group-focus-visible:bg-teal-600"
        }`}
      />
    </div>
  );
}
