import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, RotateCcw, Activity } from 'lucide-react';

const criteria = [
  {
    id: 'facialExpression',
    title: 'Facial Expression',
    options: [
      { value: 0, label: 'Relaxed, neutral', description: 'No muscle tension observed' },
      { value: 1, label: 'Tense', description: 'Brow lowering, orbit tightening, levator contraction' },
      { value: 2, label: 'Grimacing', description: 'All above plus eyelid tightly closed' }
    ]
  },
  {
    id: 'bodyMovements',
    title: 'Body Movements',
    options: [
      { value: 0, label: 'Absence of movements or normal position', description: 'Does not move or normal position' },
      { value: 1, label: 'Protection', description: 'Slow, cautious movements, touching pain site, seeking attention' },
      { value: 2, label: 'Restlessness/Agitation', description: 'Pulling tube, attempting to sit up, not following commands, striking at staff' }
    ]
  },
  {
    id: 'muscleTension',
    title: 'Muscle Tension (evaluation by passive flexion/extension of upper extremities)',
    options: [
      { value: 0, label: 'Relaxed', description: 'No resistance to passive movements' },
      { value: 1, label: 'Tense, rigid', description: 'Resistance to passive movements' },
      { value: 2, label: 'Very tense or rigid', description: 'Strong resistance, inability to complete movements' }
    ]
  },
  {
    id: 'ventilatorCompliance',
    title: 'Compliance with Ventilator (intubated) OR Vocalization (extubated)',
    options: [
      { value: 0, label: 'Tolerating ventilator/movement OR Talking in normal tone or no sound', description: 'Alarms not activated / Speaking normally' },
      { value: 1, label: 'Coughing but tolerating OR Sighing, moaning', description: 'Occasional coughing / Sighing or moaning' },
      { value: 2, label: 'Fighting ventilator OR Crying out, sobbing', description: 'Asynchrony, blocking ventilation / Crying out or sobbing' }
    ]
  }
];

const CPOTCalculator = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (criterionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [criterionId]: value }));
  };

  const allAnswered = criteria.every(c => answers[c.id] !== undefined);
  const totalScore = Object.values(answers).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score <= 2) {
      return { 
        pain: 'Minimal/No Pain', 
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-950/50 dark:text-green-200 dark:border-green-800', 
        action: 'Continue current pain management. Reassess regularly.' 
      };
    } else if (score <= 4) {
      return { 
        pain: 'Moderate Pain', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-200 dark:border-yellow-800', 
        action: 'Consider analgesic intervention. Reassess in 30 minutes.' 
      };
    } else {
      return { 
        pain: 'Significant Pain', 
        color: 'bg-destructive/10 text-destructive border-destructive/30', 
        action: 'Immediate analgesic intervention recommended. Notify provider.' 
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
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">CPOT</CardTitle>
            <p className="text-orange-100 text-sm mt-1">Critical-Care Pain Observation Tool</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Observe the patient at rest for 1 minute, then during a procedure (e.g., turning). 
            For muscle tension, perform passive flexion/extension of the arm. Score each category based on observed behaviors.
            Designed for critically ill adults who cannot self-report pain.
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
                <div key={opt.value} className="flex items-start space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`${criterion.id}-${opt.value}`} className="mt-1" />
                  <Label htmlFor={`${criterion.id}-${opt.value}`} className="cursor-pointer text-sm">
                    <span className="font-medium">({opt.value}) {opt.label}</span>
                    <span className="text-muted-foreground block text-xs">{opt.description}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} disabled={!allAnswered} className="flex-1">
            Calculate CPOT Score
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
                <p className="text-4xl font-bold">{totalScore}/8</p>
                <p className="text-lg font-semibold">{interpretation.pain}</p>
              </div>
              <div className="grid grid-cols-4 gap-1 text-center text-xs mb-4">
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Face: {answers.facialExpression}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Body: {answers.bodyMovements}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Muscle: {answers.muscleTension}</div>
                <div className="p-1 bg-white/50 dark:bg-black/20 rounded">Vent/Voice: {answers.ventilatorCompliance}</div>
              </div>
              <p className="text-sm text-center">{interpretation.action}</p>
            </div>

            {totalScore >= 3 && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                <div className="text-sm text-destructive">
                  <p className="font-semibold">Pain Intervention Indicated</p>
                  <p>CPOT ≥3 suggests clinically significant pain. Consider analgesic therapy and reassess after intervention.</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold">Score Interpretation</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>0-2: Minimal/No pain</li>
                  <li>3-4: Moderate pain - consider intervention</li>
                  <li>5-8: Significant pain - intervention recommended</li>
                  <li>Score ≥3 is the threshold for intervention in most protocols</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Gélinas C, et al. Validation of the Critical-Care Pain Observation Tool in adult patients. Am J Crit Care. 2006;15(4):420-427.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CPOTCalculator;
