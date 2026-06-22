import { Router } from "express";
import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

const statusLabels = {
  en: {
    pending: "pending",
    documents_review: "documents review",
    in_progress: "in progress",
    approved: "approved",
    rejected: "rejected",
    completed: "completed",
  },
  fr: {
    pending: "en attente",
    documents_review: "documents en revue",
    in_progress: "en cours",
    approved: "approuve",
    rejected: "refuse",
    completed: "termine",
  },
} as const;

function formatAmount(amount: number, locale: "en-US" | "fr-FR") {
  return new Intl.NumberFormat(locale).format(amount);
}

function buildPathwayOpenedNotification(pathwayName: string, pathwayNameFr: string | null | undefined, destinationName: string) {
  return {
    title: "Pathway Opened",
    titleFr: "Parcours ouvert",
    message: `Your ${pathwayName} file for ${destinationName} has been opened.`,
    messageFr: `Votre dossier ${pathwayNameFr || pathwayName} pour ${destinationName} a ete ouvert.`,
  };
}

function buildStatusUpdateContent(
  status: keyof typeof statusLabels.en,
  pathwayName: string,
  pathwayNameFr: string | null | undefined,
  customMessage?: string,
) {
  return {
    title: `Status: ${statusLabels.en[status].toUpperCase()}`,
    titleFr: `Statut : ${statusLabels.fr[status].toUpperCase()}`,
    message: customMessage || `Your ${pathwayName} status has been updated to: ${statusLabels.en[status]}.`,
    messageFr: customMessage || `Le statut de votre dossier ${pathwayNameFr || pathwayName} a ete mis a jour : ${statusLabels.fr[status]}.`,
  };
}

function buildPaymentContent(
  amount: number,
  currency: string,
  pathwayName: string,
  pathwayNameFr: string | null | undefined,
  note?: string,
) {
  const amountEn = formatAmount(amount, "en-US");
  const amountFr = formatAmount(amount, "fr-FR");

  return {
    updateTitle: "Payment Recorded",
    updateTitleFr: "Paiement enregistre",
    updateMessage: `Offline payment of ${amountEn} ${currency} recorded${note ? `: ${note}` : "."}`,
    updateMessageFr: `Paiement hors ligne de ${amountFr} ${currency} enregistre${note ? ` : ${note}` : "."}`,
    notificationTitle: "Payment Recorded",
    notificationTitleFr: "Paiement enregistre",
    notificationMessage: note
      ? `An offline payment of ${amountEn} ${currency} has been recorded for your ${pathwayName} application. Note: ${note}`
      : `An offline payment of ${amountEn} ${currency} has been recorded for your ${pathwayName} application.`,
    notificationMessageFr: note
      ? `Un paiement hors ligne de ${amountFr} ${currency} a ete enregistre pour votre dossier ${pathwayNameFr || pathwayName}. Note : ${note}`
      : `Un paiement hors ligne de ${amountFr} ${currency} a ete enregistre pour votre dossier ${pathwayNameFr || pathwayName}.`,
  };
}

function buildDocumentContent(
  fileType: string,
  name: string,
  pathwayName: string,
  pathwayNameFr: string | null | undefined,
) {
  return {
    updateTitle: "Document Shared",
    updateTitleFr: "Document partage",
    updateMessage: `A new ${fileType} has been added to your ${pathwayName} procedure: ${name}`,
    updateMessageFr: `Un nouveau ${fileType} a ete ajoute a votre dossier ${pathwayNameFr || pathwayName} : ${name}`,
    notificationTitle: "New Document Shared",
    notificationTitleFr: "Nouveau document partage",
    notificationMessage: `A new ${fileType} has been added to your ${pathwayName} procedure: ${name}`,
    notificationMessageFr: `Un nouveau ${fileType} a ete ajoute a votre dossier ${pathwayNameFr || pathwayName} : ${name}`,
  };
}

const pathwayDetailInclude = {
  destination: true,
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

// ── Public: List procedure types ──────────────────────────────────
router.get("/types", async (req, res) => {
  try {
    const destinationId = typeof req.query.destinationId === "string" ? req.query.destinationId : undefined;

    const where: Record<string, string | boolean> = { isActive: true };
    if (destinationId) {
      where.destinationId = destinationId;
    }

    const types = await prisma.procedureType.findMany({
      where,
      include: pathwayDetailInclude,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
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
        procedureType: { include: pathwayDetailInclude },
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

    if (!procedureType.isActive) {
      res.status(400).json({ error: "This pathway is not currently available" });
      return;
    }

    if (procedureType.destinationId && procedureType.destinationId !== destinationId) {
      res.status(400).json({ error: "Selected pathway does not belong to that destination" });
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
        procedureType: { include: pathwayDetailInclude },
        destination: true,
        updates: { orderBy: { createdAt: "desc" } },
        payments: { orderBy: { paidAt: "desc" } },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: req.user!.userId,
        ...buildPathwayOpenedNotification(
          procedure.procedureType.name,
          procedure.procedureType.nameFr,
          procedure.destination.name,
        ),
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
        procedureType: { include: pathwayDetailInclude },
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
          procedureType: { include: pathwayDetailInclude },
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

    if (!(status in statusLabels.en)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }

    const procedure = await prisma.procedure.update({
      where: { id: procedureId },
      data: { status },
      include: { procedureType: true, destination: true },
    });

    // Add update entry
    if (message) {
      const statusCopy = buildStatusUpdateContent(
        status as keyof typeof statusLabels.en,
        procedure.procedureType.name,
        procedure.procedureType.nameFr,
        message,
      );

      await prisma.procedureUpdate.create({
        data: {
          procedureId: procedure.id,
          title: statusCopy.title,
          titleFr: statusCopy.titleFr,
          message: statusCopy.message,
          messageFr: statusCopy.messageFr,
        },
      });
    }

    // Notify customer
    const statusNotification = buildStatusUpdateContent(
      status as keyof typeof statusLabels.en,
      procedure.procedureType.name,
      procedure.procedureType.nameFr,
      message,
    );

    await prisma.notification.create({
      data: {
        userId: procedure.userId,
        title: "Procedure Update",
        titleFr: "Mise a jour du dossier",
        message: statusNotification.message,
        messageFr: statusNotification.messageFr,
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

    const paymentCopy = buildPaymentContent(
      amount,
      procedure.currency,
      procedure.procedureType.name,
      procedure.procedureType.nameFr,
      note,
    );

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
          title: paymentCopy.updateTitle,
          titleFr: paymentCopy.updateTitleFr,
          message: paymentCopy.updateMessage,
          messageFr: paymentCopy.updateMessageFr,
        },
      });

      await tx.notification.create({
        data: {
          userId: procedure.userId,
          title: paymentCopy.notificationTitle,
          titleFr: paymentCopy.notificationTitleFr,
          message: paymentCopy.notificationMessage,
          messageFr: paymentCopy.notificationMessageFr,
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
      const documentCopy = buildDocumentContent(
        fileType,
        name,
        procedure.procedureType.name,
        procedure.procedureType.nameFr,
      );

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
          title: documentCopy.updateTitle,
          titleFr: documentCopy.updateTitleFr,
          message: documentCopy.updateMessage,
          messageFr: documentCopy.updateMessageFr,
        },
      });

      await tx.notification.create({
        data: {
          userId: procedure.userId,
          title: documentCopy.notificationTitle,
          titleFr: documentCopy.notificationTitleFr,
          message: documentCopy.notificationMessage,
          messageFr: documentCopy.notificationMessageFr,
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
