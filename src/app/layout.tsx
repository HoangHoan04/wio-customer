import { cn } from "@/lib/utils";
import AppProviders from "@/providers";
import type { Metadata } from "next";
import { Cormorant_Garamond, Geist, Geist_Mono, Great_Vibes, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  variable: "--font-script",
  weight: "400",
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Đặt Thiệp Online - Thiệp Cưới Online | InviGo",
  description:
    "Tạo thiệp cưới online đẹp, chuyên nghiệp. Đặt thiệp online với nhiều mẫu thiệp cưới đẹp, thiệp cưới online sang trọng, hiện đại.",
  keywords: [
    "thiệp cưới",
    "thiệp cưới online",
    "đặt thiệp online",
    "thiệp cưới đẹp",
    "InviGo",
  ],
  metadataBase: new URL("https://invigo.vn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Đặt Thiệp Online - Thiệp Cưới Online | InviGo",
    description:
      "Tạo thiệp cưới online đẹp, chuyên nghiệp với nhiều mẫu mã đẹp.",
    type: "website",
    locale: "vi_VN",
    url: "https://invigo.vn",
    siteName: "InviGo",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        inter.variable,
        playfair.variable,
        cormorant.variable,
        greatVibes.variable,
      )}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
