"use client";

import type { ComponentType } from "react";
import type { SectionId } from "./types/preset-theme.types";
import type { SectionRenderProps } from "./types/preset-theme.types";
import { DividerSection } from "./sections/DividerSection";
import { DressCodeSection } from "./sections/DressCodeSection";
import { GallerySection } from "./sections/GallerySection";
import { GiftBoxSection } from "./sections/GiftBoxSection";
import { GuestbookSection } from "./sections/GuestbookSection";
import { HeroSection } from "./sections/HeroSection";
import { HostsSection } from "./sections/HostsSection";
import { IntroSection } from "./sections/IntroSection";
import { MapSection } from "./sections/MapSection";
import { PartyInfoSection } from "./sections/PartyInfoSection";
import { RsvpSection } from "./sections/RsvpSection";
import { ThankYouSection } from "./sections/ThankYouSection";
import { TimelineSection } from "./sections/TimelineSection";

export const SECTION_REGISTRY: Record<SectionId, ComponentType<SectionRenderProps>> = {
  hero: HeroSection,
  divider: DividerSection,
  familyInfo: HostsSection,
  hosts: HostsSection,
  intro: IntroSection,
  ceremonies: PartyInfoSection,
  countdown: PartyInfoSection,
  gallery: GallerySection,
  partyInfo: PartyInfoSection,
  timeline: TimelineSection,
  rsvp: RsvpSection,
  map: MapSection,
  guestbook: GuestbookSection,
  giftBox: GiftBoxSection,
  dressCode: DressCodeSection,
  thankYou: ThankYouSection,
};

export function renderSection(sectionId: SectionId, props: SectionRenderProps) {
  const Component = SECTION_REGISTRY[sectionId];
  if (!Component) return null;
  return <Component key={sectionId} {...props} variant={props.variant || sectionId} />;
}
