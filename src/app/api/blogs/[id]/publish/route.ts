import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import backendAxios from "@/lib/backendAxios";

interface CustomSession {
  user: {
    accessToken: string;
  };
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
    const response = await backendAxios.patch(`/blogs/${id}/publish`, body, {
      headers: {
        Authorization: `Bearer ${session.user.accessToken}`,
      },
    });
    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string };
    console.error(`API PATCH /blogs/${id}/publish error:`, err.response?.data || err.message);
    return NextResponse.json(
      { message: err.response?.data?.message || "Failed to toggle publish status" },
      { status: err.response?.status || 500 }
    );
  }
}
