import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category"),
  description: text("description"),
  body: text("body"),
  imageUrl: text("image_url"),
  extraImages: text("extra_images"),
  status: text("status").notNull().default("planned"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  location: text("location"),
  budget: text("budget"),
  progress: integer("progress").default(0),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Project = typeof projectsTable.$inferSelect;
