import { GetServerSideProps } from "next";
import { BoardService } from "@/lib/services/board/board-service";
import { ClientSyncService } from "@/lib/services/client-doc/client-doc-service";
import { useState, useRef, useEffect } from "react";
import * as automerge from "@automerge/automerge";
import { KonvaNodeSchema, LayerSchema } from "@/types/KonvaNodeSchema";
import { Doc } from "@automerge/automerge";
import { Layer, Stage } from "react-konva";
import { ShapeRenderer } from "@/components/board/components/shape-renderer";
import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Eye } from "lucide-react";
import { useWindowDimensions } from "@/components/board/hooks/use-window-dimensions";

interface BoardPageProps {
  boardId: string;
  docUrl: string;
}

export default function BoardPage({ boardId, docUrl }: BoardPageProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Doc<LayerSchema>>();
  const { width, height } = useWindowDimensions();
  const clientSyncServiceRef = useRef<ClientSyncService | null>(null);

  const handleBackToEditor = () => {
    router.push(`/boards/${boardId}`);
  };

  useEffect(() => {
    setIsMounted(true);
    if (!clientSyncServiceRef.current) {
      clientSyncServiceRef.current = new ClientSyncService({ docUrl });
    }
    const fetchLocalChanges = async () => {
      if (!clientSyncServiceRef.current) return;

      const localChanges = await clientSyncServiceRef.current.getLocalChanges();
      const serverDoc = await clientSyncServiceRef.current.getServerDoc();
      const serverDocCopy = automerge.clone(serverDoc);
      const doc2 = automerge.applyChanges(serverDocCopy, localChanges)[0];
      setPreviewDoc(doc2);
    };

    fetchLocalChanges();
  }, [docUrl]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Card className="border-none shadow-none">
        <CardHeader className="border-b bg-muted/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToEditor}
                className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Editor
              </Button>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Board Preview
                  </h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    This is a preview of the merged board state.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            <Stage
              width={width}
              height={height}
              x={0}
              y={0}
              className="bg-white/50 backdrop-blur-sm"
            >
              <Layer>
                {previewDoc &&
                  (
                    Object.entries(previewDoc) as [string, KonvaNodeSchema][]
                  ).map(([id, shape]) => (
                    <ShapeRenderer key={id} id={id} shape={shape} />
                  ))}
              </Layer>
            </Stage>
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/5 to-transparent" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const boardId = params?.id as string;
  const board = await BoardService.getBoardById(boardId);

  if (!board || !board.docUrl) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      boardId,
      docUrl: board.docUrl.toString(),
    },
  };
};
