import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { compressImage } from '@/lib/imageOptimization';

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface UploadFile {
  file: File;
  preview: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

const PROJECT_CATEGORIES = ['Residential', 'Commercial', 'Industrial', 'Institutional'];

export default function BulkUploadDialog({ open, onOpenChange, onSuccess }: BulkUploadDialogProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [category, setCategory] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length + files.length > 10) {
      toast.error('Maximum 10 files allowed');
      return;
    }

    const newFiles: UploadFile[] = selectedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      status: 'pending' as const,
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpload = async () => {
    if (!category) {
      toast.error('Please select a category');
      return;
    }

    if (files.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      try {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading' as const } : f
        ));

        const compressedFile = await compressImage(files[i].file);
        const fileName = `${Date.now()}-${i}-${files[i].file.name}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('project-images')
          .upload(fileName, compressedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('project-images')
          .getPublicUrl(uploadData.path);

        const { error: insertError } = await supabase
          .from('project_images')
          .insert({
            title: files[i].file.name.replace(/\.[^/.]+$/, ''),
            category: category as any,
            image_url: publicUrl,
            display_order: i,
          });

        if (insertError) throw insertError;

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success' as const } : f
        ));
      } catch (error: any) {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error' as const, error: error.message } : f
        ));
      }
    }

    setUploading(false);
    const successCount = files.filter(f => f.status === 'success').length;
    const errorCount = files.filter(f => f.status === 'error').length;

    if (successCount > 0) {
      toast.success(`${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} image${errorCount > 1 ? 's' : ''} failed to upload`);
    }

    if (errorCount === 0) {
      onSuccess();
      onOpenChange(false);
      setFiles([]);
      setCategory('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bulk Upload Images</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Images (Max 10)</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="bulk-upload"
                disabled={uploading || files.length >= 10}
              />
              <label htmlFor="bulk-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Click to select images or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  {files.length} / 10 files selected
                </p>
              </label>
            </div>
          </div>

          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative border rounded-lg p-2">
                  <img
                    src={file.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs truncate flex-1">{file.file.name}</span>
                    {file.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {file.status === 'uploading' && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                    </div>
                  )}
                  {file.status === 'success' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                      ✓
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center rounded-lg p-2">
                      <p className="text-xs text-destructive-foreground text-center">
                        {file.error}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={uploading || files.length === 0 || !category}>
            {uploading ? 'Uploading...' : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
