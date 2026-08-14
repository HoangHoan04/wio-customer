import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Switch from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface DressCodeSectionProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
  toggleDressCode: (color: string) => void;
  WEDDING_COLORS: string[];
}

export const DressCodeSection = ({
  formData,
  handleChange,
  toggleDressCode,
  WEDDING_COLORS,
}: DressCodeSectionProps) => {
  const { showToast } = useToast();
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [pickerPointer, setPickerPointer] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToHsl = (hex: string) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, l };
  };

  const handleHexInput = (val: string) => {
    setCustomColor(val);

    let cleanVal = val.trim();
    if (!cleanVal.startsWith("#") && cleanVal.length > 0) {
      cleanVal = "#" + cleanVal;
    }

    if (/^#[0-9A-F]{6}$/i.test(cleanVal)) {
      const { h, l } = hexToHsl(cleanVal);

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (1 - h) * rect.width;
        const y = (1 - l) * rect.height;
        setPickerPointer({ x, y });
      }
    }
  };

  useEffect(() => {
    if (showCustomPicker && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradientH.addColorStop(0, "rgb(255, 0, 0)");
        gradientH.addColorStop(0.15, "rgb(255, 0, 255)");
        gradientH.addColorStop(0.3, "rgb(0, 0, 255)");
        gradientH.addColorStop(0.45, "rgb(0, 255, 255)");
        gradientH.addColorStop(0.6, "rgb(0, 255, 0)");
        gradientH.addColorStop(0.75, "rgb(255, 255, 0)");
        gradientH.addColorStop(1, "rgb(255, 0, 0)");
        ctx.fillStyle = gradientH;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientV.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradientV.addColorStop(1, "rgba(0, 0, 0, 1)");
        ctx.fillStyle = gradientV;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [showCustomPicker]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampedX = Math.max(0, Math.min(rect.width, x));
    const clampedY = Math.max(0, Math.min(rect.height, y));

    setPickerPointer({ x: clampedX, y: clampedY });

    const canvasX = Math.max(
      0,
      Math.min(canvas.width - 1, (clampedX / rect.width) * canvas.width),
    );
    const canvasY = Math.max(
      0,
      Math.min(canvas.height - 1, (clampedY / rect.height) * canvas.height),
    );

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imgData = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const r = imgData[0];
      const g = imgData[1];
      const b = imgData[2];
      const hex =
        "#" +
        [r, g, b]
          .map((x) => {
            const hexStr = x.toString(16);
            return hexStr.length === 1 ? "0" + hexStr : hexStr;
          })
          .join("");
      setCustomColor(hex.toUpperCase());
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setIsMouseDown(true);
    handleCanvasInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMouseDown) {
      handleCanvasInteraction(e);
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#2D231F]/10 pb-3">
        <h3 className="text-base font-bold text-[#2D231F]">8. Dress Code</h3>
        <Switch
          checked={formData.showDressCode}
          onChange={(val) => handleChange("showDressCode", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showDressCode && (
        <div className="flex flex-col gap-4">
          <span className="text-xs text-[#2D231F]/70 font-medium">Chọn màu chủ đạo:</span>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(WEDDING_COLORS)).map((color) => {
              const isSelected = formData.dressCodes.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => toggleDressCode(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${isSelected ? "border-[#2D231F] scale-110 shadow-[0_0_8px_rgba(45,35,31,0.5)]" : "border-[#D9CDBE] hover:scale-110"}`}
                  title={color}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            className="mt-1 text-xs text-[#2D231F] hover:text-[#7A6A5C] flex items-center gap-1.5 font-semibold border border-[#2D231F]/30 hover:border-[#2D231F]/60 px-3.5 py-2 rounded-xl bg-[#F3EDE3] transition-colors w-max cursor-pointer"
          >
            <Plus size={14} /> Tự chọn màu tự do
          </button>

          {showCustomPicker && (
            <div className="flex flex-col gap-3 p-4 bg-[#F3EDE3] border border-[#D9CDBE] rounded-xl">
              <span className="text-xs text-[#2D231F]/80 font-medium">
                Bảng màu tự do (nhấn và di để chọn):
              </span>
              <div
                className="relative w-full h-37.5 rounded-xl overflow-hidden select-none border border-[#D9CDBE] bg-black/10"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="w-full h-full cursor-crosshair"
                />
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.5)] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${pickerPointer.x}px`,
                    top: `${pickerPointer.y}px`,
                    backgroundColor: customColor,
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl border border-[#D9CDBE] shrink-0 shadow-2xs"
                  style={{ backgroundColor: customColor }}
                />
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Input
                      value={customColor}
                      onChange={(e) => handleHexInput(e.target.value)}
                      className="bg-white/80 border-[#D9CDBE] focus:bg-white text-xs font-mono uppercase text-[#2D231F]"
                      placeholder="#HEXCODE"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      let formatted = customColor.trim().toUpperCase();
                      if (!formatted.startsWith("#") && formatted.length > 0) {
                        formatted = "#" + formatted;
                      }
                      if (/^#[0-9A-F]{6}$/i.test(formatted)) {
                        if (!formData.dressCodes.includes(formatted)) {
                          handleChange("dressCodes", [
                            ...formData.dressCodes,
                            formatted,
                          ]);
                          showToast({
                            title: "Đã thêm màu",
                            message: `Đã thêm mã màu ${formatted} vào danh sách.`,
                            type: "success",
                          });
                        } else {
                          showToast({
                            title: "Màu đã tồn tại",
                            message: `Mã màu ${formatted} đã có trong danh sách.`,
                            type: "warning",
                          });
                        }
                      } else {
                        showToast({
                          title: "Mã màu không hợp lệ",
                          message:
                            "Vui lòng nhập đúng định dạng hex (ví dụ: #FF0000).",
                          type: "error",
                        });
                      }
                    }}
                    className="bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] text-xs font-semibold px-4 rounded-xl shrink-0 cursor-pointer"
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          )}

          {formData.dressCodes.length > 0 && (
            <div className="mt-2 p-3 bg-[#F3EDE3] rounded-xl border border-[#D9CDBE] flex items-center flex-wrap gap-2.5">
              <span className="text-xs font-semibold text-[#2D231F]/80">Màu đã chọn:</span>
              {formData.dressCodes.map((color: string) => (
                <div
                  key={color}
                  className="flex items-center gap-1.5 bg-white/90 pr-2 pl-1 py-0.5 rounded-full border border-[#D9CDBE] shadow-2xs"
                >
                  <div
                    style={{ backgroundColor: color }}
                    className="w-4 h-4 rounded-full border border-black/10"
                  />
                  <span className="text-[11px] text-[#2D231F] font-mono font-medium uppercase">
                    {color}
                  </span>
                  <button
                    onClick={() => toggleDressCode(color)}
                    className="ml-0.5 text-[#2D231F]/40 hover:text-red-500 transition-colors cursor-pointer"
                    title="Xóa màu"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
