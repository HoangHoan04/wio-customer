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
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
        <h3 className="text-md font-bold text-[#d4af37]">
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
          <span className="text-sm text-[#f5e6d3]/80">
            Kiểu hiển thị:
          </span>
          <div className="flex items-center gap-2 bg-[#1a1012] p-1.5 rounded-lg w-max">
            <button
              onClick={() => handleChange("rsvpType", "button")}
              className={`px-4 py-2 text-xs rounded-md transition-all ${formData.rsvpType === "button" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
            >
              Nút bấm (Popup)
            </button>
            <button
              onClick={() => handleChange("rsvpType", "form")}
              className={`px-4 py-2 text-xs rounded-md transition-all ${formData.rsvpType === "form" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
            >
              Form điền trực tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
