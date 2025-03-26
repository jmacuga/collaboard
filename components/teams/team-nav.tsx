"use client";
import { LayoutDashboard, Users, Settings, GitPullRequest } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface TeamNavProps {
  teamId: string;
  defaultTab?: string;
}

export function TeamNav({ teamId, defaultTab = "boards" }: TeamNavProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const navItems = [
    {
      value: "boards",
      label: "Boards",
      icon: LayoutDashboard,
    },
    {
      value: "members",
      label: "Members",
      icon: Users,
    },
    {
      value: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  useEffect(() => {
    if (router.isReady) {
      const path = router.asPath;
      const pathSegments = path.split("/");
      const lastSegment = pathSegments[pathSegments.length - 2];

      const matchingTab = navItems.find((item) => item.value === lastSegment);

      if (matchingTab) {
        setActiveTab(matchingTab.value);
      }
    }
  }, [router.asPath, router.isReady, navItems]);

  return (
    <Tabs
      value={activeTab}
      defaultValue={defaultTab}
      className="w-full"
      onValueChange={(value: string) => {
        setActiveTab(value);
        router.push(`/teams/${teamId}/${value}`);
      }}
    >
      <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
        {navItems.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="flex items-center gap-2"
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline-block">{item.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
