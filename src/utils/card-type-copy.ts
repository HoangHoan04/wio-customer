export interface CardTypeCopy {
  rsvpCta: string;
  rsvpIntro: string;
  giftsTitle: string;
  giftsSubtitle: string;
  welcomeLine: string;
}

const COPY: Record<string, CardTypeCopy> = {
  WEDDING: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro:
      "Sự hiện diện của bạn là niềm vinh hạnh cho gia đình chúng tôi.",
    giftsTitle: "HỘP MỪNG CƯỚI",
    giftsSubtitle: "Thông tin mừng cưới",
    welcomeLine: "Trân trọng kính mời",
  },
  BIRTHDAY: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro: "Hãy cho chúng mình biết bạn sẽ đến chung vui nhé!",
    giftsTitle: "HỘP QUÀ",
    giftsSubtitle: "Thông tin gửi quà",
    welcomeLine: "Mời bạn đến dự tiệc sinh nhật",
  },
  GRADUATION: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro: "Sự hiện diện của bạn làm ngày tốt nghiệp thêm trọn vẹn.",
    giftsTitle: "HỘP QUÀ",
    giftsSubtitle: "Thông tin gửi quà",
    welcomeLine: "Trân trọng kính mời dự lễ tốt nghiệp",
  },
  BABY: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro: "Gia đình rất vui nếu được đón bạn trong ngày đặc biệt của bé.",
    giftsTitle: "HỘP MỪNG",
    giftsSubtitle: "Thông tin gửi mừng",
    welcomeLine: "Trân trọng kính mời",
  },
  HOUSEWARMING: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro: "Gia đình rất vui được đón bạn đến thăm nhà mới.",
    giftsTitle: "HỘP MỪNG",
    giftsSubtitle: "Thông tin gửi mừng",
    welcomeLine: "Trân trọng kính mời tân gia",
  },
  ANNIVERSARY: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro: "Sự hiện diện của bạn làm ngày kỷ niệm thêm ý nghĩa.",
    giftsTitle: "HỘP QUÀ",
    giftsSubtitle: "Thông tin gửi quà",
    welcomeLine: "Trân trọng kính mời",
  },
  CUSTOM: {
    rsvpCta: "Xác nhận tham dự",
    rsvpIntro: "Hãy cho chúng tôi biết bạn sẽ đến tham dự nhé!",
    giftsTitle: "HỘP QUÀ",
    giftsSubtitle: "Thông tin gửi quà",
    welcomeLine: "Trân trọng kính mời",
  },
};

export function cardTypeCopy(cardType?: string): CardTypeCopy {
  return COPY[cardType || "WEDDING"] || COPY.CUSTOM;
}
