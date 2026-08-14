"use client";

import { Slider } from "@/components/ui/slider";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MusicToggleProps {
  audioSrc?: string;
  initialVolume?: number;
}

const MusicToggle = ({
  audioSrc = "/background_music.mp3",
  initialVolume = 0.3,
}: MusicToggleProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(initialVolume);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isPausedByPreview, setIsPausedByPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.volume = initialVolume;
    audioRef.current = audio;

    const handleCanPlay = () => setIsLoaded(true);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    const attemptAutoplay = async () => {
      try {
        await audio.play();
      } catch {
        //! autoplay rejected by browser policy
      }
    };
    attemptAutoplay();

    const handlePreviewStart = () => {
      if (audio && !audio.paused) {
        audio.pause();
        setIsPausedByPreview(true);
      }
    };

    const handlePreviewStop = () => {
      if (audio && audio.paused) {
        setIsPausedByPreview((prev) => {
          if (prev) {
            audio.play().catch(() => {});
          }
          return false;
        });
      }
    };

    window.addEventListener("invigo-preview-audio-start", handlePreviewStart);
    window.addEventListener("invigo-preview-audio-stop", handlePreviewStop);

    const handleExternalToggle = () => {
      if (audio) {
        if (!audio.paused) {
          audio.pause();
        } else {
          audio.play().catch(() => {});
        }
      }
    };
    window.addEventListener("invigo-toggle-canvas-audio", handleExternalToggle);

    return () => {
      audio.pause();
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      window.removeEventListener(
        "invigo-preview-audio-start",
        handlePreviewStart,
      );
      window.removeEventListener(
        "invigo-preview-audio-stop",
        handlePreviewStop,
      );
      window.removeEventListener(
        "invigo-toggle-canvas-audio",
        handleExternalToggle,
      );
      audio.src = "";
    };
  }, [audioSrc, initialVolume]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("invigo-canvas-audio-status", {
        detail: { isPlaying },
      }),
    );
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error("Error toggling music:", error);
    }
  };

  const handleMouseEnter = () => {
    if (sliderTimeoutRef.current) clearTimeout(sliderTimeoutRef.current);
    setShowVolumeSlider(true);
  };

  const handleMouseLeave = () => {
    sliderTimeoutRef.current = window.setTimeout(
      () => setShowVolumeSlider(false),
      500,
    );
  };

  const getVolumeIcon = () => {
    if (currentVolume === 0 || !isPlaying)
      return <VolumeX size={20} strokeWidth={2.5} />;
    if (currentVolume < 0.5) return <Volume1 size={20} strokeWidth={2.5} />;
    return <Volume2 size={20} strokeWidth={2.5} />;
  };

  return (
    <div
      className="fixed bottom-8 left-8 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showVolumeSlider && isLoaded && (
        <div
          className="absolute left-14 top-1/2 -translate-y-1/2 bg-linear-to-r from-[#2D231F] to-[#C4B09A] px-4 py-3 rounded-3xl shadow-lg flex items-center min-w-40 gap-3"
          style={{ animation: "slideLeft 0.2s ease-out" }}
        >
          <Slider
            min={0}
            max={1}
            step={0.05}
            value={[currentVolume]}
            onValueChange={(val) => {
              if (Array.isArray(val)) {
                setCurrentVolume(val[0]);
              } else if (typeof val === "number") {
                setCurrentVolume(val);
              }
            }}
            className="w-full h-4 flex items-center cursor-pointer"
          />
          <span className="text-[#1a1a1a] text-xs font-bold whitespace-nowrap">
            {Math.round(currentVolume * 100)}%
          </span>
        </div>
      )}

      <button
        onClick={handleToggle}
        aria-label={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
        disabled={!isLoaded}
        className="relative w-12 h-12 rounded-full border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #2D231F 0%, #C4B09A 100%)",
          boxShadow: "0 4px 20px rgba(45, 35, 31,0.45)",
        }}
      >
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full border-2 border-[#2D231F]/60 animate-pulse" />
        )}
        <span
          className={`flex items-center justify-center text-[#1a1a1a] ${isPlaying ? "animate-spin" : ""}`}
        >
          {getVolumeIcon()}
        </span>
      </button>

      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateY(-50%) translateX(-8px); }
          to { opacity: 1; transform: translateY(-50%) translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default MusicToggle;
