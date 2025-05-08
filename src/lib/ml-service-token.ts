import { sign } from "jsonwebtoken";
import env  from "../../env";
import { config } from "dotenv";

config({ path: ".env" });

interface ServiceTokenPayload {
  sub: string;          // User ID
  role: string;         // User role
  permissions: string[]; // User permissions
  exp: number;          // Expiration time
}

/**
 * Generate a JWT token for service-to-service authentication with the ML service
 *
 * @param userId - User ID to include in the token
 * @param role - User role (user, admin, etc.)
 * @param permissions - Array of permissions to include in the token
 * @returns Signed JWT token
 */
export function generateMLServiceToken(
  userId: string,
  role: string,
  permissions: string[]
): string {
  // Get the secret from environment variables
  const secret = env.ML_SERVICE_JWT_SECRET;

  if (!secret) {
    throw new Error("ML_SERVICE_JWT_SECRET is not defined in environment variables");
  }

  // Create the token payload
  const payload: ServiceTokenPayload = {
    sub: userId,
    role,
    permissions,
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 8) // 8 days
  };

  // Sign and return the token
  return sign(payload, secret, { algorithm: "HS256" });
}