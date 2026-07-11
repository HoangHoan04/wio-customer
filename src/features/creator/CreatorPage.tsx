"use client";

import { YoutubeIcon } from "@/assets/icons";
import { formatDate, formatTime } from "@/common/helpers";
import { PUBLIC_ROUTES } from "@/common/routes";
import { getTemplateSchema } from "@/common/templateSchema";
import LoginModal from "@/components/auth/LoginModal";
import Button from "@/components/ui/button/Button";
import FileUpload from "@/components/ui/FileUpload";
import InputDate from "@/components/ui/input/InputDate";
import InputText from "@/components/ui/input/InputText";
import InputTime from "@/components/ui/input/InputTime";
import Modal from "@/components/ui/Modal";
import Switch from "@/components/ui/switch";
import { useToast } from "@/hooks/useToast";
import { musicBackgroundService } from "@/services/music-background.service";
import { templateService } from "@/services/template.service";
import { weddingService } from "@/services/wedding.service";
import { resolveThemeKey } from "@/templates/templates-available";
import tokenCache from "@/utils/token-cache";
import {
  Check,
  ExternalLink,
  Laptop,
  Music,
  Pause,
  Play,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Smartphone,
  Tablet as TabletIcon,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const DEVICES = [
  {
    id: "iphone-14-pro",
    name: "iPhone 14 Pro",
    type: "mobile",
    width: 393,
    height: 852,
  },
  {
    id: "iphone-17-promax",
    name: "iPhone 17 Pro Max",
    type: "mobile",
    width: 440,
    height: 956,
  },
  {
    id: "pixel-7",
    name: "Pixel 7 Pro",
    type: "mobile",
    width: 412,
    height: 892,
  },
  {
    id: "ipad-mini",
    name: "iPad Mini",
    type: "tablet",
    width: 768,
    height: 1024,
  },
  {
    id: "ipad-pro",
    name: "iPad Pro",
    type: "tablet",
    width: 1024,
    height: 1366,
  },
  {
    id: "laptop-14",
    name: 'Laptop 14" (HD)',
    type: "desktop",
    width: 1366,
    height: 768,
  },
  {
    id: "laptop-16",
    name: 'Laptop 16" (Pro)',
    type: "desktop",
    width: 1536,
    height: 960,
  },
  {
    id: "desktop-fhd",
    name: "Full HD Monitor",
    type: "desktop",
    width: 1920,
    height: 1080,
  },
];

const WEDDING_COLORS = [
  "#FFFFFF",
  "#FDFBF7",
  "#F5E6D3",
  "#F5C842",
  "#D4AF37",
  "#E4C59E",
  "#849A80",
  "#A8BCA1",
  "#C5A880",
  "#8C6D53",
  "#FAD0C9",
  "#F8AFA6",
  "#E8A09A",
  "#B95C50",
  "#9B2335",
  "#E0BBE4",
  "#957DAD",
  "#D291BC",
  "#FEC8D8",
  "#FFDFD3",
];

const extractAddressFromMapUrl = (url: string): string => {
  if (!url) return "";
  try {
    let targetUrl = url.trim();
    if (targetUrl.includes("<iframe")) {
      const match = targetUrl.match(/src=["']([^"']+)["']/);
      if (match) {
        targetUrl = match[1];
      }
    }

    if (targetUrl.startsWith("//")) {
      targetUrl = "https:" + targetUrl;
    }

    const urlObj = new URL(targetUrl);

    const q = urlObj.searchParams.get("q");
    if (q) return decodeURIComponent(q).replace(/\+/g, " ");

    const placeMatch = urlObj.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      return decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
    }
  } catch (e) {}
  return "";
};

const POPULAR_BANKS = [
  { name: "Vietcombank (VCB)", code: "VCB" },
  { name: "VietinBank (ICB)", code: "ICB" },
  { name: "BIDV", code: "BIDV" },
  { name: "Agribank (VBA)", code: "VBA" },
  { name: "Techcombank (TCB)", code: "TCB" },
  { name: "MB Bank (MB)", code: "MB" },
  { name: "ACB", code: "ACB" },
  { name: "VPBank (VPB)", code: "VPB" },
  { name: "Sacombank (STB)", code: "STB" },
  { name: "TPBank (TPB)", code: "TPB" },
  { name: "VIB", code: "VIB" },
  { name: "HDBank (HDB)", code: "HDB" },
  { name: "SHB", code: "SHB" },
];

const resolveQrUrl = (
  bankName: string,
  accountNumber: string,
  accountName: string,
  existingQrUrl?: string,
) => {
  if (existingQrUrl) return existingQrUrl;
  if (!bankName || !accountNumber) return "";
  const bank = POPULAR_BANKS.find(
    (b) =>
      b.name === bankName ||
      b.code === bankName ||
      bankName.toLowerCase().includes(b.code.toLowerCase()) ||
      bankName.toLowerCase().includes(b.name.toLowerCase()),
  );
  if (bank?.code) {
    return `https://img.vietqr.io/image/${bank.code}-${accountNumber}-compact2.jpg?amount=0&addInfo=Mung%20cuoi&accountName=${encodeURIComponent(accountName || "")}`;
  }
  return "";
};

export default function CreatorPage() {
  const params = useParams<{ themeCode?: string; id?: string }>();
  const themeCode = params.themeCode as string | undefined;
  const id = params.id as string | undefined;
  const router = useRouter();
  const { showToast } = useToast();
  const [loadedThemeCode, setLoadedThemeCode] = useState("");
  const activeThemeCode = themeCode || loadedThemeCode;

  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [activeBankTab, setActiveBankTab] = useState<"groom" | "bride">(
    "groom",
  );
  const [customColor, setCustomColor] = useState("#FFFFFF");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [pickerPointer, setPickerPointer] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const hexToHsl = (hex: string) => {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return { h, s, l };
  };

  const handleHexInput = (val: string) => {
    setCustomColor(val);

    let cleanVal = val.trim();
    if (!cleanVal.startsWith("#") && cleanVal.length > 0) {
      cleanVal = "#" + cleanVal;
    }

    if (/^#[0-9A-F]{6}$/i.test(cleanVal)) {
      const { h, s, l } = hexToHsl(cleanVal);

      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (1 - h) * rect.width;
        const y = (1 - l) * rect.height;
        setPickerPointer({ x, y });
      }
    }
  };

  useEffect(() => {
    if (showCustomPicker && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradientH.addColorStop(0, "rgb(255, 0, 0)");
        gradientH.addColorStop(0.15, "rgb(255, 0, 255)");
        gradientH.addColorStop(0.3, "rgb(0, 0, 255)");
        gradientH.addColorStop(0.45, "rgb(0, 255, 255)");
        gradientH.addColorStop(0.6, "rgb(0, 255, 0)");
        gradientH.addColorStop(0.75, "rgb(255, 255, 0)");
        gradientH.addColorStop(1, "rgb(255, 0, 0)");
        ctx.fillStyle = gradientH;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradientV.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradientV.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradientV.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradientV.addColorStop(1, "rgba(0, 0, 0, 1)");
        ctx.fillStyle = gradientV;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [showCustomPicker]);

  const handleCanvasInteraction = (e: React.MouseEvent<HTMLElement>) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clampedX = Math.max(0, Math.min(rect.width, x));
    const clampedY = Math.max(0, Math.min(rect.height, y));

    setPickerPointer({ x: clampedX, y: clampedY });

    const canvasX = Math.max(
      0,
      Math.min(canvas.width - 1, (clampedX / rect.width) * canvas.width),
    );
    const canvasY = Math.max(
      0,
      Math.min(canvas.height - 1, (clampedY / rect.height) * canvas.height),
    );

    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imgData = ctx.getImageData(canvasX, canvasY, 1, 1).data;
      const r = imgData[0];
      const g = imgData[1];
      const b = imgData[2];
      const hex =
        "#" +
        [r, g, b]
          .map((x) => {
            const hexStr = x.toString(16);
            return hexStr.length === 1 ? "0" + hexStr : hexStr;
          })
          .join("");
      setCustomColor(hex.toUpperCase());
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    setIsMouseDown(true);
    handleCanvasInteraction(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (isMouseDown) {
      handleCanvasInteraction(e);
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
  };

  const templateCode = resolveThemeKey(activeThemeCode || "");
  const templateSchema = getTemplateSchema(templateCode);

  const [templateId, setTemplateId] = useState<string>("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [previewMusicId, setPreviewMusicId] = useState<string | null>(null);

  const [musics, setMusics] = useState<any[]>([]);
  const [isAddingYoutube, setIsAddingYoutube] = useState(false);

  useEffect(() => {
    let interval: any;
    const fetchMusics = async () => {
      try {
        const res = (await musicBackgroundService.getMusics()) as any;
        const list = res.data?.data || res.data || [];
        setMusics(list);
        if (list.some((m: any) => m.status === "PROCESSING")) {
          interval = setTimeout(fetchMusics, 3000);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (showMusicModal) {
      fetchMusics();
    }
    return () => clearTimeout(interval);
  }, [showMusicModal]);

  const handleAddYoutube = async () => {
    if (!youtubeUrl) return;
    setIsAddingYoutube(true);
    try {
      await musicBackgroundService.importYoutube(youtubeUrl);
      setYoutubeUrl("");
      showToast({
        title: "Đang tải",
        message: "Hệ thống đang tải nhạc từ YouTube...",
        type: "success",
      });
      const res = (await musicBackgroundService.getMusics()) as any;
      const list = res.data?.data || res.data || [];
      setMusics(list);
    } catch (err) {
      showToast({
        title: "Lỗi",
        message: "Không thể tải nhạc từ YouTube",
        type: "error",
      });
    } finally {
      setIsAddingYoutube(false);
    }
  };

  const [musicSearch, setMusicSearch] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [tempMapUrl, setTempMapUrl] = useState("");

  const [selectedDeviceId, setSelectedDeviceId] = useState("iphone-14-pro");
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  });
  const workspaceRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const selectedDevice =
    DEVICES.find((d) => d.id === selectedDeviceId) || DEVICES[0];

  const [formData, setFormData] = useState({
    slug: "",
    displayOrder: "groom_first",
    groom: {
      name: "Chú rể",
      shortName: "Chú rể",
      title: "Trưởng Nam",
      familyTitle: "Ông bà",
      father: "Bố chú rể",
      mother: "Mẹ chú rể",
      address: "Địa chỉ",
      photo: "",
      bankAccount: {
        bankName: "",
        accountName: "",
        accountNumber: "",
        qrUrl: "",
      },
    },
    bride: {
      name: "Cô dâu",
      shortName: "Cô dâu",
      title: "Út Nữ",
      familyTitle: "Ông bà",
      father: "Bố cô dâu",
      mother: "Mẹ cô dâu",
      address: "Địa chỉ",
      photo: "",
      bankAccount: {
        bankName: "",
        accountName: "",
        accountNumber: "",
        qrUrl: "",
      },
    },
    showHeroImage: true,
    heroImageMain: "",
    showIntro: true,
    introText: "Trân trọng báo tin \n lễ thành hôn của hai con chúng tôi",
    events: [
      {
        id: crypto.randomUUID(),
        title: "Lễ thành hôn được cử hành tại",
        date: formatDate(new Date()),
        time: formatTime(new Date()),
        address: "Tư gia",
      },
    ],
    showGallery: true,
    galleryLayout: "grid",
    gallery: [],
    showParty: true,
    partyType: "wedding",
    partyDate: formatDate(new Date()),
    partyWelcomeTime: formatTime(new Date()),
    partyStartTime: formatTime(new Date()),
    showCountdown: true,
    partyAddress: "Địa chỉ",
    showMap: true,
    partyMapUrl: "",
    showDressCode: true,
    dressCodes: ["#FDFBF7", "#849A80"],
    showTimeline: true,
    timelineTitle: "Lịch trình ngày cưới",
    timeline: [
      {
        id: crypto.randomUUID(),
        time: formatTime(new Date()),
        title: "Đón khách",
      },
      {
        id: crypto.randomUUID(),
        time: formatTime(new Date()),
        title: "Khai tiệc",
      },
    ],
    showRsvp: true,
    rsvpType: "button",
    showGuestbook: true,
    guestbookStatic: true,
    guestbookFloating: false,
    showThankYou: true,
    thankYouText:
      "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!",
    showMusic: true,
    musicUrl: "",
    musicName: "",
  });

  useEffect(() => {
    const handleResize = () => {
      if (workspaceRef.current) {
        setContainerSize({
          width: workspaceRef.current.clientWidth,
          height: workspaceRef.current.clientHeight,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    const timer = setTimeout(handleResize, 150);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [selectedDeviceId]);

  useEffect(() => {
    sendDataToIframe();
  }, [formData]);

  useEffect(() => {
    const handleIframeMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "PREVIEW_READY") {
        sendDataToIframe();
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

  const sendDataToIframe = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const payload = {
        ...formData,
        musicUrl: formData.showMusic ? formData.musicUrl : "",
      };
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_WEDDING_DATA", data: payload },
        "*",
      );
    }
  };

  useEffect(() => {
    if (
      !formData.slug &&
      formData.groom.shortName &&
      formData.bride.shortName
    ) {
      const slugName = `${slugify(formData.groom.shortName)}-${slugify(formData.bride.shortName)}`;
      setFormData((prev) => ({ ...prev, slug: slugName }));
    }

    if (activeThemeCode && tokenCache.isAuthenticated()) {
      templateService
        .getTemplates({ where: { themeCode: templateCode } })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setTemplateId(res.data[0].id);
          }
        })
        .catch((err) => console.error("Failed to load template info", err));
    }
  }, [activeThemeCode]);

  const slugify = (str: string) => {
    return str
      .toLowerCase()
      .trim()
      .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, "a")
      .replace(/[éèẻẽẹêếềểễệ]/g, "e")
      .replace(/[íìỉĩị]/g, "i")
      .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, "o")
      .replace(/[úùủũụưứừửữự]/g, "u")
      .replace(/[ýỳỷỹỵ]/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]/g, "")
      .replace(/-+/g, "");
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      const newState = { ...prev, [field]: value };

      if (field === "partyWelcomeTime") {
        const newTimeline = [...prev.timeline];
        const idx = newTimeline.findIndex((t) =>
          t.title.toLowerCase().includes("đón khách"),
        );
        if (idx !== -1) {
          newTimeline[idx] = { ...newTimeline[idx], time: value };
          newState.timeline = newTimeline;
        }
      } else if (field === "partyStartTime") {
        const newTimeline = [...prev.timeline];
        const idx = newTimeline.findIndex((t) =>
          t.title.toLowerCase().includes("khai tiệc"),
        );
        if (idx !== -1) {
          newTimeline[idx] = { ...newTimeline[idx], time: value };
          newState.timeline = newTimeline;
        }
      }

      return newState;
    });
  };

  const handleNestedChange = (
    section: "bride" | "groom",
    field: string,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleBankChange = (
    section: "bride" | "groom",
    field: string,
    value: any,
  ) => {
    setFormData((prev) => {
      const currentBankAcc = { ...prev[section].bankAccount, [field]: value };
      currentBankAcc.qrUrl = resolveQrUrl(
        currentBankAcc.bankName,
        currentBankAcc.accountNumber,
        currentBankAcc.accountName,
      );
      return {
        ...prev,
        [section]: {
          ...prev[section],
          bankAccount: currentBankAcc,
        },
      };
    });
  };

  const addEvent = () => {
    setFormData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          id: crypto.randomUUID(),
          title: "Lễ Mới",
          date: "",
          time: "",
          address: "",
        },
      ],
    }));
  };
  const removeEvent = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== id),
    }));
  };
  const updateEvent = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      events: prev.events.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));
  };

  const addTimeline = () => {
    setFormData((prev) => ({
      ...prev,
      timeline: [
        ...prev.timeline,
        { id: crypto.randomUUID(), time: "", title: "" },
      ],
    }));
  };
  const removeTimeline = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.filter((t) => t.id !== id),
    }));
  };
  const updateTimeline = (id: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      timeline: prev.timeline.map((t) =>
        t.id === id ? { ...t, [field]: value } : t,
      ),
    }));
  };

  const toggleDressCode = (color: string) => {
    setFormData((prev) => {
      const exists = prev.dressCodes.includes(color);
      if (exists)
        return {
          ...prev,
          dressCodes: prev.dressCodes.filter((c) => c !== color),
        };
      return { ...prev, dressCodes: [...prev.dressCodes, color] };
    });
  };

  useEffect(() => {
    if (id) {
      setIsLoadingData(true);
      weddingService
        .getWeddingById(id)
        .then((res) => {
          if (res?.data) {
            const w = res.data;

            if (w.status === "published") {
              showToast({
                title: "Không thể chỉnh sửa",
                message: "Thiệp đã xuất bản không thể chỉnh sửa",
                type: "error",
              });
              router.push("/templates");
              return;
            }

            setFormData({
              slug: w.slug || "",
              displayOrder: w.displayOrder || "",
              showHeroImage: w.showHeroImage ?? true,
              heroImageMain: w.heroImageMain || "",
              showIntro: w.showIntro ?? true,
              introText: w.invitationText || "Trân trọng kính mời...",
              showGallery: w.showGallery ?? true,
              galleryLayout: w.galleryLayout || "grid",
              gallery:
                w.photos
                  ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((p: any) => p.url) || [],
              showParty: w.showParty ?? true,
              partyType: w.partyType || "wedding",
              partyDate: w.ceremonyAt
                ? new Date(w.ceremonyAt).toISOString().split("T")[0]
                : "",
              partyWelcomeTime: w.receptionWelcomeTime || "10:30",
              partyStartTime: w.ceremonyAt
                ? new Date(w.ceremonyAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })
                : "11:30",
              partyAddress: w.ceremonyAddress || "",
              partyMapUrl: w.ceremonyMapsUrl || "",
              showCountdown: w.showCountdown ?? true,
              showMap: w.showMap ?? true,
              showDressCode: w.showDressCode ?? true,
              dressCodes: w.dressCodes || [],
              showTimeline: w.showTimeline ?? true,
              timelineTitle: w.timelineTitle || "Lịch trình ngày cưới",
              timeline:
                w.timelines
                  ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((t: any) => ({
                    id: t.id || Date.now().toString(),
                    time: t.time || "",
                    title: t.title || "",
                  })) || [],
              showRsvp: w.showRsvp ?? true,
              rsvpType: w.rsvpType || "form",
              showGuestbook: w.showGuestbook ?? true,
              guestbookStatic: w.guestbookStatic ?? true,
              guestbookFloating: w.guestbookFloating ?? true,
              showThankYou: w.showThankYou ?? true,
              thankYouText: w.thankYouText || "Chân thành cảm ơn!",
              showMusic: !!w.musicUrl || true,
              musicUrl: w.musicUrl || "",
              musicName: w.musicName || "",
              events:
                w.events
                  ?.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
                  .map((e: any) => ({
                    id: e.id || Date.now().toString(),
                    date: e.date || "",
                    time: e.time || "",
                    title: e.title || "",
                    address: e.address || "",
                  })) || [],
              groom: {
                name: w.groomName || "",
                shortName: w.groomShortName || "",
                title: w.groomTitle || "Chú rể",
                familyTitle: w.groomFamilyTitle || "",
                father: w.groomFatherName || "",
                mother: w.groomMotherName || "",
                address: w.groomAddress || "",
                photo: w.groomPhotoUrl || "",
                bankAccount: {
                  bankName: w.groomBankName || "",
                  accountNumber: w.groomBankAccount || "",
                  accountName: w.groomBankOwner || "",
                  qrUrl: resolveQrUrl(
                    w.groomBankName || "",
                    w.groomBankAccount || "",
                    w.groomBankOwner || "",
                    w.groomQrUrl,
                  ),
                },
              },
              bride: {
                name: w.brideName || "",
                shortName: w.brideShortName || "",
                title: w.brideTitle || "Cô dâu",
                familyTitle: w.brideFamilyTitle || "",
                father: w.brideFatherName || "",
                mother: w.brideMotherName || "",
                address: w.brideAddress || "",
                photo: w.bridePhotoUrl || "",
                bankAccount: {
                  bankName: w.brideBankName || "",
                  accountNumber: w.brideBankAccount || "",
                  accountName: w.brideBankOwner || "",
                  qrUrl: w.brideQrUrl || "",
                },
              },
            });
            setTempMapUrl(w.ceremonyMapsUrl || "");
            if (w.template?.themeCode) {
              setLoadedThemeCode(w.template.themeCode);
            } else if (w.template?.slug) {
              setLoadedThemeCode(w.template.slug);
            }
            if (w.templateId) {
              setTemplateId(w.templateId);
            }

            setTimeout(() => {
              sendDataToIframe();
            }, 500);
          }
        })
        .catch(() => {
          showToast({
            title: "Lỗi",
            message: "Không thể tải dữ liệu thiệp cưới",
            type: "error",
          });
        })
        .finally(() => {
          setIsLoadingData(false);
        });
    }
  }, [id]);

  const handlePublish = async () => {
    if (!tokenCache.isAuthenticated()) {
      showToast({
        title: "Yêu cầu đăng nhập",
        message: "Bạn cần đăng nhập để lưu thiệp cưới.",
        type: "info",
      });
      setShowLoginModal(true);
      return;
    }
    setIsPublishing(true);
    try {
      const user = tokenCache.getUser();
      const payload = {
        userId: user?.id || "",
        templateId: templateId || undefined,
        slug: formData.slug || `${Date.now()}`,
        displayOrder: formData.displayOrder,
        showHeroImage: formData.showHeroImage,
        heroImageMain: formData.heroImageMain,

        groomName: formData.groom.name,
        groomShortName: formData.groom.shortName,
        groomTitle: formData.groom.title,
        groomFatherName: formData.groom.father,
        groomMotherName: formData.groom.mother,
        groomAddress: formData.groom.address,
        groomPhotoUrl: formData.groom.photo,
        groomBankAccount: formData.groom.bankAccount.accountNumber,
        groomBankName: formData.groom.bankAccount.bankName,
        groomBankOwner: formData.groom.bankAccount.accountName,
        groomQrUrl: formData.groom.bankAccount.qrUrl,

        brideName: formData.bride.name,
        brideShortName: formData.bride.shortName,
        brideTitle: formData.bride.title,
        brideFatherName: formData.bride.father,
        brideMotherName: formData.bride.mother,
        brideAddress: formData.bride.address,
        bridePhotoUrl: formData.bride.photo,
        brideBankAccount: formData.bride.bankAccount.accountNumber,
        brideBankName: formData.bride.bankAccount.bankName,
        brideBankOwner: formData.bride.bankAccount.accountName,
        brideQrUrl: formData.bride.bankAccount.qrUrl,

        showIntro: formData.showIntro,
        invitationText: formData.introText,

        events: id
          ? formData.events
          : formData.events.map(({ id: _id, ...rest }) => rest),

        showGallery: formData.showGallery,
        galleryLayout: formData.galleryLayout,
        gallery: formData.gallery,

        showParty: formData.showParty,
        partyType: formData.partyType,
        receptionWelcomeTime: formData.partyWelcomeTime,
        ceremonyAt: new Date(
          formData.partyDate + "T" + (formData.partyWelcomeTime || "00:00"),
        ),
        ceremonyVenue: formData.partyAddress,
        ceremonyAddress: formData.partyAddress,
        ceremonyMapsUrl: formData.partyMapUrl,
        showCountdown: formData.showCountdown,
        showMap: formData.showMap,

        showDressCode: formData.showDressCode,
        dressCodes: formData.dressCodes,

        showTimeline: formData.showTimeline,
        timelineTitle: formData.timelineTitle,
        timelines: id
          ? formData.timeline
          : formData.timeline.map(({ id: _id, ...rest }) => rest),

        showRsvp: formData.showRsvp,
        rsvpType: formData.rsvpType,

        showGuestbook: formData.showGuestbook,
        guestbookStatic: formData.guestbookStatic,
        guestbookFloating: formData.guestbookFloating,

        showThankYou: formData.showThankYou,
        thankYouText: formData.thankYouText,

        musicUrl: formData.musicUrl,
        musicName: formData.musicName,
        musicAutoplay: true,

        status: "draft" as any,
      };

      if (id) {
        await weddingService.updateWedding(id, payload);
        showToast({
          title: "Cập nhật thành công",
          message: "Thiệp cưới của bạn đã được cập nhật!",
          type: "success",
        });
      } else {
        const saveRes = await weddingService.createWedding(payload);
        const weddingId = saveRes.data?.id;

        if (weddingId) {
          await weddingService.publishWedding(weddingId);
          setPublishedUrl(`${window.location.origin}/thiep/${payload.slug}`);
          setShowSuccessModal(true);
          showToast({
            title: "Xuất bản thành công",
            message: "Thiệp cưới của bạn đã được xuất bản!",
            type: "success",
          });
        }
      }
    } catch (err: any) {
      showToast({
        title: "Thất bại",
        message: err.message || "Không thể lưu thiệp cưới.",
        type: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const scaleX = (containerSize.width - 60) / selectedDevice.width;
  const scaleY = (containerSize.height - 60) / selectedDevice.height;
  const optimalScale = Math.min(scaleX, scaleY, 1);

  if (!activeThemeCode) {
    if (id && isLoadingData) {
      return (
        <div className="min-h-screen bg-[#0a0508] flex items-center justify-center text-[#f5e6d3]">
          Đang tải thiệp cưới...
        </div>
      );
    }
    return <div>Không tìm thấy giao diện</div>;
  }

  return (
    <div
      className="flex h-screen w-full bg-[#0a0508] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="w-full md:w-1/2 shrink-0 border-r border-[#d4af37]/25 flex flex-col h-full bg-[#0f0608]">
        <div className="p-4 border-b border-[#d4af37]/15 bg-white/2 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-bold text-[#d4af37]">
            Trình tạo thiệp cưới
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 text-[#f5e6d3] text-left custom-scrollbar pb-32">
          {/* Section 1: Thông tin cơ bản */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
              1. Thông tin cơ bản
            </h3>
            <InputText
              label="Đường dẫn thiệp (/thiep/___)"
              value={formData.slug}
              onChange={(e) => handleChange("slug", slugify(e.target.value))}
              className="bg-white/3! border-[#d4af37]/15!"
            />

            <div className="flex items-center gap-4 bg-[#1a1012] p-2 rounded-lg w-max">
              <p className="text-base font-bold text-[#d4af37]">
                Hiển thị theo:{" "}
              </p>
              <button
                onClick={() => handleChange("displayOrder", "groom_first")}
                className={`px-4 py-2 rounded-md text-sm transition-all ${formData.displayOrder === "groom_first" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
              >
                Nhà chú rể trước
              </button>
              <button
                onClick={() => handleChange("displayOrder", "bride_first")}
                className={`px-4 py-2 rounded-md text-sm transition-all ${formData.displayOrder === "bride_first" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
              >
                Nhà cô dâu trước
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#d4af37] uppercase">
                  Chú rể
                </span>
                <InputText
                  label="Họ tên"
                  value={formData.groom.name}
                  onChange={(e) =>
                    handleNestedChange("groom", "name", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Tên ngắn"
                  value={formData.groom.shortName}
                  onChange={(e) =>
                    handleNestedChange("groom", "shortName", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Danh xưng"
                  value={formData.groom.title}
                  onChange={(e) =>
                    handleNestedChange("groom", "title", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
              </div>
              <div className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#d4af37] uppercase">
                  Cô dâu
                </span>
                <InputText
                  label="Họ tên"
                  value={formData.bride.name}
                  onChange={(e) =>
                    handleNestedChange("bride", "name", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Tên ngắn"
                  value={formData.bride.shortName}
                  onChange={(e) =>
                    handleNestedChange("bride", "shortName", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Danh xưng"
                  value={formData.bride.title}
                  onChange={(e) =>
                    handleNestedChange("bride", "title", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Ảnh đầu thiệp */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                2. Ảnh đầu thiệp
              </h3>
              <Switch
                checked={formData.showHeroImage}
                onChange={(val) => handleChange("showHeroImage", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showHeroImage && (
              <div className="grid grid-cols-2 gap-4">
                {templateSchema.heroStyle === "split" ? (
                  <>
                    <FileUpload
                      label="Ảnh chú rể"
                      value={formData.groom.photo}
                      onChange={(url) =>
                        handleNestedChange("groom", "photo", url)
                      }
                      onAuthRequired={() => setShowLoginModal(true)}
                    />
                    <FileUpload
                      label="Ảnh cô dâu"
                      value={formData.bride.photo}
                      onChange={(url) =>
                        handleNestedChange("bride", "photo", url)
                      }
                      onAuthRequired={() => setShowLoginModal(true)}
                    />
                  </>
                ) : templateSchema.heroStyle === "single" ? (
                  <div className="col-span-2">
                    <FileUpload
                      label="Ảnh chụp chung (Bìa)"
                      value={formData.heroImageMain}
                      onChange={(url) => handleChange("heroImageMain", url)}
                      onAuthRequired={() => setShowLoginModal(true)}
                    />
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Section 3: Thông tin gia đình */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
              3. Thông tin gia đình
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#d4af37] uppercase">
                  Nhà Trai
                </span>
                <InputText
                  label="Danh xưng"
                  value={formData.groom.familyTitle}
                  onChange={(e) =>
                    handleNestedChange("groom", "familyTitle", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Họ tên bố"
                  value={formData.groom.father}
                  onChange={(e) =>
                    handleNestedChange("groom", "father", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Họ tên mẹ"
                  value={formData.groom.mother}
                  onChange={(e) =>
                    handleNestedChange("groom", "mother", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Địa chỉ nhà trai"
                  value={formData.groom.address}
                  onChange={(e) =>
                    handleNestedChange("groom", "address", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
              </div>
              <div className="flex flex-col gap-3 p-3 bg-white/3 rounded-lg border border-white/5">
                <span className="text-xs font-bold text-[#d4af37] uppercase">
                  Nhà Gái
                </span>
                <InputText
                  label="Danh xưng"
                  value={formData.bride.familyTitle}
                  onChange={(e) =>
                    handleNestedChange("bride", "familyTitle", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Họ tên bố"
                  value={formData.bride.father}
                  onChange={(e) =>
                    handleNestedChange("bride", "father", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Họ tên mẹ"
                  value={formData.bride.mother}
                  onChange={(e) =>
                    handleNestedChange("bride", "mother", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <InputText
                  label="Địa chỉ nhà gái"
                  value={formData.bride.address}
                  onChange={(e) =>
                    handleNestedChange("bride", "address", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Lời mở đầu thiệp */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                4. Lời mở đầu thiệp
              </h3>
              <Switch
                checked={formData.showIntro}
                onChange={(val) => handleChange("showIntro", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showIntro && (
              <textarea
                value={formData.introText}
                onChange={(e) => handleChange("introText", e.target.value)}
                rows={4}
                placeholder="Nhập lời mở đầu..."
                className="w-full bg-[#1f1f1f] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
              />
            )}
          </div>

          {/* Section 5: Lễ */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
              5. Lễ (Sự kiện chính)
            </h3>
            <div className="flex flex-col gap-4">
              {formData.events.map((event, idx) => (
                <div
                  key={event.id}
                  className="p-4 bg-white/3 border border-[#d4af37]/20 rounded-lg relative flex flex-col gap-3"
                >
                  <div
                    className="absolute top-3 right-3 text-red-400 hover:text-red-500 cursor-pointer"
                    onClick={() => removeEvent(event.id)}
                  >
                    <Trash2 size={16} />
                  </div>
                  <span className="text-xs font-bold text-[#f5c842]">
                    Lễ {idx + 1}
                  </span>
                  <InputText
                    label="Tiêu đề lễ (vd: Lễ Ăn Hỏi)"
                    value={event.title}
                    onChange={(e) =>
                      updateEvent(event.id, "title", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <InputDate
                      label="Ngày tổ chức"
                      value={event.date}
                      onChange={(val) => updateEvent(event.id, "date", val)}
                    />
                    <InputTime
                      label="Giờ tổ chức"
                      value={event.time}
                      onChange={(val) => updateEvent(event.id, "time", val)}
                    />
                  </div>
                  <InputText
                    label="Địa chỉ tổ chức"
                    value={event.address}
                    onChange={(e) =>
                      updateEvent(event.id, "address", e.target.value)
                    }
                    className="bg-white/5! border-[#d4af37]/10!"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addEvent}
                className="w-full border-dashed border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 py-3 rounded-lg flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} /> Thêm Lễ
              </Button>
            </div>
          </div>

          {/* Section 6: Thư viện ảnh cưới */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                6. Thư viện ảnh cưới
              </h3>
              <Switch
                checked={formData.showGallery}
                onChange={(val) => handleChange("showGallery", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showGallery && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 bg-[#1a1012] p-1.5 rounded-lg w-full">
                  <button
                    onClick={() => handleChange("galleryLayout", "grid")}
                    className={`flex-1 py-2 text-xs rounded-md transition-all ${formData.galleryLayout === "grid" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
                  >
                    Lưới (Grid)
                  </button>
                  <button
                    onClick={() => handleChange("galleryLayout", "collage")}
                    className={`flex-1 py-2 text-xs rounded-md transition-all ${formData.galleryLayout === "collage" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
                  >
                    Ghép ảnh
                  </button>
                  <button
                    onClick={() => handleChange("galleryLayout", "3d")}
                    className={`flex-1 py-2 text-xs rounded-md transition-all ${formData.galleryLayout === "3d" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
                  >
                    3D Carousel
                  </button>
                </div>
                <FileUpload
                  label="Tải ảnh lên thư viện"
                  mode="multi"
                  value={formData.gallery}
                  onChange={(urls) => handleChange("gallery", urls)}
                  onAuthRequired={() => setShowLoginModal(true)}
                />
              </div>
            )}
          </div>

          {/* Section 7: Tiệc */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">7. Tiệc</h3>
              <Switch
                checked={formData.showParty}
                onChange={(val) => handleChange("showParty", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showParty && (
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#f5e6d3]">
                    <input
                      type="radio"
                      checked={formData.partyType === "wedding"}
                      onChange={() => handleChange("partyType", "wedding")}
                      className="accent-[#d4af37]"
                    />
                    Tiệc Cưới
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-[#f5e6d3]">
                    <input
                      type="radio"
                      checked={formData.partyType === "engagement"}
                      onChange={() => handleChange("partyType", "engagement")}
                      className="accent-[#d4af37]"
                    />
                    Tiệc Báo Hỷ
                  </label>
                </div>
                <InputDate
                  label="Ngày tổ chức"
                  value={formData.partyDate}
                  onChange={(val) => handleChange("partyDate", val)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <InputTime
                    label="Đón khách lúc"
                    value={formData.partyWelcomeTime}
                    onChange={(val) => handleChange("partyWelcomeTime", val)}
                  />
                  <InputTime
                    label="Khai tiệc lúc"
                    value={formData.partyStartTime}
                    onChange={(val) => handleChange("partyStartTime", val)}
                  />
                </div>
                <div className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                  <span className="text-sm">Hiển thị đồng hồ đếm ngược</span>
                  <Switch
                    checked={formData.showCountdown}
                    onChange={(val) => handleChange("showCountdown", val)}
                  />
                </div>
                <InputText
                  label="Địa chỉ tổ chức tiệc"
                  value={formData.partyAddress}
                  onChange={(e) => handleChange("partyAddress", e.target.value)}
                  className="bg-white/5! border-[#d4af37]/10!"
                  placeholder="Nhập địa chỉ để tự động hiện bản đồ..."
                />
                {formData.partyAddress && formData.showMap && (
                  <div className="rounded-lg overflow-hidden border border-[#d4af37]/20 shadow-inner">
                    <div className="text-[10px] text-[#f5e6d3]/40 px-2 py-1 bg-white/5">
                      Xem trước bản đồ theo địa chỉ
                    </div>
                    <iframe
                      width="100%"
                      height="180"
                      style={{ border: 0, display: "block" }}
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(formData.partyAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    />
                  </div>
                )}
                <div className="flex flex-col gap-2 p-3 border border-[#d4af37]/20 rounded-lg bg-white/3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#d4af37]">
                      Hiển thị Bản Đồ
                    </span>
                    <Switch
                      checked={formData.showMap}
                      onChange={(val) => handleChange("showMap", val)}
                    />
                  </div>
                  {formData.showMap && (
                    <div className="mt-2 flex flex-col gap-2">
                      <label className="text-xs font-medium text-[#f5e6d3]/60 mb-1">
                        URL Google Maps
                      </label>
                      <div className="flex items-center gap-2">
                        <InputText
                          value={tempMapUrl}
                          onChange={(e) => setTempMapUrl(e.target.value)}
                          className="bg-white/5! border-[#d4af37]/10!"
                          wrapperClassName="flex-1"
                          placeholder="Dán link hoặc iframe..."
                        />
                        <Button
                          onClick={async () => {
                            let finalUrl = tempMapUrl;

                            if (
                              tempMapUrl.includes("maps.app.goo.gl") ||
                              tempMapUrl.includes("goo.gl/maps")
                            ) {
                              try {
                                const res =
                                  await weddingService.resolveMapUrl(
                                    tempMapUrl,
                                  );
                                if (res?.data?.url) {
                                  finalUrl = res.data.url;
                                } else {
                                  showToast({
                                    title: "Không tìm thấy URL",
                                    message:
                                      "API không trả về đường dẫn giải mã.",
                                    type: "warning",
                                  });
                                }
                              } catch (e: any) {
                                console.error(
                                  "Failed to resolve shortened map URL",
                                  e,
                                );
                                showToast({
                                  title: "Lỗi giải mã liên kết",
                                  message:
                                    e.message || "Không thể kết nối đến server",
                                  type: "error",
                                });
                              }
                            }

                            handleChange("partyMapUrl", finalUrl);

                            const extracted =
                              extractAddressFromMapUrl(finalUrl);
                            if (extracted) {
                              handleChange("partyAddress", extracted);
                              showToast({
                                title: "Đã trích xuất địa chỉ",
                                message: `Đã tự động điền địa chỉ: ${extracted}`,
                                type: "success",
                              });
                            } else {
                              showToast({
                                title: "Đã lưu bản đồ",
                                message:
                                  "Đã cập nhật liên kết bản đồ thành công.",
                                type: "success",
                              });
                            }
                          }}
                          className="bg-[#d4af37] text-black hover:bg-[#b08d20] px-4 py-2 rounded-md font-semibold shrink-0"
                        >
                          Lưu
                        </Button>
                      </div>
                      <div className="text-[10px] text-gray-400 leading-tight">
                        Nhập URL chia sẻ (hiển thị nút Chỉ đường) hoặc dán mã
                        nhúng {"<iframe...>"}
                        để thay đổi khung Bản đồ. Khung bản đồ mặc định sẽ tự
                        tạo theo "Địa chỉ tổ chức tiệc".
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 8: Dress Code */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                8. Dress Code
              </h3>
              <Switch
                checked={formData.showDressCode}
                onChange={(val) => handleChange("showDressCode", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showDressCode && (
              <div className="flex flex-col gap-4">
                <span className="text-xs text-[#f5e6d3]/60">
                  Chọn màu chủ đạo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {WEDDING_COLORS.map((color) => {
                    const isSelected = formData.dressCodes.includes(color);
                    return (
                      <button
                        key={color}
                        onClick={() => toggleDressCode(color)}
                        style={{ backgroundColor: color }}
                        className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${isSelected ? "border-[#d4af37] scale-110 shadow-[0_0_10px_#d4af37]" : "border-white/10 hover:scale-110"}`}
                        title={color}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setShowCustomPicker(!showCustomPicker)}
                  className="mt-2 text-xs text-[#d4af37] hover:text-[#f5c842] flex items-center gap-1.5 font-medium border border-[#d4af37]/30 hover:border-[#d4af37]/60 px-3 py-1.5 rounded-lg bg-[#d4af37]/5 transition-colors w-max"
                >
                  <Plus size={14} /> Tự chọn màu tự do
                </button>

                {showCustomPicker && (
                  <div className="flex flex-col gap-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                    <span className="text-xs text-[#f5e6d3]/60 font-medium">
                      Bảng màu tự do (nhấn và di để chọn):
                    </span>
                    <div
                      className="relative w-full h-37.5 rounded-lg overflow-hidden select-none border border-white/10 bg-black/20"
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUpOrLeave}
                      onMouseLeave={handleMouseUpOrLeave}
                    >
                      <canvas
                        ref={canvasRef}
                        width={300}
                        height={150}
                        className="w-full h-full cursor-crosshair"
                      />
                      <div
                        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-[0_0_4px_rgba(0,0,0,0.5)] pointer-events-none -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${pickerPointer.x}px`,
                          top: `${pickerPointer.y}px`,
                          backgroundColor: customColor,
                        }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg border border-white/20 shrink-0 shadow-inner"
                        style={{ backgroundColor: customColor }}
                      />
                      <div className="flex-1 flex gap-2">
                        <InputText
                          value={customColor}
                          onChange={(e) => handleHexInput(e.target.value)}
                          className="bg-white/5! border-[#d4af37]/20! text-xs font-mono uppercase"
                          placeholder="#HEXCODE"
                          wrapperClassName="flex-1"
                        />
                        <Button
                          onClick={() => {
                            let formatted = customColor.trim().toUpperCase();
                            if (
                              !formatted.startsWith("#") &&
                              formatted.length > 0
                            ) {
                              formatted = "#" + formatted;
                            }
                            if (/^#[0-9A-F]{6}$/i.test(formatted)) {
                              if (!formData.dressCodes.includes(formatted)) {
                                handleChange("dressCodes", [
                                  ...formData.dressCodes,
                                  formatted,
                                ]);
                                showToast({
                                  title: "Đã thêm màu",
                                  message: `Đã thêm mã màu ${formatted} vào danh sách.`,
                                  type: "success",
                                });
                              } else {
                                showToast({
                                  title: "Màu đã tồn tại",
                                  message: `Mã màu ${formatted} đã có trong danh sách.`,
                                  type: "warning",
                                });
                              }
                            } else {
                              showToast({
                                title: "Mã màu không hợp lệ",
                                message:
                                  "Vui lòng nhập đúng định dạng hex (ví dụ: #FF0000).",
                                type: "error",
                              });
                            }
                          }}
                          className="bg-[#d4af37] text-black hover:bg-[#b08d20] text-xs font-semibold px-4 rounded-lg shrink-0"
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {formData.dressCodes.length > 0 && (
                  <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 flex items-center flex-wrap gap-3">
                    <span className="text-sm text-[#f5e6d3]/80">
                      Màu đã chọn:
                    </span>
                    {formData.dressCodes.map((color) => (
                      <div
                        key={color}
                        className="flex items-center gap-1 bg-black/40 pr-2 rounded-full overflow-hidden border border-white/10"
                      >
                        <div
                          style={{ backgroundColor: color }}
                          className="w-5 h-5 rounded-full m-0.5"
                        />
                        <span className="text-[10px] text-white font-mono uppercase">
                          {color}
                        </span>
                        <button
                          onClick={() => toggleDressCode(color)}
                          className="ml-1 text-white/50 hover:text-red-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 9: Lịch trình ngày cưới */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                9. Lịch trình ngày cưới
              </h3>
              <Switch
                checked={formData.showTimeline}
                onChange={(val) => handleChange("showTimeline", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showTimeline && (
              <div className="flex flex-col gap-4">
                <InputText
                  label="Tiêu đề lịch trình"
                  value={formData.timelineTitle}
                  onChange={(e) =>
                    handleChange("timelineTitle", e.target.value)
                  }
                  className="bg-white/5! border-[#d4af37]/10!"
                />
                <div className="flex flex-col gap-3">
                  {formData.timeline.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-white/5 p-2 border border-white/10 rounded-lg"
                    >
                      <div className="w-24 shrink-0">
                        <InputTime
                          value={item.time}
                          onChange={(val) =>
                            updateTimeline(item.id, "time", val)
                          }
                          className="h-10!"
                        />
                      </div>
                      <div className="flex-1">
                        <InputText
                          value={item.title}
                          placeholder="Nội dung..."
                          onChange={(e) =>
                            updateTimeline(item.id, "title", e.target.value)
                          }
                          className="h-10! bg-transparent! border-none!"
                        />
                      </div>
                      <button
                        onClick={() => removeTimeline(item.id)}
                        className="p-2 text-red-400 hover:text-red-500 rounded-md bg-white/5 cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addTimeline}
                    className="w-full border-dashed border-[#d4af37]/30 text-[#d4af37] hover:bg-[#d4af37]/10 py-3 rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <Plus size={16} /> Thêm hoạt động
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Section 10: Xác nhận tham dự (RSVP) */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                10. Xác nhận tham dự (RSVP)
              </h3>
              <Switch
                checked={formData.showRsvp}
                onChange={(val) => handleChange("showRsvp", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showRsvp && (
              <div className="flex flex-col gap-3">
                <span className="text-sm text-[#f5e6d3]/80">
                  Kiểu hiển thị:
                </span>
                <div className="flex items-center gap-2 bg-[#1a1012] p-1.5 rounded-lg w-max">
                  <button
                    onClick={() => handleChange("rsvpType", "button")}
                    className={`px-4 py-2 text-xs rounded-md transition-all ${formData.rsvpType === "button" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
                  >
                    Nút bấm (Popup)
                  </button>
                  <button
                    onClick={() => handleChange("rsvpType", "form")}
                    className={`px-4 py-2 text-xs rounded-md transition-all ${formData.rsvpType === "form" ? "bg-[#d4af37] text-[#0a0508] font-bold" : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"}`}
                  >
                    Form điền trực tiếp
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 11: Sổ lưu bút */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                11. Sổ lưu bút (Lời chúc)
              </h3>
              <Switch
                checked={formData.showGuestbook}
                onChange={(val) => handleChange("showGuestbook", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showGuestbook && (
              <div className="flex flex-col gap-3 pl-2">
                <label className="flex items-center gap-3 cursor-pointer text-sm text-[#f5e6d3]">
                  <input
                    type="checkbox"
                    checked={formData.guestbookStatic}
                    onChange={(e) =>
                      handleChange("guestbookStatic", e.target.checked)
                    }
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  Hiển thị dạng tĩnh (Cuộn danh sách)
                </label>
                <label className="flex items-center gap-3 cursor-pointer text-sm text-[#f5e6d3]">
                  <input
                    type="checkbox"
                    checked={formData.guestbookFloating}
                    onChange={(e) =>
                      handleChange("guestbookFloating", e.target.checked)
                    }
                    className="accent-[#d4af37] w-4 h-4"
                  />
                  Hiển thị linh động absolute lượn trên thiệp
                </label>
              </div>
            )}
          </div>

          {/* Section 12: Tài khoản ngân hàng */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <h3 className="text-md font-bold text-[#d4af37] border-b border-[#d4af37]/10 pb-2">
              12. Tài khoản ngân hàng (Mừng cưới)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/3 border border-white/5 rounded-lg flex flex-col gap-1 text-xs">
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

              <div className="p-3 bg-white/3 border border-white/5 rounded-lg flex flex-col gap-1 text-xs">
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
            </div>

            <Button
              onClick={() => setShowBankModal(true)}
              className="bg-[#d4af37] text-black hover:bg-[#b08d20] py-3 rounded-lg font-bold flex items-center justify-center gap-2 text-sm w-full"
            >
              <Plus size={16} /> Quản lý tài khoản mừng cưới
            </Button>
          </div>

          {/* Section 13: Lời cảm ơn */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">
                13. Lời cảm ơn
              </h3>
              <Switch
                checked={formData.showThankYou}
                onChange={(val) => handleChange("showThankYou", val)}
                label="Hiển thị"
              />
            </div>
            {formData.showThankYou && (
              <textarea
                value={formData.thankYouText}
                onChange={(e) => handleChange("thankYouText", e.target.value)}
                rows={4}
                placeholder="Nhập lời cảm ơn..."
                className="w-full bg-[#1f1f1f] border border-[#333] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
              />
            )}
          </div>

          {/* Section 14: Nhạc nền */}
          <div className="bg-white/2 border border-white/5 p-5 rounded-xl shadow-lg flex flex-col gap-5 mb-10">
            <div className="flex justify-between items-center border-b border-[#d4af37]/10 pb-2">
              <h3 className="text-md font-bold text-[#d4af37]">14. Nhạc nền</h3>
              <Switch
                checked={formData.showMusic}
                onChange={(val) => handleChange("showMusic", val)}
                label="Hiển thị"
              />
            </div>

            {formData.showMusic && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center justify-center gap-3 text-center p-6 bg-[#1a1012] rounded-xl border border-[#d4af37]/10">
                  <div className="w-16 h-16 bg-[#d4af37]/10 rounded-full flex items-center justify-center">
                    <Music
                      size={28}
                      className="text-[#f5c842]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#f5e6d3]">
                      {formData.musicName || "Chưa chọn nhạc nền"}
                    </p>
                    <p className="text-xs text-[#f5e6d3]/60 mt-1">
                      {formData.musicUrl
                        ? "Đang phát nhạc mp3"
                        : "Thêm giai điệu cho khoảnh khắc của bạn"}
                    </p>
                  </div>
                  <Button
                    onClick={() => setShowMusicModal(true)}
                    className="mt-2 bg-[#d4af37] text-black hover:bg-[#f5c842] text-xs px-6 py-2 rounded-full font-bold flex items-center gap-2"
                  >
                    <Music size={14} />
                    {formData.musicUrl ? "Thay đổi nhạc" : "Chọn nhạc"}
                  </Button>
                </div>

                {formData.musicUrl && (
                  <div className="w-full bg-[#1a1012] rounded-xl p-3 border border-[#d4af37]/20">
                    <audio
                      controls
                      controlsList="nodownload"
                      src={formData.musicUrl}
                      className="w-full h-8"
                      onPlay={() => {
                        if (iframeRef.current?.contentWindow) {
                          iframeRef.current.contentWindow.postMessage(
                            { type: "PAUSE_MUSIC" },
                            "*",
                          );
                        }
                      }}
                      onPause={() => {
                        if (iframeRef.current?.contentWindow) {
                          iframeRef.current.contentWindow.postMessage(
                            { type: "PLAY_MUSIC" },
                            "*",
                          );
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-[#d4af37]/20 bg-[#0a0508] flex gap-3 z-10 shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push("/templates")}
            className="flex-1 py-3 text-xs bg-white/2! border-[#d4af37]/15! hover:bg-white/5 rounded-xl"
          >
            Quay Lại
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            loading={isPublishing}
            className="flex-1 py-3 text-xs bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0a0508] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform"
          >
            <Share2 size={14} /> Lưu & Xuất Bản
          </Button>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full flex flex-col bg-[#050304] overflow-hidden select-none relative">
        <div className="h-14 border-b border-[#d4af37]/20 bg-[#0f0608] px-6 flex items-center justify-between gap-4 z-10 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDeviceId("iphone-14-pro")}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${selectedDevice.type === "mobile" ? "bg-[#d4af37]/10 border-[#d4af37] text-[#f5c842]" : "bg-white/3 border-transparent text-[#f5e6d3]/60"}`}
            >
              <Smartphone size={14} />
              Mobile
            </button>
            <button
              onClick={() => setSelectedDeviceId("ipad-mini")}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${selectedDevice.type === "tablet" ? "bg-[#d4af37]/10 border-[#d4af37] text-[#f5c842]" : "bg-white/3 border-transparent text-[#f5e6d3]/60"}`}
            >
              <TabletIcon size={14} />
              Tablet
            </button>
            <button
              onClick={() => setSelectedDeviceId("laptop-14")}
              className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${selectedDevice.type === "desktop" ? "bg-[#d4af37]/10 border-[#d4af37] text-[#f5c842]" : "bg-white/3 border-transparent text-[#f5e6d3]/60"}`}
            >
              <Laptop size={14} />
              Desktop
            </button>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(e.target.value)}
              className="bg-[#1a1012] border border-[#d4af37]/30 rounded-lg text-xs text-[#f5c842] px-2 py-1.5 focus:outline-none"
            >
              {DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.width}x{d.height})
                </option>
              ))}
            </select>
            <button
              onClick={sendDataToIframe}
              className="p-2 rounded-lg bg-white/3 border border-transparent hover:border-[#d4af37]/35 text-[#f5e6d3]/70 hover:text-[#f5c842] transition-all"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        <div
          ref={workspaceRef}
          className="flex-1 w-full flex items-center justify-center p-6 relative overflow-hidden"
        >
          <div
            style={{
              width: `${selectedDevice.width}px`,
              height: `${selectedDevice.height}px`,
              transform: `scale(${optimalScale})`,
              transformOrigin: "center center",
              transition: "all 0.4s",
            }}
            className={`shrink-0 relative bg-[#fdfbf7] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 ${selectedDevice.type === "mobile" ? "rounded-[40px] border-12 border-[#18181b]" : selectedDevice.type === "tablet" ? "rounded-3xl border-16 border-[#18181b]" : "rounded-lg border-8 border-[#27272a]"}`}
          >
            {selectedDevice.type === "mobile" && (
              <div className="absolute top-0 left-0 right-0 h-7 bg-black z-20 flex justify-between items-center px-6 text-[10px] text-white/90 font-medium">
                <span>09:41</span>
                <div className="w-25 h-4 bg-black rounded-b-lg absolute left-1/2 -translate-x-1/2 top-0" />
                <div className="flex gap-1.5 items-center">
                  <span>5G</span>
                  <div className="w-5 h-2.5 border border-white/40 rounded-sm p-px flex items-center">
                    <div className="h-full w-[80%] bg-white rounded-xs" />
                  </div>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`/preview/${activeThemeCode}?viewMode=${selectedDevice.type}`}
              title="Theme Live Preview"
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                paddingTop: selectedDevice.type === "mobile" ? "28px" : "0",
              }}
              onLoad={sendDataToIframe}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={showBankModal}
        onClose={() => setShowBankModal(false)}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col gap-6 text-[#f5e6d3]">
          <h2 className="text-xl font-bold text-[#d4af37] border-b border-[#d4af37]/20 pb-2">
            Quản lý tài khoản mừng cưới
          </h2>

          <div className="flex items-center gap-2 bg-[#1a1012] p-1.5 rounded-lg w-full border border-white/5">
            <button
              onClick={() => setActiveBankTab("groom")}
              className={`flex-1 py-2 text-sm rounded-md font-bold transition-all ${
                activeBankTab === "groom"
                  ? "bg-[#d4af37] text-[#0a0508] shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                  : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"
              }`}
            >
              Chú rể
            </button>
            <button
              onClick={() => setActiveBankTab("bride")}
              className={`flex-1 py-2 text-sm rounded-md font-bold transition-all ${
                activeBankTab === "bride"
                  ? "bg-[#d4af37] text-[#0a0508] shadow-[0_2px_8px_rgba(212,175,55,0.3)]"
                  : "text-[#f5e6d3]/60 hover:text-[#f5e6d3]"
              }`}
            >
              Cô dâu
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <InputText
              label="Tên chủ tài khoản"
              value={formData[activeBankTab].bankAccount.accountName}
              onChange={(e) =>
                handleBankChange(
                  activeBankTab,
                  "accountName",
                  e.target.value.toUpperCase(),
                )
              }
              placeholder="VD: NGUYEN VAN A"
              className="bg-white/5! border-[#d4af37]/15!"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#f5e6d3]/80">
                Ngân hàng
              </label>
              <select
                value={formData[activeBankTab].bankAccount.bankName}
                onChange={(e) =>
                  handleBankChange(activeBankTab, "bankName", e.target.value)
                }
                className="w-full bg-[#1a1012] border border-[#d4af37]/20 rounded-xl px-4 py-3 text-sm text-[#f5e6d3] focus:outline-none focus:border-[#d4af37] transition-all"
              >
                <option value="">-- Chọn ngân hàng --</option>
                {POPULAR_BANKS.map((bank) => (
                  <option key={bank.code} value={bank.name}>
                    {bank.name}
                  </option>
                ))}
              </select>
            </div>

            <InputText
              label="Số tài khoản"
              value={formData[activeBankTab].bankAccount.accountNumber}
              onChange={(e) =>
                handleBankChange(
                  activeBankTab,
                  "accountNumber",
                  e.target.value.replace(/\D/g, ""),
                )
              }
              placeholder="Nhập số tài khoản"
              className="bg-white/5! border-[#d4af37]/15!"
            />

            {formData[activeBankTab].bankAccount.qrUrl ? (
              <div className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-xl mt-2 animate-fadeIn">
                <span className="text-xs text-[#f5e6d3]/60 font-semibold uppercase">
                  Mã VietQR tự động
                </span>
                <img
                  src={formData[activeBankTab].bankAccount.qrUrl}
                  alt={`QR ${activeBankTab === "groom" ? "Chú rể" : "Cô dâu"}`}
                  className="w-48 h-48 rounded-lg object-contain border border-dashed border-[#d4af37]/40 p-2 bg-white"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/10 rounded-xl mt-2 text-center text-[#f5e6d3]/40 text-xs">
                Vui lòng chọn ngân hàng và nhập số tài khoản để tạo mã QR.
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              variant="primary"
              onClick={() => setShowBankModal(false)}
              className="w-full py-3 bg-[#d4af37] text-black hover:bg-[#f5c842] font-bold rounded-xl"
            >
              Lưu & Đóng
            </Button>
          </div>
        </div>
      </Modal>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          if (!tokenCache.isAuthenticated()) router.push("/templates");
        }}
      />

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        maxWidth="max-w-[480px]"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-transparent via-[#d4af37] to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center w-full gap-6 mt-2">
          <div className="w-16 h-16 bg-[#d4af37]/10 text-[#f5c842] border border-[#d4af37]/45 rounded-full flex items-center justify-center">
            <Check size={36} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#d4af37]">
              Xuất bản thành công!
            </h2>
            <p className="text-sm text-[#f5e6d3]/80 mt-2">
              Thiệp cưới của bạn đã sẵn sàng chia sẻ.
            </p>
          </div>
          <div className="w-full bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2">
            <p className="text-xs text-[#f5e6d3]/60 text-left">
              Link thiệp cưới:
            </p>
            <input
              type="text"
              readOnly
              value={publishedUrl}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-[#f5c842] focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 px-3! bg-white/5! hover:bg-white/10!"
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  showToast({ title: "Đã copy link", type: "success" });
                }}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                className="flex-1 px-3! bg-white/5! hover:bg-white/10!"
                onClick={() => window.open(publishedUrl, "_blank")}
              >
                <ExternalLink size={14} className="mr-1" /> Mở thiệp
              </Button>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => router.push(PUBLIC_ROUTES.HOME)}
            className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0a0508] font-bold"
          >
            Về trang Quản lý
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showMusicModal}
        onClose={() => setShowMusicModal(false)}
        maxWidth="max-w-xl"
      >
        <div className="flex flex-col gap-6 text-[#f5e6d3]">
          <h2 className="text-xl font-bold text-[#d4af37]">
            Thư viện nhạc nền
          </h2>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#f5e6d3]/40"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài hát..."
              value={musicSearch}
              onChange={(e) => setMusicSearch(e.target.value)}
              className="w-full bg-[#1a1012] border border-[#d4af37]/20 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-[#d4af37] transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#d4af37]/20" />
            <span className="text-xs text-[#f5e6d3]/40">Hoặc</span>
            <div className="flex-1 h-px bg-[#d4af37]/20" />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nhập URL Youtube..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1 bg-[#1a1012] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-400"
            />
            <Button
              variant="primary"
              onClick={handleAddYoutube}
              loading={isAddingYoutube}
              className="bg-red-500! hover:bg-red-600! text-white border-none! flex items-center gap-2"
            >
              <YoutubeIcon /> Thêm
            </Button>
          </div>

          <div className="flex flex-col gap-2 mt-4 max-h-75 overflow-y-auto custom-scrollbar pr-2">
            <span className="text-xs font-bold uppercase text-[#d4af37] mb-2">
              Nhạc mẫu có sẵn
            </span>
            {musics
              .filter(
                (m) =>
                  m.isActive &&
                  m.name.toLowerCase().includes(musicSearch.toLowerCase()),
              )
              .map((music) => (
                <div
                  key={music.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${music.status === "PROCESSING" ? "opacity-50 cursor-not-allowed border-transparent" : "hover:bg-white/5 border-transparent hover:border-white/10 cursor-pointer"}`}
                  onClick={() => {
                    if (music.status === "PROCESSING") return;
                    handleChange(
                      "musicName",
                      `${music.name} - ${music.author || "Không rõ"}`,
                    );
                    handleChange("musicUrl", music.audioUrl);
                    musicBackgroundService.incrementUsage(music.id);
                    setShowMusicModal(false);
                    setPreviewMusicId(null);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (music.status === "PROCESSING") return;
                        setPreviewMusicId(
                          previewMusicId === music.id ? null : music.id,
                        );
                      }}
                      className="w-10 h-10 shrink-0 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#f5c842] hover:bg-[#d4af37] hover:text-black transition-all"
                    >
                      {previewMusicId === music.id ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} className="ml-1" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-bold">{music.name}</p>
                      <p className="text-xs text-[#f5e6d3]/60">
                        {music.author || "Không rõ"} • {music.usageCount || 0}{" "}
                        lượt dùng
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-[#f5e6d3]/40">
                      {music.duration || "0:00"}
                    </span>
                    {music.status === "PROCESSING" && (
                      <span className="text-[10px] text-yellow-500 font-bold animate-pulse mt-1">
                        Đang xử lý âm thanh...
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {previewMusicId && (
            <audio
              src={musics.find((m) => m.id === previewMusicId)?.audioUrl}
              autoPlay
              onEnded={() => setPreviewMusicId(null)}
              className="hidden"
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
