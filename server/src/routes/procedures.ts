import { Router } from "express";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

// ── Public: List procedure types ──────────────────────────────────
router.get("/types", async (_req, res) => {
  try {
    const types = await prisma.procedureType.findMany({ orderBy: { name: "asc" } });
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Customer: Get my procedures ───────────────────────────────────
router.get("/mine", authenticate, async (req, res) => {
  try {
    const procedures = await prisma.procedure.findMany({
      where: { userId: req.user!.userId },
      include: {
        procedureType: true,
        destination: true,
        updates: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { paidAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(procedures);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Customer: Create a procedure ──────────────────────────────────
router.post("/", authenticate, async (req, res) => {
  try {
    const { procedureTypeId, destinationId, notes } = req.body;

    if (!procedureTypeId || !destinationId) {
      res.status(400).json({ error: "procedureTypeId and destinationId are required" });
      return;
    }

    const [procedureType, destination] = await Promise.all([
      prisma.procedureType.findUnique({ where: { id: procedureTypeId } }),
      prisma.destination.findUnique({ where: { id: destinationId } }),
    ]);

    if (!procedureType || !destination) {
      res.status(404).json({ error: "Procedure type or destination not found" });
      return;
    }

    const procedure = await prisma.procedure.create({
      data: {
        userId: req.user!.userId,
        procedureTypeId,
        destinationId,
        agreedPrice: procedureType.price,
        currency: procedureType.currency,
        notes,
      },
      include: {
        procedureType: true,
        destination: true,
        updates: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { paidAt: "desc" } },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user!.userId,
        title: "Procedure Created",
        message: `Your ${procedure.procedureType.name} application for ${procedure.destination.name} has been submitted.`,
        type: "procedure",
      },
    });

    res.status(201).json(procedure);
  } catch (error) {
    console.error("Create procedure error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Get single procedure ──────────────────────────────────────────
router.get("/:id", authenticate, async (req, res) => {
  try {
    const procedureId = getRouteParam(req.params.id);
    if (!procedureId) {
      res.status(400).json({ error: "Procedure id is required" });
      return;
    }

    const procedure = await prisma.procedure.findUnique({
      where: { id: procedureId },
      include: {
        procedureType: true,
        destination: true,
        updates: { orderBy: { createdAt: "desc" } },
        documents: { orderBy: { uploadedAt: "desc" } },
        payments: { orderBy: { paidAt: "desc" } },
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      },
    });

    if (!procedure) {
      res.status(404).json({ error: "Procedure not found" });
      return;
    }

    // Customers can only see their own
    if (req.user!.role === "customer" && procedure.userId !== req.user!.userId) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    res.json(procedure);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Get all procedures ─────────────────────────────────────
router.get("/", authenticate, requireRole("admin", "staff"), async (req, res) => {
  try {
    const { status, destination, page = "1", limit = "20" } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (destination) where.destinationId = destination;

    const [procedures, total] = await Promise.all([
      prisma.procedure.findMany({
        where,
        include: {
          procedureType: true,
          destination: true,
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          payments: { orderBy: { paidAt: "desc" } },
        },
        orderBy: { createdAt: "desc" },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      prisma.procedure.count({ where }),
    ]);

    res.json({ procedures, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Update procedure status ────────────────────────────────
router.patch("/:id/status", authenticate, requireRole("admin", "staff"), async (req, res) => {
  try {
    const procedureId = getRouteParam(req.params.id);
    if (!procedureId) {
      res.status(400).json({ error: "Procedure id is required" });
      return;
    }

    const { status, message } = req.body;
    if (!status) {
      res.status(400).json({ error: "Status is required" });
      return;
    }

    const procedure = await prisma.procedure.update({
      where: { id: procedureId },
      data: { status },
      include: { procedureType: true, destination: true },
    });

    // Add update entry
    if (message) {
      await prisma.procedureUpdate.create({
        data: {
          procedureId: procedure.id,
          title: `Status: ${status.replace(/_/g, " ").toUpperCase()}`,
          message,
        },
      });
    }

    // Notify customer
    await prisma.notification.create({
      data: {
        userId: procedure.userId,
        title: "Procedure Update",
        message: message || `Your ${procedure.procedureType.name} status has been updated to: ${status.replace(/_/g, " ")}`,
        type: "procedure",
      },
    });

    res.json(procedure);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/payments", authenticate, requireRole("admin", "staff"), async (req, res) => {
  try {
    const procedureId = getRouteParam(req.params.id);
    if (!procedureId) {
      res.status(400).json({ error: "Procedure id is required" });
      return;
    }

    const amount = Number(req.body.amount);
    const note = typeof req.body.note === "string" && req.body.note.trim() ? req.body.note.trim() : undefined;
    const paidAt = req.body.paidAt ? new Date(req.body.paidAt) : new Date();

    if (!Number.isFinite(amount) || amount <= 0) {
      res.status(400).json({ error: "A valid payment amount is required" });
      return;
    }

    if (Number.isNaN(paidAt.getTime())) {
      res.status(400).json({ error: "A valid payment date is required" });
      return;
    }

    const procedure = await prisma.procedure.findUnique({
      where: { id: procedureId },
      include: { procedureType: true },
    });

    if (!procedure) {
      res.status(404).json({ error: "Procedure not found" });
      return;
    }

    const paymentMessage = note
      ? `An offline payment of ${amount.toLocaleString()} ${procedure.currency} has been recorded for your ${procedure.procedureType.name} application. Note: ${note}`
      : `An offline payment of ${amount.toLocaleString()} ${procedure.currency} has been recorded for your ${procedure.procedureType.name} application.`;

    const payment = await prisma.$transaction(async (tx) => {
      const createdPayment = await tx.payment.create({
        data: {
          procedureId: procedure.id,
          amount,
          currency: procedure.currency,
          note,
          paidAt,
        },
      });

      await tx.procedureUpdate.create({
        data: {
          procedureId: procedure.id,
          title: "Payment Recorded",
          message: `Offline payment of ${amount.toLocaleString()} ${procedure.currency} recorded${note ? `: ${note}` : "."}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: procedure.userId,
          title: "Payment Recorded",
          message: paymentMessage,
          type: "success",
        },
      });

      return createdPayment;
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error("Add payment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/documents", authenticate, requireRole("admin", "staff"), async (req, res) => {
  try {
    const procedureId = getRouteParam(req.params.id);
    if (!procedureId) {
      res.status(400).json({ error: "Procedure id is required" });
      return;
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const fileUrl = typeof req.body.fileUrl === "string" ? req.body.fileUrl.trim() : "";
    const fileType = typeof req.body.fileType === "string" && req.body.fileType.trim() ? req.body.fileType.trim() : "resource";

    if (!name) {
      res.status(400).json({ error: "Document name is required" });
      return;
    }

    if (!fileUrl) {
      res.status(400).json({ error: "Document URL is required" });
      return;
    }

    const procedure = await prisma.procedure.findUnique({
      where: { id: procedureId },
      include: { procedureType: true },
    });

    if (!procedure) {
      res.status(404).json({ error: "Procedure not found" });
      return;
    }

    const document = await prisma.$transaction(async (tx) => {
      const createdDocument = await tx.document.create({
        data: {
          procedureId: procedure.id,
          name,
          fileUrl,
          fileType,
        },
      });

      await tx.procedureUpdate.create({
        data: {
          procedureId: procedure.id,
          title: "Document Shared",
          message: `A new ${fileType} has been added to your ${procedure.procedureType.name} procedure: ${name}`,
        },
      });

      await tx.notification.create({
        data: {
          userId: procedure.userId,
          title: "New Document Shared",
          message: `A new ${fileType} has been added to your ${procedure.procedureType.name} procedure: ${name}`,
          type: "procedure",
        },
      });

      return createdDocument;
    });

    res.status(201).json(document);
  } catch (error) {
    console.error("Add document error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
