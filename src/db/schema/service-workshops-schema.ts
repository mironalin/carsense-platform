import {
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export const serviceWorkshopsTable = pgTable("serviceWorkshops", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  uuid: uuid("uuid").defaultRandom(),
  name: text("name").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  servicesOffered: jsonb("servicesOffered"),
  rating: doublePrecision("rating"),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  operatingHours: jsonb("operatingHours"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .$onUpdate(() => new Date())
    .notNull(),
});

export const insertServiceWorkshopSchema = createInsertSchema(
  serviceWorkshopsTable,
);

export const updateServiceWorkshopSchema = createUpdateSchema(
  serviceWorkshopsTable,
);

export const selectServiceWorkshopSchema = createSelectSchema(
  serviceWorkshopsTable,
);
