import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Info, ArrowRight } from 'lucide-react';

interface ConversionResult {
  fromDrug: string;
  fromRoute: string;
  fromDose: number;
  morphineEquivalent: number;
  toDrug: string;
  toRoute: string;
  toDose: number;
  reducedDose: number;
  notes: string[];
}

// Equianalgesic doses (relative to morphine 10mg IV or 30mg PO)
const opioidData: Record<string, { ivDose: number; poDose: number; ratio: number }> = {
  morphine: { ivDose: 10, poDose: 30, ratio: 3 },
  hydromorphone: { ivDose: 1.5, poDose: 7.5, ratio: 5 },
  fentanyl: { ivDose: 0.1, poDose: 0, ratio: 0 }, // No oral fentanyl in this context
  oxycodone: { ivDose: 0, poDose: 20, ratio: 0 }, // Oral only
  hydrocodone: { ivDose: 0, poDose: 30, ratio: 0 }, // Oral only
};

const drugLabels: Record<string, string> = {
  morphine: 'Morphine',
  hydromorphone: 'Hydromorphone (Dilaudid)',
  fentanyl: 'Fentanyl',
  oxycodone: 'Oxycodone',
  hydrocodone: 'Hydrocodone',
};

const OpioidEquianalgesicCalculator: React.FC = () => {
  const [fromDrug, setFromDrug] = useState('morphine');
  const [fromRoute, setFromRoute] = useState<'iv' | 'po'>('po');
  const [fromDose, setFromDose] = useState('');
  const [toDrug, setToDrug] = useState('hydromorphone');
  const [toRoute, setToRoute] = useState<'iv' | 'po'>('po');
  const [result, setResult] = useState<ConversionResult | null>(null);

  const getAvailableRoutes = (drug: string) => {
    const data = opioidData[drug];
    const routes: { value: 'iv' | 'po'; label: string }[] = [];
    if (data.poDose > 0) routes.push({ value: 'po', label: 'Oral (PO)' });
    if (data.ivDose > 0) routes.push({ value: 'iv', label: 'IV/IM/SC' });
    return routes;
  };

  const calculate = () => {
    const dose = parseFloat(fromDose);
    if (!dose || dose <= 0) return;

    const fromData = opioidData[fromDrug];
    const toData = opioidData[toDrug];

    // Step 1: Convert to morphine equivalent (based on oral morphine 30mg)
    const fromEquiDose = fromRoute === 'iv' ? fromData.ivDose : fromData.poDose;
    const morphineEquivalent = (dose / fromEquiDose) * 30; // Oral morphine equivalent

    // Step 2: Convert from morphine equivalent to target drug
    const toEquiDose = toRoute === 'iv' ? toData.ivDose : toData.poDose;
    const toDose = (morphineEquivalent / 30) * toEquiDose;

    // Step 3: Apply cross-tolerance reduction (25-50% reduction recommended)
    const reducedDose = toDose * 0.75; // 25% reduction

    const notes: string[] = [];
    
    if (fromDrug !== toDrug) {
      notes.push('25% dose reduction applied for incomplete cross-tolerance');
    }
    if (toDrug === 'fentanyl' && toRoute === 'iv') {
      notes.push('Consider starting lower and titrating for fentanyl');
    }
    if (dose > 100 && fromDrug === 'morphine' && fromRoute === 'po') {
      notes.push('High dose opioid - consider pain/palliative care consult');
    }

    setResult({
      fromDrug: drugLabels[fromDrug],
      fromRoute: fromRoute.toUpperCase(),
      fromDose: dose,
      morphineEquivalent,
      toDrug: drugLabels[toDrug],
      toRoute: toRoute.toUpperCase(),
      toDose,
      reducedDose,
      notes
    });
  };

  // Update routes when drug changes
  const handleFromDrugChange = (drug: string) => {
    setFromDrug(drug);
    const routes = getAvailableRoutes(drug);
    if (!routes.find(r => r.value === fromRoute)) {
      setFromRoute(routes[0]?.value || 'po');
    }
  };

  const handleToDrugChange = (drug: string) => {
    setToDrug(drug);
    const routes = getAvailableRoutes(drug);
    if (!routes.find(r => r.value === toRoute)) {
      setToRoute(routes[0]?.value || 'po');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Opioid Equianalgesic Calculator</CardTitle>
        <p className="text-amber-100 text-sm mt-1">
          Convert between opioids with cross-tolerance adjustment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-red-800">
            <p className="font-semibold">Clinical Judgment Required</p>
            <p>Equianalgesic tables are guides only. Patient response varies significantly. Always start low and titrate.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Converting FROM:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Opioid</Label>
              <Select value={fromDrug} onValueChange={handleFromDrugChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(drugLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Route</Label>
              <Select value={fromRoute} onValueChange={(v) => setFromRoute(v as 'iv' | 'po')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoutes(fromDrug).map(route => (
                    <SelectItem key={route.value} value={route.value}>{route.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Daily Dose (mg)</Label>
              <Input
                type="number"
                value={fromDose}
                onChange={(e) => setFromDose(e.target.value)}
                placeholder="Enter dose"
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Converting TO:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Opioid</Label>
              <Select value={toDrug} onValueChange={handleToDrugChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(drugLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Route</Label>
              <Select value={toRoute} onValueChange={(v) => setToRoute(v as 'iv' | 'po')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRoutes(toDrug).map(route => (
                    <SelectItem key={route.value} value={route.value}>{route.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={calculate} disabled={!fromDose || parseFloat(fromDose) <= 0} className="w-full">
          Calculate Equivalent Dose
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-primary/10 rounded-lg space-y-3">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">From</span>
                <span className="font-bold">{result.fromDrug} {result.fromDose}mg {result.fromRoute}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Oral Morphine Equivalent</span>
                <span className="font-bold text-primary">{result.morphineEquivalent.toFixed(1)}mg</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-sm">Calculated {result.toDrug} {result.toRoute}</span>
                <span className="font-bold">{result.toDose.toFixed(1)}mg</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-medium">Recommended Starting Dose (25% reduction)</span>
                <span className="font-bold text-xl text-primary">{result.reducedDose.toFixed(1)}mg</span>
              </div>
            </div>

            {result.notes.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-800 mb-2">Important Notes</p>
                <ul className="text-sm text-amber-800 space-y-1">
                  {result.notes.map((note, i) => (
                    <li key={i}>• {note}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Quick Reference Table (Daily Doses)</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Opioid</th>
                  <th className="text-center py-1">PO (mg)</th>
                  <th className="text-center py-1">IV (mg)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">Morphine</td>
                  <td className="text-center">30</td>
                  <td className="text-center">10</td>
                </tr>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">Hydromorphone</td>
                  <td className="text-center">7.5</td>
                  <td className="text-center">1.5</td>
                </tr>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">Oxycodone</td>
                  <td className="text-center">20</td>
                  <td className="text-center">—</td>
                </tr>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">Hydrocodone</td>
                  <td className="text-center">30</td>
                  <td className="text-center">—</td>
                </tr>
                <tr>
                  <td className="py-1">Fentanyl</td>
                  <td className="text-center">—</td>
                  <td className="text-center">0.1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• Reduce calculated dose by 25-50% for incomplete cross-tolerance</li>
                <li>• Reduce further for elderly, renal/hepatic impairment, or opioid-naive</li>
                <li>• Fentanyl patch conversions require separate calculations</li>
                <li>• Methadone has unique pharmacokinetics - specialist guidance recommended</li>
                <li>• Always have naloxone available during opioid rotation</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OpioidEquianalgesicCalculator;
