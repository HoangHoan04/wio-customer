export interface GuestDto {
  id: string;
  weddingId: string;
  tableId?: string;
  fullName: string;
  phone?: string;
  email?: string;
  salutation?: string;
  side: string;
  isVip: boolean;
  invitationCode: string;
  qrCodeUrl?: string;
  rsvpStatus: string;
  attendingCount: number;
  needsTransport: boolean;
  rsvpNote?: string;
  rsvpAt?: string;
  invitedAt?: string;
  invitationViewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterGuestDto {
  weddingId?: string;
  tableId?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  salutation?: string;
  side?: string;
  isVip?: boolean;
  invitationCode?: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  rsvpNote?: string;
}

export interface CreateGuestReq {
  weddingId: string;
  tableId?: string;
  fullName: string;
  phone?: string;
  email?: string;
  salutation?: string;
  side?: string;
  isVip?: boolean;
  invitationCode?: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  rsvpNote?: string;
}

export interface UpdateGuestReq extends Partial<CreateGuestReq> {
  id: string;
}

export interface RsvpReq {
  invitationCode: string;
  rsvpStatus?: string;
  attendingCount?: number;
  needsTransport?: boolean;
  rsvpNote?: string;
}

export interface IdentifyReq {
  invitationCode: string;
}

export interface GuestStatsRes {
  total: number;
  attending: number;
  declined: number;
  pending: number;
  attendingGuests: number;
  needsTransport: number;
}
