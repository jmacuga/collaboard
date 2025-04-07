import {
  Inbox,
  Users,
  Files,
  GitPullRequest,
  LogOut,
  ChevronRight,
  Bell,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import SignOutModal from "@/components/auth/sign-out-modal";
import { useRouter } from "next/router";

const data = {
  navMain: [
    {
      title: "Teams",
      url: "/teams",
      icon: Users,
      items: [
        {
          title: "Your Teams",
          url: "/teams",
          icon: Users,
        },
        {
          title: "Team Invitations",
          url: "/profile/invitations",
          icon: Inbox,
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Notifications",
          url: "/profile/notifications",
          icon: Bell,
        },
        {
          title: "Settings",
          url: "/profile/settings",
          icon: Files,
        },
        {
          title: "Sign Out",
          icon: LogOut,
        },
      ],
    },
    {
      title: "Review Requests",
      url: "#",
      icon: GitPullRequest,
    },
  ],
};

export function AppSidebar() {
  const router = useRouter();
  const pathname = router.pathname;
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-2xl font-bold">Collaboard</h1>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <Collapsible
            key={item.title}
            title={item.title}
            defaultOpen
            className="group/collapsible"
          >
            <SidebarGroup>
              <SidebarGroupLabel
                asChild
                className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                {item.items ? (
                  <CollapsibleTrigger>
                    {item.icon && <item.icon className="mr-2" />}
                    {item.title}{" "}
                    <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                ) : (
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon className="mr-2" />}
                      {item.title}
                    </a>
                  </SidebarMenuButton>
                )}
              </SidebarGroupLabel>
              {item.items && (
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          {subItem.title === "Sign Out" ? (
                            <SignOutModal>
                              <SidebarMenuButton asChild>
                                <button className="flex w-full items-center">
                                  {subItem.icon && (
                                    <subItem.icon className="mr-2" />
                                  )}
                                  {subItem.title}
                                </button>
                              </SidebarMenuButton>
                            </SignOutModal>
                          ) : (
                            <SidebarMenuButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <a href={subItem.url}>
                                {subItem.icon && (
                                  <subItem.icon className="mr-2" />
                                )}
                                {subItem.title}
                              </a>
                            </SidebarMenuButton>
                          )}
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              )}
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
