import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Award, Camera, Clock, GraduationCap, PartyPopper, Users } from "lucide-react";

export const Timeline = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  const customTimeline = data?.timeline;

  const defaultGraduationTimeline = [
    {
      time: "07:30",
      title: "Tập trung & Chuẩn bị lễ phục",
      desc: "Nhận lễ phục cử nhân, ổn định vị trí trong hội trường",
      icon: Users,
    },
    {
      time: "08:30",
      title: "Lễ Trao Bằng Cử Nhân",
      desc: "Nghi thức trao bằng danh dự và vinh danh tân khoa",
      icon: Award,
    },
    {
      time: "10:30",
      title: "Chụp Ảnh Lưu Niệm",
      desc: "Chụp ảnh kỷ yếu cùng gia đình, thầy cô và bạn bè",
      icon: Camera,
    },
    {
      time: "12:00",
      title: "Tiệc Mừng Tốt Nghiệp",
      desc: "Liên hoan ấm cúng cùng người thân và bạn bè",
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
      : defaultGraduationTimeline;

  return (
    <div className="w-full px-6 py-6 flex flex-col items-center">
      <div className="w-full max-w-sm flex flex-col items-center">
        <span
          className="text-xs uppercase tracking-widest font-bold text-blue-800 mb-1"
          style={{ fontFamily: config.fonts.body }}
        >
          LỊCH TRÌNH
        </span>
        <h2
          className="text-2xl font-extrabold text-slate-900 mb-6"
          style={{ fontFamily: config.fonts.heading }}
        >
          Chương Trình Buổi Lễ
        </h2>

        <div className="relative w-full border-l-2 border-slate-300 ml-4 pl-6 space-y-6">
          {items.map((item: any, idx: number) => {
            const IconComp = item.icon || Clock;
            return (
              <div key={idx} className="relative group">
                <div className="absolute -left-[35px] top-0 size-8 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center shadow-md border-2 border-white">
                  <IconComp className="size-4" />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-left">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[11px] font-bold font-mono mb-1.5">
                    {item.time}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 mb-1">
                    {item.title}
                  </h3>
                  {item.desc && (
                    <p className="text-xs text-slate-600 leading-relaxed">
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
