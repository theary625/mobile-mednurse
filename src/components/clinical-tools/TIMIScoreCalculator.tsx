import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info } from 'lucide-react';

const nstemiCriteria = [
  { id: 'age', label: 'Age ≥ 65 years', points: 1 },
  { id: 'risk_factors', label: '≥ 3 CAD risk factors (HTN, DM, dyslipidemia, smoking, family history)', points: 1 },
  { id: 'known_cad', label: 'Known CAD (stenosis ≥ 50%)', points: 1 },
  { id: 'aspirin', label: 'ASA use in past 7 days', points: 1 },
  { id: 'angina', label: 'Severe angina (≥ 2 episodes in 24 hrs)', points: 1 },
  { id: 'st_changes', label: 'ST changes ≥ 0.5mm', points: 1 },
  { id: 'biomarker', label: 'Positive cardiac biomarker', points: 1 }
];

const stemiCriteria = [
  { id: 'age_65_74', label: 'Age 65-74 years (2 pts)', points: 2 },
  { id: 'age_75', label: 'Age ≥ 75 years (3 pts)', points: 3 },
  { id: 'dm_htn_angina', label: 'DM, HTN, or angina', points: 1 },
  { id: 'sbp_100', label: 'SBP < 100 mmHg', points: 3 },
  { id: 'hr_100', label: 'HR > 100 bpm', points: 2 },
  { id: 'killip', label: 'Killip class II-IV', points: 2 },
  { id: 'weight', label: 'Weight < 67 kg', points: 1 },
  { id: 'anterior', label: 'Anterior STEMI or LBBB', points: 1 },
  { id: 'time', label: 'Time to treatment > 4 hours', points: 1 }
];

const getNSTEMIInterpretation = (score: number) => {
  const riskData: Record<number, { events: string; colorClass: string }> = {
    0: { events: '4.7%', colorClass: 'bg-green-100 text-green-800 border-green-200' },
    1: { events: '4.7%', colorClass: 'bg-green-100 text-green-800 border-green-200' },
    2: { events: '8.3%', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    3: { events: '13.2%', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    4: { events: '19.9%', colorClass: 'bg-orange-100 text-orange-800 border-orange-200' },
    5: { events: '26.2%', colorClass: 'bg-orange-100 text-orange-800 border-orange-200' },
    6: { events: '40.9%', colorClass: 'bg-red-100 text-red-800 border-red-200' },
    7: { events: '40.9%', colorClass: 'bg-red-100 text-red-800 border-red-200' }
  };
  return riskData[Math.min(score, 7)] || riskData[7];
};

const getSTEMIInterpretation = (score: number) => {
  if (score <= 2) return { mortality: '2.2%', colorClass: 'bg-green-100 text-green-800 border-green-200' };
  if (score <= 4) return { mortality: '4.4%', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  if (score <= 6) return { mortality: '7.3%', colorClass: 'bg-orange-100 text-orange-800 border-orange-200' };
  if (score <= 8) return { mortality: '12.4%', colorClass: 'bg-red-100 text-red-800 border-red-200' };
  return { mortality: '35.9%', colorClass: 'bg-red-200 text-red-900 border-red-300' };
};

const TIMIScoreCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState('nstemi');
  const [nstemiAnswers, setNstemiAnswers] = useState<Record<string, boolean>>({});
  const [stemiAnswers, setStemiAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);

  const calculateNSTEMI = () => nstemiCriteria.filter(c => nstemiAnswers[c.id]).reduce((sum, c) => sum + c.points, 0);
  const calculateSTEMI = () => stemiCriteria.filter(c => stemiAnswers[c.id]).reduce((sum, c) => sum + c.points, 0);

  const nstemiScore = calculateNSTEMI();
  const stemiScore = calculateSTEMI();
  const nstemiInterpretation = getNSTEMIInterpretation(nstemiScore);
  const stemiInterpretation = getSTEMIInterpretation(stemiScore);

  const handleReset = () => {
    setNstemiAnswers({});
    setStemiAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">TIMI Risk Score</CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Thrombolysis In Myocardial Infarction risk stratification
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nstemi">NSTEMI/UA</TabsTrigger>
            <TabsTrigger value="stemi">STEMI</TabsTrigger>
          </TabsList>

          <TabsContent value="nstemi" className="space-y-4 mt-4">
            {nstemiCriteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={`nstemi-${criterion.id}`}
                  checked={nstemiAnswers[criterion.id] || false}
                  onCheckedChange={(checked) => setNstemiAnswers(prev => ({ ...prev, [criterion.id]: checked as boolean }))}
                />
                <Label htmlFor={`nstemi-${criterion.id}`} className="cursor-pointer flex-1">
                  {criterion.label}
                </Label>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Button onClick={() => setShowResults(true)} className="flex-1">Calculate</Button>
              <Button onClick={handleReset} variant="outline">Reset</Button>
            </div>

            {showResults && (
              <div className={`p-6 rounded-lg border ${nstemiInterpretation.colorClass}`}>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold">{nstemiScore}/7</p>
                  <p className="text-lg font-semibold">TIMI NSTEMI Score</p>
                </div>
                <p className="text-sm text-center">
                  <strong>14-day risk of death, MI, or urgent revascularization:</strong> {nstemiInterpretation.events}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stemi" className="space-y-4 mt-4">
            {stemiCriteria.map((criterion) => (
              <div key={criterion.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id={`stemi-${criterion.id}`}
                  checked={stemiAnswers[criterion.id] || false}
                  onCheckedChange={(checked) => setStemiAnswers(prev => ({ ...prev, [criterion.id]: checked as boolean }))}
                />
                <Label htmlFor={`stemi-${criterion.id}`} className="cursor-pointer flex-1">
                  {criterion.label}
                </Label>
              </div>
            ))}

            <div className="flex gap-4 pt-4">
              <Button onClick={() => setShowResults(true)} className="flex-1">Calculate</Button>
              <Button onClick={handleReset} variant="outline">Reset</Button>
            </div>

            {showResults && (
              <div className={`p-6 rounded-lg border ${stemiInterpretation.colorClass}`}>
                <div className="text-center mb-4">
                  <p className="text-4xl font-bold">{stemiScore}/14</p>
                  <p className="text-lg font-semibold">TIMI STEMI Score</p>
                </div>
                <p className="text-sm text-center">
                  <strong>30-day mortality:</strong> {stemiInterpretation.mortality}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Clinical Application</p>
            <p className="mt-1">Higher TIMI scores indicate greater benefit from aggressive interventional strategies.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TIMIScoreCalculator;
