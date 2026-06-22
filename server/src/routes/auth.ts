import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate } from "../middleware/auth.js";
import type { AuthPayload } from "../middleware/auth.js";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "dev-refresh-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
const ACCESS_TOKEN_OPTIONS: SignOptions = { expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"] };
const REFRESH_TOKEN_OPTIONS: SignOptions = { expiresIn: JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"] };
const PROFILE_DOCUMENT_CATEGORIES = new Set(["cv", "identity", "education", "finance", "travel", "general"]);

function generateTokens(payload: AuthPayload) {
  const accessToken = jwt.sign(payload, JWT_SECRET, ACCESS_TOKEN_OPTIONS);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, REFRESH_TOKEN_OPTIONS);
  return { accessToken, refreshToken };
}

function isValidUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// ── Register ──────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "Email, password, firstName, and lastName are required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, passwordHash, firstName, lastName, phone },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true },
    });

    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    const tokens = generateTokens(payload);

    // Store refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.status(201).json({ user, ...tokens });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Login ─────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const payload: AuthPayload = { userId: user.id, email: user.email, role: user.role };
    const tokens = generateTokens(payload);

    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    res.json({ user: safeUser, ...tokens });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Refresh Token ─────────────────────────────────────────────────
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ error: "Refresh token required" });
      return;
    }

    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.expiresAt < new Date()) {
      res.status(401).json({ error: "Invalid or expired refresh token" });
      return;
    }

    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as AuthPayload;
    const payload: AuthPayload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
    const tokens = generateTokens(payload);

    // Rotate refresh token
    await prisma.refreshToken.deleteMany({ where: { id: stored.id } });
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: decoded.userId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    res.json(tokens);
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({ error: "Invalid refresh token" });
  }
});

// ── Logout ────────────────────────────────────────────────────────
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Get current user ──────────────────────────────────────────────
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, avatarUrl: true, createdAt: true, updatedAt: true,
      },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/me/profile-documents", authenticate, async (req, res) => {
  try {
    const documents = await prisma.profileDocument.findMany({
      where: { userId: req.user!.userId },
      orderBy: { uploadedAt: "desc" },
    });

    res.json(documents);
  } catch (error) {
    console.error("Get profile documents error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/me/profile-documents", authenticate, async (req, res) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const fileUrl = typeof req.body.fileUrl === "string" ? req.body.fileUrl.trim() : "";
    const category = typeof req.body.category === "string" ? req.body.category.trim().toLowerCase() : "general";
    const fileType = typeof req.body.fileType === "string" && req.body.fileType.trim() ? req.body.fileType.trim() : "resource";
    const notes = typeof req.body.notes === "string" && req.body.notes.trim() ? req.body.notes.trim() : undefined;

    if (!name) {
      res.status(400).json({ error: "Document name is required" });
      return;
    }

    if (!fileUrl || !isValidUrl(fileUrl)) {
      res.status(400).json({ error: "A valid document URL is required" });
      return;
    }

    if (!PROFILE_DOCUMENT_CATEGORIES.has(category)) {
      res.status(400).json({ error: "Invalid document category" });
      return;
    }

    const document = await prisma.profileDocument.create({
      data: {
        userId: req.user!.userId,
        name,
        category,
        fileUrl,
        fileType,
        notes,
      },
    });

    res.status(201).json(document);
  } catch (error) {
    console.error("Create profile document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/me/profile-documents/:id", authenticate, async (req, res) => {
  try {
    const documentId = getRouteParam(req.params.id);
    if (!documentId) {
      res.status(400).json({ error: "Document id is required" });
      return;
    }

    const existing = await prisma.profileDocument.findFirst({
      where: {
        id: documentId,
        userId: req.user!.userId,
      },
    });

    if (!existing) {
      res.status(404).json({ error: "Document not found" });
      return;
    }

    await prisma.profileDocument.delete({ where: { id: documentId } });
    res.json({ message: "Document deleted" });
  } catch (error) {
    console.error("Delete profile document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/me", authenticate, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    if (!firstName || !lastName) {
      res.status(400).json({ error: "First name and last name are required" });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: {
        firstName,
        lastName,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current password and new password are required" });
      return;
    }

    if (String(newPassword).length < 6) {
      res.status(400).json({ error: "New password must be at least 6 characters" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
