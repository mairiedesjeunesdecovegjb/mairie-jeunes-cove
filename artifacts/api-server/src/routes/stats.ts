import { Router, type IRouter } from "express";
import { sql, gte, eq } from "drizzle-orm";
import {
  db,
  heroSlidesTable,
  teamMembersTable,
  projectsTable,
  newsTable,
  eventsTable,
  galleryTable,
  partnersTable,
  opportunitiesTable,
  contactMessagesTable,
} from "@workspace/db";
import { GetDashboardSummaryResponse } from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

async function count(table: Parameters<typeof db.select>[0] extends never ? never : any, where?: unknown): Promise<number> {
  const q = db.select({ c: sql<number>`count(*)::int` }).from(table);
  const result = where
    ? await (q as any).where(where)
    : await q;
  return Number(result[0]?.c ?? 0);
}

router.get(
  "/stats/summary",
  requireAuth,
  async (_req, res): Promise<void> => {
    const now = new Date();
    const [
      heroSlidesCount,
      teamCount,
      projectsCount,
      newsCount,
      eventsCount,
      upcomingEventsCount,
      galleryCount,
      partnersCount,
      opportunitiesCount,
      unreadMessagesCount,
      totalMessagesCount,
    ] = await Promise.all([
      count(heroSlidesTable),
      count(teamMembersTable),
      count(projectsTable),
      count(newsTable),
      count(eventsTable),
      count(eventsTable, gte(eventsTable.startsAt, now)),
      count(galleryTable),
      count(partnersTable),
      count(opportunitiesTable),
      count(contactMessagesTable, eq(contactMessagesTable.read, false)),
      count(contactMessagesTable),
    ]);
    res.json(
      GetDashboardSummaryResponse.parse({
        heroSlidesCount,
        teamCount,
        projectsCount,
        newsCount,
        eventsCount,
        upcomingEventsCount,
        galleryCount,
        partnersCount,
        opportunitiesCount,
        unreadMessagesCount,
        totalMessagesCount,
      }),
    );
  },
);

export default router;
