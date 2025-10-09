import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Image, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProductDialog from '@/components/admin/ProductDialog';
import ProductImagesDialog from '@/components/admin/ProductImagesDialog';
import CSVImportDialog from '@/components/admin/CSVImportDialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { FileUp } from 'lucide-react';

const categories = [
  'All Categories',
  'Portable Cabins',
  'Container Houses',
  'Site Offices',
  'Labor Accommodation',
  'Security Cabins',
  'Sanitation Units',
];

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [csvDialogOpen, setCsvDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data: productsData, error } = await supabase
      .from('products')
      .select('*, product_images(id, image_url, is_primary)')
      .order('created_at', { ascending: false });

    if (!error && productsData) {
      setProducts(productsData);
    }
    setLoading(false);
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setProductDialogOpen(true);
  };

  const handleManageImages = (product: any) => {
    setSelectedProduct(product);
    setImagesDialogOpen(true);
  };

  const handleDelete = async (product: any) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });

      fetchProducts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getPrimaryImage = (product: any) => {
    const primaryImg = product.product_images?.find((img: any) => img.is_primary);
    return primaryImg?.image_url || product.product_images?.[0]?.image_url;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCsvDialogOpen(true)}
            >
              <FileUp className="mr-2 h-4 w-4" />
              CSV Import/Export
            </Button>
            <Button
              onClick={() => {
                setSelectedProduct(null);
                setProductDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : filteredProducts.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            {searchQuery || selectedCategory !== 'All Categories'
              ? 'No products match your filters.'
              : 'No products yet. Add your first product to get started.'}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {getPrimaryImage(product) ? (
                  <img
                    src={getPrimaryImage(product)}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center">
                    <Image className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">
                      {product.product_images?.length || 0} images
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleManageImages(product)}
                    >
                      <Image className="h-4 w-4 mr-1" />
                      Images
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(product)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ProductDialog
        open={productDialogOpen}
        onOpenChange={setProductDialogOpen}
        product={selectedProduct}
        onSuccess={fetchProducts}
      />

      {selectedProduct && (
        <ProductImagesDialog
          open={imagesDialogOpen}
          onOpenChange={setImagesDialogOpen}
          productId={selectedProduct.id}
          productName={selectedProduct.name}
        />
      )}

      <CSVImportDialog
        open={csvDialogOpen}
        onOpenChange={setCsvDialogOpen}
        onSuccess={fetchProducts}
      />
    </AdminLayout>
  );
}
