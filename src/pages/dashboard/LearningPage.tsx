import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle2, AlertTriangle, Pill, Calculator } from 'lucide-react';
import { ClinicianProfile, roleLabels } from '@/types/clinical';

interface LearningPageProps {
  profile: ClinicianProfile | null;
}

// Role-specific learning modules
const learningModules = [
  {
    id: '1',
    title: 'High-Alert Medication Safety',
    description: 'Essential protocols for handling high-alert medications',
    duration: '10 min',
    category: 'Safety',
    icon: AlertTriangle,
    progress: 0,
    roles: ['nursing_student', 'nurse', 'advanced_nurse', 'medical_student', 'resident', 'attending', 'app']
  },
  {
    id: '2',
    title: 'Anticoagulant Management',
    description: 'Heparin, Warfarin, and DOAC protocols',
    duration: '15 min',
    category: 'Medications',
    icon: Pill,
    progress: 60,
    roles: ['nurse', 'advanced_nurse', 'resident', 'attending', 'app']
  },
  {
    id: '3',
    title: 'Weight-Based Dosing Calculations',
    description: 'Accurate dose calculations for pediatric and adult patients',
    duration: '12 min',
    category: 'Calculations',
    icon: Calculator,
    progress: 100,
    roles: ['nursing_student', 'nurse', 'advanced_nurse', 'medical_student']
  },
  {
    id: '4',
    title: 'Renal Dose Adjustments',
    description: 'CrCl-based dosing for common medications',
    duration: '20 min',
    category: 'Medications',
    icon: Pill,
    progress: 30,
    roles: ['nurse', 'advanced_nurse', 'resident', 'attending', 'app']
  },
  {
    id: '5',
    title: 'Insulin Safety',
    description: 'Preventing insulin errors and hypoglycemia',
    duration: '8 min',
    category: 'Safety',
    icon: AlertTriangle,
    progress: 0,
    roles: ['nursing_student', 'nurse', 'advanced_nurse', 'medical_student', 'resident']
  }
];

const LearningPage = ({ profile }: LearningPageProps) => {
  // Filter modules based on role
  const filteredModules = learningModules.filter(
    mod => !profile?.clinical_role || mod.roles.includes(profile.clinical_role)
  );

  const completedCount = filteredModules.filter(m => m.progress === 100).length;
  const inProgressCount = filteredModules.filter(m => m.progress > 0 && m.progress < 100).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-info-glow text-info rounded-full text-sm font-medium mb-3">
            <BookOpen className="w-4 h-4" />
            <span>Learning Center</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-semibold text-foreground">Learning</h1>
          <p className="text-muted-foreground mt-2">
            Micro-learning modules tailored for {profile ? roleLabels[profile.clinical_role] : 'your role'}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-glow flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{filteredModules.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Available</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div className="text-3xl font-bold text-warning">{inProgressCount}</div>
            <p className="text-sm text-muted-foreground mt-1">In Progress</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardContent className="p-5 text-center">
            <div className="w-12 h-12 rounded-xl bg-success-glow flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div className="text-3xl font-bold text-success">{completedCount}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {filteredModules.map((module) => (
          <Card key={module.id} className="border-border/50 shadow-soft rounded-2xl overflow-hidden hover:shadow-medium hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform ${
                  module.progress === 100 ? 'bg-success-glow' : 'bg-primary-glow'
                }`}>
                  {module.progress === 100 ? (
                    <CheckCircle2 className="w-7 h-7 text-success" />
                  ) : (
                    <module.icon className="w-7 h-7 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{module.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant="secondary" className="text-xs rounded-lg">
                        {module.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {module.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <Progress value={module.progress} className="flex-1 h-2.5 rounded-full" />
                    <span className="text-sm font-semibold text-muted-foreground w-12 text-right">
                      {module.progress}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Note */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary-glow via-card to-card shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">Contextual Learning</h4>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              Learning modules appear automatically when you encounter high-risk medications or common error patterns. 
              Complete them at your own pace - they're always optional but recommended.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningPage;
