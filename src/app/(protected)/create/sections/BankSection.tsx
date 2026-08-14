import { Button } from "@/components/ui/button";
import type {
  HostFormSlot,
  HostRoleConfig,
} from "@/services/card-type.service";
import { Plus } from "lucide-react";

interface BankSectionProps {
  formData: any;
  onOpenBankModal: () => void;
  hostSlots: Array<{ key: HostFormSlot; role: HostRoleConfig }>;
  giftsTitle?: string;
}

export const BankSection = ({
  formData,
  onOpenBankModal,
  hostSlots,
  giftsTitle = "Tài khoản ngân hàng",
}: BankSectionProps) => {
  return (
    <div className="bg-[#EDE4D5] border border-[#D9CDBE] p-5 sm:p-6 rounded-2xl shadow-xs flex flex-col gap-5">
      <h3 className="text-base font-bold text-[#2D231F] border-b border-[#2D231F]/10 pb-3">
        Tài khoản ngân hàng ({giftsTitle})
      </h3>

      <div
        className={`grid grid-cols-1 ${hostSlots.length > 1 ? "sm:grid-cols-2" : ""} gap-4`}
      >
        {hostSlots.map((slot) => {
          const bank = formData[slot.key]?.bankAccount;
          return (
            <div
              key={slot.key}
              className="p-4 bg-[#F3EDE3] border border-[#D9CDBE]/70 rounded-xl flex flex-col gap-1.5 text-xs shadow-2xs"
            >
              <span className="font-bold text-[#2D231F] uppercase text-[11px] tracking-wide mb-1">
                {slot.role.label}
              </span>
              {bank?.accountNumber ? (
                <div className="flex flex-col gap-1">
                  <p className="font-bold text-[#2D231F] truncate">
                    {bank.accountName}
                  </p>
                  <p className="text-[#2D231F]/80 font-mono">
                    {bank.accountNumber}
                  </p>
                  <p className="text-[#2D231F]/80 truncate">{bank.bankName}</p>
                  {bank.qrUrl && (
                    <img
                      src={bank.qrUrl}
                      alt={`QR ${slot.role.label}`}
                      className="w-24 h-24 mt-2 object-contain bg-white rounded-lg border border-[#D9CDBE] p-1 self-center shadow-2xs"
                    />
                  )}
                </div>
              ) : (
                <p className="text-[#2D231F]/40 italic">Chưa thiết lập</p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        onClick={onOpenBankModal}
        className="bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm w-full cursor-pointer shadow-xs transition-all"
      >
        <Plus size={16} /> Quản lý tài khoản
      </Button>
    </div>
  );
};
