import type { ChangeEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { useToast } from '@/hooks/use-toast';
import { validateImageFile } from '@/features/admin/utils/validate-image-file';

/**
 * Mutation hook for uploading images to Cloudinary.
 *
 * Returns the standard TanStack Query mutation object plus a `handleFileChange`
 * convenience method that validates the selected file, uploads it, and calls
 * `onSuccess` with the resulting URL — eliminating the boilerplate that was
 * previously duplicated across every admin page with a file input.
 *
 * Error toasts for upload failures are shown by the mutation's `onError`
 * callback, so callers do not need their own catch blocks.
 */
export const useImageUpload = () => {
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: uploadToCloudinary,
    onError: (error: Error) => {
      console.error('Image upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'There was an error uploading your image.',
        variant: 'destructive',
      });
    },
  });

  /**
   * Drop-in `onChange` handler for `<input type="file">` elements.
   * Validates the file, uploads it, and calls `onSuccess` with the URL.
   * If validation fails or the upload errors, a toast is shown automatically.
   */
  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.ok) {
      toast({ title: validation.title, description: validation.description, variant: 'destructive' });
      return;
    }

    // Let mutation.onError handle the error toast; resolve to null on failure.
    const url = await mutation.mutateAsync(file).catch(() => null);
    if (url) {
      onSuccess(url);
      toast({ title: 'Image uploaded' });
    }
  };

  return { ...mutation, handleFileChange };
};
