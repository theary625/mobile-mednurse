import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Info, AlertTriangle, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ShorrScoreCalculator: React.FC = () => {
  const [criteria, setCriteria] = useState<Record<string, string>>({
    recentHospitalization: '',
    nursingHome: '',
    hemodialysis: '',
    icu: '',
    priorMRSA: '',
  });
  const [showResults, setShowResults] = useState(false);

  const criteriaItems = [
    { key: 'recentHospitalization', label: 'Recent hospitalization (within 90 days)', points: 4 },
    { key: 'nursingHome', label: 'Nursing home or long-term care residence', points: 3 },
    { key: 'hemodialysis', label: 'Chronic hemodialysis', points: 2 },
    { key: 'icu', label: 'ICU admission', points: 2 },
    { key: 'priorMRSA', label: 'Prior MRSA infection or colonization', points: 2 },
  ];

  const calculateScore = () => {
    return criteriaItems.reduce((sum, item) => {
      return sum + (criteria[item.key] === 'yes' ? item.points : 0);
    }, 0);
  };

  const getInterpretation = (score: number) => {
    if (score < 4) {
      return {
        risk: 'Low Risk for MRSA',
        probability: '<10%',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        recommendations: [
          'MRSA coverage likely unnecessary for empiric therapy',
          'Standard CAP or HAP antibiotic regimen',
          'Consider local epidemiology and resistance patterns',
          'Escalate if patient deteriorates or culture positive for MRSA'
        ]
      };
    } else if (score < 7) {
      return {
        risk: 'Moderate Risk for MRSA',
        probability: '10-30%',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        recommendations: [
          'Consider MRSA coverage in empiric therapy',
          'Obtain nasal MRSA PCR if available',
          'Sputum culture and sensitivities',
          'Clinical judgment based on severity and risk factors'
        ]
      };
    } else {
      return {
        risk: 'High Risk for MRSA',
        probability: '>30%',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-600',
        recommendations: [
          'Strong consideration for empiric MRSA coverage',
          'Vancomycin or linezolid for MRSA pneumonia',
          'Obtain cultures before antibiotics if possible',
          'De-escalate based on culture results',
          'Consider infectious disease consultation'
        ]
      };
    }
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);
  const allAnswered = Object.values(criteria).every(v => v !== '');

  const resetForm = () => {
    setCriteria({
      recentHospitalization: '',
      nursingHome: '',
      hemodialysis: '',
      icu: '',
      priorMRSA: '',
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Stethoscope className="h-5 w-5" />
          Shorr Score for MRSA Pneumonia
        </CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Identifies pneumonia patients at risk for MRSA
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Helps identify patients with healthcare-associated pneumonia (HCAP) who are at higher risk for MRSA, guiding empiric antibiotic selection.
          </p>
        </div>

        <div className="space-y-4">
          {criteriaItems.map((item) => (
            <div key={item.key} className="p-4 border rounded-lg">
              <Label className="text-sm font-medium flex justify-between">
                <span>{item.label}</span>
                <span className="text-muted-foreground">+{item.points} pts</span>
              </Label>
              <RadioGroup
                value={criteria[item.key]}
                onValueChange={(value) => setCriteria(prev => ({ ...prev, [item.key]: value }))}
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id={`${item.key}-no`} />
                  <Label htmlFor={`${item.key}-no`} className="font-normal">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id={`${item.key}-yes`} />
                  <Label htmlFor={`${item.key}-yes`} className="font-normal">Yes</Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!allAnswered}
            className="flex-1"
          >
            Calculate Risk
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && allAnswered && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{score}</p>
                <p className="text-sm">out of 13 points</p>
                <Badge className={interpretation.badgeColor}>{interpretation.risk}</Badge>
                <p className="text-sm font-medium">
                  MRSA probability: {interpretation.probability}
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Clinical Recommendations:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {interpretation.recommendations.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Score Interpretation:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• <strong>0-3 points:</strong> Low risk ({`<`}10% MRSA probability)</li>
                  <li>• <strong>4-6 points:</strong> Moderate risk (10-30% probability)</li>
                  <li>• <strong>≥7 points:</strong> High risk ({`>`}30% probability)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Originally developed for healthcare-associated pneumonia (HCAP)</li>
                  <li>• Nasal MRSA PCR has high negative predictive value</li>
                  <li>• Local MRSA prevalence may affect applicability</li>
                  <li>• Always consider patient severity and clinical trajectory</li>
                  <li>• De-escalation based on culture data is recommended</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Shorr AF, et al. Prediction of infection due to antibiotic-resistant bacteria by select risk factors for healthcare-associated pneumonia. Arch Intern Med. 2008.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShorrScoreCalculator;
