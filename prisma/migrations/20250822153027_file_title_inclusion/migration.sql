-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkspaceFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "collaborationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'shared_file',
    "fileUrl" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WorkspaceFile_collaborationId_fkey" FOREIGN KEY ("collaborationId") REFERENCES "Collaboration" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkspaceFile_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_WorkspaceFile" ("collaborationId", "createdAt", "description", "fileUrl", "id", "senderId") SELECT "collaborationId", "createdAt", "description", "fileUrl", "id", "senderId" FROM "WorkspaceFile";
DROP TABLE "WorkspaceFile";
ALTER TABLE "new_WorkspaceFile" RENAME TO "WorkspaceFile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
