import type { LucideIcon } from "lucide-react";

import { Link, useLocation, useParams } from "@tanstack/react-router";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavGroup({
  label,
  items,
  ...props
}: {
  label?: string;
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { vehicleId } = useParams({ strict: false });
  const { pathname } = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => {
            const fullHref = `/app/${vehicleId}${item.url}`;
            const isActive = pathname === fullHref;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild isActive={isActive}>
                  <Link to={fullHref}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
