"use client";

import { formatDateTime, WeddingStatus } from "@/common";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { weddingService } from "@/services/wedding.service";
import {
  Calendar,
  Copy,
  Edit2,
  Eye,
  Heart,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const C = {
  bg: "#0b0507",
  bgCard: "#140a0d",
  gold: "#c5a059",
  goldLight: "#e5c483",
  cream: "#f9f6f0",
  muted: "#a38a75",
  border: "rgba(197, 160, 89, 0.15)",
};

interface IWedding {
  id: string;
  slug: string;
  groomName: string;
  groomShortName: string;
  brideName: string;
  brideShortName: string;
  status: WeddingStatus;
  ceremonyAt?: string;
  ceremonyVenue?: string;
  template?: {
    name: string;
    themeCode: string;
    slug: string;
  };
}

type TabType = "all" | "draft" | "published";

export default function MyTemplatesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [weddings, setWeddings] = useState<IWedding[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  useEffect(() => {
    weddingService
      .getWeddings({ skip: 0, take: 50, where: {} })
      .then((res) => {
        setWeddings(res.data ?? []);
      })
      .catch((err) => {
        console.error(err);
        showToast({
          message: "Không thể tải danh sách thiệp cưới",
          type: "error",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}/thiep/${slug}`;
    navigator.clipboard.writeText(link);
    showToast({ message: "Đã sao chép liên kết thiệp cưới!", type: "success" });
  };

  const filteredWeddings = weddings.filter((w) => {
    if (activeTab === "all") return true;
    if (activeTab === "draft") return w.status !== WeddingStatus.PUBLISHED;
    if (activeTab === "published") return w.status === WeddingStatus.PUBLISHED;
    return true;
  });

  return (
    <div
      className="min-h-screen pt-36 px-4 sm:px-8 lg:px-16 pb-24"
      style={{ background: C.bg, color: C.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600&display=swap');
        .wedding-card {
          background: ${C.bgCard};
          border: 1px solid ${C.border};
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wedding-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(197, 160, 89, 0.1);
          border-color: ${C.gold};
        }
      `}</style>

      <div className="max-w-300 mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3"
              style={{
                fontFamily: "'Cinzel', serif",
                background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 50%, ${C.goldLight} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Thiệp cưới của tôi
            </h1>
            <p className="text-sm font-light" style={{ color: C.muted }}>
              Quản lý và chỉnh sửa danh sách thiệp cưới sang trọng của riêng
              bạn.
            </p>
          </div>
          <Link href="/templates">
            <Button
              className="px-6 py-5.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center gap-2 animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)`,
                color: C.bg,
                boxShadow: "0 4px 15px rgba(197,160,89,0.3)",
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Tạo thiệp mới
            </Button>
          </Link>
        </div>

        {/* Dynamic Tabs */}
        <div className="flex justify-center gap-3 mb-10 border-b border-[#d4af37]/10 pb-6">
          {(
            [
              { id: "all", label: "Tất cả" },
              { id: "draft", label: "Bản nháp" },
              { id: "published", label: "Đã xuất bản" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "text-[#0b0507]"
                  : "text-[#a38a75] border border-[rgba(197,160,89,0.15)] hover:border-[#c5a059] bg-transparent"
              }`}
              style={
                activeTab === tab.id
                  ? {
                      background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
                      boxShadow: "0 4px 12px rgba(197,160,89,0.25)",
                    }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#d4af37]/20 border-t-[#d4af37] rounded-full animate-spin" />
          </div>
        ) : filteredWeddings.length === 0 ? (
          <div
            className="text-center py-20 px-6 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-6"
            style={{ borderColor: C.border, background: "rgba(20,10,13,0.3)" }}
          >
            <div className="p-4 bg-[#d4af37]/5 rounded-full text-[#d4af37]">
              <Heart size={40} strokeWidth={1.5} />
            </div>
            <div className="max-w-md">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Chưa có thiệp cưới nào
              </h3>
              <p
                className="text-xs font-light leading-relaxed mb-6"
                style={{ color: C.muted }}
              >
                Không tìm thấy thiệp cưới nào trong danh mục này. Hãy bắt đầu
                chọn mẫu và thiết kế thiệp của bạn.
              </p>
              <Link href="/templates">
                <Button className="px-6 py-5 bg-transparent border text-[#e5c483] border-[#c5a059] hover:bg-[#d4af37]/10">
                  Khám phá mẫu thiệp
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {filteredWeddings.map((w) => {
              const formattedDate =
                formatDateTime(w.ceremonyAt) || "Chưa thiết lập";

              return (
                <div
                  key={w.id}
                  className="wedding-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          w.status === WeddingStatus.PUBLISHED
                            ? "bg-green-500/10 text-green-400 border border-green-500/25"
                            : "bg-[#d4af37]/10 text-[#f5c842] border border-[#d4af37]/25"
                        }`}
                      >
                        {w.status === WeddingStatus.PUBLISHED
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </span>
                      {w.template && (
                        <span className="text-[10px] flex items-center gap-1 text-[#f5e6d3]/60">
                          <Sparkles size={11} className="text-[#d4af37]" />
                          {w.template.name}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-xl font-bold mb-3 tracking-wide truncate"
                      style={{ fontFamily: "'Cinzel', serif", color: C.cream }}
                    >
                      {w.groomShortName || "Chú rể"} &{" "}
                      {w.brideShortName || "Cô dâu"}
                    </h3>

                    <div className="space-y-2 mb-6 text-xs text-[#f5e6d3]/70 font-light">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#c5a059]" />
                        <span>Ngày cưới: {formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#c5a059]" />
                        <span className="truncate">
                          Nơi diễn ra: {w.ceremonyVenue || "Chưa thiết lập"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/edit/${w.id}`)}
                      className="flex-1 py-4 bg-white/3! border-[#d4af37]/20! hover:border-[#d4af37]/40! text-[#f5e6d3]! flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold"
                    >
                      <Edit2 size={13} />
                      Chỉnh sửa
                    </Button>
                    {w.slug && (
                      <>
                        <Link
                          href={`/thiep/${w.slug}`}
                          target="_blank"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full py-4 bg-white/3! border-[#d4af37]/20! hover:border-[#d4af37]/40! text-[#f5e6d3]! flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold"
                          >
                            <Eye size={13} />
                            Xem
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => handleCopyLink(w.slug)}
                          className="px-3 py-4 bg-white/3! border-[#d4af37]/20! hover:border-[#d4af37]/40! text-[#f5e6d3]! flex items-center justify-center rounded-lg text-xs"
                          title="Sao chép liên kết"
                        >
                          <Copy size={13} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
