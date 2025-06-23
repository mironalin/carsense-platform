import { ProfileAvatarUpload } from "../profile/profile-avatar-upload";

interface ProfileImageFieldProps {
  field: {
    state: {
      value: string | null;
    };
    handleChange: (value: string | null) => void;
  };
  userName: string;
  userEmail: string;
  disabled?: boolean;
  onImageChange?: (imageUrl: string | null) => void;
}

export function ProfileImageField({
  field,
  userName,
  userEmail,
  disabled = false,
  onImageChange,
}: ProfileImageFieldProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <ProfileAvatarUpload
        currentImage={field.state.value}
        name={userName}
        email={userEmail}
        onImageChange={(imageUrl) => {
          field.handleChange(imageUrl);
          onImageChange?.(imageUrl);
        }}
        disabled={disabled}
      />
    </div>
  );
} 