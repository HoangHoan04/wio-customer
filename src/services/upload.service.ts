import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface UploadResponse {
  id: string;
  fileUrl: string;
  fileName: string;
  fileCode?: string;
  fileType?: string;
  fileSize?: number;
  extension?: string;
}

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiService.post<UploadResponse>(
      API_ENDPOINTS.UPLOAD_FILE.IMAGE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  uploadAudio: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiService.post<UploadResponse>(
      API_ENDPOINTS.UPLOAD_FILE.AUDIO,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      },
    );
    return response.data;
  },
};
