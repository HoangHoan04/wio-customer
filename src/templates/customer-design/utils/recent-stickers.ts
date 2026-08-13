const RECENT_KEY = "invigo-recent-stickers";
const RECENT_MAX = 24;

export interface RecentSticker {
  id: string;
  url: string;
  title: string;
}

export function readRecentStickers(): RecentSticker[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item): item is RecentSticker =>
          !!item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.url === "string",
      )
      .slice(0, RECENT_MAX);
  } catch {
    return [];
  }
}

export function rememberRecentSticker(item: RecentSticker): RecentSticker[] {
  const next = [
    item,
    ...readRecentStickers().filter((row) => row.id !== item.id),
  ].slice(0, RECENT_MAX);
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    //! quota / private mode */
  }
  return next;
}
