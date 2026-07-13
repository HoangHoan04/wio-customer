import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (section: "bride" | "groom", field: string, value: any) => void;
  slugify: (str: string) => string;
}

export const BasicInfoSection = ({
  formData,
  handleChange,
  handleNestedChange,
  slugify,
}: BasicInfoSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
        1. Thông tin cơ bản
      </h3>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-[#f5e6d3]/80">
          Đường dẫn thiệp (/thiep/___)
        </Label>
        <Input
          value={formData.slug}
          onChange={(e) => handleChange("slug", slugify(e.target.value))}
          className="bg-white/3! border-[#d4af37]/15!"
        />
      </div>

      <div className="flex items-center gap-4 bg-[#1a1012] p-2 rounded-lg w-max">
        <p className="text-base font-bold text-[#d4af37]">
          Hiển thị theo:{" "}
        </p>
        <button
          onClick={() => handleChange("displayOrder", "groom_first")}
          className={`px-4 py-2 rounded-md text-sm transition-all ${formData.displayOrder === "groom_first" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
        >
          Nhà chú rể trước
        </button>
        <button
          onClick={() => handleChange("displayOrder", "bride_first")}
          className={`px-4 py-2 rounded-md text-sm transition-all ${formData.displayOrder === "bride_first" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
        >
          Nhà cô dâu trước
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
          <span className="text-xs font-bold text-[#d4af37] uppercase">
            Chú rể
          </span>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Họ tên
            </Label>
            <Input
              value={formData.groom.name}
              onChange={(e) =>
                handleNestedChange("groom", "name", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Tên ngắn
            </Label>
            <Input
              value={formData.groom.shortName}
              onChange={(e) =>
                handleNestedChange("groom", "shortName", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Danh xưng
            </Label>
            <Input
              value={formData.groom.title}
              onChange={(e) =>
                handleNestedChange("groom", "title", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
          <span className="text-xs font-bold text-[#d4af37] uppercase">
            Cô dâu
          </span>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Họ tên
            </Label>
            <Input
              value={formData.bride.name}
              onChange={(e) =>
                handleNestedChange("bride", "name", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Tên ngắn
            </Label>
            <Input
              value={formData.bride.shortName}
              onChange={(e) =>
                handleNestedChange("bride", "shortName", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-[#f5e6d3]/80">
              Danh xưng
            </Label>
            <Input
              value={formData.bride.title}
              onChange={(e) =>
                handleNestedChange("bride", "title", e.target.value)
              }
              className="bg-white/5! border-[#d4af37]/10!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
