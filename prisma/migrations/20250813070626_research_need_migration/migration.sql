/*
  Warnings:

  - Added the required column `dataType` to the `research_needs` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_research_needs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requiredFormat" TEXT NOT NULL,
    "exampleSchema" TEXT,
    "rewardInfo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataType" TEXT NOT NULL,
    CONSTRAINT "research_needs_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_research_needs" ("createdAt", "description", "exampleSchema", "id", "ownerId", "requiredFormat", "rewardInfo", "status", "title") SELECT "createdAt", "description", "exampleSchema", "id", "ownerId", "requiredFormat", "rewardInfo", "status", "title" FROM "research_needs";
DROP TABLE "research_needs";
ALTER TABLE "new_research_needs" RENAME TO "research_needs";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
