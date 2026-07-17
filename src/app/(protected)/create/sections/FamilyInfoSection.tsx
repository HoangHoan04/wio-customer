import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FamilyInfoSectionProps {
  formData: any;
  handleNestedChange: (section: "bride" | "groom", field: string, value: any) => void;
}

export const FamilyInfoSection = ({
  formData,
  handleNestedChange,
}: FamilyInfoSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
        3. Thông tin gia đình
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(formData.displayOrder === "bride_first" ? ["bride", "groom"] : ["groom", "bride"]).map((type) => {
          if (type === "groom") {
            return (
              <div key="groom" className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#d4af37] uppercase">
                  Nhà Trai
                </span>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Danh xưng
                  </Label>
                  <Input
                    value={formData.groom.familyTitle}
                    onChange={(e) =>
                      handleNestedChange("groom", "familyTitle", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Họ tên bố
                  </Label>
                  <Input
                    value={formData.groom.father}
                    onChange={(e) =>
                      handleNestedChange("groom", "father", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Họ tên mẹ
                  </Label>
                  <Input
                    value={formData.groom.mother}
                    onChange={(e) =>
                      handleNestedChange("groom", "mother", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Địa chỉ nhà trai
                  </Label>
                  <Input
                    value={formData.groom.address}
                    onChange={(e) =>
                      handleNestedChange("groom", "address", e.target.value)
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
                  Nhà Gái
                </span>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Danh xưng
                  </Label>
                  <Input
                    value={formData.bride.familyTitle}
                    onChange={(e) =>
                      handleNestedChange("bride", "familyTitle", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Họ tên bố
                  </Label>
                  <Input
                    value={formData.bride.father}
                    onChange={(e) =>
                      handleNestedChange("bride", "father", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Họ tên mẹ
                  </Label>
                  <Input
                    value={formData.bride.mother}
                    onChange={(e) =>
                      handleNestedChange("bride", "mother", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                    Địa chỉ nhà gái
                  </Label>
                  <Input
                    value={formData.bride.address}
                    onChange={(e) =>
                      handleNestedChange("bride", "address", e.target.value)
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
