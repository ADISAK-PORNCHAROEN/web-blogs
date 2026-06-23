import React from "react";
import dynamic from "next/dynamic";
import { Box, CircularProgress, Typography } from "@mui/material";

const BlogRichTextEditor = dynamic(() => import("./BlogRichTextEditorClient"), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "action.hover",
        minHeight: 200,
        gap: 2,
      }}
    >
      <CircularProgress size={30} color="secondary" />
      <Typography variant="body2" color="text.secondary">
        กำลังโหลดเครื่องมือเขียนบทความ...
      </Typography>
    </Box>
  ),
});

export default BlogRichTextEditor;
