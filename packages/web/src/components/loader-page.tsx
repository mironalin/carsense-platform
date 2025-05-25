import { LoaderCircle } from "lucide-react";

export function LoaderPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderCircle className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
}
