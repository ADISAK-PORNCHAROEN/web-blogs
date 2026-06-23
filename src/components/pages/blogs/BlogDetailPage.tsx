"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, notFound } from "next/navigation";
import Loading from "@/app/loading";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Alert,
  AppBar,
  Box,
  Button,
  Card,
  CardMedia,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useBlogDetail } from "@/hooks/blogs/useBlogQueries";
import { useCreateComment } from "@/hooks/blogs/useBlogMutations";
import { getApiErrorMessage } from "@/lib/apiError";
import { articleHtmlSx } from "@/lib/content";
import { commentSchema } from "@/lib/validations";
import type { Blog } from "@/types/blog";
import type { CommentInput } from "@/types/comment";

interface BlogDetailPageProps {
  slug: string;
}

const BlogImageGallery = ({ blog }: { blog: Blog }): React.JSX.Element => {
  const [activeImage, setActiveImage] = useState<string>(blog.coverImage);
  const allImages = [blog.coverImage, ...(blog.additionalImages || [])].filter(Boolean);

  return (
    <Box sx={{ mb: 4 }}>
      <Card sx={{ borderRadius: 3, overflow: "hidden", mb: 2 }}>
        <CardMedia component="img" height="450" image={activeImage} alt={blog.title} sx={{ objectFit: "cover", width: "100%" }} />
      </Card>

      {allImages.length > 1 ? (
        <Grid container spacing={1}>
          {allImages.map((image, index) => (
            <Grid key={`${image}-${index}`} size={{ xs: 3, sm: 2 }}>
              <Card
                sx={{
                  cursor: "pointer",
                  border: activeImage === image ? "2px solid" : "2px solid transparent",
                  borderColor: "secondary.main",
                  borderRadius: 2,
                  overflow: "hidden",
                  height: 60,
                }}
                onClick={() => setActiveImage(image)}
              >
                <CardMedia component="img" height="60" image={image} alt={`thumbnail-${index}`} sx={{ objectFit: "cover", height: "100%" }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}
    </Box>
  );
};

const BlogDetailPage = ({ slug }: BlogDetailPageProps): React.JSX.Element => {
  const router = useRouter();
  const [successOpen, setSuccessOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { data: blog, isLoading, isError } = useBlogDetail(slug);
  console.log("blog:", blog, isLoading)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      senderName: "",
      content: "",
    },
  });

  const commentMutation = useCreateComment(blog?.id || "", slug);

  const onSubmit = async (input: CommentInput): Promise<void> => {
    setErrorMessage(null);

    try {
      await commentMutation.mutateAsync(input);
      setSuccessOpen(true);
      reset();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "เกิดข้อผิดพลาดในการส่งความคิดเห็น"));
    }
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !blog) {
    notFound();
    return <></>;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <IconButton edge="start" color="inherit" aria-label="back" onClick={() => router.push("/")} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, flexGrow: 1 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Web Blogs
              </Link>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 6, flexGrow: 1 }}>
        <Box component="article">
          <Box sx={{ display: "flex", gap: 3, mb: 2, color: "text.secondary" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: "1rem" }} />
              <Typography variant="body2">{formatDate(blog.createdAt)}</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: "1.1rem" }} />
              <Typography variant="body2">{blog.views} วิว</Typography>
            </Box>
          </Box>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.3, mb: 3 }}>
            {blog.title}
          </Typography>

          <BlogImageGallery blog={blog} />

          <Box className="ck-content" sx={{ ...articleHtmlSx, mb: 6 }} dangerouslySetInnerHTML={{ __html: blog.content }} />

          <Divider sx={{ my: 4 }} />

          <Box sx={{ mb: 6 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              ความคิดเห็น ({blog.comments?.length || 0})
            </Typography>

            {blog.comments && blog.comments.length > 0 ? (
              <List sx={{ p: 0 }}>
                {blog.comments.map((comment) => (
                  <ListItem
                    key={comment.id}
                    alignItems="flex-start"
                    sx={{
                      px: 2,
                      py: 2,
                      mb: 2,
                      bgcolor: "background.paper",
                      borderRadius: 2,
                      boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    }}
                  >
                    <AccountCircleIcon sx={{ mr: 2, mt: 0.5, color: "action.active", fontSize: 40 }} />
                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            {comment.senderName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" color="text.primary" sx={{ whiteSpace: "pre-line" }}>
                          {comment.content}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic", mb: 3 }}>
                ยังไม่มีความคิดเห็นใดๆ สำหรับบล็อกนี้
              </Typography>
            )}
          </Box>

          <Card sx={{ p: 3, borderRadius: 3, bgcolor: "background.paper" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              เขียนความคิดเห็นของคุณ
            </Typography>

            {errorMessage ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            ) : null}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="ชื่อผู้ส่ง"
                    variant="outlined"
                    {...register("senderName")}
                    error={!!errors.senderName}
                    helperText={errors.senderName?.message}
                    disabled={commentMutation.isPending}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="ข้อความความคิดเห็น (ภาษาไทยและตัวเลขเท่านั้น)"
                    variant="outlined"
                    {...register("content")}
                    error={!!errors.content}
                    helperText={errors.content?.message}
                    disabled={commentMutation.isPending}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button type="submit" variant="contained" color="secondary" disabled={commentMutation.isPending} sx={{ px: 4, py: 1 }}>
                    {commentMutation.isPending ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </Box>
      </Container>

      <Snackbar open={successOpen} autoHideDuration={6000} onClose={() => setSuccessOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: "100%" }}>
          ส่งความคิดเห็นสำเร็จ! ข้อความของคุณจะปรากฏเมื่อได้รับอนุมัติจากผู้ดูแลระบบ
        </Alert>
      </Snackbar>

      <Box sx={{ bgcolor: "primary.main", color: "white", py: 4, mt: "auto" }}>
        <Container maxWidth="lg">
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            &copy; {new Date().getFullYear()} Web Blogs. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default BlogDetailPage;
