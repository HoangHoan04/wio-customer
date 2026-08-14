import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Award } from "lucide-react";

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
      <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
        <img
          src={imageUrl}
          alt={data?.title || "Lễ Tốt Nghiệp"}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 bg-slate-900/90 border border-amber-400/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-amber-300 shadow-md flex items-center gap-1">
          <Award className="size-3 text-amber-400" />
          <span>Graduate</span>
        </div>
      </div>
    </div>
  );
};
