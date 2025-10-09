import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPrimaryImage } from "@/lib/products";
import { useProducts } from "@/hooks/useProducts";
import portableCabin from "@/assets/portable-cabin.jpg";
import siteOffice from "@/assets/site-office.jpg";
import containerHouse from "@/assets/container-house.jpg";

const fallbackProducts = [
  {
    tag: "PREFAB BUILDINGS",
    title: "Prefabricated",
    subtitle: "Buildings",
    description: "Prefabricated buildings are manufactured at the factory area and shipped to the site, to wherever it will be assembled. All the assembly kits and components have been sent together. The prefabricated buildings are used as labor accommodation buildings, engineers accommodation buildings, staff accommodation buildings, dining halls, office buildings, ablution units and also used as houses/villas.",
    image: portableCabin,
    reverse: false,
  },
  {
    tag: "CONTAINERS",
    title: "Flat Pack",
    subtitle: "Containers / Cabins",
    description: "Containers were mostly used for transportation purposes till to end of 20th century. Then the new type of accommodation containers started to be used in order to ship these accommodation containers to other markets. The containers started to be manufactured as demounted. This way open the new markets for manufacturers.",
    image: siteOffice,
    reverse: true,
  },
  {
    tag: "CABINS",
    title: "Security & Sanitary",
    subtitle: "Cabins",
    description: "Innbox Modular Prefab manufactures security and sanitary cabins in India. The sanitary cabins can be produced as toilet or shower or both can be in same cabin. The security and sanitary cabins can be produced in many different dimensions. The security and sanitary cabins can be ship as ready to use or demountable to save on transportation costs.",
    image: containerHouse,
    reverse: false,
  },
];

const ProductShowcase = () => {
  // Use React Query for data fetching with caching
  const { data: products = [], isLoading } = useProducts();

  const displayProducts = products.length > 0 
    ? products.slice(0, 3).map((p, i) => ({
        tag: p.category.toUpperCase(),
        title: p.name.split(' ')[0],
        subtitle: p.name.split(' ').slice(1).join(' '),
        description: p.description || p.short_description || '',
        image: getPrimaryImage(p),
        reverse: i % 2 === 1,
        slug: p.slug,
        categorySlug: p.category_slug,
      }))
    : fallbackProducts.map((p, i) => ({ ...p, slug: '', categorySlug: '' }));
  
  if (isLoading) {
    return (
      <section id="products" className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="space-y-24">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-12 items-center">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-1 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="space-y-24">
          {displayProducts.map((product, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                product.reverse ? "md:grid-flow-dense" : ""
              }`}
            >
              <div className={product.reverse ? "md:col-start-2" : ""}>
                <p className="text-xs font-semibold tracking-wider text-muted-foreground mb-3 uppercase">
                  {product.tag}
                </p>
                <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  <span className="text-primary">{product.title}</span> {product.subtitle}
                </h3>
                <div className="w-16 h-1 bg-primary mb-6" />
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>
                <Button className="bg-primary hover:bg-primary/90 min-h-[44px]" asChild>
                  <Link to={product.slug ? `/products/${product.categorySlug}/${product.slug}` : '/products'}>
                    Read More
                  </Link>
                </Button>
              </div>

              <div className={product.reverse ? "md:col-start-1 md:row-start-1" : ""}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/10 rounded-lg transform group-hover:scale-105 transition-transform duration-300" />
                  <img
                    src={product.image}
                    alt={`${product.title} ${product.subtitle}`}
                    className="rounded-lg shadow-xl w-full relative z-10"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
