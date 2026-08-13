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
import type { InvitationDto } from "@/dto/invitation.dto";
import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

function toGuestPayload(data: CreateGuestReq | UpdateGuestReq) {
  const { side, groupCode, ...rest } = data as CreateGuestReq & {
    side?: string;
  };
  return {
    ...rest,
    groupCode: groupCode || side,
  };
}

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
      toGuestPayload(data),
    );
    return response.data;
  },

  updateGuest: async (data: UpdateGuestReq): Promise<{ data: GuestDto }> => {
    const response = await apiService.post<{ data: GuestDto }>(
      API_ENDPOINTS.GUEST.UPDATE,
      toGuestPayload(data),
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
    invitationId: string,
    file: File,
  ): Promise<{ message: string; data: GuestDto[] }> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("invitationId", invitationId);
    const response = await apiService.post<{
      message: string;
      data: GuestDto[];
    }>(API_ENDPOINTS.GUEST.IMPORT_EXCEL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  createMany: async (
    invitationId: string,
    guests: CreateGuestReq[],
  ): Promise<{ message: string; data: GuestDto[] }> => {
    const response = await apiService.post<{
      message: string;
      data: GuestDto[];
    }>(API_ENDPOINTS.GUEST.CREATE_MANY, {
      invitationId,
      guests: guests.map((g) => ({
        ...toGuestPayload(g),
        invitationId,
      })),
    });
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

  identify: async (
    invitationCode: string,
  ): Promise<{ data: { guest: GuestDto; invitation: InvitationDto } }> => {
    const response = await apiService.post<{
      data: { guest: GuestDto; invitation: InvitationDto };
    }>(API_ENDPOINTS.GUEST.PUBLIC_IDENTIFY, { invitationCode });
    return response.data;
  },

  rsvp: async (data: RsvpReq): Promise<{ message: string; data: GuestDto }> => {
    const response = await apiService.post<{ message: string; data: GuestDto }>(
      API_ENDPOINTS.GUEST.PUBLIC_RSVP,
      data,
    );
    return response.data;
  },

  getStats: async (invitationId: string): Promise<{ data: GuestStatsRes }> => {
    const response = await apiService.post<PaginationRes<GuestDto>>(
      API_ENDPOINTS.GUEST.PAGINATION,
      { skip: 0, take: 1000, where: { invitationId } },
    );
    const guests = response.data?.data || [];
    const attending = guests.filter((g) => g.rsvpStatus === "ATTENDING");
    return {
      data: {
        total: guests.length,
        attending: attending.length,
        declined: guests.filter((g) => g.rsvpStatus === "DECLINED").length,
        pending: guests.filter((g) => g.rsvpStatus === "PENDING").length,
        attendingGuests: attending.reduce(
          (sum, g) => sum + (g.attendingCount || 1),
          0,
        ),
        needsTransport: guests.filter((g) => g.needsTransport).length,
      },
    };
  },
};

export default guestService;
