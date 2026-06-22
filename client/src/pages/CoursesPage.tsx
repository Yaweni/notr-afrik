import { useState } from "react";
import { useCourses, useDestinations, useEnrollInCourse } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { Calendar, Clock, Users } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

function formatLanguage(language: string, isFrench: boolean) {
  const labels = isFrench
    ? { English: "Anglais", French: "Francais", German: "Allemand" }
    : { English: "English", French: "French", German: "German" };

  return labels[language as keyof typeof labels] ?? language;
}

export default function CoursesPage() {
  const [filters, setFilters] = useState<{ destination?: string; language?: string; level?: string }>({});
  const { data: courses, isLoading } = useCourses(filters);
  const { data: destinations } = useDestinations();
  const { isAuthenticated } = useAuth();
  const { isFrench, formatCurrency, formatDate, getLocalizedValue } = useI18n();
  const enrollMutation = useEnrollInCourse();

  const copy = isFrench
    ? {
        loginToEnroll: "Connectez-vous pour vous inscrire",
        enrolled: "Inscription reussie !",
        enrollFailed: "L'inscription a echoue",
        title: "Cours de langue",
        subtitle: "Preparez votre destination avec des cours orientes immigration.",
        allDestinations: "Toutes les destinations",
        allLanguages: "Toutes les langues",
        allLevels: "Tous les niveaux",
        forDestination: "Pour {destination}",
        enrollNow: "S'inscrire",
        noResults: "Aucun cours ne correspond a vos filtres.",
      }
    : {
        loginToEnroll: "Please log in to enroll",
        enrolled: "Enrolled successfully!",
        enrollFailed: "Enrollment failed",
        title: "Language Courses",
        subtitle: "Prepare for your destination with our certified language programs.",
        allDestinations: "All Destinations",
        allLanguages: "All Languages",
        allLevels: "All Levels",
        forDestination: "For {destination}",
        enrollNow: "Enroll Now",
        noResults: "No courses match your filters.",
      };

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) { toast.error(copy.loginToEnroll); return; }
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success(copy.enrolled);
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.enrollFailed);
    }
  };

  const languages = [...new Set(courses?.map((c) => c.language) ?? [])];
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="mb-2 font-heading text-3xl font-bold text-foreground">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select className="input-field !w-auto" value={filters.destination ?? ""} onChange={(e) => setFilters((p) => ({ ...p, destination: e.target.value || undefined }))}>
          <option value="">{copy.allDestinations}</option>
          {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="input-field !w-auto" value={filters.language ?? ""} onChange={(e) => setFilters((p) => ({ ...p, language: e.target.value || undefined }))}>
          <option value="">{copy.allLanguages}</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input-field !w-auto" value={filters.level ?? ""} onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value || undefined }))}>
          <option value="">{copy.allLevels}</option>
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : courses && courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="badge bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">{formatLanguage(course.language, isFrench)}</span>
                <span className="badge bg-primary-100 text-primary-700 dark:bg-primary/20 dark:text-primary-foreground">{course.level}</span>
              </div>
              <h3 className="mb-1 font-heading text-lg font-semibold text-foreground">{getLocalizedValue(course.title, course.titleFr)}</h3>
              {course.destination && <p className="mb-3 text-xs text-muted-foreground">{copy.forDestination.replace("{destination}", course.destination.name)}</p>}
              <p className="mb-4 text-sm text-muted-foreground">{getLocalizedValue(course.description, course.descriptionFr)}</p>
              <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground" />{formatDate(course.startDate)}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" />{course.schedule}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground" />{course._count?.enrollments ?? 0}/{course.maxStudents}</div>
                <div className="font-semibold text-cameroon-green">{formatCurrency(course.price, course.currency)}</div>
              </div>
              <button onClick={() => handleEnroll(course.id)} disabled={enrollMutation.isPending} className="btn-primary w-full text-sm">
                {copy.enrollNow}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-12 text-center text-muted-foreground">{copy.noResults}</p>
      )}
    </div>
  );
}
