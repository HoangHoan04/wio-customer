import FileUpload from "@/components/common/FileUpload";
import Switch from "@/components/ui/switch";

interface GallerySectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  onAuthRequired: () => void;
}

export const GallerySection = ({
  formData,
  handleChange,
  onAuthRequired,
}: GallerySectionProps) => {
  return (
    <div className="bg-[#2D231F]/8 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-2">
        <h3 className="text-md font-bold text-[#2D231F]">
          6. Thư viện ảnh cưới
        </h3>
        <Switch
          checked={formData.showGallery}
          onChange={(val) => handleChange("showGallery", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showGallery && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-[#f4f8e8] p-1.5 rounded-lg w-full">
            <button
              onClick={() => handleChange("galleryLayout", "grid")}
              className={`flex-1 py-2 text-xs rounded-md transition-all ${formData.galleryLayout === "grid" ? "bg-[#2D231F] text-[#F3EDE3] font-bold" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Lưới (Grid)
            </button>
            <button
              onClick={() => handleChange("galleryLayout", "collage")}
              className={`flex-1 py-2 text-xs rounded-md transition-all ${formData.galleryLayout === "collage" ? "bg-[#2D231F] text-[#F3EDE3] font-bold" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
            >
              Ghép ảnh
            </button>
            <button
              onClick={() => handleChange("galleryLayout", "3d")}
              className={`flex-1 py-2 text-xs rounded-md transition-all ${formData.galleryLayout === "3d" ? "bg-[#2D231F] text-[#F3EDE3] font-bold" : "text-[#2D231F]/60 hover:text-[#2D231F]"}`}
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
