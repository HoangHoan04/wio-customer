export interface CardTypeFormConfig {
  code: string;
  nameVi: string;
  basicInfoTitle: string;
  heroImageTitle: string;
  introTitle: string;
  eventsTitle: string;
  galleryTitle: string;
  partyTitle: string;
  timelineTitle: string;
  giftsTitle: string;
  thankYouTitle: string;
  allowFamilyTitle: boolean;
  hostNamePlaceholder: string;
  shortNamePlaceholder: string;
  defaultIntro: string;
  introPlaceholder: string;
  defaultThankYou: string;
  thankYouPlaceholder: string;
  partyTypes?: Array<{ value: string; label: string }>;
  defaultPartyType: string;
}

export const CARD_TYPE_FORM_CONFIGS: Record<string, CardTypeFormConfig> = {
  WEDDING: {
    code: "WEDDING",
    nameVi: "Thiệp cưới",
    basicInfoTitle: "1. Thông tin cô dâu & chú rể",
    heroImageTitle: "2. Ảnh đầu thiệp",
    introTitle: "4. Lời mở đầu thiệp cưới",
    eventsTitle: "5. Lễ (Sự kiện chính)",
    galleryTitle: "6. Thư viện ảnh cưới",
    partyTitle: "7. Tiệc cưới",
    timelineTitle: "9. Lịch trình ngày cưới",
    giftsTitle: "Thông tin mừng cưới",
    thankYouTitle: "13. Lời cảm ơn",
    allowFamilyTitle: true,
    hostNamePlaceholder: "Nhập họ tên...",
    shortNamePlaceholder: "Tên thường gọi / Tên ngắn...",
    defaultIntro: "Trân trọng báo tin \n lễ thành hôn của hai con chúng tôi",
    introPlaceholder: "Nhập lời mở đầu thiệp cưới...",
    defaultThankYou:
      "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!",
    thankYouPlaceholder: "Nhập lời cảm ơn gửi đến quan khách...",
    partyTypes: [
      { value: "wedding", label: "Tiệc Cưới" },
      { value: "engagement", label: "Tiệc Báo Hỷ" },
    ],
    defaultPartyType: "wedding",
  },
  BIRTHDAY: {
    code: "BIRTHDAY",
    nameVi: "Thiệp sinh nhật",
    basicInfoTitle: "1. Thông tin chủ nhân bữa tiệc",
    heroImageTitle: "2. Ảnh sinh nhật / Ảnh bìa",
    introTitle: "4. Lời mời sinh nhật",
    eventsTitle: "5. Thời gian & Địa điểm",
    galleryTitle: "6. Thư viện ảnh sinh nhật",
    partyTitle: "7. Tiệc sinh nhật",
    timelineTitle: "9. Lịch trình bữa tiệc",
    giftsTitle: "Thông tin gửi quà / Lì xì sinh nhật",
    thankYouTitle: "13. Lời cảm ơn",
    allowFamilyTitle: false,
    hostNamePlaceholder: "Nhập tên người sinh nhật...",
    shortNamePlaceholder: "Tên thường gọi / Biệt danh...",
    defaultIntro:
      "Chào bạn! Sinh nhật lần thứ ... của mình sắp đến rồi, cùng đến chung vui nhé!",
    introPlaceholder: "Nhập lời mời sinh nhật gửi tới bạn bè, người thân...",
    defaultThankYou:
      "Cảm ơn bạn đã đến chung vui và tạo nên những kỷ niệm tuyệt vời cùng mình!",
    thankYouPlaceholder: "Nhập lời cảm ơn sau bữa tiệc...",
    partyTypes: [{ value: "birthday", label: "Tiệc Sinh Nhật" }],
    defaultPartyType: "birthday",
  },
  BABY: {
    code: "BABY",
    nameVi: "Thôi nôi / Đầy tháng",
    basicInfoTitle: "1. Thông tin của bé & gia đình",
    heroImageTitle: "2. Ảnh đáng yêu của bé",
    introTitle: "4. Lời ngỏ mời tiệc",
    eventsTitle: "5. Thời gian & Địa điểm",
    galleryTitle: "6. Album khoảnh khắc của bé",
    partyTitle: "7. Tiệc thôi nôi / Đầy tháng",
    timelineTitle: "9. Lịch trình bữa tiệc",
    giftsTitle: "Hộp quà mừng cho bé",
    thankYouTitle: "13. Lời cảm ơn của gia đình",
    allowFamilyTitle: false,
    hostNamePlaceholder: "Nhập tên bé...",
    shortNamePlaceholder: "Tên ở nhà / Biệt danh của bé...",
    defaultIntro:
      "Gia đình trân trọng kính mời bạn đến dự tiệc đầy tháng / thôi nôi của bé!",
    introPlaceholder: "Nhập lời mời dự tiệc mừng của bé...",
    defaultThankYou:
      "Gia đình xin chân thành cảm ơn tình cảm và sự hiện diện của mọi người dành cho bé!",
    thankYouPlaceholder: "Nhập lời cảm ơn...",
    partyTypes: [{ value: "baby", label: "Tiệc Thôi Nôi / Đầy Tháng" }],
    defaultPartyType: "baby",
  },
  GRADUATION: {
    code: "GRADUATION",
    nameVi: "Thiệp tốt nghiệp",
    basicInfoTitle: "1. Thông tin tân khoa",
    heroImageTitle: "2. Ảnh tốt nghiệp / Ảnh bìa",
    introTitle: "4. Lời mời dự lễ tốt nghiệp",
    eventsTitle: "5. Lễ trao bằng & Tiệc mừng",
    galleryTitle: "6. Thư viện ảnh kỷ yếu",
    partyTitle: "7. Tiệc mừng tốt nghiệp",
    timelineTitle: "9. Lịch trình ngày lễ",
    giftsTitle: "Thông tin chúc mừng / Gửi quà",
    thankYouTitle: "13. Lời tri ân & cảm ơn",
    allowFamilyTitle: false,
    hostNamePlaceholder: "Nhập họ tên tân khoa...",
    shortNamePlaceholder: "Tên thường gọi...",
    defaultIntro:
      "Trân trọng kính mời Thầy Cô, gia đình và bạn bè đến tham dự Lễ tốt nghiệp cùng mình!",
    introPlaceholder: "Nhập lời mời dự lễ trao bằng tốt nghiệp...",
    defaultThankYou:
      "Cảm ơn mọi người đã luôn đồng hành, động viên và sẻ chia khoảnh khắc đáng nhớ này!",
    thankYouPlaceholder: "Nhập lời tri ân...",
    partyTypes: [{ value: "graduation", label: "Lễ & Tiệc Tốt Nghiệp" }],
    defaultPartyType: "graduation",
  },
  HOUSEWARMING: {
    code: "HOUSEWARMING",
    nameVi: "Thiệp tân gia",
    basicInfoTitle: "1. Thông tin gia chủ",
    heroImageTitle: "2. Ảnh ngôi nhà mới / Bìa",
    introTitle: "4. Lời mời mừng tân gia",
    eventsTitle: "5. Thời gian & Địa điểm",
    galleryTitle: "6. Không gian ngôi nhà mới",
    partyTitle: "7. Tiệc tân gia",
    timelineTitle: "9. Lịch trình đón tiếp",
    giftsTitle: "Thông tin mừng tân gia",
    thankYouTitle: "13. Lời cảm ơn của gia chủ",
    allowFamilyTitle: false,
    hostNamePlaceholder: "Nhập tên gia chủ...",
    shortNamePlaceholder: "Tên thân mật...",
    defaultIntro:
      "Gia đình chúng tôi trân trọng kính mời bạn đến chung vui bữa tiệc mừng tân gia!",
    introPlaceholder: "Nhập lời mời dự tiệc mừng nhà mới...",
    defaultThankYou:
      "Gia đình xin gửi lời cảm ơn sâu sắc vì bạn đã đến chúc phúc cho tổ ấm mới của chúng tôi!",
    thankYouPlaceholder: "Nhập lời cảm ơn...",
    partyTypes: [{ value: "housewarming", label: "Tiệc Mừng Tân Gia" }],
    defaultPartyType: "housewarming",
  },
  ANNIVERSARY: {
    code: "ANNIVERSARY",
    nameVi: "Thiệp kỷ niệm",
    basicInfoTitle: "1. Thông tin ngày kỷ niệm",
    heroImageTitle: "2. Ảnh kỷ niệm / Hành trình",
    introTitle: "4. Lời mời tiệc kỷ niệm",
    eventsTitle: "5. Thời gian & Địa điểm",
    galleryTitle: "6. Thư viện ảnh hành trình",
    partyTitle: "7. Tiệc kỷ niệm",
    timelineTitle: "9. Lịch trình buổi lễ",
    giftsTitle: "Thông tin quà tặng / Chúc mừng",
    thankYouTitle: "13. Lời cảm ơn",
    allowFamilyTitle: false,
    hostNamePlaceholder: "Nhập tên...",
    shortNamePlaceholder: "Tên viết tắt...",
    defaultIntro:
      "Trân trọng kính mời bạn cùng chúng tôi nhìn lại hành trình và kỷ niệm cột mốc đáng nhớ!",
    introPlaceholder: "Nhập lời mời tham dự lễ kỷ niệm...",
    defaultThankYou:
      "Cảm ơn bạn đã luôn đồng hành và hiện diện trong ngày kỷ niệm ý nghĩa này!",
    thankYouPlaceholder: "Nhập lời cảm ơn...",
    partyTypes: [{ value: "anniversary", label: "Tiệc Kỷ Niệm" }],
    defaultPartyType: "anniversary",
  },
  CUSTOM: {
    code: "CUSTOM",
    nameVi: "Sự kiện khác",
    basicInfoTitle: "1. Thông tin người tổ chức / Sự kiện",
    heroImageTitle: "2. Banner / Ảnh sự kiện",
    introTitle: "4. Lời ngỏ mời tham dự",
    eventsTitle: "5. Thời gian & Địa điểm",
    galleryTitle: "6. Thư viện hình ảnh",
    partyTitle: "7. Sự kiện / Tiệc",
    timelineTitle: "9. Lịch trình chương trình",
    giftsTitle: "Thông tin thanh toán / Quà tặng",
    thankYouTitle: "13. Lời cảm ơn",
    allowFamilyTitle: false,
    hostNamePlaceholder: "Nhập tên người tổ chức / đại diện...",
    shortNamePlaceholder: "Tên ngắn...",
    defaultIntro:
      "Trân trọng kính mời quý khách đến tham dự sự kiện đặc biệt của chúng tôi!",
    introPlaceholder: "Nhập lời mời tham dự sự kiện...",
    defaultThankYou:
      "Trân trọng cảm ơn sự quan tâm và hiện diện của quý khách!",
    thankYouPlaceholder: "Nhập lời cảm ơn...",
    partyTypes: [{ value: "party", label: "Tiệc / Sự Kiện" }],
    defaultPartyType: "party",
  },
};

export function getCardTypeFormConfig(cardType?: string): CardTypeFormConfig {
  return (
    CARD_TYPE_FORM_CONFIGS[cardType || "WEDDING"] ||
    CARD_TYPE_FORM_CONFIGS.CUSTOM
  );
}
