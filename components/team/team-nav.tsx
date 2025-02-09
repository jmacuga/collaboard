import { LayoutDashboard, Users, Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface TeamNavProps {
  teamId: string;
  defaultTab?: string;
}

export function TeamNav({ teamId, defaultTab = "boards" }: TeamNavProps) {
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

  return (
    <Tabs
      defaultValue={defaultTab}
      className="w-full"
      onValueChange={(value) => {
        // You can handle route changes here if needed
        // router.push(`/teams/${teamId}/${value}`)
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

      <TabsContent value="boards">{/* Your Boards content */}</TabsContent>

      <TabsContent value="members">{/* Your Members content */}</TabsContent>

      <TabsContent value="settings">{/* Your Settings content */}</TabsContent>
    </Tabs>
  );
}
