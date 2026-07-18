import type {
  CreateGuestReq,
  FilterGuestDto,
  GuestDto,
  GuestStatsRes,
  PaginationReq,
  PaginationRes,
  RsvpReq,
  UpdateGuestReq,
} from "@/dto";
import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const guestService = {
  getGuests: async (
    params: PaginationReq<FilterGuestDto>,
  ): Promise<PaginationRes<GuestDto>> => {
    const response = await apiService.post<PaginationRes<GuestDto>>(
      API_ENDPOINTS.GUEST.PAGINATION,
      params,
    );
    return response.data;
  },

  getGuestById: async (id: string): Promise<{ data: GuestDto }> => {
    const response = await apiService.post<{ data: GuestDto }>(
      API_ENDPOINTS.GUEST.FIND_BY_ID,
      { id },
    );
    return response.data;
  },

  createGuest: async (data: CreateGuestReq): Promise<{ data: GuestDto }> => {
    const response = await apiService.post<{ data: GuestDto }>(
      API_ENDPOINTS.GUEST.CREATE,
      data,
    );
    return response.data;
  },

  updateGuest: async (data: UpdateGuestReq): Promise<{ data: GuestDto }> => {
    const response = await apiService.post<{ data: GuestDto }>(
      API_ENDPOINTS.GUEST.UPDATE,
      data,
    );
    return response.data;
  },

  deleteGuest: async (id: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.GUEST.DELETE,
      { id },
    );
    return response.data;
  },

  generateQr: async (id: string): Promise<{ qrCodeUrl: string }> => {
    const response = await apiService.post<{ qrCodeUrl: string }>(
      API_ENDPOINTS.GUEST.GENERATE_QR,
      { id },
    );
    return response.data;
  },

  importExcel: async (
    weddingId: string,
    file: File,
  ): Promise<{ message: string; data: GuestDto[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("weddingId", weddingId);
    const response = await apiService.post<{ message: string; data: GuestDto[] }>(
      API_ENDPOINTS.GUEST.IMPORT_EXCEL,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  createMany: async (
    weddingId: string,
    guests: CreateGuestReq[],
  ): Promise<{ message: string; data: GuestDto[] }> => {
    const response = await apiService.post<{ message: string; data: GuestDto[] }>(
      API_ENDPOINTS.GUEST.CREATE_MANY,
      { weddingId, guests },
    );
    return response.data;
  },

  downloadSampleExcel: async (): Promise<Blob> => {
    const response = await apiService.post<Blob>(
      API_ENDPOINTS.GUEST.DOWNLOAD_SAMPLE_EXCEL,
      {},
      { responseType: "blob" },
    );
    return response.data;
  },

  identify: async (invitationCode: string): Promise<{ data: { guest: GuestDto; wedding: any } }> => {
    const response = await apiService.post<{ data: { guest: GuestDto; wedding: any } }>(
      API_ENDPOINTS.GUEST.PUBLIC_IDENTIFY,
      { invitationCode },
    );
    return response.data;
  },

  rsvp: async (data: RsvpReq): Promise<{ message: string; data: GuestDto }> => {
    const response = await apiService.post<{ message: string; data: GuestDto }>(
      API_ENDPOINTS.GUEST.PUBLIC_RSVP,
      data,
    );
    return response.data;
  },

  getStats: async (weddingId: string): Promise<{ data: GuestStatsRes }> => {
    const response = await apiService.post<{ data: GuestStatsRes }>(
      API_ENDPOINTS.GUEST.PAGINATION,
      { weddingId },
    );
    return response.data;
  },
};

export default guestService;
