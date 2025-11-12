import { Router } from "express";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { users, diabetesProfile, guardrailAuditLog } from "../db/schema";
import { z } from "zod";
import crypto from "crypto";

const r = Router();

function proRole(req: any, res: any, next: any) {
  const role = req.user?.role;
  if (!role || !["doctor", "coach", "trainer"].includes(role)) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

const GuardrailsZ = z.object({
  fastingMin: z.number().int().optional(),
  fastingMax: z.number().int().optional(),
  postMealMax: z.number().int().optional(),
  carbLimit: z.number().int().optional(),
  fiberMin: z.number().int().optional(),
  giCap: z.number().int().optional(),
  mealFrequency: z.number().int().optional(),
  presetId: z.string().nullable().optional(),
}).partial();

function computeInRange(glucose: number | null, gr?: any): boolean | null {
  if (glucose == null) return null;
  const fmin = gr?.fastingMin ?? 80;
  const fmax = gr?.fastingMax ?? 120;
  return glucose >= fmin && glucose <= fmax;
}

r.get("/api/patients", proRole, async (req: any, res) => {
  const doctorId = req.user.id;

  const rows = await db
    .select({
      userId: users.id,
      name: users.name,
      email: users.email,
      guardrails: diabetesProfile.guardrails,
      lastUpdated: diabetesProfile.updatedAt,
    })
    .from(users)
    .leftJoin(diabetesProfile, eq(diabetesProfile.userId, users.id))
    .where(eq(users.role, "user"));

  const results = rows.map((row) => {
    const latestGlucose = null;
    const inRange = computeInRange(latestGlucose, row.guardrails ?? undefined);
    const carbLimit = row.guardrails?.carbLimit ?? null;
    const preset = row.guardrails?.presetId ?? null;

    return {
      id: row.userId,
      name: row.name ?? "Unknown",
      email: row.email ?? "",
      condition: "T2D" as const,
      latestGlucose,
      inRange,
      preset,
      carbLimit,
      lastUpdated: row.lastUpdated ?? null,
    };
  });

  res.json(results);
});

r.get("/api/patients/:id", proRole, async (req: any, res) => {
  const patientId = req.params.id;

  const profile = await db.query.diabetesProfile.findFirst({
    where: eq(diabetesProfile.userId, patientId),
  });

  res.json({
    profile: profile ?? null,
    guardrails: profile?.guardrails ?? null,
    glucose: [],
  });
});

r.put("/api/patients/:id/guardrails", proRole, async (req: any, res) => {
  const doctorId = req.user.id;
  const patientId = req.params.id;

  const parsed = GuardrailsZ.safeParse(req.body?.guardrails ?? {});
  if (!parsed.success) return res.status(400).json(parsed.error.format());

  const newGR = parsed.data;

  const existing = await db.query.diabetesProfile.findFirst({
    where: eq(diabetesProfile.userId, patientId),
  });

  const oldGR = existing?.guardrails ?? null;

  if (!existing) {
    await db.insert(diabetesProfile).values({
      userId: patientId,
      type: "T2D",
      medications: null,
      hypoHistory: false,
      a1cPercent: null,
      guardrails: newGR,
    });
  } else {
    await db
      .update(diabetesProfile)
      .set({ guardrails: newGR })
      .where(eq(diabetesProfile.userId, patientId));
  }

  await db.insert(guardrailAuditLog).values({
    id: crypto.randomUUID(),
    doctorId,
    patientId,
    field: "guardrails",
    oldValue: JSON.stringify(oldGR),
    newValue: JSON.stringify(newGR),
  });

  res.json({ ok: true });
});

r.get("/api/patients/:id/audit", proRole, async (req: any, res) => {
  const patientId = req.params.id;

  const rows = await db
    .select({
      id: guardrailAuditLog.id,
      doctorId: guardrailAuditLog.doctorId,
      patientId: guardrailAuditLog.patientId,
      field: guardrailAuditLog.field,
      oldValue: guardrailAuditLog.oldValue,
      newValue: guardrailAuditLog.newValue,
      updatedAt: guardrailAuditLog.updatedAt,
    })
    .from(guardrailAuditLog)
    .where(eq(guardrailAuditLog.patientId, patientId))
    .orderBy(desc(guardrailAuditLog.updatedAt));

  res.json(rows);
});

export default r;