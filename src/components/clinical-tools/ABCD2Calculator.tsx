import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, RotateCcw, AlertTriangle } from 'lucide-react';

const ABCD2Calculator = () => {
  const [age, setAge] = useState<number | null>(null);
  const [bp, setBp] = useState<number | null>(null);
  const [clinical, setClinical] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [diabetes, setDiabetes] = useState<number | null>(null);

  const calculateScore = () => {
    if (age === null || bp === null || clinical === null || duration === null || diabetes === null) {
      return null;
    }
    return age + bp + clinical + duration + diabetes;
  };

  const score = calculateScore();

  const getInterpretation = (score: number) => {
    if (score <= 3) {
      return {
        level: 'Low Risk',
        risk2day: '1.0%',
        risk7day: '1.2%',
        risk90day: '3.1%',
        color: 'bg-green-500 text-white',
        recommendation: 'Consider outpatient workup within 48 hours'
      };
    } else if (score <= 5) {
      return {
        level: 'Moderate Risk',
        risk2day: '4.1%',
        risk7day: '5.9%',
        risk90day: '9.8%',
        color: 'bg-warning text-warning-foreground',
        recommendation: 'Consider admission or expedited outpatient workup'
      };
    } else {
      return {
        level: 'High Risk',
        risk2day: '8.1%',
        risk7day: '11.7%',
        risk90day: '17.8%',
        color: 'bg-destructive text-destructive-foreground',
        recommendation: 'Consider hospital admission for urgent workup'
      };
    }
  };

  const resetCalculator = () => {
    setAge(null);
    setBp(null);
    setClinical(null);
    setDuration(null);
    setDiabetes(null);
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
      <span className="font-bold mr-2">+{value}</span>
      <span className="text-xs">{label}</span>
    </Button>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="w-5 h-5 text-warning" />
            ABCD² Score
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Estimates stroke risk within 2, 7, and 90 days after TIA
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Age */}
          <div className="space-y-2">
            <label className="text-sm font-medium">A - Age</label>
            <div className="grid grid-cols-2 gap-2">
              <ScoreButton value={0} label="< 60 years" selected={age === 0} onClick={() => setAge(0)} />
              <ScoreButton value={1} label="≥ 60 years" selected={age === 1} onClick={() => setAge(1)} />
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="space-y-2">
            <label className="text-sm font-medium">B - Blood Pressure</label>
            <div className="grid grid-cols-2 gap-2">
              <ScoreButton value={0} label="Normal" selected={bp === 0} onClick={() => setBp(0)} />
              <ScoreButton value={1} label="≥ 140/90 mmHg" selected={bp === 1} onClick={() => setBp(1)} />
            </div>
          </div>

          {/* Clinical Features */}
          <div className="space-y-2">
            <label className="text-sm font-medium">C - Clinical Features</label>
            <div className="grid grid-cols-1 gap-2">
              <ScoreButton value={0} label="Other symptoms" selected={clinical === 0} onClick={() => setClinical(0)} />
              <ScoreButton value={1} label="Speech disturbance without weakness" selected={clinical === 1} onClick={() => setClinical(1)} />
              <ScoreButton value={2} label="Unilateral weakness" selected={clinical === 2} onClick={() => setClinical(2)} />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium">D - Duration of Symptoms</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <ScoreButton value={0} label="< 10 minutes" selected={duration === 0} onClick={() => setDuration(0)} />
              <ScoreButton value={1} label="10-59 minutes" selected={duration === 1} onClick={() => setDuration(1)} />
              <ScoreButton value={2} label="≥ 60 minutes" selected={duration === 2} onClick={() => setDuration(2)} />
            </div>
          </div>

          {/* Diabetes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">D - Diabetes</label>
            <div className="grid grid-cols-2 gap-2">
              <ScoreButton value={0} label="No" selected={diabetes === 0} onClick={() => setDiabetes(0)} />
              <ScoreButton value={1} label="Yes" selected={diabetes === 1} onClick={() => setDiabetes(1)} />
            </div>
          </div>

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
                <p className="text-sm text-muted-foreground mb-1">Total ABCD² Score</p>
                <p className="text-5xl font-bold">{score}</p>
                <p className="text-sm text-muted-foreground">out of 7</p>
              </div>
              
              <Badge className={`${getInterpretation(score).color} text-sm px-4 py-2`}>
                {getInterpretation(score).level}
              </Badge>

              <div className="bg-muted rounded-lg p-4 text-left">
                <p className="text-sm font-medium mb-2">Stroke Risk:</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-lg font-bold">{getInterpretation(score).risk2day}</p>
                    <p className="text-xs text-muted-foreground">2-day</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{getInterpretation(score).risk7day}</p>
                    <p className="text-xs text-muted-foreground">7-day</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{getInterpretation(score).risk90day}</p>
                    <p className="text-xs text-muted-foreground">90-day</p>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {getInterpretation(score).recommendation}
              </p>
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
            <li>• ABCD² should not be used in isolation to determine disposition</li>
            <li>• Low scores do not exclude need for urgent evaluation</li>
            <li>• Consider imaging findings (e.g., DWI+ lesions) which increase risk</li>
            <li>• Dual antiplatelet therapy may be considered for high-risk TIA</li>
            <li>• All TIA patients warrant evaluation for cardioembolic sources</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABCD2Calculator;
