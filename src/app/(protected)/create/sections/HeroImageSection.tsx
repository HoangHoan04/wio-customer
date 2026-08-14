import FileUpload from "@/components/common/FileUpload";
import Switch from "@/components/ui/switch";
import type { HostFormSlot, HostRoleConfig } from "@/services/card-type.service";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";

interface HeroImageSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  handleNestedChange: (
    section: "bride" | "groom",
    field: string,
    value: any,
  ) => void;
  templateSchema: any;
  onAuthRequired: () => void;
  formConfig?: CardTypeFormConfig;
  hostSlots?: Array<{ key: HostFormSlot; role: HostRoleConfig }>;
}

export const HeroImageSection = ({
  formData,
  handleChange,
  handleNestedChange,
  templateSchema,
  onAuthRequired,
  formConfig,
  hostSlots,
}: HeroImageSectionProps) => {
  const sectionTitle = formConfig?.heroImageTitle || "2. Ảnh đầu thiệp";
  const slot1 = hostSlots?.[0];
  const slot2 = hostSlots?.[1];

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">{sectionTitle}</h3>
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
                label={`Ảnh ${slot1?.role.label || "nhân vật 1"}`}
                value={formData.groom.photo}
                onChange={(url) => handleNestedChange("groom", "photo", url)}
                onAuthRequired={onAuthRequired}
              />
              <FileUpload
                label={`Ảnh ${slot2?.role.label || "nhân vật 2"}`}
                value={formData.bride.photo}
                onChange={(url) => handleNestedChange("bride", "photo", url)}
                onAuthRequired={onAuthRequired}
              />
            </>
          ) : templateSchema.heroStyle === "single" ? (
            <div className="col-span-2">
              <FileUpload
                label="Ảnh đại diện chính (Bìa)"
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
