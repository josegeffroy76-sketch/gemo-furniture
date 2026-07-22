import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { isAdminAuthenticated } from "@/lib/admin-auth";

// Give the upload (network round-trip to Blob storage) more room than the
// platform default before the function is killed, so large/slow uploads
// fail with our own JSON error instead of an empty, unparseable response.
export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024; // 4MB — comfortably under Vercel's request body limit
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(request: Request) {
  // Top-level guard: any unexpected throw here (auth check, form parsing,
  // etc.) should still come back as a JSON body, never an empty/plain-text
  // response the client can't parse.
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error:
            "Photo storage isn't set up yet. In Vercel, go to Storage → Create Database → Blob, connect it to this project, then redeploy.",
        },
        { status: 501 }
      );
    }

    const formData = await request.formData().catch(() => null);
    const file = formData?.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file received." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Please upload a JPEG, PNG, WEBP, or AVIF image." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Image is too large (max 4MB)." }, { status: 400 });
    }

    const extension = file.name.split(".").pop() || "jpg";
    const pathname = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: file.type,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("Blob upload error:", err);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 502 });
  }
}
