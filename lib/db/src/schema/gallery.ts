import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const galleryTable = pgTable("gallery", {
  id: serial("id").primaryKey(),
  title: text("title"),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GalleryItem = typeof galleryTable.$inferSelect;
