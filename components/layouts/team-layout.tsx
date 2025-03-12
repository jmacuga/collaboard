"use client";
import { useRouter } from "next/router";
import { TeamNav } from "@/components/teams/team-nav";

interface TeamLayoutProps {
  children: React.ReactNode;
}

const TeamLayout = ({ children }: TeamLayoutProps) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="w-full max-w-full flex flex-col gap-6">
      <TeamNav teamId={id as string} />
      <div className="flex-1 w-full max-w-full">{children}</div>
    </div>
  );
};

export default TeamLayout;
