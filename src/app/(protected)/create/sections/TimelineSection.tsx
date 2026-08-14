import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Switch from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";
import { Plus, Trash2 } from "lucide-react";

interface TimelineSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  addTimeline: () => void;
  removeTimeline: (id: string) => void;
  updateTimeline: (id: string, field: string, value: string) => void;
  formConfig?: CardTypeFormConfig;
}

export const TimelineSection = ({
  formData,
  handleChange,
  addTimeline,
  removeTimeline,
  updateTimeline,
  formConfig,
}: TimelineSectionProps) => {
  const sectionTitle = formConfig?.timelineTitle || "9. Lịch trình";

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">{sectionTitle}</h3>
        <Switch
          checked={formData.showTimeline}
          onChange={(val) => handleChange("showTimeline", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showTimeline && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#2D231F]/80">
              Tiêu đề lịch trình
            </Label>
            <Input
              value={formData.timelineTitle}
              onChange={(e) => handleChange("timelineTitle", e.target.value)}
              className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
            />
          </div>
          <div className="flex flex-col gap-3">
            {formData.timeline.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-[#F3EDE3] p-2.5 border border-[#D9CDBE] rounded-xl shadow-2xs"
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
                    placeholder="Nội dung hoạt động..."
                    onChange={(e) =>
                      updateTimeline(item.id, "title", e.target.value)
                    }
                    className="h-10! bg-white/70! border-[#D9CDBE]! focus:bg-white! text-[#2D231F]"
                  />
                </div>
                <button
                  onClick={() => removeTimeline(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer"
                  title="Xóa hoạt động"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addTimeline}
              className="w-full border-dashed border-[#2D231F]/30 bg-[#F3EDE3] text-[#2D231F] hover:bg-[#E2D6C6] py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
            >
              <Plus size={16} /> Thêm hoạt động
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
