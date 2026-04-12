import { useParams, Link } from "react-router-dom";
import { useDestination } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/LanguageContext";
import { useEnrollInCourse } from "../hooks/useApi";
import { Calendar, Clock, Users, ArrowLeft, BookOpen } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dest, isLoading } = useDestination(id!);
  const { isAuthenticated } = useAuth();
  const { isFrench, formatCurrency, formatDate } = useI18n();
  const enrollMutation = useEnrollInCourse();

  const copy = isFrench
    ? {
        loginToEnroll: "Connectez-vous pour vous inscrire",
        enrolled: "Inscription reussie !",
        enrollFailed: "L'inscription a echoue",
        notFound: "Destination introuvable",
        back: "Retour aux destinations",
        availableCourses: "Cours de langue disponibles",
        max: "Max",
        enrolling: "Inscription...",
        enrollNow: "S'inscrire",
        noCourses: "Aucun cours n'est encore disponible pour cette destination.",
      }
    : {
        loginToEnroll: "Please log in to enroll",
        enrolled: "Enrolled successfully!",
        enrollFailed: "Enrollment failed",
        notFound: "Destination not found",
        back: "Back to destinations",
        availableCourses: "Available Language Courses",
        max: "Max",
        enrolling: "Enrolling...",
        enrollNow: "Enroll Now",
        noCourses: "No courses available for this destination yet.",
      };

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) {
      toast.error(copy.loginToEnroll);
      return;
    }
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success(copy.enrolled);
    } catch (err: any) {
      toast.error(err.response?.data?.error || copy.enrollFailed);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!dest) return <div className="text-center py-20 text-gray-500">{copy.notFound}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/destinations" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" /> {copy.back}
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-2xl font-bold text-primary-700">
          {dest.code}
        </div>
        <div>
          <h1 className="font-heading text-3xl font-bold text-gray-900">{dest.name}</h1>
          <p className="text-gray-500">{dest.description}</p>
        </div>
      </div>

      {/* Courses */}
      <div className="mb-6">
        <h2 className="font-heading text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary-500" />
          {copy.availableCourses}
        </h2>
      </div>

      {dest.languageCourses && dest.languageCourses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {dest.languageCourses.map((course) => (
            <div key={course.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-lg text-gray-900">{course.title}</h3>
                <span className="badge bg-primary-100 text-primary-700">{course.level}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4">{course.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{formatDate(course.startDate)}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" />{course.schedule}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" />{copy.max} {course.maxStudents}</div>
                <div className="font-semibold text-cameroon-green">{formatCurrency(course.price, course.currency)}</div>
              </div>
              <button onClick={() => handleEnroll(course.id)} disabled={enrollMutation.isPending} className="btn-primary w-full text-sm">
                {enrollMutation.isPending ? copy.enrolling : copy.enrollNow}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">{copy.noCourses}</p>
      )}
    </div>
  );
}
