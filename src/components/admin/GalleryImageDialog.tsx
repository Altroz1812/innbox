import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '@/lib/imageUpload';

const gallerySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['Residential', 'Commercial', 'Industrial', 'Institutional']),
  display_order: z.number().optional(),
});

type GalleryFormData = z.infer<typeof gallerySchema>;

interface GalleryImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  image?: any;
  onSuccess: () => void;
}

export default function GalleryImageDialog({
  open,
  onOpenChange,
  image,
  onSuccess,
}: GalleryImageDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GalleryFormData>({
    resolver: zodResolver(gallerySchema),
  });

  const selectedCategory = watch('category');

  useEffect(() => {
    if (image) {
      setValue('title', image.title);
      setValue('description', image.description || '');
      setValue('category', image.category);
      setValue('display_order', image.display_order);
    } else {
      reset();
    }
    setFile(null);
  }, [image, setValue, reset]);

  const onSubmit = async (data: GalleryFormData) => {
    if (!image && !file) {
      toast({
        title: 'Error',
        description: 'Please select an image',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      let imageUrl = image?.image_url;

      if (file) {
        imageUrl = await uploadImage(file, 'project-images');
      }

      const imageData = {
        title: data.title,
        description: data.description,
        category: data.category,
        image_url: imageUrl,
        display_order: data.display_order || 0,
      };

      if (image) {
        const { error } = await supabase
          .from('project_images')
          .update(imageData)
          .eq('id', image.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Image updated successfully',
        });
      } else {
        const { error } = await supabase.from('project_images').insert([imageData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Image uploaded successfully',
        });
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{image ? 'Edit Image' : 'Upload Image'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!image && (
            <div>
              <Label htmlFor="file">Image File *</Label>
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG, or WebP (max 5MB)
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description')} rows={3} />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select value={selectedCategory} onValueChange={(value: any) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Residential">Residential</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
                <SelectItem value="Industrial">Industrial</SelectItem>
                <SelectItem value="Institutional">Institutional</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              {...register('display_order', { valueAsNumber: true })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : image ? 'Update' : 'Upload'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
