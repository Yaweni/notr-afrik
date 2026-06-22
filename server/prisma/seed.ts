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

  await prisma.notification.deleteMany({ where: { userId: customer.id } });
  await prisma.enrollment.deleteMany({ where: { userId: customer.id } });
  await prisma.payment.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.procedureUpdate.deleteMany({});
  await prisma.procedure.deleteMany({});
  await prisma.procedureTypeCourseRecommendation.deleteMany({});
  await prisma.procedureTypeResource.deleteMany({});
  await prisma.procedureTypeRequirement.deleteMany({});
  await prisma.languageCourse.deleteMany({});
  await prisma.procedureType.deleteMany({});
  await prisma.destination.updateMany({ data: { isActive: false } });
  await prisma.testimonial.deleteMany({});
  await prisma.successStory.deleteMany({});

  // ── Canada-first destination setup ─────────────────────────────
  const canada = await prisma.destination.upsert({
    where: { code: "CA" },
    update: {
      name: "Canada",
      description:
        "Start from one destination, then choose the pathway that matches your goal. For now the office focuses the public journey on Canada Student and Canada PR.",
      descriptionFr:
        "Commencez par la destination, puis choisissez le parcours qui correspond a votre objectif. Pour l'instant, le bureau concentre le parcours public sur Canada Student et Canada PR.",
      isActive: true,
    },
    create: {
      name: "Canada",
      code: "CA",
      description:
        "Start from one destination, then choose the pathway that matches your goal. For now the office focuses the public journey on Canada Student and Canada PR.",
      descriptionFr:
        "Commencez par la destination, puis choisissez le parcours qui correspond a votre objectif. Pour l'instant, le bureau concentre le parcours public sur Canada Student et Canada PR.",
      isActive: true,
    },
  });

  const tcfPrepCourse = await prisma.languageCourse.create({
    data: {
      destinationId: canada.id,
      language: "French",
      level: "B2",
      title: "TCF Canada Prep",
      titleFr: "Preparation TCF Canada",
      description:
        "French preparation aligned with the TCF Canada format for Quebec-focused study plans, Francophone strategies, and PR files that need stronger language positioning.",
      descriptionFr:
        "Preparation en francais alignee sur le format TCF Canada pour les projets d'etudes axes Quebec, les strategies francophones et les dossiers de residence permanente qui ont besoin d'un meilleur positionnement linguistique.",
      schedule: "Tue-Thu-Sat 17:30-19:30",
      price: 65000,
      maxStudents: 18,
      startDate: new Date("2026-04-20"),
      endDate: new Date("2026-07-25"),
    },
  });

  const canadaStudent = await prisma.procedureType.create({
    data: {
      destinationId: canada.id,
      slug: "canada-student",
      category: "student",
      name: "Canada Student",
      nameFr: "Canada Etudes",
      description:
        "Study permit preparation for applicants targeting a Canadian school, college, or university.",
      descriptionFr:
        "Preparation au permis d'etudes pour les candidats visant une ecole, un college ou une universite au Canada.",
      publicSummary:
        "This pathway is built around a real admission offer, identity documents, proof of funds, and the permit conditions tied to your school and province. Quebec cases usually add a CAQ step before the federal study permit.",
      publicSummaryFr:
        "Ce parcours s'appuie sur une vraie offre d'admission, les pieces d'identite, la preuve de fonds et les conditions du permis liees a votre ecole et a votre province. Les dossiers Quebec ajoutent generalement l'etape du CAQ avant le permis d'etudes federal.",
      officeSummary:
        "Inside the client space we turn this into a working file: admission support, sponsor and funding checks, statement review, province-specific gaps, and embassy follow-up once the file is lodged.",
      officeSummaryFr:
        "Dans l'espace client, nous transformons cela en dossier de travail: appui a l'admission, verification du sponsor et du financement, relecture de la lettre explicative, points de vigilance provinciaux et suivi avec le poste de visa une fois le dossier depose.",
      officialProgramName: "Study permit",
      officialProgramNameFr: "Permis d'etudes",
      officialWebsiteUrl:
        "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html",
      officialWebsiteLabel: "IRCC study permit document guide",
      officialWebsiteLabelFr: "Guide IRCC des documents pour le permis d'etudes",
      estimatedTimeline: "Preparation depends on school intake, province, and visa office processing times.",
      estimatedTimelineFr: "La preparation depend de la rentree scolaire, de la province et des delais du bureau des visas.",
      price: 180000,
      currency: "XAF",
      isFeatured: true,
      isActive: true,
      sortOrder: 1,
      requirements: {
        create: [
          {
            title: "Admission letter from a DLI",
            titleFr: "Lettre d'admission d'un EED",
            description:
              "Secure an admission or enrollment letter from a designated learning institution before the permit file is assembled.",
            descriptionFr:
              "Obtenez une lettre d'admission ou d'inscription d'un etablissement d'enseignement designe avant de monter le dossier de permis.",
            section: "admission",
            audience: "both",
            sortOrder: 1,
          },
          {
            title: "Provincial support letter or CAQ when applicable",
            titleFr: "Lettre provinciale d'appui ou CAQ selon le cas",
            description:
              "Many applicants now need a PAL or TAL, and Quebec study plans usually require a CAQ before the federal permit submission.",
            descriptionFr:
              "De nombreux candidats ont maintenant besoin d'une lettre d'attestation provinciale ou territoriale, et les projets d'etudes au Quebec exigent en general un CAQ avant le depot federal.",
            section: "compliance",
            audience: "both",
            sortOrder: 2,
          },
          {
            title: "Passport and civil status documents",
            titleFr: "Passeport et documents d'etat civil",
            description:
              "Keep the passport valid and prepare identity, civil status, and education records that match the application narrative.",
            descriptionFr:
              "Gardez un passeport valide et preparez les pieces d'identite, d'etat civil et scolaires qui correspondent au recit du dossier.",
            section: "identity",
            audience: "both",
            sortOrder: 3,
          },
          {
            title: "Proof of funds",
            titleFr: "Preuve de fonds",
            description:
              "Show tuition coverage, living costs, and travel support with sponsor documents or personal funds that are traceable.",
            descriptionFr:
              "Montrez la couverture des frais de scolarite, du cout de vie et du voyage avec des justificatifs du sponsor ou des fonds personnels tracables.",
            section: "finance",
            audience: "both",
            sortOrder: 4,
          },
          {
            title: "Study plan and explanation letter",
            titleFr: "Projet d'etudes et lettre d'explication",
            description:
              "The file needs a coherent explanation of why this program, why now, and how it fits the applicant's history.",
            descriptionFr:
              "Le dossier a besoin d'une explication coherente du choix du programme, du bon moment et du lien avec le parcours du candidat.",
            section: "strategy",
            audience: "customer",
            sortOrder: 5,
          },
          {
            title: "Biometrics, medicals, and police checks if requested",
            titleFr: "Biometrie, visite medicale et police si demandees",
            description:
              "IRCC can request biometrics and supporting compliance documents depending on the applicant profile and travel history.",
            descriptionFr:
              "IRCC peut demander la biometrie et des pieces de conformite supplementaires selon le profil du candidat et son historique de voyage.",
            section: "compliance",
            audience: "both",
            sortOrder: 6,
          },
        ],
      },
      resources: {
        create: [
          {
            label: "Study permit document checklist",
            labelFr: "Liste officielle des documents du permis d'etudes",
            url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/get-documents.html",
            provider: "IRCC",
            providerFr: "IRCC",
            resourceType: "official",
            sortOrder: 1,
          },
          {
            label: "Find a designated learning institution",
            labelFr: "Trouver un etablissement d'enseignement designe",
            url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit/prepare/study-permit-tool.html",
            provider: "Government of Canada",
            providerFr: "Gouvernement du Canada",
            resourceType: "official",
            sortOrder: 2,
          },
          {
            label: "Quebec acceptance certificate for studies (CAQ)",
            labelFr: "Certificat d'acceptation du Quebec pour les etudes (CAQ)",
            url: "https://www.quebec.ca/en/education/study-quebec/temporary-selection-studies",
            provider: "Quebec",
            providerFr: "Quebec",
            resourceType: "official",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  const canadaPr = await prisma.procedureType.create({
    data: {
      destinationId: canada.id,
      slug: "canada-pr",
      category: "pr",
      name: "Canada PR",
      nameFr: "Canada Residence permanente",
      description:
        "Permanent residence preparation with Express Entry-style readiness, document planning, and profile positioning.",
      descriptionFr:
        "Preparation a la residence permanente avec une logique de preparation Express Entry, une planification documentaire et un positionnement strategique du profil.",
      publicSummary:
        "This pathway is built around language scores, education assessment, work history, and the supporting documents needed before and after an invitation. The right document mix depends on the exact program and your score strategy.",
      publicSummaryFr:
        "Ce parcours s'appuie sur les scores de langue, l'evaluation des etudes, l'historique professionnel et les pieces justificatives necessaires avant et apres une invitation. Le bon assemblage de documents depend du programme vise et de votre strategie de score.",
      officeSummary:
        "Inside the client space we use this as a working PR file: language and ECA readiness, score positioning, document collection, proof of funds review, and post-ITA submission support.",
      officeSummaryFr:
        "Dans l'espace client, nous utilisons cela comme dossier de travail RP: preparation linguistique et ECA, positionnement du score, collecte des pieces, revue de la preuve de fonds et appui apres l'ITA jusqu'au depot final.",
      officialProgramName: "Express Entry and PR preparation",
      officialProgramNameFr: "Preparation Express Entry et residence permanente",
      officialWebsiteUrl:
        "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents.html",
      officialWebsiteLabel: "IRCC Express Entry documents guide",
      officialWebsiteLabelFr: "Guide IRCC des documents Express Entry",
      estimatedTimeline: "Preparation starts before profile creation and continues through invitation and final submission.",
      estimatedTimelineFr: "La preparation commence avant la creation du profil et se poursuit jusqu'a l'invitation puis au depot final.",
      price: 320000,
      currency: "XAF",
      isFeatured: true,
      isActive: true,
      sortOrder: 2,
      requirements: {
        create: [
          {
            title: "Approved language test results",
            titleFr: "Resultats de test de langue acceptes",
            description:
              "Most PR strategies start with a valid language score. English and French tests accepted by IRCC depend on the program and the language being claimed.",
            descriptionFr:
              "La plupart des strategies RP commencent par un score de langue valide. Les tests d'anglais et de francais acceptes par IRCC dependent du programme et de la langue revendiquee.",
            section: "language",
            audience: "both",
            sortOrder: 1,
          },
          {
            title: "Educational credential assessment when needed",
            titleFr: "Evaluation des diplomes si necessaire",
            description:
              "Foreign studies often need an ECA before education points can be claimed in federal PR pathways.",
            descriptionFr:
              "Les etudes effectuees a l'etranger necessitent souvent une ECA avant de pouvoir revendiquer les points d'education dans les parcours federaux RP.",
            section: "education",
            audience: "both",
            sortOrder: 2,
          },
          {
            title: "Identity and work history file",
            titleFr: "Dossier d'identite et d'experience professionnelle",
            description:
              "The profile must be backed by passports, civil records, job references, and employment history that can withstand review.",
            descriptionFr:
              "Le profil doit etre soutenu par les passeports, actes d'etat civil, attestations d'emploi et un historique professionnel solide face a la verification.",
            section: "identity",
            audience: "both",
            sortOrder: 3,
          },
          {
            title: "Proof of funds where applicable",
            titleFr: "Preuve de fonds lorsque requise",
            description:
              "Some PR streams require settlement funds. The office reviews liquidity, sponsor assumptions, and documentation gaps early.",
            descriptionFr:
              "Certaines voies RP exigent des fonds d'etablissement. Le bureau examine tot la liquidite, les hypotheses de sponsor et les manques documentaires.",
            section: "finance",
            audience: "both",
            sortOrder: 4,
          },
          {
            title: "Police certificates and medical exam readiness",
            titleFr: "Casier judiciaire et visite medicale anticipes",
            description:
              "These usually appear later in the file but should be anticipated when timelines are tight.",
            descriptionFr:
              "Ces pieces arrivent souvent plus tard dans le dossier, mais il faut les anticiper lorsque les delais sont serres.",
            section: "compliance",
            audience: "both",
            sortOrder: 5,
          },
          {
            title: "Score and program positioning",
            titleFr: "Positionnement du score et du programme",
            description:
              "The internal file tracks language strategy, francophone options, provincial angles, and whether French can improve competitiveness.",
            descriptionFr:
              "Le dossier interne suit la strategie linguistique, les options francophones, les leviers provinciaux et la maniere dont le francais peut ameliorer la competitivite.",
            section: "strategy",
            audience: "customer",
            sortOrder: 6,
          },
        ],
      },
      resources: {
        create: [
          {
            label: "Express Entry document requirements",
            labelFr: "Exigences documentaires Express Entry",
            url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents.html",
            provider: "IRCC",
            providerFr: "IRCC",
            resourceType: "official",
            sortOrder: 1,
          },
          {
            label: "Language tests accepted for Express Entry",
            labelFr: "Tests de langue acceptes pour Express Entry",
            url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/language-requirements/language-testing.html",
            provider: "IRCC",
            providerFr: "IRCC",
            resourceType: "official",
            sortOrder: 2,
          },
          {
            label: "Educational credential assessments",
            labelFr: "Evaluations des diplomes",
            url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/documents/education-assessed.html",
            provider: "IRCC",
            providerFr: "IRCC",
            resourceType: "official",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  await prisma.procedureTypeCourseRecommendation.createMany({
    data: [
      {
        procedureTypeId: canadaStudent.id,
        courseId: tcfPrepCourse.id,
        rationale:
          "Useful when the student targets Quebec or a French-language campus and needs stronger French for admissions, CAQ preparation, or daily integration.",
        rationaleFr:
          "Utile lorsque l'etudiant vise le Quebec ou un campus francophone et a besoin d'un meilleur francais pour l'admission, la preparation du CAQ ou l'integration quotidienne.",
        priority: "optional",
        isPrimary: false,
        sortOrder: 1,
      },
      {
        procedureTypeId: canadaPr.id,
        courseId: tcfPrepCourse.id,
        rationale:
          "French can strengthen a PR strategy. TCF Canada is an IRCC-accepted French test and can matter for francophone planning or Quebec-oriented files.",
        rationaleFr:
          "Le francais peut renforcer une strategie RP. Le TCF Canada est un test de francais accepte par IRCC et peut compter pour une strategie francophone ou des dossiers orientes Quebec.",
        priority: "strategic",
        isPrimary: true,
        sortOrder: 1,
      },
    ],
  });

  // ── Site Content ────────────────────────────────────────────────
  await Promise.all([
    prisma.siteContent.upsert({
      where: { key: "hero_title" },
      update: {},
      create: { key: "hero_title", value: "Your Journey Abroad Starts Here" },
    }),
    prisma.siteContent.upsert({
      where: { key: "hero_title_fr" },
      update: {},
      create: { key: "hero_title_fr", value: "Votre projet de depart commence ici" },
    }),
    prisma.siteContent.upsert({
      where: { key: "hero_subtitle" },
      update: {},
      create: { key: "hero_subtitle", value: "Cameroon's trusted immigration partner — guiding you to your dream destination with expert visa processing and language training." },
    }),
    prisma.siteContent.upsert({
      where: { key: "hero_subtitle_fr" },
      update: {},
      create: { key: "hero_subtitle_fr", value: "Des parcours clairs, des etapes visibles et un accompagnement humain pour rendre l'immigration plus simple pour les voyageurs ambitieux." },
    }),
    prisma.siteContent.upsert({
      where: { key: "mission_statement" },
      update: {},
      create: { key: "mission_statement", value: "We are committed to making international mobility accessible to every Cameroonian. Through professional guidance, transparent processes, and quality language education, we transform travel dreams into reality." },
    }),
    prisma.siteContent.upsert({
      where: { key: "mission_statement_fr" },
      update: {},
      create: { key: "mission_statement_fr", value: "Nous rendons la mobilite internationale plus simple, plus lisible et plus rassurante pour chaque candidat au depart." },
    }),
    prisma.siteContent.upsert({
      where: { key: "about_text" },
      update: {},
      create: { key: "about_text", value: "Founded in Douala, our immigration office has helped thousands of Cameroonians successfully relocate, study, and work abroad. With partnerships across Europe and North America, we provide end-to-end immigration solutions backed by years of expertise." },
    }),
    prisma.siteContent.upsert({
      where: { key: "about_text_fr" },
      update: {},
      create: { key: "about_text_fr", value: "Depuis Douala, nous construisons un bureau immigration plus moderne: documents centralises, suivi clair, information fiable et interventions humaines au bon moment." },
    }),
  ]);

  // ── Testimonials ────────────────────────────────────────────────
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: "Marie Tchatchoua",
        country: "Canada",
        countryFr: "Canada",
        message: "The office broke my Canada study file into clear steps: admission, funds, CAQ review, and permit submission. I always knew what was next.",
        messageFr: "Le bureau a decoupe mon dossier d'etudes Canada en etapes claires: admission, fonds, revue du CAQ et depot du permis. Je savais toujours quelle etait la suite.",
        isActive: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Paul Enanga",
        country: "Canada",
        countryFr: "Canada",
        message: "My PR preparation stopped feeling abstract once the team mapped the language test, ECA, and document plan inside one dashboard.",
        messageFr: "Ma preparation RP a cesse de paraitre abstraite des que l'equipe a organise le test de langue, l'ECA et le plan documentaire dans un seul tableau de bord.",
        isActive: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Aissatou Bello",
        country: "Canada",
        countryFr: "Canada",
        message: "I joined the TCF prep class because French was part of my Canada strategy. It helped me stop treating language scores as an afterthought.",
        messageFr: "J'ai rejoint le cours de preparation TCF parce que le francais faisait partie de ma strategie Canada. Cela m'a aidee a ne plus traiter le score de langue comme un detail.",
        isActive: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: "Emmanuel Fouda",
        country: "Canada",
        countryFr: "Canada",
        message: "The team kept my student file practical. They did not drown me in theory. Every document request had a reason and a deadline.",
        messageFr: "L'equipe a garde mon dossier etudiant tres concret. Ils ne m'ont pas noye dans la theorie. Chaque demande de document avait une raison et une date limite.",
        isActive: true,
      },
    }),
  ]);

  // ── Success Stories ─────────────────────────────────────────────
  await Promise.all([
    prisma.successStory.create({
      data: {
        title: "From Douala to Montreal: Marie's Study Permit File",
        titleFr: "De Douala a Montreal : le dossier permis d'etudes de Marie",
        summary: "Marie turned an admission offer into a study permit file with a Quebec-ready checklist and funding pack.",
        summaryFr: "Marie a transforme une offre d'admission en dossier de permis d'etudes avec une checklist prete pour le Quebec et un pack de financement solide.",
        content: "Marie came to the office after receiving interest from a college in Quebec. We helped her structure the file around the admission letter, funding narrative, CAQ timing, and the study permit submission sequence. The win came from treating the application like a staged project instead of one long checklist.",
        contentFr: "Marie est arrivee au bureau apres avoir recu un interet d'un college au Quebec. Nous l'avons aidee a structurer le dossier autour de la lettre d'admission, du recit financier, du calendrier du CAQ et de la sequence de depot du permis d'etudes. La difference est venue du fait de traiter la demande comme un projet en plusieurs etapes plutot qu'une longue checklist.",
        destination: "Canada",
        destinationFr: "Canada",
        isPublished: true,
      },
    }),
    prisma.successStory.create({
      data: {
        title: "Jean's Canada PR Preparation Reset",
        titleFr: "Le reset de preparation RP Canada de Jean",
        summary: "Jean stopped treating PR as a single form and rebuilt his file around language, ECA, and funds readiness.",
        summaryFr: "Jean a cesse de traiter la RP comme un simple formulaire et a reconstruit son dossier autour de la langue, de l'ECA et de la preparation financiere.",
        content: "Jean initially approached PR with scattered documents and vague timelines. We converted the case into a pathway file with language testing, credential assessment, proof of funds review, and a cleaner submission sequence. The structure made it obvious where extra French preparation could improve his options.",
        contentFr: "Au depart, Jean abordait la RP avec des documents disperses et des delais vagues. Nous avons transforme son cas en vrai dossier de parcours avec test de langue, evaluation des diplomes, revue de la preuve de fonds et sequence de depot plus propre. Cette structure a rendu evident l'endroit ou une meilleure preparation en francais pouvait ameliorer ses options.",
        destination: "Canada",
        destinationFr: "Canada",
        isPublished: true,
      },
    }),
  ]);

  // ── Demo Procedure for customer ─────────────────────────────────
  const procedure = await prisma.procedure.create({
    data: {
      userId: customer.id,
      procedureTypeId: canadaStudent.id,
      destinationId: canada.id,
      status: "in_progress",
      agreedPrice: canadaStudent.price,
      currency: canadaStudent.currency,
      notes: "Admission letter received. Funding documents are being consolidated before final permit filing.",
    },
  });

  await prisma.procedureUpdate.createMany({
    data: [
      {
        procedureId: procedure.id,
        title: "Admission Pack Reviewed",
        titleFr: "Pack d'admission revise",
        message: "Your offer letter and school documents have been checked. The file is now waiting on the final sponsor funding pack.",
        messageFr: "Votre lettre d'admission et les documents scolaires ont ete verifies. Le dossier attend maintenant le pack final de financement du sponsor.",
      },
      {
        procedureId: procedure.id,
        title: "Quebec Step Assessed",
        titleFr: "Etape Quebec evaluee",
        message: "The team reviewed whether your school and province require a CAQ or provincial support letter before permit filing.",
        messageFr: "L'equipe a verifie si votre ecole et votre province exigent un CAQ ou une lettre provinciale d'appui avant le depot du permis.",
      },
      {
        procedureId: procedure.id,
        title: "Permit Draft In Progress",
        titleFr: "Projet de permis en cours",
        message: "The study plan and proof-of-funds pack are being finalized before submission.",
        messageFr: "Le projet d'etudes et le dossier de preuve de fonds sont en finalisation avant le depot.",
      },
    ],
  });

  await prisma.payment.createMany({
    data: [
      {
        procedureId: procedure.id,
        amount: 50000,
        currency: procedure.currency,
        note: "Opening payment received for the Canada Student pathway.",
        paidAt: new Date("2026-03-10"),
      },
      {
        procedureId: procedure.id,
        amount: 25000,
        currency: procedure.currency,
        note: "Second installment received after the admission pack review.",
        paidAt: new Date("2026-03-24"),
      },
    ],
  });

  // ── Demo Enrollment ─────────────────────────────────────────────
  await prisma.enrollment.create({
    data: { userId: customer.id, courseId: tcfPrepCourse.id, status: "in_progress" },
  });

  // ── Demo Notifications ──────────────────────────────────────────
  await prisma.notification.createMany({
    data: [
      {
        userId: customer.id,
        title: "Welcome",
        titleFr: "Bienvenue",
        message: "Your portal is now organized around Canada pathways. Start from Canada Student or Canada PR depending on the file you want to open.",
        messageFr: "Votre portail est maintenant organise autour des parcours Canada. Commencez par Canada Etudes ou Canada Residence permanente selon le dossier que vous voulez ouvrir.",
        type: "info",
      },
      {
        userId: customer.id,
        title: "Application Update",
        titleFr: "Mise a jour du dossier",
        message: "Your Canada Student pathway is waiting on the final funding pack and study plan draft.",
        messageFr: "Votre parcours Canada Etudes attend le pack final de financement et le projet d'etudes.",
        type: "procedure",
      },
      {
        userId: customer.id,
        title: "Payment Recorded",
        titleFr: "Paiement enregistre",
        message: "An offline payment of 25,000 XAF has been recorded on your Canada Student file.",
        messageFr: "Un paiement hors ligne de 25 000 XAF a ete enregistre sur votre dossier Canada Etudes.",
        type: "success",
      },
      {
        userId: customer.id,
        title: "Course Reminder",
        titleFr: "Rappel de cours",
        message: "Your TCF Canada Prep class starts on April 20. Keep your speaking and writing practice consistent.",
        messageFr: "Votre cours Preparation TCF Canada commence le 20 avril. Gardez une pratique reguliere a l'oral et a l'ecrit.",
        type: "course",
      },
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
