"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/useAuthStore";
import { Menu, UserIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import AuthModal from "../auth/AuthModal";

type AppHeaderProps = { isScrolled?: boolean };

function AutoOpenAuthModal({ onShouldOpen }: { onShouldOpen: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      onShouldOpen();
    }
  }, [searchParams, onShouldOpen]);
  return null;
}

export default function AppHeader({ isScrolled = false }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const userAvatarUrl = user?.customer?.avatar;
  const displayName = user?.customer?.fullName || user?.fullName;
  const avatarLabel = displayName?.[0] ? (
    displayName[0].toUpperCase()
  ) : (
    <UserIcon className="w-3.5 h-3.5" />
  );

  useEffect(() => {
    if (pathname) {
      setActiveMenu(pathname);
      setIsMobileMenuOpen(false);
    }
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setTimeout(() => {
        if (
          userMenuRef.current &&
          !userMenuRef.current.contains(event.target as Node)
        ) {
          setShowUserMenu(false);
        }
      }, 0);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { label: "Mẫu thiệp", path: "/templates" },
    { label: "Liên Hệ", path: "/contact" },
    { label: "Về chúng tôi", path: "/about" },
  ];

  const handleNavClick = (path: string) => {
    setActiveMenu(path);
    router.push(path);
    setHoveredMenu(null);
  };

  const handleMenuMouseEnter = (itemPath: string) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setHoveredMenu(itemPath);
  };

  const handleMenuMouseLeave = () => {
    hoverTimeoutRef.current = window.setTimeout(
      () => setHoveredMenu(null),
      200,
    );
  };

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAuthenticated) {
      setShowUserMenu((v) => !v);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
    window.location.reload();
  };

  return (
    <>
      <Suspense fallback={null}>
        <AutoOpenAuthModal onShouldOpen={() => setShowAuthModal(true)} />
      </Suspense>
      <style>{`
        @keyframes luxuryShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .luxury-logo-shimmer {
          background: linear-gradient(90deg, #d4af37 0%, #fff9e6 25%, #f5c842 50%, #fff9e6 75%, #d4af37 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: luxuryShimmer 6s linear infinite;
        }
      `}</style>

      <header
        className={`
          fixed z-50 overflow-visible transition-all duration-500 ease-in-out
          left-3 right-3 sm:left-6 sm:right-6 xl:left-24 xl:right-24
          ${isScrolled ? "top-0 rounded-b-2xl shadow-[0_15px_40px_rgba(15,6,8,0.7)]" : "top-3 sm:top-6 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)]"}
        `}
      >
        <div
          className={`w-full h-px bg-linear-to-r from-transparent via-[#d4af37]/60 to-transparent ${isScrolled ? "" : "rounded-t-2xl"}`}
        />

        <div
          className={`
            border-l border-r border-b border-[#d4af37]/15 transition-all duration-500
            ${isScrolled ? "backdrop-blur-xl bg-[#13070b]/92 rounded-b-2xl" : "backdrop-blur-lg bg-[#1a0a0f]/80 rounded-2xl"}
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
              <div
                className="flex items-center gap-2 sm:gap-4 cursor-pointer group select-none"
                onClick={() => router.push("/")}
                role="link"
                aria-label="Trang chủ Tiệm cưới tân thời"
              >
                <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border border-[#d4af37]/30 transition-all duration-700 group-hover:scale-105 group-hover:border-[#d4af37]/60" />
                  <div className="absolute inset-1 rounded-full border border-dashed border-[#d4af37]/20 transition-all duration-1000 group-hover:rotate-90 group-hover:border-[#d4af37]/40" />

                  <span
                    className="text-base sm:text-lg font-light text-[#f5c842] relative z-10 transition-transform duration-500 group-hover:scale-110"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    T
                  </span>
                  <span
                    className="text-[8px] sm:text-[10px] font-light text-[#d4af37]/60 absolute z-10 translate-x-1 sm:translate-x-1.5 translate-y-1 sm:translate-y-1.5 transition-transform duration-500 group-hover:scale-110"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    t
                  </span>
                </div>

                <div className="flex flex-col justify-center text-left">
                  <span
                    className="text-lg sm:text-2xl md:text-3xl font-bold italic tracking-wide text-white leading-none luxury-logo-shimmer select-none"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      textShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    Tiệm Cưới Tân Thời
                  </span>
                </div>
              </div>

              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map((item) => {
                  const isActive = activeMenu === item.path;
                  return (
                    <div
                      key={item.path}
                      className="relative"
                      onMouseEnter={() => handleMenuMouseEnter(item.path)}
                      onMouseLeave={handleMenuMouseLeave}
                    >
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center px-2 py-2 bg-transparent  border-none cursor-pointer text-sm tracking-[0.15em] uppercase transition-all duration-300 whitespace-nowrap
                          ${isActive ? "font-semibold text-[#f5c842]" : "font-normal text-[#f5e6d3]/80 hover:text-[#f5c842]"}
                        `}
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          textShadow: "0 0 15px rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        {item.label}
                      </button>

                      <span
                        className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#f5c842] to-transparent rounded-full transition-transform duration-500 origin-center ${
                          isActive || hoveredMenu === item.path
                            ? "scale-x-100"
                            : "scale-x-0"
                        }`}
                      />
                    </div>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">
                <div
                  ref={userMenuRef}
                  className="relative flex items-center gap-2"
                >
                  {isAuthenticated ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="flex items-center gap-2.5 cursor-pointer py-1 px-3.5 rounded-full border border-[#d4af37]/25 transition-all duration-300 bg-[#d4af37]/5 hover:bg-[#d4af37]/10 hover:border-[#d4af37]/50"
                        aria-label="Menu người dùng"
                      >
                        <span
                          className="flex items-center gap-2.5"
                          onClick={handleUserClick}
                        >
                          <Avatar className="w-7 h-7 border border-[#d4af37]/35 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <AvatarImage
                              src={userAvatarUrl}
                              alt={displayName}
                              className="object-cover w-full h-full"
                            />
                            <AvatarFallback className="bg-linear-to-br from-[#221019] to-[#0f0608] text-[#f5c842] font-semibold text-[11px] w-full h-full flex items-center justify-center">
                              {avatarLabel}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden md:block text-[12px] tracking-wider text-[#f5e6d3]/90 max-w-25 overflow-hidden text-ellipsis whitespace-nowrap font-light">
                            {displayName}
                          </span>
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border border-[#d4af37]/20 rounded-xl min-w-56 overflow-hidden shadow-[0_15px_50px_rgba(15,6,8,0.9)] bg-[#13070b]/98 text-[#f5e6d3] backdrop-blur-xl mt-2 p-1.5"
                      >
                        <div className="px-4 py-3 text-white">
                          <p className="font-medium text-xs text-[#c9a98a] tracking-widest uppercase mb-0.5">
                            Tài khoản
                          </p>
                          <p className="font-semibold text-sm text-[#f5c842] truncate">
                            {displayName}
                          </p>
                        </div>
                        <DropdownMenuSeparator className="bg-[#d4af37]/10 mx-2" />
                        <DropdownMenuItem
                          onClick={() => router.push("/my-templates")}
                          className="px-4 py-2.5 text-[#f5e6d3]/90 text-[12px] tracking-wide rounded-lg cursor-pointer hover:bg-[#d4af37]/10 hover:text-[#f5c842] transition-all focus:bg-[#d4af37]/10 focus:text-[#f5c842]"
                        >
                          Thiệp của tôi
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push("/profile")}
                          className="px-4 py-2.5 text-[#f5e6d3]/90 text-[12px] tracking-wide rounded-lg cursor-pointer hover:bg-[#d4af37]/10 hover:text-[#f5c842] transition-all focus:bg-[#d4af37]/10 focus:text-[#f5c842]"
                        >
                          Thông tin cá nhân
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#d4af37]/10 mx-2" />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="px-4 py-2.5 text-red-400/90 text-[12px] tracking-wide rounded-lg cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-all focus:bg-red-500/10 focus:text-red-400"
                        >
                          Đăng xuất tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <button
                      className="flex items-center gap-2 cursor-pointer py-1.5 px-4 rounded-full border border-[#d4af37]/35 transition-all duration-300 bg-linear-to-r from-[#d4af37]/10 to-transparent hover:from-[#d4af37]/20 hover:border-[#d4af37]/60"
                      onClick={handleUserClick}
                      role="button"
                      aria-label="Đăng nhập"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span className="text-[11px] tracking-widest uppercase font-semibold text-[#d4af37]">
                        Đăng Nhập
                      </span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-[#d4af37] hover:text-[#f5c842] transition-colors focus:outline-none cursor-pointer shrink-0"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          <div
            className={`
              lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-[#d4af37]/10 bg-[#13070b]/98 backdrop-blur-xl rounded-b-2xl
              ${isMobileMenuOpen ? "max-h-72 opacity-100 py-5 px-8" : "max-h-0 opacity-0 pointer-events-none"}
            `}
          >
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => {
                const isActive = activeMenu === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`w-full text-left py-2 bg-transparent border-none cursor-pointer text-sm tracking-[0.15em] uppercase transition-all duration-300
                      ${isActive ? "font-semibold text-[#f5c842]" : "font-normal text-[#f5e6d3]/80 hover:text-[#f5c842]"}
                    `}
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-[#d4af37]/40 to-transparent rounded-b-2xl" />
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
        }}
      />
    </>
  );
}
