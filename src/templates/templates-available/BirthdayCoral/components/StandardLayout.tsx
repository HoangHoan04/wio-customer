import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Music,  } from "lucide-react";
import { Countdown } from "./Countdown";
import { Gallery } from "./Gallery";
import { GiftBox } from "./GiftBox";
import { Guestbook } from "./Guestbook";
import { HeroImages } from "./HeroImages";
import { HonoreeInfo } from "./HonoreeInfo";
import { MapDetails } from "./MapDetails";
import { PartyInfo } from "./PartyInfo";
import { RSVP } from "./RSVP";
import { Rules } from "./Rules";
import { ThankYou } from "./ThankYou";
import { Timeline } from "./Timeline";

export const StandardLayout = ({
  data,
  config,
  isEnvelopeOpen,
  toggleAudio,
  isPlaying,
}: {
  data: any;
  config: ThemeTemplateConfig;
  isEnvelopeOpen: boolean;
  toggleAudio: () => void;
  isPlaying: boolean;
}) => {
  if (!data) return null;

  return (
    <div
      className={`transition-opacity duration-1000 max-w-lg mx-auto min-h-screen bg-white/70 shadow-2xl backdrop-blur-xs relative border-x border-orange-200/40 pb-16 ${
        isEnvelopeOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
    >
      {/* Floating Music Control */}
      <button
        onClick={toggleAudio}
        className={`fixed top-5 right-5 z-50 size-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-white/60 cursor-pointer ${
          isPlaying
            ? "bg-orange-500 text-white animate-spin"
            : "bg-white/80 text-orange-800 backdrop-blur-md"
        }`}
        style={{ animationDuration: "6s" }}
        title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        <Music className="size-4" />
      </button>

      <HeroImages data={data} config={config} />
      <HonoreeInfo data={data} config={config} />
      <Countdown data={data} config={config} />
      <PartyInfo data={data} config={config} />
      <Timeline data={data} config={config} />
      {data.showGallery && <Gallery data={data} config={config} />}
      {data.showRsvp && <RSVP data={data} config={config} />}
      <MapDetails data={data} config={config} />
      {data.showGuestbook && <Guestbook data={data} config={config} />}
      <GiftBox data={data} config={config} />
      {data.showDressCode && <Rules data={data} config={config} />}
      {data.showThankYou && <ThankYou data={data} config={config} />}
    </div>
  );
};
