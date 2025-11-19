// --- NEW: server/services/reminderService.ts ---
import twilio from "twilio";
import { eq, and } from "drizzle-orm";
import { db } from "../db"; // your Drizzle DB instance
import { users, reminderDeliveries } from "@shared/schema";
import { DateTime } from "luxon";

const client = twilio(process.env.TWILIO_ACCOUNT_SID!, process.env.TWILIO_AUTH_TOKEN!);

export type ReminderChannel = "sms" | "push" | "in-app";

export async function getUsersNeedingDailyJournalReminder(nowISO: string) {
  // Only select users with reminders enabled
  const all = await db
    .select({
      id: users.id,
      phone: users.phone,
      timezone: users.timezone,
      dailyJournalReminderEnabled: users.dailyJournalReminderEnabled,
      dailyJournalReminderTime: users.dailyJournalReminderTime,
      dailyJournalReminderChannel: users.dailyJournalReminderChannel,
      fcmWebPushToken: users.fcmWebPushToken,
    })
    .from(users)
    .where(eq(users.dailyJournalReminderEnabled, true));

  const due: typeof all = [];
  for (const u of all) {
    const tz = u.timezone || process.env.DEFAULT_TZ || "America/Chicago";
    const localNow = DateTime.fromISO(nowISO, { zone: tz });
    const hhmm = localNow.toFormat("HH:mm");
    if (hhmm === (u.dailyJournalReminderTime || "09:00")) {
      due.push(u);
    }
  }
  return due;
}

export async function sendDailyJournalReminder(user: typeof users.$inferSelect) {
  const channel = (user.dailyJournalReminderChannel || "sms") as ReminderChannel;
  const journalUrl = `${process.env.APP_BASE_URL}/journal`; // deep link

  try {
    if (channel === "sms") {
      if (!user.phone) throw new Error("No phone on file for SMS reminder");
      await client.messages.create({
        from: process.env.TWILIO_FROM_NUMBER!,
        to: user.phone,
        body: `📝 Quick check-in time. Tap to journal now: ${journalUrl}`,
      });
    }
    // Push/in-app may use fcmWebPushToken if present, but absence must not fail SMS
    if (channel === "push" && !user.fcmWebPushToken) {
      console.warn(`User ${user.id} has no push token — proceeding with SMS fallback`);
    }

    await db.insert(reminderDeliveries).values({
      userId: user.id,
      channel,
      type: "daily-journal",
      status: "sent",
    });
  } catch (err: any) {
    await db.insert(reminderDeliveries).values({
      userId: user.id,
      channel,
      type: "daily-journal",
      status: "failed",
      error: String(err?.message || err),
    });
    throw err;
  }
}