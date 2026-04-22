import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Activity, RotateCcw, Info, AlertTriangle } from 'lucide-react';

const QTcCalculator = () => {
  const [qtInterval, setQtInterval] = useState<string>('');
  const [heartRate, setHeartRate] = useState<string>('');

  const calculateQTc = () => {
    const qt = parseFloat(qtInterval);
    const hr = parseFloat(heartRate);
    
    if (qt > 0 && hr > 0) {
      const rr = 60 / hr; // RR interval in seconds
      const rrMs = rr * 1000; // RR in milliseconds
      
      // Bazett: QTc = QT / √RR (RR in seconds)
      const bazett = qt / Math.sqrt(rr);
      
      // Fridericia: QTc = QT / ∛RR
      const fridericia = qt / Math.pow(rr, 1/3);
      
      // Framingham: QTc = QT + 0.154 × (1 - RR) × 1000
      const framingham = qt + 0.154 * (1 - rr) * 1000;
      
      // Hodges: QTc = QT + 1.75 × (HR - 60)
      const hodges = qt + 1.75 * (hr - 60);
      
      // Rautaharju: QTc = QT - 0.185 × (RR - 1) × 1000 + k (k=6 for men, k=0 for women; using 3 as average)
      const rautaharju = qt - 0.185 * (rr - 1) * 1000 + 3;
      
      return { bazett, fridericia, framingham, hodges, rautaharju };
    }
    return null;
  };

  const qtc = calculateQTc();

  const getInterpretation = (qtcValue: number) => {
    if (qtcValue < 440) return { 
      level: 'Normal', 
      color: 'text-green-600', 
      bg: 'bg-green-100'
    };
    if (qtcValue < 460) return { 
      level: 'Borderline', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100'
    };
    if (qtcValue < 500) return { 
      level: 'Prolonged', 
      color: 'text-orange-600', 
      bg: 'bg-orange-100'
    };
    return { 
      level: 'Markedly Prolonged', 
      color: 'text-destructive', 
      bg: 'bg-destructive/10'
    };
  };

  const reset = () => {
    setQtInterval('');
    setHeartRate('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6" />
          QTc Calculator
        </CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Corrected QT Interval (Multiple Formulas)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="qt">QT Interval (ms)</Label>
            <Input
              id="qt"
              type="number"
              placeholder="400"
              value={qtInterval}
              onChange={(e) => setQtInterval(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hr">Heart Rate (bpm)</Label>
            <Input
              id="hr"
              type="number"
              placeholder="70"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
            />
          </div>
        </div>

        {qtc !== null && (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${getInterpretation(qtc.bazett).bg}`}>
              <div className="text-center mb-4">
                <p className="text-sm font-medium text-muted-foreground">Bazett (Most Common)</p>
                <p className="text-4xl font-bold">{qtc.bazett.toFixed(0)} ms</p>
                <p className={`font-semibold ${getInterpretation(qtc.bazett).color}`}>
                  {getInterpretation(qtc.bazett).level}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs font-medium text-muted-foreground">Fridericia</p>
                <p className="text-xl font-bold">{qtc.fridericia.toFixed(0)} ms</p>
                <p className={`text-xs ${getInterpretation(qtc.fridericia).color}`}>
                  {getInterpretation(qtc.fridericia).level}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs font-medium text-muted-foreground">Framingham</p>
                <p className="text-xl font-bold">{qtc.framingham.toFixed(0)} ms</p>
                <p className={`text-xs ${getInterpretation(qtc.framingham).color}`}>
                  {getInterpretation(qtc.framingham).level}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs font-medium text-muted-foreground">Hodges</p>
                <p className="text-xl font-bold">{qtc.hodges.toFixed(0)} ms</p>
                <p className={`text-xs ${getInterpretation(qtc.hodges).color}`}>
                  {getInterpretation(qtc.hodges).level}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs font-medium text-muted-foreground">Rautaharju</p>
                <p className="text-xl font-bold">{qtc.rautaharju.toFixed(0)} ms</p>
                <p className={`text-xs ${getInterpretation(qtc.rautaharju).color}`}>
                  {getInterpretation(qtc.rautaharju).level}
                </p>
              </div>
            </div>

            {qtc.bazett >= 500 && (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-destructive">High Risk of Torsades de Pointes</p>
                  <p className="text-muted-foreground">
                    Review medications, correct electrolytes (K+, Mg2+), consider cardiology consult
                  </p>
                </div>
              </div>
            )}
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
              <p className="font-semibold">QTc Interpretation</p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• <strong>Normal:</strong> &lt;440 ms (men), &lt;460 ms (women)</li>
                <li>• <strong>Borderline:</strong> 440-460 ms</li>
                <li>• <strong>Prolonged:</strong> 460-500 ms</li>
                <li>• <strong>High risk:</strong> ≥500 ms (TdP risk)</li>
              </ul>
              <p className="mt-2 text-xs">
                <strong>Fridericia</strong> preferred at extreme HRs. <strong>Bazett</strong> overcorrects at high HR, undercorrects at low HR.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QTcCalculator;