import Switch from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface ThankYouSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

export const ThankYouSection = ({
  formData,
  handleChange,
}: ThankYouSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
        <h3 className="text-md font-bold text-[#d4af37]">
          13. Lời cảm ơn
        </h3>
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
          placeholder="Nhập lời cảm ơn..."
          className="w-full bg-[#1f1f1f] border-[#333] text-white placeholder:text-gray-500 focus:border-[#d4af37] resize-none"
        />
      )}
    </div>
  );
};
