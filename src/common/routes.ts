export const REQUIRE_AUTH_ROUTES = {
  CREATOR: "/create/:themeCode",
  EDIT: "/edit/:id",
  DESIGN_EDITOR: "/design",
  MY_TEMPLATES: "/my-templates",
  MY_GUESTS: "/my-guests",
  MY_TABLES: "/my-tables",
  MY_WISHES: "/my-wishes",
  PROFILE: "/profile",
};

export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  TEMPLATES: "/templates",
  PREVIEW: "/preview/:themeCode",
  USER_MANUAL: "/user-manual",
  INVITATION: "/thiep/:slug",
};

export const publicInvitationPath = (slug: string) => `/thiep/${slug}`;
