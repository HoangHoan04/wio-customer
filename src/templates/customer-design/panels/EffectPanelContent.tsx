import Slider from "@/templates/customer-design/ui/Slider";
import { Play } from "lucide-react";
import type {
  IntroEffectType,
  InvitationEffects,
  ParticleEffectType,
} from "../types";
import { INTRO_EFFECTS, PARTICLE_EFFECTS } from "../utils/invitation-effects";

function IntroThumb({ type }: { type: IntroEffectType }) {
  return (
    <div className="relative h-16 overflow-hidden rounded-md bg-[#EDE4D5]">
      {type === "none" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-10 rotate-[-20deg] bg-[#C4B09A]" />
        </div>
      )}
      {type === "fade" && (
        <div className="inv-thumb-fade absolute inset-0 bg-[#2D231F]/40" />
      )}
      {type === "zoom" && (
        <div className="inv-thumb-zoom absolute inset-2 rounded-sm bg-[#2D231F]/25" />
      )}
      {type === "envelope" && (
        <>
          <div className="absolute inset-0 bg-[#D9CDBE]" />
          <div className="absolute left-0 right-0 top-0 h-1/2 bg-[#C4B09A] [clip-path:polygon(0_0,100%_0,50%_100%)]" />
          <div className="absolute left-1/2 top-[42%] h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-[#2D231F]" />
        </>
      )}
      {type === "curtain" && (
        <>
          <div className="inv-thumb-curtain-l absolute bottom-0 left-0 top-0 w-1/2 bg-[#2D231F]" />
          <div className="inv-thumb-curtain-r absolute bottom-0 right-0 top-0 w-1/2 bg-[#5C4A3E]" />
        </>
      )}
      {type === "slide-up" && (
        <div className="inv-thumb-slide absolute bottom-0 left-2 right-2 top-3 rounded-t-sm bg-[#F3EDE3]" />
      )}
      {type === "blur" && (
        <div className="absolute inset-0 bg-[#C4B09A]/80 backdrop-blur-[1px]" />
      )}
      {type === "hearts" && (
        <div className="absolute inset-0 flex items-center justify-center text-[#C45C7A]">
          <span className="text-lg">♥</span>
        </div>
      )}
    </div>
  );
}

function ParticleThumb({ type }: { type: ParticleEffectType }) {
  const dots =
    type === "petals"
      ? ["#E8A0BF", "#C45C7A", "#F6C6D6"]
      : type === "hearts"
        ? ["#C45C7A", "#E07A9A"]
        : type === "snow"
          ? ["#FFFFFF", "#EDE4D5"]
          : type === "confetti"
            ? ["#2D231F", "#C45C7A", "#E8C547"]
            : type === "leaves"
              ? ["#8B6B3A", "#6B8F4E"]
              : type === "bubbles"
                ? ["#F3EDE3", "#D9CDBE"]
                : ["#F5E6C8", "#FFFFFF"];
  return (
    <div className="relative h-16 overflow-hidden rounded-md bg-[#EDE4D5]">
      {type === "none" ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-px w-10 rotate-[-20deg] bg-[#C4B09A]" />
        </div>
      ) : (
        dots.map((c, i) => (
          <span
            key={i}
            className="inv-thumb-fall absolute rounded-full"
            style={{
              background: c,
              width: type === "snow" ? 4 : 7,
              height: type === "petals" || type === "leaves" ? 5 : 7,
              left: `${18 + i * 28}%`,
              animationDelay: `${i * 0.35}s`,
            }}
          />
        ))
      )}
    </div>
  );
}

export default function EffectPanelContent({
  effects,
  onChange,
  onReplayIntro,
}: {
  effects: InvitationEffects;
  onChange: (next: InvitationEffects) => void;
  onReplayIntro: () => void;
}) {
  const setIntro = (type: IntroEffectType) => {
    onChange({
      ...effects,
      intro: {
        ...effects.intro,
        type,
        trigger: type === "envelope" ? "tap" : "auto",
      },
    });
    if (type !== "none") onReplayIntro();
  };

  const setParticles = (type: ParticleEffectType) => {
    onChange({
      ...effects,
      particles: { ...effects.particles, type },
    });
  };

  return (
    <div className="space-y-5 pb-8">
      <p className="text-[11px] leading-relaxed text-[#7A6A5C]">
        Hiệu ứng gắn vào toàn bộ thiệp: khách sẽ thấy khi mở thiệp đã xuất bản.
      </p>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
            Mở màn
          </p>
          {effects.intro.type !== "none" && (
            <button
              type="button"
              onClick={onReplayIntro}
              className="flex items-center gap-1 text-[10px] font-semibold text-[#2D231F] hover:underline"
            >
              <Play size={10} />
              Phát lại
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {INTRO_EFFECTS.map((item) => {
            const active = effects.intro.type === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setIntro(item.type)}
                className={`overflow-hidden rounded-xl border text-left transition-colors ${
                  active
                    ? "border-[#2D231F] bg-[#EDE4D5]"
                    : "border-[#D9CDBE] bg-[#F3EDE3] hover:border-[#2D231F]"
                }`}
              >
                <IntroThumb type={item.type} />
                <div className="px-2.5 py-2">
                  <div className="text-[11px] font-semibold text-[#2D231F]">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#7A6A5C]">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {effects.intro.type !== "none" && (
          <div className="space-y-3 rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] p-3">
            <div>
              <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
                Thời lượng: {effects.intro.duration.toFixed(1)}s
              </label>
              <Slider
                value={effects.intro.duration}
                min={1}
                max={5}
                step={0.1}
                onValueChange={(v) =>
                  onChange({
                    ...effects,
                    intro: { ...effects.intro, duration: v },
                  })
                }
              />
            </div>
            <div className="flex gap-1 rounded-lg bg-[#F3EDE3] p-1">
              {(["auto", "tap"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...effects,
                      intro: { ...effects.intro, trigger: mode },
                    })
                  }
                  className={`flex-1 rounded-md py-1.5 text-[10px] font-semibold ${
                    effects.intro.trigger === mode
                      ? "bg-[#2D231F] text-[#F3EDE3]"
                      : "text-[#7A6A5C] hover:text-[#2D231F]"
                  }`}
                >
                  {mode === "auto" ? "Tự chạy" : "Chạm để mở"}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7A6A5C]">
          Hiệu ứng rơi
        </p>
        <div className="grid grid-cols-2 gap-2">
          {PARTICLE_EFFECTS.map((item) => {
            const active = effects.particles.type === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => setParticles(item.type)}
                className={`overflow-hidden rounded-xl border text-left transition-colors ${
                  active
                    ? "border-[#2D231F] bg-[#EDE4D5]"
                    : "border-[#D9CDBE] bg-[#F3EDE3] hover:border-[#2D231F]"
                }`}
              >
                <ParticleThumb type={item.type} />
                <div className="px-2.5 py-2">
                  <div className="text-[11px] font-semibold text-[#2D231F]">
                    {item.title}
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#7A6A5C]">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {effects.particles.type !== "none" && (
          <div className="rounded-xl border border-[#D9CDBE] bg-[#EDE4D5] p-3">
            <label className="mb-1 block text-[10px] uppercase text-[#7A6A5C]">
              Mật độ: {effects.particles.density}
            </label>
            <Slider
              value={effects.particles.density}
              min={12}
              max={80}
              step={1}
              onValueChange={(v) =>
                onChange({
                  ...effects,
                  particles: { ...effects.particles, density: v },
                })
              }
            />
          </div>
        )}
      </section>

      <style>{`
        .inv-thumb-fade { animation: thumbFade 1.6s ease-in-out infinite; }
        .inv-thumb-zoom { animation: thumbZoom 1.8s ease-in-out infinite; }
        .inv-thumb-slide { animation: thumbSlide 1.8s ease-in-out infinite; }
        .inv-thumb-curtain-l { animation: thumbCurtainL 2s ease-in-out infinite; }
        .inv-thumb-curtain-r { animation: thumbCurtainR 2s ease-in-out infinite; }
        .inv-thumb-fall { animation: thumbFall 1.8s linear infinite; }
        @keyframes thumbFade { 0%,100% { opacity:.2; } 50% { opacity:.7; } }
        @keyframes thumbZoom { 0%,100% { transform: scale(.7); opacity:.4; } 50% { transform: scale(1); opacity:.8; } }
        @keyframes thumbSlide { 0% { transform: translateY(12px); } 50% { transform: translateY(0); } 100% { transform: translateY(12px); } }
        @keyframes thumbCurtainL { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-40%); } }
        @keyframes thumbCurtainR { 0%,100% { transform: translateX(0); } 50% { transform: translateX(40%); } }
        @keyframes thumbFall { 0% { transform: translateY(-8px); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(48px); opacity: 0; } }
      `}</style>
    </div>
  );
}
