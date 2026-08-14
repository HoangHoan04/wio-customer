import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";
import { Plus, Trash2 } from "lucide-react";

interface EventsSectionProps {
  formData: any;
  addEvent: () => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, field: string, value: string) => void;
  formConfig?: CardTypeFormConfig;
}

export const EventsSection = ({
  formData,
  addEvent,
  removeEvent,
  updateEvent,
  formConfig,
}: EventsSectionProps) => {
  const sectionTitle = formConfig?.eventsTitle || "5. Lễ (Sự kiện chính)";
  const isWedding = formConfig?.code === "WEDDING";

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <h3 className="text-base font-bold text-[#2D231F] border-b border-[#2D231F]/10 pb-3">
        {sectionTitle}
      </h3>
      <div className="flex flex-col gap-4">
        {formData.events.map((event: any, idx: number) => (
          <div
            key={event.id}
            className="p-4 bg-[#F3EDE3] border border-[#D9CDBE]/70 rounded-xl relative flex flex-col gap-3.5 shadow-2xs"
          >
            <div
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 cursor-pointer p-1 rounded-md hover:bg-red-500/10 transition-colors"
              onClick={() => removeEvent(event.id)}
              title="Xóa sự kiện"
            >
              <Trash2 size={16} />
            </div>
            <span className="text-xs font-bold text-[#2D231F] uppercase tracking-wide">
              {isWedding ? `Lễ ${idx + 1}` : `Sự kiện ${idx + 1}`}
            </span>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
                {isWedding ? "Tiêu đề lễ (vd: Lễ Ăn Hỏi, Lễ Vu Quy...)" : "Tiêu đề sự kiện (vd: Đón tiếp, Khai mạc, Khai tiệc...)"}
              </Label>
              <Input
                value={event.title}
                onChange={(e) => updateEvent(event.id, "title", e.target.value)}
                placeholder={isWedding ? "VD: Lễ Ăn Hỏi" : "VD: Khai mạc / Đón khách"}
                className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-[#2D231F]/80">
                  Ngày tổ chức
                </Label>
                <DatePicker
                  value={event.date}
                  onChange={(val) => updateEvent(event.id, "date", val)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-[#2D231F]/80">
                  Giờ tổ chức
                </Label>
                <TimePicker
                  value={event.time}
                  onChange={(val) => updateEvent(event.id, "time", val)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
                Địa chỉ tổ chức
              </Label>
              <Input
                value={event.address}
                onChange={(e) =>
                  updateEvent(event.id, "address", e.target.value)
                }
                className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={addEvent}
          className="w-full border-dashed border-[#2D231F]/30 bg-[#F3EDE3] text-[#2D231F] hover:bg-[#E2D6C6] py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer"
        >
          <Plus size={16} /> Thêm Lễ
        </Button>
      </div>
    </div>
  );
};
