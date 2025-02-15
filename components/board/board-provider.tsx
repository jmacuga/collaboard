"use client";
import { useEffect, useState } from "react";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { AutomergeUrl, Repo } from "@automerge/automerge-repo";
import { connectAutomergeRepo } from "@/lib/automerge-repo-utils";
import Board from "@/components/board/board";

interface RepoState {
  repo: Repo | null;
  docUrl: string;
}

export function BoardProvider({
  boardId,
  docUrl,
}: {
  boardId: string;
  docUrl: string;
}) {
  const [state, setState] = useState<RepoState>({
    repo: null,
    docUrl: docUrl || "",
  });

  useEffect(() => {
    const initializeBoard = async () => {
      const { repo, handleUrl } = await connectAutomergeRepo(docUrl);
      setState({ repo, docUrl: handleUrl });
    };
    initializeBoard();
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
