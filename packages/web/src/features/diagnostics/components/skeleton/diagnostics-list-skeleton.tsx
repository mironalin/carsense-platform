import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import { cardVariants } from "../../utils/animation-variants";

export function DiagnosticsListSkeleton() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Card className="w-full h-[500px] flex flex-col">
        <CardHeader className="space-y-3">
          <div>
            <CardTitle>
              <Skeleton className="h-6 w-40" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-[150px] mt-1" />
            </CardDescription>
          </div>
          <Skeleton className="h-9 w-full" />
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <ScrollArea className="h-[350px]">
            <div className="space-y-4 px-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[76px] w-full rounded-lg" />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="py-3">
          <Skeleton className="h-4 w-[200px] mx-auto" />
        </CardFooter>
      </Card>
    </motion.div>
  );
}
