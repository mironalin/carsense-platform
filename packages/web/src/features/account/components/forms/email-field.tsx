import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FieldErrorIconTooltip } from "@/features/auth/components/field-error-icon-tooltip";

interface EmailFieldProps {
  field: any; // TanStack Form field with complex generic types
}

export function EmailField({ field }: EmailFieldProps) {
  const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name}>Email Address</Label>
      <div className="relative flex items-center">
        <Input
          id={field.name}
          name={field.name}
          type="email"
          placeholder="Enter your email address"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={e => field.handleChange(e.target.value)}
          disabled={true}
          className={cn(
            "bg-muted/50",
            hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
          )}
        />
        {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
      </div>
      <p className="text-xs text-muted-foreground">
        Email address cannot be changed. Contact support if you need to update it.
      </p>
    </div>
  );
} 