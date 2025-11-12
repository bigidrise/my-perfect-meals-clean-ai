
import { Router } from "express";
import { z } from "zod";
import { db } from "@db";
import { users, diabetesProfile, glucoseLogs, guardrailAuditLog } from "@db/schema";
import { eq, desc, and } from "drizzle-orm";

const router = Router();

// Authorization middleware for healthcare professionals
const requireHealthcarePro = (req: any, res: any, next: any) => {
  if (!req.user || !['doctor', 'coach', 'trainer'].includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied. Healthcare professional role required." });
  }
  next();
};

router.use(requireHealthcarePro);

// GET /api/patients - Get all patients with summary data
router.get("/", async (req, res) => {
  try {
    const doctorId = req.user.id;

    // Get all patients assigned to this doctor
    const patients = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.assignedDoctorId, doctorId));

    // Fetch diabetes profiles and latest glucose for each patient
    const enrichedPatients = await Promise.all(
      patients.map(async (patient) => {
        const [profile] = await db
          .select()
          .from(diabetesProfile)
          .where(eq(diabetesProfile.userId, patient.id))
          .limit(1);

        const [latestGlucose] = await db
          .select()
          .from(glucoseLogs)
          .where(eq(glucoseLogs.userId, patient.id))
          .orderBy(desc(glucoseLogs.recordedAt))
          .limit(1);

        const guardrails = profile?.guardrails as any || null;
        const glucoseValue = latestGlucose?.valueMgdl || null;

        // Determine condition based on profile type
        let condition = "T2D";
        if (profile?.type === "TYPE_1") condition = "T1D";
        if (guardrails?.presetId === "cardiac") condition = "CARDIAC";
        if (guardrails?.presetId === "glp1") condition = "GLP1";

        // Determine if in range
        let inRange = false;
        if (glucoseValue && guardrails) {
          const { fastingMin = 80, postMealMax = 180 } = guardrails;
          inRange = glucoseValue >= fastingMin && glucoseValue <= postMealMax;
        }

        return {
          id: patient.id,
          name: patient.name || "Unknown",
          email: patient.email,
          condition,
          currentPreset: guardrails?.presetId || "custom",
          latestGlucose: glucoseValue,
          lastUpdated: latestGlucose?.recordedAt || profile?.updatedAt,
          guardrails: guardrails || {
            fastingMin: 80,
            fastingMax: 130,
            postMealMax: 180,
            carbLimit: 150,
          },
          inRange,
        };
      })
    );

    res.json(enrichedPatients);
  } catch (error) {
    console.error("Error fetching patients:", error);
    res.status(500).json({ error: "Failed to fetch patients" });
  }
});

// GET /api/patients/:id - Get full patient details
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    // Verify patient is assigned to this doctor
    const [patient] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.assignedDoctorId, doctorId)))
      .limit(1);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found or not assigned to you" });
    }

    const [profile] = await db
      .select()
      .from(diabetesProfile)
      .where(eq(diabetesProfile.userId, id))
      .limit(1);

    const recentGlucose = await db
      .select()
      .from(glucoseLogs)
      .where(eq(glucoseLogs.userId, id))
      .orderBy(desc(glucoseLogs.recordedAt))
      .limit(10);

    res.json({
      id: patient.id,
      name: patient.name,
      email: patient.email,
      profile: profile || null,
      recentGlucose,
    });
  } catch (error) {
    console.error("Error fetching patient details:", error);
    res.status(500).json({ error: "Failed to fetch patient details" });
  }
});

// PUT /api/patients/:id/guardrails - Update patient guardrails
const guardrailSchema = z.object({
  fastingMin: z.number(),
  fastingMax: z.number(),
  postMealMax: z.number(),
  carbLimit: z.number(),
  fiberMin: z.number().optional(),
  giCap: z.number().optional(),
  mealFrequency: z.number().optional(),
  presetId: z.string().optional(),
});

router.put("/:id/guardrails", async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    // Verify patient is assigned to this doctor
    const [patient] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.assignedDoctorId, doctorId)))
      .limit(1);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found or not assigned to you" });
    }

    const guardrails = guardrailSchema.parse(req.body);

    // Get current profile to log changes
    const [currentProfile] = await db
      .select()
      .from(diabetesProfile)
      .where(eq(diabetesProfile.userId, id))
      .limit(1);

    const oldGuardrails = (currentProfile?.guardrails as any) || {};

    // Update the profile
    await db
      .insert(diabetesProfile)
      .values({
        userId: id,
        type: currentProfile?.type || "TYPE_2",
        hypoHistory: currentProfile?.hypoHistory || false,
        guardrails,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: diabetesProfile.userId,
        set: {
          guardrails,
          updatedAt: new Date(),
        },
      });

    // Log each changed field
    const auditEntries = [];
    for (const [field, newValue] of Object.entries(guardrails)) {
      const oldValue = oldGuardrails[field];
      if (oldValue !== newValue) {
        auditEntries.push({
          id: `audit-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          doctorId,
          patientId: id,
          field,
          oldValue: oldValue?.toString() || null,
          newValue: newValue?.toString() || "",
          updatedAt: new Date(),
        });
      }
    }

    if (auditEntries.length > 0) {
      await db.insert(guardrailAuditLog).values(auditEntries);
    }

    res.json({ success: true, guardrails });
  } catch (error) {
    console.error("Error updating guardrails:", error);
    res.status(500).json({ error: "Failed to update guardrails" });
  }
});

// GET /api/patients/:id/audit - Get audit trail
router.get("/:id/audit", async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    // Verify patient is assigned to this doctor
    const [patient] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), eq(users.assignedDoctorId, doctorId)))
      .limit(1);

    if (!patient) {
      return res.status(404).json({ error: "Patient not found or not assigned to you" });
    }

    const audit = await db
      .select({
        id: guardrailAuditLog.id,
        field: guardrailAuditLog.field,
        oldValue: guardrailAuditLog.oldValue,
        newValue: guardrailAuditLog.newValue,
        updatedAt: guardrailAuditLog.updatedAt,
        doctorName: users.name,
      })
      .from(guardrailAuditLog)
      .leftJoin(users, eq(guardrailAuditLog.doctorId, users.id))
      .where(eq(guardrailAuditLog.patientId, id))
      .orderBy(desc(guardrailAuditLog.updatedAt));

    res.json(audit);
  } catch (error) {
    console.error("Error fetching audit trail:", error);
    res.status(500).json({ error: "Failed to fetch audit trail" });
  }
});

export default router;
