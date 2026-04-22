import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BishopResult {
  totalScore: number;
  interpretation: string;
  inductionSuccess: string;
  recommendation: string;
}

const BishopScoreCalculator: React.FC = () => {
  const [dilation, setDilation] = useState<string>('');
  const [effacement, setEffacement] = useState<string>('');
  const [station, setStation] = useState<string>('');
  const [consistency, setConsistency] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [result, setResult] = useState<BishopResult | null>(null);

  const calculate = () => {
    const scores = [dilation, effacement, station, consistency, position];
    if (scores.some(s => s === '')) return;

    const totalScore = scores.reduce((sum, s) => sum + parseInt(s), 0);

    let interpretation: string;
    let inductionSuccess: string;
    let recommendation: string;

    if (totalScore >= 9) {
      interpretation = 'Favorable cervix';
      inductionSuccess = 'High likelihood of successful vaginal delivery';
      recommendation = 'Induction likely to be successful. Consider amniotomy and oxytocin.';
    } else if (totalScore >= 6) {
      interpretation = 'Moderately favorable';
      inductionSuccess = 'Moderate likelihood of successful induction';
      recommendation = 'Cervical ripening may improve success. Consider prostaglandins or mechanical methods.';
    } else {
      interpretation = 'Unfavorable cervix';
      inductionSuccess = 'Lower likelihood of successful induction without ripening';
      recommendation = 'Cervical ripening strongly recommended before oxytocin.';
    }

    setResult({
      totalScore,
      interpretation,
      inductionSuccess,
      recommendation
    });
  };

  const resetForm = () => {
    setDilation('');
    setEffacement('');
    setStation('');
    setConsistency('');
    setPosition('');
    setResult(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 6) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Bishop Score Calculator</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Cervical readiness for labor induction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-6">
          {/* Dilation */}
          <div>
            <Label className="text-base font-semibold">Cervical Dilation</Label>
            <RadioGroup value={dilation} onValueChange={setDilation} className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {[
                { value: '0', label: 'Closed', desc: '0 cm' },
                { value: '1', label: '1-2 cm', desc: '' },
                { value: '2', label: '3-4 cm', desc: '' },
                { value: '3', label: '≥5 cm', desc: '' },
              ].map(opt => (
                <div key={opt.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`dil-${opt.value}`} />
                  <Label htmlFor={`dil-${opt.value}`} className="cursor-pointer text-sm">
                    {opt.label} <span className="text-muted-foreground">({opt.value})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Effacement */}
          <div>
            <Label className="text-base font-semibold">Effacement</Label>
            <RadioGroup value={effacement} onValueChange={setEffacement} className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {[
                { value: '0', label: '0-30%' },
                { value: '1', label: '40-50%' },
                { value: '2', label: '60-70%' },
                { value: '3', label: '≥80%' },
              ].map(opt => (
                <div key={opt.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`eff-${opt.value}`} />
                  <Label htmlFor={`eff-${opt.value}`} className="cursor-pointer text-sm">
                    {opt.label} <span className="text-muted-foreground">({opt.value})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Station */}
          <div>
            <Label className="text-base font-semibold">Fetal Station</Label>
            <RadioGroup value={station} onValueChange={setStation} className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {[
                { value: '0', label: '-3' },
                { value: '1', label: '-2' },
                { value: '2', label: '-1, 0' },
                { value: '3', label: '+1, +2' },
              ].map(opt => (
                <div key={opt.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`sta-${opt.value}`} />
                  <Label htmlFor={`sta-${opt.value}`} className="cursor-pointer text-sm">
                    {opt.label} <span className="text-muted-foreground">({opt.value})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Consistency */}
          <div>
            <Label className="text-base font-semibold">Cervical Consistency</Label>
            <RadioGroup value={consistency} onValueChange={setConsistency} className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: '0', label: 'Firm' },
                { value: '1', label: 'Medium' },
                { value: '2', label: 'Soft' },
              ].map(opt => (
                <div key={opt.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`con-${opt.value}`} />
                  <Label htmlFor={`con-${opt.value}`} className="cursor-pointer text-sm">
                    {opt.label} <span className="text-muted-foreground">({opt.value})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Position */}
          <div>
            <Label className="text-base font-semibold">Cervical Position</Label>
            <RadioGroup value={position} onValueChange={setPosition} className="grid grid-cols-3 gap-2 mt-2">
              {[
                { value: '0', label: 'Posterior' },
                { value: '1', label: 'Mid-position' },
                { value: '2', label: 'Anterior' },
              ].map(opt => (
                <div key={opt.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-muted/50">
                  <RadioGroupItem value={opt.value} id={`pos-${opt.value}`} />
                  <Label htmlFor={`pos-${opt.value}`} className="cursor-pointer text-sm">
                    {opt.label} <span className="text-muted-foreground">({opt.value})</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={calculate} className="flex-1">Calculate Bishop Score</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className="space-y-4 pt-4">
            <div className={`p-4 rounded-lg border ${
              result.totalScore >= 9 ? 'bg-green-50 border-green-200' :
              result.totalScore >= 6 ? 'bg-amber-50 border-amber-200' :
              'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Bishop Score</span>
                <span className={`text-3xl font-bold ${getScoreColor(result.totalScore)}`}>
                  {result.totalScore}/13
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {result.totalScore >= 6 ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                  <span className="font-medium">{result.interpretation}</span>
                </div>
                <p className="text-sm text-muted-foreground">{result.inductionSuccess}</p>
              </div>
            </div>

            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="font-semibold mb-2">Recommendation</p>
              <p className="text-sm">{result.recommendation}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Scoring Guide</p>
          <ul className="text-sm space-y-1">
            <li><strong>≥9:</strong> Favorable - high success rate for induction</li>
            <li><strong>6-8:</strong> Moderate - consider ripening agents</li>
            <li><strong>&lt;6:</strong> Unfavorable - cervical ripening recommended</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Ripening Options</p>
              <ul className="mt-2 space-y-1">
                <li>• <strong>Prostaglandins:</strong> Misoprostol, Dinoprostone (Cervidil)</li>
                <li>• <strong>Mechanical:</strong> Foley balloon catheter, laminaria</li>
                <li>• Bishop score ≥6 may proceed directly to oxytocin</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BishopScoreCalculator;
