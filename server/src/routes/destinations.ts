import { Router } from "express";
import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

const pathwayDetailInclude = {
  requirements: { orderBy: { sortOrder: "asc" } },
  resources: { orderBy: { sortOrder: "asc" } },
  courseRecommendations: {
    orderBy: { sortOrder: "asc" },
    include: {
      course: {
        include: {
          destination: true,
          _count: { select: { enrollments: true } },
        },
      },
    },
  },
} satisfies Prisma.ProcedureTypeInclude;

// ── Public: List active destinations ──────────────────────────────
router.get("/", async (_req, res) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { isActive: true },
      include: {
        procedureTypes: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            nameFr: true,
            slug: true,
            category: true,
            description: true,
            descriptionFr: true,
            officialProgramName: true,
            officialProgramNameFr: true,
            estimatedTimeline: true,
            estimatedTimelineFr: true,
            isFeatured: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    res.json(
      destinations.map(({ procedureTypes, ...destination }) => ({
        ...destination,
        pathwayCount: procedureTypes.length,
        featuredPathways: procedureTypes.slice(0, 3),
      }))
    );
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
        languageCourses: {
          where: { isActive: true },
          orderBy: { startDate: "asc" },
          include: {
            _count: { select: { enrollments: true } },
          },
        },
        procedureTypes: {
          where: { isActive: true },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          include: pathwayDetailInclude,
        },
      },
    });
    if (!destination) {
      res.status(404).json({ error: "Destination not found" });
      return;
    }

    const { procedureTypes, ...destinationData } = destination;
    res.json({
      ...destinationData,
      pathways: procedureTypes,
    });
  } catch (error) {
    console.error("Get destination error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Create destination ─────────────────────────────────────
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, code, flagUrl, description, descriptionFr } = req.body;
    const destination = await prisma.destination.create({
      data: { name, code, flagUrl, description, descriptionFr },
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
