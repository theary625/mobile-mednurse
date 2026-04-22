import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Info, RotateCcw } from 'lucide-react';

const RACECalculator = () => {
  const [facialPalsy, setFacialPalsy] = useState<number | null>(null);
  const [armMotor, setArmMotor] = useState<number | null>(null);
  const [legMotor, setLegMotor] = useState<number | null>(null);
  const [headEyeDeviation, setHeadEyeDeviation] = useState<number | null>(null);
  const [aphasia, setAphasia] = useState<number | null>(null);
  const [agnosia, setAgnosia] = useState<number | null>(null);

  const calculateScore = () => {
    if (facialPalsy === null || armMotor === null || legMotor === null || headEyeDeviation === null) {
      return null;
    }
    // Aphasia OR Agnosia (whichever is present/higher)
    const corticalScore = Math.max(aphasia ?? 0, agnosia ?? 0);
    return facialPalsy + armMotor + legMotor + headEyeDeviation + corticalScore;
  };

  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score >= 5) {
      return {
        level: 'High probability of LVO',
        description: 'RACE ≥5 suggests Large Vessel Occlusion. Consider emergent transfer to comprehensive stroke center for thrombectomy evaluation.',
        color: 'bg-destructive text-destructive-foreground',
        sensitivity: '85%',
        specificity: '68%'
      };
    } else if (score >= 3) {
      return {
        level: 'Moderate probability',
        description: 'Consider LVO in differential. Clinical judgment and imaging recommended.',
        color: 'bg-warning text-warning-foreground',
        sensitivity: null,
        specificity: null
      };
    } else {
      return {
        level: 'Lower probability of LVO',
        description: 'LVO less likely but not excluded. Continue standard stroke evaluation.',
        color: 'bg-muted text-muted-foreground',
        sensitivity: null,
        specificity: null
      };
    }
  };

  const resetCalculator = () => {
    setFacialPalsy(null);
    setArmMotor(null);
    setLegMotor(null);
    setHeadEyeDeviation(null);
    setAphasia(null);
    setAgnosia(null);
  };

  const ScoreButton = ({ 
    value, 
    label, 
    selected, 
    onClick 
  }: { 
    value: number; 
    label: string; 
    selected: boolean; 
    onClick: () => void;
  }) => (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className="justify-start h-auto py-2 px-3 text-left"
    >
      <span className="font-bold mr-2">{value}</span>
      <span className="text-xs">{label}</span>
    </Button>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-warning" />
            RACE Score - Rapid Arterial oCclusion Evaluation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Prehospital scale for detecting Large Vessel Occlusion (LVO) in acute stroke
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Facial Palsy */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Facial Palsy</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ScoreButton value={0} label="Absent" selected={facialPalsy === 0} onClick={() => setFacialPalsy(0)} />
              <ScoreButton value={1} label="Mild" selected={facialPalsy === 1} onClick={() => setFacialPalsy(1)} />
              <ScoreButton value={2} label="Moderate to severe" selected={facialPalsy === 2} onClick={() => setFacialPalsy(2)} />
            </div>
          </div>

          {/* Arm Motor Function */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Arm Motor Function</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ScoreButton value={0} label="Normal or mild" selected={armMotor === 0} onClick={() => setArmMotor(0)} />
              <ScoreButton value={1} label="Moderate" selected={armMotor === 1} onClick={() => setArmMotor(1)} />
              <ScoreButton value={2} label="Severe" selected={armMotor === 2} onClick={() => setArmMotor(2)} />
            </div>
          </div>

          {/* Leg Motor Function */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Leg Motor Function</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ScoreButton value={0} label="Normal or mild" selected={legMotor === 0} onClick={() => setLegMotor(0)} />
              <ScoreButton value={1} label="Moderate" selected={legMotor === 1} onClick={() => setLegMotor(1)} />
              <ScoreButton value={2} label="Severe" selected={legMotor === 2} onClick={() => setLegMotor(2)} />
            </div>
          </div>

          {/* Head and Gaze Deviation */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Head and Gaze Deviation</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ScoreButton value={0} label="Absent" selected={headEyeDeviation === 0} onClick={() => setHeadEyeDeviation(0)} />
              <ScoreButton value={1} label="Present" selected={headEyeDeviation === 1} onClick={() => setHeadEyeDeviation(1)} />
            </div>
          </div>

          {/* Cortical Signs - Aphasia (Left hemisphere) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Aphasia <span className="text-muted-foreground">(if right-sided weakness)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ScoreButton value={0} label="Performs both tasks" selected={aphasia === 0} onClick={() => setAphasia(0)} />
              <ScoreButton value={1} label="Performs 1 task" selected={aphasia === 1} onClick={() => setAphasia(1)} />
              <ScoreButton value={2} label="Performs neither" selected={aphasia === 2} onClick={() => setAphasia(2)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Ask: Close eyes / Make a fist
            </p>
          </div>

          {/* Cortical Signs - Agnosia (Right hemisphere) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Agnosia <span className="text-muted-foreground">(if left-sided weakness)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ScoreButton value={0} label="Recognizes both" selected={agnosia === 0} onClick={() => setAgnosia(0)} />
              <ScoreButton value={1} label="Recognizes 1" selected={agnosia === 1} onClick={() => setAgnosia(1)} />
              <ScoreButton value={2} label="Recognizes neither" selected={agnosia === 2} onClick={() => setAgnosia(2)} />
            </div>
            <p className="text-xs text-muted-foreground">
              Ask patient to recognize both arms
            </p>
          </div>

          {/* Reset Button */}
          <Button variant="outline" onClick={resetCalculator} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Calculator
          </Button>
        </CardContent>
      </Card>

      {/* Score Result */}
      {score !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total RACE Score</p>
                <p className="text-5xl font-bold">{score}</p>
                <p className="text-sm text-muted-foreground">out of 9</p>
              </div>
              
              <Badge className={`${getInterpretation(score).color} text-sm px-4 py-2`}>
                {getInterpretation(score).level}
              </Badge>
              
              <p className="text-sm text-muted-foreground">
                {getInterpretation(score).description}
              </p>

              {score >= 5 && (
                <div className="bg-muted rounded-lg p-4 text-left">
                  <p className="text-sm font-medium mb-2">At RACE ≥5 cutoff:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sensitivity for LVO: ~85%</li>
                    <li>• Specificity for LVO: ~68%</li>
                    <li>• PPV varies by prevalence</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinical Notes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• RACE was developed for prehospital EMS use to identify LVO candidates for thrombectomy</li>
            <li>• Score ≥5 is commonly used threshold for comprehensive stroke center bypass</li>
            <li>• Evaluate EITHER aphasia OR agnosia based on side of weakness (not both)</li>
            <li>• Does not replace need for vascular imaging to confirm LVO</li>
            <li>• Consider local protocols for stroke center destination decisions</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default RACECalculator;
