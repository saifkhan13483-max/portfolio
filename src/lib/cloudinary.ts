interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
}

interface CloudinaryErrorResponse {
  error?: { message?: string };
}

/**
 * Returns true if the URL is a raw Cloudinary URL that has not yet
 * had any delivery transformations applied (i.e. safe to transform).
 */
function isRawCloudinaryUrl(url: string): boolean {
  return !!url?.includes("res.cloudinary.com") && !url.includes("/upload/f_auto");
}

/** Injects a Cloudinary transformation string between "/upload/" and the asset path. */
function applyTransform(url: string, transform: string): string {
  return url.replace("/upload/", `/upload/${transform}/`);
}

/** Returns a full-resolution optimised URL (auto format & quality, capped at 1280 px wide). */
export function optimizeCloudinaryUrl(url: string): string {
  if (!isRawCloudinaryUrl(url)) return url;
  return applyTransform(url, "f_auto,q_auto,c_limit,w_1280");
}

/**
 * Returns a 16:9 card thumbnail (800×450) optimised for desktop grid cards.
 * Use alongside getCloudinaryThumbUrl() in a srcset for responsive loading.
 */
export function getCloudinaryCardUrl(url: string): string {
  if (!isRawCloudinaryUrl(url)) return url;
  return applyTransform(url, "f_auto,q_auto,c_fill,w_800,h_450");
}

/**
 * Returns a compact 16:9 thumbnail (400×225) for mobile screens and small slots.
 * Roughly half the pixel area of getCloudinaryCardUrl — ~60-70% smaller file.
 */
export function getCloudinaryThumbUrl(url: string): string {
  if (!isRawCloudinaryUrl(url)) return url;
  return applyTransform(url, "f_auto,q_auto,c_fill,w_400,h_225");
}

/**
 * Returns a tiny placeholder image (32×18, very low quality) for blur-up loading.
 * Embed as a data-src or use as a CSS background while the real image loads.
 */
export function getCloudinaryPlaceholderUrl(url: string): string {
  if (!isRawCloudinaryUrl(url)) return url;
  return applyTransform(url, "f_auto,q_1,c_fill,w_32,h_18,e_blur:300");
}

/** Uploads a file to Cloudinary using an unsigned upload preset and returns the secure URL. */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "devstudio_uploads";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("cloud_name", cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!response.ok) {
    const errorData: CloudinaryErrorResponse = await response.json().catch(() => ({}));
    throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
  }

  const result: CloudinaryUploadResult = await response.json();
  return result.secure_url;
};
