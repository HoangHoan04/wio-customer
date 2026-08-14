import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Switch from "@/components/ui/switch";

interface GuestbookSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

export const GuestbookSection = ({
  formData,
  handleChange,
}: GuestbookSectionProps) => {
  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">
          11. Sổ lưu bút (Lời chúc)
        </h3>
        <Switch
          checked={formData.showGuestbook}
          onChange={(val) => handleChange("showGuestbook", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showGuestbook && (
        <div className="flex flex-col gap-3 pl-2">
          <Label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#2D231F]">
            <Checkbox
              checked={formData.guestbookStatic}
              onCheckedChange={(checked) =>
                handleChange("guestbookStatic", checked)
              }
            />
            Hiển thị dạng tĩnh (Cuộn danh sách)
          </Label>
          <Label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-[#2D231F]">
            <Checkbox
              checked={formData.guestbookFloating}
              onCheckedChange={(checked) =>
                handleChange("guestbookFloating", checked)
              }
            />
            Hiển thị linh động absolute lượn trên thiệp
          </Label>
        </div>
      )}
    </div>
  );
};
