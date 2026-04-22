import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, AlertTriangle } from 'lucide-react';

interface RiskFactor {
  id: string;
  label: string;
  category: 'high' | 'moderate';
  description?: string;
}

const highRiskFactors: RiskFactor[] = [
  { id: 'prev-preeclampsia', label: 'Previous preeclampsia', category: 'high' },
  { id: 'multifetal', label: 'Multifetal gestation', category: 'high' },
  { id: 'chronic-htn', label: 'Chronic hypertension', category: 'high' },
  { id: 'diabetes-t1t2', label: 'Type 1 or Type 2 diabetes', category: 'high' },
  { id: 'renal-disease', label: 'Renal disease', category: 'high' },
  { id: 'autoimmune', label: 'Autoimmune disease (SLE, APS)', category: 'high' },
];

const moderateRiskFactors: RiskFactor[] = [
  { id: 'nulliparity', label: 'Nulliparity', category: 'moderate' },
  { id: 'obesity', label: 'Obesity (BMI >30 kg/m²)', category: 'moderate' },
  { id: 'family-hx', label: 'Family history of preeclampsia (mother, sister)', category: 'moderate' },
  { id: 'age-35', label: 'Maternal age ≥35 years', category: 'moderate' },
  { id: 'low-ses', label: 'Low socioeconomic status', category: 'moderate' },
  { id: 'african-american', label: 'African American race', category: 'moderate' },
  { id: 'prev-sga', label: 'Previous SGA infant or adverse pregnancy outcome', category: 'moderate' },
  { id: 'interval', label: 'Pregnancy interval >10 years', category: 'moderate' },
  { id: 'ivf', label: 'In vitro fertilization (IVF)', category: 'moderate' },
];

const PreeclampsiaRiskCalculator: React.FC = () => {
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleFactor = (id: string) => {
    setSelectedFactors(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const calculateRisk = () => {
    const highRiskCount = selectedFactors.filter(id =>
      highRiskFactors.find(f => f.id === id)
    ).length;

    const moderateRiskCount = selectedFactors.filter(id =>
      moderateRiskFactors.find(f => f.id === id)
    ).length;

    // ACOG/USPSTF criteria: 1 high-risk OR ≥2 moderate-risk factors
    const aspirinIndicated = highRiskCount >= 1 || moderateRiskCount >= 2;

    let riskLevel = '';
    let interpretation = '';
    let recommendation = '';
    let severity = 'low';

    if (highRiskCount >= 1) {
      riskLevel = 'HIGH RISK';
      interpretation = 'One or more high-risk factors present';
      recommendation = 'Low-dose aspirin (81mg daily) recommended starting at 12-16 weeks gestation, continuing until delivery.';
      severity = 'high';
    } else if (moderateRiskCount >= 2) {
      riskLevel = 'ELEVATED RISK';
      interpretation = 'Two or more moderate-risk factors present';
      recommendation = 'Low-dose aspirin (81mg daily) recommended starting at 12-16 weeks gestation, continuing until delivery.';
      severity = 'moderate';
    } else if (moderateRiskCount === 1) {
      riskLevel = 'LOW-MODERATE RISK';
      interpretation = 'Single moderate-risk factor present';
      recommendation = 'Aspirin prophylaxis not routinely recommended. Consider clinical judgment and shared decision-making.';
      severity = 'low-moderate';
    } else {
      riskLevel = 'LOW RISK';
      interpretation = 'No significant risk factors identified';
      recommendation = 'Routine prenatal care. Aspirin prophylaxis not indicated.';
      severity = 'low';
    }

    return {
      highRiskCount,
      moderateRiskCount,
      aspirinIndicated,
      riskLevel,
      interpretation,
      recommendation,
      severity
    };
  };

  const result = showResults ? calculateRisk() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'low-moderate':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'moderate':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const resetForm = () => {
    setSelectedFactors([]);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Preeclampsia Risk Assessment</CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          ACOG/USPSTF Criteria for Aspirin Prophylaxis
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* High Risk Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <Label className="text-base font-semibold">High-Risk Factors</Label>
            <span className="text-xs text-muted-foreground">(1 factor = aspirin indicated)</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {highRiskFactors.map(factor => (
              <div key={factor.id} className="flex items-center space-x-2 p-2 rounded hover:bg-red-50">
                <Checkbox
                  id={factor.id}
                  checked={selectedFactors.includes(factor.id)}
                  onCheckedChange={() => toggleFactor(factor.id)}
                />
                <Label htmlFor={factor.id} className="cursor-pointer text-sm">{factor.label}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Moderate Risk Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <Label className="text-base font-semibold">Moderate-Risk Factors</Label>
            <span className="text-xs text-muted-foreground">(≥2 factors = aspirin indicated)</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {moderateRiskFactors.map(factor => (
              <div key={factor.id} className="flex items-center space-x-2 p-2 rounded hover:bg-amber-50">
                <Checkbox
                  id={factor.id}
                  checked={selectedFactors.includes(factor.id)}
                  onCheckedChange={() => toggleFactor(factor.id)}
                />
                <Label htmlFor={factor.id} className="cursor-pointer text-sm">{factor.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Assess Risk
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{result.riskLevel}</p>
              <p className="text-sm mt-1">{result.interpretation}</p>
              <div className="flex justify-center gap-4 mt-3 text-xs">
                <span>High-risk: {result.highRiskCount}</span>
                <span>Moderate-risk: {result.moderateRiskCount}</span>
              </div>
            </div>

            <div className={`mt-4 p-4 rounded-lg ${result.aspirinIndicated ? 'bg-white/50' : 'bg-white/30'}`}>
              <p className="font-semibold text-sm mb-1">
                {result.aspirinIndicated ? '✓ Aspirin Prophylaxis Indicated' : '○ Aspirin Not Routinely Indicated'}
              </p>
              <p className="text-sm">{result.recommendation}</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Aspirin Prophylaxis (ACOG 2020):</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Dose:</strong> 81mg daily (low-dose aspirin)</li>
            <li><strong>Start:</strong> Between 12-16 weeks gestation</li>
            <li><strong>Continue:</strong> Until delivery</li>
            <li><strong>Benefit:</strong> ~17% reduction in preeclampsia risk</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Reference:</strong> Based on USPSTF 2021 and ACOG Practice Advisory (2020). 
            Low-dose aspirin is safe and effective for preeclampsia prevention in high-risk patients.
          </p>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> This tool is for prophylaxis decisions. It does not diagnose preeclampsia. 
            Monitor all patients for signs/symptoms: BP ≥140/90, proteinuria, headache, visual changes, RUQ pain.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreeclampsiaRiskCalculator;
