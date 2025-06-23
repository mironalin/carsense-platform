import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { FieldErrorIconTooltip } from "../../../auth/components/field-error-icon-tooltip";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

interface PersonalInfoFieldsProps {
  firstNameField: {
    name: string;
    state: {
      value: string;
      meta: {
        errors: string[];
      };
    };
    handleChange: (value: string) => void;
    handleBlur: () => void;
  };
  lastNameField: {
    name: string;
    state: {
      value: string;
      meta: {
        errors: string[];
      };
    };
    handleChange: (value: string) => void;
    handleBlur: () => void;
  };
  emailField: {
    name: string;
    state: {
      value: string;
      meta: {
        errors: string[];
      };
    };
    handleChange: (value: string) => void;
    handleBlur: () => void;
  };
  disabled?: boolean;
  onFieldChange?: (fieldName: string, value: string) => void;
}

export function PersonalInfoFields({
  firstNameField,
  lastNameField,
  emailField,
  disabled = false,
  onFieldChange,
}: PersonalInfoFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personal Information</h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* First Name Field */}
        <div className="space-y-2">
          <Label htmlFor={firstNameField.name}>First Name</Label>
          <div className="relative flex items-center">
            <Input
              id={firstNameField.name}
              name={firstNameField.name}
              placeholder="Enter your first name"
              value={firstNameField.state.value}
              onBlur={firstNameField.handleBlur}
              onChange={(e) => {
                firstNameField.handleChange(e.target.value);
                onFieldChange?.("firstName", e.target.value);
              }}
              disabled={disabled}
              className={cn(
                firstNameField.state.meta.errors.length > 0
                  ? "!border-destructive focus-visible:ring-destructive pr-8"
                  : "pr-2",
              )}
            />
            {firstNameField.state.meta.errors.length > 0 && (
              <FieldErrorIconTooltip errors={firstNameField.state.meta.errors} />
            )}
          </div>
        </div>

        {/* Last Name Field */}
        <div className="space-y-2">
          <Label htmlFor={lastNameField.name}>Last Name</Label>
          <div className="relative flex items-center">
            <Input
              id={lastNameField.name}
              name={lastNameField.name}
              placeholder="Enter your last name"
              value={lastNameField.state.value}
              onBlur={lastNameField.handleBlur}
              onChange={(e) => {
                lastNameField.handleChange(e.target.value);
                onFieldChange?.("lastName", e.target.value);
              }}
              disabled={disabled}
              className={cn(
                lastNameField.state.meta.errors.length > 0
                  ? "!border-destructive focus-visible:ring-destructive pr-8"
                  : "pr-2",
              )}
            />
            {lastNameField.state.meta.errors.length > 0 && (
              <FieldErrorIconTooltip errors={lastNameField.state.meta.errors} />
            )}
          </div>
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor={emailField.name}>Email Address</Label>
        <div className="relative flex items-center">
          <Input
            id={emailField.name}
            name={emailField.name}
            type="email"
            placeholder="Enter your email address"
            value={emailField.state.value}
            onBlur={emailField.handleBlur}
            onChange={(e) => {
              emailField.handleChange(e.target.value);
              onFieldChange?.("email", e.target.value);
            }}
            disabled={true}
            className={cn(
              emailField.state.meta.errors.length > 0
                ? "!border-destructive focus-visible:ring-destructive pr-8"
                : "pr-2",
            )}
          />
          {emailField.state.meta.errors.length > 0 && (
            <FieldErrorIconTooltip errors={emailField.state.meta.errors} />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Email changes are not currently supported
        </p>
      </div>
    </div>
  );
}

export { profileFormSchema }; 