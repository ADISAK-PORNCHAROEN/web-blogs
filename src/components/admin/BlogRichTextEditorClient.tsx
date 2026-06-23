"use client";

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Italic,
  Link,
  List,
  Paragraph,
  SimpleUploadAdapter,
  Underline,
} from "ckeditor5";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { articleHtmlSx } from "@/lib/content";


interface BlogRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
  blogId: string;
}

const emptyContent = "<p></p>";

const BlogRichTextEditorClient = ({
  value,
  onChange,
  error,
  blogId,
}: BlogRichTextEditorProps): React.JSX.Element => {
  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          borderColor: error ? "error.main" : "divider",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            bgcolor: "action.hover",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            เนื้อหาบทความ
          </Typography>
          <Typography variant="caption" color="text.secondary">
            รองรับการจัดรูปแบบและการอัปโหลดรูปภาพจากเครื่อง
          </Typography>
        </Box>

        <Box
          sx={{
            "& .ck.ck-editor": {
              width: "100%",
            },
            "& .ck.ck-toolbar": {
              bgcolor: "background.default",
              border: "none",
              borderBottom: "1px solid",
              borderColor: "divider",
              px: 1,
              py: 1,
            },
            "& .ck.ck-editor__main > .ck-editor__editable": {
              bgcolor: "background.paper",
              color: "text.primary",
              minHeight: 320,
              border: "none",
              px: 3,
              py: 2,
            },
            "& .ck-content img": {
              maxWidth: "100%",
              borderRadius: 2,
            },
          }}
        >
          <CKEditor
            editor={ClassicEditor}
            data={value || emptyContent}
            config={{
              licenseKey: "GPL",
              plugins: [
                Essentials,
                Paragraph,
                Heading,
                Bold,
                Italic,
                Underline,
                Link,
                List,
                BlockQuote,
                Image,
                ImageCaption,
                ImageStyle,
                ImageToolbar,
                ImageResize,
                ImageUpload,
                ImageInsert,
                SimpleUploadAdapter,
              ],
              toolbar: [
                "undo",
                "redo",
                "|",
                "heading",
                "|",
                "bold",
                "italic",
                "underline",
                "link",
                "|",
                "bulletedList",
                "numberedList",
                "blockQuote",
                "|",
                "insertImage",
              ],
              heading: {
                options: [
                  {
                    model: "paragraph",
                    title: "ย่อหน้า",
                    class: "ck-heading_paragraph",
                  },
                  {
                    model: "heading2",
                    view: "h2",
                    title: "หัวข้อใหญ่",
                    class: "ck-heading_heading2",
                  },
                  {
                    model: "heading3",
                    view: "h3",
                    title: "หัวข้อย่อย",
                    class: "ck-heading_heading3",
                  },
                ],
              },
              image: {
                toolbar: [
                  "imageTextAlternative",
                  "|",
                  "imageStyle:inline",
                  "imageStyle:block",
                  "imageStyle:side",
                ],
              },
              simpleUpload: {
                uploadUrl: `/api/uploads/blog-images?blogId=${blogId}`,
              },
            }}
            onChange={(_, editor) => {
              onChange(editor.getData());
            }}
          />
        </Box>
      </Paper>

      {error ? (
        <Typography variant="caption" color="error" sx={{ px: 0.5 }}>
          {error}
        </Typography>
      ) : null}
    </Stack>
  );
};

export default BlogRichTextEditorClient;
