import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function MaintenanceHistorySkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-6 w-48 bg-muted rounded" />
                <div className="h-8 w-20 bg-muted rounded-lg" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-24 bg-muted rounded-full" />
                <div className="h-6 w-32 bg-muted rounded-full" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-lg" />
                  <div className="space-y-1">
                    <div className="h-4 w-24 bg-muted rounded" />
                    <div className="h-3 w-16 bg-muted rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-muted rounded-lg" />
                  <div className="space-y-1">
                    <div className="h-4 w-20 bg-muted rounded" />
                    <div className="h-3 w-14 bg-muted rounded" />
                  </div>
                </div>
              </div>
              <div className="h-16 w-full bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
