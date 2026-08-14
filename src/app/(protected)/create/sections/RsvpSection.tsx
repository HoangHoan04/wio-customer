import Switch from "@/components/ui/switch";

interface RsvpSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

export const RsvpSection = ({ formData, handleChange }: RsvpSectionProps) => {
  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">
          10. Xác nhận tham dự (RSVP)
        </h3>
        <Switch
          checked={formData.showRsvp}
          onChange={(val) => handleChange("showRsvp", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showRsvp && (
        <div className="flex flex-col gap-3">
          <span className="text-xs sm:text-sm font-semibold text-[#2D231F]/80">Kiểu hiển thị:</span>
          <div className="flex items-center gap-2 bg-[#F3EDE3] border border-[#D9CDBE] p-1.5 rounded-xl w-max">
            <button
              onClick={() => handleChange("rsvpType", "button")}
              className={`px-4 py-2 text-xs rounded-lg font-semibold transition-all cursor-pointer ${formData.rsvpType === "button" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Nút bấm (Popup)
            </button>
            <button
              onClick={() => handleChange("rsvpType", "form")}
              className={`px-4 py-2 text-xs rounded-lg font-semibold transition-all cursor-pointer ${formData.rsvpType === "form" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Form điền trực tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
