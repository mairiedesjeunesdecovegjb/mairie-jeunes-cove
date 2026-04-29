import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const opportunitiesTable = pgTable("opportunities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category"),
  description: text("description"),
  body: text("body"),
  imageUrl: text("image_url"),
  deadline: text("deadline"),
  applyUrl: text("apply_url"),
  location: text("location"),
  organization: text("organization"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Opportunity = typeof opportunitiesTable.$inferSelect;
