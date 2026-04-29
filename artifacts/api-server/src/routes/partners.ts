import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, partnersTable } from "@workspace/db";
import {
  CreatePartnerBody,
  ListPartnersResponse,
  UpdatePartnerBody,
  UpdatePartnerParams,
  UpdatePartnerResponse,
  DeletePartnerParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/partners", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(partnersTable)
    .orderBy(asc(partnersTable.sortOrder), asc(partnersTable.id));
  res.json(ListPartnersResponse.parse(nullsToUndefined(rows)));
});

router.post(
  "/partners",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreatePartnerBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(partnersTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/partners/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdatePartnerParams.safeParse(req.params);
    const body = UpdatePartnerBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [updated] = await db
      .update(partnersTable)
      .set(body.data)
      .where(eq(partnersTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Partenaire introuvable" });
      return;
    }
    res.json(UpdatePartnerResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/partners/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeletePartnerParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db.delete(partnersTable).where(eq(partnersTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
