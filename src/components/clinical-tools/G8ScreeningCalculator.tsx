import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, CheckCircle, Users } from 'lucide-react';

const G8ScreeningCalculator = () => {
  const [g8Answers, setG8Answers] = useState<Record<string, number>>({});

  const g8Questions = [
    { id: 'appetite', question: 'Has food intake declined over the past 3 months?', options: [
      { value: 0, label: 'Severe decrease' },
      { value: 1, label: 'Moderate decrease' },
      { value: 2, label: 'No decrease' },
    ]},
    { id: 'weight', question: 'Weight loss during last 3 months?', options: [
      { value: 0, label: '>3 kg' },
      { value: 1, label: 'Does not know' },
      { value: 2, label: '1-3 kg' },
      { value: 3, label: 'No weight loss' },
    ]},
    { id: 'mobility', question: 'Mobility', options: [
      { value: 0, label: 'Bed or chair bound' },
      { value: 1, label: 'Able to get out of bed/chair but does not go out' },
      { value: 2, label: 'Goes out' },
    ]},
    { id: 'neuropsych', question: 'Neuropsychological problems', options: [
      { value: 0, label: 'Severe dementia or depression' },
      { value: 1, label: 'Mild dementia' },
      { value: 2, label: 'No psychological problems' },
    ]},
    { id: 'bmi', question: 'Body Mass Index', options: [
      { value: 0, label: 'BMI < 19' },
      { value: 1, label: 'BMI 19 to < 21' },
      { value: 2, label: 'BMI 21 to < 23' },
      { value: 3, label: 'BMI ≥ 23' },
    ]},
    { id: 'medications', question: 'Takes more than 3 prescription drugs per day?', options: [
      { value: 0, label: 'Yes' },
      { value: 1, label: 'No' },
    ]},
    { id: 'health', question: 'Compared to other people of the same age, how does the patient consider their health status?', options: [
      { value: 0, label: 'Not as good' },
      { value: 0.5, label: 'Does not know' },
      { value: 1, label: 'As good' },
      { value: 2, label: 'Better' },
    ]},
    { id: 'age', question: 'Age', options: [
      { value: 0, label: '> 85 years' },
      { value: 1, label: '80-85 years' },
      { value: 2, label: '< 80 years' },
    ]},
  ];

  const calculateG8Score = () => {
    const values = Object.values(g8Answers);
    if (values.length < g8Questions.length) return null;
    return values.reduce((sum, val) => sum + val, 0);
  };

  const getInterpretation = (score: number) => {
    if (score > 14) return { level: 'success', text: 'Normal - No indication for comprehensive geriatric assessment' };
    return { level: 'warning', text: 'Abnormal (≤14) - Comprehensive geriatric assessment recommended' };
  };

  const g8Score = calculateG8Score();

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <CardTitle className="text-xl">G8 Geriatric Screening Tool</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Identifies older cancer patients who may benefit from comprehensive geriatric assessment</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {g8Questions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border border-border/50">
              <Label className="font-medium mb-3 block">
                {idx + 1}. {q.question}
              </Label>
              <RadioGroup
                value={g8Answers[q.id]?.toString() || ''}
                onValueChange={(v) => setG8Answers(prev => ({ ...prev, [q.id]: parseFloat(v) }))}
                className="space-y-2"
              >
                {q.options.map((opt) => (
                  <div key={opt.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={opt.value.toString()} id={`g8-${q.id}-${opt.value}`} />
                    <Label htmlFor={`g8-${q.id}-${opt.value}`} className="cursor-pointer text-sm">
                      {opt.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
        </div>

        {g8Score !== null && (
          <div className={`p-4 rounded-xl border ${
            getInterpretation(g8Score).level === 'success' ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
            'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
          }`}>
            <div className="flex items-start gap-3">
              {getInterpretation(g8Score).level === 'success' ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> :
               <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />}
              <div>
                <p className="font-semibold">G8 Score: {g8Score.toFixed(1)}/17</p>
                <p className="text-sm mt-1">{getInterpretation(g8Score).text}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/30 rounded-xl">
          <h4 className="font-semibold text-sm mb-2">Clinical Pearl</h4>
          <p className="text-sm text-muted-foreground">
            G8 ≤14 has 85% sensitivity for detecting geriatric impairments. Consider CGA before initiating chemotherapy in patients with abnormal G8 scores.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default G8ScreeningCalculator;
