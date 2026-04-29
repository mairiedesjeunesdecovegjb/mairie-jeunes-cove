import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const eventsTable = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  location: text("location"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  imageUrl: text("image_url"),
  category: text("category"),
  featured: boolean("featured").notNull().default(false),
});

export type EventRow = typeof eventsTable.$inferSelect;
