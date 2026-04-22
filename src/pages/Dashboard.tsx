// Dashboard entry point
import { useEffect, useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useClinicianProfile } from '@/hooks/useClinicianProfile';
import { UserProfileProvider } from '@/contexts/UserProfileContext';
import { useMobileMode } from '@/hooks/useMobileMode';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { MobileDashboardLayout } from '@/components/dashboard/mobile/MobileDashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import MobileHomeScreen from '@/pages/dashboard/MobileHomeScreen';
import MobileProfileEdit from '@/pages/dashboard/MobileProfileEdit';
import MobileMore from '@/pages/dashboard/MobileMore';
import MedicationsPage from '@/pages/dashboard/MedicationsPage';
import CalculatePage from '@/pages/dashboard/CalculatePage';
import ToolboxPage from '@/pages/dashboard/ToolboxPage';
import AlertsPage from '@/pages/dashboard/AlertsPage';
import LearningPage from '@/pages/dashboard/LearningPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import InteractionsPage from '@/pages/dashboard/InteractionsPage';
import IVReferencePage from '@/pages/dashboard/IVReferencePage';
import ProtocolsPage from '@/pages/dashboard/ProtocolsPage';
import FavoritesPage from '@/pages/dashboard/FavoritesPage';
import PediatricsPage from '@/pages/dashboard/PediatricsPage';
import GeriatricsPage from '@/pages/dashboard/GeriatricsPage';
import ObstetricsPage from '@/pages/dashboard/ObstetricsPage';
import AskEdithPage from '@/pages/dashboard/AskEdithPage';
import CEHubPage from '@/pages/dashboard/CEHubPage';
import CECoursePage from '@/pages/dashboard/CECoursePage';
import CELessonPage from '@/pages/dashboard/CELessonPage';
import CETranscriptPage from '@/pages/dashboard/CETranscriptPage';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile, loading } = useClinicianProfile();
  const [authChecked, setAuthChecked] = useState(false);

  // Production mode - auth check enabled
  const devMode = import.meta.env.DEV;
  const isMobile = useMobileMode(768);

  useEffect(() => {
    const checkAuth = async () => {
      // Skip auth check in dev mode
      if (devMode) {
        setAuthChecked(true);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }
      
      setAuthChecked(true);
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    // Redirect to onboarding if profile not completed (skip in dev mode)
    if (!devMode && authChecked && !loading && !profile) {
      navigate('/onboarding');
    }
  }, [authChecked, loading, profile, navigate]);

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <UserProfileProvider>
        <Routes>
          <Route element={<MobileDashboardLayout />}>
            <Route path="/" element={<MobileHomeScreen embedded />} />
            <Route path="/meds" element={<MedicationsPage />} />
            <Route path="/medications" element={<Navigate to="/dashboard/meds" replace />} />
            <Route path="/calculate" element={<CalculatePage profile={profile} />} />
            <Route path="/ask-edith" element={<AskEdithPage />} />
            <Route path="/profile" element={<MobileProfileEdit />} />
            <Route path="/more" element={<MobileMore />} />

            {/* Secondary routes */}
            <Route path="/toolbox" element={<ToolboxPage profile={profile} />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/learning" element={<LearningPage profile={profile} />} />
            <Route path="/interactions" element={<InteractionsPage />} />
            <Route path="/iv-reference" element={<IVReferencePage />} />
            <Route path="/protocols" element={<ProtocolsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/pediatrics" element={<PediatricsPage />} />
            <Route path="/geriatrics" element={<GeriatricsPage />} />
            <Route path="/obstetrics" element={<ObstetricsPage />} />

            {/* CE Routes */}
            <Route path="/ce" element={<CEHubPage profile={profile} />} />
            <Route path="/ce/course/:courseId" element={<CECoursePage />} />
            <Route path="/ce/course/:courseId/lesson/:lessonId" element={<CELessonPage />} />
            <Route path="/ce/transcript" element={<CETranscriptPage />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </UserProfileProvider>
    );
  }

  return (
    <UserProfileProvider>
      <DashboardLayout profile={profile}>
        <Routes>
          <Route path="/" element={<DashboardHome profile={profile} />} />
          <Route path="/meds" element={<MedicationsPage />} />
          {/* Backwards-compatible alias for older deep-links */}
          <Route path="/medications" element={<Navigate to="/dashboard/meds" replace />} />
          <Route path="/calculate" element={<CalculatePage profile={profile} />} />
          <Route path="/pediatrics" element={<PediatricsPage />} />
          <Route path="/geriatrics" element={<GeriatricsPage />} />
          <Route path="/obstetrics" element={<ObstetricsPage />} />
          <Route path="/toolbox" element={<ToolboxPage profile={profile} />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/learning" element={<LearningPage profile={profile} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/interactions" element={<InteractionsPage />} />
          <Route path="/iv-reference" element={<IVReferencePage />} />
          <Route path="/protocols" element={<ProtocolsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/ask-edith" element={<AskEdithPage />} />
          {/* CE Routes */}
          <Route path="/ce" element={<CEHubPage profile={profile} />} />
          <Route path="/ce/course/:courseId" element={<CECoursePage />} />
          <Route path="/ce/course/:courseId/lesson/:lessonId" element={<CELessonPage />} />
          <Route path="/ce/transcript" element={<CETranscriptPage />} />
        </Routes>
      </DashboardLayout>
    </UserProfileProvider>
  );
};

export default Dashboard;
