"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useBlogList } from "@/hooks/blogs/useBlogQueries";
import { createExcerpt } from "@/lib/content";

const HomePage = (): React.JSX.Element => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const { data, isLoading, isError } = useBlogList({
    page,
    search: debouncedSearch,
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number): void => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky" color="primary" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 800, letterSpacing: "-0.025em" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                Web Blogs
              </Link>
            </Typography>
            {/* <Button
              component={Link}
              href="/admin"
              variant="outlined"
              color="inherit"
              startIcon={<AdminPanelSettingsIcon />}
              sx={{ borderColor: "rgba(255, 255, 255, 0.5)", "&:hover": { borderColor: "#fff" } }}
            >
              ผู้ดูแลระบบ
            </Button> */}
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          bgcolor: "primary.dark",
          color: "white",
          py: { xs: 8, md: 12 },
          backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "3rem" } }}>
              ยินดีต้อนรับสู่ Web Blogs
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.8, fontWeight: 400 }}>
              อ่านบทความ เทคนิค และข่าวสารความรู้เกี่ยวกับ Web Development ล่าสุด
            </Typography>

            <Card sx={{ p: 1, borderRadius: 3, maxWidth: 600, mx: "auto" }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="ค้นหาบทความที่คุณต้องการ..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "transparent" },
                    "&:hover fieldset": { borderColor: "transparent" },
                    "&.Mui-focused fieldset": { borderColor: "transparent" },
                  },
                }}
              />
            </Card>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6, flexGrow: 1 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
            <CircularProgress color="secondary" />
          </Box>
        ) : isError ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="error">
              เกิดข้อผิดพลาดในการดึงข้อมูลบล็อก กรุณาลองใหม่อีกครั้ง
            </Typography>
          </Box>
        ) : !data || data.data.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="textSecondary">
              ไม่พบบทความบล็อกตรงกับคำค้นหาของคุณ
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={4}>
              {data.data.map((blog) => (
                <Grid key={blog.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 3 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={blog.coverImage || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800"}
                      alt={blog.title}
                      sx={{ objectFit: "cover" }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: "flex", gap: 2, mb: 1.5, color: "text.secondary" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <CalendarTodayIcon sx={{ fontSize: "0.875rem" }} />
                          <Typography variant="caption">{formatDate(blog.createdAt)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <VisibilityIcon sx={{ fontSize: "0.875rem" }} />
                          <Typography variant="caption">{blog.views} วิว</Typography>
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
                        }}
                      >
                        {blog.title}
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
                        {createExcerpt(blog.content)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                      <Button component={Link} href={`/blogs/${blog.slug}`} size="small" color="secondary" variant="contained" fullWidth sx={{ borderRadius: 2 }}>
                        อ่านเพิ่มเติม
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {data.lastPage > 1 ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
                <Pagination count={data.lastPage} page={page} onChange={handlePageChange} color="secondary" size="large" />
              </Box>
            ) : null}
          </>
        )}
      </Container>

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

export default HomePage;
