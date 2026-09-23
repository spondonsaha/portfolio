import express from "express";
import cors from "cors";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimit } from "express-rate-limit";
import { Resend } from "resend";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load local .env files (server/.env then repo-root .env). Does not override
// variables already set in the environment (shell or Vercel dashboard).
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Locate the data dir across environments:
// - local dev (run from server/): <server>/data
// - Vercel serverless (bundled into api/index.js, cwd = /var/task): /var/task/server/data
function resolveDataDir() {
  const candidates = [
    path.join(__dirname, "data"),
    path.join(process.cwd(), "server", "data"),
    path.join(process.cwd(), "data"),
  ];
  for (const dir of candidates) {
    if (existsSync(path.join(dir, "profile.json"))) return dir;
  }
  return candidates[0];
}

export const DATA_DIR = process.env.DATA_DIR || resolveDataDir();
const PROFILE_PATH = path.join(DATA_DIR, "profile.json");
const MESSAGES_PATH = path.join(DATA_DIR, "messages.json");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Basic rate limiting to keep the contact endpoint from being spammed
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many messages sent. Please try again later." },
});

async function readJson(filePath, fallback) {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Elegant, email-client-safe HTML template that matches the site's look:
// light editorial card, teal accents, serif heading, Inter body.
export function buildContactEmailHtml(entry) {
  const initial = escapeHtml((entry.name || "?").trim().charAt(0).toUpperCase());
  const receivedAt = new Date(entry.receivedAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return `
    <div style="background-color:#f0efeb; padding:36px 16px;">
      <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
        New message from ${entry.name} — ${entry.message.slice(0, 80)}…
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px; max-width:100%; background:#ffffff; border:1px solid #e6e4de; border-radius:16px; overflow:hidden;">
              <tr>
                <td style="background:#0d8f79; height:6px; line-height:6px; font-size:0;">&nbsp;</td>
              </tr>
              <tr>
                <td style="padding:36px 40px 4px;">
                  <p style="margin:0 0 12px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; color:#a39f93; text-transform:uppercase;">Spondon Saha &middot; Portfolio</p>
                  <h1 style="margin:0; font-family:Georgia, 'Times New Roman', serif; font-weight:600; font-size:30px; line-height:1.2; color:#1a1a1c;">A new message has arrived</h1>
                  <p style="margin:10px 0 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:15px; line-height:1.6; color:#726f67;">Someone filled out the contact form on your site. Replying to this email reaches them directly.</p>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 0;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="52" style="width:52px; height:52px; background:#0d8f79; border-radius:50%;">
                          <tr>
                            <td align="center" style="font-family:Georgia, 'Times New Roman', serif; font-size:24px; font-weight:600; color:#ffffff; line-height:52px;">${initial}</td>
                          </tr>
                        </table>
                      </td>
                      <td style="padding-left:16px; vertical-align:middle;">
                        <p style="margin:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-weight:600; font-size:18px; color:#1a1a1c;">${entry.name}</p>
                        <p style="margin:2px 0 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:14px; color:#0d8f79;">${escapeHtml(entry.email)}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 40px 0; height:1px; line-height:1px; font-size:0;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                    <tr><td style="border-top:1px solid #efede8;">&nbsp;</td></tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 0;">
                  <p style="margin:0 0 10px; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; color:#a39f93; text-transform:uppercase;">Message</p>
                  <div style="border-left:3px solid #0d8f79; background:#f7f6f2; border-radius:0 10px 10px 0; padding:20px 22px; font-family:Georgia, 'Times New Roman', serif; font-size:16px; line-height:1.7; color:#3b3a37; white-space:pre-wrap;">${entry.message}</div>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 40px 34px;">
                  <p style="margin:0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; color:#8b887d;">Received on ${receivedAt}</p>
                  <p style="margin:4px 0 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:12px; color:#a39f93;">Click <strong>Reply</strong> to write back.</p>
                </td>
              </tr>
            </table>
            <p style="margin:18px 0 0; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size:11px; color:#b0aca0;">Sent automatically from iamspondon.vercel.app &middot; contact form</p>
          </td>
        </tr>
      </table>
    </div>
  `;
}

// ---- Routes ----

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.get("/api/profile", async (req, res) => {
  const profile = await readJson(PROFILE_PATH, null);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  res.json(profile);
});

app.get("/api/experience", async (req, res) => {
  const profile = await readJson(PROFILE_PATH, null);
  res.json(profile?.experience || []);
});

app.get("/api/certifications", async (req, res) => {
  const profile = await readJson(PROFILE_PATH, null);
  res.json(profile?.certifications || []);
});

app.get("/api/projects", async (req, res) => {
  const profile = await readJson(PROFILE_PATH, null);
  res.json(profile?.projects || []);
});

app.get("/api/projects/:slug", async (req, res) => {
  const profile = await readJson(PROFILE_PATH, null);
  const project = (profile?.projects || []).find((p) => p.slug === req.params.slug);
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

app.get("/api/awards", async (req, res) => {
  const profile = await readJson(PROFILE_PATH, null);
  res.json(profile?.awards || []);
});

app.post("/api/contact", contactLimiter, async (req, res) => {
  const { name, email, message, honeypot } = req.body || {};

  // Honeypot field - real users never fill this in
  if (honeypot) {
    return res.status(200).json({ success: true });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }
  if (typeof name !== "string" || name.trim().length < 2 || name.length > 100) {
    return res.status(400).json({ error: "Please enter a valid name." });
  }
  if (!isValidEmail(email) || email.length > 200) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }
  if (typeof message !== "string" || message.trim().length < 10 || message.length > 5000) {
    return res.status(400).json({ error: "Message must be between 10 and 5000 characters." });
  }

  const safeEmail = email.trim();
  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: escapeHtml(name.trim()),
    email: safeEmail,
    message: escapeHtml(message.trim()),
    receivedAt: new Date().toISOString(),
  };

  // Preferred path (production): deliver the message by email via Resend.
  if (process.env.RESEND_API_KEY) {
    const to = process.env.RESEND_TO;
    if (!to) {
      return res.status(500).json({ error: "Server email is not configured (RESEND_TO missing)." });
    }
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const from = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from,
        to,
        replyTo: safeEmail,
        subject: `New contact form message from ${entry.name}`,
        text: [
          `Name: ${entry.name}`,
          `Email: ${entry.email}`,
          "",
          entry.message,
        ].join("\n"),
        html: buildContactEmailHtml(entry),
      });
      if (result && result.error) throw new Error(result.error.message || "Resend rejected the email");
      return res.status(201).json({ success: true, message: "Thanks for reaching out. I'll get back to you soon." });
    } catch (err) {
      console.error("Resend error:", err);
      return res.status(500).json({ error: "Could not send your message. Please try again." });
    }
  }

  // Fallback path (local development): append to messages.json.
  try {
    const messages = await readJson(MESSAGES_PATH, []);
    messages.push(entry);
    await writeJson(MESSAGES_PATH, messages);
  } catch (err) {
    console.error("Could not store message:", err);
    return res.status(500).json({ error: "Could not save your message. Please try again." });
  }

  res.status(201).json({ success: true, message: "Thanks for reaching out. I'll get back to you soon." });
});

// Simple protected-ish endpoint to view submitted messages (for the site owner).
// On Vercel messages are delivered by email, so this only shows locally-stored ones.
app.get("/api/messages", async (req, res) => {
  const token = req.headers["x-admin-token"];
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized. Set ADMIN_TOKEN env var and pass it as X-Admin-Token header." });
  }
  const messages = await readJson(MESSAGES_PATH, []);
  res.json(messages);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;