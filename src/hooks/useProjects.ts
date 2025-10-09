import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjectImages, type ProjectImage } from '@/lib/projects';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Query keys
export const projectsKeys = {
  all: ['projects'] as const,
  lists: () => [...projectsKeys.all, 'list'] as const,
  list: (category?: string) => [...projectsKeys.lists(), { category }] as const,
};

// Fetch all projects with caching
export const useProjects = (category?: string) => {
  return useQuery({
    queryKey: projectsKeys.list(category),
    queryFn: async () => {
      const projects = await fetchProjectImages();
      if (category && category !== 'all') {
        return projects.filter(p => p.category === category);
      }
      return projects;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Delete project mutation with optimistic update
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
    },
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: projectsKeys.lists() });

      const previousProjects = queryClient.getQueryData(projectsKeys.lists());

      queryClient.setQueriesData(
        { queryKey: projectsKeys.lists() },
        (old: ProjectImage[] | undefined) => {
          if (!old) return old;
          return old.filter((p) => p.id !== projectId);
        }
      );

      return { previousProjects };
    },
    onError: (err, projectId, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(projectsKeys.lists(), context.previousProjects);
      }
      toast.error('Failed to delete project');
    },
    onSuccess: () => {
      toast.success('Project deleted successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
    },
  });
};

// Update project mutation
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { 
      id: string; 
      data: {
        title?: string;
        description?: string;
        category?: 'Residential' | 'Commercial' | 'Industrial' | 'Institutional';
        display_order?: number;
      } 
    }) => {
      const { error } = await supabase
        .from('project_images')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
      toast.success('Project updated successfully');
    },
    onError: () => {
      toast.error('Failed to update project');
    },
  });
};
