import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Sparkles } from "lucide-react";

export const HeroImages = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const imageUrl = data?.heroImageMain || data?.photos?.[0]?.url;
  if (!imageUrl) return null;

  return (
    <div className="relative w-full px-4 pt-6 pb-2 flex flex-col items-center">
      <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl overflow-hidden shadow-xl border-4 border-white">
        <img
          src={imageUrl}
          alt={data?.title || "Sinh nhật"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-orange-600 shadow-sm flex items-center gap-1">
          <Sparkles className="size-3 text-orange-500" />
          <span>Happy Birthday</span>
        </div>
      </div>
    </div>
  );
};
