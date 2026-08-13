import type { EditorElement, EditorTool } from "../types";

export type LayerItem =
  | { kind: "single"; id: string; el: EditorElement }
  | { kind: "group"; id: string; groupId: string; members: EditorElement[] };

export function toolForElement(el: EditorElement): EditorTool {
  switch (el.type) {
    case "text":
      return "text";
    case "shape":
      return "shape";
    case "image":
      if (
        el.src?.includes("/stickers/") ||
        el.src?.includes("/stock") ||
        el.src?.includes("stock-asset")
      ) {
        return "stock";
      }
      return "uploads";
    case "widget":
      return el.widgetType === "music" ? "music" : "utility";
    default:
      return "property";
  }
}

export function buildLayerItems(elements: EditorElement[]): LayerItem[] {
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);
  const seenGroups = new Set<string>();
  const result: LayerItem[] = [];

  for (const el of sorted) {
    if (el.groupId) {
      if (seenGroups.has(el.groupId)) continue;
      seenGroups.add(el.groupId);
      const members = sorted.filter((item) => item.groupId === el.groupId);
      result.push({
        kind: "group",
        id: el.groupId,
        groupId: el.groupId,
        members,
      });
    } else {
      result.push({ kind: "single", id: el.id, el });
    }
  }

  return result;
}

function idsOf(item: LayerItem): string[] {
  return item.kind === "single" ? [item.el.id] : item.members.map((el) => el.id);
}

function assignZFromItems(
  items: LayerItem[],
  elements: EditorElement[],
): EditorElement[] {
  const bottomFirst = [...items].reverse();
  const order = bottomFirst.flatMap(idsOf);
  const zMap = new Map(order.map((id, index) => [id, index]));
  return elements.map((el) => ({
    ...el,
    zIndex: zMap.get(el.id) ?? el.zIndex,
  }));
}

export function moveLayerItem(
  elements: EditorElement[],
  itemId: string,
  direction: "up" | "down",
): EditorElement[] {
  const items = buildLayerItems(elements);
  const index = items.findIndex((item) => item.id === itemId);
  if (index === -1) return elements;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return elements;
  const next = [...items];
  [next[index], next[swapWith]] = [next[swapWith], next[index]];
  return assignZFromItems(next, elements);
}

export function moveElementInStack(
  elements: EditorElement[],
  elementId: string,
  direction: "up" | "down" | "front" | "back",
): EditorElement[] {
  const el = elements.find((item) => item.id === elementId);
  if (!el) return elements;
  const itemId = el.groupId ?? el.id;
  const items = buildLayerItems(elements);
  const index = items.findIndex((item) => item.id === itemId);
  if (index === -1) return elements;

  if (direction === "front") {
    if (index === 0) return elements;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.unshift(moved);
    return assignZFromItems(next, elements);
  }
  if (direction === "back") {
    if (index === items.length - 1) return elements;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.push(moved);
    return assignZFromItems(next, elements);
  }
  return moveLayerItem(elements, itemId, direction);
}

export function patchElements(
  elements: EditorElement[],
  ids: string[],
  patch: Partial<EditorElement>,
): EditorElement[] {
  const idSet = new Set(ids);
  return elements.map((el) => (idSet.has(el.id) ? { ...el, ...patch } : el));
}

export function removeElements(
  elements: EditorElement[],
  ids: string[],
): EditorElement[] {
  const idSet = new Set(ids);
  return elements.filter((el) => !idSet.has(el.id));
}

export function layerItemIds(item: LayerItem): string[] {
  return idsOf(item);
}

export type StackBand =
  | { kind: "konva"; id: string; elements: EditorElement[] }
  | { kind: "widget"; id: string; element: EditorElement };

export function buildStackBands(elements: EditorElement[]): StackBand[] {
  const sorted = [...elements]
    .filter((el) => el.visible !== false)
    .sort((a, b) => a.zIndex - b.zIndex || a.id.localeCompare(b.id));

  const bands: StackBand[] = [];
  for (const el of sorted) {
    if (el.type === "widget") {
      bands.push({ kind: "widget", id: el.id, element: el });
      continue;
    }
    const last = bands[bands.length - 1];
    if (last?.kind === "konva") {
      last.elements.push(el);
    } else {
      bands.push({ kind: "konva", id: `konva-${el.id}`, elements: [el] });
    }
  }
  return bands;
}
