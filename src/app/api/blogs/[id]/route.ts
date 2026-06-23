import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import backendAxios from "@/lib/backendAxios";

interface CustomSession {
  user: {
    accessToken: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session || !session.user?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await backendAxios.get(`/blogs/admin/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    const blogData = response.data && typeof response.data === "object" && "data" in response.data ? response.data.data : response.data;
    return NextResponse.json(blogData);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error(`API GET /blogs/admin/${id} error:`, err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to fetch admin blog details" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session || !session.user?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const response = await backendAxios.patch(`/blogs/${id}`, body, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error(`API PATCH /blogs/${id} error:`, err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to update blog" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authOptions)) as CustomSession | null;
  if (!session || !session.user?.accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await backendAxios.delete(`/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error(`API DELETE /blogs/${id} error:`, err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to delete blog" },
      { status: err.response?.status || 500 }
    );
  }
}
