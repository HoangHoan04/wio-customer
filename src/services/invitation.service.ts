import type {
  CreateInvitationReq,
  FilterInvitationDto,
  InvitationDto,
  UpdateInvitationReq,
} from "@/dto/invitation.dto";
import type { PaginationReq, PaginationRes } from "@/dto";
import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const invitationService = {
  pagination: async (
    params: PaginationReq<FilterInvitationDto> = { skip: 0, take: 50 },
  ): Promise<PaginationRes<InvitationDto>> => {
    const response = await apiService.post(
      API_ENDPOINTS.INVITATION.PAGINATION,
      params,
    );
    return response.data;
  },

  findById: async (id: string): Promise<{ data: InvitationDto }> => {
    const response = await apiService.post(API_ENDPOINTS.INVITATION.FIND_BY_ID, {
      id,
    });
    return response.data;
  },

  findBySlug: async (slug: string): Promise<{ data: InvitationDto }> => {
    const response = await apiService.get(
      `${API_ENDPOINTS.INVITATION.FIND_BY_SLUG}/${slug}`,
    );
    return response.data;
  },

  create: async (
    data: CreateInvitationReq,
  ): Promise<{ data: InvitationDto }> => {
    const response = await apiService.post(
      API_ENDPOINTS.INVITATION.CREATE,
      data,
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateInvitationReq>,
  ): Promise<{ data: InvitationDto }> => {
    const response = await apiService.post(API_ENDPOINTS.INVITATION.UPDATE, {
      id,
      ...data,
    });
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await apiService.post(API_ENDPOINTS.INVITATION.DELETE, {
      id,
    });
    return response.data;
  },

  publish: async (id: string): Promise<{ data: InvitationDto }> => {
    const response = await apiService.post(API_ENDPOINTS.INVITATION.PUBLISH, {
      id,
    });
    return response.data;
  },

  unpublish: async (id: string): Promise<{ data: InvitationDto }> => {
    const response = await apiService.post(API_ENDPOINTS.INVITATION.UNPUBLISH, {
      id,
    });
    return response.data;
  },

  archive: async (id: string): Promise<{ data: InvitationDto }> => {
    const response = await apiService.post(API_ENDPOINTS.INVITATION.ARCHIVE, {
      id,
    });
    return response.data;
  },

  checkSlug: async (
    slug: string,
  ): Promise<{ data?: { available?: boolean } }> => {
    const response = await apiService.post(
      API_ENDPOINTS.INVITATION.CHECK_SLUG,
      { slug },
    );
    return response.data;
  },

  resolveMapUrl: async (url: string): Promise<{ data?: { url?: string } }> => {
    const response = await apiService.post(API_ENDPOINTS.MAP.RESOLVE_URL, {
      url,
    });
    return response.data;
  },
};

export default invitationService;
