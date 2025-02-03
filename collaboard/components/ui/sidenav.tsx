"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { ListItemText } from "@mui/material";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

export interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

export default function Drawer({
  navigationItems,
}: {
  navigationItems: NavigationItem[];
}) {
  const [drawerState, setDrawerState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setDrawerState(open);
    };

  return (
    <div>
      {
        <React.Fragment>
          <Button onClick={toggleDrawer(true)}>
            <MenuIcon></MenuIcon>{" "}
          </Button>
          <SwipeableDrawer
            anchor="left"
            open={drawerState}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{ auto: 250 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {navigationItems.map((item, index) => (
                  <ListItem key={item.label} disablePadding>
                    <Link href={item.href}>
                      <ListItemButton>
                        <ListItemIcon> {item.icon} </ListItemIcon>
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                ))}
              </List>
              <Divider />
            </Box>
          </SwipeableDrawer>
        </React.Fragment>
      }
    </div>
  );
}
