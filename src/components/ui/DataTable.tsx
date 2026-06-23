"use client";

import React from "react";
import { DataGrid, type GridColDef, type GridValidRowModel } from "@mui/x-data-grid";
import { Box } from "@mui/material";

interface DataTableProps<R extends GridValidRowModel> {
  rows: R[];
  columns: GridColDef<R>[];
  loading?: boolean;
  height?: number | string;
  autoHeight?: boolean;
  paginationMode?: "server" | "client";
  rowCount?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

export function DataTable<R extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  height = "100%",
  autoHeight = false,
  paginationMode = "client",
  rowCount,
  page,
  pageSize = 10,
  onPageChange,
}: DataTableProps<R>): React.JSX.Element {
  const paginationProps =
    paginationMode === "server"
      ? {
          paginationMode: "server" as const,
          rowCount: rowCount ?? 0,
          paginationModel: page !== undefined ? { page: page - 1, pageSize } : undefined,
          onPaginationModelChange: (model: { page: number; pageSize: number }) => {
            if (onPageChange) {
              onPageChange(model.page + 1);
            }
          },
          pageSizeOptions: [pageSize],
        }
      : {
          paginationMode: "client" as const,
          initialState: {
            pagination: {
              paginationModel: { page: 0, pageSize },
            },
          },
          pageSizeOptions: [10, 20],
        };

  return (
    <Box sx={{ width: "100%", height: autoHeight ? "auto" : height }}>
      <DataGrid
        rows={rows}
        loading={loading}
        columns={columns}
        disableRowSelectionOnClick
        autoHeight={autoHeight}
        sx={{
          width: "100%",
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          bgcolor: "background.paper",
          "& .MuiDataGrid-columnHeader": {
            bgcolor: "background.default",
            color: "text.primary",
            fontWeight: 700,
          },
        }}
        {...paginationProps}
      />
    </Box>
  );
}
