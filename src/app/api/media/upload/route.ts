import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { can } from "@/lib/auth/rbac";
import { prisma } from "@/lib/db/prisma";
import { uploadToStorage, isCloudinaryConfigured } from "@/lib/storage/cloudinary";
import { logAudit } from "@/lib/audit";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from "@/lib/validations/media";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || !can(session.user.role as never, "media")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Media storage isn't configured yet. Add CLOUDINARY_* credentials to your environment." },
      { status: 503 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "general";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  const maxSize = isVideo ? MAX_VIDEO_SIZE_BYTES : MAX_IMAGE_SIZE_BYTES;
  if (file.size > maxSize) {
    return NextResponse.json({ error: "File is too large" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadToStorage(buffer, {
      folder: `dental-clinic/${folder}`,
      resourceType: isVideo ? "video" : "image",
    });

    const media = await prisma.media.create({
      data: {
        filename: file.name,
        url: result.url,
        publicId: result.publicId,
        type: isVideo ? "VIDEO" : "IMAGE",
        mimeType: file.type,
        size: result.bytes,
        width: result.width,
        height: result.height,
        folder,
        uploadedById: session.user.id,
      },
    });

    await logAudit({ userId: session.user.id, action: "upload", entity: "Media", entityId: media.id });

    return NextResponse.json({ media });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
