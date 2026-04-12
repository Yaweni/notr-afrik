import { Router } from "express";
import prisma from "../lib/prisma.js";
import { getRouteParam } from "../lib/routeParams.js";
import { authenticate, requireRole } from "../middleware/auth.js";

const router = Router();

const getReceiptNumber = (paymentId: string, paidAt: Date) => `RCPT-${paidAt.toISOString().slice(0, 10).replace(/-/g, "")}-${paymentId.slice(-6).toUpperCase()}`;

async function getFinanceSnapshot() {
  const procedures = await prisma.procedure.findMany({
    include: {
      payments: { orderBy: { paidAt: "desc" } },
      user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      procedureType: true,
      destination: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const procedureBalances = procedures.map((procedure) => {
    const totalPaid = procedure.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingBalance = Math.max(procedure.agreedPrice - totalPaid, 0);
    return {
      procedureId: procedure.id,
      createdAt: procedure.createdAt.toISOString(),
      status: procedure.status,
      agreedPrice: procedure.agreedPrice,
      currency: procedure.currency,
      totalPaid,
      remainingBalance,
      lastPaymentAt: procedure.payments[0]?.paidAt.toISOString(),
      procedureTypeName: procedure.procedureType.name,
      destinationName: procedure.destination.name,
      client: procedure.user,
    };
  });

  const payments = procedures
    .flatMap((procedure) =>
      procedure.payments.map((payment) => ({
        id: payment.id,
        receiptNumber: getReceiptNumber(payment.id, payment.paidAt),
        amount: payment.amount,
        currency: payment.currency,
        note: payment.note,
        paidAt: payment.paidAt.toISOString(),
        createdAt: payment.createdAt.toISOString(),
        procedureId: procedure.id,
        procedureStatus: procedure.status,
        procedureTypeName: procedure.procedureType.name,
        destinationName: procedure.destination.name,
        client: procedure.user,
      }))
    )
    .sort((left, right) => new Date(right.paidAt).getTime() - new Date(left.paidAt).getTime());

  const clientMap = procedureBalances.reduce((acc, procedure) => {
      const existing = acc.get(procedure.client.id) ?? {
        userId: procedure.client.id,
        firstName: procedure.client.firstName,
        lastName: procedure.client.lastName,
        email: procedure.client.email,
        phone: procedure.client.phone,
        procedureCount: 0,
        totalContractValue: 0,
        totalPaid: 0,
        totalOutstanding: 0,
        currency: procedure.currency,
        lastPaymentAt: undefined as string | undefined,
      };

      existing.procedureCount += 1;
      existing.totalContractValue += procedure.agreedPrice;
      existing.totalPaid += procedure.totalPaid;
      existing.totalOutstanding += procedure.remainingBalance;
      if (procedure.lastPaymentAt && (!existing.lastPaymentAt || procedure.lastPaymentAt > existing.lastPaymentAt)) {
        existing.lastPaymentAt = procedure.lastPaymentAt;
      }

      acc.set(procedure.client.id, existing);
      return acc;
    }, new Map<string, {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      procedureCount: number;
      totalContractValue: number;
      totalPaid: number;
      totalOutstanding: number;
      currency: string;
      lastPaymentAt?: string;
    }>());

  const clients = Array.from(clientMap.values()).sort((left, right) => right.totalOutstanding - left.totalOutstanding);

  const overview = {
    totalContractValue: procedureBalances.reduce((sum, procedure) => sum + procedure.agreedPrice, 0),
    totalCollected: payments.reduce((sum, payment) => sum + payment.amount, 0),
    totalOutstanding: procedureBalances.reduce((sum, procedure) => sum + procedure.remainingBalance, 0),
    paymentCount: payments.length,
    procedureCount: procedureBalances.length,
    customersWithBalance: clients.filter((client) => client.totalOutstanding > 0).length,
  };

  return {
    overview,
    clients,
    payments,
    procedures: procedureBalances.sort((left, right) => right.remainingBalance - left.remainingBalance),
  };
}

function escapeCsv(value: string | number | null | undefined) {
  const raw = String(value ?? "");
  if (/[",\n]/.test(raw)) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

// ── Public: Get site content ──────────────────────────────────────
router.get("/content", async (_req, res) => {
  try {
    const content = await prisma.siteContent.findMany();
    const map: Record<string, string> = {};
    content.forEach((c) => (map[c.key] = c.value));
    res.json(map);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public: Get testimonials ──────────────────────────────────────
router.get("/testimonials", async (_req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Public: Get success stories ───────────────────────────────────
router.get("/success-stories", async (_req, res) => {
  try {
    const stories = await prisma.successStory.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/finance", authenticate, requireRole("admin", "staff"), async (_req, res) => {
  try {
    const snapshot = await getFinanceSnapshot();
    res.json(snapshot);
  } catch (error) {
    console.error("Get finance snapshot error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/finance/export", authenticate, requireRole("admin", "staff"), async (_req, res) => {
  try {
    const snapshot = await getFinanceSnapshot();
    const header = [
      "receiptNumber",
      "paidAt",
      "amount",
      "currency",
      "clientName",
      "clientEmail",
      "clientPhone",
      "procedureId",
      "procedureType",
      "destination",
      "procedureStatus",
      "note",
    ];

    const rows = snapshot.payments.map((payment) => [
      payment.receiptNumber,
      payment.paidAt,
      payment.amount,
      payment.currency,
      `${payment.client.firstName} ${payment.client.lastName}`,
      payment.client.email,
      payment.client.phone,
      payment.procedureId,
      payment.procedureTypeName,
      payment.destinationName,
      payment.procedureStatus,
      payment.note,
    ]);

    const csv = [header, ...rows].map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\n");

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="finance-export-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(csv);
  } catch (error) {
    console.error("Export finance snapshot error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Update site content ────────────────────────────────────
router.put("/content/:key", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const key = getRouteParam(req.params.key);
    if (!key) {
      res.status(400).json({ error: "Content key is required" });
      return;
    }

    const { value } = req.body;
    const content = await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Manage testimonials ────────────────────────────────────
router.post("/testimonials", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const testimonial = await prisma.testimonial.create({ data: req.body });
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/testimonials/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const testimonialId = getRouteParam(req.params.id);
    if (!testimonialId) {
      res.status(400).json({ error: "Testimonial id is required" });
      return;
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
      data: req.body,
    });
    res.json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/testimonials/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const testimonialId = getRouteParam(req.params.id);
    if (!testimonialId) {
      res.status(400).json({ error: "Testimonial id is required" });
      return;
    }

    await prisma.testimonial.delete({ where: { id: testimonialId } });
    res.json({ message: "Testimonial deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Manage success stories ─────────────────────────────────
router.post("/success-stories", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const story = await prisma.successStory.create({ data: req.body });
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/success-stories/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const storyId = getRouteParam(req.params.id);
    if (!storyId) {
      res.status(400).json({ error: "Success story id is required" });
      return;
    }

    const story = await prisma.successStory.update({
      where: { id: storyId },
      data: req.body,
    });
    res.json(story);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: Dashboard stats ────────────────────────────────────────
router.get("/stats", authenticate, requireRole("admin", "staff"), async (_req, res) => {
  try {
    const [
      totalUsers,
      totalProcedures,
      pendingProcedures,
      recentProcedures,
    ] = await Promise.all([
      prisma.user.count({ where: { role: "customer" } }),
      prisma.procedure.count(),
      prisma.procedure.count({ where: { status: { in: ["pending", "documents_review", "in_progress"] } } }),
      prisma.procedure.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { firstName: true, lastName: true } },
          procedureType: true,
          destination: true,
        },
      }),
    ]);

    res.json({
      totalUsers,
      totalProcedures,
      pendingProcedures,
      recentProcedures,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Admin: All users ──────────────────────────────────────────────
router.get("/users", authenticate, requireRole("admin"), async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, role: true, createdAt: true,
        _count: { select: { procedures: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
