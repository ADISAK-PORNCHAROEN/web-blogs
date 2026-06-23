"use client";

import React, { useEffect, useRef } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import CommentIcon from "@mui/icons-material/Comment";
import LogoutIcon from "@mui/icons-material/Logout";
import WebIcon from "@mui/icons-material/Web";

const drawerWidth = 240;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const lastRefreshRef = useRef<number>(Date.now());
  const wasActiveRef = useRef<boolean>(false);

  // Route guarding
  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [status, pathname, router]);

  // Track user activity (mousemove, keydown, scroll, click)
  useEffect(() => {
    const handleActivity = () => {
      wasActiveRef.current = true;
    };

    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", handleActivity);
      window.addEventListener("keydown", handleActivity);
      window.addEventListener("scroll", handleActivity);
      window.addEventListener("click", handleActivity);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("mousemove", handleActivity);
        window.removeEventListener("keydown", handleActivity);
        window.removeEventListener("scroll", handleActivity);
        window.removeEventListener("click", handleActivity);
      }
    };
  }, []);

  // Periodic silent session refresh if active
  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }

    const checkInterval = setInterval(async () => {
      const now = Date.now();
      // If 10 minutes have passed since last refresh (backend tokens expire in 15 mins)
      if (now - lastRefreshRef.current >= 10 * 60 * 1000) {
        if (wasActiveRef.current) {
          const credentialsStr = typeof window !== "undefined" ? sessionStorage.getItem("admin_credentials") : null;
          if (credentialsStr) {
            try {
              const { email: savedEmail, password: savedPassword } = JSON.parse(credentialsStr);
              const result = await signIn("credentials", {
                redirect: false,
                username: savedEmail,
                password: savedPassword,
              });
              if (!result?.error) {
                lastRefreshRef.current = Date.now();
                wasActiveRef.current = false;
                console.log("Silent session keep-alive completed successfully.");
              }
            } catch (err) {
              console.error("Silent session keep-alive failed:", err);
            }
          }
        }
      }
    }, 60000); // Check every 1 minute

    return () => clearInterval(checkInterval);
  }, [status]);

  // Bypass layout wrapper for login screen
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!session) {
    return null;
  }

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin_credentials");
    }
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden", bgcolor: "background.default" }}>
      {/* Top Header */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "background.paper",
          color: "text.primary",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
            {pathname === "/admin/comments"
              ? "ระบบจัดการความคิดเห็น"
              : pathname === "/admin/blogs/create"
              ? "สร้างบทความบล็อกใหม่"
              : pathname.includes("/blogs/")
              ? "แก้ไขบทความบล็อก"
              : "ระบบจัดการบทความบล็อก"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            สวัสดี, {session.user?.email} (Admin)
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Left Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "primary.dark",
              color: "white",
              borderRight: "none",
            },
          }}
          open
        >
          <Box>
            <Toolbar>
              <Typography variant="h6" noWrap sx={{ fontWeight: 800, color: "white" }}>
                Admin Control
              </Typography>
            </Toolbar>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/admin"
                  selected={pathname === "/admin"}
                  sx={{
                    "&.Mui-selected": { bgcolor: "secondary.main", color: "white" },
                    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <ArticleIcon />
                  </ListItemIcon>
                  <ListItemText primary="จัดการบทความ" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/admin/comments"
                  selected={pathname === "/admin/comments"}
                  sx={{
                    "&.Mui-selected": { bgcolor: "secondary.main", color: "white" },
                    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <CommentIcon />
                  </ListItemIcon>
                  <ListItemText primary="จัดการคอมเมนต์" />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/"
                  sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <WebIcon />
                  </ListItemIcon>
                  <ListItemText primary="กลับหน้าหลักเว็บ" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>

          {/* Logout at bottom */}
          <Box sx={{ mt: "auto", p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.08)",
                },
              }}
            >
              ออกจากระบบ
            </Button>
          </Box>
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: "64px",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ py: 2, flexGrow: 1, width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
