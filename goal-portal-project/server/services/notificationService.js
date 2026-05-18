import Notification from "../models/Notification.js";

export async function notify(user, title, message, type = "info") {
  return Notification.create({ user, title, message, type });
}

export async function sendTeamsNotification(message) {
  if (!process.env.TEAMS_WEBHOOK_URL) return;
  try {
    await fetch(process.env.TEAMS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });
  } catch (error) {
    console.warn("Teams notification failed:", error.message);
  }
}
