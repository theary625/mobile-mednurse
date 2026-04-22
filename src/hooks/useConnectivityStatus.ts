import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isConnectivityError, clearStaleSession } from '@/lib/supabase-helpers';

export interface ConnectivityStatus {
  isOnline: boolean | null; // null = unknown/checking initial state
  isChecking: boolean;
  lastChecked: Date | null;
  lastOnline: Date | null;
  retryCount: number;
  error: string | null;
  lastStatusCode: number | null;
  lastErrorType: string | null;
}

interface UseConnectivityStatusOptions {
  checkInterval?: number; // ms between health checks when online
  retryInterval?: number; // initial ms between retries when offline
  maxRetryInterval?: number; // max ms between retries
  autoCleanupThreshold?: number; // consecutive failures before clearing stale session
}

const DEFAULT_OPTIONS: UseConnectivityStatusOptions = {
  checkInterval: 60000, // 60s when online
  retryInterval: 5000,  // 5s initial retry
  maxRetryInterval: 30000, // max 30s between retries
  autoCleanupThreshold: 3, // clear stale session after 3 consecutive failures
};

// Structured logging helper - only logs in development
const isDev = import.meta.env.DEV;

interface ConnectivityLogEntry {
  timestamp: string;
  event: 'health_check_start' | 'health_check_success' | 'health_check_error' | 'state_change';
  route?: string;
  method?: string;
  statusCode?: number | null;
  errorType?: string;
  errorMessage?: string;
  elapsedMs?: number;
  retryCount?: number;
  clientOnline?: boolean;
  previousState?: boolean | null;
  newState?: boolean | null;
}

function logConnectivity(entry: ConnectivityLogEntry) {
  if (!isDev) return;
  
  const { timestamp, event, ...rest } = entry;
  const prefix = `[Connectivity ${timestamp}]`;
  
  // Color-code based on event type
  switch (event) {
    case 'health_check_success':
      console.log(`%c${prefix} ✓ ${event}`, 'color: #22c55e', rest);
      break;
    case 'health_check_error':
      console.warn(`${prefix} ✗ ${event}`, rest);
      break;
    case 'state_change':
      const color = rest.newState ? '#22c55e' : '#ef4444';
      console.log(`%c${prefix} ⚡ STATE CHANGE: ${rest.previousState} → ${rest.newState}`, `color: ${color}; font-weight: bold`, rest);
      break;
    default:
      console.log(`${prefix} ${event}`, rest);
  }
}

function getErrorType(error: unknown): string {
  if (!error) return 'unknown';
  
  const message = error instanceof Error ? error.message : String(error);
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('failed to fetch') || lowerMessage.includes('networkerror')) {
    return 'network_failure';
  }
  if (lowerMessage.includes('timeout') || lowerMessage.includes('aborted')) {
    return 'timeout';
  }
  if (lowerMessage.includes('cors')) {
    return 'cors_blocked';
  }
  if ((error as any)?.__isAuthError) {
    return 'auth_error';
  }
  if ((error as any)?.code) {
    return `supabase_${(error as any).code}`;
  }
  
  return 'unknown';
}

export function useConnectivityStatus(options: UseConnectivityStatusOptions = {}) {
  const { checkInterval, retryInterval, maxRetryInterval, autoCleanupThreshold } = { ...DEFAULT_OPTIONS, ...options };
  
  const [status, setStatus] = useState<ConnectivityStatus>({
    isOnline: null, // Unknown until first check completes
    isChecking: true, // Start in checking state
    lastChecked: null,
    lastOnline: null,
    retryCount: 0,
    error: null,
    lastStatusCode: null,
    lastErrorType: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const consecutiveFailuresRef = useRef(0);
  const previousOnlineStateRef = useRef<boolean | null>(null);

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    setStatus(prev => ({ ...prev, isChecking: true }));
    
    logConnectivity({
      timestamp,
      event: 'health_check_start',
      route: '/rest/v1/medications',
      method: 'GET',
      clientOnline: navigator.onLine,
      retryCount: retryCountRef.current,
    });
    
    try {
      // Use an actual database query instead of getSession() which returns cached data
      // This ensures we make a real network request to test connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      // Simple health check - just query one row from a public table
      const { data, error, status: httpStatus } = await supabase
        .from('medications')
        .select('id')
        .limit(1)
        .maybeSingle();
      
      clearTimeout(timeoutId);
      
      const elapsedMs = Date.now() - startTime;
      
      // Any error from health check = treat as offline
      if (error) {
        const errorType = getErrorType(error);
        const statusCode = (error as any)?.code ? parseInt((error as any).code, 10) || null : null;
        
        logConnectivity({
          timestamp: new Date().toISOString(),
          event: 'health_check_error',
          route: '/rest/v1/medications',
          method: 'GET',
          statusCode,
          errorType,
          errorMessage: error.message,
          elapsedMs,
          retryCount: retryCountRef.current,
          clientOnline: navigator.onLine,
        });
        
        throw error;
      }

      // Successfully connected - reset failure counters
      retryCountRef.current = 0;
      consecutiveFailuresRef.current = 0;
      
      const previousState = previousOnlineStateRef.current;
      previousOnlineStateRef.current = true;
      
      // Log state change only when state actually changes
      if (previousState !== true) {
        logConnectivity({
          timestamp: new Date().toISOString(),
          event: 'state_change',
          previousState,
          newState: true,
          elapsedMs,
        });
      }
      
      logConnectivity({
        timestamp: new Date().toISOString(),
        event: 'health_check_success',
        route: '/rest/v1/medications',
        method: 'GET',
        statusCode: 200,
        elapsedMs,
        clientOnline: navigator.onLine,
      });
      
      setStatus(prev => ({
        ...prev,
        isOnline: true,
        isChecking: false,
        lastChecked: new Date(),
        lastOnline: new Date(),
        retryCount: 0,
        error: null,
        lastStatusCode: 200,
        lastErrorType: null,
      }));
      
      return true;
    } catch (error) {
      const elapsedMs = Date.now() - startTime;
      const errorType = getErrorType(error);
      const errorMessage = isConnectivityError(error)
        ? 'Connection issues detected'
        : (error instanceof Error ? error.message : 'Unknown error');
      
      // Extract status code if available
      let statusCode: number | null = null;
      if ((error as any)?.status) {
        statusCode = (error as any).status;
      } else if ((error as any)?.code && !isNaN(parseInt((error as any).code, 10))) {
        statusCode = parseInt((error as any).code, 10);
      }
      
      retryCountRef.current += 1;
      consecutiveFailuresRef.current += 1;
      
      const previousState = previousOnlineStateRef.current;
      previousOnlineStateRef.current = false;
      
      // Log state change only when state actually changes
      if (previousState !== false) {
        logConnectivity({
          timestamp: new Date().toISOString(),
          event: 'state_change',
          previousState,
          newState: false,
          errorType,
          errorMessage,
          statusCode,
          elapsedMs,
        });
      }
      
      // Auto-clear stale session after threshold consecutive failures
      // This breaks the infinite refresh token retry loop
      if (consecutiveFailuresRef.current >= autoCleanupThreshold!) {
        console.log(`[Connectivity] ${consecutiveFailuresRef.current} consecutive failures - clearing stale session`);
        clearStaleSession();
      }
      
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        isChecking: false,
        lastChecked: new Date(),
        retryCount: retryCountRef.current,
        error: errorMessage,
        lastStatusCode: statusCode,
        lastErrorType: errorType,
      }));
      
      return false;
    }
  }, [autoCleanupThreshold]);

  const scheduleNextCheck = useCallback((isOnline: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    let interval: number;
    if (isOnline) {
      interval = checkInterval!;
    } else {
      // Exponential backoff for retries when offline
      interval = Math.min(
        retryInterval! * Math.pow(1.5, retryCountRef.current),
        maxRetryInterval!
      );
    }

    timeoutRef.current = setTimeout(async () => {
      const result = await checkConnectivity();
      scheduleNextCheck(result);
    }, interval);
  }, [checkInterval, retryInterval, maxRetryInterval, checkConnectivity]);

  const retry = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const result = await checkConnectivity();
    scheduleNextCheck(result);
  }, [checkConnectivity, scheduleNextCheck]);

  // Initial check and setup
  useEffect(() => {
    const initialize = async () => {
      const result = await checkConnectivity();
      scheduleNextCheck(result);
    };

    initialize();

    // Also listen for browser online/offline events
    const handleOnline = () => {
      logConnectivity({
        timestamp: new Date().toISOString(),
        event: 'state_change',
        previousState: previousOnlineStateRef.current,
        newState: null, // Will be determined by health check
        errorType: 'browser_online_event',
      });
      retry();
    };

    const handleOffline = () => {
      const previousState = previousOnlineStateRef.current;
      previousOnlineStateRef.current = false;
      
      logConnectivity({
        timestamp: new Date().toISOString(),
        event: 'state_change',
        previousState,
        newState: false,
        errorType: 'browser_offline_event',
      });
      
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        error: 'Network connection lost',
        lastErrorType: 'browser_offline',
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnectivity, scheduleNextCheck, retry]);

  return {
    ...status,
    retry,
    checkConnectivity,
  };
}
