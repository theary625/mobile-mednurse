import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

// Marketing Pages
export const useMarketingPages = () => {
  return useQuery({
    queryKey: ['marketing-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useMarketingPage = (slug: string) => {
  return useQuery({
    queryKey: ['marketing-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_pages')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!slug,
  });
};

// Marketing Sections
export const useMarketingSections = (pageId: string) => {
  return useQuery({
    queryKey: ['marketing-sections', pageId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!pageId,
  });
};

// Marketing Assets
export const useMarketingAssets = (mediaType?: 'image' | 'video') => {
  return useQuery({
    queryKey: ['marketing-assets', mediaType],
    queryFn: async () => {
      let query = supabase
        .from('marketing_assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (mediaType) {
        query = query.eq('media_type', mediaType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

// Marketing SEO
export const useMarketingSEO = (pageSlug: string) => {
  return useQuery({
    queryKey: ['marketing-seo', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('marketing_seo')
        .select('*')
        .eq('page_slug', pageSlug)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!pageSlug,
  });
};

// Mutations
export const useUpdateMarketingSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: Json }) => {
      const { data, error } = await supabase
        .from('marketing_sections')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketing-sections', data.page_id] });
    },
  });
};

export const useUpdateMarketingSEO = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ pageSlug, updates }: { pageSlug: string; updates: Partial<{
      meta_title: string | null;
      meta_description: string | null;
      og_image: string | null;
      canonical_url: string | null;
      keywords: string[] | null;
      robots: string | null;
    }> }) => {
      const { data: existing } = await supabase
        .from('marketing_seo')
        .select('id')
        .eq('page_slug', pageSlug)
        .single();
      
      if (existing) {
        const { data, error } = await supabase
          .from('marketing_seo')
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq('page_slug', pageSlug)
          .select()
          .single();
        
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('marketing_seo')
          .insert({ page_slug: pageSlug, ...updates })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['marketing-seo', variables.pageSlug] });
    },
  });
};

// Upload marketing asset via edge function
export const useUploadMarketingAsset = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ file, altText }: { file: File; altText?: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      
      const formData = new FormData();
      formData.append('file', file);
      if (altText) formData.append('alt_text', altText);
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-marketing-asset`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-assets'] });
    },
  });
};
