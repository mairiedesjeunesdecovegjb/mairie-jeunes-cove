import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

export const teamMembersTable = pgTable("team_members", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  bio: text("bio"),
  photoUrl: text("photo_url"),
  email: text("email"),
  phone: text("phone"),
  facebookUrl: text("facebook_url"),
  linkedinUrl: text("linkedin_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type TeamMember = typeof teamMembersTable.$inferSelect;
