import { useConnectivityOptional } from '@/contexts/ConnectivityContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Wifi, WifiOff, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

/**
 * Dev-only debug panel showing connectivity status details
 * Only renders in development mode
 */
export function ConnectivityDebugPanel() {
  // Only show in development
  if (!import.meta.env.DEV) {
    return null;
  }

  return <DebugPanelContent />;
}

function DebugPanelContent() {
  const connectivity = useConnectivityOptional();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!connectivity) {
    return null;
  }

  const {
    isOnline,
    isChecking,
    lastChecked,
    lastOnline,
    retryCount,
    error,
    lastStatusCode,
    lastErrorType,
    retry,
  } = connectivity;

  const getStatusIcon = () => {
    if (isOnline === null) return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
    if (isOnline) return <Wifi className="h-4 w-4 text-primary" />;
    return <WifiOff className="h-4 w-4 text-destructive" />;
  };

  const getStatusText = () => {
    if (isOnline === null) return 'Unknown';
    if (isChecking) return 'Checking...';
    return isOnline ? 'Online' : 'Offline';
  };

  const getStatusColor = () => {
    if (isOnline === null) return 'bg-muted';
    if (isOnline) return 'bg-primary/10 border-primary/30';
    return 'bg-destructive/10 border-destructive/30';
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };

  return (
    <div className={`fixed bottom-4 right-4 z-[200] rounded-lg border shadow-lg ${getStatusColor()} backdrop-blur-sm`}>
      {/* Collapsed header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-3 py-2 w-full text-left hover:bg-accent/50 rounded-lg transition-colors"
      >
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 ml-auto" />
        ) : (
          <ChevronUp className="h-4 w-4 ml-auto" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 space-y-2 border-t border-border/50">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-mono">
              {isOnline === null ? 'null' : isOnline ? 'true' : 'false'}
            </span>
            
            <span className="text-muted-foreground">Checking:</span>
            <span className="font-mono">{isChecking ? 'true' : 'false'}</span>
            
            <span className="text-muted-foreground">Last Check:</span>
            <span className="font-mono">{formatTime(lastChecked)}</span>
            
            <span className="text-muted-foreground">Last Online:</span>
            <span className="font-mono">{formatTime(lastOnline)}</span>
            
            <span className="text-muted-foreground">Retry Count:</span>
            <span className="font-mono">{retryCount}</span>
            
            <span className="text-muted-foreground">Status Code:</span>
            <span className="font-mono">{lastStatusCode ?? 'N/A'}</span>
            
            <span className="text-muted-foreground">Error Type:</span>
            <span className="font-mono text-destructive">{lastErrorType ?? 'None'}</span>
          </div>
          
          {error && (
            <div className="flex items-start gap-1.5 p-2 bg-destructive/10 rounded text-xs">
              <AlertCircle className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
              <span className="text-destructive break-all">{error}</span>
            </div>
          )}
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => retry()}
            disabled={isChecking}
            className="w-full h-7 text-xs"
          >
            <RefreshCw className={`h-3 w-3 mr-1.5 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Checking...' : 'Force Retry'}
          </Button>
          
          <p className="text-[10px] text-muted-foreground text-center">
            Dev panel • Open console for detailed logs
          </p>
        </div>
      )}
    </div>
  );
}
