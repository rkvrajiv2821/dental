import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes: number;
  format: string;
  resourceType: string;
}

/**
 * Central storage adapter. Cloudinary is the default implementation; swap this
 * module for an S3-compatible one without touching any caller (media actions,
 * upload routes) — every caller only depends on this interface.
 */
export async function uploadToStorage(
  buffer: Buffer,
  options: { folder?: string; resourceType?: "image" | "video" | "raw" } = {}
): Promise<UploadResult> {
  const { folder = "dental-clinic/general", resourceType = "image" } = options;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload failed"));
          return;
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          format: result.format,
          resourceType: result.resource_type,
        });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteFromStorage(publicId: string, resourceType: "image" | "video" | "raw" = "image") {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}
