import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const pagesTable = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  heading: text("heading"),
  subheading: text("subheading"),
  body: text("body"),
  heroImageUrl: text("hero_image_url"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
});

export type Page = typeof pagesTable.$inferSelect;
