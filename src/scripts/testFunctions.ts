import { db } from "../db";
import { diagnosticsTable } from "../db/schema/diagnostics-schema";
import { DTCInstancesTable } from "../db/schema/dtc-instances-schema";
import { DTCLibraryTable } from "../db/schema/dtc-library-schema";
import { membersTable } from "../db/schema/members-schema";
import { sensorSnapshotsTable } from "../db/schema/sensor-snapshots-schema";
import { vehiclesTable } from "../db/schema/vehicles-schema";

export async function seedMember() {
  return await db
    .insert(membersTable)
    .values({
      userId: "userIdTest",
      role: "admin" as const,
    })
    .returning();
}

export async function seedVehicle() {
  return await db
    .insert(vehiclesTable)
    .values({
      ownerId: 1,
      vin: "1HGCM82633A004352",
      make: "Honda",
      model: "Civic",
      year: 2016,
      engineType: "1.8L I4",
      fuelType: "petrol",
      transmissionType: "manual",
      drivetrain: "FWD",
      licensePlate: "B123XYZ",
    })
    .returning();
}
export async function seedDiagnostic(vehicleId: number) {
  return await db
    .insert(diagnosticsTable)
    .values({
      vehicleId,
      odometer: 72500,
      locationLat: 44.4268,
      locationLong: 26.1025,
      notes: "Routine check-up",
    })
    .returning();
}

export async function seedDtcLibrary() {
  const codes = [
    {
      code: "P0420",
      description: "Catalyst System Efficiency Below Threshold (Bank 1)",
      severity: "medium" as const,
      affectedSystem: "emissions",
      category: "engine",
    },
    {
      code: "P0300",
      description: "Random/Multiple Cylinder Misfire Detected",
      severity: "high" as const,
      affectedSystem: "ignition",
      category: "engine",
    },
  ];

  return await Promise.all(
    codes.map((code) =>
      db
        .insert(DTCLibraryTable)
        .values({
          ...code,
        })
        .returning(),
    ),
  );
}

export async function seedDtcInstance(
  diagnosticId: number,
  codeRefId: number,
  confirmed = true,
) {
  return await db
    .insert(DTCInstancesTable)
    .values({
      diagnosticId,
      codeRefId,
      confirmed,
    })
    .returning();
}

export async function seedSensorSnapshot(diagnosticId: number) {
  return await db
    .insert(sensorSnapshotsTable)
    .values({
      diagnosticId,
      source: "obd2",
      sensors: {
        rpm: 2200,
        speed: 60,
        engine_temp: 89,
        fuel_level: 40,
      },
    })
    .returning();
}
