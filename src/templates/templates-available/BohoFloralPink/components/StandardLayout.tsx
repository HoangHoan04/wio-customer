import decorFlower from "@/assets/decorations/boho-floral-pink/fixed_flower.webp";
import decorFlower2 from "@/assets/decorations/boho-floral-pink/fixed_flower_2.webp";
import flowerTop from "@/assets/decorations/boho-floral-pink/flower_top.webp";
import flowerMid from "@/assets/decorations/boho-floral-pink/flower_mid.webp";
import flowerBottom from "@/assets/decorations/boho-floral-pink/flower_bottom.webp";
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
import type { ThemeTemplateConfig } from "@/dto/theme.dto";

export const StandardLayout = ({ data, config, isEnvelopeOpen, toggleAudio, isPlaying }: { data: any, config: ThemeTemplateConfig, isEnvelopeOpen: boolean, toggleAudio: () => void, isPlaying: boolean }) => {
  if (!data) return null;

  return (
    <div className={`transition-opacity duration-1000 ${isEnvelopeOpen ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}>
      <img
        src={decorFlower}
        alt=""
        aria-hidden="true"
        className="fixed right-0 top-1/2 -translate-y-1/2 w-36 md:w-52 opacity-15 pointer-events-none select-none z-0"
      />
      <img
        src={decorFlower2}
        alt=""
        aria-hidden="true"
        className="fixed left-0 top-1/2 -translate-y-1/2 w-36 md:w-52 opacity-15 pointer-events-none select-none z-0"
      />
      <img
        src={flowerTop}
        alt=""
        aria-hidden="true"
        className="fixed top-16 left-8 w-16 md:w-24 opacity-20 pointer-events-none select-none z-0 -rotate-12"
      />
      <img
        src={flowerTop}
        alt=""
        aria-hidden="true"
        className="fixed top-32 right-12 w-12 md:w-20 opacity-15 pointer-events-none select-none z-0 rotate-45"
      />
      <img
        src={flowerMid}
        alt=""
        aria-hidden="true"
        className="fixed top-1/4 left-4 w-14 md:w-20 opacity-15 pointer-events-none select-none z-0 rotate-30"
      />
      <img
        src={flowerMid}
        alt=""
        aria-hidden="true"
        className="fixed top-3/4 right-6 w-12 md:w-18 opacity-12 pointer-events-none select-none z-0 -rotate-20"
      />
      <img
        src={flowerBottom}
        alt=""
        aria-hidden="true"
        className="fixed bottom-24 left-10 w-16 md:w-24 opacity-20 pointer-events-none select-none z-0 rotate-60"
      />
      <img
        src={flowerBottom}
        alt=""
        aria-hidden="true"
        className="fixed bottom-40 right-8 w-12 md:w-20 opacity-15 pointer-events-none select-none z-0 -rotate-40"
      />
      <img
        src={flowerMid}
        alt=""
        aria-hidden="true"
        className="fixed top-[60%] left-1/4 w-10 md:w-16 opacity-10 pointer-events-none select-none z-0 rotate-15"
      />
      <img
        src={flowerTop}
        alt=""
        aria-hidden="true"
        className="fixed top-[15%] right-1/3 w-10 md:w-14 opacity-10 pointer-events-none select-none z-0 -rotate-25"
      />
      <HeroImages data={data} config={config} />
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
