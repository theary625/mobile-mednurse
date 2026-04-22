import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Info, AlertTriangle } from 'lucide-react';

interface NIHSSSection {
  name: string;
  label: string;
  options: { value: number; label: string }[];
}

const nihssSections: NIHSSSection[] = [
  {
    name: 'consciousness',
    label: '1a. Level of Consciousness',
    options: [
      { value: 0, label: '0 - Alert' },
      { value: 1, label: '1 - Not alert, arousable' },
      { value: 2, label: '2 - Not alert, requires repeated stimulation' },
      { value: 3, label: '3 - Unresponsive' },
    ],
  },
  {
    name: 'locQuestions',
    label: '1b. LOC Questions (month, age)',
    options: [
      { value: 0, label: '0 - Answers both correctly' },
      { value: 1, label: '1 - Answers one correctly' },
      { value: 2, label: '2 - Answers neither correctly' },
    ],
  },
  {
    name: 'locCommands',
    label: '1c. LOC Commands (open/close eyes, grip)',
    options: [
      { value: 0, label: '0 - Performs both correctly' },
      { value: 1, label: '1 - Performs one correctly' },
      { value: 2, label: '2 - Performs neither correctly' },
    ],
  },
  {
    name: 'gaze',
    label: '2. Best Gaze',
    options: [
      { value: 0, label: '0 - Normal' },
      { value: 1, label: '1 - Partial gaze palsy' },
      { value: 2, label: '2 - Forced deviation' },
    ],
  },
  {
    name: 'visual',
    label: '3. Visual Fields',
    options: [
      { value: 0, label: '0 - No visual loss' },
      { value: 1, label: '1 - Partial hemianopia' },
      { value: 2, label: '2 - Complete hemianopia' },
      { value: 3, label: '3 - Bilateral hemianopia' },
    ],
  },
  {
    name: 'facial',
    label: '4. Facial Palsy',
    options: [
      { value: 0, label: '0 - Normal' },
      { value: 1, label: '1 - Minor paralysis' },
      { value: 2, label: '2 - Partial paralysis' },
      { value: 3, label: '3 - Complete paralysis' },
    ],
  },
  {
    name: 'motorArmL',
    label: '5a. Motor Arm - Left',
    options: [
      { value: 0, label: '0 - No drift' },
      { value: 1, label: '1 - Drift before 10 seconds' },
      { value: 2, label: '2 - Falls before 10 seconds' },
      { value: 3, label: '3 - No effort against gravity' },
      { value: 4, label: '4 - No movement' },
    ],
  },
  {
    name: 'motorArmR',
    label: '5b. Motor Arm - Right',
    options: [
      { value: 0, label: '0 - No drift' },
      { value: 1, label: '1 - Drift before 10 seconds' },
      { value: 2, label: '2 - Falls before 10 seconds' },
      { value: 3, label: '3 - No effort against gravity' },
      { value: 4, label: '4 - No movement' },
    ],
  },
  {
    name: 'motorLegL',
    label: '6a. Motor Leg - Left',
    options: [
      { value: 0, label: '0 - No drift' },
      { value: 1, label: '1 - Drift before 5 seconds' },
      { value: 2, label: '2 - Falls before 5 seconds' },
      { value: 3, label: '3 - No effort against gravity' },
      { value: 4, label: '4 - No movement' },
    ],
  },
  {
    name: 'motorLegR',
    label: '6b. Motor Leg - Right',
    options: [
      { value: 0, label: '0 - No drift' },
      { value: 1, label: '1 - Drift before 5 seconds' },
      { value: 2, label: '2 - Falls before 5 seconds' },
      { value: 3, label: '3 - No effort against gravity' },
      { value: 4, label: '4 - No movement' },
    ],
  },
  {
    name: 'ataxia',
    label: '7. Limb Ataxia',
    options: [
      { value: 0, label: '0 - Absent' },
      { value: 1, label: '1 - Present in one limb' },
      { value: 2, label: '2 - Present in two limbs' },
    ],
  },
  {
    name: 'sensory',
    label: '8. Sensory',
    options: [
      { value: 0, label: '0 - Normal' },
      { value: 1, label: '1 - Mild-moderate loss' },
      { value: 2, label: '2 - Severe or total loss' },
    ],
  },
  {
    name: 'language',
    label: '9. Best Language',
    options: [
      { value: 0, label: '0 - No aphasia' },
      { value: 1, label: '1 - Mild-moderate aphasia' },
      { value: 2, label: '2 - Severe aphasia' },
      { value: 3, label: '3 - Mute/global aphasia' },
    ],
  },
  {
    name: 'dysarthria',
    label: '10. Dysarthria',
    options: [
      { value: 0, label: '0 - Normal' },
      { value: 1, label: '1 - Mild-moderate' },
      { value: 2, label: '2 - Severe/mute' },
    ],
  },
  {
    name: 'extinction',
    label: '11. Extinction/Inattention',
    options: [
      { value: 0, label: '0 - No abnormality' },
      { value: 1, label: '1 - Inattention to one modality' },
      { value: 2, label: '2 - Profound inattention' },
    ],
  },
];

const NIHSSCalculator = () => {
  const [scores, setScores] = useState<Record<string, number>>({});

  const updateScore = (name: string, value: number) => {
    setScores((prev) => ({ ...prev, [name]: value }));
  };

  const completedCount = Object.keys(scores).length;
  const totalSections = nihssSections.length;
  const isComplete = completedCount === totalSections;

  const totalScore = Object.values(scores).reduce((sum, val) => sum + val, 0);

  const getInterpretation = (score: number) => {
    if (score === 0) return { label: 'No stroke symptoms', severity: 'none' as const };
    if (score <= 4) return { label: 'Minor stroke', severity: 'mild' as const };
    if (score <= 15) return { label: 'Moderate stroke', severity: 'moderate' as const };
    if (score <= 20) return { label: 'Moderate-severe stroke', severity: 'moderateSevere' as const };
    return { label: 'Severe stroke', severity: 'severe' as const };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-success/10 border-success/30 text-success';
      case 'mild': return 'bg-success/10 border-success/30 text-success';
      case 'moderate': return 'bg-warning/10 border-warning/30 text-warning';
      case 'moderateSevere': return 'bg-orange-500/10 border-orange-500/30 text-orange-600';
      case 'severe': return 'bg-destructive/10 border-destructive/30 text-destructive';
      default: return '';
    }
  };

  const interpretation = getInterpretation(totalScore);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">NIH Stroke Scale (NIHSS)</CardTitle>
            <CardDescription>Quantify stroke severity</CardDescription>
          </div>
          <Badge variant="outline">
            {completedCount}/{totalSections}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scrollable sections */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {nihssSections.map((section) => (
            <div key={section.name}>
              <Label className="text-sm font-medium">{section.label}</Label>
              <Select
                value={scores[section.name]?.toString()}
                onValueChange={(v) => updateScore(section.name, parseInt(v))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select score" />
                </SelectTrigger>
                <SelectContent>
                  {section.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value.toString()}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Running Score */}
        <div className={`p-4 rounded-lg border-2 ${isComplete ? getSeverityColor(interpretation.severity) : 'border-muted bg-muted/30'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">NIHSS Score</span>
            {isComplete ? (
              <Badge variant="outline" className={getSeverityColor(interpretation.severity)}>
                {interpretation.label}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">Complete all sections</span>
            )}
          </div>
          <div className="text-3xl font-bold">{totalScore}/42</div>
        </div>

        {/* tPA Alert */}
        {isComplete && totalScore >= 4 && totalScore <= 25 && (
          <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
            <p className="text-sm text-warning">
              Score in potential tPA candidate range. Assess for thrombolytic eligibility.
            </p>
          </div>
        )}

        {/* Reference */}
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p><strong>0:</strong> No symptoms</p>
            <p><strong>1-4:</strong> Minor stroke</p>
            <p><strong>5-15:</strong> Moderate stroke</p>
            <p><strong>16-20:</strong> Moderate-severe</p>
            <p><strong>21-42:</strong> Severe stroke</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NIHSSCalculator;
