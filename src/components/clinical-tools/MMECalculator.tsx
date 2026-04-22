import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, RotateCcw, Info, Plus, Trash2, AlertTriangle, AlertCircle } from 'lucide-react';

interface Opioid {
  name: string;
  mmeConversionFactor: number;
  unit: string;
}

const opioids: Record<string, Opioid> = {
  codeine: { name: 'Codeine', mmeConversionFactor: 0.15, unit: 'mg' },
  fentanylPatch: { name: 'Fentanyl (transdermal)', mmeConversionFactor: 2.4, unit: 'mcg/hr' },
  hydrocodone: { name: 'Hydrocodone', mmeConversionFactor: 1, unit: 'mg' },
  hydromorphone: { name: 'Hydromorphone', mmeConversionFactor: 4, unit: 'mg' },
  methadone1_20: { name: 'Methadone (1-20 mg/d)', mmeConversionFactor: 4, unit: 'mg' },
  methadone21_40: { name: 'Methadone (21-40 mg/d)', mmeConversionFactor: 8, unit: 'mg' },
  methadone41_60: { name: 'Methadone (41-60 mg/d)', mmeConversionFactor: 10, unit: 'mg' },
  methadone61plus: { name: 'Methadone (≥61 mg/d)', mmeConversionFactor: 12, unit: 'mg' },
  morphine: { name: 'Morphine', mmeConversionFactor: 1, unit: 'mg' },
  oxycodone: { name: 'Oxycodone', mmeConversionFactor: 1.5, unit: 'mg' },
  oxymorphone: { name: 'Oxymorphone', mmeConversionFactor: 3, unit: 'mg' },
  tapentadol: { name: 'Tapentadol', mmeConversionFactor: 0.4, unit: 'mg' },
  tramadol: { name: 'Tramadol', mmeConversionFactor: 0.1, unit: 'mg' },
  buprenorphine: { name: 'Buprenorphine (sublingual/buccal)', mmeConversionFactor: 30, unit: 'mg' },
  buprenorphinePatch: { name: 'Buprenorphine (transdermal)', mmeConversionFactor: 12.6, unit: 'mcg/hr' },
};

interface MedicationEntry {
  id: string;
  opioidKey: string;
  dose: string;
  frequency: string;
}

const frequencies: Record<string, { label: string; multiplier: number }> = {
  once: { label: 'Once daily', multiplier: 1 },
  bid: { label: 'Twice daily (BID)', multiplier: 2 },
  tid: { label: 'Three times daily (TID)', multiplier: 3 },
  qid: { label: 'Four times daily (QID)', multiplier: 4 },
  q4h: { label: 'Every 4 hours', multiplier: 6 },
  q6h: { label: 'Every 6 hours', multiplier: 4 },
  q8h: { label: 'Every 8 hours', multiplier: 3 },
  q12h: { label: 'Every 12 hours', multiplier: 2 },
  prn: { label: 'PRN (estimate daily use)', multiplier: 1 },
  patch: { label: 'Patch (continuous)', multiplier: 1 },
};

const MMECalculator = () => {
  const [medications, setMedications] = useState<MedicationEntry[]>([
    { id: '1', opioidKey: '', dose: '', frequency: '' }
  ]);

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now().toString(), opioidKey: '', dose: '', frequency: '' }
    ]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(m => m.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof MedicationEntry, value: string) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const calculateTotalMME = () => {
    let total = 0;
    const breakdown: { name: string; dailyDose: number; mme: number }[] = [];

    medications.forEach(med => {
      if (med.opioidKey && med.dose && med.frequency) {
        const opioid = opioids[med.opioidKey];
        const dose = parseFloat(med.dose);
        const freq = frequencies[med.frequency];

        if (opioid && !isNaN(dose) && freq) {
          let dailyDose = dose * freq.multiplier;
          // For patches, dose IS the daily equivalent
          if (med.frequency === 'patch') {
            dailyDose = dose;
          }
          const mme = dailyDose * opioid.mmeConversionFactor;
          total += mme;
          breakdown.push({
            name: opioid.name,
            dailyDose,
            mme: Math.round(mme * 10) / 10
          });
        }
      }
    });

    return { total: Math.round(total * 10) / 10, breakdown };
  };

  const result = calculateTotalMME();

  const getRiskLevel = () => {
    if (result.total === 0) return null;
    if (result.total < 50) return { level: 'Lower Risk', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/30', borderColor: 'border-green-200 dark:border-green-800' };
    if (result.total < 90) return { level: 'Increased Risk', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30', borderColor: 'border-yellow-200 dark:border-yellow-800' };
    return { level: 'High Risk', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30', borderColor: 'border-red-200 dark:border-red-800' };
  };

  const riskLevel = getRiskLevel();

  const resetForm = () => {
    setMedications([{ id: '1', opioidKey: '', dose: '', frequency: '' }]);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Pill className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">MME Calculator</CardTitle>
            <CardDescription className="text-amber-100">
              Morphine Milligram Equivalents (CDC Guidelines)
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p>Calculates total daily morphine milligram equivalents from opioid prescriptions. 
              Used for risk assessment per CDC guidelines for prescribing opioids.</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Opioid Medications</Label>
            <Button variant="outline" size="sm" onClick={addMedication} className="gap-1">
              <Plus className="h-4 w-4" />
              Add Medication
            </Button>
          </div>

          {medications.map((med, index) => (
            <div key={med.id} className="p-4 border rounded-lg space-y-3 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Medication {index + 1}</span>
                {medications.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeMedication(med.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Opioid</Label>
                  <Select 
                    value={med.opioidKey} 
                    onValueChange={(v) => updateMedication(med.id, 'opioidKey', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select opioid" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(opioids).map(([key, opioid]) => (
                        <SelectItem key={key} value={key}>
                          {opioid.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">
                    Dose ({med.opioidKey ? opioids[med.opioidKey]?.unit || 'mg' : 'mg'})
                  </Label>
                  <Input
                    type="number"
                    placeholder="Enter dose"
                    value={med.dose}
                    onChange={(e) => updateMedication(med.id, 'dose', e.target.value)}
                    min="0"
                    step="0.5"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Frequency</Label>
                  <Select 
                    value={med.frequency} 
                    onValueChange={(v) => updateMedication(med.id, 'frequency', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(frequencies).map(([key, freq]) => (
                        <SelectItem key={key} value={key}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {result.total > 0 && riskLevel && (
          <div className="space-y-4">
            <div className={`p-6 rounded-lg border ${riskLevel.bgColor} ${riskLevel.borderColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Total Daily MME</h3>
                <span className={`text-3xl font-bold ${riskLevel.color}`}>
                  {result.total} MME/day
                </span>
              </div>
              <p className={`font-semibold ${riskLevel.color}`}>{riskLevel.level}</p>
            </div>

            {result.breakdown.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
                <h4 className="font-semibold mb-3">Breakdown</h4>
                <div className="space-y-2">
                  {result.breakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-mono">{item.mme} MME/day</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.total >= 50 && (
              <div className={`p-4 rounded-lg border ${result.total >= 90 ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800' : 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800'}`}>
                <div className="flex items-start gap-2">
                  {result.total >= 90 ? (
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className={`text-sm ${result.total >= 90 ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                    {result.total >= 90 ? (
                      <>
                        <p className="font-semibold">High-Dose Threshold (≥90 MME/day)</p>
                        <p>CDC recommends avoiding or carefully justifying doses ≥90 MME/day. Consider:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>Offering naloxone</li>
                          <li>More frequent follow-up</li>
                          <li>Discussing risks vs benefits with patient</li>
                          <li>Consulting pain specialist</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        <p className="font-semibold">Caution Threshold (≥50 MME/day)</p>
                        <p>CDC recommends increased caution. Consider offering naloxone and evaluating benefits vs. risks of continued therapy.</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> CDC Guideline for Prescribing Opioids for Chronic Pain, 2022 Clinical Practice Guideline.</p>
          <p className="mt-1"><strong>Note:</strong> Conversion factors are approximations. Buprenorphine products used for MAT do not count toward MME. Clinical judgment should guide all prescribing decisions.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MMECalculator;
