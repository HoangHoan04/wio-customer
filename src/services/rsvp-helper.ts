import { enumData } from "@/common";
import { guestService } from "./guest.service";

export async function submitRsvpAction(
  attending: "yes" | "no" | null,
  guestCount: number,
) {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    console.warn("No invitation code found in URL");
    return;
  }
  await guestService.rsvp({
    invitationCode: code,
    rsvpStatus:
      attending === "yes"
        ? enumData.RSVP_STATUS.ATTENDING.code
        : enumData.RSVP_STATUS.DECLINED.code,
    attendingCount: attending === "yes" ? guestCount : 0,
  });
}
