ALTER TABLE "Procedure" ADD COLUMN "agreedPrice" REAL NOT NULL DEFAULT 0;
ALTER TABLE "Procedure" ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'XAF';

CREATE TABLE "Payment" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "procedureId" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'XAF',
  "note" TEXT,
  "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Payment_procedureId_fkey" FOREIGN KEY ("procedureId") REFERENCES "Procedure" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Payment_procedureId_idx" ON "Payment"("procedureId");

UPDATE "Procedure"
SET
  "agreedPrice" = COALESCE(
    (
      SELECT "price"
      FROM "ProcedureType"
      WHERE "ProcedureType"."id" = "Procedure"."procedureTypeId"
    ),
    0
  ),
  "currency" = COALESCE(
    (
      SELECT "currency"
      FROM "ProcedureType"
      WHERE "ProcedureType"."id" = "Procedure"."procedureTypeId"
    ),
    'XAF'
  );
