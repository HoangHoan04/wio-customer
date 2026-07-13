import FileUpload from "@/components/common/FileUpload";
import Switch from "@/components/ui/switch";

interface HeroImageSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (section: "bride" | "groom", field: string, value: any) => void;
  templateSchema: any;
  onAuthRequired: () => void;
}

export const HeroImageSection = ({
  formData,
  handleChange,
  handleNestedChange,
  templateSchema,
  onAuthRequired,
}: HeroImageSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
        <h3 className="text-md font-bold text-[#d4af37]">
          2. Ảnh đầu thiệp
        </h3>
        <Switch
          checked={formData.showHeroImage}
          onChange={(val) => handleChange("showHeroImage", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showHeroImage && (
        <div className="grid grid-cols-2 gap-4">
          {templateSchema.heroStyle === "split" ? (
            <>
              <FileUpload
                label="Ảnh chú rể"
                value={formData.groom.photo}
                onChange={(url) =>
                  handleNestedChange("groom", "photo", url)
                }
                onAuthRequired={onAuthRequired}
              />
              <FileUpload
                label="Ảnh cô dâu"
                value={formData.bride.photo}
                onChange={(url) =>
                  handleNestedChange("bride", "photo", url)
                }
                onAuthRequired={onAuthRequired}
              />
            </>
          ) : templateSchema.heroStyle === "single" ? (
            <div className="col-span-2">
              <FileUpload
                label="Ảnh chụp chung (Bìa)"
                value={formData.heroImageMain}
                onChange={(url) => handleChange("heroImageMain", url)}
                onAuthRequired={onAuthRequired}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
