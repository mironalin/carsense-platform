import { Clock, Info, LayoutDashboard, LineChart, Tag } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { SensorData } from "../types";

type SensorTableDetailProps = {
  sensor: SensorData;
  children: React.ReactNode;
};

export function SensorTableDetail({ sensor, children }: SensorTableDetailProps) {
  // Format timestamp if available
  const formattedTimestamp = sensor.timestamp
    ? new Date(sensor.timestamp).toLocaleString()
    : "Not Available";

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-2 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            Sensor:
            {" "}
            {sensor.name || "Unknown Sensor"}
          </SheetTitle>
          <SheetDescription>
            Detailed information about this sensor reading
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">
              <Info className="mr-2 h-4 w-4" />
              Details
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="mr-2 h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Sensor Information</CardTitle>
                <CardDescription>All available data for this sensor reading</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">PID</h4>
                    <p className="text-sm">{sensor.pid || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Name</h4>
                    <p className="text-sm">{sensor.name || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Value</h4>
                    <p className="text-base font-medium">
                      {sensor.value !== undefined && sensor.value !== null
                        ? sensor.value
                        : "N/A"}
                      {" "}
                      {sensor.unit || ""}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                    <Badge variant="outline" className="mt-1">
                      {sensor.category || "Uncategorized"}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Timestamp</h4>
                  <p className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    {formattedTimestamp}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>Related sensor metadata</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Diagnostic Session</span>
                  <span className="text-sm">{sensor.diagnosticUUID ? "Available" : "Not linked"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Snapshot UUID</span>
                  <span className="text-sm truncate max-w-[200px]">{sensor.snapshotUUID || "N/A"}</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="py-4">
            <Card>
              <CardHeader>
                <CardTitle>Sensor History</CardTitle>
                <CardDescription>
                  View historical data for this sensor
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex h-[200px] items-center justify-center border rounded-md">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <LineChart className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground">
                      Historical data visualization will be displayed here
                    </p>
                    <Button variant="outline" size="sm" disabled className="mt-2">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      View Dashboard
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6">
          <Button variant="outline" size="sm">Export Sensor Data</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
