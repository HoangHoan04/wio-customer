import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Heart, Sparkles } from "lucide-react";

export const ThankYou = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const hostName =
    data?.groom?.fullName ||
    data?.groom?.name ||
    data?.title ||
    "Chủ nhân bữa tiệc";

  return (
    <div className="w-full px-6 py-8 flex flex-col items-center text-center">
      <div className="size-12 rounded-full bg-orange-500/10 text-orange-600 flex items-center justify-center mb-3">
        <Heart className="size-6 fill-orange-500 text-orange-500" />
      </div>

      <h3
        className="text-2xl font-black text-orange-950 mb-2"
        style={{ fontFamily: config.fonts.heading }}
      >
        Cảm Ơn Bạn Rất Nhiều!
      </h3>

      <p className="text-xs text-orange-900/70 max-w-xs leading-relaxed mb-4">
        Sự hiện diện và lời chúc của bạn là món quà ý nghĩa nhất dành cho mình trong ngày sinh nhật đặc biệt này.
      </p>

      <p
        className="text-2xl text-orange-600 font-script"
        style={{ fontFamily: config.fonts.script }}
      >
        {hostName}
      </p>
    </div>
  );
};
