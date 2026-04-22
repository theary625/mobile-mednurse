import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Pill } from 'lucide-react';

const criteria = [
  {
    id: 'pulse',
    title: 'Resting Pulse Rate',
    options: [
      { value: 0, label: '≤80 bpm' },
      { value: 1, label: '81-100 bpm' },
      { value: 2, label: '101-120 bpm' },
      { value: 4, label: '>120 bpm' }
    ]
  },
  {
    id: 'sweating',
    title: 'Sweating',
    options: [
      { value: 0, label: 'No report of chills or flushing' },
      { value: 1, label: 'Subjective report of chills or flushing' },
      { value: 2, label: 'Flushed or observable moisture on face' },
      { value: 3, label: 'Beads of sweat on brow or face' },
      { value: 4, label: 'Sweat streaming off face' }
    ]
  },
  {
    id: 'restlessness',
    title: 'Restlessness',
    options: [
      { value: 0, label: 'Able to sit still' },
      { value: 1, label: 'Reports difficulty sitting still, but is able to do so' },
      { value: 3, label: 'Frequent shifting or extraneous movements of legs/arms' },
      { value: 5, label: 'Unable to sit still for more than a few seconds' }
    ]
  },
  {
    id: 'pupils',
    title: 'Pupil Size',
    options: [
      { value: 0, label: 'Pinned or normal size for room light' },
      { value: 1, label: 'Possibly larger than normal for room light' },
      { value: 2, label: 'Moderately dilated' },
      { value: 5, label: 'So dilated that only rim of iris is visible' }
    ]
  },
  {
    id: 'bone',
    title: 'Bone or Joint Aches',
    options: [
      { value: 0, label: 'Not present' },
      { value: 1, label: 'Mild diffuse discomfort' },
      { value: 2, label: 'Patient reports severe diffuse aching of joints/muscles' },
      { value: 4, label: 'Patient is rubbing joints or muscles and unable to sit still because of discomfort' }
    ]
  },
  {
    id: 'runnyNose',
    title: 'Runny Nose or Tearing',
    options: [
      { value: 0, label: 'Not present' },
      { value: 1, label: 'Nasal stuffiness or unusually moist eyes' },
      { value: 2, label: 'Nose running or tearing' },
      { value: 4, label: 'Nose constantly running or tears streaming down cheeks' }
    ]
  },
  {
    id: 'gi',
    title: 'GI Upset',
    options: [
      { value: 0, label: 'No GI symptoms' },
      { value: 1, label: 'Stomach cramps' },
      { value: 2, label: 'Nausea or loose stool' },
      { value: 3, label: 'Vomiting or diarrhea' },
      { value: 5, label: 'Multiple episodes of diarrhea or vomiting' }
    ]
  },
  {
    id: 'tremor',
    title: 'Tremor',
    options: [
      { value: 0, label: 'No tremor' },
      { value: 1, label: 'Tremor can be felt, but not observed' },
      { value: 2, label: 'Slight tremor observable' },
      { value: 4, label: 'Gross tremor or muscle twitching' }
    ]
  },
  {
    id: 'yawning',
    title: 'Yawning',
    options: [
      { value: 0, label: 'No yawning' },
      { value: 1, label: 'Yawning once or twice during assessment' },
      { value: 2, label: 'Yawning three or more times during assessment' },
      { value: 4, label: 'Yawning several times per minute' }
    ]
  },
  {
    id: 'anxiety',
    title: 'Anxiety or Irritability',
    options: [
      { value: 0, label: 'None' },
      { value: 1, label: 'Patient reports increasing irritability or anxiousness' },
      { value: 2, label: 'Patient obviously irritable or anxious' },
      { value: 4, label: 'Patient so irritable or anxious that participation in assessment is difficult' }
    ]
  },
  {
    id: 'gooseflesh',
    title: 'Gooseflesh Skin',
    options: [
      { value: 0, label: 'Skin is smooth' },
      { value: 3, label: 'Piloerection of skin can be felt or hairs standing up on arms' },
      { value: 5, label: 'Prominent piloerection' }
    ]
  }
];

const COWSCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 4) {
      return { severity: 'No Withdrawal', color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', action: 'Continue monitoring. Reassess in 4 hours or if symptoms emerge.' };
    } else if (score <= 12) {
      return { severity: 'Mild Withdrawal', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', action: 'May initiate buprenorphine/suboxone. Consider supportive medications.' };
    } else if (score <= 24) {
      return { severity: 'Moderate Withdrawal', color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-800', action: 'Appropriate to initiate buprenorphine. Symptomatic treatment as needed.' };
    } else if (score <= 36) {
      return { severity: 'Moderately Severe Withdrawal', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-200 dark:border-red-800', action: 'Initiate MAT. May need more aggressive supportive care.' };
    } else {
      return { severity: 'Severe Withdrawal', color: 'bg-destructive/10 text-destructive border-destructive/30', action: 'Urgent treatment needed. Consider inpatient management. High-dose MAT protocols.' };
    }
  };

  const interpretation = getInterpretation(totalScore);

  const handleReset = () => {
    setAnswers({});
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">COWS Calculator</CardTitle>
            <p className="text-teal-100 text-sm mt-1">Clinical Opiate Withdrawal Scale</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> For each item, select the observation that best matches the patient&apos;s current state. 
            Assess when patient is in opioid withdrawal, typically 6-12 hours after last short-acting opioid or 24-72 hours after long-acting opioid.
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
                    {opt.label} ({opt.value})
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate COWS Score
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
                <p className="text-4xl font-bold">{totalScore}/48</p>
                <p className="text-lg font-semibold">{interpretation.severity}</p>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            {totalScore >= 25 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Severe Withdrawal</p>
                  <p>Patient requires aggressive treatment. Consider higher buprenorphine doses, adjunctive medications, and close monitoring.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Scoring Guide</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>5-12: Mild (may start buprenorphine)</li>
                  <li>13-24: Moderate (appropriate for buprenorphine induction)</li>
                  <li>25-36: Moderately severe</li>
                  <li>&gt;36: Severe withdrawal</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Wesson DR, Ling W. The Clinical Opiate Withdrawal Scale (COWS). J Psychoactive Drugs. 2003;35(2):253-259.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default COWSCalculator;
