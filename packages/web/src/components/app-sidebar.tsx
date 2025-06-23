import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  ArrowUpCircleIcon,
  BarChart3,
  Car,
  Download,
  Gauge,
  HelpCircle,
  MapPin,
  Settings,
  Share2,
  Table,
  Wrench,
} from "lucide-react";
import * as React from "react";

import { NavGroup } from "@/components/nav-group";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { VehicleSwitcher } from "./vehicle-switcher";

const data = {
  navOverview: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Car,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Vehicle Status",
      url: "/vehicle-status",
      icon: Activity,
    },
  ],
  navDataAndMonitoring: [
    {
      title: "Sensors",
      url: "/sensors",
      icon: Gauge,
    },
    {
      title: "Charts",
      url: "/charts",
      icon: BarChart3,
    },
    {
      title: "Tables",
      url: "/tables",
      icon: Table,
    },
    {
      title: "Export",
      url: "/export",
      icon: Download,
    },
  ],
  navVehicleManagement: [
    {
      title: "Location",
      url: "/location",
      icon: MapPin,
    },
    {
      title: "Diagnostics",
      url: "/diagnostics",
      icon: AlertTriangle,
    },
    {
      title: "Maintenance",
      url: "/maintenance",
      icon: Wrench,
    },
    {
      title: "Ownership",
      url: "/ownership",
      icon: Share2,
    },
  ],
  navFooter: [
    {
      title: "Service Centers",
      url: "/service-centers",
      icon: Wrench,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
    },
    {
      title: "Help",
      url: "/help",
      icon: HelpCircle,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu className="flex flex-col gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/app">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-muted-foreground font-mono font-medium">CarSense</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <VehicleSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Overview" items={data.navOverview} />
        <NavGroup label="Data & Monitoring" items={data.navDataAndMonitoring} />
        <NavGroup label="Vehicle Management" items={data.navVehicleManagement} />
        <NavGroup items={data.navFooter} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
