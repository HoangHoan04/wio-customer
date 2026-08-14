import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Cake, Sparkles, Star } from "lucide-react";

export const HonoreeInfo = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data) return null;
  const hostName =
    data?.groom?.fullName ||
    data?.groom?.name ||
    data?.title ||
    "Chủ nhân bữa tiệc";
  const age = data?.extraContent?.age;
  const partyTheme = data?.extraContent?.partyTheme;

  return (
    <div className="px-6 py-6 flex flex-col items-center text-center relative z-10">
      <div className="flex items-center gap-2 text-orange-500 mb-2">
        <Star className="size-4 fill-orange-400 text-orange-400" />
        <span
          className="text-xs uppercase tracking-[0.2em] font-bold text-orange-700"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.welcomeLine || "THIỆP MỜI SINH NHẬT"}
        </span>
        <Star className="size-4 fill-orange-400 text-orange-400" />
      </div>

      <h1
        className="text-3xl sm:text-4xl font-black text-orange-950 my-1 leading-tight tracking-tight"
        style={{ fontFamily: config.fonts.heading }}
      >
        {hostName}
      </h1>

      {age && (
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm my-3 shadow-md">
          <Cake className="size-4" />
          <span>MỪNG SINH NHẬT TUỔI {age}</span>
        </div>
      )}

      {partyTheme && (
        <p className="text-xs font-semibold text-orange-800 bg-orange-100/60 px-3 py-1 rounded-xl my-1 border border-orange-200/50">
          Chủ đề tiệc: <span className="text-orange-900">{partyTheme}</span>
        </p>
      )}

      {data?.introText && (
        <p
          className="text-xs sm:text-sm text-orange-900/80 max-w-sm mt-3 leading-relaxed whitespace-pre-line font-medium"
          style={{ fontFamily: config.fonts.body }}
        >
          {data.introText}
        </p>
      )}
    </div>
  );
};
