import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Wind, RotateCcw, Info, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface PERCCriterion {
  id: string;
  label: string;
  description: string;
}

const percCriteria: PERCCriterion[] = [
  { id: 'age', label: 'Age ≥50 years', description: 'Patient is 50 years or older' },
  { id: 'hr', label: 'Heart rate ≥100 bpm', description: 'Pulse rate 100 or greater' },
  { id: 'spo2', label: 'O₂ saturation <95%', description: 'SpO2 less than 95% on room air' },
  { id: 'leg', label: 'Unilateral leg swelling', description: 'Asymmetric lower extremity edema' },
  { id: 'hemoptysis', label: 'Hemoptysis', description: 'Coughing up blood' },
  { id: 'surgery', label: 'Recent surgery or trauma', description: 'Surgery or trauma within 4 weeks requiring general anesthesia' },
  { id: 'vte', label: 'Prior PE or DVT', description: 'History of venous thromboembolism' },
  { id: 'estrogen', label: 'Estrogen use', description: 'Oral contraceptives, HRT, or other exogenous estrogen' }
];

const PERCRuleCalculator = () => {
  const [selectedCriteria, setSelectedCriteria] = useState<Set<string>>(new Set());
  const [acknowledged, setAcknowledged] = useState(false);

  const handleCriterionChange = (criterionId: string, checked: boolean) => {
    const newSelected = new Set(selectedCriteria);
    if (checked) {
      newSelected.add(criterionId);
    } else {
      newSelected.delete(criterionId);
    }
    setSelectedCriteria(newSelected);
  };

  const positiveCount = selectedCriteria.size;
  const isPERCNegative = positiveCount === 0;

  const getResult = () => {
    if (!acknowledged) return null;

    if (isPERCNegative) {
      return {
        status: 'PERC Negative',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-50 dark:bg-green-950/30',
        borderColor: 'border-green-200 dark:border-green-800',
        icon: CheckCircle2,
        recommendation: 'PE can be ruled out without further testing in patients with low clinical pretest probability (≤15%)',
        note: 'No D-dimer or imaging required if clinical gestalt supports low probability'
      };
    } else {
      return {
        status: 'PERC Positive',
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-50 dark:bg-red-950/30',
        borderColor: 'border-red-200 dark:border-red-800',
        icon: XCircle,
        recommendation: 'Cannot rule out PE with PERC alone',
        note: `${positiveCount} criterion/criteria met. Proceed with D-dimer testing ± CT pulmonary angiography based on clinical probability assessment.`
      };
    }
  };

  const result = getResult();

  const resetForm = () => {
    setSelectedCriteria(new Set());
    setAcknowledged(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Wind className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">PERC Rule for Pulmonary Embolism</CardTitle>
            <CardDescription className="text-blue-100">
              Pulmonary Embolism Rule-out Criteria
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <p className="font-semibold">Important Prerequisite:</p>
              <p>PERC should ONLY be applied when clinical pretest probability is LOW (≤15%). 
              If gestalt suggests moderate or high probability, proceed directly to D-dimer or imaging.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <Checkbox
            id="acknowledged"
            checked={acknowledged}
            onCheckedChange={(checked) => setAcknowledged(checked === true)}
          />
          <Label htmlFor="acknowledged" className="text-sm cursor-pointer">
            I confirm clinical pretest probability is LOW (≤15%) based on gestalt or validated scoring
          </Label>
        </div>

        <div className="space-y-3">
          <Label className="text-base font-semibold">PERC Criteria (check all that apply)</Label>
          <div className="grid gap-3">
            {percCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedCriteria.has(criterion.id)
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800'
                    : 'hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  id={criterion.id}
                  checked={selectedCriteria.has(criterion.id)}
                  onCheckedChange={(checked) => handleCriterionChange(criterion.id, checked === true)}
                  disabled={!acknowledged}
                />
                <div className="flex-1">
                  <Label htmlFor={criterion.id} className="cursor-pointer font-medium">
                    {criterion.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${result.bgColor} ${result.borderColor}`}>
            <div className="flex items-center gap-3 mb-4">
              <result.icon className={`h-8 w-8 ${result.color}`} />
              <div>
                <h3 className={`text-xl font-bold ${result.color}`}>{result.status}</h3>
                <p className="text-sm text-muted-foreground">{positiveCount}/8 criteria positive</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold">Recommendation</p>
                <p className="text-sm">{result.recommendation}</p>
              </div>
              <p className="text-sm text-muted-foreground">{result.note}</p>
            </div>
          </div>
        )}

        {!acknowledged && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border text-center">
            <p className="text-sm text-muted-foreground">
              Please confirm low pretest probability to enable PERC assessment
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
          <p><strong>Reference:</strong> Kline JA et al. Clinical criteria to prevent unnecessary diagnostic testing in emergency department patients with suspected pulmonary embolism. J Thromb Haemost. 2004;2(8):1247-1255.</p>
          <p><strong>Validation:</strong> PERC has a sensitivity of ~97% and NPV of ~99% in low-risk populations.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PERCRuleCalculator;
