import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Info, ClipboardList } from 'lucide-react';

const ESASCalculator = () => {
  const [esasScores, setEsasScores] = useState<Record<string, number>>({});

  const esasSymptoms = [
    { id: 'pain', label: 'Pain' },
    { id: 'tiredness', label: 'Tiredness' },
    { id: 'nausea', label: 'Nausea' },
    { id: 'depression', label: 'Depression' },
    { id: 'anxiety', label: 'Anxiety' },
    { id: 'drowsiness', label: 'Drowsiness' },
    { id: 'appetite', label: 'Appetite' },
    { id: 'wellbeing', label: 'Feeling of Well-being' },
    { id: 'shortness', label: 'Shortness of Breath' },
  ];

  const calculateESASTotal = () => {
    const values = Object.values(esasScores);
    if (values.length < esasSymptoms.length) return null;
    return values.reduce((sum, val) => sum + val, 0);
  };

  const esasTotal = calculateESASTotal();

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <ClipboardList className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <CardTitle className="text-xl">ESAS - Edmonton Symptom Assessment</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Rate each symptom from 0 (none) to 10 (worst possible)</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {esasSymptoms.map((symptom) => (
            <div key={symptom.id} className="p-4 rounded-xl border border-border/50">
              <Label className="font-medium mb-3 block">{symptom.label}</Label>
              <div className="flex items-center gap-2 flex-wrap">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                  <button
                    key={val}
                    onClick={() => setEsasScores(prev => ({ ...prev, [symptom.id]: val }))}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      esasScores[symptom.id] === val 
                        ? val <= 3 ? 'bg-green-500 text-white' : val <= 6 ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>No {symptom.label.toLowerCase()}</span>
                <span>Worst possible</span>
              </div>
            </div>
          ))}
        </div>

        {esasTotal !== null && (
          <div className="p-4 rounded-xl border bg-muted/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-semibold">Total ESAS Score: {esasTotal}/90</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Individual symptom scores guide targeted interventions. Scores ≥4 typically warrant intervention.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {esasSymptoms.map((symptom) => {
                    const score = esasScores[symptom.id];
                    if (score === undefined) return null;
                    return (
                      <Badge
                        key={symptom.id}
                        variant="outline"
                        className={`rounded-lg ${
                          score >= 7 ? 'border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' :
                          score >= 4 ? 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        }`}
                      >
                        {symptom.label}: {score}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/30 rounded-xl">
          <h4 className="font-semibold text-sm mb-2">Clinical Pearl</h4>
          <p className="text-sm text-muted-foreground">
            ESAS is validated for serial monitoring. Score changes of ≥1 point are clinically meaningful. Use for treatment response assessment and palliative care planning.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ESASCalculator;
