import { Router, type IRouter } from "express";
import {
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
} from "@workspace/api-zod";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

async function getOrCreateSettings() {
  const [row] = await db.select().from(settingsTable).limit(1);
  if (row) return row;
  const [created] = await db.insert(settingsTable).values({}).returning();
  return created;
}

function toResponse<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v == null ? undefined : v;
  }
  return out as T;
}

router.get("/settings", async (_req, res): Promise<void> => {
  const row = await getOrCreateSettings();
  res.json(GetSettingsResponse.parse(toResponse(row)));
});

router.patch(
  "/settings",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = UpdateSettingsBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const current = await getOrCreateSettings();
    const [updated] = await db
      .update(settingsTable)
      .set(parsed.data)
      .where(eq(settingsTable.id, current.id))
      .returning();
    res.json(UpdateSettingsResponse.parse(toResponse(updated)));
  },
);

export default router;
