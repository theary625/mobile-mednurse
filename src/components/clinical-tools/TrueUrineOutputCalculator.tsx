import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Droplets, Plus, Trash2 } from 'lucide-react';

interface IrrigationEntry {
  id: string;
  type: 'irrigation_in' | 'drainage_out';
  description: string;
  amount: number;
  time?: string;
}

const TrueUrineOutputCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [hours, setHours] = useState('24');
  const [entries, setEntries] = useState<IrrigationEntry[]>([]);
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'irrigation_in' | 'drainage_out'>('drainage_out');
  const [showResults, setShowResults] = useState(false);

  const addEntry = () => {
    if (newDescription && newAmount) {
      setEntries([
        ...entries,
        {
          id: Date.now().toString(),
          type: newType,
          description: newDescription,
          amount: parseFloat(newAmount)
        }
      ]);
      setNewDescription('');
      setNewAmount('');
    }
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  // Calculations
  const totalIrrigationIn = entries.filter(e => e.type === 'irrigation_in').reduce((sum, e) => sum + e.amount, 0);
  const totalDrainageOut = entries.filter(e => e.type === 'drainage_out').reduce((sum, e) => sum + e.amount, 0);
  const trueUrineOutput = Math.max(0, totalDrainageOut - totalIrrigationIn);

  const weightNum = parseFloat(weight) || 0;
  const hoursNum = parseFloat(hours) || 24;
  const urineOutputPerKgHr = weightNum > 0 && hoursNum > 0 ? trueUrineOutput / weightNum / hoursNum : 0;

  const getInterpretation = () => {
    if (urineOutputPerKgHr < 0.3) {
      return {
        category: 'Severe Oliguria / Anuria',
        description: 'Critically low output. Evaluate for AKI, obstruction, hypovolemia.',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (urineOutputPerKgHr < 0.5) {
      return {
        category: 'Oliguria',
        description: 'Below normal. Consider fluid status, renal function, medications.',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else if (urineOutputPerKgHr <= 1.0) {
      return {
        category: 'Normal',
        description: 'Adequate urine output.',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (urineOutputPerKgHr <= 2.5) {
      return {
        category: 'Elevated',
        description: 'Higher than expected. May be appropriate post-procedure.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        category: 'Polyuria',
        description: 'Very high output. Monitor for fluid/electrolyte imbalances.',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    }
  };

  const interpretation = getInterpretation();

  const handleReset = () => {
    setWeight('');
    setHours('24');
    setEntries([]);
    setShowResults(false);
  };

  const quickAddIrrigation = (desc: string, amt: number) => {
    setEntries([
      ...entries,
      { id: Date.now().toString(), type: 'irrigation_in', description: desc, amount: amt }
    ]);
  };

  const quickAddDrainage = (desc: string, amt: number) => {
    setEntries([
      ...entries,
      { id: Date.now().toString(), type: 'drainage_out', description: desc, amount: amt }
    ]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          True Urine Output Calculator (CBI)
        </CardTitle>
        <p className="text-cyan-100 text-sm mt-1">
          Calculates actual urine production during continuous bladder irrigation
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Patient Weight (kg)</Label>
            <Input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70"
            />
            <p className="text-xs text-muted-foreground">Required for mL/kg/hr calculation</p>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-semibold">Time Period (hours)</Label>
            <Input
              type="number"
              step="1"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="e.g., 24"
            />
            <p className="text-xs text-muted-foreground">Duration of measurement period</p>
          </div>
        </div>

        {/* Formula Display */}
        <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
          <p className="text-sm font-semibold text-cyan-800">Formula:</p>
          <p className="text-lg font-mono text-cyan-900 mt-1">
            True Urine Output = Total Drainage Out − Irrigation Fluid In
          </p>
        </div>

        {/* Quick Add Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-teal-700">Quick Add: Irrigation IN</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'NS 1L Bag', amount: 1000 },
                { label: 'NS 3L Bag', amount: 3000 },
                { label: 'NS 500mL', amount: 500 },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="sm"
                  className="border-teal-300 text-teal-700 hover:bg-teal-50"
                  onClick={() => quickAddIrrigation(item.label, item.amount)}
                >
                  + {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-blue-700">Quick Add: Drainage OUT</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Foley Bag 2L', amount: 2000 },
                { label: 'Foley Bag 3L', amount: 3000 },
                { label: 'Drain 500mL', amount: 500 },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  onClick={() => quickAddDrainage(item.label, item.amount)}
                >
                  + {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Manual Entry */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <Label className="text-sm font-medium">Manual Entry</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'irrigation_in' | 'drainage_out')}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="drainage_out">Drainage OUT</option>
                <option value="irrigation_in">Irrigation IN</option>
              </select>
            </div>
            <div>
              <Input
                placeholder="Description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Amount (mL)"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
              />
            </div>
            <Button onClick={addEntry} disabled={!newDescription || !newAmount}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Entries List */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recorded Entries</Label>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    entry.type === 'irrigation_in' 
                      ? 'bg-teal-50 border border-teal-200' 
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      entry.type === 'irrigation_in' 
                        ? 'bg-teal-200 text-teal-800' 
                        : 'bg-blue-200 text-blue-800'
                    }`}>
                      {entry.type === 'irrigation_in' ? 'IRRIGATION IN' : 'DRAINAGE OUT'}
                    </span>
                    <span className="ml-2 text-sm">{entry.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{entry.amount} mL</span>
                    <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)}>
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={entries.length === 0} className="flex-1">
            Calculate True Urine Output
          </Button>
          <Button onClick={handleReset} variant="outline">Reset All</Button>
        </div>

        {showResults && entries.length > 0 && (
          <div className="space-y-4 pt-4">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
                <p className="text-xs text-teal-700 font-medium">Irrigation IN</p>
                <p className="text-xl font-bold text-teal-800">{totalIrrigationIn.toLocaleString()} mL</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-xs text-blue-700 font-medium">Drainage OUT</p>
                <p className="text-xl font-bold text-blue-800">{totalDrainageOut.toLocaleString()} mL</p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center col-span-2">
                <p className="text-xs text-purple-700 font-medium">TRUE URINE OUTPUT</p>
                <p className="text-3xl font-bold text-purple-800">{trueUrineOutput.toLocaleString()} mL</p>
                <p className="text-xs text-purple-600 mt-1">over {hoursNum} hours</p>
              </div>
            </div>

            {/* Urine Output per kg/hr */}
            {weightNum > 0 && (
              <div className={`p-6 rounded-lg border ${interpretation.color}`}>
                <div className="text-center">
                  <p className="text-4xl font-bold">{urineOutputPerKgHr.toFixed(2)}</p>
                  <p className="text-lg font-semibold mt-1">mL/kg/hr</p>
                  <p className="text-xl font-bold mt-2">{interpretation.category}</p>
                  <p className="text-sm mt-2">{interpretation.description}</p>
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Urine Output Reference (Adults)</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>Anuria:</strong> &lt;100 mL/day or &lt;0.05 mL/kg/hr</li>
                  <li>• <strong>Oliguria:</strong> &lt;0.5 mL/kg/hr (KDIGO AKI criterion)</li>
                  <li>• <strong>Normal:</strong> 0.5-1.0 mL/kg/hr</li>
                  <li>• <strong>Polyuria:</strong> &gt;2.5 mL/kg/hr</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">CBI Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Monitor for clot retention if drainage decreases suddenly</li>
                  <li>• Pink-tinged output is expected post-TURP/TURBT</li>
                  <li>• Bright red output or clots may require manual irrigation</li>
                  <li>• Ensure catheter patency if output drops</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrueUrineOutputCalculator;
