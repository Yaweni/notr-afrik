/// <reference types="node" />

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Admin user ──────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@immigration-cm.com" },
    update: {},
    create: {
      email: "admin@immigration-cm.com",
      passwordHash: adminPassword,
      firstName: "Admin",
      lastName: "Immigration",
      phone: "+237 6XX XXX XXX",
      role: "admin",
    },
  });

  // ── Demo customer ───────────────────────────────────────────────
  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.upsert({
    where: { email: "jean@example.com" },
    update: {},
    create: {
      email: "jean@example.com",
      passwordHash: customerPassword,
      firstName: "Jean",
      lastName: "Nkoulou",
      phone: "+237 677 123 456",
      role: "customer",
    },
  });

  // ── Destinations ────────────────────────────────────────────────
  const destinations = await Promise.all([
    prisma.destination.upsert({
      where: { code: "CA" },
      update: {},
      create: { name: "Canada", code: "CA", description: "Land of opportunities with excellent immigration programs including Express Entry and Provincial Nominee Programs." },
    }),
    prisma.destination.upsert({
      where: { code: "DE" },
      update: {},
      create: { name: "Germany", code: "DE", description: "Europe's economic powerhouse with strong demand for skilled workers and world-class education." },
    }),
    prisma.destination.upsert({
      where: { code: "FR" },
      update: {},
      create: { name: "France", code: "FR", description: "Rich culture, excellent universities, and diverse career opportunities in the heart of Europe." },
    }),
    prisma.destination.upsert({
      where: { code: "US" },
      update: {},
      create: { name: "United States", code: "US", description: "The land of dreams with diverse visa categories for students, workers, and families." },
    }),
    prisma.destination.upsert({
      where: { code: "GB" },
      update: {},
      create: { name: "United Kingdom", code: "GB", description: "World-renowned education system and thriving job market with clear immigration pathways." },
    }),
    prisma.destination.upsert({
      where: { code: "BE" },
      update: {},
      create: { name: "Belgium", code: "BE", description: "Heart of Europe with multicultural environment and strong ties to Cameroon." },
    }),
  ]);

  // ── Procedure Types ─────────────────────────────────────────────
  const procedureTypes = await Promise.all([
    prisma.procedureType.create({
      data: { name: "Student Visa", description: "Complete assistance for student visa applications including university admission support.", price: 150000 },
    }),
    prisma.procedureType.create({
      data: { name: "Work Permit", description: "Professional work permit processing with employer matching assistance.", price: 250000 },
    }),
    prisma.procedureType.create({
      data: { name: "Tourist Visa", description: "Short-stay tourist visa processing for leisure and business travel.", price: 75000 },
    }),
    prisma.procedureType.create({
      data: { name: "Family Reunification", description: "Reunite with family members abroad through proper legal channels.", price: 200000 },
    }),
    prisma.procedureType.create({
      data: { name: "Permanent Residency", description: "Long-term settlement and permanent residency application support.", price: 350000 },
    }),
  ]);

  // ── Language Courses ────────────────────────────────────────────
  const [canada, germany, france, usa, uk] = destinations;

  await Promise.all([
    prisma.languageCourse.create({
      data: {
        destinationId: canada.id, language: "English", level: "B1", title: "English Intermediate for Canada",
        description: "Build conversational fluency and prepare for IELTS.", schedule: "Mon-Wed-Fri 9:00-11:00",
        price: 50000, maxStudents: 25, startDate: new Date("2026-04-01"), endDate: new Date("2026-06-30"),
      },
    }),
    prisma.languageCourse.create({
      data: {
        destinationId: canada.id, language: "French", level: "B2", title: "French Advanced for Quebec",
        description: "Advanced French for Quebec immigration (TEF preparation).", schedule: "Tue-Thu 14:00-16:00",
        price: 55000, maxStudents: 20, startDate: new Date("2026-04-15"), endDate: new Date("2026-07-15"),
      },
    }),
    prisma.languageCourse.create({
      data: {
        destinationId: germany.id, language: "German", level: "A1", title: "German Beginner",
        description: "Start your German language journey from scratch. Ideal for Goethe-Zertifikat A1.", schedule: "Mon-Wed-Fri 14:00-16:00",
        price: 45000, maxStudents: 30, startDate: new Date("2026-04-01"), endDate: new Date("2026-06-30"),
      },
    }),
    prisma.languageCourse.create({
      data: {
        destinationId: germany.id, language: "German", level: "B1", title: "German Intermediate",
        description: "Intermediate German for work and study in Germany.", schedule: "Tue-Thu-Sat 9:00-11:00",
        price: 55000, maxStudents: 25, startDate: new Date("2026-05-01"), endDate: new Date("2026-08-01"),
      },
    }),
    prisma.languageCourse.create({
      data: {
        destinationId: france.id, language: "French", level: "B1", title: "French for France Immigration",
        description: "Strengthen your French for living and working in France.", schedule: "Mon-Wed 10:00-12:00",
        price: 40000, maxStudents: 25, startDate: new Date("2026-04-01"), endDate: new Date("2026-06-15"),
      },
    }),
    prisma.languageCourse.create({
      data: {
        destinationId: usa.id, language: "English", level: "B2", title: "Advanced English for USA",
        description: "TOEFL preparation and advanced conversational English.", schedule: "Mon-Wed-Fri 16:00-18:00",
        price: 60000, maxStudents: 20, startDate: new Date("2026-04-01"), endDate: new Date("2026-07-01"),
      },
    }),
    prisma.languageCourse.create({
      data: {
        destinationId: uk.id, language: "English", level: "A2", title: "English Elementary for UK",
        description: "Build foundational English skills for UK immigration.", schedule: "Tue-Thu 9:00-11:00",
        price: 35000, maxStudents: 30, startDate: new Date("2026-04-15"), endDate: new Date("2026-06-30"),
      },
    }),
  ]);

  // ── Site Content ────────────────────────────────────────────────
  await Promise.all([
    prisma.siteContent.upsert({
      where: { key: "hero_title" },
      update: {},
      create: { key: "hero_title", value: "Your Journey Abroad Starts Here" },
    }),
    prisma.siteContent.upsert({
      where: { key: "hero_subtitle" },
      update: {},
      create: { key: "hero_subtitle", value: "Cameroon's trusted immigration partner — guiding you to your dream destination with expert visa processing and language training." },
    }),
    prisma.siteContent.upsert({
      where: { key: "mission_statement" },
      update: {},
      create: { key: "mission_statement", value: "We are committed to making international mobility accessible to every Cameroonian. Through professional guidance, transparent processes, and quality language education, we transform travel dreams into reality." },
    }),
    prisma.siteContent.upsert({
      where: { key: "about_text" },
      update: {},
      create: { key: "about_text", value: "Founded in Douala, our immigration office has helped thousands of Cameroonians successfully relocate, study, and work abroad. With partnerships across Europe and North America, we provide end-to-end immigration solutions backed by years of expertise." },
    }),
  ]);

  // ── Testimonials ────────────────────────────────────────────────
  await Promise.all([
    prisma.testimonial.create({
      data: { name: "Marie Tchatchoua", country: "Canada", message: "Thanks to this office, I got my Canadian student visa in record time. The team guided me through every step!", isActive: true },
    }),
    prisma.testimonial.create({
      data: { name: "Paul Enanga", country: "Germany", message: "The German language course prepared me perfectly for my relocation. I passed my Goethe-Zertifikat B1 on the first try!", isActive: true },
    }),
    prisma.testimonial.create({
      data: { name: "Aissatou Bello", country: "France", message: "Professional, reliable, and caring. They treated my family reunification case with so much attention. We are now together in Lyon!", isActive: true },
    }),
    prisma.testimonial.create({
      data: { name: "Emmanuel Fouda", country: "United Kingdom", message: "From visa application to landing in London — they were with me every step of the way. Highly recommended!", isActive: true },
    }),
  ]);

  // ── Success Stories ─────────────────────────────────────────────
  await Promise.all([
    prisma.successStory.create({
      data: {
        title: "From Douala to Toronto: Marie's Nursing Journey",
        summary: "How Marie Tchatchoua went from nursing school in Cameroon to a thriving healthcare career in Canada.",
        content: "Marie came to us with a dream of practicing nursing in Canada. With our guidance through the Express Entry program and IELTS preparation, she secured her permanent residency in just 8 months. Today, she works at Toronto General Hospital and mentors other Cameroonian nurses making the same journey.",
        destination: "Canada",
        isPublished: true,
      },
    }),
    prisma.successStory.create({
      data: {
        title: "Engineering Excellence: Paul's Path to Germany",
        summary: "Paul Enanga's inspiring story of becoming a software engineer in Berlin.",
        content: "Paul enrolled in our German A1 course with zero knowledge of the language. Within a year, he reached B2 level and landed a Blue Card sponsorship from a Berlin tech company. His dedication and our structured language program made it all possible.",
        destination: "Germany",
        isPublished: true,
      },
    }),
  ]);

  // ── Demo Procedure for customer ─────────────────────────────────
  const procedure = await prisma.procedure.create({
    data: {
      userId: customer.id,
      procedureTypeId: procedureTypes[0].id,
      destinationId: canada.id,
      status: "in_progress",
      agreedPrice: procedureTypes[0].price,
      currency: procedureTypes[0].currency,
      notes: "All documents submitted. Awaiting embassy response.",
    },
  });

  await prisma.procedureUpdate.createMany({
    data: [
      { procedureId: procedure.id, title: "Application Received", message: "Your student visa application has been received and is under initial review." },
      { procedureId: procedure.id, title: "Documents Verified", message: "All submitted documents have been verified. Your file is now being forwarded to the embassy." },
      { procedureId: procedure.id, title: "Embassy Processing", message: "Your application is currently being processed by the Canadian embassy. Estimated wait time: 2-4 weeks." },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        procedureId: procedure.id,
        amount: 50000,
        currency: procedure.currency,
        note: "Initial registration payment received offline.",
        paidAt: new Date("2026-03-10"),
      },
      {
        procedureId: procedure.id,
        amount: 25000,
        currency: procedure.currency,
        note: "Second installment received at the agency office.",
        paidAt: new Date("2026-03-24"),
      },
    ],
  });

  // ── Demo Enrollment ─────────────────────────────────────────────
  const courses = await prisma.languageCourse.findMany({ take: 1 });
  if (courses.length > 0) {
    await prisma.enrollment.create({
      data: { userId: customer.id, courseId: courses[0].id, status: "in_progress" },
    });
  }

  // ── Demo Notifications ──────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      { userId: customer.id, title: "Welcome!", message: "Welcome to Cameroon Immigration Services. Start your journey today!", type: "info" },
      { userId: customer.id, title: "Application Update", message: "Your Canadian student visa application has moved to embassy processing.", type: "procedure" },
      { userId: customer.id, title: "Payment Recorded", message: "An offline payment of 25,000 XAF has been recorded on your student visa file.", type: "success" },
      { userId: customer.id, title: "Course Reminder", message: "Your English Intermediate course starts on April 1st. Don't forget your materials!", type: "course" },
    ],
  });

  console.log("✅ Database seeded successfully!");
  console.log(`   Admin: admin@immigration-cm.com / admin123`);
  console.log(`   Customer: jean@example.com / customer123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
