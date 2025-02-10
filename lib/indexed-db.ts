import Dexie, { Table } from "dexie";

interface UrlMapping {
  serverUrl: string;
  localUrl: string;
}

export class CollaboardDB extends Dexie {
  urlMappings!: Table<UrlMapping>;

  constructor() {
    super("collaboard");
    this.version(1).stores({
      urlMappings: "serverUrl, localUrl",
    });
  }
}

export const db = new CollaboardDB();
