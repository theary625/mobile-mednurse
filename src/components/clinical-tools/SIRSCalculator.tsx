import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, RotateCcw, Thermometer } from 'lucide-react';

const SIRSCalculator = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [respiratoryRate, setRespiratoryRate] = useState<number | null>(null);
  const [wbc, setWbc] = useState<number | null>(null);

  const calculateScore = () => {
    const values = [temperature, heartRate, respiratoryRate, wbc];
    if (values.some(v => v === null)) return null;
    return values.reduce((sum, v) => sum + (v ?? 0), 0);
  };

  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score >= 2) {
      return {
        level: 'SIRS Criteria Met',
        description: 'Patient meets SIRS criteria (≥2 criteria). If infection suspected, consider sepsis.',
        color: 'bg-destructive text-destructive-foreground'
      };
    } else if (score === 1) {
      return {
        level: 'Partial SIRS',
        description: 'Only 1 criterion met. Monitor closely for clinical deterioration.',
        color: 'bg-warning text-warning-foreground'
      };
    } else {
      return {
        level: 'SIRS Criteria Not Met',
        description: 'No SIRS criteria present.',
        color: 'bg-green-500 text-white'
      };
    }
  };

  const resetCalculator = () => {
    setTemperature(null);
    setHeartRate(null);
    setRespiratoryRate(null);
    setWbc(null);
  };

  const CriteriaRow = ({ 
    label, 
    criteria,
    value, 
    setValue
  }: { 
    label: string;
    criteria: string;
    value: number | null;
    setValue: (v: number) => void;
  }) => (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium">{label}</label>
        <p className="text-xs text-muted-foreground">{criteria}</p>
      </div>
      <div className="flex gap-2">
        <Button
          variant={value === 0 ? "default" : "outline"}
          size="sm"
          onClick={() => setValue(0)}
          className="flex-1"
        >
          Normal (0)
        </Button>
        <Button
          variant={value === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => setValue(1)}
          className="flex-1"
        >
          Abnormal (+1)
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="w-5 h-5 text-destructive" />
            SIRS Criteria
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Systemic Inflammatory Response Syndrome - requires ≥2 criteria for diagnosis
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <CriteriaRow
            label="Temperature"
            criteria=">38°C (100.4°F) or <36°C (96.8°F)"
            value={temperature}
            setValue={setTemperature}
          />

          <CriteriaRow
            label="Heart Rate"
            criteria=">90 beats per minute"
            value={heartRate}
            setValue={setHeartRate}
          />

          <CriteriaRow
            label="Respiratory Rate"
            criteria=">20 breaths/min or PaCO₂ <32 mmHg"
            value={respiratoryRate}
            setValue={setRespiratoryRate}
          />

          <CriteriaRow
            label="White Blood Cell Count"
            criteria=">12,000/mm³ or <4,000/mm³ or >10% bands"
            value={wbc}
            setValue={setWbc}
          />

          <Button variant="outline" onClick={resetCalculator} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Calculator
          </Button>
        </CardContent>
      </Card>

      {score !== null && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">SIRS Criteria Present</p>
                <p className="text-5xl font-bold">{score}</p>
                <p className="text-sm text-muted-foreground">of 4</p>
              </div>
              
              <Badge className={`${getInterpretation(score).color} text-sm px-4 py-2`}>
                {getInterpretation(score).level}
              </Badge>
              
              <p className="text-sm text-muted-foreground">
                {getInterpretation(score).description}
              </p>

              {score >= 2 && (
                <div className="bg-muted rounded-lg p-4 text-left">
                  <p className="text-sm font-medium mb-2">Next Steps:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Evaluate for source of infection</li>
                    <li>• Consider qSOFA for sepsis risk stratification</li>
                    <li>• Obtain cultures if infection suspected</li>
                    <li>• Consider early antibiotics if sepsis likely</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-4 h-4" />
            Clinical Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• SIRS is sensitive but not specific for sepsis - can occur with trauma, burns, pancreatitis, etc.</li>
            <li>• Sepsis-3 (2016) redefined sepsis using SOFA/qSOFA rather than SIRS</li>
            <li>• SIRS remains useful for identifying patients who need closer monitoring</li>
            <li>• Up to 12% of septic patients may not meet SIRS criteria</li>
            <li>• Consider using alongside qSOFA for comprehensive sepsis screening</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIRSCalculator;
