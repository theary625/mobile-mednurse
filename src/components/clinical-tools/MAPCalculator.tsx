import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity, RotateCcw, Info } from 'lucide-react';

const MAPCalculator = () => {
  const [sbp, setSbp] = useState<string>('');
  const [dbp, setDbp] = useState<string>('');

  const calculateMAP = () => {
    const systolic = parseFloat(sbp);
    const diastolic = parseFloat(dbp);
    if (systolic > 0 && diastolic > 0) {
      return (systolic + 2 * diastolic) / 3;
    }
    return null;
  };

  const map = calculateMAP();

  const getMAPInterpretation = (map: number) => {
    if (map < 60) return { 
      level: 'Critical', 
      color: 'text-destructive', 
      bg: 'bg-destructive/10',
      message: 'Hypoperfusion risk - urgent intervention needed'
    };
    if (map < 65) return { 
      level: 'Low', 
      color: 'text-orange-600', 
      bg: 'bg-orange-100',
      message: 'Below sepsis target (≥65 mmHg)'
    };
    if (map < 70) return { 
      level: 'Borderline', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      message: 'May be adequate for some patients'
    };
    if (map <= 100) return { 
      level: 'Normal', 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      message: 'Adequate organ perfusion'
    };
    if (map <= 110) return { 
      level: 'Elevated', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      message: 'Monitor for hypertensive conditions'
    };
    return { 
      level: 'High', 
      color: 'text-destructive', 
      bg: 'bg-destructive/10',
      message: 'Consider antihypertensive therapy'
    };
  };

  const reset = () => {
    setSbp('');
    setDbp('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          MAP Calculator
        </CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Mean Arterial Pressure
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sbp">Systolic BP (mmHg)</Label>
            <Input
              id="sbp"
              type="number"
              placeholder="120"
              value={sbp}
              onChange={(e) => setSbp(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dbp">Diastolic BP (mmHg)</Label>
            <Input
              id="dbp"
              type="number"
              placeholder="80"
              value={dbp}
              onChange={(e) => setDbp(e.target.value)}
            />
          </div>
        </div>

        {map !== null && (
          <div className={`p-4 rounded-lg ${getMAPInterpretation(map).bg} text-center`}>
            <p className="text-sm font-medium text-muted-foreground mb-1">Mean Arterial Pressure</p>
            <p className="text-4xl font-bold">{map.toFixed(0)} mmHg</p>
            <p className={`font-semibold mt-1 ${getMAPInterpretation(map).color}`}>
              {getMAPInterpretation(map).level}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {getMAPInterpretation(map).message}
            </p>
          </div>
        )}

        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Formula & Targets</p>
              <p className="mt-1"><strong>MAP = (SBP + 2×DBP) / 3</strong></p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• <strong>Normal:</strong> 70-100 mmHg</li>
                <li>• <strong>Sepsis target:</strong> ≥65 mmHg</li>
                <li>• <strong>Stroke (ischemic):</strong> ≤110 mmHg</li>
                <li>• <strong>Stroke (hemorrhagic):</strong> ≤130 mmHg SBP</li>
                <li>• <strong>Organ perfusion:</strong> &gt;60 mmHg minimum</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MAPCalculator;