"use client";

import FaqSection from "@/components/home/FaqSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HeroSection from "@/components/home/HeroSection";
import PricingSection from "@/components/home/PricingSection";
import QuoteSection from "@/components/home/QuoteSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatsSection from "@/components/home/StatsSection";
import StepsSection from "@/components/home/StepsSection";
import TemplateSection from "@/components/home/TemplateSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function HomePage() {
  return (
    <div
      style={{ background: "#F3EDE3", color: "#2D231F", overflowX: "hidden" }}
    >
      <style>{`
        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .tct-scroll-reveal { 
          opacity: 0; 
          transform: translateY(24px); 
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .tct-scroll-reveal.visible { 
          opacity: 1; 
          transform: translateY(0); 
        }
      `}</style>

      <HeroSection />
      <StatsSection />
      <TemplateSection />
      <FeaturesSection />
      <ServicesSection />
      <StepsSection />
      <PricingSection />
      <QuoteSection />
      <TestimonialsSection />
      <FaqSection />
      <div className="flex items-center justify-center gap-4 px-6 pb-16 pt-8 text-xs text-[#2D231F]/25 tracking-[4px] select-none">
        <span className="w-12 h-px bg-linear-to-r from-transparent to-[#2D231F]/20" />
        <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>♡</span>
        <span className="w-12 h-px bg-linear-to-l from-transparent to-[#2D231F]/20" />
      </div>
    </div>
  );
}
