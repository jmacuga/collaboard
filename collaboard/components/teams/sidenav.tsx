import Drawer, { NavigationItem } from "../ui/sidenav";
import LogoutIconRounded from "@mui/icons-material/LogoutRounded";
import GroupAddIconRounded from "@mui/icons-material/GroupAddRounded";
import CallMergeIconRounded from "@mui/icons-material/CallMergeRounded";
import HomeIconRounded from "@mui/icons-material/HomeRounded";
import EmailIconRounded from "@mui/icons-material/EmailRounded";

export default function Sidenav() {
  const navigationItems: NavigationItem[] = [
    {
      label: "Teams",
      icon: <HomeIconRounded />,
      href: "/teams",
    },
    {
      label: "Create Team",
      icon: <GroupAddIconRounded />,
      href: "/create-team",
    },
    {
      label: "My merge requests",
      icon: <CallMergeIconRounded />,
      href: "/merge-requests",
    },
    {
      label: "Team invitations",
      icon: <EmailIconRounded />,
      href: "/team-invitations",
    },
    {
      label: "Logout",
      icon: <LogoutIconRounded />,
      href: "/logout",
    },
  ];

  return <Drawer navigationItems={navigationItems} />;
}
