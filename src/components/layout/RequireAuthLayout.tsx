"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import BackToTop from "../common/BackToTop";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export default function RequireAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const hideHeaderFooter =
    pathname.startsWith("/create") ||
    pathname.startsWith("/edit") ||
    pathname.startsWith("/design");

  return (
    <div
      className="w-full min-h-screen relative bg-[#F3EDE3] text-[#2D231F]"
      style={{ margin: 0, padding: 0, overflowX: "hidden" }}
    >
      {!hideHeaderFooter && <AppHeader />}
      <main
        style={{
          margin: 0,
          padding: 0,
          height: hideHeaderFooter ? "100vh" : "auto",
        }}
      >
        {children}
      </main>
      {!hideHeaderFooter && <AppFooter />}
      {!hideHeaderFooter && <BackToTop />}
    </div>
  );
}
