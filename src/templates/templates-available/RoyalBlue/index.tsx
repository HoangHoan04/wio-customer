import { enumData } from "@/common/enum";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useEffect, useState } from "react";
import { StandardLayout } from "./components/StandardLayout";
import { Welcome } from "./components/Welcome";

const config: ThemeTemplateConfig = {
  code: enumData.THEME_CODE.ROYAL_BLUE.code,
  colors: {
    background: "#0f172a",
    textPrimary: "#3a5a40",
    textSecondary: "#3a5a40cc",
    accent: "#6b8f5e",
    envelope: "#1e293b",
    buttonBg: "#3a5a40",
    buttonText: "#ffffff",
  },
  fonts: {
    heading: "'Cormorant Garamond', serif",
    body: "'Cormorant Garamond', serif",
    script: "'Great Vibes', cursive",
  },
  styles: {
    heroBackgroundBlendMode: "normal",
    heroBackgroundOpacity: "opacity-100",
  },
};

export default function RoyalBlueTemplate({
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
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&family=Great+Vibes&display=swap";
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
        backgroundColor: config.colors.background,
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
