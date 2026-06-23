import { randomUUID } from "node:crypto";
import path from "node:path";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/s3";

interface CustomSession {
  user: {
    accessToken: string;
  };
}

const maxUploadSize = 8 * 1024 * 1024;

const createErrorResponse = (message: string, status: number): NextResponse => {
  return NextResponse.json(
    {
      error: {
        message,
      },
      message,
    },
    { status },
  );
};

export async function POST(request: Request): Promise<NextResponse> {
  const session = (await getServerSession(authOptions)) as CustomSession | null;

  if (!session?.user?.accessToken) {
    return createErrorResponse("Unauthorized", 401);
  }

  const formData = await request.formData();
  const fileValue = formData.get("upload") || formData.get("file");

  if (!(fileValue instanceof File)) {
    return createErrorResponse("กรุณาเลือกรูปภาพที่ต้องการอัปโหลด", 400);
  }

  if (!fileValue.type.startsWith("image/")) {
    return createErrorResponse("รองรับเฉพาะไฟล์รูปภาพเท่านั้น", 400);
  }

  if (fileValue.size > maxUploadSize) {
    return createErrorResponse("ขนาดรูปภาพต้องไม่เกิน 8 MB", 400);
  }

  const { searchParams } = new URL(request.url);
  const blogId = searchParams.get("blogId") || randomUUID();

  const fileExtension = path.extname(fileValue.name) || ".png";
  const cleanOriginalName = path.basename(fileValue.name, fileExtension)
    .replace(/[^a-zA-Z0-9-_]/g, "_");
  const safeFileName = `${cleanOriginalName}-${Date.now()}${fileExtension.toLowerCase()}`;
  const fileBuffer = Buffer.from(await fileValue.arrayBuffer());

  const bucketName = process.env.S3_BUCKET || "blogs";
  const objectKey = `${blogId}/${safeFileName}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: objectKey,
        Body: fileBuffer,
        ContentType: fileValue.type,
      })
    );

    let fileUrl = "";
    if (process.env.S3_ENDPOINT) {
      fileUrl = `${process.env.S3_ENDPOINT}/${bucketName}/${objectKey}`;
    } else {
      fileUrl = `https://${bucketName}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${objectKey}`;
    }

    return NextResponse.json(
      {
        url: fileUrl,
        urls: {
          default: fileUrl,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("S3 upload error:", err.message);
    return createErrorResponse(`ล้มเหลวในการอัปโหลดรูปภาพไปยัง S3: ${err.message}`, 500);
  }
}
