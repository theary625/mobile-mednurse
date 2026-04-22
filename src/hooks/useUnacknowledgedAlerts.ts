import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUnacknowledgedAlerts = () => {
  const [alertCount, setAlertCount] = useState<number>(0);

  const fetchAlertCount = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { count } = await supabase
      .from('safety_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('acknowledged', false);
    
    setAlertCount(count ?? 0);
  }, []);

  useEffect(() => {
    fetchAlertCount();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('safety-alerts-count')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'safety_alerts'
        },
        () => {
          fetchAlertCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAlertCount]);

  return { alertCount, refetchAlertCount: fetchAlertCount };
};
