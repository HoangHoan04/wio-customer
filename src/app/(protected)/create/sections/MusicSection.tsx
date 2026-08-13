import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/switch";
import { Music } from "lucide-react";

interface MusicSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onOpenMusicModal: () => void;
  onPlay: () => void;
  onPause: () => void;
}

export const MusicSection = ({
  formData,
  handleChange,
  onOpenMusicModal,
  onPlay,
  onPause,
}: MusicSectionProps) => {
  return (
    <div className="bg-[#2D231F]/8 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5 mb-10">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-2">
        <h3 className="text-md font-bold text-[#2D231F]">14. Nhạc nền</h3>
        <Switch
          checked={formData.showMusic}
          onChange={(val) => handleChange("showMusic", val)}
          label="Hiển thị"
        />
      </div>

      {formData.showMusic && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-3 text-center p-6 bg-[#f4f8e8] rounded-xl border border-[#2D231F]/10">
            <div className="w-16 h-16 bg-[#2D231F]/10 rounded-full flex items-center justify-center">
              <Music
                size={28}
                className="text-[#7A6A5C]"
                strokeWidth={1.5}
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D231F]">
                {formData.musicName || "Chưa chọn nhạc nền"}
              </p>
              <p className="text-xs text-[#2D231F]/60 mt-1">
                {formData.musicUrl
                  ? "Đang phát nhạc mp3"
                  : "Thêm giai điệu cho khoảnh khắc của bạn"}
              </p>
            </div>
            <Button
              onClick={onOpenMusicModal}
              className="mt-2 bg-[#2D231F] text-[#F3EDE3] hover:bg-[#C4B09A] text-xs px-6 py-2 rounded-full font-bold flex items-center gap-2"
            >
              <Music size={14} />
              {formData.musicUrl ? "Thay đổi nhạc" : "Chọn nhạc"}
            </Button>
          </div>

          {formData.musicUrl && (
            <div className="w-full bg-[#f4f8e8] rounded-xl p-3 border border-[#2D231F]/20">
              <audio
                controls
                controlsList="nodownload"
                src={formData.musicUrl}
                className="w-full h-8"
                onPlay={onPlay}
                onPause={onPause}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
