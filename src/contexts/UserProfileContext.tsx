import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isConnectivityError } from '@/lib/supabase-helpers';

export interface UserProfileData {
  userId: string | null;
  avatarUrl: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  userInitials: string;
  // Clinical data
  clinicalRole: string | null;
  specialty: string | null;
  yearsExperience: number | null;
  education: string | null;
  tourCompleted: boolean;
  practiceSetting: string | null;
  shiftType: string | null;
}

interface UserProfileContextType extends UserProfileData {
  loading: boolean;
  connectionError: boolean;
  refreshProfile: () => Promise<void>;
}

const defaultProfile: UserProfileData = {
  userId: null,
  avatarUrl: null,
  firstName: null,
  lastName: null,
  fullName: null,
  email: null,
  userInitials: 'U',
  clinicalRole: null,
  specialty: null,
  yearsExperience: null,
  education: null,
  tourCompleted: false,
  practiceSetting: null,
  shiftType: null,
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const generateInitials = (firstName: string | null, lastName: string | null, fullName: string | null): string => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (fullName) {
      const names = fullName.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
    return 'U';
  };

  const fetchProfile = useCallback(async () => {
    try {
      setConnectionError(false);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      // Check for connectivity error on auth call
      if (userError && isConnectivityError(userError)) {
        setConnectionError(true);
        setLoading(false);
        return;
      }

      if (!user) {
        setProfile(defaultProfile);
        setLoading(false);
        return;
      }

      // Fetch both tables in parallel
      const [profilesRes, clinicianRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('user_id', user.id).single(),
        supabase.from('clinician_profiles').select('*').eq('user_id', user.id).maybeSingle(),
      ]);

      // Check for connectivity errors on database calls
      if ((profilesRes.error && isConnectivityError(profilesRes.error)) ||
          (clinicianRes.error && isConnectivityError(clinicianRes.error))) {
        setConnectionError(true);
        setLoading(false);
        return;
      }

      const profileData = profilesRes.data;
      const clinicianData = clinicianRes.data;

      setProfile({
        userId: user.id,
        avatarUrl: profileData?.avatar_url ?? null,
        firstName: profileData?.first_name ?? null,
        lastName: profileData?.last_name ?? null,
        fullName: profileData?.full_name ?? null,
        email: profileData?.email ?? user.email ?? null,
        userInitials: generateInitials(
          profileData?.first_name ?? null,
          profileData?.last_name ?? null,
          profileData?.full_name ?? null
        ),
        clinicalRole: clinicianData?.clinical_role ?? null,
        specialty: clinicianData?.specialty ?? null,
        yearsExperience: clinicianData?.years_experience ?? null,
        education: clinicianData?.education ?? null,
        tourCompleted: clinicianData?.tour_completed ?? false,
        practiceSetting: clinicianData?.practice_setting ?? null,
        shiftType: clinicianData?.shift_type ?? null,
      });
      setConnectionError(false);
    } catch (error) {
      // Silently handle connectivity errors - don't spam console or show toasts
      if (isConnectivityError(error)) {
        setConnectionError(true);
      } else {
        console.error('Error fetching user profile:', error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <UserProfileContext.Provider value={{ ...profile, loading, connectionError, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
