interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
}

interface CloudinaryErrorResponse {
  error?: { message?: string };
}

/** Returns a full-resolution optimised Cloudinary URL (auto format, quality, capped at 1280px wide). */
export function optimizeCloudinaryUrl(url: string): string {
  if (!url?.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,c_limit,w_1280/");
}

/** Returns a 16:9 card thumbnail (800×450, auto format + quality). */
export function getCloudinaryCardUrl(url: string): string {
  if (!url?.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,c_fill,w_800,h_450/");
}

/** Returns a small 16:9 thumbnail (400×225, auto format + quality). */
export function getCloudinaryThumbUrl(url: string): string {
  if (!url?.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto")) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,c_fill,w_400,h_225/");
}

/** Uploads a file to Cloudinary using an unsigned upload preset and returns the secure URL. */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'devstudio_uploads';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('cloud_name', cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) {
    const errorData: CloudinaryErrorResponse = await response.json().catch(() => ({}));
    throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
  }

  const result: CloudinaryUploadResult = await response.json();
  return result.secure_url;
};
