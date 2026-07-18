import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const weddingService = {
  createWedding: async (data: any): Promise<any> => {
    const response = await apiService.post(API_ENDPOINTS.WEDDING.CREATE, data);
    return response.data;
  },
  getWeddings: async (params: any = {}): Promise<any> => {
    const response = await apiService.post(
      API_ENDPOINTS.WEDDING.PAGINATION,
      params,
    );
    return response.data;
  },
  updateWedding: async (id: string, data: any): Promise<any> => {
    const response = await apiService.post(API_ENDPOINTS.WEDDING.UPDATE, {
      id,
      ...data,
    });
    return response.data;
  },
  publishWedding: async (id: string): Promise<any> => {
    const response = await apiService.post(API_ENDPOINTS.WEDDING.PUBLISH, {
      id,
    });
    return response.data;
  },
  unpublishWedding: async (id: string): Promise<any> => {
    const response = await apiService.post(API_ENDPOINTS.WEDDING.UNPUBLISH, {
      id,
    });
    return response.data;
  },
  getWeddingById: async (id: string): Promise<any> => {
    const response = await apiService.post(API_ENDPOINTS.WEDDING.FIND_BY_ID, {
      id,
    });
    return response.data;
  },
  getWeddingBySlug: async (slug: string): Promise<any> => {
    const response = await apiService.get(
      `${API_ENDPOINTS.WEDDING.FIND_BY_SLUG}/${slug}`,
    );
    return response.data;
  },
  resolveMapUrl: async (url: string): Promise<any> => {
    const response = await apiService.post(API_ENDPOINTS.MAP.RESOLVE_URL, {
      url,
    });
    return response.data;
  },
};
