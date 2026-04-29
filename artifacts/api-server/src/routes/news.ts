import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, newsTable } from "@workspace/db";
import {
  CreateNewsBody,
  ListNewsResponse,
  GetNewsParams,
  GetNewsResponse,
  UpdateNewsBody,
  UpdateNewsParams,
  UpdateNewsResponse,
  DeleteNewsParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

router.get("/news", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(newsTable)
    .orderBy(desc(newsTable.createdAt));
  res.json(ListNewsResponse.parse(nullsToUndefined(rows)));
});

router.get("/news/:id", async (req, res): Promise<void> => {
  const params = GetNewsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }
  const [row] = await db
    .select()
    .from(newsTable)
    .where(eq(newsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Article introuvable" });
    return;
  }
  res.json(GetNewsResponse.parse(nullsToUndefined(row)));
});

router.post(
  "/news",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateNewsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const slug = parsed.data.slug || slugify(parsed.data.title);
    const [created] = await db
      .insert(newsTable)
      .values({
        ...parsed.data,
        slug: `${slug}-${Date.now().toString(36)}`,
        publishedAt: parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : new Date(),
      })
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/news/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateNewsParams.safeParse(req.params);
    const body = UpdateNewsBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const updates: Record<string, unknown> = { ...body.data };
    if (body.data.publishedAt) {
      updates.publishedAt = new Date(body.data.publishedAt);
    }
    const [updated] = await db
      .update(newsTable)
      .set(updates)
      .where(eq(newsTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Article introuvable" });
      return;
    }
    res.json(UpdateNewsResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/news/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteNewsParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db.delete(newsTable).where(eq(newsTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
