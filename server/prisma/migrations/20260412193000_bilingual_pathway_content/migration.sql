ALTER TABLE "Destination" ADD COLUMN "descriptionFr" TEXT;

ALTER TABLE "ProcedureType" ADD COLUMN "nameFr" TEXT;
ALTER TABLE "ProcedureType" ADD COLUMN "descriptionFr" TEXT;
ALTER TABLE "ProcedureType" ADD COLUMN "publicSummaryFr" TEXT;
ALTER TABLE "ProcedureType" ADD COLUMN "officeSummaryFr" TEXT;
ALTER TABLE "ProcedureType" ADD COLUMN "officialProgramNameFr" TEXT;
ALTER TABLE "ProcedureType" ADD COLUMN "officialWebsiteLabelFr" TEXT;
ALTER TABLE "ProcedureType" ADD COLUMN "estimatedTimelineFr" TEXT;

ALTER TABLE "ProcedureTypeRequirement" ADD COLUMN "titleFr" TEXT;
ALTER TABLE "ProcedureTypeRequirement" ADD COLUMN "descriptionFr" TEXT;

ALTER TABLE "ProcedureTypeResource" ADD COLUMN "labelFr" TEXT;
ALTER TABLE "ProcedureTypeResource" ADD COLUMN "providerFr" TEXT;

ALTER TABLE "ProcedureTypeCourseRecommendation" ADD COLUMN "rationaleFr" TEXT;

ALTER TABLE "LanguageCourse" ADD COLUMN "titleFr" TEXT;
ALTER TABLE "LanguageCourse" ADD COLUMN "descriptionFr" TEXT;