import { SidebarMenuButton } from "../ui/sidebar";

export function VehicleSwitcherSkeleton() {
  return (
    <SidebarMenuButton
      size="lg"
      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg border"
    >
      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted animate-pulse">
      </div>
      <div className="grid flex-1 text-left gap-1.5">
        <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
        <div className="h-3 w-32 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="h-4 w-4 rounded-sm bg-muted animate-pulse" />
    </SidebarMenuButton>
  );
}
