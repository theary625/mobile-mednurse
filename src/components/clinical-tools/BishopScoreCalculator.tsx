import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const BishopScoreCalculator: React.FC = () => {
  const [dilation, setDilation] = useState<string>('');
  const [effacement, setEffacement] = useState<string>('');
  const [station, setStation] = useState<string>('');
  const [consistency, setConsistency] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    if (!dilation || !effacement || !station || !consistency || !position) return null;

    const score = parseInt(dilation) + parseInt(effacement) + parseInt(station) + 
                  parseInt(consistency) + parseInt(position);

    let interpretation = '';
    let recommendation = '';
    let severity = 'normal';

    if (score <= 5) {
      interpretation = 'Unfavorable cervix';
      recommendation = 'Consider cervical ripening before induction (prostaglandins, mechanical methods)';
      severity = 'low';
    } else if (score <= 7) {
      interpretation = 'Moderately favorable cervix';
      recommendation = 'Induction may be attempted; cervical ripening may improve success';
      severity = 'moderate';
    } else {
      interpretation = 'Favorable cervix';
      recommendation = 'Good candidate for labor induction; high likelihood of vaginal delivery';
      severity = 'favorable';
    }

    return { score, interpretation, recommendation, severity };
  };

  const result = showResults ? calculateScore() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'favorable':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'moderate':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'low':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const isValid = dilation && effacement && station && consistency && position;

  const resetForm = () => {
    setDilation('');
    setEffacement('');
    setStation('');
    setConsistency('');
    setPosition('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Bishop Score</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Cervical Readiness for Labor Induction
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Dilation */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Cervical Dilation</Label>
          <RadioGroup value={dilation} onValueChange={setDilation} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '0', label: 'Closed (0 cm)' },
              { value: '1', label: '1-2 cm' },
              { value: '2', label: '3-4 cm' },
              { value: '3', label: '≥5 cm' },
            ].map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`dilation-${opt.value}`} />
                <Label htmlFor={`dilation-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Effacement */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Cervical Effacement</Label>
          <RadioGroup value={effacement} onValueChange={setEffacement} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '0', label: '0-30%' },
              { value: '1', label: '40-50%' },
              { value: '2', label: '60-70%' },
              { value: '3', label: '≥80%' },
            ].map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`effacement-${opt.value}`} />
                <Label htmlFor={`effacement-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Station */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Fetal Station</Label>
          <RadioGroup value={station} onValueChange={setStation} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '0', label: '-3' },
              { value: '1', label: '-2' },
              { value: '2', label: '-1, 0' },
              { value: '3', label: '+1, +2' },
            ].map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`station-${opt.value}`} />
                <Label htmlFor={`station-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Consistency */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Cervical Consistency</Label>
          <RadioGroup value={consistency} onValueChange={setConsistency} className="grid grid-cols-3 gap-3">
            {[
              { value: '0', label: 'Firm' },
              { value: '1', label: 'Medium' },
              { value: '2', label: 'Soft' },
            ].map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`consistency-${opt.value}`} />
                <Label htmlFor={`consistency-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Position */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Cervical Position</Label>
          <RadioGroup value={position} onValueChange={setPosition} className="grid grid-cols-3 gap-3">
            {[
              { value: '0', label: 'Posterior' },
              { value: '1', label: 'Mid-position' },
              { value: '2', label: 'Anterior' },
            ].map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`position-${opt.value}`} />
                <Label htmlFor={`position-${opt.value}`} className="text-sm cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Bishop Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold">{result.score}</p>
              <p className="text-sm font-semibold mt-1">Bishop Score (0-13)</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">{result.interpretation}</p>
              <p className="text-sm">{result.recommendation}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Scoring Reference:</p>
          <div className="text-sm text-muted-foreground grid gap-1">
            <p><strong>≤5:</strong> Unfavorable - cervical ripening recommended</p>
            <p><strong>6-7:</strong> Moderately favorable - induction possible</p>
            <p><strong>≥8:</strong> Favorable - good induction candidate</p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Clinical Note:</strong> A Bishop Score ≥8 is associated with a high likelihood 
            of successful vaginal delivery following induction. Scores ≤5 have higher rates of 
            cesarean delivery if induction is attempted without ripening.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BishopScoreCalculator;
