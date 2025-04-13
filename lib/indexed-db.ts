import Dexie, { Table } from "dexie";

interface DocIds {
  docId: string;
}

interface Settings {
  key: string;
  value: string;
}

export class CollaboardDB extends Dexie {
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
    this.version(4).stores({
      settings: "key",
      docIds: "docId",
      boards: "id, lastSeen",
    });
    this.version(4).stores({
      settings: "key",
      docIds: "docId",
    });
  }
}

export const db = new CollaboardDB();

export const SETTINGS = {
  LAST_GARBAGE_COLLECTION_DATE: "lastGarbageCollectionDate",
};
