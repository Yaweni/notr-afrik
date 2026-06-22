-- CreateTable
CREATE TABLE "ProcedureTypeRequirement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "procedureTypeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "section" TEXT NOT NULL DEFAULT 'general',
    "audience" TEXT NOT NULL DEFAULT 'both',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcedureTypeRequirement_procedureTypeId_fkey" FOREIGN KEY ("procedureTypeId") REFERENCES "ProcedureType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcedureTypeResource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "procedureTypeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT,
    "resourceType" TEXT NOT NULL DEFAULT 'official',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcedureTypeResource_procedureTypeId_fkey" FOREIGN KEY ("procedureTypeId") REFERENCES "ProcedureType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProcedureTypeCourseRecommendation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "procedureTypeId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rationale" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'recommended',
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcedureTypeCourseRecommendation_procedureTypeId_fkey" FOREIGN KEY ("procedureTypeId") REFERENCES "ProcedureType" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProcedureTypeCourseRecommendation_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "LanguageCourse" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProcedureType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "destinationId" TEXT,
    "slug" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "name" TEXT NOT NULL,
    "description" TEXT,
    "publicSummary" TEXT,
    "officeSummary" TEXT,
    "officialProgramName" TEXT,
    "officialWebsiteUrl" TEXT,
    "officialWebsiteLabel" TEXT,
    "estimatedTimeline" TEXT,
    "price" REAL NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ProcedureType_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "Destination" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_ProcedureType" ("createdAt", "currency", "description", "id", "name", "price", "updatedAt") SELECT "createdAt", "currency", "description", "id", "name", "price", "updatedAt" FROM "ProcedureType";
DROP TABLE "ProcedureType";
ALTER TABLE "new_ProcedureType" RENAME TO "ProcedureType";
CREATE UNIQUE INDEX "ProcedureType_slug_key" ON "ProcedureType"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "ProcedureTypeRequirement_procedureTypeId_sortOrder_idx" ON "ProcedureTypeRequirement"("procedureTypeId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProcedureTypeResource_procedureTypeId_sortOrder_idx" ON "ProcedureTypeResource"("procedureTypeId", "sortOrder");

-- CreateIndex
CREATE INDEX "ProcedureTypeCourseRecommendation_courseId_sortOrder_idx" ON "ProcedureTypeCourseRecommendation"("courseId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "ProcedureTypeCourseRecommendation_procedureTypeId_courseId_key" ON "ProcedureTypeCourseRecommendation"("procedureTypeId", "courseId");
