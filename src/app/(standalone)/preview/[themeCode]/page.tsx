"use client";

import { getThemeComponent } from "@/templates/templates-available";
import { ArrowLeftIcon } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const mockWeddingData = {
  displayOrder: "groom_first",
  groom: {
    name: "Trần Minh Quân",
    shortName: "Minh Quân",
    title: "Trưởng Nam",
    father: "Trần Văn Hùng",
    mother: "Phạm Thị Lan",
    address: "Hà Nội",
    photo: "",
    bankAccount: {
      bankName: "VietinBank",
      accountName: "TRAN MINH QUAN",
      accountNumber: "9876543210",
      qrUrl: "",
    },
  },
  bride: {
    name: "Nguyễn Thu Hà",
    shortName: "Thu Hà",
    title: "Út Nữ",
    father: "Nguyễn Văn Bình",
    mother: "Phan Thị Hương",
    address: "Hà Nội",
    photo: "",
    bankAccount: {
      bankName: "BIDV",
      accountName: "NGUYEN THU HA",
      accountNumber: "0123456789",
      qrUrl: "",
    },
  },
  showHeroImage: true,
  showIntro: true,
  introText:
    "Một câu chuyện tình yêu đẹp bắt đầu từ những điều giản dị nhất...",
  events: [
    {
      id: 1,
      title: "Lễ Gia Tiên",
      date: "2026-05-24",
      time: "09:00",
      address: "Tư gia nhà trai",
    },
  ],
  showParty: true,
  partyType: "wedding",
  partyDate: "2026-05-24",
  partyWelcomeTime: "17:30",
  partyStartTime: "18:30",
  showCountdown: true,
  partyAddress: "Tiệc Cưới Hoàng Gia, Hà Nội",
  showMap: true,
  partyMapUrl: "https://maps.app.goo.gl",
  showGallery: true,
  galleryLayout: "grid",
  gallery: ["", "", "", ""],
  showDressCode: true,
  dressCodes: ["#FDFBF7", "#849A80", "#E4C59E"],
  showTimeline: true,
  timelineTitle: "Lịch trình ngày cưới",
  timeline: [
    {
      id: 1,
      time: "17:30",
      title: "Đón khách",
      description: "Cùng chụp những bức hình kỷ niệm",
    },
    {
      id: 2,
      time: "18:30",
      title: "Khai tiệc",
      description: "Nghi lễ thành hôn và bắt đầu khai tiệc",
    },
  ],
  showRsvp: true,
  rsvpType: "button",
  showGuestbook: true,
  guestbookStatic: true,
  guestbookFloating: false,
  showThankYou: true,
  thankYouText: "Cảm ơn quý khách đã đến chung vui cùng gia đình chúng tôi",
  musicUrl: "",
  musicName: "",
};

const mockBirthdayData = {
  title: "Tiệc Sinh Nhật Minh Anh",
  cardType: "BIRTHDAY",
  welcomeLine: "THIỆP MỜI SINH NHẬT",
  introText: "Trân trọng kính mời bạn đến chung vui bữa tiệc sinh nhật tuổi 25 cùng mình nhé!",
  groom: {
    name: "Nguyễn Minh Anh",
    fullName: "Nguyễn Minh Anh",
    title: "Chủ nhân bữa tiệc",
    bankAccount: {
      bankName: "MB Bank",
      accountName: "NGUYEN MINH ANH",
      accountNumber: "8888999966",
      qrUrl: "",
    },
  },
  extraContent: {
    age: 25,
    partyTheme: "Neon Sunset & Tropical",
  },
  showHeroImage: true,
  heroImageMain: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
  showParty: true,
  party: {
    name: "BỮA TIỆC SINH NHẬT",
    eventDate: "2026-06-20",
    eventTime: "18:30",
    venueName: "The Vintage Lounge & Restaurant",
    address: "Tầng 5, Tòa nhà Landmark, 72 Lê Thánh Tôn, Q.1, TP.HCM",
    mapUrl: "https://maps.app.goo.gl",
  },
  events: [
    {
      id: 1,
      name: "Bữa tiệc sinh nhật",
      eventDate: "2026-06-20",
      eventTime: "18:30",
      venueName: "The Vintage Lounge",
      address: "72 Lê Thánh Tôn, Q.1, TP.HCM",
    },
  ],
  showCountdown: true,
  showGallery: true,
  photos: [
    { url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80" },
  ],
  showRsvp: true,
  rsvpType: "button",
  rsvpCta: "Xác nhận tham dự",
  rsvpIntro: "Hãy cho chúng mình biết bạn sẽ đến chung vui sinh nhật nhé!",
  showGuestbook: true,
  showDressCode: true,
  dressCode: {
    colors: ["#F97316", "#FDE047", "#FFFFFF", "#1E293B"],
    note: "Trang phục màu cam san hô, vàng pastel hoặc trắng rạng rỡ",
  },
  showThankYou: true,
  giftsTitle: "HỘP QUÀ SINH NHẬT",
  giftsSubtitle: "Thông tin gửi quà mừng",
};

const mockGraduationData = {
  title: "Lễ Tốt Nghiệp Cử Nhân",
  cardType: "GRADUATION",
  welcomeLine: "THƯ MỜI LỄ TỐT NGHIỆP",
  introText: "Trân trọng kính mời bạn đến tham dự Lễ tốt nghiệp và chia vui cùng mình trong ngày đặc biệt này!",
  groom: {
    name: "Hoàng Gia Bảo",
    fullName: "Hoàng Gia Bảo",
    title: "Tân Khoa Cử Nhân",
    bankAccount: {
      bankName: "Vietcombank",
      accountName: "HOANG GIA BAO",
      accountNumber: "1012345678",
      qrUrl: "",
    },
  },
  extraContent: {
    year: 2026,
    major: "Khoa học Máy tính",
    school: "Đại học Bách Khoa TP.HCM",
  },
  showHeroImage: true,
  heroImageMain: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
  ceremony: {
    name: "LỄ TRAO BẰNG TỐT NGHIỆP",
    eventDate: "2026-07-15",
    eventTime: "08:00",
    venueName: "Hội Trường A - Đại học Bách Khoa",
    address: "268 Lý Thường Kiệt, P.14, Q.10, TP.HCM",
    mapUrl: "https://maps.app.goo.gl",
  },
  party: {
    name: "TIỆC MỪNG TỐT NGHIỆP",
    eventDate: "2026-07-15",
    eventTime: "18:00",
    venueName: "Nhà Hàng Grand Palace",
    address: "142/18 Cộng Hòa, P.4, Q.Tân Bình, TP.HCM",
    mapUrl: "https://maps.app.goo.gl",
  },
  events: [
    {
      id: 1,
      name: "Lễ Trao Bằng Cử Nhân",
      eventDate: "2026-07-15",
      eventTime: "08:00",
      venueName: "Hội Trường A",
      address: "268 Lý Thường Kiệt, Q.10, TP.HCM",
    },
  ],
  showCountdown: true,
  showGallery: true,
  photos: [
    { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?w=600&auto=format&fit=crop&q=80" },
    { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80" },
  ],
  showRsvp: true,
  rsvpType: "button",
  rsvpCta: "Xác nhận tham dự",
  rsvpIntro: "Sự hiện diện của bạn làm ngày tốt nghiệp thêm trọn vẹn!",
  showGuestbook: true,
  showDressCode: true,
  dressCode: {
    colors: ["#0F172A", "#1E3A8A", "#D97706", "#FFFFFF"],
    note: "Trang phục lịch sự: Áo sơ mi / Lễ phục / Váy trang nhã",
  },
  showThankYou: true,
  giftsTitle: "HỘP QUÀ TỐT NGHIỆP",
  giftsSubtitle: "Thông tin gửi quà mừng",
};

function getInitialMockData(themeCode: string) {
  const norm = (themeCode || "").toLowerCase().replace(/[-_]/g, "");
  if (norm.includes("birthday") || norm.includes("sinhnhat") || norm.includes("coral")) {
    return mockBirthdayData;
  }
  if (norm.includes("grad") || norm.includes("totnghiep") || norm.includes("academic")) {
    return mockGraduationData;
  }
  return mockWeddingData;
}

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeCode = params.themeCode as string;
  const [weddingData, setWeddingData] = useState<any>(() =>
    getInitialMockData(themeCode),
  );
  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    setIsEmbedded(window.parent !== window);
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "UPDATE_WEDDING_DATA") {
        setWeddingData((prevData: any) => {
          const newData = event.data.data;

          if (newData.musicUrl && prevData?.musicUrl !== newData.musicUrl) {
            setTimeout(() => {
              const audio = document.getElementById(
                "bg-music",
              ) as HTMLAudioElement;
              if (audio) {
                audio.play().catch(() => {});
              }
            }, 100);
          }

          return newData;
        });
      }

      if (event.data && event.data.type === "PAUSE_MUSIC") {
        const audio = document.getElementById("bg-music") as HTMLAudioElement;
        if (audio) audio.pause();
      }

      if (event.data && event.data.type === "PLAY_MUSIC") {
        const audio = document.getElementById("bg-music") as HTMLAudioElement;
        if (audio) audio.play().catch(() => {});
      }
    };

    window.addEventListener("message", handleMessage);

    if (window.parent !== window) {
      window.parent.postMessage({ type: "PREVIEW_READY" }, "*");
    }

    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      window.close();
    }
  };

  if (!themeCode) {
    return <div>Mã theme không hợp lệ!</div>;
  }

  const ThemeComponent = useMemo(
    () => getThemeComponent(themeCode),
    [themeCode],
  );
  const viewMode = searchParams.get("viewMode");
  const isHoverPreview = searchParams.get("hover") === "true";
  const isSimulatedTouch = viewMode === "mobile" || viewMode === "tablet";

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        ::-webkit-scrollbar { display: none !important; }
        html, body { -ms-overflow-style: none !important; scrollbar-width: none !important; }
      `}</style>

      {!isEmbedded && (
        <button
          onClick={handleBack}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            cursor: isSimulatedTouch ? "grab" : "pointer",
            backdropFilter: "blur(4px)",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            fontWeight: 500,
          }}
        >
          <ArrowLeftIcon size={18} />
          Đóng xem trước
        </button>
      )}

      <ThemeComponent
        data={weddingData}
        isPreview={true}
        isHoverPreview={isHoverPreview}
      />
    </div>
  );
}
