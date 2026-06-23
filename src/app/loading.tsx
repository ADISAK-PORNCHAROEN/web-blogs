import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "background.default",
        gap: 3,
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="indeterminate"
          disableShrink
          sx={{
            color: "secondary.main",
            animationDuration: "550ms",
          }}
          size={50}
          thickness={4.5}
        />
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 600,
          letterSpacing: "0.05em",
          animation: "pulse 1.5s infinite ease-in-out",
          "@keyframes pulse": {
            "0%, 100%": { opacity: 0.6 },
            "50%": { opacity: 1 },
          },
        }}
      >
        กำลังโหลดข้อมูล...
      </Typography>
    </Box>
  );
}
