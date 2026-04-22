import { useState } from 'react';
import { Baby, AlertTriangle, Pill, Calendar, Activity, Droplets, Syringe, ArrowLeft } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import DepoCalculator from '@/components/calculators/DepoCalculator';
import BishopScoreCalculator from '@/components/calculators/BishopScoreCalculator';
import EDDCalculator from '@/components/calculators/EDDCalculator';
import MagnesiumSulfateOBCalculator from '@/components/calculators/MagnesiumSulfateOBCalculator';
import OxytocinCalculator from '@/components/calculators/OxytocinCalculator';

interface ObTool {
  id: string;
  name: string;
  description: string;
  subsection: 'dating' | 'medications' | 'labor' | 'hemorrhage' | 'fetal';
  status: 'available' | 'coming-soon';
  component?: React.ComponentType;
}

const obTools: ObTool[] = [
  {
    id: 'edd-calculator',
    name: 'EDD Calculator',
    description: 'Calculate estimated due date from LMP or ultrasound',
    subsection: 'dating',
    status: 'available',
    component: EDDCalculator,
  },
  {
    id: 'depo-calculator',
    name: 'Depo-Provera Calculator',
    description: 'Calculate next injection date and track grace periods',
    subsection: 'medications',
    status: 'available',
    component: DepoCalculator,
  },
  {
    id: 'gestational-age',
    name: 'Gestational Age Calculator',
    description: 'Determine gestational age from LMP or known dates',
    subsection: 'dating',
    status: 'coming-soon',
  },
  {
    id: 'fda-pregnancy-categories',
    name: 'Drug Safety in Pregnancy',
    description: 'Check medication safety categories for pregnancy',
    subsection: 'medications',
    status: 'coming-soon',
  },
  {
    id: 'lactation-safety',
    name: 'Lactation Safety Checker',
    description: 'Assess medication compatibility with breastfeeding',
    subsection: 'medications',
    status: 'coming-soon',
  },
  {
    id: 'bishop-score',
    name: 'Bishop Score',
    description: 'Assess cervical readiness for labor induction',
    subsection: 'labor',
    status: 'available',
    component: BishopScoreCalculator,
  },
  {
    id: 'oxytocin-calculator',
    name: 'Oxytocin Calculator',
    description: 'Labor induction, augmentation, and PPH protocols',
    subsection: 'labor',
    status: 'available',
    component: OxytocinCalculator,
  },
  {
    id: 'magnesium-sulfate',
    name: 'Magnesium Sulfate (OB)',
    description: 'Preeclampsia, eclampsia, and fetal neuroprotection dosing',
    subsection: 'medications',
    status: 'available',
    component: MagnesiumSulfateOBCalculator,
  },
  {
    id: 'vbac-calculator',
    name: 'VBAC Success Calculator',
    description: 'Estimate likelihood of successful vaginal birth after cesarean',
    subsection: 'labor',
    status: 'coming-soon',
  },
  {
    id: 'qbl-calculator',
    name: 'Quantitative Blood Loss',
    description: 'Calculate estimated blood loss during delivery',
    subsection: 'hemorrhage',
    status: 'coming-soon',
  },
  {
    id: 'pph-risk',
    name: 'PPH Risk Assessment',
    description: 'Assess risk for postpartum hemorrhage',
    subsection: 'hemorrhage',
    status: 'coming-soon',
  },
  {
    id: 'biophysical-profile',
    name: 'Biophysical Profile Score',
    description: 'Fetal wellbeing assessment scoring',
    subsection: 'fetal',
    status: 'coming-soon',
  },
  {
    id: 'afv-assessment',
    name: 'Amniotic Fluid Assessment',
    description: 'AFI and MVP interpretation guide',
    subsection: 'fetal',
    status: 'coming-soon',
  },
];

const subsections = [
  { id: 'all', label: 'All Tools', icon: Baby },
  { id: 'dating', label: 'Dating', icon: Calendar, description: 'Gestational age & EDD' },
  { id: 'medications', label: 'Medications', icon: Pill, description: 'Drug safety in pregnancy & lactation' },
  { id: 'labor', label: 'Labor', icon: Activity, description: 'Labor & delivery assessment' },
  { id: 'hemorrhage', label: 'Hemorrhage', icon: Droplets, description: 'Blood loss & PPH' },
  { id: 'fetal', label: 'Fetal', icon: Heart, description: 'Fetal wellbeing' },
];

const ObstetricsPage = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeSubsection, setActiveSubsection] = useState('all');

  const filteredTools = obTools.filter((tool) => {
    return activeSubsection === 'all' || tool.subsection === activeSubsection;
  });

  const selectedTool = obTools.find(t => t.id === activeTool);
  const ToolComponent = selectedTool?.component;

  // If a tool is selected, show the tool
  if (activeTool && ToolComponent) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveTool(null)}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to OB Tools
        </Button>
        <ToolComponent />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 rounded-xl p-6 border border-purple-200/50 dark:border-purple-800/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Baby className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Obstetrics & Maternal Care</h1>
        </div>
        <p className="text-muted-foreground">
          Specialized tools for pregnancy, labor & delivery, and postpartum care
        </p>
      </div>

      {/* Key Considerations */}
      <Card className="border-purple-200/50 dark:border-purple-800/30 bg-purple-50/50 dark:bg-purple-950/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-purple-600" />
            Maternal Care Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
              <span>Verify medication safety by trimester</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
              <span>Adjust doses for physiologic changes</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5" />
              <span>Consider lactation compatibility</span>
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
              ? obTools.length
              : obTools.filter(t => t.subsection === section.id).length;
            
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                className="gap-2 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
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
                const SubIcon = subsectionInfo?.icon || Baby;
                
                return (
                  <Card
                    key={tool.id}
                    className={`group ${tool.status === 'coming-soon' ? 'opacity-60' : 'cursor-pointer hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700'} transition-all`}
                    onClick={() => tool.status === 'available' && setActiveTool(tool.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                          <SubIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
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

export default ObstetricsPage;
