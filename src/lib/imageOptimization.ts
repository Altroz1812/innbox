import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  fileType?: string;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
};

/**
 * Compress an image file before upload
 * Converts to WebP when possible for better compression
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    // Check if file is already small enough
    if (file.size <= (mergedOptions.maxSizeMB! * 1024 * 1024)) {
      return file;
    }

    const compressedFile = await imageCompression(file, mergedOptions);
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    return file; // Return original if compression fails
  }
};

/**
 * Compress multiple images in parallel
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {}
): Promise<File[]> => {
  return Promise.all(files.map(file => compressImage(file, options)));
};

/**
 * Get Supabase Storage URL with transformation parameters
 * Supabase automatically transforms images on the fly
 */
export const getOptimizedImageUrl = (
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
): string => {
  if (!url) return url;

  // Only transform if it's a Supabase storage URL
  if (!url.includes('supabase')) return url;

  const params = new URLSearchParams();
  
  if (options?.width) params.append('width', options.width.toString());
  if (options?.height) params.append('height', options.height.toString());
  if (options?.quality) params.append('quality', options.quality.toString());
  if (options?.format) params.append('format', options.format);

  const queryString = params.toString();
  if (!queryString) return url;

  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`;
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (url: string, widths: number[] = [480, 800, 1200, 1920]): string => {
  return widths
    .map(width => `${getOptimizedImageUrl(url, { width, quality: 80 })} ${width}w`)
    .join(', ');
};

/**
 * Get image dimensions from file
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ width: img.width, height: img.height });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image'));
    };

    img.src = objectUrl;
  });
};
