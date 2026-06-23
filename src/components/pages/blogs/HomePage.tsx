"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Box,
  Card,
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
import SearchIcon from "@mui/icons-material/Search";
import { useBlogList } from "@/hooks/blogs/useBlogQueries";
import { createExcerpt } from "@/lib/content";

const HomePage = (): React.JSX.Element => {
  const router = useRouter();
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
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          bgcolor: "primary.dark",
          color: "white",
          py: { xs: 5, md: 6 },
          backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: 2,
                maxWidth: 450,
                mx: "auto",
                bgcolor: "background.paper",
                boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
              }}
            >
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="ค้นหาบทความที่คุณต้องการ..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" fontSize="small" />
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
            </Box>
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
                <Grid key={blog.id} size={{ xs: 12 }}>
                  <Card
                    onClick={() => router.push(`/blogs/${blog.slug}`)}
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", md: "row" },
                      height: { xs: "auto", md: 200 },
                      borderRadius: 3,
                      cursor: "pointer",
                      overflow: "hidden",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                      },
                    }}
                  >
                    <Box sx={{ width: { xs: "100%", md: 300 }, height: { xs: 200, md: "100%" }, position: "relative", flexShrink: 0 }}>
                      <CardMedia
                        component="img"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        image={blog.coverImage || "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800"}
                        alt={blog.title}
                      />
                    </Box>
                    <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1, p: 3, overflow: "hidden" }}>
                      <Box sx={{ display: "flex", gap: 2, mb: 1, color: "text.secondary" }}>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {formatDate(blog.createdAt)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          &bull;&nbsp;&nbsp;{blog.views} วิว
                        </Typography>
                      </Box>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="h2"
                        sx={{
                          fontWeight: 800,
                          lineHeight: 1.3,
                          color: "text.primary",
                          "&:hover": {
                            color: "secondary.main",
                          },
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {blog.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        &ldquo;{createExcerpt(blog.content)}&rdquo;
                      </Typography>
                    </CardContent>
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
