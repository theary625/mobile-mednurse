import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, AlertTriangle } from 'lucide-react';

const VBACCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [bmi, setBmi] = useState('');
  const [priorVaginalDelivery, setPriorVaginalDelivery] = useState(false);
  const [priorVBAC, setPriorVBAC] = useState(false);
  const [recurringIndication, setRecurringIndication] = useState(false);
  const [spontaneousLabor, setSpontaneousLabor] = useState<string>('');
  const [cervicalDilation, setCervicalDilation] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateVBACSuccess = () => {
    const ageVal = parseFloat(age);
    const bmiVal = parseFloat(bmi);
    const dilationVal = cervicalDilation ? parseFloat(cervicalDilation) : 0;

    if (isNaN(ageVal) || isNaN(bmiVal)) return null;

    // MFMU VBAC Calculator model (simplified approximation)
    // Base probability ~60-70%
    let probability = 65;

    // Age factor
    if (ageVal < 25) probability += 5;
    else if (ageVal >= 35 && ageVal < 40) probability -= 5;
    else if (ageVal >= 40) probability -= 10;

    // BMI factor
    if (bmiVal < 25) probability += 5;
    else if (bmiVal >= 30 && bmiVal < 35) probability -= 5;
    else if (bmiVal >= 35 && bmiVal < 40) probability -= 10;
    else if (bmiVal >= 40) probability -= 15;

    // Prior vaginal delivery (strongest positive predictor)
    if (priorVaginalDelivery) probability += 15;
    if (priorVBAC) probability += 10;

    // Recurring indication (e.g., CPD, failure to progress)
    if (recurringIndication) probability -= 10;

    // Spontaneous labor vs induction
    if (spontaneousLabor === 'spontaneous') probability += 5;
    else if (spontaneousLabor === 'induced') probability -= 10;

    // Cervical dilation at admission
    if (dilationVal >= 4) probability += 5;

    // Clamp between 10-95%
    probability = Math.max(10, Math.min(95, probability));

    let interpretation = '';
    let recommendation = '';
    let severity = 'normal';

    if (probability >= 70) {
      interpretation = 'Good candidate for TOLAC';
      recommendation = 'VBAC is a reasonable option with favorable success probability. Counsel patient on benefits and risks.';
      severity = 'favorable';
    } else if (probability >= 50) {
      interpretation = 'Moderate candidate for TOLAC';
      recommendation = 'Discuss both TOLAC and repeat cesarean. Success possible but ensure resources for emergency cesarean.';
      severity = 'moderate';
    } else {
      interpretation = 'Lower likelihood of VBAC success';
      recommendation = 'Carefully weigh risks and benefits. Repeat cesarean may be preferred; shared decision-making essential.';
      severity = 'low';
    }

    return { probability: Math.round(probability), interpretation, recommendation, severity };
  };

  const result = showResults ? calculateVBACSuccess() : null;

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

  const isValid = age && bmi;

  const resetForm = () => {
    setAge('');
    setBmi('');
    setPriorVaginalDelivery(false);
    setPriorVBAC(false);
    setRecurringIndication(false);
    setSpontaneousLabor('');
    setCervicalDilation('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">VBAC Success Calculator</CardTitle>
        <p className="text-teal-100 text-sm mt-1">
          Trial of Labor After Cesarean (TOLAC) Probability
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="age">Maternal Age (years) *</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 32"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bmi">BMI at Delivery (kg/m²) *</Label>
            <Input
              id="bmi"
              type="number"
              step="0.1"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              placeholder="e.g., 28.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dilation">Cervical Dilation at Admission (cm)</Label>
            <Input
              id="dilation"
              type="number"
              value={cervicalDilation}
              onChange={(e) => setCervicalDilation(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Labor Onset</Label>
          <RadioGroup value={spontaneousLabor} onValueChange={setSpontaneousLabor} className="flex gap-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="spontaneous" id="labor-spontaneous" />
              <Label htmlFor="labor-spontaneous" className="cursor-pointer">Spontaneous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="induced" id="labor-induced" />
              <Label htmlFor="labor-induced" className="cursor-pointer">Induced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unknown" id="labor-unknown" />
              <Label htmlFor="labor-unknown" className="cursor-pointer">Unknown/Pending</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">Obstetric History</Label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="prior-vaginal" 
                checked={priorVaginalDelivery}
                onCheckedChange={(checked) => setPriorVaginalDelivery(checked as boolean)}
              />
              <Label htmlFor="prior-vaginal" className="cursor-pointer">Prior vaginal delivery (any)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="prior-vbac" 
                checked={priorVBAC}
                onCheckedChange={(checked) => setPriorVBAC(checked as boolean)}
              />
              <Label htmlFor="prior-vbac" className="cursor-pointer">Prior successful VBAC</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={recurringIndication}
                onCheckedChange={(checked) => setRecurringIndication(checked as boolean)}
              />
              <Label htmlFor="recurring" className="cursor-pointer">Recurring indication for prior cesarean (CPD, FTP)</Label>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate VBAC Success Rate
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-5xl font-bold">{result.probability}%</p>
              <p className="text-sm font-semibold mt-1">Estimated VBAC Success Rate</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">{result.interpretation}</p>
              <p className="text-sm">{result.recommendation}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Key Predictors of VBAC Success:</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Prior vaginal delivery (strongest positive predictor)</li>
            <li>Spontaneous labor onset</li>
            <li>Non-recurring cesarean indication</li>
            <li>Younger maternal age</li>
            <li>Lower BMI</li>
            <li>Cervical dilation ≥4 cm at admission</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Reference:</strong> Based on MFMU Network VBAC prediction model. 
            Overall VBAC success rates are 60-80%. Uterine rupture risk with TOLAC is ~0.5-0.9%.
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Contraindications to TOLAC:</strong> Prior classical or T-incision, prior uterine rupture, 
            extensive uterine surgery, or facilities unable to perform emergency cesarean.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VBACCalculator;
