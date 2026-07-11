"use client";

import { weddingService } from "@/services/wedding.service";
import { getThemeComponent } from "@/templates/templates-available";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function WeddingPublicPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [weddingData, setWeddingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");
    weddingService
      .getWeddingBySlug(slug)
      .then((res: any) => {
        const data = res?.data || res;
        if (!data) {
          setError("Không tìm thấy thiệp cưới");
          return;
        }
        setWeddingData({
          themeCode: data.template?.themeCode || "",
          slug: data.slug,
          displayOrder: data.displayOrder || "groom_first",
          groom: {
            name: data.groomName || "",
            shortName: data.groomShortName || "",
            title: data.groomTitle || "",
            familyTitle: data.groomFamilyTitle || "",
            father: data.groomFatherName || "",
            mother: data.groomMotherName || "",
            address: data.groomAddress || "",
            photo: data.groomPhotoUrl || "",
            bankAccount: {
              bankName: data.groomBankName || "",
              accountName: data.groomBankOwner || "",
              accountNumber: data.groomBankAccount || "",
              qrUrl: data.groomQrUrl || "",
            },
          },
          bride: {
            name: data.brideName || "",
            shortName: data.brideShortName || "",
            title: data.brideTitle || "",
            familyTitle: data.brideFamilyTitle || "",
            father: data.brideFatherName || "",
            mother: data.brideMotherName || "",
            address: data.brideAddress || "",
            photo: data.bridePhotoUrl || "",
            bankAccount: {
              bankName: data.brideBankName || "",
              accountName: data.brideBankOwner || "",
              accountNumber: data.brideBankAccount || "",
              qrUrl: data.brideQrUrl || "",
            },
          },
          showHeroImage: data.showHeroImage ?? true,
          heroImageMain: data.heroImageMain || "",
          showIntro: data.showIntro ?? true,
          introText: data.invitationText || "",
          events: (data.events || [])
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((e: any) => ({
              id: e.id,
              title: e.title || "",
              date: e.date || "",
              time: e.time || "",
              address: e.address || "",
            })),
          showGallery: data.showGallery ?? true,
          galleryLayout: data.galleryLayout || "grid",
          gallery: (data.photos || [])
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((p: any) => p.url),
          showParty: data.showParty ?? true,
          partyType: data.partyType || "wedding",
          partyDate: data.ceremonyAt ? new Date(data.ceremonyAt).toISOString().split("T")[0] : "",
          partyWelcomeTime: data.receptionWelcomeTime || "17:30",
          partyStartTime: data.ceremonyAt
            ? new Date(data.ceremonyAt).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })
            : "18:30",
          partyAddress: data.ceremonyAddress || "",
          partyMapUrl: data.ceremonyMapsUrl || "",
          showCountdown: data.showCountdown ?? true,
          showMap: data.showMap ?? true,
          showDressCode: data.showDressCode ?? true,
          dressCodes: data.dressCodes || [],
          showTimeline: data.showTimeline ?? true,
          timelineTitle: data.timelineTitle || "Lịch trình ngày cưới",
          timeline: (data.timelines || [])
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((t: any) => ({
              id: t.id,
              time: t.time || "",
              title: t.title || "",
            })),
          showRsvp: data.showRsvp ?? true,
          rsvpType: data.rsvpType || "form",
          showGuestbook: data.showGuestbook ?? true,
          guestbookStatic: data.guestbookStatic ?? true,
          guestbookFloating: data.guestbookFloating ?? false,
          showThankYou: data.showThankYou ?? true,
          thankYouText: data.thankYouText || "",
          showMusic: !!data.musicUrl,
          musicUrl: data.musicUrl || "",
          musicName: data.musicName || "",
        });
      })
      .catch(() => setError("Không tìm thấy thiệp cưới"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] text-[#666]">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error || !weddingData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fdfbf7] text-[#666]">
        <h1 className="text-2xl font-semibold">Thiệp cưới không tồn tại</h1>
        <p>{error}</p>
      </div>
    );
  }

  const ThemeComponent = getThemeComponent(weddingData.themeCode);
  return <ThemeComponent data={weddingData} isPreview={false} />;
}
