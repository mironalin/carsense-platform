import { useNavigate } from "@tanstack/react-router";
import {
  BellIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUnreadCount } from "@/features/notifications/api/use-get-notifications";
import { signOut, useSession } from "@/lib/auth-client";

import { useTheme } from "./theme-provider";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { Switch } from "./ui/switch";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { theme, setTheme } = useTheme();
  const [pending, setPending] = useState(false);
  const navigate = useNavigate();
  const { data: session, isPending: isSessionPending, error } = useSession();
  const { data: unreadData } = useGetUnreadCount();

  if (isSessionPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            disabled
          >
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <MoreVerticalIcon className="ml-auto size-4" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!session || !session.user) {
    // Log the error for debugging but don't crash the app
    console.error("NavUser - Session error:", error);
    
    // Return a fallback UI instead of throwing an error
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            disabled
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="text-muted-foreground">Session error</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const { name, email, image } = session.user;
  const unreadCount = unreadData?.unreadCount || 0;

  const avatarFallback = name ? name.split(" ").map(name => name.charAt(0).toUpperCase()).join("") : (email.charAt(0).toUpperCase() ?? "U");

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async () => {
    setPending(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: "/sign-in", search: { mode: undefined, redirect: undefined, state: undefined } });
        },
        onError: (ctx) => {
          setPending(false);
          toast.error(`${ctx.error.message}!`);
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={image ?? ""} alt={name} />
                  <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                </Avatar>
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center rounded-full border-2 border-background"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </Badge>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium transition-colors">{name}</span>
                <span className="truncate text-xs transition-colors">
                  {email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={image ?? ""} alt={name} />
                  <AvatarFallback className="rounded-lg">{avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs">
                    {email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate({ to: "/app/account" })}>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/app/notifications" })}>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <BellIcon />
                    Notifications
                  </div>
                  {unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0.5 min-w-[20px] h-5">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={e => e.preventDefault()}>
                <div className="flex flex-row items-center gap-2">
                  <Switch id="theme-switch" checked={theme === "dark"} onCheckedChange={handleThemeChange} />
                  <Label className="font-normal" htmlFor="theme-switch">Dark Mode</Label>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleSignOut} disabled={pending}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
