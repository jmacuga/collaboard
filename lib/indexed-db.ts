import Dexie, { Table } from "dexie";

interface DocUrls {
  docUrl: string;
}

export class CollaboardDB extends Dexie {
  docUrls!: Table<DocUrls>;

  constructor() {
    super("collaboard");
    this.version(1).stores({
      docUrls: "docUrl",
    });
  }
}

export const db = new CollaboardDB();
