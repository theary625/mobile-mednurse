import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, AlertTriangle } from 'lucide-react';

const SickleCellExchangeCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [hct, setHct] = useState('');
  const [hbS, setHbS] = useState('');
  const [targetHbS, setTargetHbS] = useState('30');
  const [donorHct, setDonorHct] = useState('60');
  const [showResults, setShowResults] = useState(false);

  const calculateTBV = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!w || !h) return 0;
    // Nadler formula for blood volume (mL)
    // Male: 0.3669 × H³ + 0.03219 × W + 0.6041
    // Using average/simplified: ~70 mL/kg
    return w * 70;
  };

  const calculateExchangeVolume = () => {
    const tbv = calculateTBV();
    const patientHct = parseFloat(hct) / 100;
    const currentHbS = parseFloat(hbS) / 100;
    const target = parseFloat(targetHbS) / 100;
    const donorHctValue = parseFloat(donorHct) / 100;

    if (!tbv || !patientHct || isNaN(currentHbS) || isNaN(target)) return null;

    // RBC volume to exchange = TBV × Hct × ln(initial HbS / target HbS)
    const rbcVolumeNeeded = tbv * patientHct * Math.log(currentHbS / target);
    
    // Donor RBC units (assuming ~200mL RBC per unit at given Hct)
    const donorRBCVolume = rbcVolumeNeeded / donorHctValue;
    const unitsNeeded = Math.ceil(donorRBCVolume / 200);

    // Whole blood exchange volume
    const wholeBloodExchange = rbcVolumeNeeded / patientHct;

    return {
      rbcVolumeNeeded: Math.round(rbcVolumeNeeded),
      donorRBCVolume: Math.round(donorRBCVolume),
      unitsNeeded,
      wholeBloodExchange: Math.round(wholeBloodExchange),
      tbv: Math.round(tbv)
    };
  };

  const results = calculateExchangeVolume();

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setHct('');
    setHbS('');
    setTargetHbS('30');
    setDonorHct('60');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Sickle Cell RBC Exchange Volume</CardTitle>
        <p className="text-red-100 text-sm mt-1">
          Estimates donor RBC volume needed for exchange transfusion in sickle cell disease
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70"
            />
          </div>
          <div>
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 170"
            />
          </div>
          <div>
            <Label htmlFor="hct">Patient Hematocrit (%)</Label>
            <Input
              id="hct"
              type="number"
              value={hct}
              onChange={(e) => setHct(e.target.value)}
              placeholder="e.g., 25"
            />
          </div>
          <div>
            <Label htmlFor="hbS">Current HbS (%)</Label>
            <Input
              id="hbS"
              type="number"
              value={hbS}
              onChange={(e) => setHbS(e.target.value)}
              placeholder="e.g., 80"
            />
          </div>
          <div>
            <Label htmlFor="targetHbS">Target HbS (%)</Label>
            <Select value={targetHbS} onValueChange={setTargetHbS}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">≤30% (Acute stroke, surgery)</SelectItem>
                <SelectItem value="50">≤50% (ACS, chronic exchange)</SelectItem>
                <SelectItem value="20">≤20% (Complex surgery)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="donorHct">Donor Unit Hct (%)</Label>
            <Input
              id="donorHct"
              type="number"
              value={donorHct}
              onChange={(e) => setDonorHct(e.target.value)}
              placeholder="e.g., 60"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={() => setShowResults(true)} className="flex-1">Calculate</Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && results && (
          <div className="p-6 rounded-lg border bg-red-50 border-red-200 text-red-800">
            <div className="grid sm:grid-cols-2 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">{results.unitsNeeded}</p>
                <p className="text-sm font-semibold">pRBC Units Needed</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{results.donorRBCVolume} mL</p>
                <p className="text-sm font-semibold">Donor Blood Volume</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{results.rbcVolumeNeeded} mL</p>
                <p className="text-sm">RBC Volume to Exchange</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{results.tbv} mL</p>
                <p className="text-sm">Est. Total Blood Volume</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-red-300 text-center">
              <p className="text-sm">Target: Reduce HbS from {hbS}% → {targetHbS}%</p>
            </div>
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Clinical Considerations</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Use leukoreduced, Hb S-negative, phenotypically matched blood</li>
              <li>Extended phenotype matching (C, E, K) is recommended</li>
              <li>Monitor for delayed hemolytic transfusion reactions</li>
              <li>Calculations are estimates; actual volumes may vary</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Indications for Exchange Transfusion</p>
            <ul className="mt-1 list-disc list-inside space-y-1">
              <li>Acute ischemic stroke (target HbS &lt;30%)</li>
              <li>Severe acute chest syndrome</li>
              <li>Multiorgan failure</li>
              <li>Preoperative preparation for high-risk surgery</li>
            </ul>
            <p className="mt-2 text-xs">Reference: ASH 2020 Guidelines for Sickle Cell Disease</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SickleCellExchangeCalculator;
