import { pgTable, serial, text, integer, boolean } from "drizzle-orm/pg-core";

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  ctaLabel: text("cta_label"),
  ctaUrl: text("cta_url"),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export type HeroSlide = typeof heroSlidesTable.$inferSelect;
