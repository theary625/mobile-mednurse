import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface NotFoundError {
  page_path: string;
  hits: number;
  last_seen: string;
}

interface NotFoundStatistics {
  totalErrors: number;
  uniquePaths: number;
  topMissingPages: NotFoundError[];
  isLoading: boolean;
  error: Error | null;
}

export const use404Statistics = (dateRange?: string): NotFoundStatistics => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['404-statistics', dateRange],
    queryFn: async () => {
      // Get date filter based on range
      let dateFilter = new Date();
      switch (dateRange) {
        case '7d':
          dateFilter.setDate(dateFilter.getDate() - 7);
          break;
        case '30d':
          dateFilter.setDate(dateFilter.getDate() - 30);
          break;
        case '90d':
          dateFilter.setDate(dateFilter.getDate() - 90);
          break;
        default:
          dateFilter.setDate(dateFilter.getDate() - 30); // Default to 30 days
      }

      // Fetch all 404 errors within the date range
      const { data: errors, error: fetchError } = await supabase
        .from('not_found_errors')
        .select('page_path, created_at')
        .gte('created_at', dateFilter.toISOString())
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Aggregate by page_path
      const pathStats = new Map<string, { hits: number; lastSeen: string }>();
      
      errors?.forEach((error) => {
        const existing = pathStats.get(error.page_path);
        if (existing) {
          existing.hits += 1;
          // Update last_seen if this is more recent
          if (new Date(error.created_at) > new Date(existing.lastSeen)) {
            existing.lastSeen = error.created_at;
          }
        } else {
          pathStats.set(error.page_path, {
            hits: 1,
            lastSeen: error.created_at,
          });
        }
      });

      // Convert to array and sort by hits
      const topMissingPages: NotFoundError[] = Array.from(pathStats.entries())
        .map(([path, stats]) => ({
          page_path: path,
          hits: stats.hits,
          last_seen: stats.lastSeen,
        }))
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 10); // Top 10

      return {
        totalErrors: errors?.length || 0,
        uniquePaths: pathStats.size,
        topMissingPages,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    totalErrors: data?.totalErrors || 0,
    uniquePaths: data?.uniquePaths || 0,
    topMissingPages: data?.topMissingPages || [],
    isLoading,
    error: error as Error | null,
  };
};

// Helper function to format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else {
    return `${diffDays}d ago`;
  }
};

export default use404Statistics;
