export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/user/auth/login",
    SEND_OTP_REGISTRATION: "/api/user/auth/send-otp",
    SEND_OTP_VERIFY: "/api/user/auth/send-otp-verify",
    VERIFY_OTP: "/api/user/auth/verify-otp",
    REGISTER: "/api/user/auth/register",
    FORGOT_PASSWORD: "/api/user/auth/forgot-password",
    LOGIN_GOOGLE: "/api/user/auth/login/google",
    LOGIN_FACEBOOK: "/api/user/auth/login/facebook",
    LOGOUT: "/api/user/auth/logout",
    REFRESH_TOKEN: "/api/user/auth/refresh-token",
    ME: "/api/user/auth/me",
    CHANGE_PASSWORD: "/api/user/auth/change-password",
    UPDATE_PASSWORD: "/api/user/auth/update-password",
    CHECK_PHONE_EMAIL: "/api/user/auth/check-phone-email",
    VERIFY_EMAIL: "/api/user/auth/verify-email",
    RESEND_VERIFICATION: "/api/user/auth/resend-verification",
    CLEAN_TOKENS: "/api/user/auth/clean-tokens",
    UPDATE_PROFILE: "/api/user/auth/update-profile",
  },
  SERVICE_PLAN: {
    PUBLIC_LIST: "/api/user/service-plan/public/list",
  },
  CONTACT: {
    CREATE: "/api/user/contact/public/create",
  },
  TEMPLATE: {
    PAGINATION: "/api/user/template/pagination",
    INCREMENT_VIEW: "/api/user/template/increment-view",
    INCREMENT_PREVIEW: "/api/user/template/increment-preview",
  },
  CARD_TYPE: {
    PUBLIC_LIST: "/api/user/card-type/public/list",
  },
  ANALYTICS: {
    PUBLIC_OVERVIEW: "/api/user/analytics/public/overview",
  },
  REVIEW: {
    PUBLIC_LIST: "/api/user/review/public/list",
    PUBLIC_CREATE: "/api/user/review/public/create",
  },
  STOCK_ASSET: {
    PUBLIC_LIST: "/api/user/stock-asset/public/list",
  },
  INVITATION: {
    PAGINATION: "/api/user/invitation/pagination",
    FIND_BY_ID: "/api/user/invitation/find-by-id",
    CREATE: "/api/user/invitation/create",
    UPDATE: "/api/user/invitation/update",
    DELETE: "/api/user/invitation/delete",
    PUBLISH: "/api/user/invitation/publish",
    UNPUBLISH: "/api/user/invitation/unpublish",
    ARCHIVE: "/api/user/invitation/archive",
    CHECK_SLUG: "/api/user/invitation/check-slug",
    FIND_BY_SLUG: "/api/user/invitation/public/find-by-slug",
  },
  /** @deprecated dùng INVITATION */
  get WEDDING() {
    return this.INVITATION;
  },
  UPLOAD_FILE: {
    IMAGE: "/api/upload/upload-file/upload-image",
    BULK_IMAGES: "/api/upload/upload-file/upload-multi",
    AUDIO: "/api/upload/upload-file/upload-audio",
  },
  MUSIC_BACKGROUND: {
    FIND_ALL_ACTIVATE: "/api/user/music-background/active",
    IMPORT_YOUTUBE: "/api/user/music-background/import-youtube",
    INCREMENT_USAGE: "/api/user/music-background/increment-usage",
    GET_INFO: "/api/user/music-background/info",
    CANCEL_IMPORT: "/api/user/music-background/cancel-import",
    CREATE_USER_MUSIC: "/api/user/music-background/create",
  },

  GUEST: {
    PAGINATION: "/api/user/guest/pagination",
    FIND_BY_ID: "/api/user/guest/find-by-id",
    CREATE: "/api/user/guest/create",
    CREATE_MANY: "/api/user/guest/create-many",
    UPDATE: "/api/user/guest/update",
    DELETE: "/api/user/guest/delete",
    GENERATE_QR: "/api/user/guest/generate-qr",
    IMPORT_EXCEL: "/api/user/guest/import-excel",
    DOWNLOAD_SAMPLE_EXCEL: "/api/user/guest/download-sample-excel",
    PUBLIC_IDENTIFY: "/api/user/guest/public/identify",
    PUBLIC_RSVP: "/api/user/guest/public/rsvp",
  },

  WISH: {
    PAGINATION: "/api/user/wish/pagination",
    FIND_BY_ID: "/api/user/wish/find-by-id",
    PUBLIC_CREATE: "/api/user/wish/public/create",
    APPROVE: "/api/user/wish/approve",
    REJECT: "/api/user/wish/reject",
    PIN: "/api/user/wish/pin",
    UNPIN: "/api/user/wish/unpin",
    DELETE: "/api/user/wish/delete",
  },
  PHOTO_WALL: {
    PAGINATION: "/api/user/photo-wall/pagination",
    FIND_BY_ID: "/api/user/photo-wall/find-by-id",
    PUBLIC_UPLOAD: "/api/user/photo-wall/public/upload",
  },
  TABLE: {
    PAGINATION: "/api/user/table/pagination",
    FIND_BY_ID: "/api/user/table/find-by-id",
    CREATE: "/api/user/table/create",
    UPDATE: "/api/user/table/update",
    DELETE: "/api/user/table/delete",
    ASSIGN_GUEST: "/api/user/table/assign-guest",
    UNASSIGN_GUEST: "/api/user/table/unassign-guest",
  },
  MAP: {
    RESOLVE_URL: "/api/resolve-map-url",
  },
};
