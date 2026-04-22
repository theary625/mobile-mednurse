import { useState } from 'react';
import { UserRound, Brain, Pill, AlertTriangle, Scale, ArrowLeft } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface GeriatricTool {
  id: string;
  name: string;
  description: string;
  subsection: 'cognition' | 'medications' | 'falls' | 'frailty' | 'functional';
  status: 'available' | 'coming-soon';
}

const geriatricTools: GeriatricTool[] = [
  {
    id: 'beers-criteria',
    name: 'Beers Criteria Checker',
    description: 'Identify potentially inappropriate medications in older adults',
    subsection: 'medications',
    status: 'coming-soon',
  },
  {
    id: 'stopp-start',
    name: 'STOPP/START Criteria',
    description: 'Screening tool for potentially inappropriate prescriptions',
    subsection: 'medications',
    status: 'coming-soon',
  },
  {
    id: 'morse-fall',
    name: 'Morse Fall Scale',
    description: 'Identify patients at risk for falling',
    subsection: 'falls',
    status: 'coming-soon',
  },
  {
    id: 'tug-test',
    name: 'Timed Up and Go (TUG)',
    description: 'Assess mobility and fall risk',
    subsection: 'falls',
    status: 'coming-soon',
  },
  {
    id: 'mmse',
    name: 'Mini-Mental State Exam',
    description: 'Screen for cognitive impairment',
    subsection: 'cognition',
    status: 'coming-soon',
  },
  {
    id: 'moca',
    name: 'Montreal Cognitive Assessment',
    description: 'Detect mild cognitive impairment',
    subsection: 'cognition',
    status: 'coming-soon',
  },
  {
    id: 'clinical-frailty',
    name: 'Clinical Frailty Scale',
    description: 'Assess frailty status in elderly patients',
    subsection: 'frailty',
    status: 'coming-soon',
  },
  {
    id: 'katz-adl',
    name: 'Katz ADL Index',
    description: 'Assess activities of daily living',
    subsection: 'functional',
    status: 'coming-soon',
  },
  {
    id: 'lawton-iadl',
    name: 'Lawton IADL Scale',
    description: 'Assess instrumental activities of daily living',
    subsection: 'functional',
    status: 'coming-soon',
  },
];

const subsections = [
  { id: 'all', label: 'All Tools', icon: UserRound },
  { id: 'medications', label: 'Medications', icon: Pill, description: 'Polypharmacy & appropriateness' },
  { id: 'falls', label: 'Falls Risk', icon: AlertTriangle, description: 'Fall prevention assessment' },
  { id: 'cognition', label: 'Cognition', icon: Brain, description: 'Cognitive screening' },
  { id: 'frailty', label: 'Frailty', icon: Heart, description: 'Frailty assessment' },
  { id: 'functional', label: 'Functional', icon: Scale, description: 'ADL & independence' },
];

const GeriatricsPage = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeSubsection, setActiveSubsection] = useState('all');

  const filteredTools = geriatricTools.filter((tool) => {
    return activeSubsection === 'all' || tool.subsection === activeSubsection;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-xl p-6 border border-amber-200/50 dark:border-amber-800/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <UserRound className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Geriatric Clinical Tools</h1>
        </div>
        <p className="text-muted-foreground">
          Specialized assessment tools for older adults, including medication safety, fall risk, and cognitive screening
        </p>
      </div>

      {/* Key Considerations */}
      <Card className="border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            Geriatric Care Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>Adjust doses for renal/hepatic decline</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>Review for polypharmacy interactions</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5" />
              <span>Consider frailty in treatment decisions</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subsection Tabs */}
      <Tabs value={activeSubsection} onValueChange={setActiveSubsection}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {subsections.map((section) => {
            const Icon = section.icon;
            const toolCount = section.id === 'all' 
              ? geriatricTools.length
              : geriatricTools.filter(t => t.subsection === section.id).length;
            
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2 data-[state=active]:bg-amber-500 data-[state=active]:text-white"
              >
                <Icon className="h-4 w-4" />
                {section.label}
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {toolCount}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {subsections.map((section) => (
          <TabsContent key={section.id} value={section.id} className="mt-4">
            {section.description && (
              <p className="text-sm text-muted-foreground mb-4">{section.description}</p>
            )}
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => {
                const subsectionInfo = subsections.find(s => s.id === tool.subsection);
                const SubIcon = subsectionInfo?.icon || UserRound;
                
                return (
                  <Card
                    key={tool.id}
                    className={`group ${tool.status === 'coming-soon' ? 'opacity-60' : 'cursor-pointer hover:shadow-md hover:border-amber-300 dark:hover:border-amber-700'} transition-all`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                          <SubIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {tool.subsection}
                          </Badge>
                          {tool.status === 'coming-soon' && (
                            <Badge variant="secondary" className="text-xs">
                              Soon
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-base mt-2">{tool.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default GeriatricsPage;
