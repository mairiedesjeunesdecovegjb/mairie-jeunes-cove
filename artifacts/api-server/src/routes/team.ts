import { Router, type IRouter } from "express";
import { eq, asc } from "drizzle-orm";
import { db, teamMembersTable } from "@workspace/db";
import {
  CreateTeamMemberBody,
  ListTeamResponse,
  UpdateTeamMemberBody,
  UpdateTeamMemberParams,
  UpdateTeamMemberResponse,
  DeleteTeamMemberParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/team", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(teamMembersTable)
    .orderBy(asc(teamMembersTable.sortOrder), asc(teamMembersTable.id));
  res.json(ListTeamResponse.parse(nullsToUndefined(rows)));
});

router.post(
  "/team",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateTeamMemberBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(teamMembersTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/team/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateTeamMemberParams.safeParse(req.params);
    const body = UpdateTeamMemberBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [updated] = await db
      .update(teamMembersTable)
      .set(body.data)
      .where(eq(teamMembersTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Introuvable" });
      return;
    }
    res.json(UpdateTeamMemberResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/team/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteTeamMemberParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db
      .delete(teamMembersTable)
      .where(eq(teamMembersTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
