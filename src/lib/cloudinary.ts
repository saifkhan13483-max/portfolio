interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
}

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'devstudio_uploads');
  formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.error?.message || response.statusText}`);
    }

    const result: CloudinaryUploadResult = await response.json();
    return result.secure_url;
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    throw new Error(error.message || 'Failed to upload image');
  }
};
