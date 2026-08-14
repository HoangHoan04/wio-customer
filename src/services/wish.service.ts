import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface Wish {
  id: string;
  invitationId: string;
  guestId?: string;
  guestName: string;
  content: string;
  isApproved: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWishPayload {
  invitationId: string;
  guestId?: string;
  guestName: string;
  content: string;
}

export interface PaginationRes<T> {
  data: T[];
  total: number;
}

export const wishService = {
  getByInvitation: async (
    invitationId: string,
    options?: { take?: number; isApproved?: boolean },
  ): Promise<PaginationRes<Wish>> => {
    const isPublicApproved = options?.isApproved === true;
    const res = await apiService.post(
      isPublicApproved
        ? API_ENDPOINTS.WISH.PUBLIC_LIST
        : API_ENDPOINTS.WISH.PAGINATION,
      {
        where: {
          invitationId,
          isApproved: options?.isApproved ?? undefined,
        },
        skip: 0,
        take: options?.take ?? 1000,
      },
    );
    return res.data;
  },

  create: async (payload: CreateWishPayload): Promise<{ data: Wish }> => {
    const res = await apiService.post(
      API_ENDPOINTS.WISH.PUBLIC_CREATE,
      payload,
    );
    return res.data;
  },

  approve: async (id: string): Promise<void> => {
    await apiService.post(API_ENDPOINTS.WISH.APPROVE, { id });
  },

  reject: async (id: string): Promise<void> => {
    await apiService.post(API_ENDPOINTS.WISH.REJECT, { id });
  },

  pin: async (id: string): Promise<void> => {
    await apiService.post(API_ENDPOINTS.WISH.PIN, { id });
  },

  unpin: async (id: string): Promise<void> => {
    await apiService.post(API_ENDPOINTS.WISH.UNPIN, { id });
  },

  delete: async (id: string): Promise<void> => {
    await apiService.post(API_ENDPOINTS.WISH.DELETE, { id });
  },
};
