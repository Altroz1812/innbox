import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  inquiry_type: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  created_at: string;
}

// Query keys
export const inquiriesKeys = {
  all: ['inquiries'] as const,
  lists: () => [...inquiriesKeys.all, 'list'] as const,
  list: (status?: string) => [...inquiriesKeys.lists(), { status }] as const,
};

// Fetch all inquiries
export const useInquiries = (status?: string) => {
  return useQuery({
    queryKey: inquiriesKeys.list(status),
    queryFn: async () => {
      let query = supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status as 'new' | 'contacted' | 'closed');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Inquiry[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  });
};

// Update inquiry status with optimistic update
export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Inquiry['status'] }) => {
      const { error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: inquiriesKeys.lists() });

      const previousInquiries = queryClient.getQueryData(inquiriesKeys.lists());

      queryClient.setQueriesData(
        { queryKey: inquiriesKeys.lists() },
        (old: Inquiry[] | undefined) => {
          if (!old) return old;
          return old.map((inquiry) =>
            inquiry.id === id ? { ...inquiry, status } : inquiry
          );
        }
      );

      return { previousInquiries };
    },
    onError: (err, variables, context) => {
      if (context?.previousInquiries) {
        queryClient.setQueryData(inquiriesKeys.lists(), context.previousInquiries);
      }
      toast.error('Failed to update status');
    },
    onSuccess: () => {
      toast.success('Status updated');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: inquiriesKeys.lists() });
    },
  });
};
