export interface SideOption {
  code: string;
  name: string;
  color: string;
}

export interface WeddingStatusOption {
  code: string;
  name: string;
  color: string;
}

export interface ThemeCodeOption {
  code: string;
  name: string;
  slug: string;
}

export interface RsvpStatusOption {
  code: string;
  name: string;
  color: string;
}

export const enumData: {
  THEME_CODE: Record<string, ThemeCodeOption>;
  WEDDING_STATUS: Record<string, WeddingStatusOption>;
  SIDE_OPTIONS: Record<string, SideOption>;
  RSVP_STATUS: Record<string, RsvpStatusOption>;
} = {
  THEME_CODE: {
    BOHO_FLORAL_BROWN: {
      code: "BOHO_FLORAL_BROWN",
      name: "Hoa cỏ - Nâu",
      slug: "hoa-moc-lan-nau",
    },
    BOHO_FLORAL_GREEN: {
      code: "BOHO_FLORAL_GREEN",
      name: "Hoa cỏ - Xanh",
      slug: "hoa-moc-lan-xanh",
    },
    BOHO_FLORAL_PINK: {
      code: "BOHO_FLORAL_PINK",
      name: "Hoa cỏ - Hồng",
      slug: "hoa-moc-lan-hong",
    },
    DRAGON_PHOENIX_RED: {
      code: "DRAGON_PHOENIX_RED",
      name: "Long phụng - Đỏ",
      slug: "long-phung-do",
    },
    RED_DOUBLE_HAPPINESS: {
      code: "RED_DOUBLE_HAPPINESS",
      name: "Song hỷ - Đỏ truyền thống",
      slug: "song-hy-do-truyen-thong",
    },
    ROYAL_RED: {
      code: "ROYAL_RED",
      name: "Hoàng gia - Đỏ nhung",
      slug: "hoang-gia-do-nhung",
    },
    CUSTOM_DESIGN: {
      code: "CUSTOM_DESIGN",
      name: "Tự Thiết Kế",
      slug: "tu-thiet-ke",
    },
  },

  WEDDING_STATUS: {
    DRAFT: {
      code: "DRAFT",
      name: "Nháp",
      color: "#9CA3AF",
    },
    PUBLISHED: {
      code: "PUBLISHED",
      name: "Đã xuất bản",
      color: "#10B981",
    },
    ARCHIVED: {
      code: "ARCHIVED",
      name: "Đã lưu trữ",
      color: "#EF4444",
    },
  },

  SIDE_OPTIONS: {
    GROOM: {
      code: "GROOM",
      name: "Bên chú rể",
      color: "#3B82F6",
    },
    BRIDE: {
      code: "BRIDE",
      name: "Bên cô dâu",
      color: "#EC4899",
    },
    BOTH: {
      code: "BOTH",
      name: "Cả hai bên",
      color: "#F59E0B",
    },
  },

  RSVP_STATUS: {
    PENDING: { code: "PENDING", name: "Chưa phản hồi", color: "#9CA3AF" },
    ATTENDING: { code: "ATTENDING", name: "Tham dự", color: "#10B981" },
    DECLINED: { code: "DECLINED", name: "Từ chối", color: "#EF4444" },
  },
};
