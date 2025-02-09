"use client";
import { useParams } from "next/navigation";
import { TeamNav } from "@/components/team/team-nav";

export default function TeamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-6 p-6">
      <TeamNav teamId={id as string} />
      {children}
    </div>
  );
}
