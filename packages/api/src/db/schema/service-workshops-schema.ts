import {
  doublePrecision,
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
  uuid: uuid("uuid").primaryKey().defaultRandom(),
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
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
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
