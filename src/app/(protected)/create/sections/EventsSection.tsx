import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TimePicker } from "@/components/ui/time-picker";
import { Plus, Trash2 } from "lucide-react";

interface EventsSectionProps {
  formData: any;
  addEvent: () => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, field: string, value: string) => void;
}

export const EventsSection = ({
  formData,
  addEvent,
  removeEvent,
  updateEvent,
}: EventsSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
        5. Lễ (Sự kiện chính)
      </h3>
      <div className="flex flex-col gap-4">
        {formData.events.map((event: any, idx: number) => (
          <div
            key={event.id}
            className="p-4 bg-white/3 border border-[#d4af37]/20 rounded-lg relative flex flex-col gap-3"
          >
            <div
              className="absolute top-3 right-3 text-red-400 hover:text-red-500 cursor-pointer"
              onClick={() => removeEvent(event.id)}
            >
              <Trash2 size={16} />
            </div>
            <span className="text-xs font-bold text-[#f5c842]">
              Lễ {idx + 1}
            </span>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                Tiêu đề lễ (vd: Lễ Ăn Hỏi)
              </Label>
              <Input
                value={event.title}
                onChange={(e) =>
                  updateEvent(event.id, "title", e.target.value)
                }
                className="bg-white/5! border-[#d4af37]/10!"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                  Ngày tổ chức
                </Label>
                <DatePicker
                  value={event.date}
                  onChange={(val) => updateEvent(event.id, "date", val)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                  Giờ tổ chức
                </Label>
                <TimePicker
                  value={event.time}
                  onChange={(val) => updateEvent(event.id, "time", val)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                Địa chỉ tổ chức
              </Label>
              <Input
                value={event.address}
                onChange={(e) =>
                  updateEvent(event.id, "address", e.target.value)
                }
                className="bg-white/5! border-[#d4af37]/10!"
              />
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={addEvent}
          className="w-full border-dashed border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 py-3 rounded-lg flex items-center justify-center gap-2 text-sm"
        >
          <Plus size={16} /> Thêm Lễ
        </Button>
      </div>
    </div>
  );
};
