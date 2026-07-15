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
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector(".tct-phone-center")?.classList.add("animate");
      document.querySelector(".tct-phone-left")?.classList.add("animate");
      document.querySelector(".tct-phone-right")?.classList.add("animate");
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{ background: "#0f0608", color: "#f5e6d3", overflowX: "hidden" }}
    >
      <style>{`
        @keyframes shimmer { 
          0% { background-position: -200% center; } 
          100% { background-position: 200% center; } 
        }
        @keyframes fadeUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes floatY { 
          0%, 100% { transform: translateY(0px); } 
          50% { transform: translateY(-10px); } 
        }
        @keyframes shimmerBtn {
          100% { transform: skewX(-12deg) translateX(200%); }
        }

        .tct-hero-text { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; }
        .tct-hero-text-2 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards; }
        .tct-hero-text-3 { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.6s forwards; }
        
        .tct-shimmer-text { 
          background: linear-gradient(90deg, #d4af37 0%, #f5c842 40%, #fff8d6 50%, #f5c842 60%, #d4af37 100%); 
          background-size: 200% auto; 
          -webkit-background-clip: text; 
          -webkit-text-fill-color: transparent; 
          background-clip: text; 
          animation: shimmer 5s linear infinite; 
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
        
        .tct-float { animation: floatY 5s ease-in-out infinite; }
        
        .tct-phone-left, .tct-phone-right, .tct-phone-center { 
          opacity: 0; 
          transition: opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .tct-phone-left.animate { 
          opacity: 1; 
          transform: rotateY(25deg) rotateX(5deg) rotateZ(-8deg) translateZ(-60px) !important; 
        }
        .tct-phone-right.animate { 
          opacity: 1; 
          transform: rotateY(-25deg) rotateX(5deg) rotateZ(8deg) translateZ(-60px) !important; 
        }
        .tct-phone-center.animate { 
          opacity: 1; 
          transform: rotateY(-5deg) rotateX(3deg) translateZ(40px) !important; 
        }
        
        .tct-phone-center.animate .tct-screen-in,
        .tct-phone-left.animate .tct-screen-in,
        .tct-phone-right.animate .tct-screen-in { 
          opacity: 1 !important; 
          transition: opacity 0.6s ease 0.5s; 
        }
          
        .group-hover\\/btn\\:animate-\\[shimmer_1s_ease-in-out\\] {
          animation: shimmerBtn 1s ease-in-out;
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
      <div className="flex items-center justify-center gap-4 px-6 pb-16 pt-8 text-xs text-[#d4af37]/35 tracking-[4px] select-none">
        <span className="w-12 h-px bg-linear-to-r from-transparent to-[#d4af37]/20" />
        <span style={{ fontFamily: "'Cormorant Garamond', serif" }}>✦ ✦ ✦</span>
        <span className="w-12 h-px bg-linear-to-l from-transparent to-[#d4af37]/20" />
      </div>
    </div>
  );
}
