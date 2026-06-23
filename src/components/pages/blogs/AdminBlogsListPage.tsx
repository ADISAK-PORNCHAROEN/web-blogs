"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SearchIcon from "@mui/icons-material/Search";
import { DataTable } from "@/components/ui/DataTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { Blog } from "@/types/blog";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAdminBlogList } from "@/hooks/blogs/useBlogQueries";
import { useDeleteBlog, usePublishBlog } from "@/hooks/blogs/useBlogMutations";

const AdminBlogsListPage = (): React.JSX.Element => {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const publishMutation = usePublishBlog();
  const deleteMutation = useDeleteBlog();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 450);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const { data, isLoading, isError } = useAdminBlogList({
    page,
    search: debouncedSearch,
  });

  const handlePublishToggle = useCallback((blog: Blog): void => {
    publishMutation.mutate(
      { id: blog.id, published: !blog.published },
      {
        onSuccess: (_, variables) => {
          setFeedback({
            message: variables.published ? "เผยแพร่บล็อกเรียบร้อยแล้ว" : "ยกเลิกการเผยแพร่บล็อกเรียบร้อยแล้ว",
            severity: "success",
          });
        },
        onError: () => {
          setFeedback({
            message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะการเผยแพร่",
            severity: "error",
          });
        },
      },
    );
  }, [publishMutation]);

  const handleDeleteConfirm = (): void => {
    if (!deleteId) {
      return;
    }

    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        setFeedback({
          message: "ลบบทความบล็อกสำเร็จแล้ว",
          severity: "success",
        });
        setDeleteId(null);
      },
      onError: (error) => {
        setFeedback({
          message: getApiErrorMessage(error, "เกิดข้อผิดพลาดในการลบบล็อก"),
          severity: "error",
        });
        setDeleteId(null);
      },
    });
  };

  const formatDate = useCallback((dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateStr;
    }
  }, []);

  const columns = useMemo<GridColDef<Blog>[]>(
    () => [
      {
        field: "title",
        headerName: "หัวข้อบล็อก",
        flex: 1.5,
        minWidth: 280,
        renderCell: (params) => (
          <Box sx={{ fontWeight: 500, whiteSpace: "normal", wordBreak: "break-word", display: "flex", alignItems: "center", height: "100%" }}>
            {params.value as string}
          </Box>
        ),
      },
      {
        field: "slug",
        headerName: "URL Slug",
        flex: 1,
        minWidth: 180,
        renderCell: (params) => (
          <Box sx={{ fontFamily: "monospace", display: "flex", alignItems: "center", height: "100%" }}>
            {params.value as string}
          </Box>
        ),
      },
      {
        field: "views",
        headerName: "เข้าชม (วิว)",
        width: 110,
        type: "number",
        align: "left",
        headerAlign: "left",
      },
      {
        field: "createdAt",
        headerName: "วันที่เขียน",
        width: 180,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {formatDate(params.value as string)}
          </Box>
        ),
      },
      {
        field: "published",
        headerName: "เผยแพร่",
        width: 110,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
            <Switch
              checked={params.row.published}
              onChange={() => handlePublishToggle(params.row)}
              color="secondary"
              disabled={publishMutation.isPending}
            />
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "การจัดการ",
        width: 150,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%", width: "100%" }}>
            <IconButton
              component={Link}
              href={`/blogs/${params.row.slug}`}
              target="_blank"
              size="small"
              color="info"
              title="ดูหน้าจริง"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
            <IconButton
              component={Link}
              href={`/admin/blogs/${params.row.id}`}
              size="small"
              color="primary"
              title="แก้ไขบล็อก"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => setDeleteId(params.row.id)}
              title="ลบบล็อก"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [publishMutation.isPending, handlePublishToggle, formatDate],
  );

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexShrink: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          บทความบล็อกทั้งหมด
        </Typography>
        <Button
          component={Link}
          href="/admin/blogs/create"
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          sx={{ py: 1, px: 2, fontWeight: 700 }}
        >
          สร้างบล็อกใหม่
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2, borderRadius: 2, flexShrink: 0 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="ค้นหาชื่อบทความบล็อก..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          slotProps={{
            input: {
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            },
          }}
        />
      </Paper>

      {isError && (
        <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
          เกิดข้อผิดพลาดในการเชื่อมต่อดึงข้อมูลบทความบล็อก
        </Alert>
      )}

      <Box sx={{ flexGrow: 1, minHeight: 0, width: "100%" }}>
        <DataTable<Blog>
          rows={data?.data ?? []}
          columns={columns}
          loading={isLoading}
          paginationMode="server"
          rowCount={data?.total ?? 0}
          page={page}
          pageSize={10}
          onPageChange={setPage}
        />
      </Box>

      <Dialog open={deleteId !== null} onClose={() => setDeleteId(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>ยืนยันการลบบทความบล็อก?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            คุณกำลังจะลบบทความบล็อกนี้ออกจากระบบ การดำเนินการนี้จะเป็นการทำ Soft Delete ข้อมูลในระบบ
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteId(null)} disabled={deleteMutation.isPending}>
            ยกเลิก
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "กำลังลบ..." : "ยืนยันการลบ"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback !== null}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {feedback ? (
          <Alert onClose={() => setFeedback(null)} severity={feedback.severity} sx={{ width: "100%" }}>
            {feedback.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};

export default AdminBlogsListPage;
