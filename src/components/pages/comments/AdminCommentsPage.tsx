"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DataTable } from "@/components/ui/DataTable";
import type { GridColDef } from "@mui/x-data-grid";
import type { AdminComment } from "@/types/comment";
import { getApiErrorMessage } from "@/lib/apiError";
import { useAdminComments } from "@/hooks/comments/useCommentQueries";
import { useApproveComment, useRejectComment } from "@/hooks/comments/useCommentMutations";

const AdminCommentsPage = (): React.JSX.Element => {
  const [feedback, setFeedback] = useState<{ message: string; severity: "success" | "error" } | null>(null);
  const { data: comments, isLoading, isError } = useAdminComments();
  const approveMutation = useApproveComment();
  const rejectMutation = useRejectComment();

  const handleApprove = useCallback((commentId: string): void => {
    approveMutation.mutate(commentId, {
      onSuccess: () => {
        setFeedback({ message: "อนุมัติความคิดเห็นสำเร็จแล้ว", severity: "success" });
      },
      onError: (error) => {
        setFeedback({
          message: getApiErrorMessage(error, "เกิดข้อผิดพลาดในการอนุมัติความคิดเห็น"),
          severity: "error",
        });
      },
    });
  }, [approveMutation]);

  const handleReject = useCallback((commentId: string): void => {
    rejectMutation.mutate(commentId, {
      onSuccess: () => {
        setFeedback({ message: "ปฏิเสธความคิดเห็นสำเร็จแล้ว", severity: "success" });
      },
      onError: (error) => {
        setFeedback({
          message: getApiErrorMessage(error, "เกิดข้อผิดพลาดในการปฏิเสธความคิดเห็น"),
          severity: "error",
        });
      },
    });
  }, [rejectMutation]);

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

  const columns = useMemo<GridColDef<AdminComment>[]>(
    () => [
      {
        field: "senderName",
        headerName: "ผู้ส่ง",
        width: 150,
        renderCell: (params) => (
          <Box sx={{ fontWeight: 700, display: "flex", alignItems: "center", height: "100%" }}>
            {params.value as string}
          </Box>
        ),
      },
      {
        field: "content",
        headerName: "ข้อความความคิดเห็น",
        flex: 1.5,
        minWidth: 280,
        renderCell: (params) => (
          <Box sx={{ whiteSpace: "pre-line", display: "flex", alignItems: "center", height: "100%", py: 1 }}>
            {params.value as string}
          </Box>
        ),
      },
      {
        field: "blog",
        headerName: "เกี่ยวกับบล็อก",
        flex: 1,
        minWidth: 200,
        renderCell: (params) => {
          const blogTitle = params.row.blog?.title || "-";
          return (
            <Box sx={{ fontWeight: 500, display: "flex", alignItems: "center", height: "100%" }}>
              {blogTitle}
            </Box>
          );
        },
      },
      {
        field: "createdAt",
        headerName: "เวลาที่ส่ง",
        width: 180,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
            {formatDate(params.value as string)}
          </Box>
        ),
      },
      {
        field: "approved",
        headerName: "สถานะ",
        width: 130,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            {params.value ? (
              <Chip
                icon={<CheckCircleIcon />}
                label="อนุมัติแล้ว"
                color="success"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            ) : (
              <Chip
                icon={<CancelIcon />}
                label="รออนุมัติ"
                color="warning"
                size="small"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "การจัดการ",
        width: 200,
        align: "center",
        headerAlign: "center",
        sortable: false,
        renderCell: (params) => {
          const comment = params.row;
          return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, height: "100%", flexWrap: "wrap", py: 0.5 }}>
              {!comment.approved ? (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleApprove(comment.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    sx={{ fontWeight: 600 }}
                  >
                    อนุมัติ
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => handleReject(comment.id)}
                    disabled={approveMutation.isPending || rejectMutation.isPending}
                    sx={{ fontWeight: 600 }}
                  >
                    ปฏิเสธ
                  </Button>
                </>
              ) : (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleReject(comment.id)}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                  sx={{ fontWeight: 600 }}
                >
                  ยกเลิกอนุมัติ
                </Button>
              )}
            </Box>
          );
        },
      },
    ],
    [approveMutation.isPending, rejectMutation.isPending, handleApprove, handleReject, formatDate],
  );

  return (
    <Box sx={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, flexShrink: 0 }}>
        จัดการและตรวจสอบความคิดเห็น
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 2, flexShrink: 0 }}>
          เกิดข้อผิดพลาดในการเชื่อมต่อดึงข้อมูลความคิดเห็น
        </Alert>
      )}

      {!comments || comments.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center", borderRadius: 2, flexShrink: 0 }}>
          <Typography variant="body1" color="text.secondary">
            ยังไม่มีผู้ส่งความคิดเห็นเข้ามาในระบบในขณะนี้
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ flexGrow: 1, minHeight: 0, width: "100%" }}>
          <DataTable<AdminComment>
            rows={comments}
            columns={columns}
            loading={isLoading}
          />
        </Box>
      )}

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

export default AdminCommentsPage;
