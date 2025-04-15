import { AppLayout } from "@/components/layouts/app-layout";
import { Button } from "../ui/button";
import { Link } from "lucide-react";

export default function BoardArchived() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Board is deleted</h1>
      </div>
      <Button className="mt-4">
        <Link href="/teams">Go to teams</Link>
      </Button>
    </AppLayout>
  );
}
