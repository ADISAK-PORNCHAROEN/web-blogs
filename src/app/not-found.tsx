"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";

export default function NotFound(): React.JSX.Element {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 6,
        textAlign: "center",
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "8rem", md: "11rem" },
            fontWeight: 900,
            lineHeight: 1,
            color: "primary.main",
            letterSpacing: "-0.05em",
            mb: 2,
            background: "linear-gradient(135deg, #0f172a 0%, #2563eb 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: "text.primary",
            letterSpacing: "-0.025em",
          }}
        >
          ไม่พบหน้าเว็บที่คุณต้องการ
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            mb: 5,
            maxWidth: 480,
            mx: "auto",
            lineHeight: 1.6,
          }}
        >
          ขออภัยด้วยครับ หน้าเว็บที่คุณกำลังพยายามเข้าถึงอาจจะถูกลบ ย้ายที่อยู่ หรือไม่มีอยู่จริงในระบบ กรุณาลองตรวจสอบลิงก์ใหม่อีกครั้ง
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Button
            component={Link}
            href="/"
            variant="contained"
            color="secondary"
            startIcon={<HomeIcon />}
            sx={{ px: 4, py: 1.5, borderRadius: 2.5, fontWeight: 700 }}
          >
            กลับหน้าแรก
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ px: 4, py: 1.5, borderRadius: 2.5, fontWeight: 700 }}
          >
            ย้อนกลับ
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
