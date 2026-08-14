import Switch from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";

interface ThankYouSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  formConfig?: CardTypeFormConfig;
}

export const ThankYouSection = ({
  formData,
  handleChange,
  formConfig,
}: ThankYouSectionProps) => {
  const sectionTitle = formConfig?.thankYouTitle || "13. Lời cảm ơn";
  const placeholder = formConfig?.thankYouPlaceholder || "Nhập lời cảm ơn...";

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">{sectionTitle}</h3>
        <Switch
          checked={formData.showThankYou}
          onChange={(val) => handleChange("showThankYou", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showThankYou && (
        <Textarea
          value={formData.thankYouText}
          onChange={(e) => handleChange("thankYouText", e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full bg-white/80 border-[#D9CDBE] text-[#2D231F] placeholder:text-[#7A6A5C]/50 focus:bg-white focus:border-[#2D231F] resize-none rounded-xl p-3 text-sm"
        />
      )}
    </div>
  );
};
