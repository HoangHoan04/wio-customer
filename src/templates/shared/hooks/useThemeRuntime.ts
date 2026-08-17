import { useEffect, useState } from "react";

export function useEnvelopeState(isHoverPreview?: boolean) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(!!isHoverPreview);

  const openEnvelope = () => setIsEnvelopeOpen(true);

  return { isEnvelopeOpen, setIsEnvelopeOpen, openEnvelope };
}

export function useThemeAudio(data?: { musicUrl?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playMusic = () => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
    if (audio) {
      audio.volume = 0.5;
      audio.play().catch(() => undefined);
    }
    setIsPlaying(true);
  };

  const toggleAudio = () => {
    const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => undefined);
    }
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (!data?.musicUrl) return;
    const audio = document.getElementById("bg-music") as HTMLAudioElement | null;
    if (audio) audio.src = data.musicUrl;
  }, [data?.musicUrl]);

  return { isPlaying, playMusic, toggleAudio };
}

export function useThemeFonts(url?: string) {
  useEffect(() => {
    if (!url) return;
    const link = document.createElement("link");
    link.href = url;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, [url]);
}
