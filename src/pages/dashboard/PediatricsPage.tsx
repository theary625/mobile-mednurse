import { useState } from 'react';
import { Baby, Activity, Scale, Pill, Stethoscope, ArrowLeft } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import APGARCalculator from '@/components/clinical-tools/APGARCalculator';
import PediatricGCSCalculator from '@/components/clinical-tools/PediatricGCSCalculator';
import PEWSCalculator from '@/components/clinical-tools/PEWSCalculator';
import PediatricDosageCalculator from '@/components/clinical-tools/PediatricDosageCalculator';

interface PediatricTool {
  id: string;
  name: string;
  description: string;
  subsection: 'neonatal' | 'emergency' | 'assessment' | 'growth' | 'dosing';
  component: React.ComponentType;
  ageGroup?: string[];
}

const pediatricTools: PediatricTool[] = [
  {
    id: 'apgar',
    name: 'APGAR Score',
    description: 'Newborn assessment at 1 and 5 minutes after birth',
    subsection: 'neonatal',
    component: APGARCalculator,
    ageGroup: ['neonate'],
  },
  {
    id: 'peds-gcs',
    name: 'Pediatric GCS',
    description: 'Glasgow Coma Scale modified for infants and children',
    subsection: 'assessment',
    component: PediatricGCSCalculator,
    ageGroup: ['infant', 'toddler', 'child', 'adolescent'],
  },
  {
    id: 'pews',
    name: 'PEWS Score',
    description: 'Pediatric Early Warning Score for clinical deterioration',
    subsection: 'assessment',
    component: PEWSCalculator,
    ageGroup: ['infant', 'toddler', 'child', 'adolescent'],
  },
  {
    id: 'peds-dosage',
    name: 'Pediatric Dosage Calculator',
    description: 'Weight-based emergency medications and equipment sizing',
    subsection: 'emergency',
    component: PediatricDosageCalculator,
    ageGroup: ['neonate', 'infant', 'toddler', 'child', 'adolescent'],
  },
];

const subsections = [
  { id: 'all', label: 'All Tools', icon: Baby },
  { id: 'neonatal', label: 'Neonatal', icon: Heart, description: 'Birth to 28 days' },
  { id: 'emergency', label: 'Emergency', icon: Activity, description: 'Acute care & resuscitation' },
  { id: 'assessment', label: 'Assessment', icon: Stethoscope, description: 'Clinical scoring' },
  { id: 'growth', label: 'Growth', icon: Scale, description: 'Development & nutrition' },
  { id: 'dosing', label: 'Dosing', icon: Pill, description: 'Age-based pharmacology' },
];

const ageGroups = [
  { id: 'neonate', label: 'Neonate', range: '0-28 days' },
  { id: 'infant', label: 'Infant', range: '1-12 months' },
  { id: 'toddler', label: 'Toddler', range: '1-3 years' },
  { id: 'child', label: 'Child', range: '3-12 years' },
  { id: 'adolescent', label: 'Adolescent', range: '12-18 years' },
];

const PediatricsPage = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeSubsection, setActiveSubsection] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string | null>(null);

  const filteredTools = pediatricTools.filter((tool) => {
    const matchesSubsection = activeSubsection === 'all' || tool.subsection === activeSubsection;
    const matchesAge = !selectedAgeGroup || tool.ageGroup?.includes(selectedAgeGroup);
    return matchesSubsection && matchesAge;
  });

  const selectedTool = pediatricTools.find((t) => t.id === activeTool);

  if (selectedTool) {
    const ToolComponent = selectedTool.component;
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => setActiveTool(null)}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pediatric Tools
        </Button>
        <ToolComponent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-pink-500/10 rounded-xl p-6 border border-pink-200/50 dark:border-pink-800/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-pink-500/20 rounded-lg">
            <Baby className="h-6 w-6 text-pink-600 dark:text-pink-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Pediatric Clinical Tools</h1>
        </div>
        <p className="text-muted-foreground">
          Specialized assessment tools and calculators for neonatal through adolescent care
        </p>
      </div>

      {/* Age Group Quick Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Filter by Age Group</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedAgeGroup === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedAgeGroup(null)}
            >
              All Ages
            </Button>
            {ageGroups.map((age) => (
              <Button
                key={age.id}
                variant={selectedAgeGroup === age.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedAgeGroup(age.id)}
                className="gap-2"
              >
                {age.label}
                <span className="text-xs opacity-70">({age.range})</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subsection Tabs */}
      <Tabs value={activeSubsection} onValueChange={setActiveSubsection}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {subsections.map((section) => {
            const Icon = section.icon;
            const toolCount = section.id === 'all' 
              ? pediatricTools.filter(t => !selectedAgeGroup || t.ageGroup?.includes(selectedAgeGroup)).length
              : pediatricTools.filter(t => t.subsection === section.id && (!selectedAgeGroup || t.ageGroup?.includes(selectedAgeGroup))).length;
            
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2 data-[state=active]:bg-pink-500 data-[state=active]:text-white"
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
            
            {filteredTools.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No tools match the current filters. Try adjusting the age group or subsection.
                </p>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTools.map((tool) => {
                  const subsectionInfo = subsections.find(s => s.id === tool.subsection);
                  const SubIcon = subsectionInfo?.icon || Baby;
                  
                  return (
                    <Card
                      key={tool.id}
                      className="cursor-pointer hover:shadow-md transition-all hover:border-pink-300 dark:hover:border-pink-700 group"
                      onClick={() => setActiveTool(tool.id)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg group-hover:bg-pink-200 dark:group-hover:bg-pink-800/40 transition-colors">
                            <SubIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {tool.subsection}
                          </Badge>
                        </div>
                        <CardTitle className="text-base mt-2">{tool.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {tool.ageGroup?.map((age) => (
                            <Badge key={age} variant="secondary" className="text-xs capitalize">
                              {age}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Coming Soon Section */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {[
              'PECARN Head CT Decision Rule',
              'Ballard Score (Gestational Age)',
              'Pediatric Sepsis Calculator',
              'Maintenance Fluid Calculator',
              'Broselow-Luten Reference',
            ].map((tool) => (
              <div key={tool} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-2 w-2 rounded-full bg-pink-300" />
                {tool}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PediatricsPage;
