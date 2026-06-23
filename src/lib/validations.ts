import { z } from "zod";

export const thaiAndNumbersRegex = /^[ \u0e00-\u0e7f0-9\s\.\,\?\!\-\(\)]*$/;

const isValidImageReference = (value: string): boolean => {
  if (value.startsWith("/uploads/")) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const imageReferenceSchema = z
  .string()
  .trim()
  .min(1, "กรุณาอัปโหลดรูปภาพ")
  .refine(isValidImageReference, {
    message: "รูปภาพต้องเป็นไฟล์ที่อัปโหลดแล้วหรือ URL ที่ถูกต้อง",
  });

export const commentSchema = z.object({
  senderName: z
    .string()
    .min(2, "ชื่อผู้ส่งต้องระบุความยาวอย่างน้อย 2 ตัวอักษร")
    .max(50, "ชื่อผู้ส่งมีความยาวเกินกำหนด (สูงสุด 50 ตัวอักษร)"),
  content: z
    .string()
    .min(1, "กรุณากรอกข้อความความคิดเห็น")
    .max(1000, "ความคิดเห็นต้องมีขนาดไม่เกิน 1,000 ตัวอักษร")
    .refine((val) => thaiAndNumbersRegex.test(val), {
      message: "ความคิดเห็นต้องเป็นภาษาไทย ตัวเลข และเครื่องหมายวรรคตอนพื้นฐานเท่านั้น ห้ามมีภาษาอังกฤษหรืออักขระพิเศษอื่น ๆ",
    }),
});

export const blogSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .min(5, "ชื่อหัวข้อบล็อกต้องมีอย่างน้อย 5 ตัวอักษร")
    .max(150, "ชื่อหัวข้อบล็อกมีขนาดเกินกำหนด"),
  content: z
    .string()
    .min(10, "เนื้อหาบล็อกต้องมีอย่างน้อย 10 ตัวอักษร")
    .refine(
      (val) => {
        const matches = val.match(/<img\s[^>]*>/gi);
        const count = matches ? matches.length : 0;
        return count <= 7;
      },
      {
        message: "สามารถใส่รูปภาพในเนื้อหาบทความได้ไม่เกิน 7 รูป",
      }
    ),
  coverImage: imageReferenceSchema,
  additionalImages: z
    .array(imageReferenceSchema)
    .max(6, "รูปภาพประกอบเพิ่มเติมได้ไม่เกิน 6 รูปภาพ")
    .optional(),
  slug: z
    .string()
    .min(3, "URL Slug ต้องมีอย่างน้อย 3 ตัวอักษร")
    .regex(/^[a-z0-9-_]+$/, "URL Slug ต้องประกอบด้วยตัวอักษรพิมพ์เล็ก ภาษาอังกฤษ ตัวเลข เครื่องหมายขีดกลาง (-) หรือขีดล่าง (_) เท่านั้น"),
  published: z.boolean().optional(),
});
