import { Link } from "react-router-dom";
import { useDestinations } from "../hooks/useApi";
import { useI18n } from "../context/LanguageContext";
import { ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function DestinationsPage() {
  const { data: destinations, isLoading } = useDestinations();
  const { isFrench } = useI18n();

  const copy = isFrench
    ? {
        title: "Destinations de voyage",
        subtitle: "Explorez les pays disponibles et commencez a planifier votre projet a l'etranger.",
        cta: "Voir les details et les cours",
      }
    : {
        title: "Travel Destinations",
        subtitle: "Explore our available destinations and start planning your future abroad.",
        cta: "View courses and details",
      };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">{copy.title}</h1>
        <p className="text-gray-500">
          {copy.subtitle}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations?.map((dest) => (
          <Link to={`/destinations/${dest.id}`} key={dest.id} className="card group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-xl font-bold text-primary-700">
                {dest.code}
              </div>
              <div>
                <h3 className="font-heading font-semibold text-lg text-gray-900">{dest.name}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{dest.description}</p>
            <div className="text-primary-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              {copy.cta} <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
