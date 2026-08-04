import bgInvitation1 from "./bg-invitation-1.jpg";
import bgInvitation2 from "./bg-invitation-2.jpg";
import bgInvitation3 from "./bg-invitation-3.jpg";
import bgInvitation4 from "./bg-invitation-4.jpg";
import bgInvitation5 from "./bg-invitation-5.jpg";
import bgInvitation6 from "./bg-invitation-6.jpg";
import bgInvitation7 from "./bg-invitation-7.jpg";
import bgInvitation8 from "./bg-invitation-8.jpg";
import bgInvitation9 from "./bg-invitation-9.jpg";
import bgInvitation10 from "./bg-invitation-10.jpg";
import bgInvitation11 from "./bg-invitation-11.avif";
import bgInvitation12 from "./bg-invitation-12.webp";

export const SYSTEM_WALLPAPER_IMAGES = [
  bgInvitation1,
  bgInvitation2,
  bgInvitation3,
  bgInvitation4,
  bgInvitation5,
  bgInvitation6,
  bgInvitation7,
  bgInvitation8,
  bgInvitation9,
  bgInvitation10,
  bgInvitation11,
  bgInvitation12,
] as const;

export const SYSTEM_WALLPAPERS = SYSTEM_WALLPAPER_IMAGES.map((img) => img.src);
