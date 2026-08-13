"use client";

import { invitationService } from "@/services/invitation.service";
import { guestService } from "@/services/guest.service";
import { getThemeComponent } from "@/templates/templates-available";
import { invitationToThemeData } from "@/utils/invitation-mapper";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function InvitationPublicContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const code = searchParams.get("code");
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError("");

    const loadData = async () => {
      try {
        let invitation: any = null;
        let guest: any = null;

        if (code) {
          try {
            const res = await guestService.identify(code);
            guest = res?.data?.guest;
            invitation = res?.data?.invitation;
          } catch (err) {
            console.error("Failed to identify guest:", err);
          }
        }

        if (!invitation) {
          const res = await invitationService.findBySlug(slug);
          invitation = res?.data || res;
        }

        if (!invitation) {
          setError("Không tìm thấy thiệp");
          return;
        }

        setCardData(invitationToThemeData(invitation, guest));
      } catch (err) {
        console.error(err);
        setError("Không tìm thấy thiệp");
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

  if (error || !cardData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#fdfbf7] text-[#666]">
        <h1 className="text-2xl font-semibold">Thiệp không tồn tại</h1>
        <p>{error}</p>
      </div>
    );
  }

  const ThemeComponent = getThemeComponent(cardData.themeCode);
  return <ThemeComponent data={cardData} isPreview={false} />;
}

export default function InvitationPublicPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#fdfbf7] text-[#666]">
          <p>Đang tải...</p>
        </div>
      }
    >
      <InvitationPublicContent />
    </Suspense>
  );
}
