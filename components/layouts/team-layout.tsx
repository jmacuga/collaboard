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
    <div className="flex flex-col gap-6 p-6">
      <TeamNav teamId={id as string} />
      {children}
    </div>
  );
};

export default TeamLayout;
