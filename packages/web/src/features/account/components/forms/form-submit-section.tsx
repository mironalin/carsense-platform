import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FormSubmitSectionProps {
  isPending: boolean;
  hasChanges: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormSubmitSection({ 
  isPending, 
  hasChanges, 
  onSubmit 
}: FormSubmitSectionProps) {
  return (
    <>
      <Separator />
      
      {/* Submit Button */}
      <div className="flex flex-col items-end space-y-2">
        <Button
          type="submit"
          disabled={isPending || !hasChanges}
          className="gap-2"
          onClick={onSubmit}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </>
  );
} 