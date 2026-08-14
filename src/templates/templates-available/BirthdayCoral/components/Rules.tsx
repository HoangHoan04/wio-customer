import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Shirt, Sparkles } from "lucide-react";

export const Rules = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const dressCode = data?.dressCode;
  if (!dressCode && !data?.showDressCode) return null;

  const colors = Array.isArray(dressCode?.colors) ? dressCode.colors : [];
  const note = dressCode?.note || data?.dressCodeNote;

  return (
    <div className="w-full px-6 py-4 flex flex-col items-center">
      <div className="w-full max-w-sm bg-white/95 rounded-3xl p-5 shadow-sm border border-orange-200 text-center flex flex-col items-center">
        <div className="size-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
          <Shirt className="size-5" />
        </div>

        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          DRESS CODE
        </span>

        <h3
          className="text-base font-extrabold text-orange-950 mb-3"
          style={{ fontFamily: config.fonts.heading }}
        >
          Trang Phục Tham Dự
        </h3>

        {colors.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-3">
            {colors.map((color: string, idx: number) => (
              <div
                key={idx}
                className="size-7 rounded-full border-2 border-white shadow-md"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}

        {note && (
          <p className="text-xs text-orange-900/70 leading-relaxed max-w-xs">
            {note}
          </p>
        )}
      </div>
    </div>
  );
};
