import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { rateLimit } from "express-rate-limit";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const PROFILE_PATH = path.join(DATA_DIR, "profile.json");
const MESSAGES_PATH = path.join(DATA_DIR, "messages.json");

const app = express();
const PORT = process.env.PORT || 4000;

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

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: escapeHtml(name.trim()),
    email: email.trim(),
    message: escapeHtml(message.trim()),
    receivedAt: new Date().toISOString(),
  };

  const messages = await readJson(MESSAGES_PATH, []);
  messages.push(entry);
  await writeJson(MESSAGES_PATH, messages);

  res.status(201).json({ success: true, message: "Thanks for reaching out. I'll get back to you soon." });
});

// Simple protected-ish endpoint to view submitted messages (for the site owner).
// In production, put real auth in front of this.
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

app.listen(PORT, () => {
  console.log(`Spondon portfolio API running on http://localhost:${PORT}`);
});
