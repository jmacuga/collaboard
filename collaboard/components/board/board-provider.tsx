"use client";
import dynamic from "next/dynamic";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { DocHandle, Repo } from "@automerge/automerge-repo";
// import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { isValidAutomergeUrl } from "@automerge/automerge-repo";
import initialStageData from "@/features/automerge-konva-binding/initialStageData";
const Board = dynamic(() => import("@/components/board/board"), {
  ssr: false,
});
import KonvaNodeSchema from "@/types/KonvaNodeSchema";
import { useEffect, useState } from "react";

export default function BoardWrapper({ docUrl }: { docUrl: string }) {
  const [repo, setRepo] = useState<Repo | null>(null);
  const [currentDocUrl, setCurrentDocUrl] = useState(docUrl);

  useEffect(() => {
    // const wsAdapter = new BrowserWebSocketClientAdapter(
    //   "ws://localhost:3000/api/socket/"
    // );
    const newRepo = new Repo({
      // network: [wsAdapter],
      storage: new IndexedDBStorageAdapter("automerge-repo-demo-todo"),
    });

    // wsAdapter.on("peer-disconnected", (peerId) => {
    //   console.log("Peer disconnected:", peerId);
    // });

    let handle: DocHandle<KonvaNodeSchema>;
    const initLayer = initialStageData().toObject();
    if (isValidAutomergeUrl(docUrl)) {
      console.log("Connecting to existing doc");
      handle = newRepo.find(docUrl);
    } else {
      console.log("Creating new doc");
      handle = newRepo.create<KonvaNodeSchema>(initLayer);
      setCurrentDocUrl(handle.url);
      console.log("New doc url:", handle.url);
    }

    setRepo(newRepo);
  }, [docUrl]);

  if (!repo) {
    return null; // or a loading spinner
  }

  return (
    <RepoContext.Provider value={repo}>
      <Board docUrl={currentDocUrl} />
    </RepoContext.Provider>
  );
}
