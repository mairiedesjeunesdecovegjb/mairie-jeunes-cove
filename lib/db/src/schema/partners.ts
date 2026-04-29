import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const partnersTable = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Partner = typeof partnersTable.$inferSelect;
