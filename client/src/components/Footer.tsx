import { Globe, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
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
              Your trusted immigration partner in Cameroon. Guiding you to your dream destination since 2015.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinations" className="hover:text-cameroon-yellow transition-colors">Destinations</Link></li>
              <li><Link to="/courses" className="hover:text-cameroon-yellow transition-colors">Language Courses</Link></li>
              <li><Link to="/procedures" className="hover:text-cameroon-yellow transition-colors">Our Services</Link></li>
              <li><Link to="/register" className="hover:text-cameroon-yellow transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>Student Visas</li>
              <li>Work Permits</li>
              <li>Family Reunification</li>
              <li>Language Training</li>
              <li>Document Preparation</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cameroon-yellow flex-shrink-0" />
                Douala, Cameroon
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
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} ImmigrationCM. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
