import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { Destination, ProcedureType, Procedure, LanguageCourse, Enrollment, Notification, Testimonial, SuccessStory, AdminStats, AdminFinanceSnapshot } from "../types";

// ─── Destinations ─────────────────────────────────────────────────

export function useDestinations() {
  return useQuery<Destination[]>({
    queryKey: ["destinations"],
    queryFn: () => api.get("/destinations").then((r) => r.data),
  });
}

export function useDestination(id: string) {
  return useQuery<Destination>({
    queryKey: ["destinations", id],
    queryFn: () => api.get(`/destinations/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

// ─── Procedure Types ──────────────────────────────────────────────

export function useProcedureTypes() {
  return useQuery<ProcedureType[]>({
    queryKey: ["procedureTypes"],
    queryFn: () => api.get("/procedures/types").then((r) => r.data),
  });
}

// ─── Procedures ───────────────────────────────────────────────────

export function useMyProcedures() {
  return useQuery<Procedure[]>({
    queryKey: ["procedures", "mine"],
    queryFn: () => api.get("/procedures/mine").then((r) => r.data),
  });
}

export function useProcedure(id: string) {
  return useQuery<Procedure>({
    queryKey: ["procedures", id],
    queryFn: () => api.get(`/procedures/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateProcedure() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { procedureTypeId: string; destinationId: string; notes?: string }) =>
      api.post("/procedures", data).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["procedures"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── Courses ──────────────────────────────────────────────────────

export function useCourses(params?: { destination?: string; language?: string; level?: string }) {
  return useQuery<LanguageCourse[]>({
    queryKey: ["courses", params],
    queryFn: () => api.get("/courses", { params }).then((r) => r.data),
  });
}

export function useCourse(id: string) {
  return useQuery<LanguageCourse>({
    queryKey: ["courses", id],
    queryFn: () => api.get(`/courses/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useMyEnrollments() {
  return useQuery<Enrollment[]>({
    queryKey: ["enrollments", "mine"],
    queryFn: () => api.get("/courses/enrollments/mine").then((r) => r.data),
  });
}

export function useEnrollInCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (courseId: string) => api.post(`/courses/${courseId}/enroll`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollments"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── Notifications ────────────────────────────────────────────────

export function useNotifications() {
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: () => api.get("/notifications").then((r) => r.data),
  });
}

export function useUnreadCount() {
  return useQuery<{ count: number }>({
    queryKey: ["notifications", "unread"],
    queryFn: () => api.get("/notifications/unread-count").then((r) => r.data),
    refetchInterval: 30000, // Poll every 30s
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api.patch("/notifications/read-all").then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

// ─── Public Content ───────────────────────────────────────────────

export function useSiteContent() {
  return useQuery<Record<string, string>>({
    queryKey: ["siteContent"],
    queryFn: () => api.get("/admin/content").then((r) => r.data),
    staleTime: 1000 * 60 * 30, // Cache 30 min
  });
}

export function useTestimonials() {
  return useQuery<Testimonial[]>({
    queryKey: ["testimonials"],
    queryFn: () => api.get("/admin/testimonials").then((r) => r.data),
    staleTime: 1000 * 60 * 30,
  });
}

export function useSuccessStories() {
  return useQuery<SuccessStory[]>({
    queryKey: ["successStories"],
    queryFn: () => api.get("/admin/success-stories").then((r) => r.data),
    staleTime: 1000 * 60 * 30,
  });
}

// ─── Admin ────────────────────────────────────────────────────────

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin", "stats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });
}

export function useAdminFinance() {
  return useQuery<AdminFinanceSnapshot>({
    queryKey: ["admin", "finance"],
    queryFn: () => api.get("/admin/finance").then((r) => r.data),
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => api.get("/admin/users").then((r) => r.data),
  });
}

export function useAdminProcedures(params?: { status?: string; page?: number }) {
  return useQuery({
    queryKey: ["admin", "procedures", params],
    queryFn: () => api.get("/procedures", { params }).then((r) => r.data),
  });
}

export function useUpdateProcedureStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, message }: { id: string; status: string; message?: string }) =>
      api.patch(`/procedures/${id}/status`, { status, message }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["procedures"] });
      qc.invalidateQueries({ queryKey: ["admin", "procedures"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
  });
}

export function useAddProcedurePayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount, note, paidAt }: { id: string; amount: number; note?: string; paidAt?: string }) =>
      api.post(`/procedures/${id}/payments`, { amount, note, paidAt }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["procedures"] });
      qc.invalidateQueries({ queryKey: ["admin", "procedures"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useAddProcedureDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, fileUrl, fileType }: { id: string; name: string; fileUrl: string; fileType?: string }) =>
      api.post(`/procedures/${id}/documents`, { name, fileUrl, fileType }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["procedures"] });
      qc.invalidateQueries({ queryKey: ["admin", "procedures"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      qc.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useAdminEnrollments() {
  return useQuery({
    queryKey: ["admin", "enrollments"],
    queryFn: () => api.get("/courses/enrollments/all").then((r) => r.data),
  });
}
