"use client";

import { getThemeComponent } from "@/templates/templates-available";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  introText: "Một câu chuyện tình yêu đẹp bắt đầu từ những điều giản dị nhất...",
  events: [
    { id: 1, title: "Lễ Gia Tiên", date: "2026-05-24", time: "09:00", address: "Tư gia nhà trai" },
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
    { id: 1, time: "17:30", title: "Đón khách", description: "Cùng chụp những bức hình kỷ niệm" },
    { id: 2, time: "18:30", title: "Khai tiệc", description: "Nghi lễ thành hôn và bắt đầu khai tiệc" },
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

export default function PreviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const themeCode = params.themeCode as string;
  const [weddingData, setWeddingData] = useState<any>(mockWeddingData);
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
              const audio = document.getElementById("bg-music") as HTMLAudioElement;
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

  const ThemeComponent = useMemo(() => getThemeComponent(themeCode), [themeCode]);
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

      <ThemeComponent data={weddingData} isPreview={true} isHoverPreview={isHoverPreview} />
    </div>
  );
}
