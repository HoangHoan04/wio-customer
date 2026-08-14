import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Cake, Sparkles } from "lucide-react";

export const Welcome = ({
  data,
  config,
  onOpen,
}: {
  data: any;
  config: ThemeTemplateConfig;
  onOpen: () => void;
}) => {
  const hostName =
    data?.groom?.fullName ||
    data?.groom?.name ||
    data?.title ||
    "Chủ nhân bữa tiệc";
  const age = data?.extraContent?.age;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #fff7ed 0%, #ffedd5 60%, #fed7aa 100%)",
        color: config.colors.textPrimary,
      }}
    >
      {/* Decorative floating shapes */}
      <div className="absolute top-10 left-8 w-20 h-20 rounded-full bg-orange-300/30 blur-xl animate-pulse" />
      <div className="absolute bottom-12 right-10 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl animate-pulse" />

      <div className="relative z-10 max-w-sm w-full bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-[0_20px_50px_rgba(234,88,12,0.15)] border border-orange-200/60 flex flex-col items-center">
        <div className="size-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-5 shadow-inner">
          <Cake className="size-8 animate-bounce" />
        </div>

        <span
          className="text-xs uppercase tracking-[0.25em] font-bold text-orange-600 mb-2"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.welcomeLine || "THIỆP MỜI SINH NHẬT"}
        </span>

        <h1
          className="text-3xl sm:text-4xl font-extrabold my-2 leading-tight text-orange-950"
          style={{ fontFamily: config.fonts.heading }}
        >
          {hostName}
        </h1>

        {age && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-700 font-semibold text-xs my-2 border border-orange-500/20">
            <Sparkles className="size-3.5 text-orange-500" />
            <span>Mừng sinh nhật tuổi {age}</span>
          </div>
        )}

        <p
          className="text-xs text-orange-900/70 mt-2 mb-6 max-w-xs leading-relaxed"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.introText ||
            "Trân trọng kính mời bạn đến tham dự bữa tiệc sinh nhật thân mật và chung vui cùng mình nhé!"}
        </p>

        <button
          onClick={onOpen}
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          style={{
            backgroundColor: config.colors.buttonBg,
            color: config.colors.buttonText,
          }}
        >
          <Sparkles className="size-4" />
          <span>Mở thiệp mời</span>
        </button>
      </div>
    </div>
  );
};
