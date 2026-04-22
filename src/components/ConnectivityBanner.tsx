import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff, RefreshCw, X, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useConnectivityOptional } from '@/contexts/ConnectivityContext';
import { useState, useEffect } from 'react';
import { clearStaleSession } from '@/lib/supabase-helpers';

export function ConnectivityBanner() {
  const connectivity = useConnectivityOptional();
  const [isDismissed, setIsDismissed] = useState(false);

  // Get values from context or use defaults
  const isOnline = connectivity?.isOnline ?? null;
  const isChecking = connectivity?.isChecking ?? true;
  const retry = connectivity?.retry ?? (async () => {});
  const retryCount = connectivity?.retryCount ?? 0;

  // Reset dismissed state when connectivity is restored then lost again
  useEffect(() => {
    if (isOnline) {
      setIsDismissed(false);
    }
  }, [isOnline]);

  // Handler for clearing session and reloading
  const handleClearAndReload = () => {
    clearStaleSession();
    window.location.reload();
  };

  // If context not available yet, don't render anything
  if (!connectivity) {
    return null;
  }

  // Show checking state on initial load (isOnline === null)
  if (isOnline === null && isChecking) {
    return (
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-muted border-b border-border shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
            <p className="text-muted-foreground text-sm">
              Checking server connection...
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Don't show banner if online or dismissed
  if (isOnline || isDismissed) {
    return null;
  }

  const showClearOption = retryCount >= 5;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 z-[100] bg-destructive/10 border-b border-destructive/20 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 p-1.5 bg-destructive/20 rounded-full">
                <WifiOff className="h-4 w-4 text-destructive" />
              </div>
              <div className="min-w-0">
                <p className="text-destructive text-sm font-medium truncate">
                  Connection issues detected
                </p>
                <p className="text-destructive/70 text-xs truncate">
                  {showClearOption 
                    ? 'Persistent issue - try clearing session data'
                    : `Some features may be limited. ${retryCount > 0 ? `Retry attempt ${retryCount}` : ''}`
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              {showClearOption && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleClearAndReload}
                  className="h-8 px-3"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Clear & Reload
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => retry()}
                disabled={isChecking}
                className="h-8 px-3"
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Checking...' : 'Retry'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsDismissed(true)}
                className="h-8 w-8 p-0"
                aria-label="Dismiss banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
