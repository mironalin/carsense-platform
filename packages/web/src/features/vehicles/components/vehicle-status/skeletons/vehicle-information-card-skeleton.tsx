import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function VehicleInformationCardSkeleton() {
  return (
    <Card className="w-full @container/card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card">
      <CardHeader className="relative">
        <CardDescription>Vehicle Information</CardDescription>
        <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold">
          <Skeleton className="h-8 w-3/4" />
        </CardTitle>
        <div className="absolute right-4 top-4">
          <Skeleton className="h-6 w-12 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-12" />
            </div>
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-16" />
            </div>
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-14" />
            </div>
            <Skeleton className="h-5 w-full" />
          </div>
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-1.5">
              <Skeleton className="h-3.5 w-3.5 rounded-full" />
              <Skeleton className="h-3.5 w-14" />
            </div>
            <Skeleton className="h-5 w-full" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
