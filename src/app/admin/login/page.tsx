"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if session is already active
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.replace("/admin");
    }
  }, [session, status, router]);

  // Check for expired session error in URL
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "SessionExpired") {
        setError("เซสชันการเชื่อมต่อฝั่งเซิร์ฟเวอร์หมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
      }
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("กรุณากรอกอีเมลและรหัสผ่าน");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username: email,
        password: password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("admin_credentials", JSON.stringify({ email, password }));
        }
        router.replace("/admin");
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || status === "authenticated") {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 20 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Card sx={{ p: 4, borderRadius: 3, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              bgcolor: "primary.main",
              color: "white",
              p: 1.5,
              borderRadius: "50%",
              mb: 2,
            }}
          >
            <LockOutlinedIcon />
          </Box>
          <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
            เข้าสู่ระบบ Admin
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, textAlign: "center" }}>
            จัดการบทความบล็อกและความคิดเห็น
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="อีเมลผู้ดูแลระบบ"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="รหัสผ่าน"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 1, py: 1.2, fontWeight: 700 }}
            >
              {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ"}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={() => router.push("/")}
              sx={{ color: "text.secondary" }}
            >
              กลับหน้าหลักของเว็บไซต์
            </Button>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}
