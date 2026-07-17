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

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#1a1012] p-3 sm:p-2 rounded-lg w-full sm:w-max">
        <p className="text-sm font-bold text-[#d4af37] shrink-0">
          Hiển thị theo:{" "}
        </p>
        <div className="flex gap-2 w-full">
          <button
            onClick={() => handleChange("displayOrder", "groom_first")}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm transition-all cursor-pointer ${formData.displayOrder === "groom_first" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
          >
            Nhà chú rể trước
          </button>
          <button
            onClick={() => handleChange("displayOrder", "bride_first")}
            className={`flex-1 sm:flex-none px-3 py-2 rounded-md text-xs sm:text-sm transition-all cursor-pointer ${formData.displayOrder === "bride_first" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
          >
            Nhà cô dâu trước
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(formData.displayOrder === "bride_first" ? ["bride", "groom"] : ["groom", "bride"]).map((type) => {
          if (type === "groom") {
            return (
              <div key="groom" className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
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
            );
          } else {
            return (
              <div key="bride" className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
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
            );
          }
        })}
      </div>
    </div>
  );
};
