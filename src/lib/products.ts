import { supabase } from "@/integrations/supabase/client";

export interface ProductWithImages {
  id: string;
  name: string;
  slug: string;
  category: string;
  category_slug: string;
  short_description: string | null;
  description: string | null;
  features: any;
  specifications: any;
  created_at: string;
  updated_at: string;
  product_images: Array<{
    id: string;
    image_url: string;
    is_primary: boolean | null;
    display_order: number | null;
  }>;
}

export const fetchProducts = async (): Promise<ProductWithImages[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary,
        display_order
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchProductBySlug = async (slug: string): Promise<ProductWithImages | null> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary,
        display_order
      )
    `)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data;
};

export const fetchProductsByCategory = async (categorySlug: string): Promise<ProductWithImages[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary,
        display_order
      )
    `)
    .eq("category_slug", categorySlug)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

export const fetchRelatedProducts = async (categorySlug: string, excludeId: string, limit = 3): Promise<ProductWithImages[]> => {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_images (
        id,
        image_url,
        is_primary,
        display_order
      )
    `)
    .eq("category_slug", categorySlug)
    .neq("id", excludeId)
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getPrimaryImage = (product: ProductWithImages): string => {
  const primaryImage = product.product_images?.find((img) => img.is_primary);
  if (primaryImage) return primaryImage.image_url;
  
  const sortedImages = [...(product.product_images || [])].sort(
    (a, b) => (a.display_order || 0) - (b.display_order || 0)
  );
  return sortedImages[0]?.image_url || "/placeholder.svg";
};

export const getProductImages = (product: ProductWithImages): string[] => {
  return [...(product.product_images || [])]
    .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
    .map(img => img.image_url);
};
