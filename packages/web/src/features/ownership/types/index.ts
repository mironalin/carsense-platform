export type Vehicle = {
  make: string;
  model: string;
  year: number;
  vin: string | null;
  licensePlate: string | null;
  engineType: string | null;
  fuelType: string | null;
  transmissionType: string | null;
  drivetrain: string | null;
};

export type TransferRequest = {
  uuid: string;
  toUserEmail: string;
  requestedAt: string;
  expiresAt: string;
  status: string;
  message: string | null;
};

export type TransferHistoryEntry = {
  uuid: string;
  fromUserName: string | null;
  fromUserEmail: string | null;
  toUserName: string;
  transferredAt: string;
};

export type VehicleHistory = {
  transferHistory: TransferHistoryEntry[];
};
