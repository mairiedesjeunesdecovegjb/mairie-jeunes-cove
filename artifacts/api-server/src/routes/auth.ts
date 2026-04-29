import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import {
  AdminLoginBody,
  AdminLoginResponse,
  ChangeAdminPasswordBody,
  GetCurrentAdminResponse,
} from "@workspace/api-zod";
import {
  ensureSeedAdmin,
  findAdminById,
  findAdminByUsername,
  hashPassword,
  verifyPassword,
} from "../lib/auth";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Trop de tentatives. Réessayez plus tard." },
});

router.post("/auth/login", loginLimiter, async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Identifiants invalides" });
    return;
  }
  await ensureSeedAdmin();
  const admin = await findAdminByUsername(parsed.data.username);
  if (!admin) {
    res.status(401).json({ error: "Identifiants invalides" });
    return;
  }
  const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!ok) {
    res.status(401).json({ error: "Identifiants invalides" });
    return;
  }
  req.session.adminId = admin.id;
  req.session.adminUsername = admin.username;
  req.session.save((err) => {
    if (err) {
      req.log.error({ err }, "Session save failed");
      res.status(500).json({ error: "Erreur de session" });
      return;
    }
    res.json(
      AdminLoginResponse.parse({ id: admin.id, username: admin.username }),
    );
  });
});

router.post("/auth/logout", (req, res): void => {
  req.session.destroy((err) => {
    if (err) {
      req.log.error({ err }, "Session destroy failed");
    }
    res.clearCookie("mjc.sid");
    res.sendStatus(204);
  });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  if (!req.session?.adminId) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  const admin = await findAdminById(req.session.adminId);
  if (!admin) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  res.json(
    GetCurrentAdminResponse.parse({ id: admin.id, username: admin.username }),
  );
});

router.post(
  "/auth/change-password",
  requireAuth,
  async (req, res): Promise<void> => {
    const parsed = ChangeAdminPasswordBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const admin = await findAdminById(req.session.adminId!);
    if (!admin) {
      res.status(401).json({ error: "Non authentifié" });
      return;
    }
    const ok = await verifyPassword(
      parsed.data.currentPassword,
      admin.passwordHash,
    );
    if (!ok) {
      res.status(400).json({ error: "Mot de passe actuel incorrect" });
      return;
    }
    const newHash = await hashPassword(parsed.data.newPassword);
    await db
      .update(adminsTable)
      .set({ passwordHash: newHash })
      .where(eq(adminsTable.id, admin.id));
    res.sendStatus(204);
  },
);

export default router;
