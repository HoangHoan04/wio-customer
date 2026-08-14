import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Award, BookOpen, GraduationCap } from "lucide-react";

export const GraduateInfo = ({
  data,
  config,
}: {
  data?: any;
  config: ThemeTemplateConfig;
}) => {
  if (!data) return null;
  const graduateName =
    data?.groom?.fullName ||
    data?.groom?.name ||
    data?.title ||
    "Tân Khoa";
  const school = data?.extraContent?.school;
  const major = data?.extraContent?.major;
  const year = data?.extraContent?.year || new Date().getFullYear();

  return (
    <div className="px-6 py-6 flex flex-col items-center text-center relative z-10">
      <div className="flex items-center gap-2 text-amber-600 mb-2">
        <GraduationCap className="size-4" />
        <span
          className="text-xs uppercase tracking-[0.25em] font-bold"
          style={{ fontFamily: config.fonts.body }}
        >
          {data?.welcomeLine || "THƯ MỜI LỄ TỐT NGHIỆP"}
        </span>
        <GraduationCap className="size-4" />
      </div>

      <h1
        className="text-3xl sm:text-4xl font-extrabold text-slate-900 my-1 leading-tight tracking-tight"
        style={{ fontFamily: config.fonts.heading }}
      >
        {graduateName}
      </h1>

      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-amber-300 font-bold text-xs my-3 shadow-md border border-amber-400/40">
        <Award className="size-3.5 text-amber-400" />
        <span>TÂN KHOA KHÓA {year}</span>
      </div>

      {(school || major) && (
        <div className="bg-slate-100 p-3.5 rounded-2xl border border-slate-200 w-full max-w-sm my-2 text-center">
          {major && (
            <p className="text-xs font-bold text-slate-900 flex items-center justify-center gap-1.5 mb-1">
              <BookOpen className="size-3.5 text-blue-700" />
              <span>Chuyên ngành: {major}</span>
            </p>
          )}
          {school && (
            <p className="text-xs font-medium text-slate-700">
              {school}
            </p>
          )}
        </div>
      )}

      {data?.introText && (
        <p
          className="text-xs sm:text-sm text-slate-700 max-w-sm mt-3 leading-relaxed whitespace-pre-line font-medium"
          style={{ fontFamily: config.fonts.body }}
        >
          {data.introText}
        </p>
      )}
    </div>
  );
};
