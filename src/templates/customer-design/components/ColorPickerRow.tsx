import Button from "@/templates/customer-design/ui/button/Button";
import Input from "@/templates/customer-design/ui/input/Input";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PRESET_COLORS } from "../utils/constants";

export default function ColorPickerRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const popupH = popupRef.current?.offsetHeight || 220;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const spaceAbove = rect.top - 4;
      if (spaceBelow >= popupH || spaceBelow >= spaceAbove) {
        setPopupPos({ top: rect.bottom + 4, left: rect.left });
      } else {
        setPopupPos({ top: rect.top - popupH - 4, left: rect.left });
      }
    }
  }, []);

  useEffect(() => {
    if (!showPicker) return;
    updatePosition();
    const panel = btnRef.current?.closest(".overflow-y-auto");
    panel?.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    return () => {
      panel?.removeEventListener("scroll", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [showPicker, updatePosition]);

  useEffect(() => {
    if (!showPicker) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPicker]);

  return (
    <div className="relative flex items-center gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <Button
          ref={btnRef}
          onClick={() => {
            if (!showPicker) updatePosition();
            setShowPicker(!showPicker);
          }}
          className="w-11! h-11! rounded-lg border border-[#D9CDBE] cursor-pointer shrink-0 hover:border-[#2D231F] transition-colors"
          style={{ backgroundColor: value || "transparent" }}
          variant="outline"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 w-full! bg-[#F3EDE3]! text-[#2D231F]! text-xs border border-[#D9CDBE] rounded py-1.5 outline-none focus:border-[#2D231F] font-mono!"
        />
      </div>
      {showPicker &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-40 bg-[#F3EDE3] border border-[#D9CDBE] rounded-xl p-3 shadow-xl w-57"
            style={{ top: popupPos.top, left: popupPos.left }}
          >
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-10 rounded cursor-pointer border border-[#D9CDBE] mb-3"
            />
            <div className="grid grid-cols-8 gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    onChange(c);
                    setShowPicker(false);
                  }}
                  className={`w-6 h-6 rounded border ${
                    [
                      "#FFFFFF",
                      "#F5E6D3",
                      "#F5F5DC",
                      "#FFF5EE",
                      "#FAF0E6",
                      "#FFF0F5",
                      "#FFE4E1",
                      "#FFDAB9",
                      "#FFDDCC",
                      "#FFF5CC",
                      "#CCFFCC",
                      "#CCDDFF",
                      "#DDCCFF",
                      "#FADADD",
                      "#D4F1F4",
                      "#F0FFF0",
                      "#FFCCCC",
                      "#FFEECC",
                      "#FFEE88",
                      "#88EEFF",
                      "#88EE88",
                      "#88AAFF",
                      "#AA88EE",
                    ].includes(c)
                      ? "border-gray-400"
                      : "border-transparent"
                  } hover:scale-110 transition-transform`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
