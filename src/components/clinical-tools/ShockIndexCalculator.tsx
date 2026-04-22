import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ShockIndexCalculator: React.FC = () => {
  const [heartRate, setHeartRate] = useState('');
  const [sbp, setSbp] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateShockIndex = () => {
    const hr = parseFloat(heartRate);
    const systolic = parseFloat(sbp);
    if (!hr || !systolic || systolic === 0) return null;
    return hr / systolic;
  };

  const getInterpretation = (si: number) => {
    if (si < 0.5) {
      return {
        category: 'Below Normal',
        color: 'bg-blue-100 border-blue-200 text-blue-800',
        badgeColor: 'bg-blue-500',
        interpretation: 'Unusually low - verify measurements',
        recommendations: [
          'Verify HR and BP measurements',
          'May indicate relative bradycardia',
          'Consider beta-blocker use or athletic conditioning'
        ]
      };
    } else if (si <= 0.7) {
      return {
        category: 'Normal',
        color: 'bg-green-100 border-green-200 text-green-800',
        badgeColor: 'bg-green-500',
        interpretation: 'Normal hemodynamic status',
        recommendations: [
          'Normal shock index',
          'No immediate hemodynamic concern',
          'Continue routine monitoring as indicated'
        ]
      };
    } else if (si <= 0.9) {
      return {
        category: 'Borderline Elevated',
        color: 'bg-yellow-100 border-yellow-200 text-yellow-800',
        badgeColor: 'bg-yellow-500',
        interpretation: 'Borderline - early shock may be present',
        recommendations: [
          'Close monitoring recommended',
          'Consider occult hemorrhage or early shock',
          'Repeat vital signs frequently',
          'Assess for sources of bleeding or dehydration'
        ]
      };
    } else if (si <= 1.3) {
      return {
        category: 'Elevated',
        color: 'bg-orange-100 border-orange-200 text-orange-800',
        badgeColor: 'bg-orange-500',
        interpretation: 'Abnormal - likely hemodynamic compromise',
        recommendations: [
          'High suspicion for shock',
          'Initiate IV access and fluid resuscitation',
          'Identify and treat underlying cause',
          'Consider blood products if hemorrhagic',
          'Continuous monitoring'
        ]
      };
    } else {
      return {
        category: 'Severely Elevated',
        color: 'bg-red-100 border-red-200 text-red-800',
        badgeColor: 'bg-red-700',
        interpretation: 'Critical - severe hemodynamic instability',
        recommendations: [
          'Immediate intervention required',
          'Aggressive resuscitation',
          'Consider massive transfusion protocol if hemorrhage',
          'Vasopressor support may be needed',
          'ICU admission'
        ]
      };
    }
  };

  const shockIndex = calculateShockIndex();
  const interpretation = shockIndex ? getInterpretation(shockIndex) : null;

  const resetForm = () => {
    setHeartRate('');
    setSbp('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Shock Index (SI)
        </CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Sensitive indicator of occult shock in trauma and hemorrhage
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Shock Index = Heart Rate / Systolic BP</strong><br/>
            More sensitive than HR or BP alone for detecting early shock states.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hr">Heart Rate (bpm)</Label>
            <Input
              id="hr"
              type="number"
              placeholder="e.g., 100"
              value={heartRate}
              onChange={(e) => setHeartRate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sbp">Systolic Blood Pressure (mmHg)</Label>
            <Input
              id="sbp"
              type="number"
              placeholder="e.g., 90"
              value={sbp}
              onChange={(e) => setSbp(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={() => setShowResults(true)} 
            disabled={!heartRate || !sbp}
            className="flex-1"
          >
            Calculate Shock Index
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && shockIndex && interpretation && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-4xl font-bold">{shockIndex.toFixed(2)}</p>
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
                <p className="font-semibold">Reference Ranges:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• <strong>Normal:</strong> 0.5-0.7</li>
                  <li>• <strong>Borderline:</strong> 0.7-0.9</li>
                  <li>• <strong>Abnormal:</strong> 0.9-1.3 (likely shock)</li>
                  <li>• <strong>Critical:</strong> &gt;1.3 (severe shock)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes:</p>
                <ul className="mt-1 space-y-0.5">
                  <li>• May detect hemorrhage before BP drops significantly</li>
                  <li>• Especially useful in trauma, GI bleeding, ectopic pregnancy</li>
                  <li>• Less reliable in elderly, beta-blocker use, or pregnancy</li>
                  <li>• Use pediatric age-adjusted SI (SIPA) for children</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShockIndexCalculator;
