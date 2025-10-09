import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (
  file: File,
  bucket: 'product-images' | 'project-images'
): Promise<string> => {
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPG, PNG, and WebP are allowed.');
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB.');
  }

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  return data.publicUrl;
};

export const deleteImage = async (
  url: string,
  bucket: 'product-images' | 'project-images'
): Promise<void> => {
  // Extract filename from URL
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];

  const { error } = await supabase.storage.from(bucket).remove([fileName]);

  if (error) {
    throw new Error(`Delete failed: ${error.message}`);
  }
};
