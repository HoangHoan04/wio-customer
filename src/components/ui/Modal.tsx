import { X } from "lucide-react";
import React, { type ReactNode } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  maxWidth?: string;
  hideCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  maxWidth = "max-w-lg",
  hideCloseButton = false,
  closeOnBackdropClick = true,
}: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-[#F3EDE3]/70 backdrop-blur-md animate-modal-backdrop"
        onClick={handleBackdropClick}
      >
        <div
          className={`relative w-full ${maxWidth} border border-[#D9CDBE] bg-[#F3EDE3] animate-modal-content ${className}`}
          style={{ padding: "32px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#EDE4D5] text-[#7A6A5C] hover:bg-[#2D231F]/20 hover:text-[#7A6A5C] transition-colors z-60 cursor-pointer"
            >
              <X size={18} />
            </button>
          )}

          <div className="w-full pt-1 pr-4">{children}</div>
        </div>
      </div>
    </>
  );
}
