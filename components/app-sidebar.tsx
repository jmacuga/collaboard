import {
  Inbox,
  Users,
  User,
  UserPlus,
  Files,
  GitPullRequest,
  LogOut,
  ChevronRight,
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
          title: "Create Team",
          url: "#",
          icon: UserPlus,
        },
        {
          title: "Team Invitations",
          url: "#",
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
          title: "Settings",
          url: "#",
          icon: Files,
          isActive: true,
        },
        {
          title: "Logout",
          url: "/api/auth/signout",
          icon: LogOut,
        },
      ],
    },
    {
      title: "Review Requests",
      url: "#",
      icon: GitPullRequest,
      isActive: false,
    },
  ],
};

export function AppSidebar() {
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
                  <SidebarMenuButton asChild isActive={item.isActive}>
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
                          {subItem.title === "Logout" ? (
                            <SignOutModal>
                              <SidebarMenuButton
                                asChild
                                isActive={subItem.isActive}
                              >
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
                              isActive={subItem.isActive}
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
