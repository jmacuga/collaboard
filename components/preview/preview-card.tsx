import { ArrowLeft } from "lucide-react";

import { Eye } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { ClientSyncContext } from "@/components/board/context/client-doc-context";
import { useContext } from "react";

export const PreviewCard = ({ boardId }: { boardId: string }) => {
  const router = useRouter();
  const { clientSyncService } = useContext(ClientSyncContext);

  const handleBackToEditor = () => {
    router.push(`/boards/${boardId}`);
  };

  const handleMergeChanges = async () => {
    console.log("merge changes");
    if (!clientSyncService) return;
    await clientSyncService.connect();
    router.push(`/boards/${boardId}`);
  };

  const handleRejectChanges = async () => {
    console.log("reject changes");
    if (!clientSyncService) return;
    await clientSyncService.revertLocalChanges();
    router.push(`/boards/${boardId}`);
  };

  return (
    <Card>
      <CardHeader>
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
      <CardContent>
        <div className="flex gap-2 justify-end">
          <Button onClick={handleMergeChanges}>Merge</Button>
          <Button variant="outline" onClick={handleRejectChanges}>
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
