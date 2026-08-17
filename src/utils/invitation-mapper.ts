import {
  formatDate,
  formatDateISO,
  formatTime,
  formatTime2Digit,
} from "@/common/helpers";
import type {
  CreateInvitationReq,
  InvitationDto,
  InvitationEvent,
  InvitationGift,
  InvitationHost,
  InvitationMusic,
} from "@/dto/invitation.dto";
import type { HostRoleConfig } from "@/services/card-type.service";
import { cardTypeDefaults, expandHostSlots } from "@/services/card-type.service";
import { cardTypeCopy } from "@/utils/card-type-copy";

const HOST_ROLE = {
  GROOM: "GROOM",
  BRIDE: "BRIDE",
} as const;

const EVENT_KEY = {
  CEREMONY: "CEREMONY",
  CUSTOM: "CUSTOM",
} as const;

const PHOTO_KIND = {
  GALLERY: "GALLERY",
} as const;

const SECTION = {
  showHero: "showHero",
  showIntro: "showIntro",
  showGallery: "showGallery",
  showCountdown: "showCountdown",
  showMap: "showMap",
  showDressCode: "showDressCode",
  showTimeline: "showTimeline",
  showRsvp: "showRsvp",
  showGuestbook: "showGuestbook",
  showGifts: "showGifts",
  showThankYou: "showThankYou",
  guestbookStatic: "guestbookStatic",
  guestbookFloating: "guestbookFloating",
} as const;

function sectionEnabled(
  section: Record<string, unknown>,
  key: string,
  defaultValue = true,
): boolean {
  const value = section[key];
  if (typeof value === "boolean") return value;
  if (value && typeof value === "object" && "enabled" in (value as object)) {
    return (value as { enabled?: boolean }).enabled !== false;
  }
  return defaultValue;
}

function hostByRole(hosts: InvitationHost[] | undefined, role: string) {
  return (hosts || []).find((h) => h.role === role);
}

function hostsBySort(hosts: InvitationHost[] | undefined) {
  return [...(hosts || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
}

function giftAt(gifts: InvitationGift[] | undefined, index: number) {
  const sorted = [...(gifts || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  return sorted[index];
}

function normalizeTime(timeStr?: string): string {
  if (!timeStr) return "00:00";
  const match = timeStr.match(/(\d{1,2}):(\d{2})/);
  if (!match) return "00:00";
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

function parseFormDateTime(
  dateStr?: string,
  timeStr?: string,
): string | undefined {
  if (!dateStr) return undefined;
  const time = normalizeTime(timeStr);
  let date: Date;
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    date = new Date(`${dateStr.slice(0, 10)}T${time}:00`);
  } else if (/^\d{1,2}\/\d{1,2}\/\d{4}/.test(dateStr)) {
    const [d, m, y] = dateStr.split("/");
    date = new Date(
      `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}T${time}:00`,
    );
  } else {
    date = new Date(dateStr);
  }
  if (isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

function stripClientId<T extends object>(item: T, keepId: boolean): T {
  const record = item as T & { id?: string };
  if (keepId && record.id) return item;
  const { id: _id, ...rest } = record;
  return rest as T;
}

export function invitationLabel(invitation?: {
  title?: string;
  slug?: string;
  hosts?: InvitationHost[];
}): string {
  if (!invitation) return "Thiệp";
  if (invitation.title?.trim()) return invitation.title;
  const names = (invitation.hosts || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((h) => h.shortName || h.fullName)
    .filter(Boolean);
  if (names.length) return names.join(" & ");
  return invitation.slug || "Thiệp";
}

export function publicInvitationPath(slug: string): string {
  return `/thiep/${slug}`;
}

export function hasCanvasDesign(customDesign: unknown): boolean {
  if (!customDesign) return false;
  const parsed =
    typeof customDesign === "string"
      ? (() => {
          try {
            return JSON.parse(customDesign);
          } catch {
            return null;
          }
        })()
      : customDesign;
  return Array.isArray((parsed as { elements?: unknown } | null)?.elements);
}

export function buildCanvasInvitationPayload(input: {
  cardType: string;
  title: string;
  slug: string;
  templateId?: string;
  customDesign: Record<string, unknown>;
  music?: InvitationMusic;
}): CreateInvitationReq {
  const title = input.title.trim() || "Thiệp của tôi";
  return {
    cardType: input.cardType,
    title,
    slug: input.slug,
    ...(input.templateId ? { templateId: input.templateId } : {}),
    customDesign: input.customDesign,
    ...(input.music ? { music: input.music } : {}),
  };
}

function emptyPerson() {
  return {
    name: "",
    shortName: "",
    title: "",
    familyTitle: "",
    father: "",
    mother: "",
    address: "",
    photo: "",
    bankAccount: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      qrUrl: "",
    },
  };
}

function hostToPerson(
  host?: InvitationHost,
  gift?: InvitationGift,
  fallbackTitle = "",
) {
  const person = emptyPerson();
  if (!host && !gift) {
    person.title = fallbackTitle;
    return person;
  }
  person.name = host?.fullName || "";
  person.shortName = host?.shortName || "";
  person.title = host?.honorific || fallbackTitle;
  person.familyTitle = host?.family?.familyTitle || "";
  person.father = host?.family?.father || "";
  person.mother = host?.family?.mother || "";
  person.address = host?.family?.address || "";
  person.photo = host?.photoUrl || "";
  person.bankAccount = {
    bankName: gift?.bankName || "",
    accountName: gift?.accountOwner || "",
    accountNumber: gift?.accountNumber || "",
    qrUrl: gift?.qrUrl || "",
  };
  return person;
}

export function invitationToThemeData(
  invitation: InvitationDto,
  guest?: { id?: string; fullName?: string; salutation?: string },
) {
  const extra = invitation.extraContent || {};
  const section = invitation.sectionConfig || {};
  const music = invitation.music || {};
  const copy = cardTypeCopy(invitation.cardType);
  const hostRoles = cardTypeDefaults(invitation.cardType || "WEDDING").hostRoles;
  const hostSlots = expandHostSlots(hostRoles);
  const events = [...(invitation.events || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const primary =
    events.find((e) => e.isPrimary) ||
    events.find((e) => e.eventKey === EVENT_KEY.CEREMONY) ||
    events[0];
  const sortedHosts = hostsBySort(invitation.hosts);
  const primaryHost =
    hostByRole(invitation.hosts, hostSlots[0]?.role.code) || sortedHosts[0];
  const secondaryHost =
    hostSlots[1] &&
    (hostByRole(invitation.hosts, hostSlots[1].role.code) ||
      sortedHosts.find((h) => h !== primaryHost) ||
      sortedHosts[1]);
  const groom = hostByRole(invitation.hosts, HOST_ROLE.GROOM) || primaryHost;
  const bride = hostByRole(invitation.hosts, HOST_ROLE.BRIDE) || secondaryHost;
  const photos = [...(invitation.photos || [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );

  return {
    themeCode: invitation.template?.themeCode || "BOHO_FLORAL_BROWN",
    customDesign: invitation.customDesign,
    slug: invitation.slug,
    cardType: invitation.cardType,
    title: invitation.title,
    displayOrder: extra.displayOrder || "groom_first",
    groom: hostToPerson(
      groom,
      giftAt(invitation.gifts, 0),
      hostSlots[0]?.role.label || "Chú rể",
    ),
    bride: hostToPerson(
      bride,
      giftAt(invitation.gifts, 1),
      hostSlots[1]?.role.label || "Cô dâu",
    ),
    groomLabel: hostSlots[0]?.role.label || "Chú rể",
    brideLabel: hostSlots[1]?.role.label || "Cô dâu",
    rsvpCta: copy.rsvpCta,
    rsvpIntro: copy.rsvpIntro,
    giftsTitle: copy.giftsTitle,
    giftsSubtitle: copy.giftsSubtitle,
    welcomeLine: copy.welcomeLine,
    showHeroImage: sectionEnabled(section, SECTION.showHero),
    heroImageMain: invitation.heroImageUrl || "",
    showIntro: sectionEnabled(section, SECTION.showIntro),
    introText: invitation.invitationText || "",
    events: events.map((e) => ({
      id: e.id || crypto.randomUUID(),
      date: e.startsAt ? formatDate(e.startsAt) : "",
      time: e.startsAt ? formatTime(e.startsAt) : "",
      title: e.title || "",
      address: e.address || e.venue || "",
    })),
    showGallery: sectionEnabled(section, SECTION.showGallery),
    galleryLayout: extra.galleryLayout || "grid",
    gallery: photos.map((p) => p.url),
    photos: photos.map((p) => p.url),
    showParty: true,
    partyType: extra.partyType || "wedding",
    partyDate: formatDateISO(primary?.startsAt || invitation.primaryEventAt),
    partyWelcomeTime: formatTime2Digit(
      primary?.startsAt || invitation.primaryEventAt,
      "17:30",
    ),
    partyStartTime: formatTime2Digit(
      primary?.startsAt || invitation.primaryEventAt,
      "18:30",
    ),
    partyAddress: primary?.address || primary?.venue || "",
    partyMapUrl: primary?.mapsUrl || "",
    showCountdown: sectionEnabled(section, SECTION.showCountdown),
    showMap: sectionEnabled(section, SECTION.showMap),
    showDressCode: sectionEnabled(section, SECTION.showDressCode, false),
    dressCodes: extra.dressCodes || [],
    showTimeline: sectionEnabled(section, SECTION.showTimeline, false),
    timelineTitle: extra.timelineTitle || "Lịch trình",
    timeline: [...(invitation.timelines || [])]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((t) => ({
        id: t.id || crypto.randomUUID(),
        time: t.timeLabel || "",
        title: t.title || "",
      })),
    showRsvp: sectionEnabled(section, SECTION.showRsvp),
    rsvpType: extra.rsvpType || "form",
    showGuestbook: sectionEnabled(section, SECTION.showGuestbook),
    guestbookStatic: sectionEnabled(section, SECTION.guestbookStatic),
    guestbookFloating: sectionEnabled(section, SECTION.guestbookFloating, false),
    showGifts: sectionEnabled(section, SECTION.showGifts),
    showThankYou: sectionEnabled(section, SECTION.showThankYou),
    thankYouText: invitation.thankYouText || "",
    showMusic: !!music.url,
    musicUrl: music.url || "",
    musicName: music.name || "",
    mapUrl: primary?.mapsUrl || "",
    eventDetails: {
      date: primary?.startsAt || invitation.primaryEventAt,
      time: primary?.startsAt ? formatTime(primary.startsAt) : "",
      address: primary?.address || primary?.venue || "",
      venue: primary?.venue || "",
      mapUrl: primary?.mapsUrl || "",
    },
    themeLayout:
      (invitation as any).themeLayout ||
      (invitation.template as any)?.themeLayout,
    presetTokens: (invitation.template as any)?.presetTokens,
    sectionConfig: section,
    invitationId: invitation.id,
    guestId: guest?.id,
    guestName: guest?.fullName,
    salutation: guest?.salutation,
  };
}

export function invitationToCreatorForm(invitation: InvitationDto) {
  const theme = invitationToThemeData(invitation);
  const extraEvents = [...(invitation.events || [])]
    .filter((e) => !e.isPrimary && e.eventKey !== EVENT_KEY.CEREMONY)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((e) => ({
      id: e.id || crypto.randomUUID(),
      date: e.startsAt ? formatDate(e.startsAt) : "",
      time: e.startsAt ? formatTime(e.startsAt) : "",
      title: e.title || "",
      address: e.address || e.venue || "",
    }));
  return {
    slug: invitation.slug || "",
    displayOrder: theme.displayOrder,
    showHeroImage: theme.showHeroImage,
    heroImageMain: theme.heroImageMain,
    showIntro: theme.showIntro,
    introText: invitation.invitationText || "Trân trọng kính mời...",
    showGallery: theme.showGallery,
    galleryLayout: theme.galleryLayout,
    gallery: theme.gallery,
    showParty: theme.showParty,
    partyType: theme.partyType,
    partyDate: theme.partyDate,
    partyWelcomeTime: theme.partyWelcomeTime,
    partyStartTime: theme.partyStartTime,
    partyAddress: theme.partyAddress,
    partyMapUrl: theme.partyMapUrl,
    showCountdown: theme.showCountdown,
    showMap: theme.showMap,
    showDressCode: theme.showDressCode,
    dressCodes: theme.dressCodes,
    showTimeline: theme.showTimeline,
    timelineTitle: theme.timelineTitle,
    timeline: theme.timeline,
    showRsvp: theme.showRsvp,
    rsvpType: theme.rsvpType,
    showGuestbook: theme.showGuestbook,
    guestbookStatic: theme.guestbookStatic,
    guestbookFloating: theme.guestbookFloating,
    showThankYou: theme.showThankYou,
    thankYouText: invitation.thankYouText || "Chân thành cảm ơn!",
    showMusic: theme.showMusic || true,
    musicUrl: theme.musicUrl,
    musicName: theme.musicName,
    events: extraEvents,
    groom: theme.groom,
    bride: theme.bride,
  };
}

function personToHost(
  person: any,
  role: string,
  sortOrder: number,
  keepId: boolean,
): InvitationHost {
  return stripClientId(
    {
      role,
      fullName: person?.name || person?.shortName || role,
      shortName: person?.shortName || "",
      honorific: person?.title || "",
      photoUrl: person?.photo || "",
      family: {
        familyTitle: person?.familyTitle || "",
        father: person?.father || "",
        mother: person?.mother || "",
        address: person?.address || "",
      },
      sortOrder,
    },
    keepId,
  );
}

function personToGift(
  person: any,
  label: string,
  sortOrder: number,
): InvitationGift | null {
  const bank = person?.bankAccount || {};
  if (!bank.accountNumber && !bank.bankName && !bank.qrUrl) return null;
  return {
    label,
    bankName: bank.bankName || "",
    accountNumber: bank.accountNumber || "",
    accountOwner: bank.accountName || "",
    qrUrl: bank.qrUrl || "",
    sortOrder,
  };
}

export function buildInvitationPayload(
  formData: any,
  options: {
    keepIds?: boolean;
    templateId?: string;
    cardType?: string;
    customDesign?: any;
    hostRoles?: HostRoleConfig[];
    sectionOrder?: string[];
    extendedSectionConfig?: Record<
      string,
      boolean | { enabled: boolean; order?: number; variant?: string }
    >;
  } = {},
): CreateInvitationReq {
  const keepIds = !!options.keepIds;
  const cardType = options.cardType || "WEDDING";
  const hostSlots = expandHostSlots(
    options.hostRoles?.length
      ? options.hostRoles
      : cardTypeDefaults(cardType).hostRoles,
  );
  const title =
    hostSlots
      .map((slot) => {
        const person = formData[slot.key];
        return person?.shortName || person?.name || slot.role.label;
      })
      .filter(Boolean)
      .join(" & ") ||
    formData.slug ||
    "Thiệp mời";

  const gifts = hostSlots
    .map((slot, idx) =>
      personToGift(
        formData[slot.key],
        formData[slot.key]?.shortName ||
          formData[slot.key]?.name ||
          slot.role.label,
        idx,
      ),
    )
    .filter(Boolean) as InvitationGift[];

  const partyStartsAt = parseFormDateTime(
    formData.partyDate,
    formData.partyWelcomeTime || formData.partyStartTime,
  );

  const partyEvent: InvitationEvent = stripClientId(
    {
      eventKey: EVENT_KEY.CEREMONY,
      title: formData.partyType === "wedding" ? "Lễ cưới" : "Tiệc",
      startsAt: partyStartsAt,
      venue: formData.partyAddress || "",
      address: formData.partyAddress || "",
      mapsUrl: formData.partyMapUrl || "",
      isPrimary: true,
      sortOrder: 0,
    },
    keepIds,
  );

  const extraEvents: InvitationEvent[] = (formData.events || []).map(
    (e: any, idx: number) =>
      stripClientId(
        {
          id: e.id,
          eventKey: EVENT_KEY.CUSTOM,
          title: e.title || "Sự kiện",
          startsAt: parseFormDateTime(e.date, e.time),
          address: e.address || "",
          isPrimary: false,
          sortOrder: idx + 1,
        },
        keepIds,
      ),
  );

  const photos = (formData.gallery || []).map((url: string, idx: number) => ({
    url,
    kind: PHOTO_KIND.GALLERY,
    sortOrder: idx,
  }));

  const timelines = (formData.timeline || []).map((t: any, idx: number) =>
    stripClientId(
      {
        id: t.id,
        timeLabel: t.time || t.timeLabel || "",
        title: t.title || "",
        sortOrder: idx,
      },
      keepIds,
    ),
  );

  const sectionConfig =
    options.extendedSectionConfig ||
    ({
      [SECTION.showHero]: !!formData.showHeroImage,
      [SECTION.showIntro]: !!formData.showIntro,
      [SECTION.showGallery]: !!formData.showGallery,
      [SECTION.showCountdown]: !!formData.showCountdown,
      [SECTION.showMap]: !!formData.showMap,
      [SECTION.showDressCode]: !!formData.showDressCode,
      [SECTION.showTimeline]: !!formData.showTimeline,
      [SECTION.showRsvp]: !!formData.showRsvp,
      [SECTION.showGuestbook]: !!formData.showGuestbook,
      [SECTION.showGifts]: gifts.length > 0,
      [SECTION.showThankYou]: !!formData.showThankYou,
      [SECTION.guestbookStatic]: !!formData.guestbookStatic,
      [SECTION.guestbookFloating]: !!formData.guestbookFloating,
    } as Record<string, boolean | { enabled: boolean; order?: number; variant?: string }>);

  const enabledModules = [
    formData.showRsvp ? "RSVP" : null,
    formData.showGuestbook ? "GUESTBOOK" : null,
    gifts.length ? "GIFTS" : null,
    formData.showGallery ? "GALLERY" : null,
    formData.showMap ? "MAP" : null,
    formData.showCountdown ? "COUNTDOWN" : null,
    formData.musicUrl ? "MUSIC" : null,
    formData.showDressCode ? "DRESS_CODE" : null,
    formData.showTimeline ? "TIMELINE" : null,
    cardType === "WEDDING" ? "SEATING" : null,
  ].filter(Boolean) as string[];

  const hosts = hostSlots
    .map((slot, idx) => {
      const person = formData[slot.key];
      const hasName = person?.name?.trim() || person?.shortName?.trim();
      if (!hasName && !slot.role.required) return null;
      return personToHost(person, slot.role.code, idx, keepIds);
    })
    .filter(Boolean) as InvitationHost[];

  return {
    cardType,
    title,
    slug: formData.slug,
    templateId: options.templateId,
    invitationText: formData.introText,
    thankYouText: formData.thankYouText,
    heroImageUrl: formData.heroImageMain || undefined,
    sectionConfig,
    enabledModules,
    music: {
      url: formData.musicUrl || "",
      name: formData.musicName || "",
      autoplay: true,
      type: "UPLOAD",
    },
    extraContent: {
      displayOrder: formData.displayOrder,
      partyType: formData.partyType,
      galleryLayout: formData.galleryLayout,
      rsvpType: formData.rsvpType,
      timelineTitle: formData.timelineTitle,
      dressCodes: formData.dressCodes,
    },
    customDesign: options.customDesign,
    hosts,
    events: [partyEvent, ...extraEvents],
    gifts,
    timelines,
    photos,
  };
}
