import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Plane,
  Ticket,
  MapPin,
  Package,
  Shield,
  Sparkles,
  Briefcase,
  ChevronDown,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { useI18n } from "../context/LanguageContext";

// ─── Service categories with all client-provided services ──────────

interface ServiceCategory {
  id: string;
  icon: typeof Plane;
  title: string;
  titleFr: string;
  subtitle: string;
  subtitleFr: string;
  color: string;
  services: { fr: string; en: string }[];
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "visas",
    icon: Plane,
    title: "Visas & International Mobility",
    titleFr: "Visas & Mobilité Internationale",
    subtitle: "Tourist, business, student & e-visa processing across 20+ destinations",
    subtitleFr: "Traitement de visas touristiques, affaires, étudiants & e-visas vers 20+ destinations",
    color: "from-notrafrik-navy to-notrafrik-light",
    services: [
      { fr: "Traitement de visa touristique", en: "Tourist visa processing" },
      { fr: "Traitement de visa d'affaires", en: "Business visa processing" },
      { fr: "Assistance visa étudiant — Belgique", en: "Student visa assistance — Belgium" },
      { fr: "Assistance visa étudiant — France", en: "Student visa assistance — France" },
      { fr: "Assistance visa étudiant — Chine", en: "Student visa assistance — China" },
      { fr: "Assistance visa étudiant — Inde", en: "Student visa assistance — India" },
      { fr: "Assistance visa étudiant — Russie", en: "Student visa assistance — Russia" },
      { fr: "Assistance visa étudiant — Afrique du Sud", en: "Student visa assistance — South Africa" },
      { fr: "E-Visas — Dubaï, Qatar, Inde", en: "E-Visas — Dubai, Qatar, India" },
      { fr: "E-Visas — Cameroun, Éthiopie, Côte d'Ivoire", en: "E-Visas — Cameroon, Ethiopia, Ivory Coast" },
      { fr: "E-Visas — Vietnam, Indonésie, Égypte, Zambie", en: "E-Visas — Vietnam, Indonesia, Egypt, Zambia" },
      { fr: "Visas via ambassades — Japon, Chine, Turquie", en: "Embassy visas — Japan, China, Turkey" },
      { fr: "Visas via ambassades — Russie, Tunisie, Afrique du Sud, France, Belgique, Italie", en: "Embassy visas — Russia, Tunisia, South Africa, France, Belgium, Italy" },
    ],
  },
  {
    id: "ticketing",
    icon: Ticket,
    title: "Ticketing & Reservations",
    titleFr: "Billetterie & Réservations",
    subtitle: "Flight tickets, hotels worldwide, and vehicle rentals",
    subtitleFr: "Billets d'avion, hôtels dans le monde entier et location de véhicules",
    color: "from-notrafrik-gold to-amber-400",
    services: [
      { fr: "Réservation et achat de billets d'avion toutes destinations", en: "Flight booking and ticketing — all destinations" },
      { fr: "Réservations d'hôtels moins chers partout dans le monde", en: "Discounted hotel bookings worldwide" },
      { fr: "Réservation d'hôtels pour séjour ou dossier de visa", en: "Hotel reservations for stays or visa applications" },
      { fr: "Location de véhicules à Dubaï (sur demande)", en: "Vehicle rental in Dubai (on request)" },
    ],
  },
  {
    id: "tourism",
    icon: MapPin,
    title: "Tourism & Organized Trips",
    titleFr: "Tourisme & Séjours Organisés",
    subtitle: "Custom tours, group travel, VIP trips across Africa, Asia and the Middle East",
    subtitleFr: "Circuits personnalisés, voyages de groupe et VIP en Afrique, Asie et Moyen-Orient",
    color: "from-emerald-600 to-emerald-400",
    services: [
      { fr: "Organisation complète de séjours touristiques — Dubaï", en: "Complete tour packages — Dubai" },
      { fr: "Organisation complète de séjours touristiques — Égypte", en: "Complete tour packages — Egypt" },
      { fr: "Organisation complète de séjours touristiques — Tanzanie", en: "Complete tour packages — Tanzania" },
      { fr: "Organisation complète de séjours touristiques — Rwanda", en: "Complete tour packages — Rwanda" },
      { fr: "Organisation complète de séjours touristiques — Kenya", en: "Complete tour packages — Kenya" },
      { fr: "Organisation complète de séjours touristiques — Maurice", en: "Complete tour packages — Mauritius" },
      { fr: "Organisation complète de séjours touristiques — Seychelles", en: "Complete tour packages — Seychelles" },
      { fr: "Organisation complète de séjours touristiques — Singapour", en: "Complete tour packages — Singapore" },
      { fr: "Organisation complète de séjours touristiques — Chine", en: "Complete tour packages — China" },
      { fr: "Organisation complète de séjours touristiques — Turquie", en: "Complete tour packages — Turkey" },
      { fr: "Circuits touristiques personnalisés", en: "Custom tour circuits" },
      { fr: "Voyages de groupe et voyages VIP", en: "Group and VIP travel" },
      { fr: "Assistance sur place (selon destination)", en: "On-site assistance (destination dependent)" },
    ],
  },
  {
    id: "logistics",
    icon: Package,
    title: "Import-Export & Logistics",
    titleFr: "Achats, Import-Export & Logistique",
    subtitle: "Purchasing, shipping, customs clearance and supplier payments across 4 continents",
    subtitleFr: "Achats, expédition, dédouanement et paiement fournisseurs sur 4 continents",
    color: "from-purple-600 to-purple-400",
    services: [
      { fr: "Achats et expédition de marchandises — Chine → Cameroun", en: "Purchasing & shipping — China → Cameroon" },
      { fr: "Achats et expédition de marchandises — Dubaï → Cameroun", en: "Purchasing & shipping — Dubai → Cameroon" },
      { fr: "Achats et expédition de marchandises — Europe, USA & Canada → Cameroun", en: "Purchasing & shipping — Europe, USA & Canada → Cameroon" },
      { fr: "Expédition par avion et par bateau", en: "Air and sea freight shipping" },
      { fr: "Suivi des colis et dédouanement", en: "Package tracking and customs clearance" },
      { fr: "Paiement instantané de fournisseurs — Chine, Dubaï, Inde, Turquie", en: "Instant supplier payments — China, Dubai, India, Turkey" },
    ],
  },
  {
    id: "security",
    icon: Shield,
    title: "Security & Equipment",
    titleFr: "Sécurité & Équipements",
    subtitle: "Surveillance cameras, alarms, access control — supply, install & maintain",
    subtitleFr: "Caméras de surveillance, alarmes, contrôle d'accès — fourniture, installation et maintenance",
    color: "from-notrafrik-red to-red-400",
    services: [
      { fr: "Fourniture de matériel de sécurité", en: "Security equipment supply" },
      { fr: "Installation de caméras de surveillance", en: "Surveillance camera installation" },
      { fr: "Maintenance et suivi des systèmes de sécurité", en: "Security system maintenance and monitoring" },
      { fr: "Alarmes, contrôle d'accès, vidéosurveillance", en: "Alarms, access control, video surveillance" },
    ],
  },
  {
    id: "events",
    icon: Sparkles,
    title: "Event Services",
    titleFr: "NAAK SERVICES ÉVÉNEMENTIEL",
    subtitle: "Weddings, birthdays, corporate events, product launches — full coordination",
    subtitleFr: "Mariages, anniversaires, événements corporate, lancements — coordination complète",
    color: "from-cyan-600 to-cyan-400",
    services: [
      { fr: "Organisation de mariages", en: "Wedding planning" },
      { fr: "Organisation d'anniversaires", en: "Birthday party planning" },
      { fr: "Surprises personnalisées", en: "Custom surprises" },
      { fr: "Réunions d'affaires & conférences", en: "Business meetings & conferences" },
      { fr: "Lancements de produits", en: "Product launches" },
      { fr: "Coordination logistique complète (salles, hôtels, transport)", en: "Full logistics coordination (venues, hotels, transport)" },
    ],
  },
  {
    id: "complementary",
    icon: Briefcase,
    title: "Complementary Services",
    titleFr: "Services Complémentaires",
    subtitle: "Administrative support, travel consulting, VIP and bespoke services",
    subtitleFr: "Assistance administrative, conseil voyage, services VIP et sur mesure",
    color: "from-gray-700 to-gray-500",
    services: [
      { fr: "Assistance administrative internationale", en: "International administrative support" },
      { fr: "Conseils voyage & immigration", en: "Travel & immigration consulting" },
      { fr: "Accompagnement personnalisé des clients", en: "Personalized client support" },
      { fr: "Services VIP & sur mesure", en: "VIP & bespoke services" },
    ],
  },
];

export default function ServicesPage() {
  const { isFrench } = useI18n();
  const [expanded, setExpanded] = useState<string | null>(null);

  const copy = isFrench
    ? {
        eyebrow: "NAAK SERVICES",
        title: "Une gamme complète de services pour vous accompagner",
        subtitle: "Des visas à la logistique, en passant par le tourisme et l'événementiel — nous couvrons tous vos besoins internationaux depuis Douala.",
        cta: "Contactez-nous sur WhatsApp",
        expandLabel: "Voir les services",
        collapseLabel: "Réduire",
        countLabel: (n: number) => `${n} service${n > 1 ? "s" : ""}`,
      }
    : {
        eyebrow: "NAAK SERVICES",
        title: "A complete range of services to support you",
        subtitle: "From visas to logistics, tourism to events — we cover all your international needs from Douala.",
        cta: "Contact us on WhatsApp",
        expandLabel: "View services",
        collapseLabel: "Collapse",
        countLabel: (n: number) => `${n} service${n !== 1 ? "s" : ""}`,
      };

  const getTitle = (cat: ServiceCategory) => (isFrench ? cat.titleFr : cat.title);
  const getSubtitle = (cat: ServiceCategory) => (isFrench ? cat.subtitleFr : cat.subtitle);
  const getService = (s: { fr: string; en: string }) => (isFrench ? s.fr : s.en);

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-notrafrik-navy via-notrafrik-light to-notrafrik-navy text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMjUiPjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjEiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-notrafrik-gold/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-notrafrik-gold/30">
              <Briefcase className="w-4 h-4 text-notrafrik-gold" />
              <span className="text-notrafrik-gold">{copy.eyebrow}</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              {copy.title}
            </h1>
            <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl">
              {copy.subtitle}
            </p>
            <div className="flex items-center gap-2 mt-6 text-sm text-white/50">
              <MapPin className="w-4 h-4" />
              Douala — Cameroun
            </div>
          </div>
        </div>
      </section>

      {/* ── Service Categories ──────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isExpanded = expanded === cat.id;
            return (
              <div
                key={cat.id}
                className="card border-border hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isExpanded ? null : cat.id)}
                  className="w-full text-left p-6 flex items-start gap-5"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center shrink-0 mt-0.5`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-heading font-semibold text-lg text-card-foreground">
                        {getTitle(cat)}
                      </h3>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {copy.countLabel(cat.services.length)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {getSubtitle(cat)}
                    </p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t border-border mx-6 animate-fade-in">
                    <ul className="mt-4 space-y-2">
                      {cat.services.map((s, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-card-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-notrafrik-gold shrink-0" />
                          {getService(s)}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-3">
                      <a
                        href="https://wa.me/237691706281"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-notrafrik-gold hover:text-amber-500 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {copy.cta}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-notrafrik-navy to-notrafrik-light text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="max-w-3xl mx-auto px-4 text-center relative">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-4">
            Un service sur mesure vous intéresse ?
          </h2>
          <p className="text-white/70 mb-8">
            Contactez-nous directement par WhatsApp pour un devis gratuit et un accompagnement personnalisé.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/237691706281"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-notrafrik-gold text-notrafrik-navy font-bold rounded-xl hover:bg-amber-400 transition-all shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp : 691 706 281
            </a>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
            >
              Voir les cours de langue
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
