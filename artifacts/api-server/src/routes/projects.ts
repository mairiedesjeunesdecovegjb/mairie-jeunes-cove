import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import {
  CreateProjectBody,
  ListProjectsResponse,
  GetProjectParams,
  GetProjectResponse,
  UpdateProjectBody,
  UpdateProjectParams,
  UpdateProjectResponse,
  DeleteProjectParams,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/requireAuth";
import { nullsToUndefined } from "../lib/serialize";

const router: IRouter = Router();

router.get("/projects", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.featured), desc(projectsTable.createdAt));
  res.json(ListProjectsResponse.parse(nullsToUndefined(rows)));
});

router.get("/projects/:id", async (req, res): Promise<void> => {
  const params = GetProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }
  const [row] = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Projet introuvable" });
    return;
  }
  res.json(GetProjectResponse.parse(nullsToUndefined(row)));
});

router.post(
  "/projects",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = CreateProjectBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [created] = await db
      .insert(projectsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json(created);
  },
);

router.patch(
  "/projects/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = UpdateProjectParams.safeParse(req.params);
    const body = UpdateProjectBody.safeParse(req.body);
    if (!params.success || !body.success) {
      res.status(400).json({ error: "Données invalides" });
      return;
    }
    const [updated] = await db
      .update(projectsTable)
      .set(body.data)
      .where(eq(projectsTable.id, params.data.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Projet introuvable" });
      return;
    }
    res.json(UpdateProjectResponse.parse(nullsToUndefined(updated)));
  },
);

router.delete(
  "/projects/:id",
  requireAuth,
  async (req, res): Promise<void> => {
    const params = DeleteProjectParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: "ID invalide" });
      return;
    }
    await db.delete(projectsTable).where(eq(projectsTable.id, params.data.id));
    res.sendStatus(204);
  },
);

export default router;
