import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, AlertTriangle, Baby } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SIPACalculator: React.FC = () => {
  const [heartRate, setHeartRate] = useState('');
  const [sbp, setSbp] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [showResults, setShowResults] = useState(false);

  const ageGroups = [
    { value: '4-6', label: '4-6 years', threshold: 1.22 },
    { value: '7-12', label: '7-12 years', threshold: 1.0 },
    { value: '13-16', label: '13-16 years', threshold: 0.9 },
  ];

  const calculateSIPA = () => {
    const hr = parseFloat(heartRate);
    const systolic = parseFloat(sbp);
    if (!hr || !systolic || systolic === 0) return null;
    return hr / systolic;
  };

  const getThreshold = () => {
    const group = ageGroups.find(g => g.value === ageGroup);
    return group?.threshold || 1.0;
  };

  const getInterpretation = (sipa: number) => {
    const threshold = getThreshold();
    const isElevated = sipa >= threshold;

    if (!isElevated) {
      return {
        category: 'Normal for Age',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        interpretation: `SIPA below age-adjusted threshold (${threshold})`,
        recommendations: [
          'Low risk for significant injury',
          'Continue standard trauma evaluation',
          'Serial monitoring as clinically indicated',
          'Reassess if clinical status changes'
        ]
      };
    } else {
      return {
        category: 'Elevated for Age',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-500',
        interpretation: `SIPA above age-adjusted threshold (${threshold})`,
        recommendations: [
          'Increased risk for significant injury and mortality',
          'Consider early blood product administration',
          'Aggressive resuscitation',
          'Expedite imaging and surgical consultation',
          'ICU admission likely needed'
        ]
      };
    }
  };

  const sipa = calculateSIPA();
  const interpretation = sipa && ageGroup ? getInterpretation(sipa) : null;

  const resetForm = () => {
    setHeartRate('');
    setSbp('');
    setAgeGroup('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" />
          SIPA (Pediatric Age-Adjusted Shock Index)
        </CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          Predicts mortality in children with blunt trauma
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Age-adjusted shock index accounts for higher normal heart rates and lower blood pressures in children.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Age Group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup}>
              <SelectTrigger>
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label} (threshold: {group.threshold})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hr">Heart Rate (bpm)</Label>
              <Input
                id="hr"
                type="number"
                placeholder="e.g., 120"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sbp">Systolic Blood Pressure (mmHg)</Label>
              <Input
                id="sbp"
                type="number"
                placeholder="e.g., 100"
                value={sbp}
                onChange={(e) => setSbp(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!heartRate || !sbp || !ageGroup}
            className="flex-1"
          >
            Calculate SIPA
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && sipa && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{sipa.toFixed(2)}</p>
                <Badge className={interpretation.badgeColor}>{interpretation.category}</Badge>
                <p className="text-sm font-medium">{interpretation.interpretation}</p>
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
                <p className="font-semibold">Age-Specific Thresholds:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• <strong>4-6 years:</strong> ≥1.22 (elevated)</li>
                  <li>• <strong>7-12 years:</strong> ≥1.0 (elevated)</li>
                  <li>• <strong>13-16 years:</strong> ≥0.9 (elevated)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• Validated for blunt trauma in children ages 4-16</li>
                  <li>• Better predictor than adult shock index in pediatrics</li>
                  <li>• Associated with need for blood transfusion and mortality</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Reference:</strong> Acker SN, et al. Pediatric-specific shock index accurately identifies injured children requiring intervention. J Pediatr Surg. 2015.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SIPACalculator;
