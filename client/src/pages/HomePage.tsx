import { Link } from "react-router-dom";
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
  Target,
  ThumbsUp,
  BadgeCheck,
} from "lucide-react";
import { useSiteContent, useDestinations } from "../hooks/useApi";
import { useI18n } from "../context/LanguageContext";

export default function HomePage() {
  const { data: content } = useSiteContent();
  const { data: destinations } = useDestinations();
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
        ctaTitle: "Ready to make your international project a reality?",
        ctaText: "Contact us today and get personalized support for your study, work, or travel project.",
        ctaButton: "Contact Us",
        browseCourses: "View Courses",
      };

  const heroTitle = getLocalizedContent(content, "hero_title", { en: copy.heroTitle, fr: copy.heroTitle });
  const heroSubtitle = getLocalizedContent(content, "hero_subtitle", { en: copy.heroSubtitle, fr: copy.heroSubtitle });

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-notrafrik-navy via-notrafrik-light to-notrafrik-navy text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMjUiPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        {/* World map outline SVG */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 100 Q300 50 400 100 Q500 50 600 100 Q700 150 650 250" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 150 Q200 80 300 140 Q400 120 500 160 Q550 200 600 180" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M50 250 Q150 150 250 230 Q350 200 450 250 Q550 220 600 280" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M100 350 Q200 280 300 340 Q400 300 500 350 Q600 330 650 380" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M300 50 Q350 30 400 50" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M480 60 Q520 40 550 60" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M580 120 Q620 140 600 170" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M80 200 Q60 240 80 280" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M680 220 Q720 260 680 300" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M150 380 Q120 420 150 450" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M500 380 Q520 420 500 450" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="380" cy="200" r="20" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="480" cy="160" r="12" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="150" cy="280" r="15" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="600" cy="260" r="10" stroke="currentColor" strokeWidth="1" fill="none"/>
          <circle cx="420" cy="340" r="14" stroke="currentColor" strokeWidth="1" fill="none"/>
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-notrafrik-gold/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-notrafrik-gold/30">
              <GraduationCap className="w-4 h-4 text-notrafrik-gold" />
              <span className="text-notrafrik-gold">{copy.heroBadge}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {heroTitle}{" "}
              <span className="text-notrafrik-gold">{copy.heroTitleEmphasis}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
              {heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-notrafrik-gold text-notrafrik-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-xl">
                {copy.startJourney}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                <BookOpen className="w-5 h-5" />
                {copy.browseCourses}
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
            {copy.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl md:text-4xl font-heading font-extrabold text-notrafrik-gold">{s.num}</div>
                <div className="text-sm text-white/50 mt-1">{s.label}</div>
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {copy.services.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card group hover:-translate-y-1.5 transition-all duration-300 border-none shadow-md hover:shadow-xl">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-gray-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi nous choisir ───────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {copy.whyUsTitle}
            </h2>
            <div className="w-20 h-1 bg-notrafrik-gold mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {copy.whyUsItems.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group">
                <div className={`absolute -top-4 left-8 w-10 h-10 ${color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="mt-4">
                  <h3 className="font-heading font-semibold text-lg text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destinations ────────────────────────────────────────── */}
      {destinations && destinations.length > 0 && (
        <section className="py-20 bg-white">
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-notrafrik-navy to-notrafrik-light flex items-center justify-center text-xl font-bold text-white">
                      {dest.code}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-gray-900">{dest.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{getLocalizedValue(dest.description, dest.descriptionFr)}</p>
                  <div className="mt-4 text-notrafrik-navy text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    {copy.learnMore} <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-notrafrik-gold text-notrafrik-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg">
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
