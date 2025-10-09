import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface CSVImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ProductRow {
  name: string;
  category: string;
  category_slug: string;
  short_description: string;
  description: string;
  features: string;
  specifications: string;
}

export default function CSVImportDialog({ open, onOpenChange, onSuccess }: CSVImportDialogProps) {
  const [previewData, setPreviewData] = useState<ProductRow[]>([]);
  const [importing, setImporting] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const exportToCSV = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('name, category, category_slug, short_description, description, features, specifications');

      if (error) throw error;

      const csv = [
        'name,category,category_slug,short_description,description,features,specifications',
        ...products.map(p => [
          `"${p.name}"`,
          `"${p.category}"`,
          `"${p.category_slug}"`,
          `"${p.short_description || ''}"`,
          `"${p.description || ''}"`,
          `"${JSON.stringify(p.features || [])}"`,
          `"${JSON.stringify(p.specifications || [])}"`,
        ].join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Products exported successfully');
    } catch (error: any) {
      toast.error('Export failed: ' + error.message);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

        const data: ProductRow[] = lines.slice(1).map(line => {
          const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
          const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));

          return {
            name: cleanValues[0] || '',
            category: cleanValues[1] || '',
            category_slug: cleanValues[2] || '',
            short_description: cleanValues[3] || '',
            description: cleanValues[4] || '',
            features: cleanValues[5] || '[]',
            specifications: cleanValues[6] || '[]',
          };
        });

        setPreviewData(data);
      } catch (error: any) {
        toast.error('Failed to parse CSV: ' + error.message);
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    setImporting(true);

    try {
      const products = previewData.map(row => ({
        name: row.name,
        slug: generateSlug(row.name),
        category: row.category,
        category_slug: row.category_slug || generateSlug(row.category),
        short_description: row.short_description || null,
        description: row.description || null,
        features: JSON.parse(row.features),
        specifications: JSON.parse(row.specifications),
      }));

      const { error } = await supabase
        .from('products')
        .insert(products);

      if (error) throw error;

      toast.success(`${products.length} products imported successfully`);
      onSuccess();
      onOpenChange(false);
      setPreviewData([]);
    } catch (error: any) {
      toast.error('Import failed: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>CSV Import/Export</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={exportToCSV} variant="outline" className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Export to CSV
            </Button>
            <div className="flex-1">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="w-full">
                <Button variant="outline" className="w-full" asChild>
                  <span>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload CSV
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {previewData.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-medium mb-2">Preview ({previewData.length} products)</h3>
                <div className="border rounded-lg max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.slice(0, 10).map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell>{row.category}</TableCell>
                          <TableCell className="max-w-xs truncate">{row.short_description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {previewData.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      And {previewData.length - 10} more...
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-muted p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">CSV Format Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Headers: name, category, category_slug, short_description, description, features, specifications</li>
                  <li>Features and specifications must be valid JSON arrays</li>
                  <li>Use quotes for fields containing commas</li>
                </ul>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            Cancel
          </Button>
          {previewData.length > 0 && (
            <Button onClick={handleImport} disabled={importing}>
              {importing ? 'Importing...' : `Import ${previewData.length} Products`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
