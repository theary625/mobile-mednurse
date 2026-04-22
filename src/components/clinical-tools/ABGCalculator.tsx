import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle } from 'lucide-react';

const ABGCalculator: React.FC = () => {
  const [ph, setPh] = useState('');
  const [paco2, setPaco2] = useState('');
  const [hco3, setHco3] = useState('');
  const [pao2, setPao2] = useState('');
  const [fio2, setFio2] = useState('');
  const [showResults, setShowResults] = useState(false);

  const interpretABG = () => {
    const phVal = parseFloat(ph);
    const co2Val = parseFloat(paco2);
    const bicarbVal = parseFloat(hco3);
    const o2Val = pao2 ? parseFloat(pao2) : null;
    const fio2Val = fio2 ? parseFloat(fio2) : null;

    if (isNaN(phVal) || isNaN(co2Val) || isNaN(bicarbVal)) return null;

    // Determine acid-base status
    let primaryDisorder = '';
    let compensation = '';
    let expectedValue = '';
    let severity = 'normal';

    // pH assessment
    const isAcidemic = phVal < 7.35;
    const isAlkalemic = phVal > 7.45;
    const isNormalPh = !isAcidemic && !isAlkalemic;

    // CO2 assessment (respiratory component)
    const isRespAcidosis = co2Val > 45;
    const isRespAlkalosis = co2Val < 35;

    // HCO3 assessment (metabolic component)
    const isMetAcidosis = bicarbVal < 22;
    const isMetAlkalosis = bicarbVal > 26;

    if (isNormalPh && !isRespAcidosis && !isRespAlkalosis && !isMetAcidosis && !isMetAlkalosis) {
      primaryDisorder = 'Normal ABG';
      compensation = 'No acid-base disturbance';
      severity = 'normal';
    } else if (isAcidemic) {
      if (isRespAcidosis && !isMetAcidosis) {
        primaryDisorder = 'Respiratory Acidosis';
        // Expected HCO3 for acute: rises 1 for every 10 rise in CO2
        // Expected HCO3 for chronic: rises 3.5 for every 10 rise in CO2
        const acuteExpected = 24 + ((co2Val - 40) / 10);
        const chronicExpected = 24 + (3.5 * (co2Val - 40) / 10);
        if (bicarbVal < acuteExpected - 2) {
          compensation = 'Uncompensated (acute) or concurrent metabolic acidosis';
        } else if (bicarbVal >= chronicExpected - 2) {
          compensation = 'Chronic/Compensated';
        } else {
          compensation = 'Partially compensated or acute';
        }
        expectedValue = `Acute expected HCO₃: ${acuteExpected.toFixed(1)}, Chronic: ${chronicExpected.toFixed(1)}`;
        severity = 'acidosis';
      } else if (isMetAcidosis && !isRespAcidosis) {
        primaryDisorder = 'Metabolic Acidosis';
        // Winter's formula: Expected PaCO2 = 1.5 × HCO3 + 8 ± 2
        const expectedCo2 = 1.5 * bicarbVal + 8;
        if (co2Val > expectedCo2 + 2) {
          compensation = 'Concurrent respiratory acidosis';
        } else if (co2Val < expectedCo2 - 2) {
          compensation = 'Concurrent respiratory alkalosis';
        } else {
          compensation = 'Appropriately compensated';
        }
        expectedValue = `Expected PaCO₂ (Winter's): ${expectedCo2.toFixed(1)} ± 2`;
        severity = 'acidosis';
      } else if (isRespAcidosis && isMetAcidosis) {
        primaryDisorder = 'Mixed Respiratory & Metabolic Acidosis';
        compensation = 'Both systems contributing to acidemia';
        severity = 'severe';
      }
    } else if (isAlkalemic) {
      if (isRespAlkalosis && !isMetAlkalosis) {
        primaryDisorder = 'Respiratory Alkalosis';
        // Expected HCO3 for acute: drops 2 for every 10 drop in CO2
        // Expected HCO3 for chronic: drops 5 for every 10 drop in CO2
        const acuteExpected = 24 - (2 * (40 - co2Val) / 10);
        const chronicExpected = 24 - (5 * (40 - co2Val) / 10);
        if (bicarbVal > acuteExpected + 2) {
          compensation = 'Concurrent metabolic alkalosis';
        } else if (bicarbVal <= chronicExpected + 2) {
          compensation = 'Chronic/Compensated';
        } else {
          compensation = 'Partially compensated or acute';
        }
        expectedValue = `Acute expected HCO₃: ${acuteExpected.toFixed(1)}, Chronic: ${chronicExpected.toFixed(1)}`;
        severity = 'alkalosis';
      } else if (isMetAlkalosis && !isRespAlkalosis) {
        primaryDisorder = 'Metabolic Alkalosis';
        // Expected PaCO2 rises 0.7 for every 1 rise in HCO3
        const expectedCo2 = 40 + (0.7 * (bicarbVal - 24));
        if (co2Val < expectedCo2 - 2) {
          compensation = 'Concurrent respiratory alkalosis';
        } else if (co2Val > expectedCo2 + 2) {
          compensation = 'Concurrent respiratory acidosis';
        } else {
          compensation = 'Appropriately compensated';
        }
        expectedValue = `Expected PaCO₂: ${expectedCo2.toFixed(1)} ± 2`;
        severity = 'alkalosis';
      } else if (isRespAlkalosis && isMetAlkalosis) {
        primaryDisorder = 'Mixed Respiratory & Metabolic Alkalosis';
        compensation = 'Both systems contributing to alkalemia';
        severity = 'severe';
      }
    } else {
      // Normal pH with abnormal values - compensated or mixed
      if (isRespAcidosis && isMetAlkalosis) {
        primaryDisorder = 'Fully Compensated or Mixed Disorder';
        compensation = 'Respiratory acidosis with metabolic compensation OR mixed disorder';
        severity = 'warning';
      } else if (isRespAlkalosis && isMetAcidosis) {
        primaryDisorder = 'Fully Compensated or Mixed Disorder';
        compensation = 'Respiratory alkalosis with metabolic compensation OR mixed disorder';
        severity = 'warning';
      }
    }

    // Oxygenation assessment
    let oxygenation = null;
    if (o2Val !== null) {
      let o2Status = '';
      let aaGradient = null;

      if (o2Val < 60) {
        o2Status = 'Severe hypoxemia';
      } else if (o2Val < 80) {
        o2Status = 'Moderate hypoxemia';
      } else if (o2Val < 90) {
        o2Status = 'Mild hypoxemia';
      } else {
        o2Status = 'Normal oxygenation';
      }

      // A-a gradient if FiO2 provided
      if (fio2Val !== null && fio2Val > 0) {
        // PAO2 = (FiO2 × 713) - (PaCO2 / 0.8)
        const pao2Calc = (fio2Val / 100) * 713 - (co2Val / 0.8);
        aaGradient = pao2Calc - o2Val;
      }

      oxygenation = { status: o2Status, aaGradient };
    }

    return {
      primaryDisorder,
      compensation,
      expectedValue,
      severity,
      oxygenation,
      values: { ph: phVal, co2: co2Val, hco3: bicarbVal }
    };
  };

  const result = showResults ? interpretABG() : null;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'normal':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'acidosis':
        return 'bg-orange-100 border-orange-200 text-orange-800';
      case 'alkalosis':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'severe':
        return 'bg-red-100 border-red-200 text-red-800';
      case 'warning':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-800';
    }
  };

  const isValid = ph && paco2 && hco3;

  const resetForm = () => {
    setPh('');
    setPaco2('');
    setHco3('');
    setPao2('');
    setFio2('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">ABG Interpreter</CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Arterial Blood Gas Analysis & Acid-Base Interpretation
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="ph">pH *</Label>
            <Input
              id="ph"
              type="number"
              step="0.01"
              value={ph}
              onChange={(e) => setPh(e.target.value)}
              placeholder="7.35 - 7.45"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paco2">PaCO₂ (mmHg) *</Label>
            <Input
              id="paco2"
              type="number"
              value={paco2}
              onChange={(e) => setPaco2(e.target.value)}
              placeholder="35 - 45"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hco3">HCO₃⁻ (mEq/L) *</Label>
            <Input
              id="hco3"
              type="number"
              value={hco3}
              onChange={(e) => setHco3(e.target.value)}
              placeholder="22 - 26"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pao2">PaO₂ (mmHg)</Label>
            <Input
              id="pao2"
              type="number"
              value={pao2}
              onChange={(e) => setPao2(e.target.value)}
              placeholder="80 - 100 (optional)"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fio2">FiO₂ (%)</Label>
            <Input
              id="fio2"
              type="number"
              value={fio2}
              onChange={(e) => setFio2(e.target.value)}
              placeholder="21 - 100 (for A-a gradient)"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!isValid} className="flex-1">
            Interpret ABG
          </Button>
          <Button onClick={resetForm} variant="outline">
            Reset
          </Button>
        </div>

        {result && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${getSeverityStyles(result.severity)}`}>
              <p className="text-2xl font-bold mb-2">{result.primaryDisorder}</p>
              <p className="text-sm font-medium">{result.compensation}</p>
              {result.expectedValue && (
                <p className="text-sm mt-2 opacity-80">{result.expectedValue}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg border ${result.values.ph < 7.35 ? 'bg-orange-50 border-orange-200' : result.values.ph > 7.45 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                <p className="text-2xl font-bold">{result.values.ph.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">pH (7.35-7.45)</p>
              </div>
              <div className={`p-4 rounded-lg border ${result.values.co2 > 45 ? 'bg-orange-50 border-orange-200' : result.values.co2 < 35 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                <p className="text-2xl font-bold">{result.values.co2}</p>
                <p className="text-sm text-muted-foreground">PaCO₂ (35-45)</p>
              </div>
              <div className={`p-4 rounded-lg border ${result.values.hco3 < 22 ? 'bg-orange-50 border-orange-200' : result.values.hco3 > 26 ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
                <p className="text-2xl font-bold">{result.values.hco3}</p>
                <p className="text-sm text-muted-foreground">HCO₃⁻ (22-26)</p>
              </div>
            </div>

            {result.oxygenation && (
              <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg">
                <p className="font-semibold">Oxygenation: {result.oxygenation.status}</p>
                {result.oxygenation.aaGradient !== null && (
                  <p className="text-sm text-muted-foreground mt-1">
                    A-a Gradient: {result.oxygenation.aaGradient.toFixed(1)} mmHg 
                    (Normal: &lt;10-15 on room air)
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Interpretation Steps:</p>
          <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
            <li>Assess pH: Acidemia (&lt;7.35) or Alkalemia (&gt;7.45)?</li>
            <li>Check PaCO₂: Respiratory cause (↑ = acidosis, ↓ = alkalosis)?</li>
            <li>Check HCO₃⁻: Metabolic cause (↓ = acidosis, ↑ = alkalosis)?</li>
            <li>Determine primary disorder based on pH direction</li>
            <li>Calculate expected compensation</li>
          </ol>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Compensation Formulas</p>
            <ul className="mt-1 space-y-1">
              <li><strong>Metabolic Acidosis:</strong> Expected PaCO₂ = 1.5 × HCO₃ + 8 ± 2 (Winter's)</li>
              <li><strong>Metabolic Alkalosis:</strong> Expected PaCO₂ = 40 + 0.7 × (HCO₃ - 24)</li>
              <li><strong>Respiratory Acidosis:</strong> Acute ↑1 / Chronic ↑3.5 HCO₃ per 10 ↑CO₂</li>
              <li><strong>Respiratory Alkalosis:</strong> Acute ↓2 / Chronic ↓5 HCO₃ per 10 ↓CO₂</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <strong>Clinical Note:</strong> Always correlate ABG findings with clinical presentation. 
            Consider Anion Gap in metabolic acidosis to differentiate causes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ABGCalculator;
