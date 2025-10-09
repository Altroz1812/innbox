import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, fetchProductBySlug, fetchRelatedProducts, type ProductWithImages } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Query keys
export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (category?: string) => [...productsKeys.lists(), { category }] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productsKeys.details(), slug] as const,
  related: (categorySlug: string, productId: string) => [...productsKeys.all, 'related', categorySlug, productId] as const,
};

// Fetch all products with caching
export const useProducts = (category?: string) => {
  return useQuery({
    queryKey: productsKeys.list(category),
    queryFn: async () => {
      const products = await fetchProducts();
      if (category) {
        return products.filter(p => p.category_slug === category);
      }
      return products;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Fetch single product by slug with caching
export const useProduct = (slug: string | undefined) => {
  return useQuery({
    queryKey: productsKeys.detail(slug || ''),
    queryFn: () => fetchProductBySlug(slug || ''),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Fetch related products with caching
export const useRelatedProducts = (categorySlug: string, productId: string, enabled = true) => {
  return useQuery({
    queryKey: productsKeys.related(categorySlug, productId),
    queryFn: () => fetchRelatedProducts(categorySlug, productId),
    enabled: enabled && !!categorySlug && !!productId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// Delete product mutation with optimistic update
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
    },
    onMutate: async (productId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: productsKeys.lists() });

      // Snapshot previous value
      const previousProducts = queryClient.getQueryData(productsKeys.lists());

      // Optimistically update to remove the product
      queryClient.setQueriesData(
        { queryKey: productsKeys.lists() },
        (old: ProductWithImages[] | undefined) => {
          if (!old) return old;
          return old.filter((p) => p.id !== productId);
        }
      );

      return { previousProducts };
    },
    onError: (err, productId, context) => {
      // Rollback on error
      if (context?.previousProducts) {
        queryClient.setQueryData(productsKeys.lists(), context.previousProducts);
      }
      toast.error('Failed to delete product');
    },
    onSuccess: () => {
      toast.success('Product deleted successfully');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ProductWithImages> }) => {
      const { error } = await supabase
        .from('products')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productsKeys.detail(variables.id) });
      toast.success('Product updated successfully');
    },
    onError: () => {
      toast.error('Failed to update product');
    },
  });
};
