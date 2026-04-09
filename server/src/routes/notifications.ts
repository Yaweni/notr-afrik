import { Router } from "express";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

// ── Get my notifications ──────────────────────────────────────────
router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Get unread count ──────────────────────────────────────────────
router.get("/unread-count", authenticate, async (req, res) => {
  try {
    const count = await prisma.notification.count({
      where: { userId: req.user!.userId, isRead: false },
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Mark as read ──────────────────────────────────────────────────
router.patch("/:id/read", authenticate, async (req, res) => {
  try {
    const notificationId = getRouteParam(req.params.id);
    if (!notificationId) {
      res.status(400).json({ error: "Notification id is required" });
      return;
    }

    const notification = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Mark all as read ──────────────────────────────────────────────
router.patch("/read-all", authenticate, async (req, res) => {
  try {
    await prisma.notification.updateMany({
      where: { userId: req.user!.userId, isRead: false },
      data: { isRead: true },
    });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
