"use client";

import { YoutubeIcon } from "@/assets/icons";
import { enumData } from "@/common/enum";
import { formatDate, formatTime } from "@/common/helpers";
import { PUBLIC_ROUTES } from "@/common/routes";
import { getTemplateSchema } from "@/common/templateSchema";
import AuthModal from "@/components/auth/AuthModal";
import InviGoLogo from "@/components/common/Logo";
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
import {
  cardTypeDefaults,
  expandHostSlots,
  inferCardType,
} from "@/services/card-type.service";
import { invitationService } from "@/services/invitation.service";
import { musicBackgroundService } from "@/services/music-background.service";
import { templateService } from "@/services/template.service";
import { resolveThemeKey } from "@/templates/templates-available";
import { cardTypeCopy } from "@/utils/card-type-copy";
import { getCardTypeFormConfig } from "@/utils/card-type-form-config";
import {
  buildInvitationPayload,
  invitationToCreatorForm,
  publicInvitationPath,
} from "@/utils/invitation-mapper";
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
import { useEffect, useMemo, useRef, useState } from "react";
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
  "#2D231F",
  "#C4B09A",
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
  const urlCardType =
    searchParams.get("cardType") || searchParams.get("type") || "";
  const [cardType, setCardType] = useState(() =>
    inferCardType({
      cardType: urlCardType,
      themeCode: themeCode || "",
      slug: themeCode || "",
    }),
  );
  const formConfig = useMemo(() => getCardTypeFormConfig(cardType), [cardType]);
  const cardDefaults = useMemo(() => cardTypeDefaults(cardType), [cardType]);
  const hostSlots = useMemo(
    () => expandHostSlots(cardDefaults.hostRoles),
    [cardDefaults.hostRoles],
  );
  const copyPack = useMemo(() => cardTypeCopy(cardType), [cardType]);
  const hasWizardSection = (code: string) =>
    cardDefaults.wizardSections.includes(code);
  const isWedding = cardType === "WEDDING";
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
    gallery: [] as string[],
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
        cardType,
        ...copyPack,
        groomLabel: hostSlots[0]?.role.label,
        brideLabel: hostSlots[1]?.role.label,
      };
      iframeRef.current.contentWindow.postMessage(
        { type: "UPDATE_WEDDING_DATA", data: payload },
        "*",
      );
    }
  };

  useEffect(() => {
    if (!formData.slug) {
      const names = hostSlots
        .map((slot) => formData[slot.key]?.shortName)
        .filter(Boolean);
      if (names.length) {
        setFormData((prev) => ({
          ...prev,
          slug: names.map((name) => slugify(name)).join("-"),
        }));
      }
    }

    if (templateIdFromUrl) {
      templateService
        .getTemplates({ where: { id: templateIdFromUrl } })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const tpl = res.data[0];
            setTemplateId(tpl.id);
            const inferred = inferCardType({
              cardType: urlCardType,
              themeCode: tpl.themeCode,
              slug: tpl.slug,
              template: tpl,
            });
            if (!id && inferred) {
              setCardType(inferred);
            }
          }
        })
        .catch((err) =>
          console.error("Failed to load template info by id", err),
        );
    } else if (activeThemeCode) {
      const targetCode = resolveThemeKey(activeThemeCode);
      templateService
        .getTemplates({
          where: {
            themeCode: targetCode,
          },
        })
        .then((res) => {
          if (res.data && res.data.length > 0) {
            const tpl = res.data[0];
            setTemplateId(tpl.id);
            const inferred = inferCardType({
              cardType: urlCardType,
              themeCode: tpl.themeCode,
              slug: tpl.slug,
              template: tpl,
            });
            if (!id && inferred) {
              setCardType(inferred);
            }
          }
        })
        .catch((err) => console.error("Failed to load template info", err));
    }
  }, [activeThemeCode, templateIdFromUrl, id, urlCardType]);

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

  useEffect(() => {
    if (!id && urlCardType) setCardType(urlCardType);
  }, [urlCardType, id]);

  useEffect(() => {
    if (!hostSlots.some((slot) => slot.key === activeBankTab)) {
      setActiveBankTab(hostSlots[0]?.key || "groom");
    }
  }, [hostSlots, activeBankTab]);

  useEffect(() => {
    if (id) return;
    const primary = hostSlots[0];
    const secondary = hostSlots[1];
    setFormData((prev) => {
      const isIntroWeddingDefault =
        prev.introText ===
          "Trân trọng báo tin \n lễ thành hôn của hai con chúng tôi" ||
        !prev.introText;
      const isThankYouWeddingDefault =
        prev.thankYouText ===
          "Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng tôi!" ||
        !prev.thankYouText;

      return {
        ...prev,
        partyType: formConfig.defaultPartyType,
        introText: isIntroWeddingDefault
          ? formConfig.defaultIntro
          : prev.introText,
        thankYouText: isThankYouWeddingDefault
          ? formConfig.defaultThankYou
          : prev.thankYouText,
        showDressCode: cardDefaults.wizardSections.includes("DRESS_CODE"),
        showTimeline: cardDefaults.wizardSections.includes("TIMELINE"),
        groom: {
          ...prev.groom,
          name: primary ? primary.role.label : prev.groom.name,
          shortName: primary ? primary.role.label : prev.groom.shortName,
          title: isWedding ? prev.groom.title : "",
        },
        bride: secondary
          ? {
              ...prev.bride,
              name: secondary.role.label,
              shortName: secondary.role.label,
              title: isWedding ? prev.bride.title : "",
            }
          : { ...prev.bride, name: "", shortName: "" },
      };
    });
  }, [
    cardType,
    hostSlots,
    id,
    isWedding,
    formConfig,
    cardDefaults.wizardSections,
  ]);

  const handleSaveMap = async () => {
    let finalUrl = tempMapUrl;

    if (
      tempMapUrl.includes("maps.app.goo.gl") ||
      tempMapUrl.includes("goo.gl/maps")
    ) {
      try {
        const res = await invitationService.resolveMapUrl(tempMapUrl);
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
      invitationService
        .findById(id)
        .then((res) => {
          if (res?.data) {
            const invitation = res.data;

            if (
              invitation.status === enumData.INVITATION_STATUS.PUBLISHED.code
            ) {
              showToast({
                title: "Không thể chỉnh sửa",
                message: "Thiệp đã xuất bản không thể chỉnh sửa",
                type: "error",
              });
              router.push("/templates");
              return;
            }

            const mapped = invitationToCreatorForm(invitation);
            const groomBank = mapped.groom.bankAccount;
            mapped.groom.bankAccount = {
              ...groomBank,
              qrUrl: resolveQrUrl(
                groomBank.bankName,
                groomBank.accountNumber,
                groomBank.accountName,
                groomBank.qrUrl,
              ),
            };
            setFormData((prev) => ({ ...prev, ...mapped }));
            if (invitation.cardType) setCardType(invitation.cardType);
            setTempMapUrl(mapped.partyMapUrl || "");
            if (invitation.template?.themeCode) {
              setLoadedThemeCode(invitation.template.themeCode);
            } else if (invitation.template?.slug) {
              setLoadedThemeCode(invitation.template.slug);
            }
            if (invitation.templateId) {
              setTemplateId(invitation.templateId);
            }

            setTimeout(() => {
              sendDataToIframe();
            }, 500);
          }
        })
        .catch(() => {
          showToast({
            title: "Lỗi",
            message: "Không thể tải dữ liệu thiệp",
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
        message: "Bạn cần đăng nhập để lưu thiệp.",
        type: "info",
      });
      setShowAuthModal(true);
      return;
    }

    for (const slot of hostSlots) {
      if (
        slot.role.required &&
        !formData[slot.key]?.name?.trim() &&
        !formData[slot.key]?.shortName?.trim()
      ) {
        showToast({
          title: "Thiếu thông tin",
          message: `Vui lòng nhập tên ${slot.role.label}.`,
          type: "warning",
        });
        return;
      }
    }
    if (!formData.partyDate) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng chọn ngày tổ chức sự kiện.",
        type: "warning",
      });
      return;
    }
    if (!formData.partyAddress.trim()) {
      showToast({
        title: "Thiếu thông tin",
        message: "Vui lòng nhập địa chỉ tổ chức sự kiện.",
        type: "warning",
      });
      return;
    }

    setIsPublishing(true);
    try {
      const payload = buildInvitationPayload(formData, {
        keepIds: !!id,
        templateId: templateId || undefined,
        cardType,
        hostRoles: cardDefaults.hostRoles,
      });
      if (!payload.slug) {
        payload.slug = `${Date.now()}`;
      }

      if (id) {
        await invitationService.update(id, payload);
        await invitationService.publish(id);
        const slugToUse = formData.slug || payload.slug;
        setPublishedUrl(
          `${window.location.origin}${publicInvitationPath(slugToUse)}`,
        );
        setShowSuccessModal(true);
        showToast({
          title: "Lưu & Xuất bản thành công",
          message: "Thiệp của bạn đã được lưu và xuất bản!",
          type: "success",
        });
      } else {
        const saveRes = await invitationService.create(payload);
        const invitationId = saveRes.data?.id;

        if (invitationId) {
          await invitationService.publish(invitationId);
          setPublishedUrl(
            `${window.location.origin}${publicInvitationPath(payload.slug)}`,
          );
          setShowSuccessModal(true);
          showToast({
            title: "Xuất bản thành công",
            message: "Thiệp của bạn đã được xuất bản!",
            type: "success",
          });
        }
      }
    } catch (err: any) {
      showToast({
        title: "Thất bại",
        message: err.message || "Không thể lưu thiệp.",
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
        <div className="min-h-screen bg-[#F3EDE3] flex items-center justify-center text-[#2D231F]">
          Đang tải thiệp...
        </div>
      );
    }
    return <div>Không tìm thấy giao diện</div>;
  }

  return (
    <div
      className="flex flex-col md:flex-row h-screen w-full bg-[#F3EDE3] overflow-hidden"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="md:hidden flex bg-[#F3EDE3] border-b border-[#2D231F]/20 p-2 shrink-0 z-30">
        <button
          onClick={() => setActiveTab("edit")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "edit"
              ? "bg-[#2D231F] text-[#F3EDE3] shadow-md"
              : "text-[#2D231F]/60 hover:text-[#2D231F]"
          }`}
        >
          Chỉnh sửa nội dung
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === "preview"
              ? "bg-[#2D231F] text-[#F3EDE3] shadow-md"
              : "text-[#2D231F]/60 hover:text-[#2D231F]"
          }`}
        >
          Xem trước giao diện
        </button>
      </div>

      <div
        className={`w-full md:w-1/2 shrink-0 border-r border-[#D9CDBE] flex-col h-full bg-[#F3EDE3] ${activeTab === "edit" ? "flex" : "hidden md:flex"}`}
      >
        <div className="px-6 py-4 border-b border-[#D9CDBE] bg-[#EDE4D5] flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="flex items-center cursor-pointer bg-transparent border-none p-0"
              onClick={() => router.push(PUBLIC_ROUTES.HOME)}
              aria-label="Trang chủ InviGo"
            >
              <InviGoLogo />
            </button>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#2D231F]/10 text-[#2D231F] border border-[#2D231F]/15">
              {formConfig.nameVi}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 text-[#2D231F] text-left custom-scrollbar pb-32">
          <BasicInfoSection
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            slugify={slugify}
            hostSlots={hostSlots}
            showDisplayOrder={isWedding}
            formConfig={formConfig}
          />
          <HeroImageSection
            formData={formData}
            handleChange={handleChange}
            handleNestedChange={handleNestedChange}
            templateSchema={templateSchema}
            onAuthRequired={() => setShowAuthModal(true)}
            formConfig={formConfig}
            hostSlots={hostSlots}
          />
          {isWedding && (
            <FamilyInfoSection
              formData={formData}
              handleNestedChange={handleNestedChange}
            />
          )}
          <IntroSection
            formData={formData}
            handleChange={handleChange}
            formConfig={formConfig}
          />
          {hasWizardSection("EVENTS") && (
            <EventsSection
              formData={formData}
              addEvent={addEvent}
              removeEvent={removeEvent}
              updateEvent={updateEvent}
              formConfig={formConfig}
            />
          )}
          {hasWizardSection("GALLERY") && (
            <GallerySection
              formData={formData}
              handleChange={handleChange}
              onAuthRequired={() => setShowAuthModal(true)}
              formConfig={formConfig}
            />
          )}
          <PartySection
            formData={formData}
            handleChange={handleChange}
            tempMapUrl={tempMapUrl}
            setTempMapUrl={setTempMapUrl}
            onSaveMap={handleSaveMap}
            formConfig={formConfig}
          />
          {hasWizardSection("DRESS_CODE") && (
            <DressCodeSection
              formData={formData}
              handleChange={handleChange}
              toggleDressCode={toggleDressCode}
              WEDDING_COLORS={WEDDING_COLORS}
            />
          )}
          {hasWizardSection("TIMELINE") && (
            <TimelineSection
              formData={formData}
              handleChange={handleChange}
              addTimeline={addTimeline}
              removeTimeline={removeTimeline}
              updateTimeline={updateTimeline}
              formConfig={formConfig}
            />
          )}
          {hasWizardSection("RSVP") && (
            <RsvpSection formData={formData} handleChange={handleChange} />
          )}
          {hasWizardSection("GUESTBOOK") && (
            <GuestbookSection formData={formData} handleChange={handleChange} />
          )}
          {hasWizardSection("GIFTS") && (
            <BankSection
              formData={formData}
              onOpenBankModal={() => setShowBankModal(true)}
              hostSlots={hostSlots}
              giftsTitle={formConfig.giftsTitle || copyPack.giftsSubtitle}
            />
          )}
          {hasWizardSection("THANK_YOU") && (
            <ThankYouSection
              formData={formData}
              handleChange={handleChange}
              formConfig={formConfig}
            />
          )}
          {hasWizardSection("MUSIC") && (
            <MusicSection
              formData={formData}
              handleChange={handleChange}
              onOpenMusicModal={() => setShowMusicModal(true)}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
            />
          )}
        </div>

        <div className="md:flex p-4 border-t border-[#D9CDBE] bg-[#EDE4D5] flex gap-3 z-10 shrink-0">
          <Button
            variant="outline"
            onClick={() => router.push("/templates")}
            className="flex-1 py-3 text-xs bg-[#F3EDE3] border-[#2D231F]/25 hover:bg-[#E2D6C6] text-[#2D231F] font-semibold rounded-xl cursor-pointer"
          >
            Quay Lại
          </Button>
          <Button
            variant="default"
            onClick={handlePublish}
            disabled={isPublishing}
            className="flex-1 py-3 text-xs bg-[#2D231F] hover:bg-[#3A2E28] text-[#F3EDE3] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            {isPublishing ? (
              <Spinner />
            ) : (
              <Share2 size={14} className="text-[#F3EDE3]" />
            )}{" "}
            Lưu & Xuất Bản
          </Button>
        </div>
      </div>

      <div
        className={`w-full md:w-1/2 h-full flex-col bg-[#E5DACB] overflow-hidden select-none relative ${activeTab === "preview" ? "flex" : "hidden md:flex"}`}
      >
        <div className="hidden md:flex h-14 border-b border-[#D9CDBE] bg-[#EDE4D5] px-6 items-center justify-between gap-4 z-10 shrink-0">
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
                className="flex-none p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold data-active:bg-[#2D231F] data-active:text-[#F3EDE3] data-active:border-[#2D231F] bg-[#2D231F]/8 border-transparent text-[#2D231F]/70 hover:text-[#2D231F] cursor-pointer"
              >
                <Smartphone size={14} />
                Mobile
              </TabsTrigger>
              <TabsTrigger
                value="tablet"
                className="flex-none p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold data-active:bg-[#2D231F] data-active:text-[#F3EDE3] data-active:border-[#2D231F] bg-[#2D231F]/8 border-transparent text-[#2D231F]/70 hover:text-[#2D231F] cursor-pointer"
              >
                <TabletIcon size={14} />
                Tablet
              </TabsTrigger>
              <TabsTrigger
                value="desktop"
                className="flex-none p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-semibold data-active:bg-[#2D231F] data-active:text-[#F3EDE3] data-active:border-[#2D231F] bg-[#2D231F]/8 border-transparent text-[#2D231F]/70 hover:text-[#2D231F] cursor-pointer"
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
              <SelectTrigger className="bg-[#F3EDE3] border-[#2D231F]/25 text-xs text-[#2D231F] font-medium px-3 py-1.5 min-w-64 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#F3EDE3] border-[#2D231F]/25 text-[#2D231F]">
                {DEVICES.filter((d) => d.type === deviceType).map((d) => (
                  <SelectItem key={d.id} value={d.id} className="text-xs">
                    {d.name} ({d.width}x{d.height})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              onClick={sendDataToIframe}
              className="p-2 rounded-lg bg-[#2D231F]/8 border border-[#2D231F]/15 hover:bg-[#2D231F]/15 text-[#2D231F] transition-all cursor-pointer"
              title="Làm mới xem trước"
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
        <div className="flex flex-col gap-6 text-[#2D231F]">
          <h2 className="text-xl font-bold text-[#2D231F] border-b border-[#2D231F]/20 pb-2">
            Quản lý tài khoản {copyPack.giftsSubtitle.toLowerCase()}
          </h2>

          {hostSlots.length > 1 && (
            <div className="flex items-center gap-2 bg-[#EDE4D5] p-1.5 rounded-lg w-full border border-white/5">
              {hostSlots.map((slot) => (
                <button
                  key={slot.key}
                  onClick={() => setActiveBankTab(slot.key)}
                  className={`flex-1 py-2 text-sm rounded-md font-bold transition-all ${
                    activeBankTab === slot.key
                      ? "bg-[#2D231F] text-[#F3EDE3] shadow-[0_2px_8px_rgba(45, 35, 31,0.3)]"
                      : "text-[#2D231F]/60 hover:text-[#2D231F]"
                  }`}
                >
                  {slot.role.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
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
                className="bg-[#2D231F]/10! border-[#2D231F]/15!"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
                Ngân hàng
              </Label>
              <Select
                value={formData[activeBankTab].bankAccount.bankName}
                onValueChange={(val) =>
                  handleBankChange(activeBankTab, "bankName", val)
                }
              >
                <SelectTrigger className="bg-[#EDE4D5] border-[#2D231F]/20 text-[#2D231F]">
                  <SelectValue placeholder="-- Chọn ngân hàng --" />
                </SelectTrigger>
                <SelectContent className="bg-[#EDE4D5] border-[#2D231F]/20 text-[#2D231F]">
                  {POPULAR_BANKS.map((bank) => (
                    <SelectItem key={bank.code} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-[#2D231F]/80">
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
                className="bg-[#2D231F]/10! border-[#2D231F]/15!"
              />
            </div>

            {formData[activeBankTab].bankAccount.qrUrl ? (
              <div className="flex flex-col items-center gap-2 p-4 bg-[#EDE4D5] border border-[#D9CDBE] rounded-xl mt-2 animate-fadeIn">
                <span className="text-xs text-[#2D231F]/70 font-semibold uppercase">
                  Mã VietQR tự động
                </span>
                <img
                  src={formData[activeBankTab].bankAccount.qrUrl}
                  alt={`QR ${hostSlots.find((s) => s.key === activeBankTab)?.role.label || ""}`}
                  className="w-48 h-48 rounded-lg object-contain border border-dashed border-[#2D231F]/30 p-2 bg-white shadow-2xs"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[#2D231F]/30 rounded-xl mt-2 text-center text-[#2D231F]/50 text-xs">
                Vui lòng chọn ngân hàng và nhập số tài khoản để tạo mã QR.
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              variant="default"
              onClick={() => setShowBankModal(false)}
              className="w-full py-3 bg-[#2D231F] text-[#F3EDE3] hover:bg-[#3A2E28] font-bold rounded-xl cursor-pointer"
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
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-transparent via-[#2D231F] to-transparent" />
        <div className="relative z-10 flex flex-col items-center text-center w-full gap-6 mt-2">
          <div className="w-16 h-16 bg-[#EDE4D5] text-[#2D231F] border border-[#D9CDBE] rounded-full flex items-center justify-center shadow-xs">
            <Check size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#2D231F]">
              Xuất bản thành công!
            </h2>
            <p className="text-sm text-[#2D231F]/70 mt-1.5">
              Thiệp cưới của bạn đã sẵn sàng chia sẻ.
            </p>
          </div>
          <div className="w-full bg-[#EDE4D5] border border-[#D9CDBE] rounded-xl p-4 flex flex-col gap-2.5">
            <p className="text-xs text-[#2D231F]/70 text-left font-medium">
              Link thiệp cưới:
            </p>
            <Input
              readOnly
              value={publishedUrl}
              className="w-full bg-white/90 border-[#D9CDBE] text-sm text-[#2D231F] font-mono"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 px-3! bg-[#F3EDE3] hover:bg-[#E2D6C6] border-[#D9CDBE] text-[#2D231F] font-semibold cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(publishedUrl);
                  showToast({ title: "Đã copy link", type: "success" });
                }}
              >
                Copy
              </Button>
              <Button
                variant="outline"
                className="flex-1 px-3! bg-[#F3EDE3] hover:bg-[#E2D6C6] border-[#D9CDBE] text-[#2D231F] font-semibold cursor-pointer"
                onClick={() => window.open(publishedUrl, "_blank")}
              >
                <ExternalLink size={14} className="mr-1" /> Mở thiệp
              </Button>
            </div>
          </div>
          <Button
            variant="default"
            onClick={() => router.push(PUBLIC_ROUTES.HOME)}
            className="w-full mt-2 py-3 rounded-xl bg-[#2D231F] hover:bg-[#3A2E28] text-[#F3EDE3] font-bold cursor-pointer"
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
        <div className="flex flex-col gap-5 text-[#2D231F]">
          <h2 className="text-xl font-bold text-[#2D231F] border-b border-[#2D231F]/10 pb-3">
            Thư viện nhạc nền
          </h2>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#2D231F]/50"
              size={18}
            />
            <Input
              placeholder="Tìm kiếm bài hát..."
              value={musicSearch}
              onChange={(e) => setMusicSearch(e.target.value)}
              className="w-full bg-white/80 border-[#D9CDBE] rounded-xl pl-10 pr-4 py-2.5 h-auto text-sm focus:bg-white focus:border-[#2D231F] text-[#2D231F]"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#2D231F]/15" />
            <span className="text-xs text-[#2D231F]/50 font-medium">Hoặc</span>
            <div className="flex-1 h-px bg-[#2D231F]/15" />
          </div>

          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Nhập URL Youtube..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="flex-1 bg-white/80 border border-[#D9CDBE] rounded-xl px-4 text-sm text-[#2D231F] focus:bg-white focus:outline-none focus:border-[#2D231F] h-11"
            />
            <Button
              variant="default"
              onClick={handleAddYoutube}
              disabled={isAddingYoutube}
              className="bg-[#2D231F] hover:bg-[#3A2E28] text-[#F3EDE3] border-none rounded-xl flex items-center justify-center gap-2 font-semibold cursor-pointer px-5 h-11 shrink-0 shadow-xs"
            >
              {isAddingYoutube ? (
                <Spinner />
              ) : (
                <YoutubeIcon className="w-5 h-5" />
              )}{" "}
              Thêm
            </Button>
          </div>

          <div className="flex flex-col gap-2 mt-2 max-h-75 overflow-y-auto custom-scrollbar pr-2">
            <span className="text-xs font-bold uppercase text-[#2D231F] tracking-wide mb-1">
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
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${music.status === "PROCESSING" ? "opacity-50 cursor-not-allowed border-transparent" : "bg-[#EDE4D5] hover:bg-[#E2D6C6] border-[#D9CDBE] cursor-pointer shadow-2xs"}`}
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
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (music.status === "PROCESSING") return;
                        setPreviewMusicId(
                          previewMusicId === music.id ? null : music.id,
                        );
                      }}
                      className="w-9 h-9 shrink-0 rounded-full bg-[#2D231F] text-[#F3EDE3] flex items-center justify-center hover:bg-[#3A2E28] transition-all cursor-pointer"
                    >
                      {previewMusicId === music.id ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} className="ml-0.5" />
                      )}
                    </button>
                    <div>
                      <p className="text-sm font-bold text-[#2D231F]">
                        {music.name}
                      </p>
                      <p className="text-xs text-[#2D231F]/60">
                        {music.author || "Không rõ"} • {music.usageCount || 0}{" "}
                        lượt dùng
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-mono text-[#2D231F]/50">
                      {music.duration || "0:00"}
                    </span>
                    {music.status === "PROCESSING" && (
                      <span className="text-[10px] text-amber-600 font-bold animate-pulse mt-1">
                        Đang xử lý...
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

      <div className="md:hidden p-4 border-t border-[#D9CDBE] bg-[#EDE4D5] flex gap-3 z-30 shrink-0">
        <Button
          variant="outline"
          onClick={() => router.push("/templates")}
          className="flex-1 py-3 text-xs bg-[#F3EDE3] border-[#2D231F]/25 hover:bg-[#E2D6C6] text-[#2D231F] font-semibold rounded-xl cursor-pointer"
        >
          Quay Lại
        </Button>
        <Button
          variant="default"
          onClick={handlePublish}
          disabled={isPublishing}
          className="flex-1 py-3 text-xs bg-[#2D231F] hover:bg-[#3A2E28] text-[#F3EDE3] font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
        >
          {isPublishing ? (
            <Spinner />
          ) : (
            <Share2 size={14} className="text-[#F3EDE3]" />
          )}{" "}
          Lưu & Xuất Bản
        </Button>
      </div>
    </div>
  );
}
