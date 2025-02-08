"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { AutomergeUrl, Repo } from "@automerge/automerge-repo";
import { connectAutomergeRepo } from "@/lib/automergeRepo";
import initialStageData from "@/features/automerge-konva-binding/initialStageData";
const Board = dynamic(() => import("@/components/board/board"), {
  ssr: false,
});
interface RepoState {
  repo: Repo | null;
  docUrl: string;
}

export default function BoardProvider({ docUrl }: { docUrl: string }) {
  const initLayer = initialStageData().toObject();
  const [state, setState] = useState<RepoState>({
    repo: null,
    docUrl: docUrl,
  });

  useEffect(() => {
    const { repo, handleUrl } = connectAutomergeRepo(docUrl, initLayer);
    setState({ repo, docUrl: handleUrl });
  }, [docUrl]);

  if (!state.repo) {
    return <div>Loading board...</div>;
  }

  return (
    <RepoContext.Provider value={state.repo}>
      <Board docUrl={state.docUrl as AutomergeUrl} />
    </RepoContext.Provider>
  );
}
