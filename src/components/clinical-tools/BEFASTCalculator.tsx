import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, Info, RotateCcw } from 'lucide-react';

const criteria = [
  {
    id: 'balance',
    label: 'Balance',
    description: 'Sudden loss of balance or coordination, dizziness, or trouble walking?',
  },
  {
    id: 'eyes',
    label: 'Eyes',
    description: 'Sudden blurred or double vision, or sudden loss of vision in one or both eyes?',
  },
  {
    id: 'face',
    label: 'Face Drooping',
    description: 'Ask the person to smile. Does one side of the face droop or is it numb?',
  },
  {
    id: 'arms',
    label: 'Arm Weakness',
    description: 'Ask the person to raise both arms. Does one arm drift downward?',
  },
  {
    id: 'speech',
    label: 'Speech Difficulty',
    description: 'Ask the person to repeat a simple sentence. Is speech slurred or hard to understand?',
  },
];

const BEFASTCalculator = () => {
  const [scores, setScores] = useState<Record<string, string>>({});

  const allAnswered = criteria.every((c) => scores[c.id] !== undefined);
  const positiveCount = Object.values(scores).filter((v) => v === 'yes').length;
  const isPositive = positiveCount > 0;

  const handleReset = () => setScores({});

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">BE-FAST Stroke Assessment</CardTitle>
              <CardDescription>Balance, Eyes, Face, Arms, Speech, Time — expanded stroke screening</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleReset} title="Reset">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {criteria.map((item) => (
          <div key={item.id} className="space-y-2">
            <Label className="text-sm font-medium">{item.label}</Label>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            <RadioGroup
              value={scores[item.id]}
              onValueChange={(v) => setScores((prev) => ({ ...prev, [item.id]: v }))}
              className="flex gap-4 mt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id={`befast-${item.id}-yes`} />
                <Label htmlFor={`befast-${item.id}-yes`} className="text-sm cursor-pointer">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id={`befast-${item.id}-no`} />
                <Label htmlFor={`befast-${item.id}-no`} className="text-sm cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          </div>
        ))}

        {allAnswered && (
          <div
            className={`p-4 rounded-lg border-2 ${
              isPositive
                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                : 'bg-success/10 border-success/30 text-success'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">BE-FAST Result</span>
              <Badge
                variant="outline"
                className={
                  isPositive
                    ? 'bg-destructive/10 border-destructive/30 text-destructive'
                    : 'bg-success/10 border-success/30 text-success'
                }
              >
                {positiveCount}/5 positive
              </Badge>
            </div>
            <div className="text-lg font-bold mb-1">
              {isPositive ? 'BE-FAST Positive — Call 911 / Activate Stroke Alert' : 'BE-FAST Negative'}
            </div>
            <p className="text-sm opacity-80">
              {isPositive
                ? 'Time is critical. Note symptom onset time and activate emergency response immediately.'
                : 'No acute stroke signs detected. Continue monitoring and reassess as needed.'}
            </p>
          </div>
        )}

        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">T = Time to call emergency services</p>
            <p>BE-FAST extends the classic FAST mnemonic by adding <strong>Balance</strong> and <strong>Eyes</strong>, catching up to 95% of acute strokes including posterior circulation events often missed by FAST alone.</p>
            <p className="mt-1">If ANY sign is positive, note onset time and call 911. Thrombolytic window: up to 4.5 hours.</p>
            <p className="mt-1"><strong>Reference:</strong> Aroor et al., J Stroke Cerebrovasc Dis. 2017</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BEFASTCalculator;
