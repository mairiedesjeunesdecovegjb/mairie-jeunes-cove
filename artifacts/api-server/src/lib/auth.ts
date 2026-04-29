import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, adminsTable } from "@workspace/db";

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(
  plain: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function findAdminByUsername(username: string) {
  const [row] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username));
  return row;
}

export async function findAdminById(id: number) {
  const [row] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, id));
  return row;
}

export async function ensureSeedAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const existing = await findAdminByUsername(username);
  if (existing) return;
  const password =
    process.env.ADMIN_INITIAL_PASSWORD ?? "MairieJeunesCove2026!";
  const passwordHash = await hashPassword(password);
  await db.insert(adminsTable).values({ username, passwordHash });
}
