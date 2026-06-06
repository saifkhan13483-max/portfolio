/** Maximum allowed image upload size (5 MB). */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export type ImageFileValidationResult =
  | { ok: true }
  | { ok: false; title: string; description: string };

/**
 * Validates a File before uploading to Cloudinary.
 * Returns `{ ok: true }` on success, or an error object with
 * `title` and `description` ready to pass directly to `useToast`.
 */
export function validateImageFile(file: File): ImageFileValidationResult {
  if (!file.type.startsWith("image/")) {
    return { ok: false, title: "Invalid file type", description: "Please upload an image" };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { ok: false, title: "File too large", description: "Maximum size is 5MB" };
  }
  return { ok: true };
}
