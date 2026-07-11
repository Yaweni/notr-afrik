import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "../context/LanguageContext";
import NotrAfrikLogo from "./NotrAfrikLogo";

export default function Footer() {
  const { isFrench } = useI18n();
  const copy = isFrench
    ? {
        tagline: "Centre linguistique & accompagnement international. De l'Afrique a l'international, votre succes commence ici.",
        quickLinks: "Liens utiles",
        destinations: "Destinations",
        courses: "Cours de langue",
        services: "Services",
        getStarted: "Commencer",
        servicesTitle: "Services",
        serviceItems: ["Visas & Mobilite", "Billetterie & Reservations", "Tourisme & Sejours", "Import-Export", "Securite & Equipements", "Evenementiel"],
        contact: "Contact",
        location: "Douala, Cameroun",
        locations: ["Bonaberi", "Deido", "Makepe"],
        whatsapp1: "691 706 281",
        whatsapp2: "675 538 218",
        email: "info@notr-afrik.com",
        hours: "Lundi - Vendredi, 8h - 20h",
        rights: "Tous droits reserves.",
        privacy: "Politique de confidentialite",
        terms: "Conditions d'utilisation",
      }
    : {
        tagline: "Language center & international support. From Africa to the world, your success starts here.",
        quickLinks: "Quick Links",
        destinations: "Destinations",
        courses: "Courses",
        services: "Services",
        getStarted: "Get Started",
        servicesTitle: "Services",
        serviceItems: ["Visas & Mobility", "Ticketing & Reservations", "Tourism & Trips", "Import-Export", "Security & Equipment", "Event Services"],
        contact: "Contact",
        location: "Douala, Cameroon",
        locations: ["Bonaberi", "Deido", "Makepe"],
        whatsapp1: "691 706 281",
        whatsapp2: "675 538 218",
        email: "info@notr-afrik.com",
        hours: "Monday - Friday, 8h - 20h",
        rights: "All rights reserved.",
        privacy: "Privacy Policy",
        terms: "Terms of Service",
      };

  return (
    <footer className="bg-notrafrik-navy text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <NotrAfrikLogo className="h-10 w-auto mb-4" />
            <p className="text-sm text-gray-400 leading-relaxed">
              {copy.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">{copy.quickLinks}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations" className="hover:text-notrafrik-gold transition-colors">{copy.destinations}</Link></li>
              <li><Link to="/courses" className="hover:text-notrafrik-gold transition-colors">{copy.courses}</Link></li>
              <li><Link to="/services" className="hover:text-notrafrik-gold transition-colors">{copy.services}</Link></li>
              <li><Link to="/register" className="hover:text-notrafrik-gold transition-colors">{copy.getStarted}</Link></li>
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
              {copy.locations.map((loc) => (
                <li key={loc} className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-notrafrik-gold flex-shrink-0" />
                  {loc}
                </li>
              ))}
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-notrafrik-gold flex-shrink-0" />
                {copy.hours}
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-notrafrik-gold flex-shrink-0" />
                +237 {copy.whatsapp1}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-notrafrik-gold flex-shrink-0" />
                +237 {copy.whatsapp2}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-notrafrik-gold flex-shrink-0" />
                {copy.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} NOTR-AFRIK. {copy.rights}</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">{copy.privacy}</a>
            <a href="#" className="hover:text-gray-300">{copy.terms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
