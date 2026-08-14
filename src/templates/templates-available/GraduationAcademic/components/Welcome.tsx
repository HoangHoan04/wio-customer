import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Award, GraduationCap, Sparkles } from "lucide-react";

export const Welcome = ({
  data,
  config,
  onOpen,
}: {
  data: any;
  config: ThemeTemplateConfig;
  onOpen: () => void;
}) => {
  const graduateName =
    data?.groom?.fullName ||
    data?.groom?.name ||
    data?.title ||
    "Tân Khoa";
  const school = data?.extraContent?.school;
  const year = data?.extraContent?.year || new Date().getFullYear();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at center, #1e293b 0%, #0f172a 70%, #020617 100%)",
        color: "#ffffff",
      }}
    >
      {/* Golden halo decor */}
      <div className="absolute top-12 left-10 w-32 h-32 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-16 right-12 w-48 h-48 rounded-full bg-blue-600/20 blur-3xl animate-pulse" />

      <div className="relative z-10 max-w-sm w-full bg-slate-900/85 backdrop-blur-md rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-amber-500/30 flex flex-col items-center">
        <div className="size-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-slate-950 mb-5 shadow-lg">
          <GraduationCap className="size-9 animate-bounce" />
        </div>

        <div className="flex items-center gap-2 text-amber-400 text-xs uppercase tracking-[0.25em] font-bold mb-2">
          <Award className="size-3.5" />
          <span>CLASS OF {year}</span>
          <Award className="size-3.5" />
        </div>

        <span
          className="text-xs uppercase tracking-widest text-slate-300 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.welcomeLine || "THƯ MỜI LỄ TỐT NGHIỆP"}
        </span>

        <h1
          className="text-3xl sm:text-4xl font-black my-2 text-amber-200 tracking-tight leading-tight"
          style={{ fontFamily: config.fonts.heading }}
        >
          {graduateName}
        </h1>

        {school && (
          <p className="text-xs font-semibold text-slate-300 my-1 max-w-xs">
            {school}
          </p>
        )}

        <p
          className="text-xs text-slate-400 mt-2 mb-6 max-w-xs leading-relaxed"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.introText ||
            "Trân trọng kính mời bạn đến tham dự Lễ tốt nghiệp và chia vui cùng mình trong ngày đặc biệt này!"}
        </p>

        <button
          onClick={onOpen}
          className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wider uppercase transition-all duration-300 shadow-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-amber-300/40"
        >
          <Sparkles className="size-4" />
          <span>Mở Thư Mời</span>
        </button>
      </div>
    </div>
  );
};
