import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { uploadImage, deleteImage } from '@/lib/imageUpload';
import { Upload, Trash2, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProductImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
}

export default function ProductImagesDialog({
  open,
  onOpenChange,
  productId,
  productName,
}: ProductImagesDialogProps) {
  const { toast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (open && productId) {
      fetchImages();
    }
  }, [open, productId]);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('display_order', { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const imageUrl = await uploadImage(file, 'product-images');

        const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.display_order)) : -1;

        await supabase.from('product_images').insert([
          {
            product_id: productId,
            image_url: imageUrl,
            is_primary: images.length === 0,
            display_order: maxOrder + 1,
          },
        ]);
      }

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
      });

      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    try {
      // Unset all primary flags
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Set selected as primary
      await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);

      toast({
        title: 'Success',
        description: 'Primary image updated',
      });

      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (image: any) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteImage(image.image_url, 'product-images');
      await supabase.from('product_images').delete().eq('id', image.id);

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
      });

      fetchImages();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Images - {productName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Upload JPG, PNG, or WebP images (max 5MB each)
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading images...</div>
          ) : images.length === 0 ? (
            <Card className="p-12 text-center text-muted-foreground">
              <Upload className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No images yet. Upload your first image to get started.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <Card key={image.id} className="relative group overflow-hidden">
                  <img
                    src={image.image_url}
                    alt="Product"
                    className="w-full aspect-square object-cover"
                  />
                  {image.is_primary && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" />
                      Primary
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!image.is_primary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetPrimary(image.id)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
