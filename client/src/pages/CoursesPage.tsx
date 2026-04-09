import { useState } from "react";
import { useCourses, useDestinations, useEnrollInCourse } from "../hooks/useApi";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, Users } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

export default function CoursesPage() {
  const [filters, setFilters] = useState<{ destination?: string; language?: string; level?: string }>({});
  const { data: courses, isLoading } = useCourses(filters);
  const { data: destinations } = useDestinations();
  const { isAuthenticated } = useAuth();
  const enrollMutation = useEnrollInCourse();

  const handleEnroll = async (courseId: string) => {
    if (!isAuthenticated) { toast.error("Please log in to enroll"); return; }
    try {
      await enrollMutation.mutateAsync(courseId);
      toast.success("Enrolled successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Enrollment failed");
    }
  };

  const languages = [...new Set(courses?.map((c) => c.language) ?? [])];
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">Language Courses</h1>
        <p className="text-gray-500">Prepare for your destination with our certified language programs.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <select className="input-field !w-auto" value={filters.destination ?? ""} onChange={(e) => setFilters((p) => ({ ...p, destination: e.target.value || undefined }))}>
          <option value="">All Destinations</option>
          {destinations?.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <select className="input-field !w-auto" value={filters.language ?? ""} onChange={(e) => setFilters((p) => ({ ...p, language: e.target.value || undefined }))}>
          <option value="">All Languages</option>
          {languages.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select className="input-field !w-auto" value={filters.level ?? ""} onChange={(e) => setFilters((p) => ({ ...p, level: e.target.value || undefined }))}>
          <option value="">All Levels</option>
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
                <span className="badge bg-emerald-100 text-emerald-700">{course.language}</span>
                <span className="badge bg-primary-100 text-primary-700">{course.level}</span>
              </div>
              <h3 className="font-heading font-semibold text-lg text-gray-900 mb-1">{course.title}</h3>
              {course.destination && <p className="text-xs text-gray-400 mb-3">For {course.destination.name}</p>}
              <p className="text-sm text-gray-500 mb-4">{course.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" />{new Date(course.startDate).toLocaleDateString()}</div>
                <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" />{course.schedule}</div>
                <div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" />{course._count?.enrollments ?? 0}/{course.maxStudents}</div>
                <div className="font-semibold text-cameroon-green">{course.price.toLocaleString()} XAF</div>
              </div>
              <button onClick={() => handleEnroll(course.id)} disabled={enrollMutation.isPending} className="btn-primary w-full text-sm">
                Enroll Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 py-12">No courses match your filters.</p>
      )}
    </div>
  );
}
