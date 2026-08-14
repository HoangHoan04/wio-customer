import FileUpload from "@/components/common/FileUpload";
import Switch from "@/components/ui/switch";
import type { CardTypeFormConfig } from "@/utils/card-type-form-config";

interface GallerySectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onAuthRequired: () => void;
  formConfig?: CardTypeFormConfig;
}

export const GallerySection = ({
  formData,
  handleChange,
  onAuthRequired,
  formConfig,
}: GallerySectionProps) => {
  const sectionTitle = formConfig?.galleryTitle || "6. Thư viện ảnh";

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">{sectionTitle}</h3>
        <Switch
          checked={formData.showGallery}
          onChange={(val) => handleChange("showGallery", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showGallery && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-[#F3EDE3] border border-[#D9CDBE] p-1.5 rounded-xl w-full">
            <button
              onClick={() => handleChange("galleryLayout", "grid")}
              className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${formData.galleryLayout === "grid" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Lưới (Grid)
            </button>
            <button
              onClick={() => handleChange("galleryLayout", "collage")}
              className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${formData.galleryLayout === "collage" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Ghép ảnh
            </button>
            <button
              onClick={() => handleChange("galleryLayout", "3d")}
              className={`flex-1 py-1.5 text-xs rounded-lg font-semibold transition-all cursor-pointer ${formData.galleryLayout === "3d" ? "bg-[#2D231F] text-[#F3EDE3] shadow-xs" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              3D Carousel
            </button>
          </div>
          <FileUpload
            label="Tải ảnh lên thư viện"
            mode="multi"
            value={formData.gallery}
            onChange={(urls) => handleChange("gallery", urls)}
            onAuthRequired={onAuthRequired}
          />
        </div>
      )}
    </div>
  );
};
