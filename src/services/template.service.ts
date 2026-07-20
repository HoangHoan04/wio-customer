import { PaginationRes } from "@/dto";
import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface ITemplate {
  id: string;
  name: string;
  description: string;
  slug: string;
  themeCode: string;
  thumbnailUrl: string;
  isShow: boolean;
  isPremium: boolean;
  minPlan: string;
  trialDays: number;
  tags?: string[];
  features?: any;
  viewCount?: number;
  previewCount?: number;
}

export const templateService = {
  getTemplates: async (params: any = {}): Promise<PaginationRes<ITemplate>> => {
    const response = await apiService.post(
      API_ENDPOINTS.TEMPLATE.PAGINATION,
      params,
    );
    return response.data;
  },
};
