import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";

export default function Footer() {
  const { isFrench } = useI18n();
  const copy = isFrench
    ? {
        tagline: "Votre partenaire immigration de confiance au Cameroun. Nous rendons le depart a l'etranger plus clair depuis 2015.",
        quickLinks: "Liens utiles",
        destinations: "Destinations",
        courses: "Cours de langue",
        services: "Parcours",
        getStarted: "Commencer",
        servicesTitle: "Services",
        serviceItems: ["Visa etudiant", "Permis de travail", "Regroupement familial", "Formation linguistique", "Preparation des dossiers"],
        contact: "Contact",
        location: "Douala, Cameroun",
        rights: "Tous droits reserves.",
        privacy: "Politique de confidentialite",
        terms: "Conditions d'utilisation",
      }
    : {
        tagline: "Your trusted immigration partner in Cameroon. Guiding you to your dream destination since 2015.",
        quickLinks: "Quick Links",
        destinations: "Destinations",
        courses: "Language Courses",
        services: "Journeys",
        getStarted: "Get Started",
        servicesTitle: "Services",
        serviceItems: ["Student Visas", "Work Permits", "Family Reunification", "Language Training", "Document Preparation"],
        contact: "Contact Us",
        location: "Douala, Cameroon",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cameroon-green to-cameroon-yellow flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-lg text-white">
                Immigration<span className="text-cameroon-yellow">CM</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {copy.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{copy.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations" className="hover:text-cameroon-yellow transition-colors">{copy.destinations}</Link></li>
              <li><Link to="/courses" className="hover:text-cameroon-yellow transition-colors">{copy.courses}</Link></li>
              <li><Link to="/procedures" className="hover:text-cameroon-yellow transition-colors">{copy.services}</Link></li>
              <li><Link to="/register" className="hover:text-cameroon-yellow transition-colors">{copy.getStarted}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{copy.servicesTitle}</h4>
            <ul className="space-y-2 text-sm">
              {copy.serviceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{copy.contact}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cameroon-yellow flex-shrink-0" />
                {copy.location}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cameroon-yellow flex-shrink-0" />
                +237 6XX XXX XXX
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cameroon-yellow flex-shrink-0" />
                info@immigration-cm.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ImmigrationCM. {copy.rights}</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">{copy.privacy}</a>
            <a href="#" className="hover:text-gray-300">{copy.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
