import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ClinicianProfile, ClinicalRole, ClinicalSpecialty, PracticeSetting, ShiftType } from '@/types/clinical';
import { isConnectivityError } from '@/lib/supabase-helpers';

export function useClinicianProfile() {
  const [profile, setProfile] = useState<ClinicianProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setConnectionError(false);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Handle connectivity errors on auth call
      if (userError && isConnectivityError(userError)) {
        setConnectionError(true);
        setLoading(false);
        return;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('clinician_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        // Check for connectivity error
        if (isConnectivityError(error)) {
          setConnectionError(true);
          setLoading(false);
          return;
        }
        throw error;
      }
      
      if (data) {
        setProfile({
          ...data,
          clinical_role: data.clinical_role as ClinicalRole,
          specialty: data.specialty as ClinicalSpecialty | undefined,
          practice_setting: data.practice_setting as PracticeSetting | undefined,
          shift_type: data.shift_type as ShiftType | undefined,
        });
      }
      setConnectionError(false);
    } catch (err) {
      if (isConnectivityError(err)) {
        setConnectionError(true);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<ClinicianProfile>) => {
    try {
      setConnectionError(false);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError && isConnectivityError(userError)) {
        setConnectionError(true);
        return { success: false, error: userError, connectionError: true };
      }

      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clinician_profiles')
        .insert({
          user_id: user.id,
          clinical_role: profileData.clinical_role,
          specialty: profileData.specialty,
          practice_setting: profileData.practice_setting,
          patient_population: profileData.patient_population,
          shift_type: profileData.shift_type,
          preferred_units: profileData.preferred_units || 'metric',
          years_experience: profileData.years_experience,
          onboarding_completed: true
        })
        .select()
        .single();

      if (error) {
        if (isConnectivityError(error)) {
          setConnectionError(true);
          return { success: false, error, connectionError: true };
        }
        throw error;
      }
      
      setProfile({
        ...data,
        clinical_role: data.clinical_role as ClinicalRole,
        specialty: data.specialty as ClinicalSpecialty | undefined,
        practice_setting: data.practice_setting as PracticeSetting | undefined,
        shift_type: data.shift_type as ShiftType | undefined,
      });
      return { success: true };
    } catch (err) {
      if (isConnectivityError(err)) {
        setConnectionError(true);
        return { success: false, error: err, connectionError: true };
      }
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      return { success: false, error: err };
    }
  };

  const updateProfile = async (updates: Partial<ClinicianProfile>) => {
    try {
      setConnectionError(false);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError && isConnectivityError(userError)) {
        setConnectionError(true);
        return { success: false, error: userError, connectionError: true };
      }

      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('clinician_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        if (isConnectivityError(error)) {
          setConnectionError(true);
          return { success: false, error, connectionError: true };
        }
        throw error;
      }
      
      setProfile({
        ...data,
        clinical_role: data.clinical_role as ClinicalRole,
        specialty: data.specialty as ClinicalSpecialty | undefined,
        practice_setting: data.practice_setting as PracticeSetting | undefined,
        shift_type: data.shift_type as ShiftType | undefined,
      });
      return { success: true };
    } catch (err) {
      if (isConnectivityError(err)) {
        setConnectionError(true);
        return { success: false, error: err, connectionError: true };
      }
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return { success: false, error: err };
    }
  };

  return {
    profile,
    loading,
    error,
    connectionError,
    createProfile,
    updateProfile,
    refetch: fetchProfile
  };
}
