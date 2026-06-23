import { NextRequest, NextResponse } from "next/server";
import backendAxios from "@/lib/backendAxios";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const response = await backendAxios.post(`/blogs/${id}/comments`, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error(`API POST /blogs/${id}/comments error:`, err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to submit comment" },
      { status: err.response?.status || 500 }
    );
  }
}
