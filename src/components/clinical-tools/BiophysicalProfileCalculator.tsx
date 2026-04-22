import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle } from 'lucide-react';

const BiophysicalProfileCalculator: React.FC = () => {
  const [nst, setNst] = useState<string>('');
  const [fetalBreathing, setFetalBreathing] = useState<string>('');
  const [fetalMovement, setFetalMovement] = useState<string>('');
  const [fetalTone, setFetalTone] = useState<string>('');
  const [amnioticFluid, setAmnioticFluid] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const calculateScore = () => {
    if (!nst || !fetalBreathing || !fetalMovement || !fetalTone || !amnioticFluid) return null;

    const score = parseInt(nst) + parseInt(fetalBreathing) + parseInt(fetalMovement) + 
                  parseInt(fetalTone) + parseInt(amnioticFluid);

    let interpretation = '';
    let management = '';
    let severity = 'normal';
    let riskOfAsphyxia = '';

    if (score === 10) {
      interpretation = 'Normal (non-asphyxiated fetus)';
      management = 'No intervention required. Repeat testing per protocol (usually weekly).';
      riskOfAsphyxia = '<1% risk of fetal asphyxia within 1 week';
      severity = 'normal';
    } else if (score === 8) {
      if (parseInt(amnioticFluid) === 0) {
        interpretation = 'Chronic compromise possible';
        management = 'If ≥37 weeks and favorable cervix, consider delivery. Otherwise, repeat BPP within 24 hours.';
        riskOfAsphyxia = 'Variable risk depending on AFI';
        severity = 'warning';
      } else {
        interpretation = 'Normal (non-asphyxiated fetus)';
        management = 'No intervention required if AFI normal. Repeat per protocol.';
        riskOfAsphyxia = '<1% risk of fetal asphyxia within 1 week';
        severity = 'normal';
      }
    } else if (score === 6) {
      interpretation = 'Equivocal - possible fetal compromise';
      management = 'If ≥37 weeks, consider delivery. If <37 weeks, repeat BPP within 24 hours. If repeat ≤6, deliver.';
      riskOfAsphyxia = 'Variable risk';
      severity = 'warning';
    } else if (score === 4) {
      interpretation = 'Abnormal - suspected fetal asphyxia';
      management = 'If ≥32 weeks, strongly consider delivery. If <32 weeks, repeat same day; if ≤6, deliver.';
      riskOfAsphyxia = 'Significant risk of perinatal morbidity';
      severity = 'danger';
    } else if (score <= 2) {
      interpretation = 'Abnormal - strongly suspected fetal asphyxia';
      management = 'Immediate delivery recommended regardless of gestational age.';
      riskOfAsphyxia = 'High probability of fetal acidemia';
      severity = 'critical';
    }

    return { score, interpretation, management, severity, riskOfAsphyxia };
  };

  const result = showResults ? calculateScore() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'warning':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'danger':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'critical':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const isValid = nst && fetalBreathing && fetalMovement && fetalTone && amnioticFluid;

  const resetForm = () => {
    setNst('');
    setFetalBreathing('');
    setFetalMovement('');
    setFetalTone('');
    setAmnioticFluid('');
    setShowResults(false);
  };

  const criteriaOptions = [
    { value: '2', label: 'Normal (2)' },
    { value: '0', label: 'Abnormal (0)' },
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Biophysical Profile (BPP)</CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Fetal Wellbeing Assessment (0-10)
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* NST */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Non-Stress Test (NST)</Label>
          <p className="text-sm text-muted-foreground">≥2 accelerations of ≥15 bpm for ≥15 sec in 20 min</p>
          <RadioGroup value={nst} onValueChange={setNst} className="flex gap-6">
            {criteriaOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`nst-${opt.value}`} />
                <Label htmlFor={`nst-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Fetal Breathing */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Fetal Breathing Movements</Label>
          <p className="text-sm text-muted-foreground">≥1 episode of ≥30 sec sustained breathing in 30 min</p>
          <RadioGroup value={fetalBreathing} onValueChange={setFetalBreathing} className="flex gap-6">
            {criteriaOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`breathing-${opt.value}`} />
                <Label htmlFor={`breathing-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Fetal Movement */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Fetal Movement</Label>
          <p className="text-sm text-muted-foreground">≥3 discrete body or limb movements in 30 min</p>
          <RadioGroup value={fetalMovement} onValueChange={setFetalMovement} className="flex gap-6">
            {criteriaOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`movement-${opt.value}`} />
                <Label htmlFor={`movement-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Fetal Tone */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Fetal Tone</Label>
          <p className="text-sm text-muted-foreground">≥1 episode of extension with return to flexion (limb or trunk)</p>
          <RadioGroup value={fetalTone} onValueChange={setFetalTone} className="flex gap-6">
            {criteriaOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`tone-${opt.value}`} />
                <Label htmlFor={`tone-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Amniotic Fluid */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Amniotic Fluid Volume</Label>
          <p className="text-sm text-muted-foreground">Single deepest pocket ≥2 cm OR AFI ≥5 cm</p>
          <RadioGroup value={amnioticFluid} onValueChange={setAmnioticFluid} className="flex gap-6">
            {criteriaOptions.map(opt => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`fluid-${opt.value}`} />
                <Label htmlFor={`fluid-${opt.value}`} className="cursor-pointer">{opt.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate BPP Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold">{result.score}/10</p>
              <p className="text-sm font-semibold mt-1">Biophysical Profile Score</p>
            </div>
            <div className="space-y-3">
              <p className="font-semibold">{result.interpretation}</p>
              <p className="text-sm">{result.management}</p>
              <p className="text-xs opacity-80">{result.riskOfAsphyxia}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Score Interpretation:</p>
          <div className="text-sm text-muted-foreground grid gap-1">
            <p><strong>10/10:</strong> Normal, reassuring</p>
            <p><strong>8/10 (normal AFI):</strong> Normal, reassuring</p>
            <p><strong>8/10 (↓AFI):</strong> Chronic compromise possible</p>
            <p><strong>6/10:</strong> Equivocal - repeat or deliver based on GA</p>
            <p><strong>4/10:</strong> Abnormal - consider delivery</p>
            <p><strong>0-2/10:</strong> Abnormal - immediate delivery indicated</p>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> BPP is most useful for high-risk pregnancies. Clinical context, 
            gestational age, and maternal condition must guide management decisions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BiophysicalProfileCalculator;
