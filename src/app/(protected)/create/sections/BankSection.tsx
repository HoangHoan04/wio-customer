import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BankSectionProps {
  formData: any;
  onOpenBankModal: () => void;
}

export const BankSection = ({
  formData,
  onOpenBankModal,
}: BankSectionProps) => {
  return (
    <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
      <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
        12. Tài khoản ngân hàng (Mừng cưới)
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(formData.displayOrder === "bride_first" ? ["bride", "groom"] : ["groom", "bride"]).map((type) => {
          if (type === "groom") {
            return (
              <div key="groom" className="p-3 bg-white/3 border border-white/5 rounded-lg flex flex-col gap-1 text-xs">
                <span className="font-bold text-[#d4af37] uppercase text-[10px] tracking-wider mb-1">
                  Chú rể
                </span>
                {formData.groom.bankAccount.accountNumber ? (
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-white truncate">
                      {formData.groom.bankAccount.accountName}
                    </p>
                    <p className="text-white/80 font-mono">
                      {formData.groom.bankAccount.accountNumber}
                    </p>
                    <p className="text-[#d4af37]/80 truncate">
                      {formData.groom.bankAccount.bankName}
                    </p>
                    {formData.groom.bankAccount.qrUrl && (
                      <img
                        src={formData.groom.bankAccount.qrUrl}
                        alt="QR Groom"
                        className="w-20 h-20 mt-2 object-contain bg-white rounded border border-[#d4af37]/20 p-0.5 self-center"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-white/40 italic">Chưa thiết lập</p>
                )}
              </div>
            );
          } else {
            return (
              <div key="bride" className="p-3 bg-white/3 border border-white/5 rounded-lg flex flex-col gap-1 text-xs">
                <span className="font-bold text-[#d4af37] uppercase text-[10px] tracking-wider mb-1">
                  Cô dâu
                </span>
                {formData.bride.bankAccount.accountNumber ? (
                  <div className="flex flex-col gap-0.5">
                    <p className="font-bold text-white truncate">
                      {formData.bride.bankAccount.accountName}
                    </p>
                    <p className="text-white/80 font-mono">
                      {formData.bride.bankAccount.accountNumber}
                    </p>
                    <p className="text-[#d4af37]/80 truncate">
                      {formData.bride.bankAccount.bankName}
                    </p>
                    {formData.bride.bankAccount.qrUrl && (
                      <img
                        src={formData.bride.bankAccount.qrUrl}
                        alt="QR Bride"
                        className="w-20 h-20 mt-2 object-contain bg-white rounded border border-[#d4af37]/20 p-0.5 self-center"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-white/40 italic">Chưa thiết lập</p>
                )}
              </div>
            );
          }
        })}
      </div>

      <Button
        onClick={onOpenBankModal}
        className="bg-[#d4af37] text-black hover:bg-[#b08d20] py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm w-full"
      >
        <Plus size={16} /> Quản lý tài khoản mừng cưới
      </Button>
    </div>
  );
};
