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
  // Unsplash photo URL (1920x900, optimized, auto-format)
  image: string;
  imageCredit: string;
}

// ─── Unsplash photos (free to use under Unsplash License) ──────────
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
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&h=900&fit=crop&q=80&auto=format",
    imageCredit: "Daniel Klein",
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
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=900&fit=crop&q=80&auto=format",
    imageCredit: "Denys Nevozhai",
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
    image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1920&h=900&fit=crop&q=80&auto=format",
    imageCredit: "Ashim D Silva",
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
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&h=900&fit=crop&q=80&auto=format",
    imageCredit: "Chuttersnap",
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
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=900&fit=crop&q=80&auto=format",
    imageCredit: "Aaron Burden",
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

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 700);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const currentSlide = SLIDES[current];
  const CurrentIcon = currentSlide.icon;
  const getTitle = (s: Slide) => (isFrench ? s.titleFr : s.title);
  const getSubtitle = (s: Slide) => (isFrench ? s.subtitleFr : s.subtitle);
  const getCta = (s: Slide) => (isFrench ? s.ctaFr : s.cta);

  return (
    <section className="relative overflow-hidden text-white h-[560px] md:h-[640px]">
      {/* Background images — all rendered, opacity toggled for crossfade */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.id}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
          style={{
            backgroundImage: `url(${slide.image})`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-notrafrik-navy/85 via-notrafrik-navy/65 to-notrafrik-navy/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-notrafrik-navy/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full relative flex flex-col justify-center">
        <div key={current} className="max-w-2xl animate-fade-in">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <CurrentIcon className="w-4 h-4 text-notrafrik-gold" />
            <span className="text-notrafrik-gold">{getTitle(currentSlide)}</span>
          </div>
          <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            {getTitle(currentSlide)}
          </h1>
          <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-xl">
            {getSubtitle(currentSlide)}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/services#${currentSlide.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-notrafrik-gold text-notrafrik-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg hover:shadow-xl"
            >
              {getCta(currentSlide)}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              {isFrench ? "Voir tous les services" : "View all services"}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20 z-10"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center transition-all border border-white/20 z-10"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === current ? "bg-notrafrik-gold w-6" : "bg-white/40 hover:bg-white/60"}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Photo credit (bottom-right, subtle) */}
      <div className="absolute bottom-2 right-3 text-[10px] text-white/40 z-10">
        Photo: {currentSlide.imageCredit} / Unsplash
      </div>
    </section>
  );
}
