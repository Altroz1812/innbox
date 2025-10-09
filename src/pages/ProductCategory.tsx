import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { productCategories } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductsByCategory, getPrimaryImage, type ProductWithImages } from "@/lib/products";
import { useToast } from "@/hooks/use-toast";

const ProductCategory = () => {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = productCategories.find((cat) => cat.slug === category);
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProducts = async () => {
      if (!category) return;
      
      try {
        setLoading(true);
        const data = await fetchProductsByCategory(category);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [category, toast]);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <Link to="/products">
            <Button>View All Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-muted py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              <Home className="h-4 w-4" />
            </Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
            <span>/</span>
            <span className="text-foreground">{categoryInfo.name}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{categoryInfo.name}</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Explore our range of {categoryInfo.name.toLowerCase()} solutions
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-full">
                  <Skeleton className="aspect-video w-full rounded-t-lg" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.category_slug}/${product.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer group bg-card">
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img
                        src={getPrimaryImage(product)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">{product.short_description}</p>
                      <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductCategory;
