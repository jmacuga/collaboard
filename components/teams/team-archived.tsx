import { AppLayout } from "@/components/layouts/app-layout";

export default function TeamArchived() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Team is archived</h1>
        <p className="text-sm text-gray-500">
          This team is archived and cannot be accessed.
        </p>
      </div>
    </AppLayout>
  );
}
