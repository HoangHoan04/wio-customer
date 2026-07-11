import { enumData } from "@/common/enum";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useEffect } from "react";

const config: ThemeTemplateConfig = {
  code: enumData.THEME_CODE.ROYAL_RED.code,
  colors: {
    background: "",
    textPrimary: "",
    textSecondary: "",
    accent: "",
    envelope: "",
    buttonBg: "",
    buttonText: "",
  },
  fonts: {
    heading: "",
    body: "",
    script: "",
  },
  styles: {
    heroBackgroundBlendMode: "normal",
    heroBackgroundOpacity: "",
  },
};

export default function RoyalRedTemplate({ data }: { data: any }) {
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen font-body overflow-x-hidden"
      style={{ backgroundColor: config.colors.background, color: config.colors.textPrimary }}
    >
      <audio id="bg-music" loop src={data?.musicUrl || undefined} />
    </div>
  );
}
