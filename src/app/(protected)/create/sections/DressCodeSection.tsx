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
      const { h, s, l } = hexToHsl(cleanVal);

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
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
        <h3 className="text-md font-bold text-[#d4af37]">
          8. Dress Code
        </h3>
        <Switch
          checked={formData.showDressCode}
          onChange={(val) => handleChange("showDressCode", val)}
          label="Hiển thị"
        />
      </div>
      {formData.showDressCode && (
        <div className="flex flex-col gap-4">
          <span className="text-xs text-[#f5e6d3]/60">
            Chọn màu chủ đạo:
          </span>
          <div className="flex flex-wrap gap-2">
            {WEDDING_COLORS.map((color) => {
              const isSelected = formData.dressCodes.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => toggleDressCode(color)}
                  style={{ backgroundColor: color }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${isSelected ? "border-[#d4af37] scale-110 shadow-[0_0_10px_#d4af37]" : "border-white/10 hover:scale-110"}`}
                  title={color}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            className="mt-2 text-xs text-[#d4af37] hover:text-[#f5c842] flex items-center gap-1.5 font-medium border border-[#d4af37]/30 hover:border-[#d4af37]/60 px-3 py-1.5 rounded-lg bg-[#d4af37]/5 transition-colors w-max"
          >
            <Plus size={14} /> Tự chọn màu tự do
          </button>

          {showCustomPicker && (
            <div className="flex flex-col gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
              <span className="text-xs text-[#f5e6d3]/60 font-medium">
                Bảng màu tự do (nhấn và di để chọn):
              </span>
              <div
                className="relative w-full h-37.5 rounded-lg overflow-hidden select-none border border-white/10 bg-black/20"
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
                  className="w-10 h-10 rounded-lg border border-white/20 shrink-0 shadow-inner"
                  style={{ backgroundColor: customColor }}
                />
                <div className="flex-1 flex gap-2">
                  <div className="flex-1 flex flex-col gap-1.5">
                    <Input
                      value={customColor}
                      onChange={(e) => handleHexInput(e.target.value)}
                      className="bg-white/5! border-[#d4af37]/20! text-xs font-mono uppercase"
                      placeholder="#HEXCODE"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      let formatted = customColor.trim().toUpperCase();
                      if (
                        !formatted.startsWith("#") &&
                        formatted.length > 0
                      ) {
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
                    className="bg-[#d4af37] text-black hover:bg-[#b08d20] text-xs font-semibold px-4 rounded-lg shrink-0"
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          )}

          {formData.dressCodes.length > 0 && (
            <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center flex-wrap gap-3">
              <span className="text-sm text-[#f5e6d3]/80">
                Màu đã chọn:
              </span>
              {formData.dressCodes.map((color: string) => (
                <div
                  key={color}
                  className="flex items-center gap-1 bg-black/40 pr-2 rounded-full overflow-hidden border border-white/10"
                >
                  <div
                    style={{ backgroundColor: color }}
                    className="w-5 h-5 rounded-full m-0.5"
                  />
                  <span className="text-[10px] text-white font-mono uppercase">
                    {color}
                  </span>
                  <button
                    onClick={() => toggleDressCode(color)}
                    className="ml-1 text-white/50 hover:text-red-400"
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
