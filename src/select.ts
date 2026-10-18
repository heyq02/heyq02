export interface Selection {
  index: number | null;
}

export type SelectionEvent = "up" | "down" | "enter" | "quit";

export type SelectionEffect =
  | { type: "select"; index: number | null }
  | { type: "exit" }
  | { type: "open"; index: number };

export function applySelection(
  selection: Selection,
  event: SelectionEvent,
  count: number,
): SelectionEffect {
  if (event === "quit") {
    return { type: "exit" };
  }

  if (event === "enter") {
    return selection.index === null ? { type: "exit" } : { type: "open", index: selection.index };
  }

  if (count <= 0) {
    return { type: "select", index: null };
  }

  if (selection.index === null) {
    return { type: "select", index: event === "up" ? count - 1 : 0 };
  }

  const delta = event === "up" ? -1 : 1;
  return { type: "select", index: (selection.index + delta + count) % count };
}
