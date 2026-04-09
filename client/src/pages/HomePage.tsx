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

export default function HomePage() {
  const { data: content } = useSiteContent();
  const { data: testimonials } = useTestimonials();
  const { data: stories } = useSuccessStories();
  const { data: destinations } = useDestinations();

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-cameroon-green text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
              <Plane className="w-4 h-4" />
              Cameroon&apos;s #1 Immigration Partner
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              {content?.hero_title || "Your Journey Abroad Starts Here"}
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
              {content?.hero_subtitle ||
                "Expert visa processing, language training, and end-to-end immigration solutions for Cameroonians dreaming of a life abroad."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-cameroon-yellow text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/destinations" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
                Explore Destinations
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10">
            {[
              { num: "2,000+", label: "Successful Visas" },
              { num: "6+", label: "Destinations" },
              { num: "500+", label: "Language Students" },
              { num: "95%", label: "Success Rate" },
            ].map((s) => (
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
              Everything You Need to Travel
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              From visa applications to language preparation, we handle every step of your immigration journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: FileCheck, title: "Visa Processing", desc: "Student, work, tourist, and family reunification visas for all major destinations.", color: "from-blue-500 to-blue-600" },
              { icon: GraduationCap, title: "Language Courses", desc: "English, French, German — all levels from A1 to C2 with certified instructors.", color: "from-emerald-500 to-emerald-600" },
              { icon: Globe, title: "Travel Guidance", desc: "End-to-end support from document prep to settling in your new country.", color: "from-purple-500 to-purple-600" },
              { icon: Shield, title: "Expert Consulting", desc: "Personalized consulting to find the best immigration pathway for your goals.", color: "from-amber-500 to-amber-600" },
            ].map(({ icon: Icon, title, desc, color }) => (
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
                Popular Destinations
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Discover your next chapter in these incredible countries.
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
                    Learn more <ArrowRight className="w-4 h-4" />
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
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {content?.mission_statement ||
                  "We are committed to making international mobility accessible to every Cameroonian."}
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                {content?.about_text ||
                  "Founded in Douala, our immigration office has helped thousands of Cameroonians successfully relocate."}
              </p>
              <ul className="space-y-3">
                {[
                  "Transparent and honest guidance",
                  "Affordable fees with no hidden costs",
                  "Certified language instructors",
                  "Partnerships with embassies worldwide",
                ].map((item) => (
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
                  <h3 className="font-heading text-2xl font-bold text-gray-900 mb-2">Proudly Cameroonian</h3>
                  <p className="text-gray-500">Serving the community since 2015</p>
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
                What Our Clients Say
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
                      {t.country && <div className="text-xs text-gray-400">Relocated to {t.country}</div>}
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
                Success Stories
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
            Ready to Start Your Journey?
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of Cameroonians who have successfully achieved their dreams of traveling and living abroad.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-cameroon-yellow text-gray-900 font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg">
              Create Your Account
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/courses" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20">
              <BookOpen className="w-5 h-5" />
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
