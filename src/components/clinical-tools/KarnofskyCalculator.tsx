import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Gauge } from 'lucide-react';

const KarnofskyCalculator = () => {
  const [karnofskyScore, setKarnofskyScore] = useState<number | null>(null);

  const karnofskyDescriptions = [
    { score: 100, label: 'Normal', description: 'No complaints, no evidence of disease' },
    { score: 90, label: 'Minor Symptoms', description: 'Able to carry on normal activity, minor symptoms' },
    { score: 80, label: 'Normal with Effort', description: 'Normal activity with effort, some symptoms' },
    { score: 70, label: 'Cares for Self', description: 'Cares for self, unable to carry on normal activity or do active work' },
    { score: 60, label: 'Occasional Assistance', description: 'Requires occasional assistance, cares for most personal needs' },
    { score: 50, label: 'Considerable Assistance', description: 'Requires considerable assistance and frequent medical care' },
    { score: 40, label: 'Disabled', description: 'Disabled, requires special care and assistance' },
    { score: 30, label: 'Severely Disabled', description: 'Severely disabled, hospitalization indicated' },
    { score: 20, label: 'Very Sick', description: 'Very sick, active supportive treatment necessary' },
    { score: 10, label: 'Moribund', description: 'Moribund, fatal processes progressing rapidly' },
  ];

  const getInterpretation = (score: number) => {
    if (score >= 80) return { level: 'success', text: 'Good functional status - Able to carry on normal activity' };
    if (score >= 50) return { level: 'warning', text: 'Moderate impairment - Requires some assistance' };
    return { level: 'error', text: 'Severe impairment - Requires considerable care and support' };
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Gauge className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <CardTitle className="text-xl">Karnofsky Performance Status</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Measures patient's ability to perform ordinary tasks</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={karnofskyScore?.toString() || ''}
          onValueChange={(v) => setKarnofskyScore(parseInt(v))}
          className="space-y-2"
        >
          {karnofskyDescriptions.map((item) => (
            <div key={item.score} className="flex items-start space-x-3 p-3 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors">
              <RadioGroupItem value={item.score.toString()} id={`kps-${item.score}`} className="mt-1" />
              <Label htmlFor={`kps-${item.score}`} className="cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="rounded-lg">{item.score}%</Badge>
                  <span className="font-medium">{item.label}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {karnofskyScore !== null && (
          <div className={`p-4 rounded-xl border ${
            getInterpretation(karnofskyScore).level === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
            getInterpretation(karnofskyScore).level === 'warning' ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800' :
            'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {getInterpretation(karnofskyScore).level === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> :
               getInterpretation(karnofskyScore).level === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" /> :
               <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />}
              <div>
                <p className="font-semibold">Karnofsky Score: {karnofskyScore}%</p>
                <p className="text-sm mt-1">{getInterpretation(karnofskyScore).text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/30 rounded-xl">
          <h4 className="font-semibold text-sm mb-2">Clinical Pearl</h4>
          <p className="text-sm text-muted-foreground">
            KPS ≥70% is often required for clinical trial eligibility. KPS correlates with ECOG: KPS 100-90 ≈ ECOG 0, KPS 80-70 ≈ ECOG 1, KPS 60-50 ≈ ECOG 2.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default KarnofskyCalculator;
