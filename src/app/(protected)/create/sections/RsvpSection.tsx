import Switch from "@/components/ui/switch";

interface RsvpSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

export const RsvpSection = ({
  formData,
  handleChange,
}: RsvpSectionProps) => {
  return (
    <div className="bg-[#2D231F]/8 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-2">
        <h3 className="text-md font-bold text-[#2D231F]">
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
          <span className="text-sm text-[#2D231F]/80">
            Kiểu hiển thị:
          </span>
          <div className="flex items-center gap-2 bg-[#f4f8e8] p-1.5 rounded-lg w-max">
            <button
              onClick={() => handleChange("rsvpType", "button")}
              className={`px-4 py-2 text-xs rounded-md transition-all ${formData.rsvpType === "button" ? "bg-[#2D231F] text-[#F3EDE3] font-bold" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Nút bấm (Popup)
            </button>
            <button
              onClick={() => handleChange("rsvpType", "form")}
              className={`px-4 py-2 text-xs rounded-md transition-all ${formData.rsvpType === "form" ? "bg-[#2D231F] text-[#F3EDE3] font-bold" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Form điền trực tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
