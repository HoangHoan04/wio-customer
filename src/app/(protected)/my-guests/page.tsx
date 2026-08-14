"use client";

import { enumData } from "@/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { CreateGuestReq } from "@/dto";
import { useGuest } from "@/hooks/useGuest";
import { useToast } from "@/hooks/useToast";
import { cardTypeDefaults } from "@/services/card-type.service";
import { invitationService } from "@/services/invitation.service";
import {
  invitationLabel,
  publicInvitationPath,
} from "@/utils/invitation-mapper";
import {
  Copy,
  Download,
  FileUp,
  Plus,
  QrCode,
  Search,
  Share2,
  Trash2,
  Users,
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
  guestGroups?: { code: string; name: string }[];
}

interface GuestForm {
  id?: string;
  fullName: string;
  salutation: string;
  side: string;
  isVip: boolean;
  needsTransport: boolean;
  rsvpNote: string;
}

const emptyForm: GuestForm = {
  fullName: "",
  salutation: "Kính mời",
  side: "BOTH",
  isVip: false,
  needsTransport: false,
  rsvpNote: "",
};

export default function MyGuestsPage() {
  const { showToast } = useToast();
  const {
    loading,
    getGuests,
    createGuest,
    updateGuest,
    deleteGuest,
    generateQr,
    importExcel,
    createMany,
    downloadSampleExcel,
  } = useGuest();

  const [invitations, setInvitations] = useState<InvitationOption[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>("");
  const [guests, setGuests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGuest, setEditingGuest] = useState<any | null>(null);
  const [form, setForm] = useState<GuestForm>(emptyForm);

  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [bulkTab, setBulkTab] = useState<"text" | "excel">("text");
  const [bulkText, setBulkText] = useState("");
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<CreateGuestReq[]>([]);
  const [bulkSalutation, setBulkSalutation] = useState("Kính mời");
  const [bulkSide, setBulkSide] = useState("BOTH");
  const [guestGroups, setGuestGroups] = useState<
    { code: string; name: string }[]
  >(Object.values(enumData.SIDE_OPTIONS));

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
          message: "Không thể tải danh sách thiệp",
          type: "error",
        });
      });
  }, []);

  useEffect(() => {
    if (!selectedInvitationId) return;
    setIsLoading(true);
    Promise.all([
      getGuests(selectedInvitationId),
      invitationService.findById(selectedInvitationId),
    ])
      .then(([guestRes, invitationRes]) => {
        setGuests(guestRes.data ?? []);
        const invitation = invitationRes.data;
        const groups = invitation?.guestGroups?.length
          ? invitation.guestGroups.map((g) => ({
              code: g.code,
              name: g.name,
            }))
          : cardTypeDefaults(invitation?.cardType || "WEDDING")
              .defaultGuestGroups;
        setGuestGroups(groups);
        const defaultCode = groups[0]?.code || "BOTH";
        setBulkSide(defaultCode);
        setForm((prev) => ({
          ...prev,
          side: groups.some((g) => g.code === prev.side)
            ? prev.side
            : defaultCode,
        }));
      })
      .catch((err) => {
        console.error(err);
        showToast({ message: "Không thể tải khách mời", type: "error" });
      })
      .finally(() => setIsLoading(false));
  }, [selectedInvitationId]);

  const filteredGuests = useMemo(() => {
    if (!search.trim()) return guests;
    return guests.filter(
      (g) =>
        g.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        g.phone?.includes(search) ||
        g.email?.toLowerCase().includes(search.toLowerCase()) ||
        g.invitationCode?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [guests, search]);

  const groupLabel = (code?: string) =>
    guestGroups.find((g) => g.code === code)?.name ||
    enumData.SIDE_OPTIONS[code || ""]?.name ||
    code ||
    "—";

  const handleOpenCreate = () => {
    setEditingGuest(null);
    setForm({
      ...emptyForm,
      side: guestGroups[0]?.code || "BOTH",
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = (guest: any) => {
    setEditingGuest(guest);
    setForm({
      fullName: guest.fullName || "",
      salutation: guest.salutation || "Kính mời",
      side: guest.groupCode || guest.side || "BOTH",
      isVip: guest.isVip || false,
      needsTransport: guest.needsTransport || false,
      rsvpNote: guest.rsvpNote || "",
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) {
      showToast({ message: "Vui lòng nhập họ tên", type: "error" });
      return;
    }
    try {
      if (editingGuest) {
        await updateGuest({
          id: editingGuest.id,
          invitationId: selectedInvitationId,
          fullName: form.fullName,
          salutation: form.salutation,
          groupCode: form.side,
          isVip: form.isVip,
          needsTransport: form.needsTransport,
          rsvpNote: form.rsvpNote,
        });
        showToast({ message: "Cập nhật thành công", type: "success" });
      } else {
        await createGuest({
          invitationId: selectedInvitationId,
          fullName: form.fullName,
          salutation: form.salutation,
          groupCode: form.side,
          isVip: form.isVip,
          needsTransport: form.needsTransport,
          rsvpNote: form.rsvpNote,
        });
        showToast({ message: "Thêm khách mời thành công", type: "success" });
      }
      setOpenDialog(false);
      refreshGuests();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Thao tác thất bại",
        type: "error",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa khách mờnày?")) return;
    try {
      await deleteGuest(id);
      showToast({ message: "Xóa thành công", type: "success" });
      refreshGuests();
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Xóa thất bại",
        type: "error",
      });
    }
  };

  const refreshGuests = () => {
    if (!selectedInvitationId) return;
    setIsLoading(true);
    getGuests(selectedInvitationId)
      .then((res) => setGuests(res.data ?? []))
      .finally(() => setIsLoading(false));
  };

  const handleGenerateQr = async (id: string) => {
    try {
      const res = await generateQr(id);
      if (res.qrCodeUrl) {
        const link = document.createElement("a");
        link.href = res.qrCodeUrl;
        link.download = `qr-${id}.png`;
        link.click();
        showToast({ message: "Đã tải mã QR", type: "success" });
      }
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Tạo QR thất bại",
        type: "error",
      });
    }
  };

  const getGuestLink = (guest: any) => {
    const active = invitations.find((w) => w.id === selectedInvitationId);
    if (!active?.slug) return "";
    return `${window.location.origin}${publicInvitationPath(active.slug)}?code=${guest.invitationCode}`;
  };

  const handleCopyLink = (guest: any) => {
    const link = getGuestLink(guest);
    if (!link) {
      showToast({
        message: "Không tìm thấy thông tin đám cưới",
        type: "error",
      });
      return;
    }
    navigator.clipboard
      .writeText(link)
      .then(() =>
        showToast({ message: "Đã sao chép liên kết thiệp", type: "success" }),
      )
      .catch(() => showToast({ message: "Sao chép thất bại", type: "error" }));
  };

  const handleShareLink = async (guest: any) => {
    const link = getGuestLink(guest);
    if (!link) {
      showToast({
        message: "Không tìm thấy thông tin đám cưới",
        type: "error",
      });
      return;
    }
    const shareData = {
      title: "Thiệp cưới",
      text: `${guest.salutation || "Kính mời"} ${guest.fullName} tới dự lễ cưới chung vui cùng gia đình chúng tôi!`,
      url: link,
    };
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    } else {
      handleCopyLink(guest);
    }
  };

  const parseBulkText = (
    text: string,
    salutation: string,
    side: string,
  ): CreateGuestReq[] => {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const result = lines
      .map((line) => {
        const parts = line.split("|").map((p) => p.trim());
        const fullName = parts[0];
        if (!fullName) return null;
        return {
          invitationId: selectedInvitationId,
          fullName,
          salutation: salutation || "Kính mời",
          groupCode: side || "BOTH",
          isVip: false,
          attendingCount: 1,
          needsTransport: false,
        };
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);
    return result as CreateGuestReq[];
  };

  const handleBulkTextChange = (value: string) => {
    setBulkText(value);
    setBulkPreview(parseBulkText(value, bulkSalutation, bulkSide));
  };

  const handleBulkSalutationChange = (value: string) => {
    setBulkSalutation(value);
    setBulkPreview(parseBulkText(bulkText, value, bulkSide));
  };

  const handleBulkSideChange = (value: string) => {
    setBulkSide(value);
    setBulkPreview(parseBulkText(bulkText, bulkSalutation, value));
  };

  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setBulkFile(file);
  };

  const handleDownloadSample = async () => {
    try {
      await downloadSampleExcel();
      showToast({ message: "Đã tải file mẫu", type: "success" });
    } catch (err: any) {
      showToast({
        message: err.response?.data?.message || "Tải mẫu thất bại",
        type: "error",
      });
    }
  };

  const handleBulkSubmit = async () => {
    if (!selectedInvitationId) return;
    if (bulkTab === "text") {
      if (bulkPreview.length === 0) {
        showToast({ message: "Danh sách trống", type: "error" });
        return;
      }
      try {
        const res = await createMany(selectedInvitationId, bulkPreview);
        showToast({
          message: res.message || "Thêm danh sách thành công",
          type: "success",
        });
        setOpenBulkDialog(false);
        setBulkText("");
        setBulkPreview([]);
        refreshGuests();
      } catch (err: any) {
        showToast({
          message: err.response?.data?.message || "Thêm danh sách thất bại",
          type: "error",
        });
      }
    } else {
      if (!bulkFile) {
        showToast({ message: "Vui lòng chọn file Excel", type: "error" });
        return;
      }
      try {
        const res = await importExcel(selectedInvitationId, bulkFile);
        showToast({
          message: res.message || "Import Excel thành công",
          type: "success",
        });
        setOpenBulkDialog(false);
        setBulkFile(null);
        refreshGuests();
      } catch (err: any) {
        showToast({
          message: err.response?.data?.message || "Import Excel thất bại",
          type: "error",
        });
      }
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
              Quản lý khách mời
            </h1>
            <p className="text-sm font-light" style={{ color: C.muted }}>
              Tổ chức và theo dõi danh sách khách mời cho từng đám cưới.
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

        <div className="mb-6 flex justify-between items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6A5C]"
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, SĐT, email, mã mời..."
              className="pl-9 bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/50"
            />
          </div>
          <div className="flex gap-3">
            <Dialog open={openBulkDialog} onOpenChange={setOpenBulkDialog}>
              <DialogTrigger
                render={
                  <Button
                    variant="outline"
                    className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                    onClick={() => {
                      setBulkTab("text");
                      setBulkText("");
                      setBulkPreview([]);
                      setBulkFile(null);
                      setBulkSalutation("Kính mời");
                      setBulkSide("BOTH");
                    }}
                  >
                    <Users size={16} className="mr-2" />
                    Thêm nhiều khách mời
                  </Button>
                }
              />
              <DialogContent
                className="border border-[#2D231F]/20 bg-[#ffffff] text-[#2D231F] max-w-3xl"
                showCloseButton
              >
                <DialogHeader>
                  <DialogTitle
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: C.goldLight,
                    }}
                  >
                    Thêm nhiều khách mời
                  </DialogTitle>
                  <DialogDescription className="text-[#7A6A5C]">
                    Chọn cách nhập danh sách khách mời bên dưới.
                  </DialogDescription>
                </DialogHeader>

                <Tabs
                  value={bulkTab}
                  onValueChange={(v) => setBulkTab(v as "text" | "excel")}
                  className="w-full"
                >
                  <TabsList className="bg-[#ffffff] border border-[#2D231F]/20 mb-4">
                    <TabsTrigger value="text">Nhập từ danh sách</TabsTrigger>
                    <TabsTrigger value="excel">Nhập từ Excel</TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Lời mời đầu thiệp chung</Label>
                      <Input
                        value={bulkSalutation}
                        onChange={(e) =>
                          handleBulkSalutationChange(e.target.value)
                        }
                        placeholder="Ví dụ: Kính mời, Thân mời..."
                        className="bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nhóm khách</Label>
                      <RadioGroup
                        value={bulkSide}
                        onValueChange={handleBulkSideChange}
                        className="flex flex-row flex-wrap gap-6 py-1"
                      >
                        {guestGroups.map((group) => (
                          <div
                            key={group.code}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem
                              value={group.code}
                              id={`bulk-side-${group.code}`}
                            />
                            <Label
                              htmlFor={`bulk-side-${group.code}`}
                              className="cursor-pointer text-sm font-normal"
                            >
                              {group.name}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Danh sách tên khách mời (mỗi dòng một khách)
                      </Label>
                      <p className="text-xs text-[#7A6A5C]">
                        Mỗi dòng nhập một tên khách mời kèm danh xưng.
                      </p>
                      <p className="text-xs text-[#7A6A5C] leading-relaxed">
                        (Ví dụ: <br />
                        - Anh Hoàng Hùng <br />- Gia đình Anh Nam)
                      </p>
                      <Textarea
                        value={bulkText}
                        onChange={(e) => handleBulkTextChange(e.target.value)}
                        placeholder={`Anh Hoàng Hùng\nGia đình Anh Nam\nBạn Nguyễn Văn A`}
                        className="min-h-40 bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/50"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="excel" className="space-y-4">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                        onClick={handleDownloadSample}
                      >
                        <Download size={16} className="mr-2" />
                        Tải file mẫu Excel
                      </Button>
                      <input
                        id="bulk-excel-input"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleBulkFileChange}
                      />
                      <Button
                        variant="outline"
                        className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                        onClick={() =>
                          document.getElementById("bulk-excel-input")?.click()
                        }
                      >
                        <FileUp size={16} className="mr-2" />
                        Chọn file Excel
                      </Button>
                    </div>
                    {bulkFile && (
                      <div className="text-sm text-[#2D231F]">
                        File đã chọn:{" "}
                        <span className="text-[#7A6A5C]">{bulkFile.name}</span>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                {(bulkTab === "text" ? bulkPreview.length > 0 : bulkFile) && (
                  <div className="border border-[#2D231F]/20 rounded-xl p-4 bg-[#ffffff]/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4
                        className="font-semibold text-sm"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          color: C.goldLight,
                        }}
                      >
                        Xem trước
                      </h4>
                      <div className="flex gap-4 text-xs text-[#7A6A5C]">
                        <span>
                          Tổng số dòng:{" "}
                          <strong className="text-[#2D231F]">
                            {bulkTab === "text" ? bulkPreview.length : 1}
                          </strong>
                        </span>
                      </div>
                    </div>
                    {bulkTab === "text" && bulkPreview.length > 0 && (
                      <div className="max-h-60 overflow-auto rounded-lg border border-[#2D231F]/10">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-[#ffffff] text-[#2D231F]">
                            <tr>
                              <th className="px-3 py-2">Họ tên</th>
                              <th className="px-3 py-2">Bên</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkPreview.map((g, idx) => (
                              <tr
                                key={idx}
                                className="border-t border-[#2D231F]/10"
                              >
                                <td className="px-3 py-2">{g.fullName}</td>
                                <td className="px-3 py-2">
                                  {groupLabel(g.groupCode)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenBulkDialog(false)}
                    className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleBulkSubmit}
                    disabled={loading}
                    className="font-bold uppercase tracking-wider text-xs bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] cursor-pointer"
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận thêm"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger
                render={
                  <Button
                    onClick={handleOpenCreate}
                    className="font-bold uppercase tracking-wider text-xs bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] cursor-pointer"
                  >
                    <Plus
                      size={16}
                      strokeWidth={2.5}
                      className="text-[#F3EDE3]"
                    />
                    Thêm khách mời
                  </Button>
                }
              />
              <DialogContent
                className="border border-[#2D231F]/20 bg-[#ffffff] text-[#2D231F] max-w-lg"
                showCloseButton
              >
                <DialogHeader>
                  <DialogTitle
                    style={{
                      fontFamily: "'Cinzel', serif",
                      color: C.goldLight,
                    }}
                  >
                    {editingGuest ? "Chỉnh sửa khách mời" : "Thêm khách mời"}
                  </DialogTitle>
                  <DialogDescription className="text-[#7A6A5C]">
                    Nhập thông tin khách mời bên dưới.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Họ và tên</Label>
                    <Input
                      value={form.fullName}
                      onChange={(e) =>
                        setForm({ ...form, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Lời mời (đầu thiệp)</Label>
                    <Input
                      value={form.salutation}
                      onChange={(e) =>
                        setForm({ ...form, salutation: e.target.value })
                      }
                      placeholder="Kính mời / Thân mời..."
                      className="bg-transparent border-[#2D231F]/30 text-[#2D231F] placeholder:text-[#7A6A5C]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nhóm khách</Label>
                    <Select
                      value={form.side}
                      onValueChange={(v) => setForm({ ...form, side: v ?? "" })}
                      items={guestGroups.map((opt) => ({
                        value: opt.code,
                        label: opt.name,
                      }))}
                    >
                      <SelectTrigger className="bg-transparent border-[#2D231F]/30 text-[#2D231F]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#ffffff] border-[#2D231F]/30 text-[#2D231F]">
                        {guestGroups.map((opt) => (
                          <SelectItem
                            className="w-full bg-[#ffffff] text-[#2D231F]"
                            key={opt.code}
                            value={opt.code}
                          >
                            {opt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="isVip"
                      checked={form.isVip}
                      onChange={(e) =>
                        setForm({ ...form, isVip: e.target.checked })
                      }
                      className="accent-[#2D231F]"
                    />
                    <Label htmlFor="isVip" className="cursor-pointer">
                      Khách VIP
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 sm:col-span-2">
                    <input
                      type="checkbox"
                      id="needsTransport"
                      checked={form.needsTransport}
                      onChange={(e) =>
                        setForm({ ...form, needsTransport: e.target.checked })
                      }
                      className="accent-[#2D231F]"
                    />
                    <Label htmlFor="needsTransport" className="cursor-pointer">
                      Cần đưa đón
                    </Label>
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
                    onClick={handleSave}
                    disabled={loading}
                    className="font-bold uppercase tracking-wider text-xs bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] cursor-pointer"
                  >
                    {loading ? "Đang lưu..." : "Lưu"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24">
            <div className="w-12 h-12 border-4 border-[#2D231F]/20 border-t-[#2D231F] rounded-full animate-spin" />
          </div>
        ) : filteredGuests.length === 0 ? (
          <div
            className="text-center py-20 px-6 rounded-2xl border border-dashed flex flex-col items-center justify-center gap-6"
            style={{ borderColor: C.border, background: "#EDE4D5" }}
          >
            <div className="p-4 bg-[#2D231F]/5 rounded-full text-[#2D231F]">
              <Download size={40} strokeWidth={1.5} />
            </div>
            <div className="max-w-md">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Chưa có khách mời nào
              </h3>
              <p
                className="text-xs font-light leading-relaxed mb-6"
                style={{ color: C.muted }}
              >
                Hãy thêm khách mời hoặc import từ file Excel để quản lý dễ dàng
                hơn.
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
                    <th className="px-4 py-3 font-semibold">Họ tên</th>
                    <th className="px-4 py-3 font-semibold">Mã mời</th>
                    <th className="px-4 py-3 font-semibold">RSVP</th>
                    <th className="px-4 py-3 font-semibold">Số khách</th>
                    <th className="px-4 py-3 font-semibold text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGuests.map((guest) => (
                    <tr
                      key={guest.id}
                      className="border-t border-[#2D231F]/10 hover:bg-[#2D231F]/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium">{guest.fullName}</div>
                        <div className="text-xs text-[#7A6A5C]">
                          {guest.salutation} • {groupLabel(guest.groupCode)}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono text-[#7A6A5C]">
                        {guest.invitationCode}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            guest.rsvpStatus === "ATTENDING"
                              ? "bg-green-500/10 text-green-400 border-green-500/25"
                              : guest.rsvpStatus === "DECLINED"
                                ? "bg-red-500/10 text-red-400 border-red-500/25"
                                : "bg-[#2D231F]/10 text-[#7A6A5C] border-[#2D231F]/25"
                          }`}
                        >
                          {guest.rsvpStatus === "ATTENDING"
                            ? "Tham dự"
                            : guest.rsvpStatus === "DECLINED"
                              ? "Từ chối"
                              : "Chưa phản hồi"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {guest.attendingCount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleCopyLink(guest)}
                            title="Copy link thiệp"
                            className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                          >
                            <Copy size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleShareLink(guest)}
                            title="Chia sẻ thiệp"
                            className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                          >
                            <Share2 size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleGenerateQr(guest.id)}
                            title="Tải mã QR"
                            className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                          >
                            <QrCode size={14} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(guest)}
                            className="border-[#2D231F]/30 text-[#2D231F] hover:bg-[#2D231F]/10"
                          >
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={() => handleDelete(guest.id)}
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
