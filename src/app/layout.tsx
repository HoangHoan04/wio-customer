import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AppProviders from "@/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dat Thiep Online - Thiep Cuoi Online | Tiem Cuoi Tan Thoi",
  description: "Tao thiep cuoi online dep, chuyen nghiep. Dat thiep online voi nhieu mau thiep cuoi dep, thiep cuoi dep, thiep cuoi online.",
  keywords: ["thiep cuoi", "thiep cuoi online", "dat thiep online", "thiep cuoi dep", "tiem cuoi tan thoi"],
  openGraph: {
    title: "Dat Thiep Online - Thiep Cuoi Online | Tiem Cuoi Tan Thoi",
    description: "Tao thiep cuoi online dep, chuyen nghiep voi nhieu mau ma dep.",
    type: "website",
    locale: "vi_VN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, inter.variable, playfair.variable)}>
      <body className="min-h-full flex flex-col font-sans">
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
