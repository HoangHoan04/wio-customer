import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface PublicReview {
  id: string;
  authorName: string;
  content: string;
  rating: number;
  eventLabel: string;
  avatarUrl: string;
  cardType: string;
}

function normalizeList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data: unknown }).data;
    if (Array.isArray(data)) return data;
  }
  return [];
}

function toReview(item: unknown): PublicReview | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  const authorName = String(row.authorName ?? "").trim();
  const content = String(row.content ?? "").trim();
  if (!authorName || !content) return null;
  const rating = Number(row.rating);
  return {
    id: String(row.id ?? ""),
    authorName,
    content,
    rating: Number.isFinite(rating)
      ? Math.min(5, Math.max(1, Math.round(rating)))
      : 5,
    eventLabel: String(row.eventLabel ?? "").trim(),
    avatarUrl: String(row.avatarUrl ?? "").trim(),
    cardType: String(row.cardType ?? "").trim(),
  };
}

export const reviewService = {
  async listPublic(take = 6): Promise<PublicReview[]> {
    try {
      const res = await apiService.get(API_ENDPOINTS.REVIEW.PUBLIC_LIST, {
        params: { take },
      });
      return normalizeList(res.data)
        .map(toReview)
        .filter((item): item is PublicReview => item !== null);
    } catch {
      return [];
    }
  },
};

export default reviewService;
