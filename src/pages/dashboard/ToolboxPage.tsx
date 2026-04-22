import { ClinicianProfile, specialtyLabels } from '@/types/clinical';
import ClinicalToolsHub from '@/components/clinical-tools/ClinicalToolsHub';
import { BriefcaseMedical } from 'lucide-react';

interface ToolboxPageProps {
  profile: ClinicianProfile | null;
}

const ToolboxPage = ({ profile }: ToolboxPageProps) => {
  return (
    <div className="space-y-6">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <BriefcaseMedical className="w-4.5 h-4.5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-semibold text-foreground leading-tight">Clinical Toolbox</h1>
            {profile?.specialty && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Prioritized for {specialtyLabels[profile.specialty]}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <ClinicalToolsHub />
    </div>
  );
};

export default ToolboxPage;
