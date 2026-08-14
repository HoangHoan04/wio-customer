import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Award, Heart } from "lucide-react";

export const ThankYou = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const graduateName =
    data?.groom?.fullName ||
    data?.groom?.name ||
    data?.title ||
    "Tân Khoa";

  return (
    <div className="w-full px-6 py-8 flex flex-col items-center text-center">
      <div className="size-12 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mb-3">
        <Heart className="size-6 fill-blue-800 text-blue-800" />
      </div>

      <h3
        className="text-2xl font-black text-slate-900 mb-2"
        style={{ fontFamily: config.fonts.heading }}
      >
        Trân Trọng Cảm Ơn!
      </h3>

      <p className="text-xs text-slate-600 max-w-xs leading-relaxed mb-4">
        Con xin gửi lời tri ân sâu sắc nhất tới Cha Mẹ, Thầy Cô và Bạn Bè đã luôn đồng hành, yêu thương và ủng hộ trên suốt chặng đường học tập.
      </p>

      <p
        className="text-2xl text-blue-900 font-script"
        style={{ fontFamily: config.fonts.script }}
      >
        {graduateName}
      </p>
    </div>
  );
};
