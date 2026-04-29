import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, pagesTable } from "@workspace/db";
import {
  GetPageParams,
  GetPageResponse,
  ListPagesResponse,
  UpdatePageBody,
  UpdatePageParams,
  UpdatePageResponse,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/pages", async (_req, res): Promise<void> => {
  const rows = await db.select().from(pagesTable);
  res.json(ListPagesResponse.parse(nullsToUndefined(rows)));
});

router.get("/pages/:slug", async (req, res): Promise<void> => {
  const params = GetPageParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Slug invalide" });
    return;
  }
  const [row] = await db
    .select()
    .from(pagesTable)
    .where(eq(pagesTable.slug, params.data.slug));
  if (!row) {
    res.status(404).json({ error: "Page introuvable" });
    return;
  }
  res.json(GetPageResponse.parse(nullsToUndefined(row)));
});

router.patch(
  "/pages/:slug",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdatePageParams.safeParse(req.params);
    const body = UpdatePageBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [existing] = await db
      .select()
      .from(pagesTable)
      .where(eq(pagesTable.slug, params.data.slug));
    let updated;
    if (!existing) {
      [updated] = await db
        .insert(pagesTable)
        .values({
          slug: params.data.slug,
          title: body.data.title ?? params.data.slug,
          ...body.data,
        })
        .returning();
    } else {
      [updated] = await db
        .update(pagesTable)
        .set(body.data)
        .where(eq(pagesTable.slug, params.data.slug))
        .returning();
    }
    res.json(UpdatePageResponse.parse(nullsToUndefined(updated)));
  },
);

export default router;
