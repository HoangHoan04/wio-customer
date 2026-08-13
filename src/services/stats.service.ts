import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface PublicOverviewStats {
  publishedInvitations: number;
  templates: number;
  guests: number;
}

function toCount(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export const statsService = {
  getPublicOverview: async (): Promise<PublicOverviewStats> => {
    const response = await apiService.get(API_ENDPOINTS.ANALYTICS.PUBLIC_OVERVIEW);
    const payload = response.data?.data ?? response.data ?? {};
    return {
      publishedInvitations: toCount(payload.publishedInvitations),
      templates: toCount(payload.templates),
      guests: toCount(payload.guests),
    };
  },
};

export default statsService;
