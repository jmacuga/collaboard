import Dexie, { Table } from "dexie";
import { fromZonedTime } from "date-fns-tz";

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

interface Boards {
  id: string;
  lastSeen: Date;
}

export class CollaboardDB extends Dexie {
  settings!: Table<Settings>;
  docIds!: Table<DocIds>;
  boards!: Table<Boards>;

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
  }

  async updateBoardLastSeen(boardId: string) {
    console.log("Updating board last seen", boardId);
    await this.boards.put({
      id: boardId,
      lastSeen: new Date(),
    });
  }

  async getBoardLastSeen(boardId: string): Promise<Date | undefined> {
    const board = await this.boards.get(boardId);
    return board?.lastSeen;
  }
}

export const db = new CollaboardDB();

export const SETTINGS = {
  LAST_GARBAGE_COLLECTION_DATE: "lastGarbageCollectionDate",
};
