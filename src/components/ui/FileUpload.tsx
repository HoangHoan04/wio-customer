import Modal from "@/components/ui/Modal";
import { useToast } from "@/hooks/useToast";
import { uploadService } from "@/services/upload.service";
import { Eye, Loader2, Plus, Trash } from "lucide-react";
import React, { useRef, useState } from "react";

import tokenCache from "@/utils/token-cache";

interface FileUploadProps {
  label?: string;
  required?: boolean;
  maxSize?: number;
  value?: string | string[];
  onChange?: (val: any) => void;
  mode?: "single" | "multi";
  disabled?: boolean;
  className?: string;
  onAuthRequired?: () => void;
}

export default function FileUpload({
  label,
  required = false,
  maxSize = 10,
  value,
  onChange,
  mode = "single",
  disabled = false,
  className = "",
  onAuthRequired,
}: FileUploadProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const files: string[] = value
    ? Array.isArray(value)
      ? value.filter(Boolean)
      : [value].filter(Boolean)
    : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const filesArray = Array.from(selectedFiles);

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    for (const f of filesArray) {
      if (f.size / 1024 / 1024 > maxSize) {
        invalidFiles.push(f.name);
      } else {
        validFiles.push(f);
      }
    }

    if (invalidFiles.length > 0) {
      showToast({
        title: "Lỗi kích thước",
        message: `File ${invalidFiles.join(", ")} quá lớn. Kích thước tối đa là ${maxSize}MB.`,
        type: "error",
        timeout: 3000,
      });
    }

    if (validFiles.length === 0) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLoading(true);
    try {
      const responses = [];
      for (const file of validFiles) {
        const res = await uploadService.uploadImage(file);
        responses.push(res);
      }
      const uploadedUrls = responses.map((res: any) => res?.fileUrl).filter(Boolean);

      if (uploadedUrls.length > 0) {
        let nextValue: any;
        if (mode === "single") {
          nextValue = uploadedUrls[0];
        } else {
          nextValue = [...files, ...uploadedUrls];
        }

        if (onChange) {
          onChange(nextValue);
        }

        showToast({
          title: "Thành công",
          message: `Đã tải lên thành công ${uploadedUrls.length} ảnh`,
          type: "success",
          timeout: 1500,
        });
      }
    } catch (err: any) {
      console.error(err);
      showToast({
        title: "Lỗi tải lên",
        message: err.message || "Không thể tải lên tệp tin.",
        type: "error",
        timeout: 2000,
      });
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (indexToRemove: number) => {
    let nextValue: any;
    if (mode === "single") {
      nextValue = "";
    } else {
      nextValue = files.filter((_, idx) => idx !== indexToRemove);
    }
    if (onChange) {
      onChange(nextValue);
    }
  };

  const showUploadBtn = !disabled && (mode === "multi" || files.length === 0);
  const boxSizeClass = "w-28 h-28 min-w-[112px] min-h-[112px]";

  return (
    <div className={`flex flex-col gap-2 text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#f5e6d3]/85">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-4">
        {files.map((fileUrl, idx) => (
          <div
            key={idx}
            className={`${boxSizeClass} group relative overflow-hidden rounded-lg border border-[#d4af37]/35 bg-white/2 shadow-sm`}
          >
            <div className="flex h-full w-full items-center justify-center bg-[#0f0608]">
              <img
                src={fileUrl}
                alt="uploaded preview"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {!disabled && (
              <div className="absolute inset-0 z-20 flex items-center justify-center gap-2.5 bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setPreviewUrl(fileUrl)}
                  className="bg-transparent border-none text-[#f5c842] hover:scale-110 transition-transform cursor-pointer p-1 rounded hover:bg-white/10"
                >
                  <Eye size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="bg-transparent border-none text-red-400 hover:scale-110 transition-transform cursor-pointer p-1 rounded hover:bg-white/10"
                >
                  <Trash size={18} />
                </button>
              </div>
            )}
          </div>
        ))}

        {showUploadBtn && (
          <div className={`${boxSizeClass} relative group`}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple={mode === "multi"}
              disabled={loading}
              onClick={(e) => {
                if (!tokenCache.isAuthenticated()) {
                  e.preventDefault();
                  showToast({
                    title: "Yêu cầu đăng nhập",
                    message: "Bạn cần đăng nhập để tải ảnh lên.",
                    type: "info",
                    timeout: 2500,
                  });
                  if (onAuthRequired) {
                    onAuthRequired();
                  }
                }
              }}
              onChange={handleFileChange}
              className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
            />

            <div className="absolute inset-0 z-0 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-[#d4af37]/30 bg-white/3 text-[#f5e6d3]/60 transition-all duration-200 group-hover:border-[#f5c842] group-hover:text-[#f5c842]">
              {loading ? (
                <Loader2 className="animate-spin text-[#f5c842]" size={20} />
              ) : (
                <>
                  <Plus size={20} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tải ảnh</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {!disabled && showUploadBtn && (
        <span className="text-[10px] text-[#f5e6d3]/50">
          Chỉ chấp nhận hình ảnh • Tối đa {maxSize}MB
        </span>
      )}

      <Modal
        isOpen={!!previewUrl}
        onClose={() => setPreviewUrl(null)}
        maxWidth="max-w-[600px]"
        closeOnBackdropClick={true}
      >
        {previewUrl && (
          <div className="flex h-full w-full items-center justify-center p-2">
            <img
              src={previewUrl}
              alt="Full Preview"
              className="max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl border border-[#d4af37]/25"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
