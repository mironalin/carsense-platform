import { motion } from "framer-motion";
import { Settings } from "lucide-react";

import { ErrorPage } from "@/components/error-page";
import { LoaderPage } from "@/components/loader-page";
import { useSession } from "@/lib/auth-client";
import type { UserProfile } from "../../types";
import { pageVariants, staggerContainer } from "../../utils/animation-variants";
import { generateProfileStats } from "../../utils/profile-utils";
import { ProfileForm } from "../forms/profile-form";
import { ProfileStats } from "../stats/profile-stats";

export function AccountPage() {
  const { data: session, isPending, error } = useSession();

  if (isPending) {
    return <LoaderPage />;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (!session?.user) {
    return <ErrorPage />;
  }

  // Convert session user to UserProfile
  const userProfile: UserProfile = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerified: session.user.emailVerified,
    image: session.user.image || null,
    role: (session.user as any).role || "user",
    createdAt: session.user.createdAt.toISOString(),
    updatedAt: session.user.updatedAt.toISOString(),
  };

  const profileStats = generateProfileStats(userProfile);

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto max-w-4xl p-6 space-y-8"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="flex items-center justify-center gap-2 text-3xl font-bold">
          <Settings className="h-8 w-8 text-primary" />
          Account Settings
        </div>
        <p className="text-muted-foreground">
          Manage your profile information and account preferences
        </p>
      </motion.div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 gap-8 lg:grid-cols-2"
      >
        {/* Profile Form */}
        <div className="lg:order-1 h-full">
          <ProfileForm
            profile={userProfile}
            onSuccess={() => {
              // Optionally refresh the page or show additional feedback
            }}
          />
        </div>

        {/* Profile Stats */}
        <div className="lg:order-2 h-full">
          <ProfileStats stats={profileStats} />
        </div>
      </motion.div>
    </motion.div>
  );
} 