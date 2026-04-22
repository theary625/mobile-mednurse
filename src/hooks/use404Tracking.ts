import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('mednurse_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('mednurse_session_id', sessionId);
  }
  return sessionId;
};

export const use404Tracking = () => {
  const location = useLocation();

  useEffect(() => {
    const track404Error = async () => {
      try {
        // Get current user if logged in
        const { data: { user } } = await supabase.auth.getUser();

        await supabase.from('not_found_errors').insert({
          page_path: location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: getSessionId(),
          user_id: user?.id || null,
        });
      } catch (error) {
        // Silently fail - don't disrupt user experience for analytics
        console.debug('404 tracking failed:', error);
      }
    };

    // Track after a small delay to ensure page is loaded
    const timeout = setTimeout(track404Error, 100);
    return () => clearTimeout(timeout);
  }, [location.pathname]);
};

export default use404Tracking;
