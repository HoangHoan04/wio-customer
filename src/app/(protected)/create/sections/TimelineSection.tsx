import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Switch from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import { Plus, Trash2 } from "lucide-react";

interface TimelineSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  addTimeline: () => void;
  removeTimeline: (id: string) => void;
  updateTimeline: (id: string, field: string, value: string) => void;
}

export const TimelineSection = ({
  formData,
  handleChange,
  addTimeline,
  removeTimeline,
  updateTimeline,
}: TimelineSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
        <h3 className="text-md font-bold text-[#d4af37]">
          9. Lịch trình ngày cưới
        </h3>
        <Switch
          checked={formData.showTimeline}
          onChange={(val) => handleChange("showTimeline", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showTimeline && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Tiêu đề lịch trình
            </Label>
            <Input
              value={formData.timelineTitle}
              onChange={(e) =>
                handleChange("timelineTitle", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
          <div className="flex flex-col gap-3">
            {formData.timeline.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white/5 p-2 border border-white/10 rounded-lg"
              >
                <div className="w-28 sm:w-40 shrink-0">
                  <TimePicker
                    value={item.time}
                    onChange={(val) => updateTimeline(item.id, "time", val)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    value={item.title}
                    placeholder="Nội dung..."
                    onChange={(e) =>
                      updateTimeline(item.id, "title", e.target.value)
                    }
                    className="h-10! bg-transparent! border-none!"
                  />
                </div>
                <button
                  onClick={() => removeTimeline(item.id)}
                  className="p-2 text-red-400 hover:text-red-500 rounded-md bg-white/5 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addTimeline}
              className="w-full border-dashed border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 py-3 rounded-lg flex items-center justify-center gap-2 text-sm"
            >
              <Plus size={16} /> Thêm hoạt động
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
