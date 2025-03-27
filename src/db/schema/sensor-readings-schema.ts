import { doublePrecision, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { sensorSnapshotsTable } from "./sensor-snapshots-schema";

export const sensorReadingsTable = pgTable("sensorReadings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  sensorSnapshotsId: integer("sensorSnapshotsId").references(() => sensorSnapshotsTable.id, {
    onDelete: "cascade",
  }),
  pid: text("pid").notNull(), // eg: "rpm", "temp", "fuel", "speed"
  value: doublePrecision("value").notNull(),
  unit: text("unit").notNull(), // eg: "RPM", "°C", "%", "km/h"
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});
