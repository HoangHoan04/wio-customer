import { enumData } from "@/common/enum";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useEffect, useState } from "react";
import { StandardLayout } from "./components/StandardLayout";
import { Welcome } from "./components/Welcome";

const config: ThemeTemplateConfig = {
  code: enumData.THEME_CODE.BOHO_FLORAL_PINK.code,
  colors: {
    background: "#fdf0f4",
    textPrimary: "#5c1c30",
    textSecondary: "#7e3e52",
    accent: "#c25975",
    envelope: "#9c3250",
    buttonBg: "#9c3250",
    buttonText: "#fdf0f4",
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
    script: "'Great Vibes', cursive",
  },
  styles: {
    heroBackgroundBlendMode: "normal",
    heroBackgroundOpacity: "opacity-100",
  },
};

export default function BohoFloralPinkTemplate({
  data,
  isHoverPreview,
}: {
  data: any;
  isHoverPreview?: boolean;
}) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(!!isHoverPreview);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleOpen = () => {
    setIsEnvelopeOpen(true);
    setIsPlaying(true);
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch((e) => console.log("Audio play prevented:", e));
    }
  };

  const toggleAudio = () => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className="relative min-h-screen font-body overflow-x-hidden"
      style={{
        background: "linear-gradient(135deg, #fdf0f4 0%, #f7e2e8 50%, #edd1d9 100%)",
        color: config.colors.textPrimary,
      }}
    >
      <audio id="bg-music" loop src={data?.musicUrl || undefined} />

      {!isEnvelopeOpen && (
        <Welcome data={data} config={config} onOpen={handleOpen} />
      )}

      <StandardLayout
        data={data}
        config={config}
        isEnvelopeOpen={isEnvelopeOpen}
        toggleAudio={toggleAudio}
        isPlaying={isPlaying}
      />
    </div>
  );
}
