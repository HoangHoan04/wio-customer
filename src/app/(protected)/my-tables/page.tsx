"use client";

import { enumData } from "@/common/enum";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GuestDto, TableDto } from "@/dto";
import { useToast } from "@/hooks/useToast";
import { guestService } from "@/services/guest.service";
import { invitationService } from "@/services/invitation.service";
import { tableService } from "@/services/table.service";
import { invitationLabel } from "@/utils/invitation-mapper";
import {
  Armchair,
  Edit2,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

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
  cardType?: string;
  enabledModules?: string[];
}

export default function MyTablesPage() {
  const { showToast } = useToast();
  const [invitations, setInvitations] = useState<InvitationOption[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");
  const [tables, setTables] = useState<TableDto[]>([]);
  const [guests, setGuests] = useState<GuestDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTable, setEditingTable] = useState<TableDto | null>(null);
  const [tableName, setTableName] = useState("");
  const [tableSeats, setTableSeats] = useState(10);
  const [tableDesc, setTableDesc] = useState("");
  const [activeTableForAssign, setActiveTableForAssign] =
    useState<TableDto | null>(null);
  const [guestSearchQuery, setGuestSearchQuery] = useState("");

  useEffect(() => {
    invitationService
      .pagination({ skip: 0, take: 50, where: {} })
      .then((res) => {
        const list = (res.data ?? []).filter(
          (
            inv: InvitationOption & {
              cardType?: string;
              enabledModules?: string[];
            },
          ) =>
            inv.enabledModules?.includes("SEATING") ||
            inv.cardType === "WEDDING",
        );
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

  const refreshData = () => {
    if (!selectedInvitationId) return;
    setIsLoading(true);
    Promise.all([
      tableService.getTables({
        skip: 0,
        take: 100,
        where: { invitationId: selectedInvitationId },
      }),
      guestService.getGuests({
        skip: 0,
        take: 1000,
        where: { invitationId: selectedInvitationId },
      }),
    ])
      .then(([resTables, resGuests]) => {
        setTables(resTables.data ?? []);
        setGuests(resGuests.data ?? []);
      })
      .catch((err) => {
        console.error(err);
        showToast({
          message: "Không thể tải dữ liệu bàn tiệc/khách mời",
          type: "error",
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    refreshData();
  }, [selectedInvitationId]);

  const handleOpenCreate = () => {
    setEditingTable(null);
    setTableName("");
    setTableSeats(10);
    setTableDesc("");
    setOpenDialog(true);
  };

  const handleOpenEdit = (table: TableDto) => {
    setEditingTable(table);
    setTableName(table.name);
    setTableSeats(table.maxSeats);
    setTableDesc(table.description || "");
    setOpenDialog(true);
  };

  const handleSaveTable = async () => {
    if (!tableName.trim()) {
      showToast({ message: "Vui lòng nhập tên bàn", type: "error" });
      return;
    }
    try {
      if (editingTable) {
        await tableService.updateTable({
          id: editingTable.id,
          name: tableName,
          maxSeats: tableSeats,
          description: tableDesc,
        });
        showToast({ message: "Cập nhật bàn thành công", type: "success" });
      } else {
        await tableService.createTable({
          invitationId: selectedInvitationId,
          name: tableName,
          maxSeats: tableSeats,
          description: tableDesc,
        });
        showToast({ message: "Thêm bàn thành công", type: "success" });
      }
      setOpenDialog(false);
      refreshData();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Lưu thông tin thất bại",
        type: "error",
      });
    }
  };

  const handleDeleteTable = async (id: string) => {
    if (
      !confirm(
        "Bạn có chắc chắn muốn xóa bàn này? Khách mời trong bàn sẽ chuyển về chưa xếp chỗ.",
      )
    )
      return;
    try {
      await tableService.deleteTable(id);
      showToast({ message: "Xóa bàn thành công", type: "success" });
      refreshData();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Xóa thất bại",
        type: "error",
      });
    }
  };

  const handleAssignGuest = async (tableId: string, guestId: string) => {
    try {
      await tableService.assignGuest({ tableId, guestId });
      showToast({ message: "Xếp chỗ thành công", type: "success" });
      refreshData();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Xếp chỗ thất bại",
        type: "error",
      });
    }
  };

  const handleUnassignGuest = async (guestId: string) => {
    try {
      await tableService.unassignGuest({ guestId });
      showToast({ message: "Đã gỡ khách mời khỏi bàn", type: "success" });
      refreshData();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const unassignedGuests = useMemo(() => {
    return guests.filter(
      (g) => !g.tableId && g.rsvpStatus === enumData.RSVP_STATUS.ATTENDING.code,
    );
  }, [guests]);

  const searchFilteredUnassignedGuests = useMemo(() => {
    if (!guestSearchQuery.trim()) return unassignedGuests;
    return unassignedGuests.filter(
      (g) =>
        g.fullName?.toLowerCase().includes(guestSearchQuery.toLowerCase()) ||
        g.invitationCode
          ?.toLowerCase()
          .includes(guestSearchQuery.toLowerCase()),
    );
  }, [unassignedGuests, guestSearchQuery]);

  const stats = useMemo(() => {
    const totalTables = tables.length;
    const totalMaxSeats = tables.reduce((sum, t) => sum + t.maxSeats, 0);
    const seatedCount = guests
      .filter((g) => g.tableId)
      .reduce((sum, g) => sum + (g.attendingCount || 1), 0);
    return { totalTables, totalMaxSeats, seatedCount };
  }, [tables, guests]);

  return (
    <div
      className="min-h-screen pt-36 px-4 sm:px-8 lg:px-16 pb-24"
      style={{ background: C.bg, color: C.cream }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700&family=Montserrat:wght@300;400;600&display=swap');
      `}</style>

      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1
              className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-3 text-[#2D231F]"
              style={{
                fontFamily: "'Cinzel', serif",
              }}
            >
              Sơ đồ bàn tiệc
            </h1>
            <p className="text-sm font-light" style={{ color: C.muted }}>
              Quản lý số bàn, chỗ ngồi và xếp chỗ cho khách mời xác nhận tham dự
              đám cưới.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div
            className="p-6 rounded-2xl border flex items-center gap-4"
            style={{ borderColor: C.border, background: C.bgCard }}
          >
            <div className="p-3 bg-[#2D231F]/10 rounded-xl text-[#2D231F]">
              <Armchair size={24} />
            </div>
            <div>
              <p className="text-xs" style={{ color: C.muted }}>
                Tổng số bàn
              </p>
              <h3 className="text-2xl font-bold font-serif text-[#2D231F]">
                {stats.totalTables}
              </h3>
            </div>
          </div>
          <div
            className="p-6 rounded-2xl border flex items-center gap-4"
            style={{ borderColor: C.border, background: C.bgCard }}
          >
            <div className="p-3 bg-[#2D231F]/10 rounded-xl text-[#2D231F]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-xs" style={{ color: C.muted }}>
                Tổng số chỗ ngồi khả dụng
              </p>
              <h3 className="text-2xl font-bold font-serif text-[#2D231F]">
                {stats.totalMaxSeats} ghế
              </h3>
            </div>
          </div>
          <div
            className="p-6 rounded-2xl border flex items-center gap-4"
            style={{ borderColor: C.border, background: C.bgCard }}
          >
            <div className="p-3 bg-green-500/10 rounded-xl text-green-400">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-xs" style={{ color: C.muted }}>
                Khách đã xếp chỗ
              </p>
              <h3 className="text-2xl font-bold font-serif text-green-400">
                {stats.seatedCount} / {stats.totalMaxSeats} ghế
              </h3>
            </div>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <h2
            className="text-lg font-semibold text-[#2D231F]"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Danh sách bàn tiệc
          </h2>
          <Button
            onClick={handleOpenCreate}
            className="font-bold uppercase tracking-wider text-xs bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] shadow-sm cursor-pointer"
          >
            <Plus size={16} className="mr-2 text-[#F3EDE3]" />
            Thêm bàn mới
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#2D231F]/20 border-t-[#2D231F] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {tables.length === 0 ? (
                <div
                  className="text-center py-20 px-6 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-6"
                  style={{
                    borderColor: C.border,
                    background: "#EDE4D5",
                  }}
                >
                  <Armchair size={40} className="text-[#7A6A5C]" />
                  <div>
                    <h3
                      className="text-lg font-semibold mb-2"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      Chưa có bàn tiệc nào
                    </h3>
                    <p
                      className="text-xs font-light"
                      style={{ color: C.muted }}
                    >
                      Hãy nhấp vào nút "Thêm bàn mới" để thiết lập sơ đồ bàn
                      tiệc.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tables.map((table) => {
                    const seatedGuests = guests.filter(
                      (g) => g.tableId === table.id,
                    );
                    const filledPercent = Math.min(
                      100,
                      (table.currentSeats / table.maxSeats) * 100,
                    );
                    return (
                      <div
                        key={table.id}
                        className="rounded-2xl border p-5 flex flex-col justify-between transition-all hover:border-[#2D231F]/40 bg-[#EDE4D5]"
                        style={{ borderColor: C.border }}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-2 mb-3">
                            <div>
                              <h3 className="font-semibold text-base text-[#2D231F]">
                                {table.name}
                              </h3>
                              <p className="text-xs text-[#7A6A5C] mt-0.5">
                                {table.description || "Không có mô tả"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleOpenEdit(table)}
                                className="border-[#2D231F]/20 text-[#2D231F] hover:bg-[#2D231F]/10 h-7 w-7"
                              >
                                <Edit2 size={12} />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon-sm"
                                onClick={() => handleDeleteTable(table.id)}
                                className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-7 w-7"
                              >
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-1.5 mb-5">
                            <div className="flex justify-between text-xs font-medium">
                              <span style={{ color: C.muted }}>
                                Đã xếp chỗ:
                              </span>
                              <span className="text-[#7A6A5C]">
                                {table.currentSeats} / {table.maxSeats} ghế
                              </span>
                            </div>
                            <Progress
                              value={filledPercent}
                              className="h-1.5"
                              indicatorClassName={
                                filledPercent >= 100
                                  ? "bg-red-500"
                                  : filledPercent >= 80
                                    ? "bg-amber-500"
                                    : "bg-[#2D231F]"
                              }
                            />
                          </div>

                          <div className="space-y-2 max-h-48 overflow-y-auto mb-4 pr-1">
                            <span
                              className="text-[10px] uppercase font-bold tracking-wider"
                              style={{ color: C.muted }}
                            >
                              Danh sách khách ngồi bàn ({seatedGuests.length})
                            </span>
                            {seatedGuests.length === 0 ? (
                              <p
                                className="text-xs font-light italic"
                                style={{ color: C.muted }}
                              >
                                Bàn chưa có khách nào ngồi.
                              </p>
                            ) : (
                              seatedGuests.map((g) => (
                                <div
                                  key={g.id}
                                  className="flex justify-between items-center gap-2 p-2 rounded-lg bg-[#ffffff]/60 border border-[#2D231F]/5 text-xs"
                                >
                                  <div>
                                    <p className="font-medium text-[#2D231F]">
                                      {g.fullName}
                                    </p>
                                    <p className="text-[10px] text-[#7A6A5C]">
                                      {g.salutation} • {g.attendingCount} người
                                      •{" "}
                                      {enumData.SIDE_OPTIONS?.[
                                        g.groupCode || ""
                                      ]?.name || g.groupCode}
                                    </p>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    onClick={() => handleUnassignGuest(g.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-6 w-6"
                                    title="Gỡ khỏi bàn"
                                  >
                                    <X size={12} />
                                  </Button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActiveTableForAssign(table);
                              setGuestSearchQuery("");
                            }}
                            className="w-full text-xs font-semibold border-[#2D231F]/20 text-[#2D231F] hover:bg-[#2D231F]/10 py-1.5 h-8 mt-2"
                          >
                            Xếp chỗ khách
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div
                className="rounded-2xl border p-5 bg-[#EDE4D5] space-y-4"
                style={{ borderColor: C.border }}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className="font-semibold text-sm text-[#2D231F] uppercase tracking-wider"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Khách chưa xếp bàn ({unassignedGuests.length})
                  </h3>
                </div>

                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A6A5C]"
                  />
                  <Input
                    value={guestSearchQuery}
                    onChange={(e) => setGuestSearchQuery(e.target.value)}
                    placeholder="Tìm nhanh khách..."
                    className="pl-8 h-8 text-xs bg-transparent border-[#2D231F]/20 text-[#2D231F] placeholder:text-[#7A6A5C]/40"
                  />
                </div>

                <div className="space-y-2 max-h-120 overflow-y-auto pr-1">
                  {searchFilteredUnassignedGuests.length === 0 ? (
                    <p
                      className="text-xs font-light italic text-center py-6"
                      style={{ color: C.muted }}
                    >
                      {unassignedGuests.length === 0
                        ? "Tất cả khách mời đã được xếp chỗ."
                        : "Không tìm thấy khách nào khớp."}
                    </p>
                  ) : (
                    searchFilteredUnassignedGuests.map((g) => (
                      <div
                        key={g.id}
                        className="p-3 rounded-xl border border-[#2D231F]/10 bg-[#ffffff]/40 flex justify-between items-center gap-2"
                      >
                        <div>
                          <h4 className="font-medium text-xs text-[#2D231F]">
                            {g.fullName}
                          </h4>
                          <p className="text-[10px] text-[#7A6A5C] mt-0.5">
                            {g.salutation} • {g.attendingCount} người •{" "}
                            {enumData.SIDE_OPTIONS?.[g.groupCode || ""]?.name ||
                              g.groupCode}
                          </p>
                        </div>

                        <div className="flex shrink-0">
                          {tables.length > 0 && (
                            <Select
                              value=""
                              onValueChange={(tableId) => {
                                if (tableId) handleAssignGuest(tableId, g.id);
                              }}
                              items={tables.map((t) => ({
                                value: t.id,
                                label: t.name,
                              }))}
                            >
                              <SelectTrigger className="h-7 text-[10px] font-bold uppercase tracking-wider border-[#2D231F]/30 text-[#2D231F] bg-transparent px-2.5">
                                <SelectValue placeholder="Xếp bàn" />
                              </SelectTrigger>
                              <SelectContent className="bg-[#ffffff] border-[#2D231F]/30 text-[#2D231F]">
                                {tables.map((t) => (
                                  <SelectItem key={t.id} value={t.id}>
                                    {t.name} ({t.currentSeats}/{t.maxSeats})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          className="border border-[#2D231F]/20 bg-[#ffffff] text-[#2D231F] max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle
              style={{ fontFamily: "'Cinzel', serif", color: C.goldLight }}
            >
              {editingTable ? "Chỉnh sửa bàn tiệc" : "Thêm bàn tiệc mới"}
            </DialogTitle>
            <DialogDescription className="text-[#7A6A5C]">
              Cấu hình thông tin bàn tiệc và số lượng ghế tối đa.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tên bàn</Label>
              <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder="Ví dụ: Bàn VIP 1, Bàn Bạn Cấp 3..."
                className="bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/40"
              />
            </div>
            <div className="space-y-2">
              <Label>Số lượng ghế tối đa</Label>
              <Input
                type="number"
                value={tableSeats}
                onChange={(e) => setTableSeats(Number(e.target.value))}
                min={1}
                className="bg-transparent border-[#2D231F]/30 text-[#2D231F]"
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả / Ghi chú</Label>
              <Input
                value={tableDesc}
                onChange={(e) => setTableDesc(e.target.value)}
                placeholder="Ví dụ: Bàn họ hàng nhà trai..."
                className="bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/40"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(false)}
              className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveTable}
              className="font-bold uppercase tracking-wider text-xs bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] cursor-pointer"
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeTableForAssign !== null}
        onOpenChange={(open) => {
          if (!open) setActiveTableForAssign(null);
        }}
      >
        <DialogContent
          className="border border-[#2D231F]/20 bg-[#ffffff] text-[#2D231F] max-w-md"
          showCloseButton
        >
          <DialogHeader>
            <DialogTitle
              style={{ fontFamily: "'Cinzel', serif", color: C.goldLight }}
            >
              Xếp khách vào {activeTableForAssign?.name}
            </DialogTitle>
            <DialogDescription className="text-[#7A6A5C]">
              Chọn khách chưa có bàn để xếp vào bàn này (Còn{" "}
              {activeTableForAssign
                ? activeTableForAssign.maxSeats -
                  activeTableForAssign.currentSeats
                : 0}{" "}
              ghế).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7A6A5C]"
              />
              <Input
                value={guestSearchQuery}
                onChange={(e) => setGuestSearchQuery(e.target.value)}
                placeholder="Tìm khách hàng..."
                className="pl-8 h-9 text-xs bg-transparent border-[#2D231F]/20 text-[#2D231F] placeholder:text-[#7A6A5C]/40"
              />
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {searchFilteredUnassignedGuests.length === 0 ? (
                <p
                  className="text-xs font-light italic text-center py-6"
                  style={{ color: C.muted }}
                >
                  Không còn khách chưa xếp bàn nào thỏa mãn.
                </p>
              ) : (
                searchFilteredUnassignedGuests.map((g) => (
                  <div
                    key={g.id}
                    className="p-3 rounded-xl border border-[#2D231F]/10 bg-[#ffffff]/40 flex justify-between items-center gap-2"
                  >
                    <div>
                      <h4 className="font-medium text-xs text-[#2D231F]">
                        {g.fullName}
                      </h4>
                      <p className="text-[10px] text-[#7A6A5C] mt-0.5">
                        {g.salutation} • {g.attendingCount} người •{" "}
                        {enumData.SIDE_OPTIONS?.[g.groupCode || ""]?.name ||
                          g.groupCode}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        if (activeTableForAssign) {
                          handleAssignGuest(activeTableForAssign.id, g.id);
                          setActiveTableForAssign(null);
                        }
                      }}
                      className="text-[10px] px-3 py-1 h-7 font-bold uppercase tracking-wider bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] cursor-pointer"
                    >
                      Xếp chỗ
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
