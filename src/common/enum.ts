

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
      name: "Hoa mộc Lan - Nâu",
      slug: "hoa-moc-lan-nau",
    },
    BOHO_FLORAL_GREEN: {
      code: "BOHO_FLORAL_GREEN",
      name: "Hoa mộc Lan - Xanh",
      slug: "hoa-moc-lan-xanh",
    },
    BOHO_FLORAL_PINK: {
      code: "BOHO_FLORAL_PINK",
      name: "Hoa mộc Lan - Hồng",
      slug: "hoa-moc-lan-hong",
    },
    DRAGON_PHOENIX_BLUE: {
      code: "DRAGON_PHOENIX_BLUE",
      name: "Long phụng - Xanh",
      slug: "long-phung-xanh",
    },
    DRAGON_PHOENIX_GREEN: {
      code: "DRAGON_PHOENIX_GREEN",
      name: "Long phụng - Xanh lá",
      slug: "long-phung-xanh-la",
    },
    DRAGON_PHOENIX_RED: {
      code: "DRAGON_PHOENIX_RED",
      name: "Long phụng - Đỏ",
      slug: "long-phung-do",
    },
    ROYAL_BLUE: {
      code: "ROYAL_BLUE",
      name: "Hoàng gia - Xanh",
      slug: "hoang-gia-xanh",
    },
    ROYAL_GREEN: {
      code: "ROYAL_GREEN",
      name: "Hoàng gia - Xanh lá",
      slug: "hoang-gia-xanh-la",
    },
    ROYAL_RED: {
      code: "ROYAL_RED",
      name: "Hoàng gia - Đỏ",
      slug: "hoang-gia-do",
    },
    RED_DOUBLE_HAPPINESS: {
      code: "RED_DOUBLE_HAPPINESS",
      name: "Song hỷ - Đỏ",
      slug: "song-hy-do",
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
    PENDING: { code: 'PENDING', name: 'Chưa phản hồi', color: '#9CA3AF' },
    ATTENDING: { code: 'ATTENDING', name: 'Tham dự', color: '#10B981' },
    DECLINED: { code: 'DECLINED', name: 'Từ chối', color: '#EF4444' },
  },
};
