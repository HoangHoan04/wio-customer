"use client";

import { useToast } from "@/hooks/useToast";
import { musicBackgroundService } from "@/services/music-background.service";
import { uploadService } from "@/services/upload.service";
import {
  Scissors,
  Play,
  Pause,
  X,
  Loader2,
  Flame,
  Music2,
  Sparkles,
} from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import Button from "../ui/button/Button";

interface AudioItem {
  id: string;
  name: string;
  url?: string;
  duration: string;
  source?: "admin" | "user";
}

interface AudioTrimmerModalProps {
  song: AudioItem;
  onClose: () => void;
  onSuccess: () => void;
}

interface DetectedSection {
  label: string;
  start: number;
  end: number;
  icon: any;
  description: string;
  color: string;
}

export default function AudioTrimmerModal({
  song,
  onClose,
  onSuccess,
}: AudioTrimmerModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState("");
  const [saving, setSaving] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const playSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startTimeRef = useRef<number>(0);
  const startOffsetRef = useRef<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [trimStart, setTrimStart] = useState<number>(0);
  const [trimEnd, setTrimEnd] = useState<number>(0);
  const [currentPlayTime, setCurrentPlayTime] = useState<number>(0);
  const [detectedSections, setDetectedSections] = useState<DetectedSection[]>(
    [],
  );
  const [activeSectionIdx, setActiveSectionIdx] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const getAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }
    return audioContextRef.current;
  };

  const bufferToWav = (buffer: AudioBuffer) => {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArr = new ArrayBuffer(length);
    const view = new DataView(bufferArr);
    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    const setUint16 = (data: number) => {
      view.setUint16(pos, data, true);
      pos += 2;
    };

    const setUint32 = (data: number) => {
      view.setUint32(pos, data, true);
      pos += 4;
    };

    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);

    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([bufferArr], { type: "audio/wav" });
  };

  const sliceAudioBuffer = (
    originalBuffer: AudioBuffer,
    startSec: number,
    endSec: number,
  ): AudioBuffer => {
    const ctx = getAudioContext();
    const rate = originalBuffer.sampleRate;
    const startSample = Math.floor(startSec * rate);
    const endSample = Math.floor(endSec * rate);
    const frameCount = endSample - startSample;

    const slicedBuffer = ctx.createBuffer(
      originalBuffer.numberOfChannels,
      frameCount,
      rate,
    );

    for (
      let channel = 0;
      channel < originalBuffer.numberOfChannels;
      channel++
    ) {
      const originalData = originalBuffer.getChannelData(channel);
      const slicedData = slicedBuffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        slicedData[i] = originalData[startSample + i];
      }
    }

    return slicedBuffer;
  };

  const stopPlayback = useCallback(() => {
    if (playSourceRef.current) {
      try {
        playSourceRef.current.stop();
      } catch {
        //! Ignore already stopped
      }
      playSourceRef.current.disconnect();
      playSourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(
    (offsetSec: number) => {
      stopPlayback();
      const ctx = getAudioContext();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      if (!audioBufferRef.current) return;

      const source = ctx.createBufferSource();
      source.buffer = audioBufferRef.current;
      source.connect(ctx.destination);

      const playDuration = Math.max(0, trimEnd - offsetSec);
      if (playDuration <= 0) return;

      source.start(0, offsetSec, playDuration);
      playSourceRef.current = source;
      setIsPlaying(true);
      startTimeRef.current = ctx.currentTime;
      startOffsetRef.current = offsetSec;
      setCurrentPlayTime(offsetSec);

      source.onended = () => {
        if (playSourceRef.current === source) {
          setIsPlaying(false);
          setCurrentPlayTime(trimStart);
          startOffsetRef.current = trimStart;
        }
      };
    },
    [trimStart, trimEnd, stopPlayback],
  );

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      const ctx = getAudioContext();
      const elapsed = ctx.currentTime - startTimeRef.current;
      const currentOffset = startOffsetRef.current + elapsed;
      stopPlayback();
      if (currentOffset >= trimEnd) {
        startOffsetRef.current = trimStart;
        setCurrentPlayTime(trimStart);
      } else {
        startOffsetRef.current = currentOffset;
        setCurrentPlayTime(currentOffset);
      }
    } else {
      let playFrom = startOffsetRef.current;
      if (playFrom < trimStart || playFrom >= trimEnd) {
        playFrom = trimStart;
      }
      startPlayback(playFrom);
    }
  }, [isPlaying, trimStart, trimEnd, startPlayback, stopPlayback]);

  const detectSectionsFromBuffer = (buffer: AudioBuffer) => {
    const totalSec = buffer.duration;
    const rate = buffer.sampleRate;
    const channelData = buffer.getChannelData(0);
    const chunkSize = 2;
    const samplesPerChunk = rate * chunkSize;
    const totalChunks = Math.floor(buffer.length / samplesPerChunk);

    const rmsList: {
      index: number;
      start: number;
      end: number;
      rms: number;
    }[] = [];
    let maxRms = 0;

    for (let i = 0; i < totalChunks; i++) {
      const startSample = i * samplesPerChunk;
      let sum = 0;
      for (let s = 0; s < samplesPerChunk; s++) {
        const val = channelData[startSample + s] || 0;
        sum += val * val;
      }
      const rms = Math.sqrt(sum / samplesPerChunk);
      if (rms > maxRms) maxRms = rms;

      rmsList.push({
        index: i,
        start: i * chunkSize,
        end: (i + 1) * chunkSize,
        rms,
      });
    }

    if (maxRms === 0) return;

    let introEnd = 0;
    const introThreshold = maxRms * 0.25;
    for (let i = 0; i < rmsList.length; i++) {
      if (rmsList[i].rms > introThreshold) {
        introEnd = rmsList[i].start;
        break;
      }
    }
    introEnd = Math.min(introEnd, 45, totalSec * 0.25);
    if (introEnd < 4) introEnd = 0;

    const energyThreshold = maxRms * 0.65;
    const highEnergySegments: { start: number; end: number; avgRms: number }[] =
      [];
    let currentSegment: any = null;

    rmsList.forEach((chunk) => {
      if (chunk.rms >= energyThreshold) {
        if (!currentSegment) {
          currentSegment = {
            start: chunk.start,
            end: chunk.end,
            sumRms: chunk.rms,
            count: 1,
          };
        } else {
          currentSegment.end = chunk.end;
          currentSegment.sumRms += chunk.rms;
          currentSegment.count += 1;
        }
      } else {
        if (currentSegment) {
          if (currentSegment.end - currentSegment.start >= 12) {
            highEnergySegments.push({
              start: currentSegment.start,
              end: currentSegment.end,
              avgRms: currentSegment.sumRms / currentSegment.count,
            });
          }
          currentSegment = null;
        }
      }
    });
    if (currentSegment && currentSegment.end - currentSegment.start >= 12) {
      highEnergySegments.push({
        start: currentSegment.start,
        end: currentSegment.end,
        avgRms: currentSegment.sumRms / currentSegment.count,
      });
    }

    const sections: DetectedSection[] = [];

    if (introEnd > 5) {
      sections.push({
        label: "Dạo nhạc",
        start: 0,
        end: Math.round(introEnd),
        icon: Music2,
        description: "Phần nhạc khởi đầu nhẹ nhàng",
        color:
          "from-blue-500/20 to-blue-500/40 border-blue-500/50 text-blue-400",
      });
    }

    if (highEnergySegments.length > 0) {
      const firstChorus = highEnergySegments[0];
      sections.push({
        label: "Điệp khúc 1",
        start: Math.round(firstChorus.start),
        end: Math.round(firstChorus.end),
        icon: Flame,
        description: "Điệp khúc / Đoạn sôi động đầu tiên",
        color:
          "from-orange-500/20 to-orange-500/40 border-orange-500/50 text-orange-400",
      });

      const lastChorus = highEnergySegments[highEnergySegments.length - 1];
      if (
        lastChorus !== firstChorus &&
        lastChorus.start - firstChorus.end > 20
      ) {
        sections.push({
          label: "Cao trào cuối",
          start: Math.round(lastChorus.start),
          end: Math.round(lastChorus.end),
          icon: Sparkles,
          description: "Đoạn điệp khúc/cao trào cuối bài",
          color:
            "from-amber-500/20 to-amber-500/40 border-amber-500/50 text-amber-400",
        });
      }
    }

    setDetectedSections(sections);
  };

  useEffect(() => {
    if (!song.url) {
      showToast({
        title: "Lỗi",
        message: "Không tìm thấy URL bài hát",
        type: "error",
      });
      onClose();
      return;
    }

    setLoading(true);
    setLoadingProgress("Đang tải dữ liệu âm thanh...");

    const abortController = new AbortController();
    let isMounted = true;

    const loadAudio = async () => {
      try {
        const separator = song.url!.includes("?") ? "&" : "?";
        const cleanUrl = `${song.url!}${separator}t=${Date.now()}`;

        console.log("[AudioTrimmer] Bắt đầu tải nhạc từ URL:", cleanUrl);

        const response = await fetch(cleanUrl, {
          signal: abortController.signal,
          cache: "no-cache",
        });

        console.log("[AudioTrimmer] Phản hồi từ server:", {
          status: response.status,
          statusText: response.statusText,
          headersContentType: response.headers.get("content-type"),
        });

        if (!response.ok)
          throw new Error(`Không thể tải nhạc. HTTP Code: ${response.status}`);

        if (!isMounted) {
          console.log(
            "[AudioTrimmer] Component đã bị unmount trước khi nhận được phản hồi",
          );
          return;
        }

        setLoadingProgress("Đang giải mã âm thanh...");
        console.log("[AudioTrimmer] Bắt đầu đọc ArrayBuffer...");
        const arrayBuffer = await response.arrayBuffer();
        console.log(
          "[AudioTrimmer] Đọc ArrayBuffer thành công. Kích thước (bytes):",
          arrayBuffer.byteLength,
        );

        if (!isMounted) return;
        const ctx = getAudioContext();
        console.log("[AudioTrimmer] AudioContext State hiện tại:", ctx.state);

        console.log(
          "[AudioTrimmer] Bắt đầu giải mã âm thanh (decodeAudioData)...",
        );
        const decodedBuffer = await new Promise<AudioBuffer>(
          (resolve, reject) => {
            ctx.decodeAudioData(
              arrayBuffer,
              (buffer) => {
                console.log("[AudioTrimmer] Giải mã thành công!");
                resolve(buffer);
              },
              (err) => {
                console.error(
                  "[AudioTrimmer] Lỗi xảy ra trong lúc giải mã decodeAudioData:",
                  err,
                );
                reject(err);
              },
            );
          },
        );

        if (!isMounted) return;
        audioBufferRef.current = decodedBuffer;
        const dur = decodedBuffer.duration;
        console.log(
          "[AudioTrimmer] Chi tiết file âm thanh giải mã thành công:",
          {
            durationSeconds: dur,
            sampleRate: decodedBuffer.sampleRate,
            numberOfChannels: decodedBuffer.numberOfChannels,
            length: decodedBuffer.length,
          },
        );

        setDuration(dur);
        setTrimStart(0);
        setTrimEnd(Math.min(30, dur));
        startOffsetRef.current = 0;

        setLoadingProgress("Đang nhận diện các đoạn nhạc...");
        console.log("[AudioTrimmer] Bắt đầu phân tích cấu trúc bài hát...");
        detectSectionsFromBuffer(decodedBuffer);
        console.log("[AudioTrimmer] Phân tích cấu trúc hoàn tất!");

        setLoading(false);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log(
            "[AudioTrimmer] Tiến trình tải nhạc bị huỷ bỏ (AbortError)",
          );
          return;
        }

        console.error(
          "[AudioTrimmer] Gặp lỗi nghiêm trọng trong tiến trình loadAudio:",
          err,
        );
        if (isMounted) {
          showToast({
            title: "Lỗi tải nhạc",
            message: `Lỗi: ${err.message || "Tệp nhạc lỗi hoặc bị chặn CORS"}`,
            type: "error",
          });
          onClose();
        }
      }
    };

    loadAudio();

    return () => {
      isMounted = false;
      abortController.abort();
      stopPlayback();
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [song.url]);

  useEffect(() => {
    let intervalId: any;
    if (isPlaying) {
      const ctx = getAudioContext();
      intervalId = setInterval(() => {
        const elapsed = ctx.currentTime - startTimeRef.current;
        const current = startOffsetRef.current + elapsed;

        if (current >= trimEnd) {
          stopPlayback();
          startOffsetRef.current = trimStart;
          setCurrentPlayTime(trimStart);
        } else {
          setCurrentPlayTime(current);
        }
      }, 50);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, trimStart, trimEnd, stopPlayback]);

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !audioBufferRef.current) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const buffer = audioBufferRef.current;
    const channelData = buffer.getChannelData(0);
    const totalSamples = buffer.length;

    const barCount = 140;
    const barWidth = 3;
    const barGap = 2;
    const step = Math.floor(totalSamples / barCount);

    const peaks: number[] = [];
    for (let i = 0; i < barCount; i++) {
      const start = i * step;
      let maxVal = 0;
      for (let j = 0; j < step; j += 10) {
        const val = Math.abs(channelData[start + j] || 0);
        if (val > maxVal) maxVal = val;
      }
      peaks.push(maxVal);
    }

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + barGap);
      const val = peaks[i];
      const barHeight = Math.max(4, val * height * 0.95);
      const y = (height - barHeight) / 2;

      const barTime = (i / barCount) * duration;

      const isSelected = barTime >= trimStart && barTime <= trimEnd;
      const isPlayed =
        isPlaying && barTime >= trimStart && barTime <= currentPlayTime;

      if (isPlayed) {
        ctx.fillStyle = "#f5c842";
      } else if (isSelected) {
        ctx.fillStyle = "#d4af37";
      } else {
        ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      }

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    animationFrameRef.current = requestAnimationFrame(drawWaveform);
  }, [duration, trimStart, trimEnd, currentPlayTime, isPlaying]);

  useEffect(() => {
    if (!loading && canvasRef.current && audioBufferRef.current) {
      animationFrameRef.current = requestAnimationFrame(drawWaveform);
    }
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [loading, drawWaveform]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const clickedTime = percentage * duration;

    if (clickedTime >= trimStart && clickedTime <= trimEnd) {
      startOffsetRef.current = clickedTime;
      setCurrentPlayTime(clickedTime);
      if (isPlaying) {
        startPlayback(clickedTime);
      }
    }
  };

  const handleSectionSelect = (idx: number, start: number, end: number) => {
    setActiveSectionIdx(idx);
    setTrimStart(start);
    setTrimEnd(end);
    startOffsetRef.current = start;
    setCurrentPlayTime(start);
    startPlayback(start);
  };

  const handleDragStart =
    (type: "start" | "end") => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const isTouch = "touches" in e;
      const startX = isTouch
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX;
      const initialVal = type === "start" ? trimStart : trimEnd;
      const container = canvasRef.current?.parentElement;
      if (!container) return;
      const rect = container.getBoundingClientRect();

      const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX =
          "touches" in moveEvent
            ? (moveEvent as TouchEvent).touches[0].clientX
            : (moveEvent as MouseEvent).clientX;
        const deltaX = currentX - startX;
        const deltaPercent = deltaX / rect.width;
        const deltaSec = deltaPercent * duration;
        let newVal = initialVal + deltaSec;

        if (type === "start") {
          newVal = Math.max(0, Math.min(newVal, trimEnd - 3));
          setTrimStart(newVal);
          startOffsetRef.current = newVal;
          setCurrentPlayTime(newVal);
        } else {
          newVal = Math.max(trimStart + 3, Math.min(newVal, duration));
          setTrimEnd(newVal);
        }
        setActiveSectionIdx(null);
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("touchmove", handleMouseMove);
        window.removeEventListener("touchend", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove, { passive: true });
      window.addEventListener("touchend", handleMouseUp);
    };

  const handleCutAudio = async () => {
    if (!audioBufferRef.current) return;

    stopPlayback();
    setSaving(true);

    try {
      const cutDuration = trimEnd - trimStart;
      if (cutDuration < 3) {
        showToast({
          title: "Lỗi",
          message: "Độ dài đoạn nhạc cắt phải tối thiểu 3 giây",
          type: "error",
        });
        setSaving(false);
        return;
      }

      const slicedBuffer = sliceAudioBuffer(
        audioBufferRef.current,
        trimStart,
        trimEnd,
      );
      const wavBlob = bufferToWav(slicedBuffer);

      const formattedStart = formatSeconds(trimStart).replace(":", "m");
      const cutName = `[Cắt từ ${formattedStart}] ${song.name.substring(0, 30)}`;
      const file = new File([wavBlob], `${cutName}.wav`, { type: "audio/wav" });

      const res = await uploadService.uploadAudio(file);
      const fileUrl = res?.fileUrl;

      if (!fileUrl) {
        throw new Error("Không lấy được URL file đã tải lên");
      }

      await musicBackgroundService.createUserMusic({
        name: cutName,
        audioUrl: fileUrl,
        duration: formatSeconds(cutDuration),
      });

      showToast({
        title: "Thành công",
        message: "Đã cắt và lưu nhạc thành công",
        type: "success",
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Cut audio failed", err);
      showToast({
        title: "Lỗi lưu file",
        message: err.message || "Không thể cắt hoặc upload file nhạc",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
      <div className="bg-[#18181b] border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/60">
          <div className="flex items-center gap-2">
            <Scissors className="text-amber-400" size={18} />
            <h3 className="text-base font-semibold text-zinc-100">Cắt nhạc</h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 space-y-4">
            <Loader2 className="text-amber-400 animate-spin" size={32} />
            <p className="text-xs text-zinc-400">{loadingProgress}</p>
          </div>
        ) : (
          <div className="p-5 space-y-5">
            <div className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800/40">
              <p className="text-xs font-semibold text-zinc-400 mb-1 uppercase tracking-wider">
                Bài gốc
              </p>
              <h4 className="text-sm font-medium text-amber-400 truncate">
                {song.name}
              </h4>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                Thời lượng gốc: {formatSeconds(duration)}
              </p>
            </div>

            <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5 flex flex-col items-center select-none">
              <div className="relative w-full h-20 overflow-hidden rounded-lg bg-zinc-900/30">
                <canvas
                  ref={canvasRef}
                  width={700}
                  height={80}
                  onClick={handleCanvasClick}
                  className="w-full h-full cursor-pointer"
                />

                <div
                  className="absolute left-0 top-0 bottom-0 bg-black/60 pointer-events-none border-r border-amber-500/30"
                  style={{
                    width: `${duration ? (trimStart / duration) * 100 : 0}%`,
                  }}
                />

                <div
                  className="absolute right-0 top-0 bottom-0 bg-black/60 pointer-events-none border-l border-amber-500/30"
                  style={{
                    left: `${duration ? (trimEnd / duration) * 100 : 100}%`,
                  }}
                />

                {isPlaying && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                    style={{
                      left: `${duration ? (currentPlayTime / duration) * 100 : 0}%`,
                    }}
                  />
                )}

                <div
                  onMouseDown={handleDragStart("start")}
                  onTouchStart={handleDragStart("start")}
                  className="absolute top-0 bottom-0 w-6 -ml-3 cursor-col-resize z-20 flex items-center justify-center group"
                  style={{
                    left: `${duration ? (trimStart / duration) * 100 : 0}%`,
                  }}
                >
                  <div className="w-1 h-full bg-amber-400 group-hover:bg-amber-300 transition-colors shadow-lg" />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-6 rounded-md bg-amber-500 border border-zinc-900 shadow-md group-hover:bg-amber-400 flex flex-col items-center justify-center gap-0.5">
                    <div className="w-0.5 h-2 bg-zinc-950 rounded-full" />
                  </div>
                </div>

                <div
                  onMouseDown={handleDragStart("end")}
                  onTouchStart={handleDragStart("end")}
                  className="absolute top-0 bottom-0 w-6 -ml-3 cursor-col-resize z-20 flex items-center justify-center group"
                  style={{
                    left: `${duration ? (trimEnd / duration) * 100 : 100}%`,
                  }}
                >
                  <div className="w-1 h-full bg-amber-400 group-hover:bg-amber-300 transition-colors shadow-lg" />
                  <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-6 rounded-md bg-amber-500 border border-zinc-900 shadow-md group-hover:bg-amber-400 flex flex-col items-center justify-center gap-0.5">
                    <div className="w-0.5 h-2 bg-zinc-950 rounded-full" />
                  </div>
                </div>
              </div>

              <div className="w-full mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-mono bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                    Bắt đầu: {formatSeconds(trimStart)}
                  </span>
                  <span className="font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    Thời lượng cắt: {formatSeconds(trimEnd - trimStart)}
                  </span>
                  <span className="font-mono bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                    Kết thúc: {formatSeconds(trimEnd)}
                  </span>
                </div>
              </div>
            </div>

            {detectedSections.length > 0 && (
              <div className="space-y-2">
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  Chọn nhanh đoạn nhạc nổi bật
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {detectedSections.map((sec, idx) => {
                    const Icon = sec.icon;
                    const isActive = activeSectionIdx === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() =>
                          handleSectionSelect(idx, sec.start, sec.end)
                        }
                        className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                          isActive
                            ? "bg-amber-500/10 border-amber-400 text-amber-400 ring-1 ring-amber-400/30"
                            : `bg-zinc-900 border-zinc-800/80 hover:border-zinc-700 text-zinc-300`
                        }`}
                      >
                        <Icon size={14} className="mb-1" />
                        <span className="text-xs font-semibold">
                          {sec.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 mt-0.5">
                          {formatSeconds(sec.start)} - {formatSeconds(sec.end)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 rounded-full bg-zinc-900 hover:bg-zinc-800 text-amber-400 flex items-center justify-center transition-all border border-zinc-800 active:scale-95 shrink-0"
                title={isPlaying ? "Tạm dừng nghe thử" : "Nghe thử đoạn cắt"}
              >
                {isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  buttonSize="sm"
                  onClick={onClose}
                  disabled={saving}
                  className="px-4! border-zinc-800! text-zinc-400! hover:text-zinc-200!"
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  buttonSize="sm"
                  onClick={handleCutAudio}
                  loading={saving}
                  disabled={saving}
                  className="px-4!"
                >
                  <Scissors size={14} />
                  Cắt & Lưu
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
