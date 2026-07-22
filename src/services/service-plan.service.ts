import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface IServicePlan {
  id: string;
  name: string;
  maxGuests: number;
  maxPhotos: number;
  maxTemplates: number;
  hasAi: boolean;
  hasAnalytics: boolean;
  hasCustomSlug: boolean;
  durationDays: number;
  priceVnd: number;
  isActive: boolean;
}

export const servicePlanService = {
  async getActivePlans(): Promise<IServicePlan[]> {
    try {
      const res: any = await apiService.post(
        API_ENDPOINTS.SERVICE_PLAN.PUBLIC_LIST,
        {},
      );
      if (Array.isArray(res.data)) {
        return res.data;
      }
      if (Array.isArray(res.data?.data)) {
        return res.data.data;
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch active service plans:", error);
      return [];
    }
  },
};

export default servicePlanService;
