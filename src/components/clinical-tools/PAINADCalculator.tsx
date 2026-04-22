import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Brain } from 'lucide-react';

const criteria = [
  {
    id: 'breathing',
    title: 'Breathing (independent of vocalization)',
    options: [
      { value: 0, label: 'Normal' },
      { value: 1, label: 'Occasional labored breathing, short period of hyperventilation' },
      { value: 2, label: 'Noisy labored breathing, long period of hyperventilation, Cheyne-Stokes respirations' }
    ]
  },
  {
    id: 'vocalization',
    title: 'Negative Vocalization',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Occasional moan or groan, low-level speech with negative or disapproving quality' },
      { value: 2, label: 'Repeated troubled calling out, loud moaning or groaning, crying' }
    ]
  },
  {
    id: 'facialExpression',
    title: 'Facial Expression',
    options: [
      { value: 0, label: 'Smiling or inexpressive' },
      { value: 1, label: 'Sad, frightened, frown' },
      { value: 2, label: 'Facial grimacing' }
    ]
  },
  {
    id: 'bodyLanguage',
    title: 'Body Language',
    options: [
      { value: 0, label: 'Relaxed' },
      { value: 1, label: 'Tense, distressed pacing, fidgeting' },
      { value: 2, label: 'Rigid, fists clenched, knees pulled up, pulling or pushing away, striking out' }
    ]
  },
  {
    id: 'consolability',
    title: 'Consolability',
    options: [
      { value: 0, label: 'No need to console' },
      { value: 1, label: 'Distracted or reassured by voice or touch' },
      { value: 2, label: 'Unable to console, distract or reassure' }
    ]
  }
];

const PAINADCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 1) {
      return { 
        pain: 'No Pain', 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', 
        action: 'Continue comfort measures. Reassess with care activities.' 
      };
    } else if (score <= 3) {
      return { 
        pain: 'Mild Pain', 
        color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800', 
        action: 'Consider non-pharmacologic interventions. Reassess in 30-60 minutes.' 
      };
    } else if (score <= 6) {
      return { 
        pain: 'Moderate Pain', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', 
        action: 'Administer analgesia per protocol. Reassess post-intervention.' 
      };
    } else {
      return { 
        pain: 'Severe Pain', 
        color: 'bg-destructive/10 text-destructive border-destructive/30', 
        action: 'Immediate analgesic intervention. Notify provider. Reassess frequently.' 
      };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">PAINAD Scale</CardTitle>
            <p className="text-purple-100 text-sm mt-1">Pain Assessment in Advanced Dementia</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Observe the patient for 5 minutes before scoring. Score each category based on 
            behaviors observed during this period. Ideal for patients with advanced dementia who cannot verbally communicate pain.
            Observe during activity (e.g., bathing, repositioning) for best assessment.
          </p>
        </div>

        {criteria.map((criterion) => (
          <div key={criterion.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <p className="font-semibold text-foreground">{criterion.title}</p>
            <RadioGroup
              value={answers[criterion.id]?.toString()}
              onValueChange={(val) => handleAnswer(criterion.id, parseInt(val))}
              className="space-y-2"
            >
              {criterion.options.map((opt) => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`${criterion.id}-${opt.value}`} />
                  <Label htmlFor={`${criterion.id}-${opt.value}`} className="cursor-pointer text-sm">
                    ({opt.value}) {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate PAINAD Score
          </Button>
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{totalScore}/10</p>
                <p className="text-lg font-semibold">{interpretation.pain}</p>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center text-xs mb-4">
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Breath: {answers.breathing}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Voice: {answers.vocalization}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Face: {answers.facialExpression}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Body: {answers.bodyLanguage}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Console: {answers.consolability}</div>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            {totalScore >= 4 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Pain Intervention Indicated</p>
                  <p>Consider pharmacologic and non-pharmacologic interventions. Common causes: positioning, constipation, infection, wounds.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Pain Scale Interpretation</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>0-1: No pain</li>
                  <li>2-3: Mild pain</li>
                  <li>4-6: Moderate pain</li>
                  <li>7-10: Severe pain</li>
                </ul>
                <p className="mt-2 text-xs">Note: Reassess during activities as pain may be more evident with movement.</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Warden V, Hurley AC, Volicer L. Development and psychometric evaluation of the Pain Assessment in Advanced Dementia (PAINAD) scale. J Am Med Dir Assoc. 2003;4(1):9-15.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PAINADCalculator;
