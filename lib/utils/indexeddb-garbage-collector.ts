import { db, SETTINGS } from "@/lib/indexed-db";
import { AnyDocumentId, Repo, PeerId } from "@automerge/automerge-repo";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { v4 as uuidv4 } from "uuid";

const ONE_DAY_MS = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

type BoardDocUrl = {
  docUrl: string;
};

/**
 * Checks if it's time to run the garbage collection process by comparing the current date
 * with the last garbage collection date stored in IndexedDB
 */
export async function shouldRunGarbageCollection(): Promise<boolean> {
  try {
    const lastGarbageCollectionDate = await db.settings.get(
      SETTINGS.LAST_GARBAGE_COLLECTION_DATE
    );

    if (!lastGarbageCollectionDate) {
      return true;
    }

    const lastGarbageCollectionTime = new Date(
      lastGarbageCollectionDate.value
    ).getTime();

    return Date.now() - lastGarbageCollectionTime > ONE_DAY_MS;
  } catch (error) {
    console.error("Error checking if garbage collection should run:", error);
    return false;
  }
}

/**
 * Updates the last garbage collection date in IndexedDB to the current date
 */
export async function updateLastGarbageCollectionDate(): Promise<void> {
  try {
    const now = new Date().toISOString();
    await db.settings.put({
      key: SETTINGS.LAST_GARBAGE_COLLECTION_DATE,
      value: now,
    });
  } catch (error) {
    console.error("Error updating last garbage collection date:", error);
  }
}

/**
 * Fetches a list of boards to clean up (archived or inaccessible) from the server
 * @param localDocUrls Array of document URLs stored locally
 */
export async function fetchBoardsToCleanup(
  localDocUrls: string[]
): Promise<string[]> {
  if (!localDocUrls.length) {
    return [];
  }

  try {
    const response = await fetch("/api/boards/archived", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localBoardUrls: localDocUrls }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch boards to clean up: ${response.status}`);
    }

    const data = await response.json();
    return data.boards.map((board: BoardDocUrl) => board.docUrl);
  } catch (error) {
    console.error("Error fetching boards to clean up:", error);
    return [];
  }
}

/**
 * Removes archived and inaccessible boards from IndexedDB
 */
export async function deleteArchivedBoards(): Promise<void> {
  try {
    const shouldDelete = await shouldRunGarbageCollection();

    if (!shouldDelete) {
      return;
    }

    const localDocUrls = await db.docUrls.toArray();
    const localUrls = localDocUrls.map((doc) => doc.docUrl);

    if (!localUrls.length) {
      await updateLastGarbageCollectionDate();
      return;
    }

    const boardUrlsToCleanup = await fetchBoardsToCleanup(localUrls);

    if (!boardUrlsToCleanup.length) {
      await updateLastGarbageCollectionDate();
      return;
    }

    const repo = new Repo({
      network: [],
      storage: new IndexedDBStorageAdapter(),
      peerId: uuidv4() as unknown as PeerId,
    });

    const boardsToDelete = localDocUrls.filter((local) =>
      boardUrlsToCleanup.includes(local.docUrl)
    );

    for (const board of boardsToDelete) {
      repo.delete(board.docUrl as AnyDocumentId);
      await db.docUrls.delete(board.docUrl);
    }

    await updateLastGarbageCollectionDate();
  } catch (error) {
    console.error("Error deleting archived boards:", error);
  }
}
