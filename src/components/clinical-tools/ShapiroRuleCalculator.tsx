import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Droplet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ShapiroRuleCalculator: React.FC = () => {
  const [majorCriteria, setMajorCriteria] = useState({
    suspectedEndocarditis: false,
    temperature: false,
    indwellingCatheter: false,
  });
  const [minorCriteria, setMinorCriteria] = useState({
    temperature36: false,
    age65: false,
    chills: false,
    vomiting: false,
    sbp90: false,
    wbc18: false,
    bands5: false,
    platelets150: false,
    creatinine2: false,
  });
  const [showResults, setShowResults] = useState(false);

  const majorItems = [
    { key: 'suspectedEndocarditis', label: 'Suspected endocarditis' },
    { key: 'temperature', label: 'Temperature ≥39.4°C (103°F)' },
    { key: 'indwellingCatheter', label: 'Indwelling vascular catheter' },
  ];

  const minorItems = [
    { key: 'temperature36', label: 'Temperature 38.3-39.3°C (101-102.9°F)' },
    { key: 'age65', label: 'Age ≥65 years' },
    { key: 'chills', label: 'Chills' },
    { key: 'vomiting', label: 'Vomiting' },
    { key: 'sbp90', label: 'Systolic BP <90 mmHg' },
    { key: 'wbc18', label: 'WBC >18,000/mm³' },
    { key: 'bands5', label: 'Bands >5%' },
    { key: 'platelets150', label: 'Platelets <150,000/mm³' },
    { key: 'creatinine2', label: 'Creatinine >2.0 mg/dL' },
  ];

  const calculateResult = () => {
    const majorCount = Object.values(majorCriteria).filter(Boolean).length;
    const minorCount = Object.values(minorCriteria).filter(Boolean).length;
    
    // Low risk: No major AND <2 minor criteria
    const isLowRisk = majorCount === 0 && minorCount < 2;
    return { majorCount, minorCount, isLowRisk };
  };

  const { majorCount, minorCount, isLowRisk } = calculateResult();

  const getInterpretation = () => {
    if (isLowRisk) {
      return {
        result: 'Low Risk',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        recommendation: 'Blood cultures NOT indicated',
        details: [
          'Very low likelihood of bacteremia (~0.6%)',
          'Blood cultures unlikely to be positive',
          'Clinical judgment should still apply',
          'Consider cultures if clinical suspicion remains high'
        ]
      };
    }
    return {
      result: 'Not Low Risk',
      color: 'bg-red-100 border-red-200 text-red-800',
      badgeColor: 'bg-red-500',
      recommendation: 'Blood cultures ARE indicated',
      details: [
        'Patient does not qualify as low risk',
        'Obtain blood cultures before antibiotics if possible',
        'Consider 2 sets from different sites',
        'Start empiric antibiotics as clinically indicated'
      ]
    };
  };

  const interpretation = getInterpretation();

  const resetForm = () => {
    setMajorCriteria({
      suspectedEndocarditis: false,
      temperature: false,
      indwellingCatheter: false,
    });
    setMinorCriteria({
      temperature36: false,
      age65: false,
      chills: false,
      vomiting: false,
      sbp90: false,
      wbc18: false,
      bands5: false,
      platelets150: false,
      creatinine2: false,
    });
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Droplet className="h-5 w-5" />
          Shapiro Rule
        </CardTitle>
        <p className="text-orange-100 text-sm mt-1">
          Blood Culture Decision Rule for ED Patients
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Identifies ED patients at <strong>low risk</strong> for bacteremia who may not need blood cultures. 
            Low risk = No major criteria AND &lt;2 minor criteria.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              Major Criteria <Badge variant="destructive">Any = Not Low Risk</Badge>
            </h3>
            <div className="space-y-2">
              {majorItems.map((item) => (
                <div key={item.key} className="flex items-center space-x-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <Checkbox
                    id={`major-${item.key}`}
                    checked={majorCriteria[item.key as keyof typeof majorCriteria]}
                    onCheckedChange={(checked) =>
                      setMajorCriteria(prev => ({ ...prev, [item.key]: checked === true }))
                    }
                  />
                  <Label htmlFor={`major-${item.key}`} className="text-sm cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
              Minor Criteria <Badge variant="secondary">≥2 = Not Low Risk</Badge>
            </h3>
            <div className="space-y-2">
              {minorItems.map((item) => (
                <div key={item.key} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Checkbox
                    id={`minor-${item.key}`}
                    checked={minorCriteria[item.key as keyof typeof minorCriteria]}
                    onCheckedChange={(checked) =>
                      setMinorCriteria(prev => ({ ...prev, [item.key]: checked === true }))
                    }
                  />
                  <Label htmlFor={`minor-${item.key}`} className="text-sm cursor-pointer">
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">
            Evaluate Shapiro Rule
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-sm">Major: {majorCount}/3 | Minor: {minorCount}/9</p>
                <Badge className={interpretation.badgeColor}>{interpretation.result}</Badge>
                <p className="text-lg font-semibold">{interpretation.recommendation}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">Clinical Guidance:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                {interpretation.details.map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Validated in adult ED patients with suspected infection</li>
                  <li>• NPV ~97% for low-risk group</li>
                  <li>• Does not apply to immunocompromised patients</li>
                  <li>• Clinical judgment should always prevail</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Shapiro NI, et al. A prospective, multicenter derivation of a biomarker panel to assess risk of organ dysfunction, shock, and death in ED patients with suspected sepsis. Crit Care Med. 2009.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShapiroRuleCalculator;
