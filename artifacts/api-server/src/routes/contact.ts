import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { eq, desc } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import {
  SubmitContactBody,
  ListContactMessagesResponse,
  DeleteContactMessageParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop d'envois. Réessayez plus tard." },
});

router.post("/contact", contactLimiter, async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [created] = await db
    .insert(contactMessagesTable)
    .values(parsed.data)
    .returning();
  res.status(201).json(created);
});

router.get(
  "/contact/messages",
  requireAuth,
  async (_req, res): Promise<void> => {
    const rows = await db
      .select()
      .from(contactMessagesTable)
      .orderBy(desc(contactMessagesTable.createdAt));
    res.json(ListContactMessagesResponse.parse(nullsToUndefined(rows)));
  },
);

router.delete(
  "/contact/messages/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteContactMessageParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db
      .delete(contactMessagesTable)
      .where(eq(contactMessagesTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
