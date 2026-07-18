import { guestService } from "./guest.service";

export async function submitRsvpAction(attending: "yes" | "no" | null, guestCount: number) {
  const code = new URLSearchParams(window.location.search).get("code");
  if (!code) {
    console.warn("No invitation code found in URL");
    return;
  }
  await guestService.rsvp({
    invitationCode: code,
    rsvpStatus: attending === "yes" ? "ATTENDING" : "DECLINED",
    attendingCount: attending === "yes" ? guestCount : 0,
  });
}
