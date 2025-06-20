import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DiagnosticsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Skeleton className="h-9 flex-1" />
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-5 flex-1" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
