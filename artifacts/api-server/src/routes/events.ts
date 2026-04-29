import { Router, type IRouter } from "express";
import { eq, asc, gte } from "drizzle-orm";
import { db, eventsTable } from "@workspace/db";
import {
  CreateEventBody,
  ListEventsResponse,
  ListUpcomingEventsResponse,
  UpdateEventBody,
  UpdateEventParams,
  UpdateEventResponse,
  DeleteEventParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/events", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(eventsTable)
    .orderBy(asc(eventsTable.startsAt));
  res.json(ListEventsResponse.parse(nullsToUndefined(rows)));
});

router.get("/events/upcoming", async (_req, res): Promise<void> => {
  const now = new Date();
  const rows = await db
    .select()
    .from(eventsTable)
    .where(gte(eventsTable.startsAt, now))
    .orderBy(asc(eventsTable.startsAt));
  res.json(ListUpcomingEventsResponse.parse(nullsToUndefined(rows)));
});

router.post(
  "/events",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateEventBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(eventsTable)
      .values({
        ...parsed.data,
        startsAt: new Date(parsed.data.startsAt),
        endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : undefined,
      })
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/events/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateEventParams.safeParse(req.params);
    const body = UpdateEventBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const updates: Record<string, unknown> = { ...body.data };
    if (body.data.startsAt) updates.startsAt = new Date(body.data.startsAt);
    if (body.data.endsAt) updates.endsAt = new Date(body.data.endsAt);
    const [updated] = await db
      .update(eventsTable)
      .set(updates)
      .where(eq(eventsTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Événement introuvable" });
      return;
    }
    res.json(UpdateEventResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/events/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteEventParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db.delete(eventsTable).where(eq(eventsTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
