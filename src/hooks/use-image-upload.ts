import { useMutation } from '@tanstack/react-query';
import { uploadToCloudinary } from '../lib/cloudinary';
import { useToast } from './use-toast';

export const useImageUpload = () => {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: uploadToCloudinary,
    onError: (error: any) => {
      console.error('Image upload failed:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'There was an error uploading your image.',
        variant: 'destructive',
      });
    },
  });
};
