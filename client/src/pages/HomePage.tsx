import { Link } from "react-router-dom";
import HeroCarousel from "../components/HeroCarousel";
import {
  GraduationCap,
  FileCheck,
  Car,
  Handshake,
  UserCheck,
  Users,
  ArrowRight,
  Star,
  BookOpen,
  Globe,
  Shield,
  CheckCircle2,
  Clock,
  Headphones,
  ThumbsUp,
  BadgeCheck,
  Plane,
  Ticket,
  MapPin,
  Package,
  Sparkles,
} from "lucide-react";
import { useSiteContent, useDestinations, useTestimonials, useSuccessStories } from "../hooks/useApi";
import { useI18n } from "../context/LanguageContext";

// Sample data used when the backend isn't available (static-only deploy).
const SAMPLE_DESTINATIONS = [
  { id: "s1", code: "DE", name: "Allemagne", description: "Ausbildung, university studies and work — the most popular route for our candidates.", descriptionFr: "Ausbildung, etudes universitaires et travail — la voie la plus demandee par nos candidats." },
  { id: "s2", code: "CA", name: "Canada", description: "Express Entry, study permits and family sponsorship pathways.", descriptionFr: "Entree Express, permis d'etudes et parrainage familial." },
  { id: "s3", code: "US", name: "Etats-Unis", description: "Student visas (F-1), work visas and diversity lottery support.", descriptionFr: "Visas etudiant (F-1), visas de travail et loterie de la diversite." },
  { id: "s4", code: "FR", name: "France", description: "Campus France procedures, student and family reunification visas.", descriptionFr: "Procedures Campus France, visas etudiant et regroupement familial." },
  { id: "s5", code: "IT", name: "Italie", description: "Seasonal work, study and family visas across the Mediterranean.", descriptionFr: "Travail saisonnier, etudes et visas familiaux en Mediterranee." },
  { id: "s6", code: "GB", name: "Royaume-Uni", description: "Student visas, skilled worker and language requirements guidance.", descriptionFr: "Visas etudiant, worker qualifie et exigences linguistiques." },
];

const SAMPLE_TESTIMONIALS = [
  { id: "t1", name: "Aline N.", country: "Allemagne", countryFr: "Allemagne", message: "I got my Ausbildung visa with NOTR-AFRIK's help — they guided every document.", messageFr: "J'ai obtenu mon visa Ausbildung grace a NOTR-AFRIK — chaque document guide." },
  { id: "t2", name: "Brice K.", country: "Canada", countryFr: "Canada", message: "The team made the Express Entry process clear and stress-free.", messageFr: "L'equipe a rendu le processus d'Entree Express clair et sans stress." },
  { id: "t3", name: "Cynthia M.", country: "France", countryFr: "France", message: "Thanks to the German courses, I passed my exam and got my visa.", messageFr: "Grace aux cours d'allemand, j'ai reussi mon examen et obtenu mon visa." },
];

const SAMPLE_STORIES = [
  { id: "st1", destination: "Germany", destinationFr: "Allemagne", title: "From Douala to an Ausbildung in Berlin", titleFr: "De Douala a une Ausbildung a Berlin", summary: "6 months from first appointment to visa.", summaryFr: "6 mois entre le premier rendez-vous et le visa.", content: "Aline started with language courses, then voucher preparation. We tracked every step until her visa was approved.", contentFr: "Aline a commence par les cours de langue, puis la preparation du dossier. Nous avons suivi chaque etape jusqu'a l'approbation du visa." },
];

export default function HomePage() {
  const { data: content } = useSiteContent();
  const { data: destRaw } = useDestinations();
  const { data: testRaw } = useTestimonials();
  const { data: storiesRaw } = useSuccessStories();
  const destinations = Array.isArray(destRaw) && destRaw.length ? destRaw : SAMPLE_DESTINATIONS;
  const testimonials = Array.isArray(testRaw) && testRaw.length ? testRaw : SAMPLE_TESTIMONIALS;
  const stories = Array.isArray(storiesRaw) && storiesRaw.length ? storiesRaw : SAMPLE_STORIES;
  const { isFrench, getLocalizedContent, getLocalizedValue } = useI18n();

  const copy = isFrench
    ? {
        heroBadge: "Centre Linguistique & Accompagnement International",
        heroTitle: "De l'Afrique au monde,",
        heroTitleEmphasis: "votre succes commence ici",
        heroSubtitle: "Cours de langues, accompagnement visa, auto-ecole, contrats internationaux et bien plus. NOTR-AFRIK vous guide a chaque etape de votre projet international.",
        startJourney: "Nos services",
        exploreDestinations: "Destinations",
        stats: [
          { num: "1,500+", label: "Etudiants formes" },
          { num: "15+", label: "Pays partenaires" },
          { num: "6+", label: "Ans d'experience" },
          { num: "98%", label: "Taux de satisfaction" },
        ],
        servicesTitle: "Nos services",
        servicesSubtitle: "Un accompagnement complet pour tous vos projets a l'international.",
        services: [
          { icon: GraduationCap, title: "Cours de langues", desc: "Allemand, Anglais, Italien et Francais avec preparation aux examens et certifications internationales.", color: "from-notrafrik-navy to-notrafrik-light" },
          { icon: FileCheck, title: "Accompagnement Visa", desc: "Dossiers de visa etudiant, travail, tourisme - preparation, verification et suivi de votre demande.", color: "from-notrafrik-gold to-amber-400" },
          { icon: Car, title: "Auto-ecole", desc: "Formation complete de conduite theorique et pratique pour l'obtention de votre permis de conduire.", color: "from-notrafrik-red to-red-400" },
          { icon: Handshake, title: "Contrats internationaux", desc: "Mise en relation avec nos partenaires a l'etranger pour vos projets de travail ou d'etudes.", color: "from-purple-600 to-purple-400" },
          { icon: Users, title: "Programme d'affiliation", desc: "Devenez partenaire et beneficiez de commissions pour chaque personne que vous nous referex.", color: "from-emerald-600 to-emerald-400" },
          { icon: UserCheck, title: "Suivi personnalise", desc: "Un conseiller dedie qui suit votre dossier de A a Z et vous accompagne par telephone et WhatsApp.", color: "from-cyan-600 to-cyan-400" },
        ],
        whyUsTitle: "Pourquoi nous choisir ?",
        whyUsItems: [
          { icon: Globe, title: "Reseau international", desc: "Des partenariats dans plus de 15 pays pour vous offrir les meilleures opportunites.", color: "bg-notrafrik-gold" },
          { icon: BadgeCheck, title: "Expertise reconnue", desc: "Une equipe de professionnels certifies avec une connaissance approfondie des procedures.", color: "bg-notrafrik-navy" },
          { icon: Headphones, title: "Disponible 24/7", desc: "Support WhatsApp et telephone pour repondre a toutes vos questions en temps reel.", color: "bg-notrafrik-red" },
          { icon: Clock, title: "Rapidite garantie", desc: "Des procedures optimisees pour traiter vos dossiers dans les meilleurs delais.", color: "bg-notrafrik-gold" },
          { icon: Shield, title: "Securite et confiance", desc: "Vos documents et informations traites avec la plus grande confidentialite.", color: "bg-notrafrik-navy" },
          { icon: ThumbsUp, title: "Satisfaction client", desc: "Plus de 1,500 clients satisfaits temoignent de la qualite de nos services.", color: "bg-notrafrik-red" },
        ],
        destinationsTitle: "Destinations populaires",
        destinationsSubtitle: "Explorez les pays les plus demandes par nos etudiants et voyageurs.",
        learnMore: "En savoir plus",
        testimonialsTitle: "Ce que disent nos clients",
        relocatedTo: "Installe en {country}",
        storiesTitle: "Parcours de reussite",
        ctaTitle: "Pret a realiser votre projet international ?",
        ctaText: "Contactez-nous des aujourd'hui et beneficiez d'un accompagnement personnalise pour votre projet d'etudes, de travail ou de voyage.",
        ctaButton: "Nous contacter",
        browseCourses: "Voir les cours",
      }
    : {
        heroBadge: "Language Center & International Support",
        heroTitle: "From Africa to the world,",
        heroTitleEmphasis: "your success starts here",
        heroSubtitle: "Language courses, visa support, driving school, international contracts and more. NOTR-AFRIK guides you every step of your international journey.",
        startJourney: "Our Services",
        exploreDestinations: "Destinations",
        stats: [
          { num: "1,500+", label: "Trained Students" },
          { num: "15+", label: "Partner Countries" },
          { num: "6+", label: "Years Experience" },
          { num: "98%", label: "Satisfaction Rate" },
        ],
        servicesTitle: "Our Services",
        servicesSubtitle: "Complete support for all your international projects.",
        services: [
          { icon: GraduationCap, title: "Language Courses", desc: "German, English, Italian and French with exam preparation and international certifications.", color: "from-notrafrik-navy to-notrafrik-light" },
          { icon: FileCheck, title: "Visa Support", desc: "Student, work, and tourist visa applications - preparation, verification and follow-up.", color: "from-notrafrik-gold to-amber-400" },
          { icon: Car, title: "Driving School", desc: "Complete theoretical and practical driving training to obtain your driver's license.", color: "from-notrafrik-red to-red-400" },
          { icon: Handshake, title: "International Contracts", desc: "Connection with our partners abroad for your work or study projects.", color: "from-purple-600 to-purple-400" },
          { icon: Users, title: "Affiliate Program", desc: "Become a partner and earn commissions for every person you refer to us.", color: "from-emerald-600 to-emerald-400" },
          { icon: UserCheck, title: "Personalized Tracking", desc: "A dedicated advisor follows your case from start to finish by phone and WhatsApp.", color: "from-cyan-600 to-cyan-400" },
        ],
        whyUsTitle: "Why choose us?",
        whyUsItems: [
          { icon: Globe, title: "International Network", desc: "Partnerships in over 15 countries to offer you the best opportunities.", color: "bg-notrafrik-gold" },
          { icon: BadgeCheck, title: "Recognized Expertise", desc: "A team of certified professionals with in-depth knowledge of procedures.", color: "bg-notrafrik-navy" },
          { icon: Headphones, title: "Available 24/7", desc: "WhatsApp and phone support to answer all your questions in real time.", color: "bg-notrafrik-red" },
          { icon: Clock, title: "Guaranteed Speed", desc: "Optimized procedures to process your files in the best timeframes.", color: "bg-notrafrik-gold" },
          { icon: Shield, title: "Security & Trust", desc: "Your documents and information handled with the utmost confidentiality.", color: "bg-notrafrik-navy" },
          { icon: ThumbsUp, title: "Client Satisfaction", desc: "Over 1,500 satisfied clients testify to the quality of our services.", color: "bg-notrafrik-red" },
        ],
        destinationsTitle: "Popular Destinations",
        destinationsSubtitle: "Explore the countries most requested by our students and travelers.",
        learnMore: "Learn more",
        testimonialsTitle: "What our clients say",
        relocatedTo: "Relocated to {country}",
        storiesTitle: "Success stories",
        ctaTitle: "Ready to make your international project a reality?",
        ctaText: "Contact us today and get personalized support for your study, work, or travel project.",
        ctaButton: "Contact Us",
        browseCourses: "View Courses",
      };

  const heroTitle = getLocalizedContent(content, "hero_title", { en: copy.heroTitle, fr: copy.heroTitle });
  const heroSubtitle = getLocalizedContent(content, "hero_subtitle", { en: copy.heroSubtitle, fr: copy.heroSubtitle });

  return (
    <div className="min-h-screen">
      {/* ── Hero Carousel + Stats ──────────────────────────────── */}
      <HeroCarousel />

      {/* Stats */}
      <section className="relative bg-gradient-to-r from-notrafrik-navy to-notrafrik-light text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {copy.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-extrabold text-notrafrik-gold">{s.num}</div>
                <div className="text-sm text-white/50 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Category Quick Access */}
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {isFrench ? "Nos services" : "Our Services"}
            </h2>
            <Link to="/services" className="text-sm font-semibold text-primary hover:text-notrafrik-gold flex items-center gap-1 transition-colors">
              {isFrench ? "Voir tout" : "View all"} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: "visas", icon: Plane, label: "Visas", labelFr: "Visas", color: "bg-notrafrik-navy" },
              { id: "ticketing", icon: Ticket, label: "Tickets", labelFr: "Billets", color: "bg-notrafrik-gold" },
              { id: "tourism", icon: MapPin, label: "Tourism", labelFr: "Tourisme", color: "bg-emerald-600" },
              { id: "logistics", icon: Package, label: "Logistics", labelFr: "Logistique", color: "bg-purple-600" },
              { id: "security", icon: Shield, label: "Security", labelFr: "Sécurité", color: "bg-notrafrik-red" },
              { id: "events", icon: Sparkles, label: "Events", labelFr: "Événements", color: "bg-cyan-600" },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/services#${cat.id}`}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-card-foreground text-center">{isFrench ? cat.labelFr : cat.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {copy.servicesTitle}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {copy.servicesSubtitle}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {copy.services.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card group hover:-translate-y-1.5 transition-all duration-300 border-none shadow-md hover:shadow-xl">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-card-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi nous choisir ───────────────────────────────── */}
      <section className="py-20 bg-muted/30 dark:bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {copy.whyUsTitle}
            </h2>
            <div className="w-20 h-1 bg-notrafrik-gold mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {copy.whyUsItems.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="relative bg-card text-card-foreground rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-border group">
                <div className={`absolute -top-4 left-8 w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="mt-4">
                  <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ────────────────────────────────────────── */}
      <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
                {copy.destinationsTitle}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {copy.destinationsSubtitle}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.slice(0, 6).map((dest: any) => (
                <Link to={`/destinations/${dest.id}`} key={dest.id} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-notrafrik-navy to-notrafrik-light flex items-center justify-center text-xl font-bold text-white">
                      {dest.code}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-card-foreground">{dest.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{getLocalizedValue(dest.description, dest.descriptionFr)}</p>
                  <div className="mt-4 text-primary dark:text-notrafrik-gold text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {copy.learnMore} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      <section className="py-20 bg-muted/30 dark:bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {copy.testimonialsTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t: any) => (
              <div key={t.id} className="card">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-notrafrik-gold text-notrafrik-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{getLocalizedValue(t.message, t.messageFr)}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-card-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {copy.relocatedTo.replace("{country}", getLocalizedValue(t.country, t.countryFr))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Success Stories ─────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              {copy.storiesTitle}
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((s: any) => (
              <div key={s.id} className="card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge bg-primary/15 text-primary">{getLocalizedValue(s.destination, s.destinationFr)}</span>
                </div>
                <h3 className="font-heading font-semibold text-xl text-card-foreground mb-2">{getLocalizedValue(s.title, s.titleFr)}</h3>
                <p className="text-sm text-muted-foreground mb-4">{getLocalizedValue(s.summary, s.summaryFr)}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{getLocalizedValue(s.content, s.contentFr)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-notrafrik-navy to-notrafrik-light text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-4xl mx-auto px-4 text-center relative">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            {copy.ctaTitle}
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            {copy.ctaText}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-notrafrik-gold text-notrafrik-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg">
              {copy.ctaButton}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href="https://wa.me/237691706281" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
