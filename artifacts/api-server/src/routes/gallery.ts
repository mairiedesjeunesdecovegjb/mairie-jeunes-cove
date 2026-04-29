import { Router, type IRouter } from "express";
import { eq, asc, desc } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import {
  CreateGalleryPhotoBody,
  ListGalleryResponse,
  UpdateGalleryPhotoBody,
  UpdateGalleryPhotoParams,
  UpdateGalleryPhotoResponse,
  DeleteGalleryPhotoParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/gallery", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(galleryTable)
    .orderBy(asc(galleryTable.sortOrder), desc(galleryTable.createdAt));
  res.json(ListGalleryResponse.parse(nullsToUndefined(rows)));
});

router.post(
  "/gallery",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateGalleryPhotoBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(galleryTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/gallery/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateGalleryPhotoParams.safeParse(req.params);
    const body = UpdateGalleryPhotoBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [updated] = await db
      .update(galleryTable)
      .set(body.data)
      .where(eq(galleryTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Photo introuvable" });
      return;
    }
    res.json(UpdateGalleryPhotoResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/gallery/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteGalleryPhotoParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db.delete(galleryTable).where(eq(galleryTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
