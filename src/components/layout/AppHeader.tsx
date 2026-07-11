"use client";

import LoginModal from "@/components/auth/LoginModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type AppHeaderProps = { isScrolled?: boolean };

export default function AppHeader({ isScrolled = false }: AppHeaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState("/");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const displayName = user?.customer?.fullName || user?.fullName;
  const avatarLabel = (displayName?.[0] || "U").toUpperCase();

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

  useEffect(() => {
    if (searchParams.get("login") === "true") {
      setShowLoginModal(true);
    }
  }, [searchParams]);

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
      setShowLoginModal(true);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setShowUserMenu(false);
    window.location.reload();
  };

  return (
    <>
      <style>{`
        @keyframes logoShimmer {
          0%   { text-shadow: 2px 4px 12px rgba(212,175,55,0.4); }
          50%  { text-shadow: 2px 4px 24px rgba(245,200,66,0.7), 0 0 40px rgba(212,175,55,0.3); }
          100% { text-shadow: 2px 4px 12px rgba(212,175,55,0.4); }
        }
      `}</style>

      <header
        className={`
          fixed z-50 overflow-visible transition-all duration-350 ease-in-out
          left-8 right-8 xl:left-30 xl:right-30
          ${isScrolled ? "top-0 rounded-b-[14px] shadow-[0_8px_32px_#1a0a0f/50,0_2px_8px_#d4af37/15]" : "top-5 rounded-[14px] shadow-[0_4px_24px_#1a0a0f/35]"}
        `}
      >
        <div
          className={`w-full h-0.5 bg-[linear-gradient(90deg,transparent,#d4af37,#f5c842,#d4af37,transparent)] ${isScrolled ? "" : "rounded-t-[14px]"}`}
        />

        <div
          className={`
            border-l border-r border-b border-[#d4af37]/20
            ${isScrolled ? "backdrop-blur-lg bg-[#1a0a0f]/96 rounded-b-[14px]" : "backdrop-blur-md bg-[#1a0a0f]/88 rounded-[14px]"}
          `}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20 gap-4">
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => router.push("/")}
              >
                <span className="text-[clamp(1.3rem,3vw,1.8rem)] font-bold text-[#f5c842] whitespace-nowrap logo-shimmer">
                  Tiệm Cưới Tân Thời
                </span>
              </div>

              <nav className="hidden lg:flex items-center gap-5">
                {navItems.map((item) => {
                  const isActive = activeMenu === item.path;
                  const isHovered = hoveredMenu === item.path;
                  return (
                    <div
                      key={item.path}
                      className="relative"
                      onMouseEnter={() => handleMenuMouseEnter(item.path)}
                      onMouseLeave={handleMenuMouseLeave}
                    >
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`flex items-center gap-1 px-3 py-2 bg-transparent border-none cursor-pointer text-sm tracking-[0.5px] relative transition-colors duration-200 whitespace-nowrap
                          ${isActive ? "font-bold text-[#f5c842]" : "font-medium text-[#f5e6d3] hover:text-[#f5c842]"}
                        `}
                        style={{
                          position: "relative",
                        }}
                      >
                        <span>{item.label}</span>
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-[#d4af37] to-[#f5c842] rounded-sm transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0"}`}
                        />
                      </button>
                    </div>
                  );
                })}
              </nav>

              <div className="flex items-center gap-3">
                <div
                  ref={userMenuRef}
                  className="relative flex items-center gap-2"
                >
                  <div
                    className="flex items-center gap-2 cursor-pointer py-1 pr-2 pl-1 rounded-3xl border border-[#d4af37]/30 transition-all duration-200 bg-[#d4af37]/5 hover:border-[#d4af37]"
                    onClick={handleUserClick}
                  >
                    <div className="w-7.5 h-7.5 rounded-full overflow-hidden bg-linear-to-br from-[#d4af37] to-[#f5c842] flex items-center justify-center shrink-0">
                      <span className="text-[#1a0a0f] font-extrabold text-[13px]">
                        {avatarLabel}
                      </span>
                    </div>
                    <span className="hidden sm:block text-[13px] text-[#f5e6d3] max-w-22.5 overflow-hidden text-ellipsis whitespace-nowrap">
                      {isAuthenticated ? displayName : "Đăng nhập"}
                    </span>
                  </div>

                  {isAuthenticated && showUserMenu && (
                    <div className="absolute right-0 top-[calc(100%+10px)] z-100 border border-[#d4af37]/30 rounded-[10px] min-w-52.5 overflow-hidden shadow-[0_12px_40px_#1a0a0f/60] bg-[#1a0a0f]">
                      <div className="h-0.5 bg-linear-to-r from-[#d4af37] to-[#f5c842]" />
                      <div className="py-1">
                        <div className="px-4 py-2 text-white font-bold text-sm">
                          {displayName}
                        </div>
                        <div className="h-px bg-[#d4af37]/10 mx-3" />
                        <button
                          onClick={() => {
                            router.push("/my-templates");
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 bg-transparent border-none text-[#f5e6d3] text-[13px] cursor-pointer hover:bg-[#d4af37]/8 hover:text-[#f5c842] transition-all"
                        >
                          Thiệp của tôi
                        </button>
                        <button
                          onClick={() => {
                            router.push("/profile");
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 bg-transparent border-none text-[#f5e6d3] text-[13px] cursor-pointer hover:bg-[#d4af37]/8 hover:text-[#f5c842] transition-all"
                        >
                          Thông tin tài khoản
                        </button>
                        <div className="h-px bg-[#d4af37]/10 mx-3" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 bg-transparent border-none text-[#f5e6d3] text-[13px] cursor-pointer hover:bg-red-500/10 hover:text-red-400 transition-all"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1.5px] bg-[linear-gradient(90deg,transparent,#d4af37,#f5c842,#d4af37,transparent)] rounded-b-[14px]" />
      </header>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
}
