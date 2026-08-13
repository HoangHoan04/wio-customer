"use client";

import { enumData, formatDateTime } from "@/common";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { invitationService } from "@/services/invitation.service";
import { invitationLabel, publicInvitationPath } from "@/utils/invitation-mapper";
import {
  Calendar,
  Copy,
  Edit2,
  Eye,
  Heart,
  Lock,
  MapPin,
  Plus,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const C = {
  bg: "#F3EDE3",
  bgCard: "#EDE4D5",
  gold: "#2D231F",
  goldLight: "#7A6A5C",
  cream: "#2D231F",
  muted: "#7A6A5C",
  border: "rgba(232, 226, 216, 1)",
};

interface IInvitation {
  id: string;
  slug: string;
  title?: string;
  status: string;
  primaryEventAt?: string;
  templateId?: string;
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
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");

  useEffect(() => {
    invitationService
      .pagination({ skip: 0, take: 50, where: {} })
      .then((res) => {
        setInvitations(res.data ?? []);
      })
      .catch((err) => {
        console.error(err);
        showToast({
          message: "Không thể tải danh sách thiệp",
          type: "error",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopyLink = (slug: string) => {
    const link = `${window.location.origin}${publicInvitationPath(slug)}`;
    navigator.clipboard.writeText(link);
    showToast({ message: "Đã sao chép liên kết thiệp!", type: "success" });
  };

  const handleUnpublish = async (id: string) => {
    try {
      await invitationService.unpublish(id);
      showToast({
        message: "Đã mở khóa chỉnh sửa thiệp!",
        type: "success",
      });
      const res = await invitationService.pagination({
        skip: 0,
        take: 50,
        where: {},
      });
      setInvitations(res.data ?? []);
    } catch (err: any) {
      console.error(err);
      showToast({
        message:
          err.response?.data?.message ||
          "Không thể mở khóa chỉnh sửa thiệp",
        type: "error",
      });
    }
  };

  const filteredInvitations = invitations.filter((w) => {
    if (activeTab === "all") return true;
    if (activeTab === "draft")
      return w.status !== enumData.INVITATION_STATUS.PUBLISHED.code;
    if (activeTab === "published")
      return w.status === enumData.INVITATION_STATUS.PUBLISHED.code;
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
          box-shadow: 0 15px 35px rgba(0,0,0,0.5), 0 0 20px rgba(45, 35, 31, 0.1);
          border-color: ${C.gold};
        }
      `}</style>

      <div className="max-w-300 mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3 text-[#2D231F]"
              style={{
                fontFamily: "'Cinzel', serif",
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
                color: "#1a1a1a",
                boxShadow: "0 4px 15px rgba(45, 35, 31,0.3)",
              }}
            >
              <Plus size={16} strokeWidth={2.5} />
              Tạo thiệp mới
            </Button>
          </Link>
        </div>

        <div className="flex justify-center gap-3 mb-10 border-b border-[#2D231F]/10 pb-6">
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
                  ? "text-[#1a1a1a]"
                  : "text-[#7A6A5C] border border-[rgba(45, 35, 31,0.15)] hover:border-[#2D231F] bg-transparent"
              }`}
              style={
                activeTab === tab.id
                  ? {
                      background: `linear-gradient(135deg, ${C.goldLight}, ${C.gold})`,
                      boxShadow: "0 4px 12px rgba(45, 35, 31,0.25)",
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
            <div className="w-12 h-12 border-4 border-[#2D231F]/20 border-t-[#2D231F] rounded-full animate-spin" />
          </div>
        ) : filteredInvitations.length === 0 ? (
          <div
            className="text-center py-20 px-6 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-6"
            style={{ borderColor: C.border, background: "#EDE4D5" }}
          >
            <div className="p-4 bg-[#2D231F]/5 rounded-full text-[#2D231F]">
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
                <Button className="px-6 py-5 bg-transparent border text-[#7A6A5C] border-[#2D231F] hover:bg-[#2D231F]/10">
                  Khám phá mẫu thiệp
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
            {filteredInvitations.map((w) => {
              const formattedDate =
                formatDateTime(w.primaryEventAt) || "Chưa thiết lập";

              return (
                <div
                  key={w.id}
                  className="wedding-card p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          w.status === enumData.INVITATION_STATUS.PUBLISHED.code
                            ? "bg-green-500/10 text-green-400 border border-green-500/25"
                            : "bg-[#2D231F]/10 text-[#7A6A5C] border border-[#2D231F]/25"
                        }`}
                      >
                        {w.status === enumData.INVITATION_STATUS.PUBLISHED.code
                          ? "Đã xuất bản"
                          : "Bản nháp"}
                      </span>
                      {w.template && (
                        <span className="text-[10px] flex items-center gap-1 text-[#2D231F]/60">
                          <Sparkles size={11} className="text-[#2D231F]" />
                          {w.template.name}
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-xl font-bold mb-3 tracking-wide truncate"
                      style={{ fontFamily: "'Cinzel', serif", color: C.cream }}
                    >
                      {invitationLabel(w)}
                    </h3>

                    <div className="space-y-2 mb-6 text-xs text-[#2D231F]/70 font-light">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-[#2D231F]" />
                        <span>Ngày sự kiện: {formattedDate}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#2D231F]" />
                        <span className="truncate">
                          {publicInvitationPath(w.slug)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/5">
                    {w.status !== enumData.INVITATION_STATUS.PUBLISHED.code ? (
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (!w.templateId || w.template?.themeCode === "CUSTOM_DESIGN") {
                            router.push(`/design?id=${w.id}`);
                          } else {
                            router.push(`/edit/${w.id}`);
                          }
                        }}
                        className="flex-1 py-4 bg-[#2D231F]/8! border-[#2D231F]/20! hover:border-[#2D231F]/40! text-[#2D231F]! flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold"
                      >
                        <Edit2 size={13} />
                        Chỉnh sửa
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleUnpublish(w.id)}
                        className="flex-1 py-4 bg-red-500/10! border-red-500/20! hover:border-red-500/40! text-red-400! flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold"
                      >
                        <Lock size={13} />
                        Mở khóa chỉnh sửa
                      </Button>
                    )}
                    {w.slug && (
                      <>
                        <Link
                          href={publicInvitationPath(w.slug)}
                          target="_blank"
                          className="flex-1"
                        >
                          <Button
                            variant="outline"
                            className="w-full py-4 bg-[#2D231F]/8! border-[#2D231F]/20! hover:border-[#2D231F]/40! text-[#2D231F]! flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold"
                          >
                            <Eye size={13} />
                            Xem
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          onClick={() => handleCopyLink(w.slug)}
                          className="px-3 py-4 bg-[#2D231F]/8! border-[#2D231F]/20! hover:border-[#2D231F]/40! text-[#2D231F]! flex items-center justify-center rounded-lg text-xs"
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
