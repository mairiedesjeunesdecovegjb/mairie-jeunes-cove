import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, opportunitiesTable } from "@workspace/db";
import {
  CreateOpportunityBody,
  ListOpportunitiesResponse,
  UpdateOpportunityBody,
  UpdateOpportunityParams,
  UpdateOpportunityResponse,
  DeleteOpportunityParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/opportunities", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(opportunitiesTable)
    .orderBy(desc(opportunitiesTable.createdAt));
  res.json(ListOpportunitiesResponse.parse(nullsToUndefined(rows)));
});

router.post(
  "/opportunities",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateOpportunityBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(opportunitiesTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/opportunities/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateOpportunityParams.safeParse(req.params);
    const body = UpdateOpportunityBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [updated] = await db
      .update(opportunitiesTable)
      .set(body.data)
      .where(eq(opportunitiesTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Opportunité introuvable" });
      return;
    }
    res.json(UpdateOpportunityResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/opportunities/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteOpportunityParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db
      .delete(opportunitiesTable)
      .where(eq(opportunitiesTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
