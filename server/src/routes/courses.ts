import { Router } from "express";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// ── Public: List courses ──────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const { destination, language, level } = req.query;

    const where: any = { isActive: true };
    if (destination) where.destinationId = destination;
    if (language) where.language = language;
    if (level) where.level = level;

    const courses = await prisma.languageCourse.findMany({
      where,
      include: {
        destination: true,
        _count: { select: { enrollments: true } },
      },
      orderBy: { startDate: "asc" },
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public: Get single course ─────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const courseId = getRouteParam(req.params.id);
    if (!courseId) {
      res.status(400).json({ error: "Course id is required" });
      return;
    }

    const course = await prisma.languageCourse.findUnique({
      where: { id: courseId },
      include: {
        destination: true,
        _count: { select: { enrollments: true } },
      },
    });
    if (!course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Customer: Enroll in course ────────────────────────────────────
router.post("/:id/enroll", authenticate, async (req, res) => {
  try {
    const courseId = getRouteParam(req.params.id);
    const userId = req.user!.userId;

    if (!courseId) {
      res.status(400).json({ error: "Course id is required" });
      return;
    }

    const course = await prisma.languageCourse.findUnique({
      where: { id: courseId },
      include: { _count: { select: { enrollments: true } }, destination: true },
    });

    if (!course || !course.isActive) {
      res.status(404).json({ error: "Course not found or inactive" });
      return;
    }

    if (course._count.enrollments >= course.maxStudents) {
      res.status(400).json({ error: "Course is full" });
      return;
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (existing) {
      res.status(409).json({ error: "Already enrolled in this course" });
      return;
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
      include: { course: { include: { destination: true } } },
    });

    await prisma.notification.create({
      data: {
        userId,
        title: "Course Enrollment",
        message: `You've been enrolled in "${course.title}" (${course.language} ${course.level}).`,
        type: "course",
      },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error("Enroll error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Customer: My enrollments ──────────────────────────────────────
router.get("/enrollments/mine", authenticate, async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: req.user!.userId },
      include: {
        course: { include: { destination: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Create course ──────────────────────────────────────────
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const course = await prisma.languageCourse.create({
      data: req.body,
      include: { destination: true },
    });
    res.status(201).json(course);
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Update course ──────────────────────────────────────────
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const courseId = getRouteParam(req.params.id);
    if (!courseId) {
      res.status(400).json({ error: "Course id is required" });
      return;
    }

    const course = await prisma.languageCourse.update({
      where: { id: courseId },
      data: req.body,
      include: { destination: true },
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: All enrollments ────────────────────────────────────────
router.get("/enrollments/all", authenticate, requireRole("admin", "staff"), async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        course: { include: { destination: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
