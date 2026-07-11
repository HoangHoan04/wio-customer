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
  },
  TEMPLATE: {
    PAGINATION: "/api/user/template/pagination",
  },
  WEDDING: {
    CREATE: "/api/user/wedding/create",
    UPDATE: "/api/user/wedding/update",
    PUBLISH: "/api/user/wedding/publish",
    FIND_BY_ID: "/api/user/wedding/find-by-id",
    FIND_BY_SLUG: "/api/user/wedding/public/find-by-slug",
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
  },
  GIPHY: {
    SEARCH: "/api/user/giphy/search",
    PEXELS_SEARCH: "/api/user/giphy/pexels-search",
  },
  MAP: {
    RESOLVE_URL: "/api/resolve-map-url",
  },
};
