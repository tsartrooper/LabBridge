/*
  Warnings:

  - Added the required column `title` to the `collaboration_requests` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_collaboration_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "researchNeedId" TEXT NOT NULL,
    "contributionType" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "collaboration_requests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "collaboration_requests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "collaboration_requests_researchNeedId_fkey" FOREIGN KEY ("researchNeedId") REFERENCES "research_needs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_collaboration_requests" ("createdAt", "id", "receiverId", "researchNeedId", "senderId", "status") SELECT "createdAt", "id", "receiverId", "researchNeedId", "senderId", "status" FROM "collaboration_requests";
DROP TABLE "collaboration_requests";
ALTER TABLE "new_collaboration_requests" RENAME TO "collaboration_requests";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
