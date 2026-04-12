import { Link } from "react-router-dom";
import {
  Globe,
  GraduationCap,
  FileCheck,
  Users,
  ArrowRight,
  Star,
  CheckCircle2,
  Plane,
  BookOpen,
  Shield,
} from "lucide-react";
import { useSiteContent, useTestimonials, useSuccessStories, useDestinations } from "../hooks/useApi";
import { useI18n } from "../context/LanguageContext";

export default function HomePage() {
  const { data: content } = useSiteContent();
  const { data: testimonials } = useTestimonials();
  const { data: stories } = useSuccessStories();
  const { data: destinations } = useDestinations();
  const { isFrench, getLocalizedContent } = useI18n();

  const copy = isFrench
    ? {
        heroBadge: "Le bureau immigration moderne du Cameroun",
        heroTitle: "Votre projet de depart commence ici",
        heroSubtitle: "Des parcours clairs, des etapes visibles et un accompagnement humain pour rendre l'immigration plus simple pour les voyageurs ambitieux.",
        startJourney: "Commencer",
        exploreDestinations: "Explorer les destinations",
        stats: [
          { num: "2,000+", label: "Visas reussis" },
          { num: "6+", label: "Destinations" },
          { num: "500+", label: "Etudiants en langue" },
          { num: "95%", label: "Taux de reussite" },
        ],
        servicesTitle: "Tout pour voyager avec clarte",
        servicesSubtitle: "Le bureau digital organise l'information, les documents, les cours et les etapes afin que chaque voyageur sache quoi faire ensuite.",
        services: [
          { icon: FileCheck, title: "Preparation visa", desc: "Visas etudiants, travail, tourisme et regroupement familial avec un parcours simple a suivre.", color: "from-blue-500 to-blue-600" },
          { icon: GraduationCap, title: "Preparation linguistique", desc: "Anglais, francais, allemand et preparation aux examens lies au projet de depart.", color: "from-emerald-500 to-emerald-600" },
          { icon: Globe, title: "Orientation destination", desc: "Une vue claire sur les pays, les exigences, les delais et les pieces a reunir.", color: "from-purple-500 to-purple-600" },
          { icon: Shield, title: "Encadrement humain", desc: "Le systeme simplifie le parcours sans remplacer l'expertise juridique quand elle est necessaire.", color: "from-amber-500 to-amber-600" },
        ],
        destinationsTitle: "Destinations populaires",
        destinationsSubtitle: "Explorez les pays les plus recherches par les aspirants voyageurs camerounais.",
        learnMore: "Voir le parcours",
        missionTitle: "Notre mission",
        missionStatement: "Nous rendons la mobilite internationale plus simple, plus lisible et plus rassurante pour chaque candidat au depart.",
        aboutText: "Depuis Douala, nous construisons un bureau immigration plus moderne: documents centralises, suivi clair, information fiable et interventions humaines au bon moment.",
        missionBullets: [
          "Information simple et fiable",
          "Parcours transparent du debut a la fin",
          "Preparation linguistique orientee resultat",
          "Escalade vers un expert humain quand le dossier devient complexe",
        ],
        proudlyCameroonian: "Fierement camerounais",
        since: "Au service de la communaute depuis 2015",
        testimonialsTitle: "Ce que disent nos clients",
        relocatedTo: "Installe en {country}",
        storiesTitle: "Parcours de reussite",
        ctaTitle: "Pret a lancer votre projet ?",
        ctaText: "Le bon produit n'est pas un cabinet d'avocat automatise. C'est un bureau moderne qui explique, organise et rassure a chaque etape.",
        createAccount: "Creer mon compte",
        browseCourses: "Voir les cours",
      }
    : {
        heroBadge: "Cameroon's modern immigration office",
        heroTitle: "Your journey abroad starts here",
        heroSubtitle: "Clear journeys, visible milestones, and human guidance that make immigration easier for aspiring travelers.",
        startJourney: "Start Your Journey",
        exploreDestinations: "Explore Destinations",
        stats: [
          { num: "2,000+", label: "Successful Visas" },
          { num: "6+", label: "Destinations" },
          { num: "500+", label: "Language Students" },
          { num: "95%", label: "Success Rate" },
        ],
        servicesTitle: "Everything you need to travel with clarity",
        servicesSubtitle: "The digital office organizes information, documents, courses, and milestones so every traveler knows the next step.",
        services: [
          { icon: FileCheck, title: "Visa Preparation", desc: "Student, work, tourist, and family journeys with a clear path to follow.", color: "from-blue-500 to-blue-600" },
          { icon: GraduationCap, title: "Language Preparation", desc: "English, French, German, and exam prep tied to the destination journey.", color: "from-emerald-500 to-emerald-600" },
          { icon: Globe, title: "Destination Guidance", desc: "A clear view of countries, requirements, timelines, and needed documents.", color: "from-purple-500 to-purple-600" },
          { icon: Shield, title: "Human Oversight", desc: "The product simplifies the journey without pretending to replace legal expertise.", color: "from-amber-500 to-amber-600" },
        ],
        destinationsTitle: "Popular destinations",
        destinationsSubtitle: "Explore the countries most requested by aspiring travelers from Cameroon.",
        learnMore: "View journey",
        missionTitle: "Our mission",
        missionStatement: "We make international mobility simpler, clearer, and less intimidating for every aspiring traveler.",
        aboutText: "From Douala, we are building a more modern immigration office: centralized documents, clear status tracking, reliable information, and human intervention at the right moment.",
        missionBullets: [
          "Simple and trustworthy information",
          "Transparent journey from start to finish",
          "Outcome-driven language preparation",
          "Escalation to a human expert when the case becomes complex",
        ],
        proudlyCameroonian: "Proudly Cameroonian",
        since: "Serving the community since 2015",
        testimonialsTitle: "What our clients say",
        relocatedTo: "Relocated to {country}",
        storiesTitle: "Success stories",
        ctaTitle: "Ready to launch your plan?",
        ctaText: "The right product is not a fake immigration lawyer. It is a modern office that explains, organizes, and reassures at every step.",
        createAccount: "Create Your Account",
        browseCourses: "Browse Courses",
      };

  const heroTitle = getLocalizedContent(content, "hero_title", { en: copy.heroTitle, fr: copy.heroTitle });
  const heroSubtitle = getLocalizedContent(content, "hero_subtitle", { en: copy.heroSubtitle, fr: copy.heroSubtitle });
  const missionStatement = getLocalizedContent(content, "mission_statement", { en: copy.missionStatement, fr: copy.missionStatement });
  const aboutText = getLocalizedContent(content, "about_text", { en: copy.aboutText, fr: copy.aboutText });

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-cameroon-green text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Plane className="w-4 h-4" />
              {copy.heroBadge}
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-cameroon-yellow text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl">
                {copy.startJourney}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/destinations" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                {copy.exploreDestinations}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
            {copy.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-extrabold text-cameroon-yellow">{s.num}</div>
                <div className="text-sm text-white/60 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {copy.servicesTitle}
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              {copy.servicesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {copy.services.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card group hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ────────────────────────────────────────── */}
      {destinations && destinations.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {copy.destinationsTitle}
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                {copy.destinationsSubtitle}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.slice(0, 6).map((dest) => (
                <Link to={`/destinations/${dest.id}`} key={dest.id} className="card group hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl font-bold">
                      {dest.code}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-gray-900">{dest.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{dest.description}</p>
                  <div className="mt-4 text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {copy.learnMore} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Mission ─────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {copy.missionTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {missionStatement}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {aboutText}
              </p>
              <ul className="space-y-3">
                {copy.missionBullets.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-cameroon-green flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-cameroon-green/10 via-cameroon-yellow/10 to-cameroon-red/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🇨🇲</div>
                  <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">{copy.proudlyCameroonian}</h3>
                  <p className="text-gray-500">{copy.since}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────── */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {copy.testimonialsTitle}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="card">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-cameroon-yellow text-cameroon-yellow" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">&ldquo;{t.message}&rdquo;</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-sm font-bold text-primary-700">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                      {t.country && <div className="text-xs text-gray-400">{copy.relocatedTo.replace("{country}", t.country)}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Success Stories ─────────────────────────────────────── */}
      {stories && stories.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {copy.storiesTitle}
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              {stories.map((s) => (
                <div key={s.id} className="card">
                  <div className="flex items-center gap-2 mb-3">
                    {s.destination && (
                      <span className="badge bg-primary-100 text-primary-700">{s.destination}</span>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{s.summary}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-cameroon-green text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            {copy.ctaTitle}
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            {copy.ctaText}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-cameroon-yellow text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg">
              {copy.createAccount}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
              <BookOpen className="w-5 h-5" />
              {copy.browseCourses}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
