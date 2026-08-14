export interface InvitationHost {
  id?: string;
  role: string;
  fullName: string;
  shortName?: string;
  honorific?: string;
  photoUrl?: string;
  dob?: string;
  bio?: string;
  family?: Record<string, any>;
  extra?: Record<string, any>;
  sortOrder?: number;
}

export interface InvitationEvent {
  id?: string;
  eventKey: string;
  title: string;
  startsAt?: string;
  venue?: string;
  address?: string;
  mapsUrl?: string;
  lat?: number;
  lng?: number;
  dressCode?: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface InvitationGift {
  id?: string;
  label: string;
  bankName?: string;
  accountNumber?: string;
  accountOwner?: string;
  qrUrl?: string;
  sortOrder?: number;
}

export interface InvitationTimeline {
  id?: string;
  timeLabel?: string;
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface InvitationPhoto {
  url: string;
  storageKey?: string;
  caption?: string;
  kind?: string;
  sortOrder?: number;
}

export interface InvitationGuestGroup {
  id?: string;
  code: string;
  name: string;
  sortOrder?: number;
}

export interface InvitationMusic {
  url?: string;
  type?: string;
  autoplay?: boolean;
  name?: string;
}

export interface InvitationDto {
  id: string;
  userId?: string;
  templateId?: string;
  cardType: string;
  title: string;
  slug: string;
  status: string;
  invitationText?: string;
  thankYouText?: string;
  hashtag?: string;
  heroImageUrl?: string;
  primaryEventAt?: string;
  sectionConfig?: Record<string, boolean>;
  enabledModules?: string[];
  music?: InvitationMusic;
  extraContent?: Record<string, any>;
  customDesign?: any;
  coverConfig?: Record<string, any>;
  hosts?: InvitationHost[];
  events?: InvitationEvent[];
  gifts?: InvitationGift[];
  timelines?: InvitationTimeline[];
  photos?: InvitationPhoto[];
  guestGroups?: InvitationGuestGroup[];
  template?: {
    id?: string;
    name?: string;
    themeCode?: string;
    slug?: string;
  };
}

export interface CreateInvitationReq {
  templateId?: string;
  cardType: string;
  title: string;
  slug: string;
  invitationText?: string;
  thankYouText?: string;
  hashtag?: string;
  heroImageUrl?: string;
  sectionConfig?: Record<string, boolean>;
  enabledModules?: string[];
  music?: InvitationMusic;
  extraContent?: Record<string, any>;
  customDesign?: any;
  coverConfig?: Record<string, any>;
  hosts?: InvitationHost[];
  events?: InvitationEvent[];
  gifts?: InvitationGift[];
  timelines?: InvitationTimeline[];
  photos?: InvitationPhoto[];
}

export interface UpdateInvitationReq extends Partial<CreateInvitationReq> {
  id: string;
}

export interface FilterInvitationDto {
  userId?: string;
  templateId?: string;
  cardType?: string;
  slug?: string;
  title?: string;
  status?: string;
}
