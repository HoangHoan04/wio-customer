"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/useToast";
import { invitationService } from "@/services/invitation.service";
import { invitationLabel } from "@/utils/invitation-mapper";
import { wishService, type Wish } from "@/services/wish.service";
import {
  CheckCircle,
  Pin,
  PinOff,
  RefreshCw,
  ThumbsDown,
  Trash2,
} from "lucide-react";
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

interface InvitationOption {
  id: string;
  title?: string;
  slug: string;
}

export default function MyWishesPage() {
  const { showToast } = useToast();

  const [invitations, setInvitations] = useState<InvitationOption[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    invitationService
      .pagination({ skip: 0, take: 50, where: {} })
      .then((res) => {
        const list = res.data ?? [];
        setInvitations(list);
        if (list[0]) setSelectedInvitationId(list[0].id);
      })
      .catch((err) => {
        console.error(err);
        showToast({
          message: "Không thể tải danh sách đám cưới",
          type: "error",
        });
      });
  }, []);

  useEffect(() => {
    if (!selectedInvitationId) return;
    setIsLoading(true);
    wishService
      .getByInvitation(selectedInvitationId, { isApproved: undefined })
      .then((res) => setWishes(res.data ?? []))
      .catch((err) => {
        console.error(err);
        showToast({ message: "Không thể tải lời chúc", type: "error" });
      })
      .finally(() => setIsLoading(false));
  }, [selectedInvitationId]);

  const refreshWishes = () => {
    if (!selectedInvitationId) return;
    setIsLoading(true);
    wishService
      .getByInvitation(selectedInvitationId, { isApproved: undefined })
      .then((res) => setWishes(res.data ?? []))
      .finally(() => setIsLoading(false));
  };

  const handleApprove = async (id: string) => {
    try {
      await wishService.approve(id);
      showToast({ message: "Duyệt lời chúc thành công", type: "success" });
      refreshWishes();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await wishService.reject(id);
      showToast({ message: "Từ chối lời chúc thành công", type: "success" });
      refreshWishes();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const handlePin = async (id: string) => {
    try {
      await wishService.pin(id);
      showToast({ message: "Ghim lời chúc thành công", type: "success" });
      refreshWishes();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const handleUnpin = async (id: string) => {
    try {
      await wishService.unpin(id);
      showToast({ message: "Bỏ ghim lời chúc thành công", type: "success" });
      refreshWishes();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xoá lời chúc này?")) return;
    try {
      await wishService.delete(id);
      showToast({ message: "Xoá lời chúc thành công", type: "success" });
      refreshWishes();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Xoá thất bại",
        type: "error",
      });
    }
  };

  return (
    <div
      className="min-h-screen pt-36 px-4 sm:px-8 lg:px-16 pb-24"
      style={{ background: C.bg, color: C.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600&display=swap');
      `}</style>

      <div className="max-w-300 mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3 text-[#2D231F]"
              style={{
                fontFamily: "'Cinzel', serif",
              }}
            >
              Quản lý lời chúc
            </h1>
            <p className="text-sm font-light" style={{ color: C.muted }}>
              Duyệt, ghim và quản lý lời chúc từ khách mời cho từng đám cưới.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              onClick={refreshWishes}
              disabled={isLoading}
              className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
            >
              <RefreshCw size={16} className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
            {invitations.length > 0 && (
              <Select
                value={selectedInvitationId}
                onValueChange={(v) => setSelectedInvitationId(v ?? "")}
                items={invitations.map((w) => ({
                  value: w.id,
                  label: invitationLabel(w),
                }))}
              >
                <SelectTrigger className="min-w-80 bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/50">
                  <SelectValue placeholder="Chọn đám cưới" />
                </SelectTrigger>
                <SelectContent className="bg-[#ffffff] border-[#2D231F]/30 text-[#2D231F]">
                  {invitations.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {invitationLabel(w)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#2D231F]/20 border-t-[#2D231F] rounded-full animate-spin" />
          </div>
        ) : wishes.length === 0 ? (
          <div
            className="text-center py-20 px-6 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-6"
            style={{ borderColor: C.border, background: "#EDE4D5" }}
          >
            <div className="p-4 bg-[#2D231F]/5 rounded-full text-[#2D231F]">
              <CheckCircle size={40} strokeWidth={1.5} />
            </div>
            <div className="max-w-md">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Chưa có lời chúc nào
              </h3>
              <p
                className="text-xs font-light leading-relaxed mb-6"
                style={{ color: C.muted }}
              >
                Khi khách mời gửi lời chúc, họ sẽ xuất hiện ở đây để bạn duyệt
                và quản lý.
              </p>
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ borderColor: C.border, background: C.bgCard }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#ffffff] text-[#2D231F]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Tên khách mời</th>
                    <th className="px-4 py-3 font-semibold">Nội dung</th>
                    <th className="px-4 py-3 font-semibold">Trạng thái</th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Ghim
                    </th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {wishes.map((wish) => (
                    <tr
                      key={wish.id}
                      className="border-t border-[#2D231F]/10 hover:bg-[#2D231F]/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{wish.guestName}</div>
                      </td>
                      <td className="px-4 py-3 max-w-100">
                        <div className="truncate text-[#2D231F]/80">
                          {wish.content}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            wish.isApproved
                              ? "bg-green-500/10 text-green-400 border-green-500/25"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/25"
                          }`}
                        >
                          {wish.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {wish.isPinned ? (
                          <Pin size={16} className="text-blue-400 mx-auto" />
                        ) : (
                          <span className="text-[#7A6A5C]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!wish.isApproved && (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleApprove(wish.id)}
                              title="Duyệt"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            >
                              <CheckCircle size={14} />
                            </Button>
                          )}
                          {wish.isApproved && (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleReject(wish.id)}
                              title="Từ chối"
                              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                            >
                              <ThumbsDown size={14} />
                            </Button>
                          )}
                          {!wish.isPinned ? (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handlePin(wish.id)}
                              title="Ghim"
                              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            >
                              <Pin size={14} />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => handleUnpin(wish.id)}
                              title="Bỏ ghim"
                              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                            >
                              <PinOff size={14} />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleDelete(wish.id)}
                            title="Xoá"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
