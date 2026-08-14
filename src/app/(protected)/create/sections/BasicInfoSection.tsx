import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HostFormSlot, HostRoleConfig } from "@/services/card-type.service";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";

interface BasicInfoSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (
    section: HostFormSlot,
    field: string,
    value: any,
  ) => void;
  slugify: (str: string) => string;
  hostSlots: Array<{ key: HostFormSlot; role: HostRoleConfig }>;
  showDisplayOrder?: boolean;
  formConfig?: CardTypeFormConfig;
}

export const BasicInfoSection = ({
  formData,
  handleChange,
  handleNestedChange,
  slugify,
  hostSlots,
  showDisplayOrder = false,
  formConfig,
}: BasicInfoSectionProps) => {
  const orderedSlots =
    showDisplayOrder && hostSlots.length > 1 && formData.displayOrder === "bride_first"
      ? [...hostSlots].reverse()
      : hostSlots;

  const sectionTitle = formConfig?.basicInfoTitle || "1. Thông tin cơ bản";
  const allowFamilyTitle = formConfig?.allowFamilyTitle ?? false;

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <h3 className="text-base font-bold text-[#2D231F] border-b border-[#2D231F]/10 pb-3">
        {sectionTitle}
      </h3>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-[#2D231F]/80">
          Đường dẫn thiệp (/thiep/___)
        </Label>
        <Input
          value={formData.slug}
          onChange={(e) => handleChange("slug", slugify(e.target.value))}
          className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
          placeholder="duong-dan-thiep"
        />
      </div>

      {showDisplayOrder && hostSlots.length > 1 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#F3EDE3] border border-[#D9CDBE] p-3 sm:p-2 rounded-xl w-full sm:w-max">
          <p className="text-xs sm:text-sm font-bold text-[#2D231F] shrink-0">
            Hiển thị theo:{" "}
          </p>
          <div className="flex gap-2 w-full">
            <button
              onClick={() => handleChange("displayOrder", "groom_first")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${formData.displayOrder === "groom_first" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              {hostSlots[0]?.role?.label || "Thứ nhất"} trước
            </button>
            <button
              onClick={() => handleChange("displayOrder", "bride_first")}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${formData.displayOrder === "bride_first" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              {hostSlots[1]?.role?.label || "Thứ hai"} trước
            </button>
          </div>
        </div>
      )}

      <div
        className={`grid grid-cols-1 ${hostSlots.length > 1 ? "sm:grid-cols-2" : ""} gap-4`}
      >
        {orderedSlots.map((slot) => {
          const person = formData[slot.key];
          return (
            <div
              key={slot.key}
              className="flex flex-col gap-3 p-4 bg-[#F3EDE3] rounded-xl border border-[#D9CDBE]/70"
            >
              <span className="text-xs font-bold text-[#2D231F] uppercase tracking-wide">
                {slot.role.label}
                {slot.role.required ? "" : " (tuỳ chọn)"}
              </span>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-[#2D231F]/80">
                  Họ tên
                </Label>
                <Input
                  value={person?.name || ""}
                  onChange={(e) =>
                    handleNestedChange(slot.key, "name", e.target.value)
                  }
                  placeholder={formConfig?.hostNamePlaceholder || "Nhập họ tên..."}
                  className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs font-semibold text-[#2D231F]/80">
                  Tên ngắn / Tên gọi
                </Label>
                <Input
                  value={person?.shortName || ""}
                  onChange={(e) =>
                    handleNestedChange(slot.key, "shortName", e.target.value)
                  }
                  placeholder={formConfig?.shortNamePlaceholder || "Tên gọi thường ngày..."}
                  className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
                />
              </div>
              {allowFamilyTitle && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#2D231F]/80">
                    Danh xưng (Trưởng Nam / Út Nữ)
                  </Label>
                  <Input
                    value={person?.title || ""}
                    onChange={(e) =>
                      handleNestedChange(slot.key, "title", e.target.value)
                    }
                    placeholder="VD: Trưởng Nam, Út Nữ..."
                    className="bg-white/80 border-[#D9CDBE] focus:bg-white text-[#2D231F]"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
