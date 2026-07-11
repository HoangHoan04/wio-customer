import type { ThemeTemplateConfig } from '@/dto/theme.dto';
import dividerImg from '@/assets/decorations/boho-floral-green/decoration_bar.webp';
import { CoupleNames } from "./CoupleNames";
import { Ceremonies } from "./Ceremonies";
import { PartyInfo } from "./PartyInfo";
import { MapDetails } from "./MapDetails";
import { Gallery } from "./Gallery";
import { RSVP } from "./RSVP";
import { Timeline } from "./Timeline";
import { Guestbook } from "./Guestbook";
import { GiftBox } from "./GiftBox";
import { Rules } from "./Rules";
import { ThankYou } from "./ThankYou";
import { Music } from "lucide-react";
import { HeroImages } from "./HeroImages";
import { FamilyInfo } from "./FamilyInfo";

export const StandardLayout = ({ data, config, isEnvelopeOpen, toggleAudio, isPlaying }: { data: any, config: ThemeTemplateConfig, isEnvelopeOpen: boolean, toggleAudio: () => void, isPlaying: boolean }) => {
  if (!data) return null;

  return (
    <div className={`transition-opacity duration-1000 ${isEnvelopeOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
      <HeroImages data={data} config={config} />
      <div className="flex justify-center w-full my-8">
        <img src={dividerImg} alt="divider" className="w-full max-w-md opacity-80" />
      </div>

      <FamilyInfo data={data} config={config} />
      <CoupleNames data={data} config={config} />
      <Ceremonies data={data} config={config} />
      {data.showGallery && <Gallery data={data} config={config} />}
      <PartyInfo data={data} config={config} />
      <Timeline data={data} config={config} />
      {data.showRsvp && <div className="w-full relative z-10"><RSVP data={data} config={config} /></div>}
      <MapDetails data={data} config={config} />
      {data.showGuestbook && <Guestbook data={data} config={config} />}
      <GiftBox data={data} config={config} />
      {data.showDressCode && <Rules data={data} config={config} />}
      {data.showThankYou && <ThankYou data={data} config={config} />}

      {isEnvelopeOpen && data.musicUrl && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-xl border-2 hover:scale-110 transition-transform"
          style={{ backgroundColor: config.colors.envelope, borderColor: config.colors.accent, color: "#fff" }}
        >
          <Music size={20} className={`${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
          {isPlaying && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: config.colors.accent }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: config.colors.accent }}></span>
            </span>
          )}
        </button>
      )}
    </div>
  );
};
