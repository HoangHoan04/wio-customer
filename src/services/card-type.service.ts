import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export interface HostRoleConfig {
  code: string;
  label: string;
  required?: boolean;
  max?: number;
}

export interface GuestGroupConfig {
  code: string;
  name: string;
}

export interface ICardType {
  id?: string;
  code: string;
  nameVi: string;
  nameEn?: string;
  slug: string;
  icon?: string;
  accentColor?: string;
  sortOrder?: number;
  isActive?: boolean;
  hostRoles?: HostRoleConfig[];
  wizardSections?: string[];
  defaultModules?: string[];
  defaultGuestGroups?: GuestGroupConfig[];
}

export type HostFormSlot = "groom" | "bride";

const CORE_SECTIONS = [
  "BASIC",
  "HOSTS",
  "EVENTS",
  "GALLERY",
  "RSVP",
  "GUESTBOOK",
  "GIFTS",
  "MUSIC",
  "THANK_YOU",
];

export function cardTypeDefaults(code: string): {
  hostRoles: HostRoleConfig[];
  wizardSections: string[];
  defaultGuestGroups: GuestGroupConfig[];
} {
  switch (code) {
    case "WEDDING":
      return {
        hostRoles: [
          { code: "GROOM", label: "Chú rể", required: true, max: 1 },
          { code: "BRIDE", label: "Cô dâu", required: true, max: 1 },
        ],
        wizardSections: [...CORE_SECTIONS, "TIMELINE", "DRESS_CODE", "EXTRA"],
        defaultGuestGroups: [
          { code: "GROOM", name: "Bên chú rể" },
          { code: "BRIDE", name: "Bên cô dâu" },
          { code: "BOTH", name: "Cả hai bên" },
        ],
      };
    case "BIRTHDAY":
      return {
        hostRoles: [
          { code: "HONOREE", label: "Người được tổ chức", required: true, max: 1 },
        ],
        wizardSections: [...CORE_SECTIONS, "EXTRA"],
        defaultGuestGroups: [
          { code: "FAMILY", name: "Gia đình" },
          { code: "FRIENDS", name: "Bạn bè" },
          { code: "WORK", name: "Đồng nghiệp" },
        ],
      };
    case "GRADUATION":
      return {
        hostRoles: [
          { code: "GRADUATE", label: "Tân khoa", required: true, max: 1 },
        ],
        wizardSections: [...CORE_SECTIONS, "TIMELINE", "EXTRA"],
        defaultGuestGroups: [
          { code: "FAMILY", name: "Gia đình" },
          { code: "FRIENDS", name: "Bạn bè" },
          { code: "TEACHERS", name: "Thầy cô" },
        ],
      };
    case "BABY":
      return {
        hostRoles: [
          { code: "BABY", label: "Bé", required: true, max: 1 },
          { code: "PARENT", label: "Bố mẹ", required: false, max: 2 },
        ],
        wizardSections: [...CORE_SECTIONS, "EXTRA"],
        defaultGuestGroups: [
          { code: "PATERNAL", name: "Bên nội" },
          { code: "MATERNAL", name: "Bên ngoại" },
          { code: "FRIENDS", name: "Bạn bè" },
        ],
      };
    case "HOUSEWARMING":
      return {
        hostRoles: [{ code: "HOST", label: "Gia chủ", required: true, max: 2 }],
        wizardSections: CORE_SECTIONS,
        defaultGuestGroups: [
          { code: "FAMILY", name: "Gia đình" },
          { code: "FRIENDS", name: "Bạn bè" },
          { code: "WORK", name: "Đồng nghiệp" },
        ],
      };
    case "ANNIVERSARY":
      return {
        hostRoles: [{ code: "HOST", label: "Chủ thiệp", required: true, max: 2 }],
        wizardSections: [...CORE_SECTIONS, "EXTRA"],
        defaultGuestGroups: [
          { code: "FAMILY", name: "Gia đình" },
          { code: "FRIENDS", name: "Bạn bè" },
        ],
      };
    default:
      return {
        hostRoles: [{ code: "HOST", label: "Chủ thiệp", required: true, max: 2 }],
        wizardSections: CORE_SECTIONS,
        defaultGuestGroups: [
          { code: "FAMILY", name: "Gia đình" },
          { code: "FRIENDS", name: "Bạn bè" },
        ],
      };
  }
}

export function expandHostSlots(hostRoles: HostRoleConfig[]): Array<{
  key: HostFormSlot;
  role: HostRoleConfig;
}> {
  const slots: Array<{ key: HostFormSlot; role: HostRoleConfig }> = [];
  for (const role of hostRoles) {
    const remaining = 2 - slots.length;
    const count = Math.min(Math.max(role.max ?? 1, 1), remaining);
    for (let i = 0; i < count; i += 1) {
      slots.push({
        key: slots.length === 0 ? "groom" : "bride",
        role,
      });
    }
    if (slots.length >= 2) break;
  }
  if (!slots.length) {
    slots.push({
      key: "groom",
      role: { code: "HOST", label: "Chủ thiệp", required: true, max: 1 },
    });
  }
  return slots;
}

export function cardTypeLabel(code?: string) {
  if (!code) return "Thiệp";
  return FALLBACK_CARD_TYPES.find((item) => item.code === code)?.nameVi || code;
}

export function inferCardType(input?: {
  cardType?: string;
  themeCode?: string;
  slug?: string;
  template?: { cardTypes?: any[]; cardType?: string; themeCode?: string; slug?: string } | null;
}): string {
  if (input?.cardType && input.cardType !== "all") {
    const code = input.cardType.toUpperCase();
    if (FALLBACK_CARD_TYPES.some((c) => c.code === code)) return code;
    const bySlug = FALLBACK_CARD_TYPES.find((c) => c.slug === input.cardType);
    if (bySlug) return bySlug.code;
  }

  const tpl = input?.template;
  if (tpl) {
    if (Array.isArray(tpl.cardTypes) && tpl.cardTypes.length > 0 && tpl.cardTypes[0]?.code) {
      return tpl.cardTypes[0].code;
    }
    if (tpl.cardType) return tpl.cardType;
  }

  const str = `${input?.themeCode || ""} ${input?.slug || ""} ${tpl?.themeCode || ""} ${tpl?.slug || ""}`.toLowerCase();
  if (str.includes("birthday") || str.includes("sinh-nhat") || str.includes("sinh_nhat") || str.includes("sinhnhat")) {
    return "BIRTHDAY";
  }
  if (str.includes("baby") || str.includes("thoi-noi") || str.includes("day-thang")) {
    return "BABY";
  }
  if (str.includes("graduation") || str.includes("tot-nghiep")) {
    return "GRADUATION";
  }
  if (str.includes("housewarming") || str.includes("tan-gia")) {
    return "HOUSEWARMING";
  }
  if (str.includes("anniversary") || str.includes("ky-niem")) {
    return "ANNIVERSARY";
  }

  return "WEDDING";
}

export const FALLBACK_CARD_TYPES: ICardType[] = [
  {
    code: "WEDDING",
    nameVi: "Thiệp cưới",
    slug: "cuoi",
    icon: "Heart",
    accentColor: "#8B2942",
    sortOrder: 1,
  },
  {
    code: "BIRTHDAY",
    nameVi: "Thiệp sinh nhật",
    slug: "sinh-nhat",
    icon: "Cake",
    accentColor: "#E25C3A",
    sortOrder: 2,
  },
  {
    code: "GRADUATION",
    nameVi: "Thiệp tốt nghiệp",
    slug: "tot-nghiep",
    icon: "GraduationCap",
    accentColor: "#1E3A5F",
    sortOrder: 3,
  },
  {
    code: "BABY",
    nameVi: "Thôi nôi / đầy tháng",
    slug: "thoi-noi",
    icon: "Baby",
    accentColor: "#D4A0A7",
    sortOrder: 4,
  },
  {
    code: "HOUSEWARMING",
    nameVi: "Thiệp tân gia",
    slug: "tan-gia",
    icon: "Home",
    accentColor: "#C45C26",
    sortOrder: 5,
  },
  {
    code: "ANNIVERSARY",
    nameVi: "Thiệp kỷ niệm",
    slug: "ky-niem",
    icon: "Sparkles",
    accentColor: "#B8860B",
    sortOrder: 6,
  },
  {
    code: "CUSTOM",
    nameVi: "Sự kiện khác",
    slug: "su-kien",
    icon: "Mail",
    accentColor: "#C45C26",
    sortOrder: 7,
  },
];

function normalizeList(payload: unknown): ICardType[] {
  if (Array.isArray(payload)) return payload as ICardType[];
  if (payload && typeof payload === "object" && "data" in payload) {
    const data = (payload as { data: unknown }).data;
    if (Array.isArray(data)) return data as ICardType[];
  }
  return [];
}

export const cardTypeService = {
  async listActive(): Promise<ICardType[]> {
    try {
      const res = await apiService.get(API_ENDPOINTS.CARD_TYPE.PUBLIC_LIST);
      const list = normalizeList(res.data).filter(
        (item) => item.isActive !== false,
      );
      const merged = (list.length ? list : FALLBACK_CARD_TYPES).map((item) => {
        const defaults = cardTypeDefaults(item.code);
        return {
          ...item,
          hostRoles: item.hostRoles?.length ? item.hostRoles : defaults.hostRoles,
          wizardSections: item.wizardSections?.length
            ? item.wizardSections
            : defaults.wizardSections,
          defaultGuestGroups: item.defaultGuestGroups?.length
            ? item.defaultGuestGroups
            : defaults.defaultGuestGroups,
        };
      });
      return [...merged].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    } catch {
      return FALLBACK_CARD_TYPES.map((item) => ({
        ...item,
        ...cardTypeDefaults(item.code),
      }));
    }
  },
};
