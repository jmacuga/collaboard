import Dexie, { Table } from "dexie";

interface DocUrls {
  docUrl: string;
}

interface Settings {
  key: string;
  value: string;
}

export class CollaboardDB extends Dexie {
  docUrls!: Table<DocUrls>;
  settings!: Table<Settings>;

  constructor() {
    super("collaboard");
    this.version(1).stores({
      docUrls: "docUrl",
    });

    this.version(2).stores({
      docUrls: "docUrl",
      settings: "key",
    });
  }
}

export const db = new CollaboardDB();

export const SETTINGS = {
  LAST_GARBAGE_COLLECTION_DATE: "lastGarbageCollectionDate",
};
