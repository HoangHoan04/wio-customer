"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/useAuthStore";
import { Lock, LogOut, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className="relative size-9 rounded-full p-0 flex items-center justify-center border border-border overflow-hidden cursor-pointer shrink-0"
          >
            <Avatar className="size-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-blue-600/10 text-blue-600 font-bold text-xs flex items-center justify-center size-full">
                {isAuthenticated && user && user.fullName
                  ? user.fullName!.slice(0, 2).toUpperCase()
                  : "US"}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />

      <PopoverContent
        align="end"
        className="w-56 p-3 flex flex-col gap-2 z-50 border border-border bg-popover text-popover-foreground shadow-lg rounded-xl"
      >
        {isAuthenticated && user ? (
          <>
            <div className="flex flex-col gap-0.5 px-1 py-0.5">
              <span className="text-xs font-semibold text-foreground truncate">
                {user.fullName || "Người dùng"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </span>
            </div>

            <Separator />

            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
                nativeButton={false}
                render={<Link href="/profile" />}
              >
                <UserIcon className="size-3.5" />
                <span>Hồ sơ cá nhân</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
                nativeButton={false}
                render={<Link href="/settings" />}
              >
                <Lock className="size-3.5" />
                <span>Đổi mật khẩu</span>
              </Button>
            </div>

            <Separator />

            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
              onClick={handleLogout}
            >
              <LogOut className="size-3.5" />
              <span>Đăng xuất</span>
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <Button
              variant="ghost"
              className="w-full h-8 text-xs font-medium cursor-pointer rounded-lg"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Đăng nhâp
            </Button>
            <Button
              className="w-full h-8 text-xs font-medium cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Đăng ký
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
