"use client";

import { EnvelopeWelcome, MusicToggle } from "@/templates/shared/layouts/EnvelopeShell";
import { DividerSection } from "@/templates/shared/sections/DividerSection";
import { GallerySection } from "@/templates/shared/sections/GallerySection";
import { GiftBoxSection } from "@/templates/shared/sections/GiftBoxSection";
import { GuestbookSection } from "@/templates/shared/sections/GuestbookSection";
import { HeroSection } from "@/templates/shared/sections/HeroSection";
import { HostsSection } from "@/templates/shared/sections/HostsSection";
import { IntroSection } from "@/templates/shared/sections/IntroSection";
import { MapSection } from "@/templates/shared/sections/MapSection";
import { PartyInfoSection } from "@/templates/shared/sections/PartyInfoSection";
import { RsvpSection } from "@/templates/shared/sections/RsvpSection";
import { ThankYouSection } from "@/templates/shared/sections/ThankYouSection";
import { TimelineSection } from "@/templates/shared/sections/TimelineSection";
import { themeConfig } from "./config";
import { useDragonPhoenixRedTheme } from "./hook";
import type { ThemeRenderProps } from "./types";

/** Giao diện theme Dragon Phoenix Red — hero single, intro trước thông tin gia đình. */
export default function DragonPhoenixRedRender(props: ThemeRenderProps) {
  const runtime = useDragonPhoenixRedTheme(props);
  const { data } = props;
  const section = { data, config: themeConfig };
  const {
    showEnvelope,
    showContent,
    isPlaying,
    openEnvelope,
    toggleAudio,
    isEnvelopeOpen,
  } = runtime;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background: themeConfig.pageBackground || themeConfig.tokens.colors.background,
        color: themeConfig.tokens.colors.textPrimary,
        fontFamily: themeConfig.tokens.fonts.body,
      }}
    >
      <audio id="bg-music" loop src={String(data.musicUrl || "")} />

      {showEnvelope && (
        <EnvelopeWelcome data={data} config={themeConfig} onOpen={openEnvelope} />
      )}

      <div
        className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0 h-0 overflow-hidden"}`}
      >
        <HeroSection {...section} />
        <DividerSection {...section} />
        <IntroSection {...section} />
        <HostsSection {...section} variant="familyInfo" />
        <HostsSection {...section} />
        <PartyInfoSection {...section} variant="ceremonies" />
        <PartyInfoSection {...section} variant="countdown" />
        <GallerySection {...section} />
        <PartyInfoSection {...section} variant="partyInfo" />
        <TimelineSection {...section} />
        <RsvpSection {...section} />
        <MapSection {...section} />
        <GuestbookSection {...section} />
        <GiftBoxSection {...section} />
        <ThankYouSection {...section} />
      </div>

      <MusicToggle
        config={themeConfig}
        isPlaying={isPlaying}
        onToggle={toggleAudio}
        visible={!!(isEnvelopeOpen && data.musicUrl)}
      />
    </div>
  );
}
