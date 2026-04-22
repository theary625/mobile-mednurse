import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MAX_FAVORITES = 5;

export const useFavoriteTools = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      
      setUserId(user.id);

      const { data, error } = await supabase
        .from('user_tool_favorites')
        .select('tool_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setFavorites(data.map(f => f.tool_id));
      }
      setLoading(false);
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = useCallback(async (toolId: string) => {
    if (!userId) return { success: false, error: 'Not authenticated' };

    const isFavorite = favorites.includes(toolId);

    if (isFavorite) {
      // Remove favorite
      const { error } = await supabase
        .from('user_tool_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('tool_id', toolId);

      if (error) return { success: false, error: error.message };
      
      setFavorites(prev => prev.filter(id => id !== toolId));
      return { success: true, action: 'removed' };
    } else {
      // Check limit
      if (favorites.length >= MAX_FAVORITES) {
        return { success: false, error: `Maximum ${MAX_FAVORITES} favorites allowed` };
      }

      // Add favorite
      const { error } = await supabase
        .from('user_tool_favorites')
        .insert({ user_id: userId, tool_id: toolId });

      if (error) return { success: false, error: error.message };
      
      setFavorites(prev => [...prev, toolId]);
      return { success: true, action: 'added' };
    }
  }, [userId, favorites]);

  const isFavorite = useCallback((toolId: string) => {
    return favorites.includes(toolId);
  }, [favorites]);

  return {
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
    canAddMore: favorites.length < MAX_FAVORITES,
    maxFavorites: MAX_FAVORITES,
  };
};
