"use client";

import { PUBLIC_ROUTES, REQUIRE_AUTH_ROUTES } from "@/common/routes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cardTypeService,
  FALLBACK_CARD_TYPES,
  type ICardType,
} from "@/services/card-type.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useModalStore } from "@/stores/useModalStore";
import {
  Baby,
  Cake,
  ChevronDown,
  GraduationCap,
  Heart,
  Home,
  LayoutGrid,
  Mail,
  Menu,
  Sparkles,
  UserIcon,
  X,
  type LucideIcon,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import AuthModal from "../auth/AuthModal";

type AppHeaderProps = { isScrolled?: boolean };

const CARD_TYPE_ICONS: Record<string, LucideIcon> = {
  Heart,
  Cake,
  GraduationCap,
  Baby,
  Home,
  Sparkles,
  Mail,
};

const NAV_LINKS = [
  { label: "Hướng dẫn", path: PUBLIC_ROUTES.USER_MANUAL },
  { label: "Liên hệ", path: PUBLIC_ROUTES.CONTACT },
];

function AutoOpenAuthModal({ onShouldOpen }: { onShouldOpen: () => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("login") === "true") {
      onShouldOpen();
    }
  }, [searchParams, onShouldOpen]);
  return null;
}

function InviGoLogo() {
  return (
    <span
      className="invigo-logo flex items-baseline leading-none select-none"
      style={{ fontFamily: "var(--font-heading), 'Playfair Display', serif" }}
    >
      <span className="text-[1.65rem] sm:text-[1.9rem] md:text-[2.15rem] font-bold tracking-[-0.03em] text-[#2D231F]">
        Invi
      </span>
      <span className="invigo-go relative text-[1.65rem] sm:text-[1.9rem] md:text-[2.15rem] font-bold italic tracking-[-0.04em] text-[#2D231F]">
        Go
        <span
          aria-hidden
          className="absolute -right-1.5 top-1 w-1.5 h-1.5 rounded-full bg-[#C4B09A] shadow-[0_0_0_2px_#F3EDE3]"
        />
      </span>
    </span>
  );
}

function cardTypeHref(type: ICardType) {
  return `${PUBLIC_ROUTES.TEMPLATES}?type=${type.slug}`;
}

export default function AppHeader({ isScrolled = false }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  const { activeModal, openModal, closeModal } = useModalStore();
  const showAuthModal =
    activeModal === "login" ||
    activeModal === "register" ||
    activeModal === "forgotPassword";
  const setShowAuthModal = (show: boolean) => {
    if (show) {
      openModal("login");
    } else {
      closeModal();
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileTypesOpen, setIsMobileTypesOpen] = useState(false);
  const [cardTypes, setCardTypes] = useState<ICardType[]>(FALLBACK_CARD_TYPES);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const userAvatarUrl = user?.customer?.avatar;
  const displayName = user?.customer?.fullName || user?.fullName;
  const avatarLabel = displayName?.[0] ? (
    displayName[0].toUpperCase()
  ) : (
    <UserIcon className="w-3.5 h-3.5" />
  );

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsMobileTypesOpen(false);
  }, [pathname]);

  useEffect(() => {
    cardTypeService.listActive().then(setCardTypes);
  }, []);

  const isTemplatesActive = pathname === PUBLIC_ROUTES.TEMPLATES;
  const isActivePath = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    clearAuth();
    window.location.reload();
  };

  const goToCardType = (type?: ICardType) => {
    router.push(type ? cardTypeHref(type) : PUBLIC_ROUTES.TEMPLATES);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Suspense fallback={null}>
        <AutoOpenAuthModal onShouldOpen={() => setShowAuthModal(true)} />
      </Suspense>

      <style>{`
        .invigo-go {
          display: inline-block;
          transform-origin: 40% 70%;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .invigo-logo-wrap:hover .invigo-go {
          transform: rotate(-8deg) translateY(-1px);
        }
      `}</style>

      <header
        className={`
          fixed z-50 overflow-visible transition-all duration-500 ease-in-out
          left-3 right-3 sm:left-6 sm:right-6 xl:left-24 xl:right-24
          ${isScrolled ? "top-0 rounded-b-2xl shadow-[0_12px_32px_rgba(26,23,20,0.08)]" : "top-3 sm:top-6 rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)]"}
        `}
      >
        <div
          className={`w-full h-px bg-linear-to-r from-transparent via-[#2D231F]/15 to-transparent ${isScrolled ? "" : "rounded-t-2xl"}`}
        />

        <div
          className={`
            border-l border-r border-b border-[#D9CDBE] transition-all duration-500
            ${isScrolled ? "backdrop-blur-xl bg-[#F3EDE3]/92 rounded-b-2xl" : "backdrop-blur-lg bg-[#F3EDE3]/80 rounded-2xl"}
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
              <button
                type="button"
                className="flex items-center cursor-pointer invigo-logo-wrap select-none bg-transparent border-none p-0"
                onClick={() => router.push(PUBLIC_ROUTES.HOME)}
                aria-label="Trang chủ InviGo"
              >
                <InviGoLogo />
              </button>

              <nav className="hidden lg:flex items-center gap-1">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => goToCardType()}
                    className={`relative flex items-center gap-1 px-3.5 py-2 bg-transparent border-none cursor-pointer text-[15px] whitespace-nowrap transition-colors duration-200
                      ${isTemplatesActive ? "font-bold text-[#2D231F]" : "font-semibold text-[#2D231F]/75 group-hover:text-[#2D231F]"}
                    `}
                  >
                    Mẫu thiệp
                    <ChevronDown
                      size={15}
                      strokeWidth={2.4}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                    <span
                      className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-[#2D231F] transition-transform duration-300 origin-center ${
                        isTemplatesActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </button>

                  <div className="absolute left-0 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    <div className="w-72 rounded-2xl border border-[#D9CDBE] bg-[#F3EDE3] shadow-[0_16px_40px_rgba(26,23,20,0.12)] p-2">
                      <button
                        type="button"
                        onClick={() => goToCardType()}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer text-left hover:bg-[#EDE4D5] transition-colors"
                      >
                        <span className="w-8 h-8 rounded-lg bg-[#EDE4D5] flex items-center justify-center text-[#2D231F] shrink-0">
                          <LayoutGrid size={16} />
                        </span>
                        <span className="font-semibold text-[14px] text-[#2D231F]">
                          Tất cả mẫu thiệp
                        </span>
                      </button>
                      <div className="h-px bg-[#D9CDBE] my-1.5 mx-2" />
                      {cardTypes.map((type) => {
                        const Icon = CARD_TYPE_ICONS[type.icon || ""] || Mail;
                        return (
                          <button
                            key={type.code}
                            type="button"
                            onClick={() => goToCardType(type)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-transparent border-none cursor-pointer text-left hover:bg-[#EDE4D5] transition-colors"
                          >
                            <span
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                background: `${type.accentColor || "#2D231F"}18`,
                                color: type.accentColor || "#2D231F",
                              }}
                            >
                              <Icon size={16} />
                            </span>
                            <span className="font-semibold text-[14px] text-[#2D231F]">
                              {type.nameVi}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {NAV_LINKS.map((item) => {
                  const isActive = isActivePath(item.path);
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => router.push(item.path)}
                      className={`relative px-3.5 py-2 bg-transparent border-none cursor-pointer text-[15px] whitespace-nowrap transition-colors duration-200
                        ${isActive ? "font-bold text-[#2D231F]" : "font-semibold text-[#2D231F]/75 hover:text-[#2D231F]"}
                      `}
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0.5 left-3.5 right-3.5 h-[2px] rounded-full bg-[#2D231F] transition-transform duration-300 origin-center ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </button>
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
                        className="flex items-center gap-2.5 cursor-pointer py-1 px-3.5 rounded-full border border-[#D9CDBE] transition-all duration-300 bg-[#F3EDE3] hover:border-[#2D231F]/25"
                        aria-label="Menu người dùng"
                      >
                        <span
                          className="flex items-center gap-2.5"
                          onClick={handleUserClick}
                        >
                          <Avatar className="w-7 h-7 border border-[#D9CDBE] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                            <AvatarImage
                              src={userAvatarUrl}
                              alt={displayName}
                              className="object-cover w-full h-full"
                            />
                            <AvatarFallback className="bg-[#EDE4D5] text-[#2D231F] font-semibold text-[11px] w-full h-full flex items-center justify-center">
                              {avatarLabel}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden md:block text-[13px] text-[#2D231F] max-w-25 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                            {displayName}
                          </span>
                        </span>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border border-[#D9CDBE] rounded-xl min-w-56 overflow-hidden shadow-[0_12px_40px_rgba(26,23,20,0.1)] bg-[#F3EDE3]/98 text-[#2D231F] backdrop-blur-xl mt-2 p-1.5"
                      >
                        <div className="px-4 py-3">
                          <p className="font-semibold text-[11px] text-[#7A6A5C] tracking-widest uppercase mb-0.5">
                            Tài khoản
                          </p>
                          <p className="font-bold text-sm text-[#2D231F] truncate">
                            {displayName}
                          </p>
                        </div>
                        <DropdownMenuSeparator className="bg-[#D9CDBE] mx-2" />
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(REQUIRE_AUTH_ROUTES.MY_TEMPLATES)
                          }
                          className="px-4 py-2.5 text-[#2D231F] text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-[#EDE4D5] focus:bg-[#EDE4D5]"
                        >
                          Thiệp của tôi
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(REQUIRE_AUTH_ROUTES.MY_GUESTS)
                          }
                          className="px-4 py-2.5 text-[#2D231F] text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-[#EDE4D5] focus:bg-[#EDE4D5]"
                        >
                          Khách mời
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(REQUIRE_AUTH_ROUTES.MY_TABLES)
                          }
                          className="px-4 py-2.5 text-[#2D231F] text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-[#EDE4D5] focus:bg-[#EDE4D5]"
                        >
                          Sơ đồ bàn tiệc
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(REQUIRE_AUTH_ROUTES.MY_WISHES)
                          }
                          className="px-4 py-2.5 text-[#2D231F] text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-[#EDE4D5] focus:bg-[#EDE4D5]"
                        >
                          Lời chúc
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(REQUIRE_AUTH_ROUTES.PROFILE)
                          }
                          className="px-4 py-2.5 text-[#2D231F] text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-[#EDE4D5] focus:bg-[#EDE4D5]"
                        >
                          Thông tin cá nhân
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#D9CDBE] mx-2" />
                        <DropdownMenuItem
                          onClick={handleLogout}
                          className="px-4 py-2.5 text-red-600 text-[13px] font-semibold rounded-lg cursor-pointer hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600"
                        >
                          Đăng xuất
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <button
                      className="flex items-center gap-2 cursor-pointer py-1.5 px-4 rounded-full bg-[#2D231F] text-[#F3EDE3] transition-all duration-300 hover:bg-[#2D231F]/85"
                      onClick={handleUserClick}
                      type="button"
                      aria-label="Đăng nhập"
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span className="text-[12px] tracking-wide font-bold">
                        Đăng nhập
                      </span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-[#2D231F] hover:text-[#2D231F]/70 transition-colors focus:outline-none cursor-pointer shrink-0"
                  type="button"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>

          <div
            className={`
              lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-[#D9CDBE] bg-[#F3EDE3]/98 backdrop-blur-xl rounded-b-2xl
              ${isMobileMenuOpen ? "max-h-150 opacity-100 py-4 px-6" : "max-h-0 opacity-0 pointer-events-none"}
            `}
          >
            <nav className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setIsMobileTypesOpen((open) => !open)}
                className={`w-full flex items-center justify-between py-2.5 px-2 bg-transparent border-none cursor-pointer text-[16px]
                  ${isTemplatesActive ? "font-bold text-[#2D231F]" : "font-semibold text-[#2D231F]/75"}
                `}
              >
                Mẫu thiệp
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isMobileTypesOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMobileTypesOpen && (
                <div className="pl-3 pb-2 flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => goToCardType()}
                    className="w-full text-left py-2 px-2 bg-transparent border-none cursor-pointer text-[14px] font-semibold text-[#2D231F]/80"
                  >
                    Tất cả mẫu thiệp
                  </button>
                  {cardTypes.map((type) => (
                    <button
                      key={type.code}
                      type="button"
                      onClick={() => goToCardType(type)}
                      className="w-full text-left py-2 px-2 bg-transparent border-none cursor-pointer text-[14px] font-semibold text-[#2D231F]/80"
                    >
                      {type.nameVi}
                    </button>
                  ))}
                </div>
              )}
              {NAV_LINKS.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      router.push(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-2 bg-transparent border-none cursor-pointer text-[16px]
                      ${isActive ? "font-bold text-[#2D231F]" : "font-semibold text-[#2D231F]/75"}
                    `}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-[#2D231F]/12 to-transparent rounded-b-2xl" />
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
