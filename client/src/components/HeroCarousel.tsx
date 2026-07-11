import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Plane, Ticket, MapPin, Package, Shield, Sparkles, Briefcase } from "lucide-react";
import { useI18n } from "../context/LanguageContext";

interface Slide {
  id: string;
  icon: typeof Plane;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  cta: string;
  ctaFr: string;
  gradient: string;
}

const SLIDES: Slide[] = [
  {
    id: "visas",
    icon: Plane,
    title: "Visas & International Mobility",
    titleFr: "Visas & Mobilité Internationale",
    subtitle: "Tourist, business, student & e-visas to 20+ destinations worldwide",
    subtitleFr: "Visas touristiques, affaires, étudiants & e-visas vers 20+ destinations",
    cta: "Explore visa services",
    ctaFr: "Explorer les services visa",
    gradient: "from-notrafrik-navy via-notrafrik-light to-blue-900",
  },
  {
    id: "tourism",
    icon: MapPin,
    title: "Tourism & Organized Trips",
    titleFr: "Tourisme & Séjours Organisés",
    subtitle: "Custom tours, group & VIP travel — Dubai, Egypt, Seychelles, Singapore & more",
    subtitleFr: "Circuits personnalisés, voyages VIP — Dubaï, Égypte, Seychelles, Singapour & plus",
    cta: "Discover destinations",
    ctaFr: "Découvrir les destinations",
    gradient: "from-emerald-800 via-emerald-700 to-teal-900",
  },
  {
    id: "ticketing",
    icon: Ticket,
    title: "Ticketing & Reservations",
    titleFr: "Billetterie & Réservations",
    subtitle: "Flight tickets, discounted hotels worldwide, and vehicle rentals — all destinations",
    subtitleFr: "Billets d'avion, hôtels à prix réduits, location de véhicules — toutes destinations",
    cta: "Book now",
    ctaFr: "Réserver maintenant",
    gradient: "from-amber-700 via-orange-600 to-red-800",
  },
  {
    id: "logistics",
    icon: Package,
    title: "Import-Export & Logistics",
    titleFr: "Achats, Import-Export & Logistique",
    subtitle: "Purchasing, air & sea freight, customs clearance — China, Dubai, Europe, USA to Cameroon",
    subtitleFr: "Achats, fret aérien & maritime, dédouanement — Chine, Dubaï, Europe, USA vers Cameroun",
    cta: "View logistics",
    ctaFr: "Voir la logistique",
    gradient: "from-purple-900 via-purple-700 to-indigo-900",
  },
  {
    id: "events",
    icon: Sparkles,
    title: "Event Services",
    titleFr: "Événementiel",
    subtitle: "Weddings, birthdays, corporate events, product launches — full coordination",
    subtitleFr: "Mariages, anniversaires, événements corporate, lancements — coordination complète",
    cta: "Plan your event",
    ctaFr: "Planifier votre événement",
    gradient: "from-pink-800 via-rose-700 to-red-800",
  },
];

export default function HeroCarousel() {
  const { isFrench } = useI18n();
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const total = SLIDES.length;

  const goTo = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(index);
  }, [isTransitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  // Reset transition lock after animation completes
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 600);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const slide = SLIDES[current];
  const Icon = slide.icon;

  const getTitle = (s: Slide) => (isFrench ? s.titleFr : s.title);
  const getSubtitle = (s: Slide) => (isFrench ? s.subtitleFr : s.subtitle);
  const getCta = (s: Slide) => (isFrench ? s.ctaFr : s.cta);

  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${slide.gradient} text-white transition-all duration-700`}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMjUiPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-28 relative">
        <div className="max-w-2xl animate-fade-in" key={current}>
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <Icon className="w-4 h-4 text-notrafrik-gold" />
            <span className="text-notrafrik-gold">{getTitle(slide)}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {getTitle(slide)}
          </h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-xl">
            {getSubtitle(slide)}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/services#${slide.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-notrafrik-gold text-notrafrik-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-xl"
            >
              {getCta(slide)}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Cours de langue
            </Link>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          type="button"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-notrafrik-gold w-6" : "bg-white/30 hover:bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
