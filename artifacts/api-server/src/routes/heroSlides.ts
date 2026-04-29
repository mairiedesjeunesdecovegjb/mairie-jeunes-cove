import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, heroSlidesTable } from "@workspace/db";
import {
  CreateHeroSlideBody,
  ListHeroSlidesResponse,
  UpdateHeroSlideBody,
  UpdateHeroSlideParams,
  UpdateHeroSlideResponse,
  DeleteHeroSlideParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/hero-slides", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(heroSlidesTable)
    .orderBy(asc(heroSlidesTable.sortOrder), asc(heroSlidesTable.id));
  res.json(ListHeroSlidesResponse.parse(nullsToUndefined(rows)));
});

router.post(
  "/hero-slides",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateHeroSlideBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(heroSlidesTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/hero-slides/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateHeroSlideParams.safeParse(req.params);
    const body = UpdateHeroSlideBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [updated] = await db
      .update(heroSlidesTable)
      .set(body.data)
      .where(eq(heroSlidesTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Slide introuvable" });
      return;
    }
    res.json(UpdateHeroSlideResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/hero-slides/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteHeroSlideParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db
      .delete(heroSlidesTable)
      .where(eq(heroSlidesTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
