import type { ThemeTemplateConfig } from "@/dto/theme.dto";
import { Music } from "lucide-react";
import { CeremonyAndParty } from "./CeremonyAndParty";
import { Countdown } from "./Countdown";
import { Gallery } from "./Gallery";
import { GiftBox } from "./GiftBox";
import { GraduateInfo } from "./GraduateInfo";
import { Guestbook } from "./Guestbook";
import { HeroImages } from "./HeroImages";
import { MapDetails } from "./MapDetails";
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
      className={`transition-opacity duration-1000 max-w-lg mx-auto min-h-screen bg-slate-50/95 shadow-2xl backdrop-blur-xs relative border-x border-slate-300/60 pb-16 ${
        isEnvelopeOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
      }`}
    >
      {/* Floating Music Control */}
      <button
        onClick={toggleAudio}
        className={`fixed top-5 right-5 z-50 size-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 border border-amber-300/40 cursor-pointer ${
          isPlaying
            ? "bg-amber-500 text-slate-950 animate-spin"
            : "bg-slate-900/80 text-amber-300 backdrop-blur-md"
        }`}
        style={{ animationDuration: "6s" }}
        title={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
      >
        <Music className="size-4" />
      </button>

      <HeroImages data={data} config={config} />
      <GraduateInfo data={data} config={config} />
      <Countdown data={data} config={config} />
      <CeremonyAndParty data={data} config={config} />
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
