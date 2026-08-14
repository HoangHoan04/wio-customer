"use client";

import { enumData } from "@/common/enum";
import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { useEffect, useState } from "react";
import { Welcome } from "./components/Welcome";
import { StandardLayout } from "./components/StandardLayout";

const config: ThemeTemplateConfig = {
  code: enumData.THEME_CODE.GRADUATION_ACADEMIC?.code || "GRADUATION_ACADEMIC",
  colors: {
    background: "#f8fafc",
    textPrimary: "#0f172a",
    textSecondary: "#334155",
    accent: "#d97706",
    envelope: "#1e3a8a",
    buttonBg: "#1e3a8a",
    buttonText: "#ffffff",
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Montserrat', sans-serif",
    script: "'Great Vibes', cursive",
  },
  styles: {
    heroBackgroundBlendMode: "normal",
    heroBackgroundOpacity: "opacity-100",
  },
};

export default function GraduationAcademicTemplate({
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
      "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Great+Vibes&family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,600&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
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
        background: "linear-gradient(160deg, #f8fafc 0%, #e2e8f0 40%, #cbd5e1 100%)",
        color: config.colors.textPrimary,
        fontFamily: config.fonts.body,
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
