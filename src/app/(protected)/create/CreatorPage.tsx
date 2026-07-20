"use client";

import { YoutubeIcon } from "@/assets/icons";
import { enumData } from "@/common/enum";
import {
  formatDate,
  formatDateISO,
  formatTime,
  formatTime2Digit,
  sortAndMapEvents,
  sortAndMapTimeline,
} from "@/common/helpers";
import { PUBLIC_ROUTES } from "@/common/routes";
import { getTemplateSchema } from "@/common/templateSchema";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Pause,
  Play,
  RefreshCw,
  Search,
  Share2,
  Smartphone,
  Tablet as TabletIcon,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BankSection } from "./sections/BankSection";
import { BasicInfoSection } from "./sections/BasicInfoSection";
import { DressCodeSection } from "./sections/DressCodeSection";
import { EventsSection } from "./sections/EventsSection";
import { FamilyInfoSection } from "./sections/FamilyInfoSection";
import { GallerySection } from "./sections/GallerySection";
import { GuestbookSection } from "./sections/GuestbookSection";
import { HeroImageSection } from "./sections/HeroImageSection";
import { IntroSection } from "./sections/IntroSection";
import { MusicSection } from "./sections/MusicSection";
import { PartySection } from "./sections/PartySection";
import { RsvpSection } from "./sections/RsvpSection";
import { ThankYouSection } from "./sections/ThankYouSection";
import { TimelineSection } from "./sections/TimelineSection";

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
  } catch {
    return "";
  }
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
  const searchParams = useSearchParams();
  const templateIdFromUrl = searchParams.get("templateId");
  const { showToast } = useToast();
  const [loadedThemeCode, setLoadedThemeCode] = useState("");
  const activeThemeCode = themeCode || loadedThemeCode;

  const templateCode = resolveThemeKey(activeThemeCode || "");
  const templateSchema = getTemplateSchema(templateCode);

  const [showBankModal, setShowBankModal] = useState(false);
  const [activeBankTab, setActiveBankTab] = useState<"groom" | "bride">(
    "groom",
  );
  const [templateId, setTemplateId] = useState<string>(templateIdFromUrl || "");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [showMusicModal, setShowMusicModal] = useState(false);
  const [previewMusicId, setPreviewMusicId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  const [musics, setMusics] = useState<any[]>([]);
  const [isAddingYoutube, setIsAddingYoutube] = useState(false);
  const [youtubeImportPending, setYoutubeImportPending] = useState(false);

  useEffect(() => {
    let interval: any;
    let elapsed = 0;
    const fetchMusics = async () => {
      try {
        const res = (await musicBackgroundService.getMusics()) as any;
        const list = res.data?.data || res.data || [];
        setMusics(list);
        const hasProcessing = list.some(
          (m: any) => m.status === "PROCESSING" || m.status === "PENDING",
        );
        if (hasProcessing || (youtubeImportPending && elapsed < 60000)) {
          interval = setTimeout(() => {
            elapsed += 3000;
            if (youtubeImportPending && elapsed >= 60000) {
              setYoutubeImportPending(false);
            }
            fetchMusics();
          }, 3000);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (showMusicModal) {
      fetchMusics();
    }
    return () => clearTimeout(interval);
  }, [showMusicModal, youtubeImportPending]);

  const handleAddYoutube = async () => {
    if (!youtubeUrl) return;
    setIsAddingYoutube(true);
    try {
      await musicBackgroundService.importYoutube(youtubeUrl);
      setYoutubeUrl("");
      setYoutubeImportPending(true);
      showToast({
        title: "Đang tải",
        message: "Hệ thống đang tải nhạc từ YouTube...",
        type: "success",
      });
      const res = (await musicBackgroundService.getMusics()) as any;
      const list = res.data?.data || res.data || [];
      setMusics(list);
    } catch {
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
  const [deviceType, setDeviceType] = useState("mobile");
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

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

    if (activeThemeCode) {
      const targetCode = resolveThemeKey(activeThemeCode);
      templateService
        .getTemplates({ where: { themeCode: targetCode } })
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

  const handleSaveMap = async () => {
    let finalUrl = tempMapUrl;

    if (
      tempMapUrl.includes("maps.app.goo.gl") ||
      tempMapUrl.includes("goo.gl/maps")
    ) {
      try {
        const res = await weddingService.resolveMapUrl(tempMapUrl);
        if (res?.data?.url) {
          finalUrl = res.data.url;
        } else {
          showToast({
            title: "Không tìm thấy URL",
            message: "API không trả về đường dẫn giải mã.",
            type: "warning",
          });
        }
      } catch (e: any) {
        console.error("Failed to resolve shortened map URL", e);
        showToast({
          title: "Lỗi giải mã liên kết",
          message: e.message || "Không thể kết nối đến server",
          type: "error",
        });
      }
    }

    handleChange("partyMapUrl", finalUrl);

    const extracted = extractAddressFromMapUrl(finalUrl);
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
        message: "Đã cập nhật liên kết bản đồ thành công.",
        type: "success",
      });
    }
  };

  const handleAudioPlay = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "PAUSE_MUSIC" }, "*");
    }
  };

  const handleAudioPause = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "PLAY_MUSIC" }, "*");
    }
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

            if (w.status === enumData.WEDDING_STATUS.PUBLISHED) {
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
              partyDate: formatDateISO(w.ceremonyAt),
              partyWelcomeTime: w.receptionWelcomeTime || "10:30",
              partyStartTime: formatTime2Digit(w.ceremonyAt, "11:30"),
              partyAddress: w.ceremonyAddress || "",
              partyMapUrl: w.ceremonyMapsUrl || "",
              showCountdown: w.showCountdown ?? true,
              showMap: w.showMap ?? true,
              showDressCode: w.showDressCode ?? true,
              dressCodes: w.dressCodes || [],
              showTimeline: w.showTimeline ?? true,
              timelineTitle: w.timelineTitle || "Lịch trình ngày cưới",
              timeline: sortAndMapTimeline(w.timelines),
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
              events: sortAndMapEvents(w.events),
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
      setShowAuthModal(true);
      return;
    }

    if (!formData.groom.name.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập tên Chú rể.",
        type: "warning",
      });
      return;
    }
    if (!formData.bride.name.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập tên Cô dâu.",
        type: "warning",
      });
      return;
    }
    if (!formData.partyDate) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng chọn ngày tổ chức lễ cưới.",
        type: "warning",
      });
      return;
    }
    if (!formData.partyAddress.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ tổ chức lễ cưới.",
        type: "warning",
      });
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
        await weddingService.publishWedding(id);
        const slugToUse = formData.slug || payload.slug;
        setPublishedUrl(`${window.location.origin}/thiep/${slugToUse}`);
        setShowSuccessModal(true);
        showToast({
          title: "Lưu & Xuất bản thành công",
          message: "Thiệp cưới của bạn đã được lưu và xuất bản!",
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
      className="flex flex-col md:flex-row h-screen w-full bg-[#0a0508] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="md:hidden flex bg-[#0f0608] border-b border-[#d4af37]/20 p-2 shrink-0 z-30">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "edit"
              ? "bg-[#d4af37] text-black shadow-md"
              : "text-[#f5e6d3]/60 hover:text-white"
          }`}
        >
          Chỉnh sửa nội dung
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "preview"
              ? "bg-[#d4af37] text-black shadow-md"
              : "text-[#f5e6d3]/60 hover:text-white"
          }`}
        >
          Xem trước giao diện
        </button>
      </div>

      <div
        className={`w-full md:w-1/2 shrink-0 border-r border-[#d4af37]/25 flex-col h-full bg-[#0f0608] ${activeTab === "edit" ? "flex" : "hidden md:flex"}`}
      >
        <div className="p-4 border-b border-[#d4af37]/15 bg-white/2 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => router.push(PUBLIC_ROUTES.HOME)}
            >
              <div className="flex flex-col leading-none">
                <span className="text-[clamp(1rem,3vw,1rem)] font-bold text-[#f5c842] whitespace-nowrap logo-shimmer">
                  Tiệm cưới tân thời
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 text-[#f5e6d3] text-left custom-scrollbar pb-32">
          <BasicInfoSection
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            slugify={slugify}
          />
          <HeroImageSection
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            templateSchema={templateSchema}
            onAuthRequired={() => setShowAuthModal(true)}
          />
          <FamilyInfoSection
            formData={formData}
            handleNestedChange={handleNestedChange}
          />
          <IntroSection formData={formData} handleChange={handleChange} />
          <EventsSection
            formData={formData}
            addEvent={addEvent}
            removeEvent={removeEvent}
            updateEvent={updateEvent}
          />
          <GallerySection
            formData={formData}
            handleChange={handleChange}
            onAuthRequired={() => setShowAuthModal(true)}
          />
          <PartySection
            formData={formData}
            handleChange={handleChange}
            tempMapUrl={tempMapUrl}
            setTempMapUrl={setTempMapUrl}
            onSaveMap={handleSaveMap}
          />
          <DressCodeSection
            formData={formData}
            handleChange={handleChange}
            toggleDressCode={toggleDressCode}
            WEDDING_COLORS={WEDDING_COLORS}
          />
          <TimelineSection
            formData={formData}
            handleChange={handleChange}
            addTimeline={addTimeline}
            removeTimeline={removeTimeline}
            updateTimeline={updateTimeline}
          />
          <RsvpSection formData={formData} handleChange={handleChange} />
          <GuestbookSection formData={formData} handleChange={handleChange} />
          <BankSection
            formData={formData}
            onOpenBankModal={() => setShowBankModal(true)}
          />
          <ThankYouSection formData={formData} handleChange={handleChange} />
          <MusicSection
            formData={formData}
            handleChange={handleChange}
            onOpenMusicModal={() => setShowMusicModal(true)}
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
          />
        </div>

        <div className="md:flex p-4 border-t border-[#d4af37]/20 bg-[#0a0508] flex gap-3 z-10 shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push("/templates")}
            className="flex-1 py-3 text-xs bg-white/2! border-[#d4af37]/15! hover:bg-white/5 rounded-xl"
          >
            Quay Lại
          </Button>
          <Button
            variant="default"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex-1 py-3 text-xs bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0a0508] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform"
          >
            {isPublishing ? <Spinner /> : <Share2 size={14} />} Lưu & Xuất Bản
          </Button>
        </div>
      </div>

      <div
        className={`w-full md:w-1/2 h-full flex-col bg-[#050304] overflow-hidden select-none relative ${activeTab === "preview" ? "flex" : "hidden md:flex"}`}
      >
        <div className="hidden md:flex h-14 border-b border-[#d4af37]/20 bg-[#0f0608] px-6 items-center justify-between gap-4 z-10 shrink-0">
          <Tabs
            value={deviceType}
            onValueChange={(val) => {
              setDeviceType(val);
              const firstDevice = DEVICES.find((d) => d.type === val);
              if (firstDevice) setSelectedDeviceId(firstDevice.id);
            }}
          >
            <TabsList className="bg-transparent gap-2">
              <TabsTrigger
                value="mobile"
                className="flex-none p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium data-active:bg-[#d4af37]/10 data-active:border-[#d4af37] data-active:text-[#f5c842] bg-white/3 border-transparent text-[#f5e6d3]/60"
              >
                <Smartphone size={14} />
                Mobile
              </TabsTrigger>
              <TabsTrigger
                value="tablet"
                className="flex-none p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium data-active:bg-[#d4af37]/10 data-active:border-[#d4af37] data-active:text-[#f5c842] bg-white/3 border-transparent text-[#f5e6d3]/60"
              >
                <TabletIcon size={14} />
                Tablet
              </TabsTrigger>
              <TabsTrigger
                value="desktop"
                className="flex-none p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium data-active:bg-[#d4af37]/10 data-active:border-[#d4af37] data-active:text-[#f5c842] bg-white/3 border-transparent text-[#f5e6d3]/60"
              >
                <Laptop size={14} />
                Desktop
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-3">
            <Select
              value={selectedDeviceId}
              onValueChange={(val) => val && setSelectedDeviceId(val)}
            >
              <SelectTrigger className="bg-[#1a1012] border-[#d4af37]/30 text-xs text-[#f5c842] px-2 py-1.5 min-w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1012] border-[#d4af37]/30 text-[#f5c842]">
                {DEVICES.filter((d) => d.type === deviceType).map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    {d.name} ({d.width}x{d.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          className="flex-1 w-full flex items-center justify-center p-0 md:p-6 relative overflow-hidden"
        >
          <div
            style={
              isMobile
                ? {
                    width: "100%",
                    height: "100%",
                    transform: "none",
                  }
                : {
                    width: `${selectedDevice.width}px`,
                    height: `${selectedDevice.height}px`,
                    transform: `scale(${optimalScale})`,
                    transformOrigin: "center center",
                    transition: "all 0.4s",
                  }
            }
            className={`shrink-0 relative bg-[#fdfbf7] flex flex-col overflow-hidden transition-all duration-300 ${
              isMobile
                ? "w-full h-full border-none rounded-none shadow-none"
                : `shadow-[0_25px_60px_rgba(0,0,0,0.8)] ${
                    selectedDevice.type === "mobile"
                      ? "rounded-[40px] border-12 border-[#18181b]"
                      : selectedDevice.type === "tablet"
                        ? "rounded-3xl border-16 border-[#18181b]"
                        : "rounded-lg border-8 border-[#27272a]"
                  }`
            }`}
          >
            {!isMobile && selectedDevice.type === "mobile" && (
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
                paddingTop:
                  !isMobile && selectedDevice.type === "mobile" ? "28px" : "0",
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
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                Tên chủ tài khoản
              </Label>
              <Input
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
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                Ngân hàng
              </Label>
              <Select
                value={formData[activeBankTab].bankAccount.bankName}
                onValueChange={(val) =>
                  handleBankChange(activeBankTab, "bankName", val)
                }
              >
                <SelectTrigger className="bg-[#1a1012] border-[#d4af37]/20 text-[#f5e6d3]">
                  <SelectValue placeholder="-- Chọn ngân hàng --" />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1012] border-[#d4af37]/20 text-[#f5e6d3]">
                  {POPULAR_BANKS.map((bank) => (
                    <SelectItem key={bank.code} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#f5e6d3]/80">
                Số tài khoản
              </Label>
              <Input
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
            </div>

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
              variant="default"
              onClick={() => setShowBankModal(false)}
              className="w-full py-3 bg-[#d4af37] text-black hover:bg-[#f5c842] font-bold rounded-xl"
            >
              Lưu & Đóng
            </Button>
          </div>
        </div>
      </Modal>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
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
            <Input
              readOnly
              value={publishedUrl}
              className="w-full bg-black/40 border-white/10 text-sm text-[#f5c842]"
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
            variant="default"
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
            <Input
              placeholder="Tìm kiếm bài hát..."
              value={musicSearch}
              onChange={(e) => setMusicSearch(e.target.value)}
              className="w-full bg-[#1a1012] border-[#d4af37]/20 rounded-xl pl-10 pr-4 py-3 h-auto text-sm focus:border-[#d4af37]"
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
              variant="default"
              onClick={handleAddYoutube}
              disabled={isAddingYoutube}
              className="bg-red-500! hover:bg-red-600! text-white border-none! flex items-center gap-2"
            >
              {isAddingYoutube ? <Spinner /> : <YoutubeIcon />} Thêm
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

      <div className="md:hidden p-4 border-t border-[#d4af37]/20 bg-[#0a0508] flex gap-3 z-30 shrink-0">
        <Button
          variant="outline"
          onClick={() => router.push("/templates")}
          className="flex-1 py-3 text-xs bg-white/2! border-[#d4af37]/15! hover:bg-white/5 rounded-xl cursor-pointer"
        >
          Quay Lại
        </Button>
        <Button
          variant="default"
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex-1 py-3 text-xs bg-linear-to-r from-[#d4af37] to-[#f5c842] text-[#0a0508] font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform cursor-pointer"
        >
          {isPublishing ? <Spinner /> : <Share2 size={14} />} Lưu & Xuất Bản
        </Button>
      </div>
    </div>
  );
}
