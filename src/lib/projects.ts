import { supabase } from "@/integrations/supabase/client";

export interface ProjectImage {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  display_order: number | null;
  created_at: string;
}

export const fetchProjectImages = async (): Promise<ProjectImage[]> => {
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
};

export const fetchProjectImagesByCategory = async (category: string): Promise<ProjectImage[]> => {
  const { data, error } = await supabase
    .from("project_images")
    .select("*")
    .eq("category", category as any)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data || [];
};
