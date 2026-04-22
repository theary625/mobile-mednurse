import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const OsmolalityCalculator: React.FC = () => {
  const [sodium, setSodium] = useState('');
  const [glucose, setGlucose] = useState('');
  const [bun, setBun] = useState('');
  const [ethanol, setEthanol] = useState('');
  const [measuredOsm, setMeasuredOsm] = useState('');
  const [showResults, setShowResults] = useState(false);

  const calculateOsmolality = () => {
    const na = parseFloat(sodium);
    const glu = parseFloat(glucose);
    const bunVal = parseFloat(bun);

    if (isNaN(na) || isNaN(glu) || isNaN(bunVal)) {
      return null;
    }

    // Calculated serum osmolality (mOsm/kg)
    // Formula: 2×Na + Glucose/18 + BUN/2.8
    const calculatedOsm = 2 * na + glu / 18 + bunVal / 2.8;

    // If ethanol is provided, add its contribution
    // Ethanol contribution: EtOH (mg/dL) / 4.6
    const ethVal = ethanol ? parseFloat(ethanol) : null;
    let calculatedWithEtoh = null;
    if (ethVal !== null && !isNaN(ethVal)) {
      calculatedWithEtoh = calculatedOsm + ethVal / 4.6;
    }

    // Osmolar gap calculation
    const measuredVal = measuredOsm ? parseFloat(measuredOsm) : null;
    let osmolarGap = null;
    let gapWithEtoh = null;
    
    if (measuredVal !== null && !isNaN(measuredVal)) {
      osmolarGap = measuredVal - calculatedOsm;
      if (calculatedWithEtoh !== null) {
        gapWithEtoh = measuredVal - calculatedWithEtoh;
      }
    }

    // Interpretation
    let interpretation = '';
    let severity = 'normal';
    
    if (osmolarGap !== null) {
      const effectiveGap = gapWithEtoh !== null ? gapWithEtoh : osmolarGap;
      
      if (effectiveGap <= 10) {
        interpretation = 'Normal osmolar gap. Unlikely toxic alcohol ingestion.';
        severity = 'normal';
      } else if (effectiveGap <= 15) {
        interpretation = 'Mildly elevated osmolar gap. May be seen in alcoholic ketoacidosis, chronic kidney disease, or early toxic alcohol ingestion.';
        severity = 'mild';
      } else if (effectiveGap <= 25) {
        interpretation = 'Moderately elevated osmolar gap. Consider toxic alcohol ingestion (methanol, ethylene glycol, isopropanol) or other unmeasured osmoles.';
        severity = 'moderate';
      } else {
        interpretation = 'Significantly elevated osmolar gap. High suspicion for toxic alcohol ingestion. Consider immediate treatment and toxicology consultation.';
        severity = 'high';
      }
    } else {
      // Just interpret the calculated osmolality
      if (calculatedOsm < 275) {
        interpretation = 'Low calculated osmolality - may indicate hyponatremia.';
        severity = 'mild';
      } else if (calculatedOsm <= 295) {
        interpretation = 'Normal calculated serum osmolality.';
        severity = 'normal';
      } else {
        interpretation = 'Elevated calculated osmolality - may indicate dehydration, hyperglycemia, or uremia.';
        severity = 'moderate';
      }
    }

    return {
      calculatedOsm: calculatedOsm.toFixed(0),
      calculatedWithEtoh: calculatedWithEtoh !== null ? calculatedWithEtoh.toFixed(0) : null,
      osmolarGap: osmolarGap !== null ? osmolarGap.toFixed(0) : null,
      gapWithEtoh: gapWithEtoh !== null ? gapWithEtoh.toFixed(0) : null,
      interpretation,
      severity
    };
  };

  const result = showResults ? calculateOsmolality() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'mild':
        return 'bg-yellow-100 border-yellow-200 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'high':
        return 'bg-red-100 border-red-200 text-red-800';
      default:
        return '';
    }
  };

  const isValid = sodium && glucose && bun;

  const resetForm = () => {
    setSodium('');
    setGlucose('');
    setBun('');
    setEthanol('');
    setMeasuredOsm('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Serum Osmolality Calculator</CardTitle>
        <p className="text-blue-100 text-sm mt-1">
          Calculates expected osmolarity and osmolar gap to detect unmeasured compounds
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="sodium">Sodium (Na⁺) mEq/L *</Label>
            <Input 
              id="sodium" 
              type="number" 
              value={sodium} 
              onChange={(e) => setSodium(e.target.value)} 
              placeholder="135-145"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="glucose">Glucose (mg/dL) *</Label>
            <Input 
              id="glucose" 
              type="number" 
              value={glucose} 
              onChange={(e) => setGlucose(e.target.value)} 
              placeholder="70-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bun">BUN (mg/dL) *</Label>
            <Input 
              id="bun" 
              type="number" 
              value={bun} 
              onChange={(e) => setBun(e.target.value)} 
              placeholder="7-20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ethanol">Ethanol (mg/dL) - Optional</Label>
            <Input 
              id="ethanol" 
              type="number" 
              value={ethanol} 
              onChange={(e) => setEthanol(e.target.value)} 
              placeholder="For EtOH-corrected calculation"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="measured">Measured Osmolality (mOsm/kg) - Optional</Label>
            <Input 
              id="measured" 
              type="number" 
              value={measuredOsm} 
              onChange={(e) => setMeasuredOsm(e.target.value)} 
              placeholder="For osmolar gap calculation"
            />
            <p className="text-xs text-muted-foreground">Enter measured value to calculate osmolar gap</p>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Calculate Osmolality
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold">{result.calculatedOsm}</p>
                  <p className="text-sm font-semibold">Calculated Osmolality</p>
                  <p className="text-xs">mOsm/kg (Normal: 275-295)</p>
                </div>
                {result.osmolarGap && (
                  <div className="text-center">
                    <p className="text-4xl font-bold">{result.osmolarGap}</p>
                    <p className="text-sm font-semibold">Osmolar Gap</p>
                    <p className="text-xs">mOsm/kg (Normal: &lt;10)</p>
                  </div>
                )}
              </div>

              {result.calculatedWithEtoh && (
                <div className="mt-4 pt-4 border-t border-current/20 grid sm:grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{result.calculatedWithEtoh}</p>
                    <p className="text-xs">EtOH-Corrected Calc Osm</p>
                  </div>
                  {result.gapWithEtoh && (
                    <div className="text-center">
                      <p className="text-2xl font-bold">{result.gapWithEtoh}</p>
                      <p className="text-xs">EtOH-Corrected Gap</p>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-current/20">
                <p className="text-sm">{result.interpretation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formula */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Formulas:</p>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><strong>Calculated Osmolality</strong> = 2×Na + Glucose/18 + BUN/2.8</li>
            <li><strong>With Ethanol</strong> = Calc Osm + EtOH/4.6</li>
            <li><strong>Osmolar Gap</strong> = Measured Osm − Calculated Osm</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Causes of Elevated Osmolar Gap</p>
            <ul className="mt-1 space-y-1">
              <li>• <strong>Toxic alcohols:</strong> Methanol, ethylene glycol, isopropanol</li>
              <li>• <strong>Other:</strong> Propylene glycol, mannitol, sorbitol</li>
              <li>• <strong>Medical conditions:</strong> Alcoholic ketoacidosis, chronic renal failure</li>
              <li>• <strong>Lab error:</strong> Hyperlipidemia, hyperproteinemia (pseudohyponatremia)</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> A normal osmolar gap does NOT exclude toxic alcohol poisoning. 
            As toxic alcohols are metabolized, the osmolar gap decreases while the anion gap increases. 
            Consider both together and check serial values.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OsmolalityCalculator;
