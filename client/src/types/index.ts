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

export interface PathwayRequirement {
  id: string;
  procedureTypeId: string;
  title: string;
  titleFr?: string | null;
  description: string;
  descriptionFr?: string | null;
  section: string;
  audience: "public" | "customer" | "both";
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PathwayResource {
  id: string;
  procedureTypeId: string;
  label: string;
  labelFr?: string | null;
  url: string;
  provider?: string | null;
  providerFr?: string | null;
  resourceType: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface PathwayCourseRecommendation {
  id: string;
  procedureTypeId: string;
  courseId: string;
  rationale?: string | null;
  rationaleFr?: string | null;
  priority: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  course: LanguageCourse;
}

export interface DestinationFeaturedPathway {
  id: string;
  name: string;
  nameFr?: string | null;
  slug?: string | null;
  category: string;
  description?: string | null;
  descriptionFr?: string | null;
  officialProgramName?: string | null;
  officialProgramNameFr?: string | null;
  estimatedTimeline?: string | null;
  estimatedTimelineFr?: string | null;
  isFeatured: boolean;
}

// ─── Destination ──────────────────────────────────────────────────
export interface Destination {
  id: string;
  name: string;
  code: string;
  flagUrl?: string;
  description?: string;
  descriptionFr?: string | null;
  isActive: boolean;
  createdAt: string;
  languageCourses?: LanguageCourse[];
  pathways?: ProcedureType[];
  pathwayCount?: number;
  featuredPathways?: DestinationFeaturedPathway[];
}

// ─── Procedure ────────────────────────────────────────────────────
export interface ProcedureType {
  id: string;
  destinationId?: string | null;
  slug?: string | null;
  category: string;
  name: string;
  nameFr?: string | null;
  description?: string;
  descriptionFr?: string | null;
  publicSummary?: string | null;
  publicSummaryFr?: string | null;
  officeSummary?: string | null;
  officeSummaryFr?: string | null;
  officialProgramName?: string | null;
  officialProgramNameFr?: string | null;
  officialWebsiteUrl?: string | null;
  officialWebsiteLabel?: string | null;
  officialWebsiteLabelFr?: string | null;
  estimatedTimeline?: string | null;
  estimatedTimelineFr?: string | null;
  price: number;
  currency: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
  destination?: Destination;
  requirements?: PathwayRequirement[];
  resources?: PathwayResource[];
  courseRecommendations?: PathwayCourseRecommendation[];
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
  titleFr?: string | null;
  message: string;
  messageFr?: string | null;
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
  titleFr?: string | null;
  description?: string;
  descriptionFr?: string | null;
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
  titleFr?: string | null;
  message: string;
  messageFr?: string | null;
  type: "info" | "success" | "warning" | "procedure" | "course" | "payment";
  isRead: boolean;
  createdAt: string;
}

// ─── Site Content ─────────────────────────────────────────────────
export interface Testimonial {
  id: string;
  name: string;
  country?: string;
  countryFr?: string | null;
  message: string;
  messageFr?: string | null;
  avatarUrl?: string;
  isActive: boolean;
}

export interface SuccessStory {
  id: string;
  title: string;
  titleFr?: string | null;
  summary: string;
  summaryFr?: string | null;
  content: string;
  contentFr?: string | null;
  imageUrl?: string;
  destination?: string;
  destinationFr?: string | null;
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
