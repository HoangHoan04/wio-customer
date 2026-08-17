import type { SectionId } from "../types/preset-theme.types";

export const SECTION_LABELS: Record<SectionId, string> = {
  hero: "Ảnh đại diện",
  divider: "Trang trí",
  familyInfo: "Thông tin gia đình",
  hosts: "Chủ thể",
  intro: "Lời mời",
  ceremonies: "Lễ / Sự kiện",
  countdown: "Đếm ngược",
  gallery: "Album ảnh",
  partyInfo: "Thông tin tiệc",
  timeline: "Lịch trình",
  rsvp: "Xác nhận tham dự",
  map: "Bản đồ",
  guestbook: "Sổ lời chúc",
  giftBox: "Mừng cưới / Quà",
  dressCode: "Dress code",
  thankYou: "Lời cảm ơn",
};

export const SECTION_FLAG_MAP: Record<SectionId, string | null> = {
  hero: "showHero",
  divider: null,
  familyInfo: null,
  hosts: null,
  intro: "showIntro",
  ceremonies: null,
  countdown: "showCountdown",
  gallery: "showGallery",
  partyInfo: null,
  timeline: "showTimeline",
  rsvp: "showRsvp",
  map: "showMap",
  guestbook: "showGuestbook",
  giftBox: "showGifts",
  dressCode: "showDressCode",
  thankYou: "showThankYou",
};

export const DEFAULT_SECTION_ORDER: SectionId[] = [
  "hero",
  "divider",
  "familyInfo",
  "hosts",
  "intro",
  "ceremonies",
  "countdown",
  "gallery",
  "partyInfo",
  "timeline",
  "rsvp",
  "map",
  "guestbook",
  "giftBox",
  "dressCode",
  "thankYou",
];

export const WEDDING_SECTION_ORDER: SectionId[] = DEFAULT_SECTION_ORDER;

export const BIRTHDAY_SECTION_ORDER: SectionId[] = [
  "hero",
  "divider",
  "hosts",
  "intro",
  "countdown",
  "gallery",
  "partyInfo",
  "timeline",
  "rsvp",
  "map",
  "guestbook",
  "giftBox",
  "thankYou",
];

export const GRADUATION_SECTION_ORDER: SectionId[] = [
  "hero",
  "divider",
  "hosts",
  "intro",
  "ceremonies",
  "countdown",
  "gallery",
  "timeline",
  "rsvp",
  "map",
  "guestbook",
  "thankYou",
];

export function defaultSectionOrderForCardType(cardType?: string): SectionId[] {
  switch (cardType) {
    case "BIRTHDAY":
      return BIRTHDAY_SECTION_ORDER;
    case "GRADUATION":
      return GRADUATION_SECTION_ORDER;
    default:
      return WEDDING_SECTION_ORDER;
  }
}
