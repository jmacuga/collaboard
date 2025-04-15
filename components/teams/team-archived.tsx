import Link from "next/link";
import { Button } from "../ui/button";

export default function TeamArchived() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Team is deleted</h1>
      <p className="text-sm text-gray-500">
        This team is deleted and cannot be accessed.
      </p>
      <Button className="mt-4">
        <Link href="/teams">Go to teams</Link>
      </Button>
    </div>
  );
}
