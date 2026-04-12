// ─── User ─────────────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: "customer" | "admin" | "staff";
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type ProfileDocumentCategory = "cv" | "identity" | "education" | "finance" | "travel" | "general";

export interface ProfileDocument {
  id: string;
  userId: string;
  name: string;
  category: ProfileDocumentCategory;
  fileUrl: string;
  fileType: string;
  notes?: string | null;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Destination ──────────────────────────────────────────────────
export interface Destination {
  id: string;
  name: string;
  code: string;
  flagUrl?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  languageCourses?: LanguageCourse[];
}

// ─── Procedure ────────────────────────────────────────────────────
export interface ProcedureType {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
}

export type ProcedureStatus =
  | "pending"
  | "documents_review"
  | "in_progress"
  | "approved"
  | "rejected"
  | "completed";

export interface Procedure {
  id: string;
  userId: string;
  procedureTypeId: string;
  destinationId: string;
  status: ProcedureStatus;
  agreedPrice: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  procedureType: ProcedureType;
  destination: Destination;
  updates: ProcedureUpdate[];
  documents?: ProcedureDocument[];
  payments?: Payment[];
  user?: Pick<User, "id" | "firstName" | "lastName" | "email" | "phone">;
}

export interface ProcedureUpdate {
  id: string;
  procedureId: string;
  title: string;
  message: string;
  createdAt: string;
}

export interface ProcedureDocument {
  id: string;
  procedureId: string;
  name: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

// ─── Language Course ──────────────────────────────────────────────
export interface LanguageCourse {
  id: string;
  destinationId: string;
  language: string;
  level: string;
  title: string;
  description?: string;
  schedule?: string;
  price: number;
  currency: string;
  maxStudents: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  destination?: Destination;
  _count?: { enrollments: number };
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: "enrolled" | "in_progress" | "completed" | "dropped";
  enrolledAt: string;
  completedAt?: string;
  course: LanguageCourse;
}

export interface Payment {
  id: string;
  procedureId: string;
  amount: number;
  currency: string;
  note?: string;
  paidAt: string;
  createdAt: string;
}

export interface AdminFinanceOverview {
  totalContractValue: number;
  totalCollected: number;
  totalOutstanding: number;
  paymentCount: number;
  procedureCount: number;
  customersWithBalance: number;
}

export interface AdminFinanceClientSummary {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  procedureCount: number;
  totalContractValue: number;
  totalPaid: number;
  totalOutstanding: number;
  currency: string;
  lastPaymentAt?: string;
}

export interface AdminFinancePaymentRow {
  id: string;
  receiptNumber: string;
  amount: number;
  currency: string;
  note?: string;
  paidAt: string;
  createdAt: string;
  procedureId: string;
  procedureStatus: string;
  procedureTypeName: string;
  destinationName: string;
  client: Pick<User, "id" | "firstName" | "lastName" | "email" | "phone">;
}

export interface AdminFinanceProcedureBalance {
  procedureId: string;
  createdAt: string;
  status: string;
  agreedPrice: number;
  currency: string;
  totalPaid: number;
  remainingBalance: number;
  lastPaymentAt?: string;
  procedureTypeName: string;
  destinationName: string;
  client: Pick<User, "id" | "firstName" | "lastName" | "email" | "phone">;
}

export interface AdminFinanceSnapshot {
  overview: AdminFinanceOverview;
  clients: AdminFinanceClientSummary[];
  payments: AdminFinancePaymentRow[];
  procedures: AdminFinanceProcedureBalance[];
}

export interface AdminUserRow extends Pick<User, "id" | "email" | "firstName" | "lastName" | "phone" | "role" | "createdAt"> {
  _count?: {
    procedures: number;
  };
}

// ─── Notifications ────────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "procedure" | "course" | "payment";
  isRead: boolean;
  createdAt: string;
}

// ─── Site Content ─────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  country?: string;
  message: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface SuccessStory {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  destination?: string;
  isPublished: boolean;
  createdAt: string;
}

// ─── Admin Stats ──────────────────────────────────────────────────
export interface AdminStats {
  totalUsers: number;
  totalProcedures: number;
  pendingProcedures: number;
  recentProcedures: Procedure[];
}
