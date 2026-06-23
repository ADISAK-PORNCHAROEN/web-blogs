"use client";

import React, { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { articleHtmlSx, createExcerpt } from "@/lib/content";
import { getApiErrorMessage } from "@/lib/apiError";
import { blogSchema } from "@/lib/validations";
import { useUploadBlogImage } from "@/hooks/blogs/useBlogMutations";
import type { BlogInput } from "@/types/blog";
import BlogRichTextEditor from "./BlogRichTextEditor";

interface BlogFormProps {
  errorMessage: string | null;
  heading: string;
  initialValues: BlogInput;
  isSubmitting: boolean;
  onSubmit: (values: BlogInput) => Promise<void> | void;
  submitLabel: string;
  submitPendingLabel: string;
  blogId: string;
}

const emptyCoverLabel = "ยังไม่มีรูปปก";

const BlogForm = ({
  errorMessage,
  heading,
  initialValues,
  isSubmitting,
  onSubmit,
  submitLabel,
  submitPendingLabel,
  blogId,
}: BlogFormProps): React.JSX.Element => {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const uploadImageMutation = useUploadBlogImage();
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(0);

  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      additionalImages: [],
      published: false,
      ...initialValues,
    },
  });

  const watchedTitle = useWatch({ control, name: "title" });
  const watchedSlug = useWatch({ control, name: "slug" });
  const watchedCoverImage = useWatch({ control, name: "coverImage" }) || "";
  const watchedContent = useWatch({ control, name: "content" });
  const watchedPublished = useWatch({ control, name: "published" });

  const handleCoverUpload = async (file: File | null): Promise<void> => {
    if (!file) {
      return;
    }

    setUploadErrorMessage(null);

    try {
      const uploadResponse = await uploadImageMutation.mutateAsync({ file, blogId });
      setValue("coverImage", uploadResponse.url, {
        shouldDirty: true,
        shouldValidate: true,
      });
    } catch (error) {
      setUploadErrorMessage(getApiErrorMessage(error, "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ"));
    }
  };

  const removeCoverImage = (): void => {
    setValue("coverImage", "", {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleCoverInputChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const inputElement = event.currentTarget;
    const selectedFile = inputElement.files?.[0] ?? null;
    inputElement.value = "";
    await handleCoverUpload(selectedFile);
  };

  const handleFormSubmit = (values: BlogInput): void => {
    const updatedValues = {
      ...values,
      additionalImages: [],
    };
    void onSubmit(updatedValues);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: { xs: "auto", lg: "hidden" },
        pr: { xs: 1, lg: 0 },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3, flexShrink: 0 }}>
        <IconButton onClick={() => router.push("/admin")} sx={{ flexShrink: 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, lineHeight: 1.2, color: "text.primary" }}>
            {heading}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            อัปโหลดรูปภาพจากเครื่องและจัดการเนื้อหาผ่านตัวแก้ไขแบบ CMS
          </Typography>
        </Box>
      </Box>

      {errorMessage ? (
        <Alert severity="error" sx={{ mb: 3, flexShrink: 0 }}>
          {errorMessage}
        </Alert>
      ) : null}

      {uploadErrorMessage ? (
        <Alert severity="error" sx={{ mb: 3, flexShrink: 0 }}>
          {uploadErrorMessage}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 4,
          flexGrow: { lg: 1 },
          minHeight: { lg: 0 },
          height: { xs: "auto", lg: "100%" },
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.4fr) minmax(320px, 0.9fr)" },
        }}
      >
        <Paper
          elevation={1}
          component="form"
          onSubmit={handleSubmit(handleFormSubmit)}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            bgcolor: "background.paper",
            height: { xs: "auto", lg: "100%" },
            overflowY: { xs: "visible", lg: "auto" },
            pr: { lg: 1 },
          }}
        >
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="หัวข้อบล็อก"
              variant="outlined"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />

            <TextField
              fullWidth
              label="URL Slug"
              variant="outlined"
              {...register("slug")}
              error={!!errors.slug}
              helperText={errors.slug?.message}
            />

            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  รูปภาพหน้าปก
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  อัปโหลดรูปภาพหลักของบทความจากเครื่อง
                </Typography>
              </Box>

              <input
                ref={coverInputRef}
                hidden
                accept="image/*"
                type="file"
                onChange={handleCoverInputChange}
              />

              <Box
                sx={{
                  borderRadius: 3,
                  border: 1,
                  borderStyle: watchedCoverImage.length > 0 ? "solid" : "dashed",
                  borderColor: errors.coverImage ? "error.main" : "divider",
                  overflow: "hidden",
                  bgcolor: watchedCoverImage.length > 0 ? "background.paper" : "background.default",
                }}
              >
                {watchedCoverImage.length > 0 ? (
                  <Box
                    component="img"
                    src={watchedCoverImage}
                    alt={watchedTitle || "รูปปกบทความ"}
                    sx={{ width: "100%", height: 280, objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 220,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "action.hover",
                      color: "text.secondary",
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {emptyCoverLabel}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddPhotoAlternateIcon />}
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadImageMutation.isPending}
                >
                  {uploadImageMutation.isPending ? "กำลังอัปโหลด..." : "อัปโหลดรูปปก"}
                </Button>
                {watchedCoverImage.length > 0 ? (
                  <Button type="button" color="error" variant="text" onClick={removeCoverImage}>
                    ลบรูปปก
                  </Button>
                ) : null}
              </Box>

              {errors.coverImage?.message ? (
                <Typography variant="caption" color="error">
                  {errors.coverImage.message}
                </Typography>
              ) : null}
            </Stack>

            <Controller
              control={control}
              name="content"
              render={({ field, fieldState }) => (
                <BlogRichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  error={fieldState.error?.message ?? null}
                  blogId={blogId}
                />
              )}
            />

            <Divider />

            <Controller
              control={control}
              name="published"
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      color="secondary"
                      checked={!!value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="เผยแพร่บล็อกทันที"
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isSubmitting}
                sx={{ px: 4, py: 1, fontWeight: 700 }}
              >
                {isSubmitting ? submitPendingLabel : submitLabel}
              </Button>
              <Button variant="outlined" onClick={() => router.push("/admin")} sx={{ px: 4, py: 1 }}>
                ยกเลิก
              </Button>
            </Box>
          </Stack>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            height: { xs: "auto", lg: "100%" },
            overflowY: { xs: "visible", lg: "auto" },
            pr: { lg: 1 },
          }}
        >
          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.primary" }}>
                  ตัวอย่างบล็อก
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  ตรวจสอบภาพรวมก่อนบันทึก
                </Typography>
              </Box>
              <Chip
                label={watchedPublished ? "เผยแพร่" : "ฉบับร่าง"}
                color={watchedPublished ? "success" : "warning"}
                variant="filled"
                size="small"
              />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                textColor="secondary"
                indicatorColor="secondary"
                variant="fullWidth"
              >
                <Tab label="การ์ดบล็อก" sx={{ fontWeight: 700 }} />
                <Tab label="เนื้อหาบทความ" sx={{ fontWeight: 700 }} />
              </Tabs>
            </Box>

            {activeTab === 0 ? (
              <Card sx={{ display: "flex", flexDirection: "column", borderRadius: 3, border: 1, borderColor: "divider", boxShadow: "none" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={watchedCoverImage || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800"}
                  alt={watchedTitle || "ตัวอย่างรูปปก"}
                  sx={{ objectFit: "cover", height: 200 }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Box sx={{ display: "flex", gap: 2, mb: 1.5, color: "text.secondary" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <CalendarTodayIcon sx={{ fontSize: "0.875rem" }} />
                      <Typography variant="caption">23 มิ.ย. 2026</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: "0.875rem" }} />
                      <Typography variant="caption">0 วิว</Typography>
                    </Box>
                  </Box>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.3,
                      height: "2.6em",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      color: "text.primary"
                    }}
                  >
                    {watchedTitle || "หัวข้อบล็อกของคุณจะอยู่ตรงนี้"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      height: "4.5em",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {createExcerpt(watchedContent || "เริ่มพิมพ์เนื้อหาเพื่อดูตัวอย่างคำโปรย...")}
                  </Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Button size="small" color="secondary" variant="contained" fullWidth sx={{ borderRadius: 2, fontWeight: 700 }}>
                    อ่านเพิ่มเติม
                  </Button>
                </CardActions>
              </Card>
            ) : (
              <Box
                sx={{
                  borderRadius: 3,
                  border: 1,
                  borderColor: "divider",
                  p: 2.5,
                  bgcolor: "background.paper",
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.3, mb: 3, color: "text.primary" }}>
                  {watchedTitle || "หัวข้อบล็อกของคุณจะอยู่ตรงนี้"}
                </Typography>
                <Box sx={{ display: "flex", gap: 3, mb: 3, color: "text.secondary" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
                    <Typography variant="body2">23 มิ.ย. 2026</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
                    <Typography variant="body2">0 วิว</Typography>
                  </Box>
                </Box>
                {watchedCoverImage ? (
                  <Box
                    component="img"
                    src={watchedCoverImage}
                    alt={watchedTitle || "ตัวอย่างรูปปก"}
                    sx={{ display: "block", width: "100%", height: 320, objectFit: "cover", borderRadius: 3, mb: 4 }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: 240,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "action.hover",
                      color: "text.secondary",
                      borderRadius: 3,
                      mb: 4,
                      border: "1px dashed",
                      borderColor: "divider"
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {emptyCoverLabel}
                    </Typography>
                  </Box>
                )}
                <Box className="ck-content" sx={articleHtmlSx} dangerouslySetInnerHTML={{ __html: watchedContent || "<p>เริ่มพิมพ์เนื้อหาเพื่อดูตัวอย่าง</p>" }} />
              </Box>
            )}
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default BlogForm;
