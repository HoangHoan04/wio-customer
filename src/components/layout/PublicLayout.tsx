"use client";

import { useEffect, useState } from "react";
import BackToTop from "../common/BackToTop";
import MusicToggle from "../common/MusicToggle";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="w-full min-h-screen relative bg-[#F3EDE3] text-[#2D231F]"
      style={{ margin: 0, padding: 0, overflowX: "hidden" }}
    >
      <AppHeader isScrolled={isScrolled} />
      <main style={{ margin: 0, padding: 0 }}>{children}</main>
      <AppFooter />
      <BackToTop />
      <MusicToggle />
    </div>
  );
}
