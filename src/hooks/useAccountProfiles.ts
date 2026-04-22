import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type AccountType = 'personal' | 'work';

export interface AccountProfile {
  id: string;
  user_id: string;
  account_type: AccountType;
  profile_name: string;
  organization_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useAccountProfiles() {
  const [accounts, setAccounts] = useState<AccountProfile[]>([]);
  const [activeAccount, setActiveAccount] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('account_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('account_type', { ascending: true });

      if (error) throw error;

      const typedData = (data || []).map(account => ({
        ...account,
        account_type: account.account_type as AccountType,
      }));

      setAccounts(typedData);
      setActiveAccount(typedData.find(a => a.is_active) || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const switchAccount = async (accountId: string) => {
    try {
      const { error } = await supabase
        .from('account_profiles')
        .update({ is_active: true })
        .eq('id', accountId);

      if (error) throw error;

      await fetchAccounts();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to switch account');
      return { success: false, error: err };
    }
  };

  const createWorkAccount = async (profileName: string, organizationName?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('account_profiles')
        .insert({
          user_id: user.id,
          account_type: 'work' as AccountType,
          profile_name: profileName,
          organization_name: organizationName || null,
          is_active: false,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchAccounts();
      return { success: true, data };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create work account');
      return { success: false, error: err };
    }
  };

  const updateAccount = async (accountId: string, updates: Partial<Pick<AccountProfile, 'profile_name' | 'organization_name'>>) => {
    try {
      const { error } = await supabase
        .from('account_profiles')
        .update(updates)
        .eq('id', accountId);

      if (error) throw error;

      await fetchAccounts();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update account');
      return { success: false, error: err };
    }
  };

  const deleteWorkAccount = async (accountId: string) => {
    try {
      // Ensure we're not deleting the personal account
      const account = accounts.find(a => a.id === accountId);
      if (account?.account_type === 'personal') {
        throw new Error('Cannot delete personal account');
      }

      const { error } = await supabase
        .from('account_profiles')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      await fetchAccounts();
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      return { success: false, error: err };
    }
  };

  const hasWorkAccount = accounts.some(a => a.account_type === 'work');

  return {
    accounts,
    activeAccount,
    loading,
    error,
    switchAccount,
    createWorkAccount,
    updateAccount,
    deleteWorkAccount,
    hasWorkAccount,
    refetch: fetchAccounts,
  };
}
