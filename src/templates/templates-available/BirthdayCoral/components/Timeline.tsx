import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Cake, Camera, Clock, PartyPopper, Utensils } from "lucide-react";

export const Timeline = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const customTimeline = data?.timeline;

  const defaultBirthdayTimeline = [
    {
      time: "18:00",
      title: "Đón khách & Check-in",
      desc: "Chụp ảnh lưu niệm tại photo booth và thưởng thức welcome drink",
      icon: Camera,
    },
    {
      time: "18:45",
      title: "Khai tiệc & Nâng ly",
      desc: "Lời cảm ơn của chủ tiệc và khai tiệc ấm cúng cùng bạn bè",
      icon: Utensils,
    },
    {
      time: "19:30",
      title: "Cắt bánh & Thổi nến",
      desc: "Hát chúc mừng sinh nhật, thổi nến và gửi gắm những điều ước tuổi mới",
      icon: Cake,
    },
    {
      time: "20:15",
      title: "Minigame & Quẩy tiệc",
      desc: "Trò chơi vui nhộn, bốc thăm may mắn và quẩy nhạc tưng bừng",
      icon: PartyPopper,
    },
  ];

  const items =
    customTimeline && customTimeline.length > 0
      ? customTimeline.map((item: any) => ({
          time: item.time,
          title: item.title,
          desc: item.description || item.desc,
          icon: Clock,
        }))
      : defaultBirthdayTimeline;

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          CHƯƠNG TRÌNH
        </span>
        <h2
          className="text-2xl font-extrabold text-orange-950 mb-6"
          style={{ fontFamily: config.fonts.heading }}
        >
          Lịch Trình Buổi Tiệc
        </h2>

        <div className="relative w-full border-l-2 border-orange-300 ml-4 pl-6 space-y-6">
          {items.map((item: any, idx: number) => {
            const IconComp = item.icon || Clock;
            return (
              <div key={idx} className="relative group">
                {/* Node icon */}
                <div className="absolute -left-[35px] top-0 size-8 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md border-2 border-white">
                  <IconComp className="size-4" />
                </div>

                <div className="bg-white/90 p-4 rounded-2xl border border-orange-200/70 shadow-xs text-left">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold font-mono mb-1.5">
                    {item.time}
                  </span>
                  <h3 className="font-bold text-sm text-orange-950 mb-1">
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className="text-xs text-orange-900/70 leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
