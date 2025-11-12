import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";

export const guardrailAuditLog = pgTable("guardrail_audit_log", {
  id: text("id").primaryKey(),
  doctorId: text("doctor_id").notNull(),
  patientId: text("patient_id").notNull(),
  field: text("field").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});