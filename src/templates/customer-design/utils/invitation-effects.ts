import type {
  InvitationEffects,
  IntroEffectType,
  ParticleEffectType,
} from "../types";

export const DEFAULT_INVITATION_EFFECTS: InvitationEffects = {
  intro: { type: "none", duration: 2.4, trigger: "auto" },
  particles: { type: "none", density: 40 },
};

export const INTRO_EFFECTS: {
  type: IntroEffectType;
  title: string;
  description: string;
}[] = [
  { type: "none", title: "Không", description: "Mở thiệp ngay" },
  { type: "fade", title: "Hiện dần", description: "Mờ dần vào thiệp" },
  { type: "zoom", title: "Phóng to", description: "Từ điểm giữa mở ra" },
  { type: "envelope", title: "Phong bì", description: "Mở như phong thư" },
  { type: "curtain", title: "Màn kéo", description: "Hai cánh màn tách ra" },
  { type: "slide-up", title: "Trượt lên", description: "Thiệp trượt từ dưới" },
  { type: "blur", title: "Nét dần", description: "Từ mờ đến rõ" },
  { type: "hearts", title: "Trái tim", description: "Bùng nở rồi hiện thiệp" },
];

export const PARTICLE_EFFECTS: {
  type: ParticleEffectType;
  title: string;
  description: string;
}[] = [
  { type: "none", title: "Không", description: "Không hiệu ứng rơi" },
  { type: "petals", title: "Cánh hoa", description: "Hoa rơi lãng mạn" },
  { type: "hearts", title: "Trái tim", description: "Tim nhỏ rơi chậm" },
  { type: "snow", title: "Tuyết", description: "Tuyết rơi nhẹ" },
  { type: "confetti", title: "Confetti", description: "Giấy màu ăn mừng" },
  { type: "sparkles", title: "Lấp lánh", description: "Ánh sáng lóe" },
  { type: "leaves", title: "Lá", description: "Lá bay theo gió" },
  { type: "bubbles", title: "Bong bóng", description: "Bong bóng bay lên" },
  { type: "stars", title: "Sao", description: "Sao lấp lánh" },
];

export function normalizeEffects(raw: unknown): InvitationEffects {
  const fallback = DEFAULT_INVITATION_EFFECTS;
  if (!raw || typeof raw !== "object") return fallback;
  const data = raw as Partial<InvitationEffects>;
  const introType = INTRO_EFFECTS.some((i) => i.type === data.intro?.type)
    ? (data.intro!.type as IntroEffectType)
    : "none";
  const particleType = PARTICLE_EFFECTS.some((i) => i.type === data.particles?.type)
    ? (data.particles!.type as ParticleEffectType)
    : "none";
  return {
    intro: {
      type: introType,
      duration: Math.min(6, Math.max(0.8, Number(data.intro?.duration) || fallback.intro.duration)),
      trigger: data.intro?.trigger === "tap" ? "tap" : "auto",
    },
    particles: {
      type: particleType,
      density: Math.min(80, Math.max(10, Number(data.particles?.density) || fallback.particles.density)),
    },
  };
}
