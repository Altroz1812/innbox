import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import GalleryImageDialog from '@/components/admin/GalleryImageDialog';
import BulkUploadDialog from '@/components/admin/BulkUploadDialog';
import { useToast } from '@/hooks/use-toast';
import { deleteImage } from '@/lib/imageUpload';
import { Badge } from '@/components/ui/badge';
import { Upload } from 'lucide-react';

export default function AdminGallery() {
  const { toast } = useToast();
  const [images, setImages] = useState<any[]>([]);
  const [filteredImages, setFilteredImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [images, selectedCategory]);

  const fetchImages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  };

  const filterImages = () => {
    if (selectedCategory === 'All') {
      setFilteredImages(images);
    } else {
      setFilteredImages(images.filter((img) => img.category === selectedCategory));
    }
  };

  const handleEdit = (image: any) => {
    setSelectedImage(image);
    setDialogOpen(true);
  };

  const handleDelete = async (image: any) => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) return;

    try {
      await deleteImage(image.image_url, 'project-images');
      const { error } = await supabase.from('project_images').delete().eq('id', image.id);

      if (error) throw error;

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
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Project Gallery</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setBulkUploadOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Bulk Upload
            </Button>
            <Button
              onClick={() => {
                setSelectedImage(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Residential">Residential</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Institutional">Institutional</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-sm text-muted-foreground">
            {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredImages.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            {selectedCategory !== 'All'
              ? 'No images in this category.'
              : 'No project images yet. Add your first image to get started.'}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <Card key={image.id} className="overflow-hidden group">
                <div className="relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(image)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(image)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold">{image.title}</h3>
                    <Badge variant="outline">{image.category}</Badge>
                  </div>
                  {image.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <GalleryImageDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        image={selectedImage}
        onSuccess={fetchImages}
      />

      <BulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onSuccess={fetchImages}
      />
    </AdminLayout>
  );
}
