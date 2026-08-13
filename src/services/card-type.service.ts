import apiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

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
      return list.length
        ? [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        : FALLBACK_CARD_TYPES;
    } catch {
      return FALLBACK_CARD_TYPES;
    }
  },
};
