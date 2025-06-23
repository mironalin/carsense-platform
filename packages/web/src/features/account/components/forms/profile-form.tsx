import { useForm } from "@tanstack/react-form";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formDataToUpdateRequest, userProfileToFormData } from "../../utils/profile-utils";
import { useUpdateProfile } from "../../api/use-update-profile";
import type { ProfileFormData, UserProfile } from "../../types";
import { formVariants } from "../../utils/animation-variants";
import { ProfileImageField } from "./profile-image-field";
import { EmailField } from "./email-field";
import { FormSubmitSection } from "./form-submit-section";
import { FieldErrorIconTooltip } from "@/features/auth/components/field-error-icon-tooltip";

const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  image: z.string().nullable(),
});

interface ProfileFormProps {
  profile: UserProfile;
  onSuccess?: () => void;
}

export function ProfileForm({ profile, onSuccess }: ProfileFormProps) {
  const updateProfile = useUpdateProfile();
  const initialData = userProfileToFormData(profile);
  const [hasChanges, setHasChanges] = useState(false);
  const [isManualSubmit, setIsManualSubmit] = useState(false);

  const form = useForm({
    defaultValues: initialData,
    onSubmit: async ({ value }) => {
      // Only allow submissions when there are actual changes AND it's a manual submit
      if (!hasChanges || !isManualSubmit) {
        setIsManualSubmit(false); // Reset flag
        return;
      }
      
      setIsManualSubmit(false); // Reset flag after successful check
      
      try {
        const updateData = formDataToUpdateRequest(value);
        await updateProfile.mutateAsync(updateData);
        setHasChanges(false); // Reset changes after successful save
        onSuccess?.();
      } catch (error) {
        // Error handling is done in the mutation
        console.error("Form submission error:", error);
      }
    },
  });

  // Helper function to check if values have changed
  const checkForChanges = (newValues: Partial<ProfileFormData>) => {
    const hasFirstNameChanged = newValues.firstName !== initialData.firstName;
    const hasLastNameChanged = newValues.lastName !== initialData.lastName;
    const hasImageChanged = newValues.image !== initialData.image;
    
    const changed = hasFirstNameChanged || hasLastNameChanged || hasImageChanged;
    
    // Debug logging to track what's triggering changes (remove in production)
    // console.log("checkForChanges called:", { newValues, initialData, changed });
    
    setHasChanges(changed);
    return changed;
  };



  return (
    <motion.div
      variants={formVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsManualSubmit(true);
              form.handleSubmit();
            }}
            className="space-y-6"
          >
            {/* Avatar Upload Section */}
            <form.Field
              name="image"
              children={(field) => (
                <ProfileImageField
                  field={field}
                  userName={profile.name}
                  userEmail={profile.email}
                  onImageChange={(imageUrl: string | null) => {
                    checkForChanges({ ...form.state.values, image: imageUrl });
                  }}
                  disabled={updateProfile.isPending}
                />
              )}
            />

            <Separator />

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <form.Field
                  name="firstName"
                  validators={{ onChange: profileFormSchema.shape.firstName }}
                  children={(field) => {
                    const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>First Name</Label>
                        <div className="relative flex items-center">
                          <Input
                            id={field.name}
                            name={field.name}
                            placeholder="Enter your first name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => {
                              field.handleChange(e.target.value);
                              checkForChanges({ ...form.state.values, firstName: e.target.value });
                            }}
                            disabled={updateProfile.isPending}
                            className={cn(
                              hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                            )}
                          />
                          {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                        </div>
                      </div>
                    );
                  }}
                />

                <form.Field
                  name="lastName"
                  validators={{ onChange: profileFormSchema.shape.lastName }}
                  children={(field) => {
                    const hasError = field.state.meta.errors && field.state.meta.errors.length > 0;
                    return (
                      <div className="space-y-2">
                        <Label htmlFor={field.name}>Last Name</Label>
                        <div className="relative flex items-center">
                          <Input
                            id={field.name}
                            name={field.name}
                            placeholder="Enter your last name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => {
                              field.handleChange(e.target.value);
                              checkForChanges({ ...form.state.values, lastName: e.target.value });
                            }}
                            disabled={updateProfile.isPending}
                            className={cn(
                              hasError ? "!border-destructive focus-visible:ring-destructive pr-8" : "pr-2",
                            )}
                          />
                          {hasError && <FieldErrorIconTooltip errors={field.state.meta.errors} />}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>

              <form.Field
                name="email"
                validators={{ onChange: profileFormSchema.shape.email }}
                children={(field) => (
                  <EmailField
                    field={field}
                  />
                )}
              />
            </div>

            <FormSubmitSection
              isPending={updateProfile.isPending}
              hasChanges={hasChanges}
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsManualSubmit(true);
                form.handleSubmit();
              }}
            />
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
} 