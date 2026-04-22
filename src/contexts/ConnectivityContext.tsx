import { createContext, useContext, ReactNode } from 'react';
import { useConnectivityStatus, ConnectivityStatus } from '@/hooks/useConnectivityStatus';

interface ConnectivityContextType extends ConnectivityStatus {
  retry: () => Promise<void>;
  checkConnectivity: () => Promise<boolean>;
  // isOnline is boolean | null - null means unknown/checking
  // lastStatusCode: number | null - last HTTP status from health check
  // lastErrorType: string | null - categorized error type
}

const ConnectivityContext = createContext<ConnectivityContextType | undefined>(undefined);

interface ConnectivityProviderProps {
  children: ReactNode;
}

export function ConnectivityProvider({ children }: ConnectivityProviderProps) {
  const connectivity = useConnectivityStatus();

  return (
    <ConnectivityContext.Provider value={connectivity}>
      {children}
    </ConnectivityContext.Provider>
  );
}

export function useConnectivity() {
  const context = useContext(ConnectivityContext);
  if (context === undefined) {
    throw new Error('useConnectivity must be used within a ConnectivityProvider');
  }
  return context;
}

/**
 * Optional hook that returns connectivity status without throwing
 * Useful for components that may render outside the provider
 */
export function useConnectivityOptional(): ConnectivityContextType | null {
  return useContext(ConnectivityContext) ?? null;
}

