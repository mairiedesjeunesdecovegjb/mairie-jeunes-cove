import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const settingsTable = pgTable("settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Mairie des Jeunes de Covè"),
  tagline: text("tagline")
    .notNull()
    .default("Jeunesse engagée pour Covè"),
  logoUrl: text("logo_url"),
  faviconUrl: text("favicon_url"),
  primaryColor: text("primary_color").notNull().default("#EA580C"),
  secondaryColor: text("secondary_color").notNull().default("#1E3A8A"),
  accentColor: text("accent_color").notNull().default("#F5C518"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactAddress: text("contact_address"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  linkedinUrl: text("linkedin_url"),
  youtubeUrl: text("youtube_url"),
  tiktokUrl: text("tiktok_url"),
  whatsappNumber: text("whatsapp_number"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  seoKeywords: text("seo_keywords"),
  ogImageUrl: text("og_image_url"),
  statYouthCount: integer("stat_youth_count").notNull().default(500),
  statActivitiesCount: integer("stat_activities_count").notNull().default(20),
  statProjectsCount: integer("stat_projects_count").notNull().default(10),
  statPartnersCount: integer("stat_partners_count").notNull().default(8),
  statYouthLabel: text("stat_youth_label").notNull().default("Jeunes mobilisés"),
  statActivitiesLabel: text("stat_activities_label")
    .notNull()
    .default("Activités menées"),
  statProjectsLabel: text("stat_projects_label").notNull().default("Projets"),
  statPartnersLabel: text("stat_partners_label").notNull().default("Partenaires"),
  mayorName: text("mayor_name"),
  mayorTitle: text("mayor_title").default("Maire des Jeunes de Covè"),
  mayorMessage: text("mayor_message"),
  mayorPhotoUrl: text("mayor_photo_url"),
  footerText: text("footer_text")
    .notNull()
    .default(
      "© 2026 Mairie des Jeunes de Covè - Tous droits réservés, Conçu par Builvision Group",
    ),
  designerName: text("designer_name").notNull().default("Builvision Group"),
  designerUrl: text("designer_url").notNull().default("https://builvision.com"),
});

export type Settings = typeof settingsTable.$inferSelect;
