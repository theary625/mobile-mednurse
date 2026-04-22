import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, AlertTriangle } from 'lucide-react';

interface RiskFactor {
  id: string;
  label: string;
  category: string;
  points: number;
}

const riskFactors: RiskFactor[] = [
  // High risk (2 points)
  { id: 'prior-pph', label: 'Prior postpartum hemorrhage', category: 'high', points: 2 },
  { id: 'placenta-previa', label: 'Placenta previa', category: 'high', points: 2 },
  { id: 'placenta-accreta', label: 'Suspected placenta accreta spectrum', category: 'high', points: 2 },
  { id: 'active-bleeding', label: 'Active bleeding on admission', category: 'high', points: 2 },
  { id: 'coagulopathy', label: 'Known coagulopathy or on anticoagulants', category: 'high', points: 2 },
  { id: 'platelets-low', label: 'Platelets <100,000', category: 'high', points: 2 },
  
  // Medium risk (1 point)
  { id: 'prior-uterine', label: 'Prior uterine surgery (cesarean, myomectomy)', category: 'medium', points: 1 },
  { id: 'multiple-gestation', label: 'Multiple gestation', category: 'medium', points: 1 },
  { id: 'grand-multiparity', label: 'Grand multiparity (≥5 deliveries)', category: 'medium', points: 1 },
  { id: 'chorioamnionitis', label: 'Chorioamnionitis', category: 'medium', points: 1 },
  { id: 'fibroids', label: 'Large uterine fibroids', category: 'medium', points: 1 },
  { id: 'polyhydramnios', label: 'Polyhydramnios', category: 'medium', points: 1 },
  { id: 'macrosomia', label: 'Fetal macrosomia (EFW >4000g)', category: 'medium', points: 1 },
  { id: 'prolonged-labor', label: 'Prolonged labor (>12 hours)', category: 'medium', points: 1 },
  { id: 'precipitous-labor', label: 'Precipitous labor', category: 'medium', points: 1 },
  { id: 'augmented-labor', label: 'Augmented labor (oxytocin)', category: 'medium', points: 1 },
  { id: 'magnesium', label: 'Magnesium sulfate administration', category: 'medium', points: 1 },
  { id: 'operative-delivery', label: 'Operative vaginal delivery planned', category: 'medium', points: 1 },
  { id: 'cesarean', label: 'Cesarean delivery', category: 'medium', points: 1 },
  { id: 'general-anesthesia', label: 'General anesthesia', category: 'medium', points: 1 },
  { id: 'anemia', label: 'Anemia (Hgb <10 g/dL)', category: 'medium', points: 1 },
  { id: 'obesity', label: 'BMI ≥35', category: 'medium', points: 1 },
];

const PPHRiskCalculator: React.FC = () => {
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleFactor = (id: string) => {
    setSelectedFactors(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const calculateRisk = () => {
    const totalPoints = selectedFactors.reduce((sum, id) => {
      const factor = riskFactors.find(f => f.id === id);
      return sum + (factor?.points || 0);
    }, 0);

    const highRiskCount = selectedFactors.filter(id => 
      riskFactors.find(f => f.id === id)?.category === 'high'
    ).length;

    let riskLevel = '';
    let interpretation = '';
    let recommendations: string[] = [];
    let severity = 'low';

    // Any high-risk factor = high risk, OR ≥2 medium risk factors
    if (highRiskCount > 0 || totalPoints >= 3) {
      riskLevel = 'HIGH RISK';
      interpretation = 'Significant risk of postpartum hemorrhage';
      recommendations = [
        'Type and screen (consider type and crossmatch)',
        'Ensure large-bore IV access (2 sites)',
        'Active management of third stage',
        'Notify blood bank and anesthesia',
        'Have uterotonics readily available',
        'Consider intrauterine balloon on standby',
        'Ensure PPH cart/kit immediately accessible'
      ];
      severity = 'high';
    } else if (totalPoints >= 1) {
      riskLevel = 'MEDIUM RISK';
      interpretation = 'Moderate risk of postpartum hemorrhage';
      recommendations = [
        'Type and screen',
        'Ensure IV access',
        'Active management of third stage',
        'Have uterotonics available',
        'Monitor closely after delivery'
      ];
      severity = 'medium';
    } else {
      riskLevel = 'LOW RISK';
      interpretation = 'Standard PPH risk';
      recommendations = [
        'Active management of third stage recommended',
        'Standard monitoring',
        'Uterotonics available per protocol'
      ];
      severity = 'low';
    }

    return { totalPoints, riskLevel, interpretation, recommendations, severity, highRiskCount };
  };

  const result = showResults ? calculateRisk() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'medium':
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

  const highRiskFactors = riskFactors.filter(f => f.category === 'high');
  const mediumRiskFactors = riskFactors.filter(f => f.category === 'medium');

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Postpartum Hemorrhage Risk Assessment</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Risk Stratification for PPH Prevention
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* High Risk Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <Label className="text-base font-semibold">High Risk Factors (2 points each)</Label>
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

        {/* Medium Risk Factors */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full" />
            <Label className="text-base font-semibold">Medium Risk Factors (1 point each)</Label>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            {mediumRiskFactors.map(factor => (
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
            Assess PPH Risk
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {result && (
          <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold">{result.riskLevel}</p>
              <p className="text-sm mt-1">{result.interpretation}</p>
              <p className="text-xs mt-2 opacity-80">
                {selectedFactors.length} risk factor(s) identified | Score: {result.totalPoints}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-current/20">
              <p className="font-semibold text-sm mb-2">Recommended Actions:</p>
              <ul className="text-sm list-disc list-inside space-y-1">
                {result.recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">PPH Definition (ACOG):</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>Vaginal delivery: Blood loss ≥500 mL or ≥1000 mL with signs of hypovolemia</li>
            <li>Cesarean delivery: Blood loss ≥1000 mL</li>
            <li>Leading cause of maternal mortality worldwide</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">4 T's of PPH Etiology:</p>
            <ul className="mt-1 grid grid-cols-2 gap-x-4">
              <li><strong>Tone:</strong> Uterine atony (70-80%)</li>
              <li><strong>Trauma:</strong> Lacerations, hematoma</li>
              <li><strong>Tissue:</strong> Retained placenta</li>
              <li><strong>Thrombin:</strong> Coagulopathy</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Important:</strong> Risk assessment should be performed on admission, during labor, 
            and postpartum. Risk can change throughout the delivery process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PPHRiskCalculator;
