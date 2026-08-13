import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface PublicStockAsset {
  id: string;
  title: string;
  category: string;
  tags: string[];
  src: string;
  thumb: string;
  kind: string;
  license: string;
}

function normalizeList(payload: unknown): { items: unknown[]; total: number } {
  if (payload && typeof payload === "object") {
    const row = payload as { data?: unknown; total?: number };
    if (Array.isArray(row.data)) {
      return { items: row.data, total: Number(row.total) || row.data.length };
    }
  }
  if (Array.isArray(payload)) return { items: payload, total: payload.length };
  return { items: [], total: 0 };
}

function toAsset(item: unknown): PublicStockAsset | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  const src = String(row.src ?? "").trim();
  if (!src) return null;
  const tags = Array.isArray(row.tags)
    ? row.tags.map((tag) => String(tag))
    : [];
  return {
    id: String(row.id ?? src),
    title: String(row.title ?? "").trim() || "Sticker",
    category: String(row.category ?? "").trim(),
    tags,
    src,
    thumb: String(row.thumb ?? src).trim() || src,
    kind: String(row.kind ?? "sticker"),
    license: String(row.license ?? "").trim(),
  };
}

export const stockAssetService = {
  async listPublic(params: {
    q?: string;
    category?: string;
    kind?: string;
    skip?: number;
    take?: number;
  } = {}): Promise<{ items: PublicStockAsset[]; total: number }> {
    try {
      const res = await apiService.get(API_ENDPOINTS.STOCK_ASSET.PUBLIC_LIST, {
        params,
      });
      const { items, total } = normalizeList(res.data);
      return {
        items: items
          .map(toAsset)
          .filter((item): item is PublicStockAsset => item !== null),
        total,
      };
    } catch {
      return { items: [], total: 0 };
    }
  },
};

export default stockAssetService;
