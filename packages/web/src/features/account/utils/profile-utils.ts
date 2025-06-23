import { formatDistanceToNow } from "date-fns";

import type { ProfileFormData, ProfileStats, UserProfile } from "../types";

/**
 * Parse a full name into first and last name
 */
export function parseFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";

  return { firstName, lastName };
}

/**
 * Combine first and last name into a full name
 */
export function combineNames(firstName: string, lastName: string): string {
  return `${firstName.trim()} ${lastName.trim()}`.trim();
}

/**
 * Generate avatar fallback initials from name or email
 */
export function generateAvatarFallback(name: string, email: string): string {
  if (name && name.trim()) {
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  }

  return email.charAt(0).toUpperCase();
}

/**
 * Convert user profile to form data
 */
export function userProfileToFormData(profile: UserProfile): ProfileFormData {
  const { firstName, lastName } = parseFullName(profile.name);

  return {
    name: profile.name,
    firstName,
    lastName,
    email: profile.email,
    image: profile.image,
  };
}

/**
 * Convert form data to update request
 */
export function formDataToUpdateRequest(formData: ProfileFormData): {
  name: string;
  image?: string | null;
} {
  return {
    name: combineNames(formData.firstName, formData.lastName),
    image: formData.image, // Keep null as null, don't convert to undefined
  };
}

/**
 * Generate profile statistics
 */
export function generateProfileStats(profile: UserProfile): ProfileStats {
  const memberSince = formatDistanceToNow(new Date(profile.createdAt), { addSuffix: true });

  return {
    memberSince,
    emailVerified: profile.emailVerified,
    accountType: profile.role === "admin" ? "Administrator" : "Standard User",
    lastLogin: "Active now", // This would come from session data in a real app
  };
}

/**
 * Validate image URL or data URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url)
    return false;

  // Check for data URL (base64)
  if (url.startsWith("data:image/")) {
    return true;
  }

  // Check for valid URL
  try {
    const urlObj = new URL(url);
    return Boolean(urlObj);
  }
  catch {
    return false;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Image size must be less than ${formatFileSize(maxSize)}. Please compress your image or choose a smaller file.`,
    };
  }

  return { valid: true };
}

/**
 * Validate base64 image data URL
 */
export function validateBase64Image(dataUrl: string): { valid: boolean; error?: string } {
  if (!dataUrl || !dataUrl.startsWith("data:image/")) {
    return {
      valid: false,
      error: "Invalid image format",
    };
  }

  // Check base64 string length - approximately 1.3MB in base64 = 1MB original
  const maxBase64Length = 1.4 * 1024 * 1024; // ~1.4MB base64 string
  
  if (dataUrl.length > maxBase64Length) {
    return {
      valid: false,
      error: "Image is too large for storage. Please use a smaller image.",
    };
  }

  return { valid: true };
}
