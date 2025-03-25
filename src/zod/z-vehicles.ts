import { insertVehicleSchema } from "@/db/schema/vehicles-schema";

export const zVehicleInsertSchema = insertVehicleSchema.omit({
  uuid: true,
  ownerId: true,
  odometerUpdatedAt: true,
  createdAt: true,
  updatedAt: true,
});
