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
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5 mb-10">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">14. Nhạc nền</h3>
        <Switch
          checked={formData.showMusic}
          onChange={(val) => handleChange("showMusic", val)}
          label="Hiển thị"
        />
      </div>

      {formData.showMusic && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center justify-center gap-3 text-center p-6 bg-[#F3EDE3] rounded-xl border border-[#D9CDBE]">
            <div className="w-16 h-16 bg-[#2D231F]/10 rounded-full flex items-center justify-center">
              <Music size={28} className="text-[#2D231F]" strokeWidth={1.5} />
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
              className="mt-2 bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] text-xs px-6 py-2 rounded-full font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
            >
              <Music size={14} />
              {formData.musicUrl ? "Thay đổi nhạc" : "Chọn nhạc"}
            </Button>
          </div>

          {formData.musicUrl && (
            <div className="w-full bg-[#F3EDE3] rounded-xl p-3 border border-[#D9CDBE]">
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
