export type TransferRequest = {
  uuid: string;
  toUserEmail: string;
  requestedAt: string;
  expiresAt: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "expired";
};

export type RegisterVehiclePageProps = {
  className?: string;
};
