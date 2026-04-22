import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';

const ECOGCalculator = () => {
  const [ecogScore, setEcogScore] = useState<number | null>(null);

  const ecogDescriptions = [
    { score: 0, label: 'Fully Active', description: 'Able to carry on all pre-disease activities without restriction' },
    { score: 1, label: 'Restricted', description: 'Restricted in strenuous activity, ambulatory and able to carry out light work' },
    { score: 2, label: 'Ambulatory', description: 'Ambulatory and capable of self-care, unable to work. Up >50% of waking hours' },
    { score: 3, label: 'Limited Self-Care', description: 'Capable of only limited self-care, confined to bed/chair >50% of waking hours' },
    { score: 4, label: 'Disabled', description: 'Completely disabled, cannot carry on any self-care, confined to bed/chair' },
  ];

  const getInterpretation = (score: number) => {
    if (score <= 1) return { level: 'success', text: 'Good performance status - Generally eligible for most treatment protocols' };
    if (score === 2) return { level: 'warning', text: 'Moderate impairment - Treatment decisions should be individualized' };
    return { level: 'error', text: 'Poor performance status - Consider supportive care focus, limit aggressive treatments' };
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <CardTitle className="text-xl">ECOG Performance Status</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Eastern Cooperative Oncology Group scale for patient activity level</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={ecogScore?.toString() || ''}
          onValueChange={(v) => setEcogScore(parseInt(v))}
          className="space-y-3"
        >
          {ecogDescriptions.map((item) => (
            <div key={item.score} className="flex items-start space-x-3 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
              <RadioGroupItem value={item.score.toString()} id={`ecog-${item.score}`} className="mt-1" />
              <Label htmlFor={`ecog-${item.score}`} className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-lg">{item.score}</Badge>
                  <span className="font-medium">{item.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {ecogScore !== null && (
          <div className={`p-4 rounded-xl border ${
            getInterpretation(ecogScore).level === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
            getInterpretation(ecogScore).level === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
            'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {getInterpretation(ecogScore).level === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> :
               getInterpretation(ecogScore).level === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" /> :
               <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />}
              <div>
                <p className="font-semibold">ECOG Score: {ecogScore}</p>
                <p className="text-sm mt-1">{getInterpretation(ecogScore).text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/30 rounded-xl">
          <h4 className="font-semibold text-sm mb-2">Clinical Pearl</h4>
          <p className="text-sm text-muted-foreground">
            ECOG PS is a strong prognostic factor for survival in oncology trials. PS 0-1 patients typically qualify for most clinical trials, while PS ≥2 often requires modified treatment approaches.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ECOGCalculator;
