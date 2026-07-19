import Switch from "@/templates/customer-design/ui/Switch";
import { Share2 } from "lucide-react";

interface Props {
  sharedToCommunity: boolean;
  onToggleShareToCommunity: () => void;
}

export default function RightPanel({ sharedToCommunity, onToggleShareToCommunity }: Props) {
  return (
    <aside className="w-75 bg-[#222] border-l border-[#333] flex flex-col overflow-y-auto shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#333] shrink-0">
        <h3 className="text-white text-sm font-bold uppercase tracking-wider">Cài đặt</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <Section label="Chia sẻ">
          <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-3 border border-[#3a3a3a]">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 flex items-center justify-center shrink-0 mt-0.5">
                <Share2 size={16} className="text-[#d4af37]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">Chia sẻ cho cộng đồng</p>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                  Cho phép cộng đồng xem và sử dụng thiệp của bạn làm mẫu tham khảo.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-gray-400 text-xs">
                {sharedToCommunity ? "Đã chia sẻ" : "Chưa chia sẻ"}
              </span>
              <Switch checked={sharedToCommunity} onChange={onToggleShareToCommunity} />
            </div>
          </div>
        </Section>
      </div>
    </aside>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      {children}
    </div>
  );
}
