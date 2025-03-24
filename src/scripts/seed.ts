import {
  seedDiagnostic,
  seedDtcInstance,
  seedDtcLibrary,
  seedMember,
  seedSensorSnapshot,
  seedVehicle,
} from "./testFunctions";

async function seedAll() {
  const [member] = await seedMember();
  const [vehicle] = await seedVehicle();
  const [diagnostic] = await seedDiagnostic(vehicle.id);
  const dtcs = await seedDtcLibrary();

  for (const [dtc] of dtcs) {
    await seedDtcInstance(vehicle.id, dtc.id);
  }

  await seedSensorSnapshot(diagnostic.id);

  console.log("✅ Seed completed!");
}

seedAll().catch(console.error);
