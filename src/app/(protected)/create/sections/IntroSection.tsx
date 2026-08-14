import Switch from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";

interface IntroSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  formConfig?: CardTypeFormConfig;
}

export const IntroSection = ({
  formData,
  handleChange,
  formConfig,
}: IntroSectionProps) => {
  const sectionTitle = formConfig?.introTitle || "4. Lời mở đầu thiệp";
  const placeholder = formConfig?.introPlaceholder || "Nhập lời mở đầu...";

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">{sectionTitle}</h3>
        <Switch
          checked={formData.showIntro}
          onChange={(val) => handleChange("showIntro", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showIntro && (
        <Textarea
          value={formData.introText}
          onChange={(e) => handleChange("introText", e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-white/80 border-[#D9CDBE] text-[#2D231F] placeholder:text-[#7A6A5C]/50 focus:bg-white focus:border-[#2D231F] resize-none rounded-xl p-3 text-sm"
        />
      )}
    </div>
  );
};
