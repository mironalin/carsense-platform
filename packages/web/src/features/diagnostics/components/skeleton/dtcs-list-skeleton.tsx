import { motion } from "framer-motion";
import { Database, Shield } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { cardVariants } from "../../utils/animation-variants";

export function DTCsListSkeleton() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="w-full min-h-[600px] flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-y-3">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </div>
              <CardDescription>
                <Skeleton className="h-4 w-[190px] mt-1" />
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <Skeleton className="h-10 w-[220px]" />
            </div>
          </div>
        </CardHeader>

        <div className="px-6 pt-2">
          <Skeleton className="h-10 w-full" />
        </div>

        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[calc(100vh-290px)] px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4 px-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="border h-full shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-b from-muted/20 to-muted/5">
                    <CardContent className="p-5 flex flex-col space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-6 w-28" />
                        </div>
                        <Skeleton className="h-5 w-24" />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-5 w-32" />
                        </div>
                        <Skeleton className="h-2 w-full" />
                      </div>

                      <Skeleton className="h-20 w-full" />

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-5 w-full" />
                        </div>
                      </div>

                      <Skeleton className="h-24 w-full" />

                      <div className="flex items-center justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
