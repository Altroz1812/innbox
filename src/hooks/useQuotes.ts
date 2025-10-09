import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface QuoteRequest {
  id: string;
  company: string | null;
  contact_name: string;
  email: string;
  phone: string | null;
  product_interest: string | null;
  timeline: string | null;
  budget_range: string | null;
  details: string | null;
  status: 'pending' | 'quoted' | 'converted' | 'closed';
  created_at: string;
  product_id: string | null;
  attachments: any;
}

// Query keys
export const quotesKeys = {
  all: ['quotes'] as const,
  lists: () => [...quotesKeys.all, 'list'] as const,
  list: (status?: string) => [...quotesKeys.lists(), { status }] as const,
};

// Fetch all quote requests
export const useQuotes = (status?: string) => {
  return useQuery({
    queryKey: quotesKeys.list(status),
    queryFn: async () => {
      let query = supabase
        .from('quote_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status as 'pending' | 'quoted' | 'converted' | 'closed');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as QuoteRequest[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

// Update quote status with optimistic update
export const useUpdateQuoteStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: QuoteRequest['status'] }) => {
      const { error } = await supabase
        .from('quote_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: quotesKeys.lists() });

      const previousQuotes = queryClient.getQueryData(quotesKeys.lists());

      queryClient.setQueriesData(
        { queryKey: quotesKeys.lists() },
        (old: QuoteRequest[] | undefined) => {
          if (!old) return old;
          return old.map((quote) =>
            quote.id === id ? { ...quote, status } : quote
          );
        }
      );

      return { previousQuotes };
    },
    onError: (err, variables, context) => {
      if (context?.previousQuotes) {
        queryClient.setQueryData(quotesKeys.lists(), context.previousQuotes);
      }
      toast.error('Failed to update status');
    },
    onSuccess: () => {
      toast.success('Status updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: quotesKeys.lists() });
    },
  });
};
