import Dexie, { Table } from "dexie";

interface DocUrls {
  docUrl: string;
}

interface DocIds {
  docId: string;
}

interface Settings {
  key: string;
  value: string;
}

export class CollaboardDB extends Dexie {
  docUrls!: Table<DocUrls>;
  settings!: Table<Settings>;
  docIds!: Table<DocIds>;

  constructor() {
    super("collaboard");
    this.version(1).stores({
      docUrls: "docUrl",
    });

    this.version(2).stores({
      docUrls: "docUrl",
      settings: "key",
    });

    this.version(3).stores({
      docUrls: "docUrl",
      settings: "key",
      docIds: "docId",
    });
  }
}

export const db = new CollaboardDB();

export const SETTINGS = {
  LAST_GARBAGE_COLLECTION_DATE: "lastGarbageCollectionDate",
};

export async function handleDatabaseUpgrade() {
  try {
    await db.open();
    await Promise.all([db.docIds.count(), db.settings.count()]);
    console.log("Database upgrade completed successfully");
  } catch (error) {
    console.error("Database upgrade failed:", error);
    throw error;
  }
}
