import { Router } from "express";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// ── Public: List active destinations ──────────────────────────────
router.get("/", async (_req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json(destinations);
  } catch (error) {
    console.error("Get destinations error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public: Get single destination ────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const destinationId = getRouteParam(req.params.id);
    if (!destinationId) {
      res.status(400).json({ error: "Destination id is required" });
      return;
    }

    const destination = await prisma.destination.findUnique({
      where: { id: destinationId },
      include: {
        languageCourses: { where: { isActive: true }, orderBy: { startDate: "asc" } },
      },
    });
    if (!destination) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }
    res.json(destination);
  } catch (error) {
    console.error("Get destination error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Create destination ─────────────────────────────────────
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, code, flagUrl, description } = req.body;
    const destination = await prisma.destination.create({
      data: { name, code, flagUrl, description },
    });
    res.status(201).json(destination);
  } catch (error) {
    console.error("Create destination error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Update destination ─────────────────────────────────────
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const destinationId = getRouteParam(req.params.id);
    if (!destinationId) {
      res.status(400).json({ error: "Destination id is required" });
      return;
    }

    const destination = await prisma.destination.update({
      where: { id: destinationId },
      data: req.body,
    });
    res.json(destination);
  } catch (error) {
    console.error("Update destination error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
