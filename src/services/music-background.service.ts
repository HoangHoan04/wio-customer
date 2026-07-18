import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const musicBackgroundService = {
  getMusics: async (query?: any) => {
    const response = await apiService.post(
      API_ENDPOINTS.MUSIC_BACKGROUND.FIND_ALL_ACTIVATE,
      query,
    );
    return response.data;
  },

  importYoutube: async (youtubeUrl: string) => {
    const response = await apiService.post(
      API_ENDPOINTS.MUSIC_BACKGROUND.IMPORT_YOUTUBE,
      { youtubeUrl },
    );
    return response.data;
  },

  incrementUsage: async (id: string) => {
    const response = await apiService.post(
      API_ENDPOINTS.MUSIC_BACKGROUND.INCREMENT_USAGE,
      { id },
    );
    return response.data;
  },
};
