
import { pgTable, text, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { users } from "../schema";

export const guardrailAuditLog = pgTable("guardrail_audit_log", {
  id: text("id").primaryKey(),
  doctorId: text("doctor_id").notNull().references(() => users.id),
  patientId: text("patient_id").notNull().references(() => users.id),
  field: text("field").notNull(),
  oldValue: text("old_value"),
  newValue: text("new_value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
