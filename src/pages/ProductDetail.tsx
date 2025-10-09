import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Home, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import QuoteModal from "@/components/QuoteModal";
import { getPrimaryImage, getProductImages } from "@/lib/products";
import { productSchema, breadcrumbSchema } from "@/lib/structuredData";
import { getOptimizedImageUrl, generateSrcSet } from "@/lib/imageOptimization";
import { useProduct, useRelatedProducts } from "@/hooks/useProducts";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  // Use React Query for data fetching with caching
  const { data: product, isLoading, isError } = useProduct(slug);
  const { data: relatedProducts = [] } = useRelatedProducts(
    product?.category_slug || '',
    product?.id || '',
    !!product
  );

  // Track product view
  useEffect(() => {
    if (product?.id) {
      supabase
        .from('product_views')
        .insert({ product_id: product.id })
        .then(({ error }) => {
          if (error) console.error('Failed to track view:', error);
        });
    }
  }, [product?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>View All Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = getProductImages(product);
  const features = Array.isArray(product.features) ? product.features : [];
  const specifications = Array.isArray(product.specifications) ? product.specifications : [];
  const primaryImage = productImages[0] || getPrimaryImage(product);

  return (
    <div className="min-h-screen">
      <SEO
        title={`${product.name} - ${product.category}`}
        description={product.description || product.short_description || `High-quality ${product.name} from MaxPrefabs. ${product.category} solutions for your construction needs.`}
        keywords={`${product.name}, ${product.category}, prefabricated ${product.category.toLowerCase()}, modular construction`}
        ogImage={primaryImage}
        ogType="product"
        structuredData={{
          "@context": "https://schema.org",
          "@graph": [
            productSchema({
              name: product.name,
              description: product.description || product.short_description || '',
              image: primaryImage,
              category: product.category,
              slug: product.slug
            }),
          breadcrumbSchema([
            { name: "Home", url: "https://innboxprefab.com/" },
            { name: "Products", url: "https://innboxprefab.com/products" },
            { name: product.category, url: `https://innboxprefab.com/products/${product.category_slug}` },
            { name: product.name, url: `https://innboxprefab.com/products/${product.category_slug}/${product.slug}` }
          ])
          ]
        }}
      />
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
            <Link to={`/products/${product.category_slug}`} className="hover:text-primary">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg">
              <img
                src={getOptimizedImageUrl(primaryImage, { width: 800, quality: 85 })}
                srcSet={generateSrcSet(primaryImage)}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt={product.name}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* Product Info */}
            <div>
              <div className="text-sm text-primary font-medium mb-2">{product.category}</div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground text-lg mb-6">{product.short_description}</p>
              <p className="text-muted-foreground mb-6">{product.description}</p>
              <Button size="lg" onClick={() => setIsQuoteModalOpen(true)} className="min-h-[44px]">
                Get Quote
              </Button>
            </div>
          </div>

          {/* Features Section */}
          {features.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Key Features</h2>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{typeof feature === 'string' ? feature : feature.value || ''}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications Section */}
          {specifications.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Technical Specifications</h2>
              <dl className="space-y-2">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex border-b border-border py-2">
                    <dt className="font-medium w-1/3">{spec.label || ''}</dt>
                    <dd className="text-muted-foreground w-2/3">{spec.value || ''}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Related Products</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedProducts.map((related) => (
                  <Link key={related.id} to={`/products/${related.category_slug}/${related.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={getOptimizedImageUrl(getPrimaryImage(related), { width: 400, quality: 80 })}
                          srcSet={generateSrcSet(getPrimaryImage(related), [320, 480, 640])}
                          sizes="(max-width: 768px) 100vw, 33vw"
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                          {related.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{related.short_description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <QuoteModal 
        open={isQuoteModalOpen} 
        onOpenChange={setIsQuoteModalOpen}
        productId={product.id}
        productName={product.name}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
