"use client";

import {
  formatDateISO,
  formatTime2Digit,
  sortAndMapEvents,
  sortAndMapTimeline,
} from "@/common/helpers";
import { weddingService } from "@/services/wedding.service";
import { guestService } from "@/services/guest.service";
import { getThemeComponent } from "@/templates/templates-available";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function WeddingPublicContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const code = searchParams.get("code");
  const [weddingData, setWeddingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");

    const loadData = async () => {
      try {
        let wedding: any = null;
        let guest: any = null;

        if (code) {
          try {
            const res = await guestService.identify(code);
            guest = res?.data?.guest;
            wedding = res?.data?.wedding;
          } catch (err) {
            console.error("Failed to identify guest:", err);
          }
        }

        if (!wedding) {
          const res = await weddingService.getWeddingBySlug(slug);
          wedding = res?.data || res;
        }

        if (!wedding) {
          setError("Không tìm thấy thiệp cưới");
          return;
        }

        setWeddingData({
          themeCode: wedding.template?.themeCode || "CUSTOM_DESIGN",
          customDesign: wedding.customDesign,
          slug: wedding.slug,
          displayOrder: wedding.displayOrder || "groom_first",
          groom: {
            name: wedding.groomName || "",
            shortName: wedding.groomShortName || "",
            title: wedding.groomTitle || "",
            familyTitle: wedding.groomFamilyTitle || "",
            father: wedding.groomFatherName || "",
            mother: wedding.groomMotherName || "",
            address: wedding.groomAddress || "",
            photo: wedding.groomPhotoUrl || "",
            bankAccount: {
              bankName: wedding.groomBankName || "",
              accountName: wedding.groomBankOwner || "",
              accountNumber: wedding.groomBankAccount || "",
              qrUrl: wedding.groomQrUrl || "",
            },
          },
          bride: {
            name: wedding.brideName || "",
            shortName: wedding.brideShortName || "",
            title: wedding.brideTitle || "",
            familyTitle: wedding.brideFamilyTitle || "",
            father: wedding.brideFatherName || "",
            mother: wedding.brideMotherName || "",
            address: wedding.brideAddress || "",
            photo: wedding.bridePhotoUrl || "",
            bankAccount: {
              bankName: wedding.brideBankName || "",
              accountName: wedding.brideBankOwner || "",
              accountNumber: wedding.brideBankAccount || "",
              qrUrl: wedding.brideQrUrl || "",
            },
          },
          showHeroImage: wedding.showHeroImage ?? true,
          heroImageMain: wedding.heroImageMain || "",
          showIntro: wedding.showIntro ?? true,
          introText: wedding.invitationText || "",
          events: sortAndMapEvents(wedding.events),
          showGallery: wedding.showGallery ?? true,
          galleryLayout: wedding.galleryLayout || "grid",
          gallery: (wedding.photos || [])
            .sort((a: any, b: any) => a.sortOrder - b.sortOrder)
            .map((p: any) => p.url),
          showParty: wedding.showParty ?? true,
          partyType: wedding.partyType || "wedding",
          partyDate: formatDateISO(wedding.ceremonyAt),
          partyWelcomeTime: wedding.receptionWelcomeTime || "17:30",
          partyStartTime: formatTime2Digit(wedding.ceremonyAt, "18:30"),
          partyAddress: wedding.ceremonyAddress || "",
          partyMapUrl: wedding.ceremonyMapsUrl || "",
          showCountdown: wedding.showCountdown ?? true,
          showMap: wedding.showMap ?? true,
          showDressCode: wedding.showDressCode ?? true,
          dressCodes: wedding.dressCodes || [],
          showTimeline: wedding.showTimeline ?? true,
          timelineTitle: wedding.timelineTitle || "Lịch trình ngày cưới",
          timeline: sortAndMapTimeline(wedding.timelines),
          showRsvp: wedding.showRsvp ?? true,
          rsvpType: wedding.rsvpType || "form",
          showGuestbook: wedding.showGuestbook ?? true,
          guestbookStatic: wedding.guestbookStatic ?? true,
          guestbookFloating: wedding.guestbookFloating ?? false,
          showThankYou: wedding.showThankYou ?? true,
          thankYouText: wedding.thankYouText || "",
          showMusic: !!wedding.musicUrl,
          musicUrl: wedding.musicUrl || "",
          musicName: wedding.musicName || "",
          weddingId: wedding.id,
          guestId: guest ? guest.id : undefined,
          guestName: guest ? guest.fullName : undefined,
          salutation: guest ? guest.salutation : undefined,
        });
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy thiệp cưới");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug, code]);

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

export default function WeddingPublicPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] text-[#666]">
        <p>Đang tải...</p>
      </div>
    }>
      <WeddingPublicContent />
    </Suspense>
  );
}
