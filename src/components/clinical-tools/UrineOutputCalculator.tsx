import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Droplets, Plus, Trash2 } from 'lucide-react';

interface FluidEntry {
  id: string;
  type: 'intake' | 'output';
  description: string;
  amount: number;
}

const UrineOutputCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [entries, setEntries] = useState<FluidEntry[]>([]);
  const [newDescription, setNewDescription] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'intake' | 'output'>('output');
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

  const totalIntake = entries.filter(e => e.type === 'intake').reduce((sum, e) => sum + e.amount, 0);
  const totalOutput = entries.filter(e => e.type === 'output').reduce((sum, e) => sum + e.amount, 0);
  const fluidBalance = totalIntake - totalOutput;

  const weightNum = parseFloat(weight) || 0;
  const urineOutputPerKg = weightNum > 0 ? totalOutput / weightNum / 24 : 0; // mL/kg/hr assuming 24hr

  const getUrineOutputInterpretation = () => {
    // Normal adult urine output: 0.5-1.0 mL/kg/hr
    if (urineOutputPerKg < 0.3) {
      return {
        category: 'Severe Oliguria / Anuria',
        description: 'Critically low output. Evaluate for AKI, obstruction, hypovolemia.',
        color: 'bg-red-100 text-red-800 border-red-200'
      };
    } else if (urineOutputPerKg < 0.5) {
      return {
        category: 'Oliguria',
        description: 'Below normal. Consider fluid status, renal function, medications.',
        color: 'bg-orange-100 text-orange-800 border-orange-200'
      };
    } else if (urineOutputPerKg <= 1.0) {
      return {
        category: 'Normal',
        description: 'Adequate urine output.',
        color: 'bg-green-100 text-green-800 border-green-200'
      };
    } else if (urineOutputPerKg <= 2.5) {
      return {
        category: 'Elevated',
        description: 'Higher than expected. May be appropriate with diuretics or fluid resuscitation.',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200'
      };
    } else {
      return {
        category: 'Polyuria',
        description: 'Very high output. Evaluate for diabetes insipidus, hyperglycemia, diuretic use.',
        color: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    }
  };

  const interpretation = getUrineOutputInterpretation();

  const handleReset = () => {
    setWeight('');
    setEntries([]);
    setShowResults(false);
  };

  const quickAddOutput = (desc: string, amt: number) => {
    setEntries([
      ...entries,
      { id: Date.now().toString(), type: 'output', description: desc, amount: amt }
    ]);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Droplets className="h-5 w-5" />
          Urine Output & Fluid Balance Calculator
        </CardTitle>
        <p className="text-sky-100 text-sm mt-1">
          24-hour intake/output tracking with urine output per kg/hr calculation
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Weight */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Patient Weight (kg)</Label>
          <Input
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g., 70"
            className="max-w-xs"
          />
          <p className="text-xs text-muted-foreground">Required for mL/kg/hr calculation</p>
        </div>

        {/* Quick Add Outputs */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Add (Output)</Label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Void 200mL', amount: 200 },
              { label: 'Void 300mL', amount: 300 },
              { label: 'Void 400mL', amount: 400 },
              { label: 'Foley 500mL', amount: 500 },
              { label: 'Foley 1000mL', amount: 1000 },
            ].map((item) => (
              <Button
                key={item.label}
                variant="outline"
                size="sm"
                onClick={() => quickAddOutput(item.label, item.amount)}
              >
                + {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Manual Entry */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <Label className="text-sm font-medium">Manual Entry</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as 'intake' | 'output')}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="output">Output</option>
                <option value="intake">Intake</option>
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
                    entry.type === 'intake' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                      entry.type === 'intake' ? 'bg-green-200 text-green-800' : 'bg-blue-200 text-blue-800'
                    }`}>
                      {entry.type === 'intake' ? 'IN' : 'OUT'}
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
            Calculate Balance
          </Button>
          <Button onClick={handleReset} variant="outline">Reset All</Button>
        </div>

        {showResults && entries.length > 0 && (
          <div className="space-y-4 pt-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm text-green-700 font-medium">Total Intake</p>
                <p className="text-2xl font-bold text-green-800">{totalIntake} mL</p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <p className="text-sm text-blue-700 font-medium">Total Output</p>
                <p className="text-2xl font-bold text-blue-800">{totalOutput} mL</p>
              </div>
              <div className={`p-4 rounded-lg text-center border ${
                fluidBalance > 0 ? 'bg-green-50 border-green-200' : fluidBalance < 0 ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <p className="text-sm font-medium">Net Balance</p>
                <p className={`text-2xl font-bold ${fluidBalance > 0 ? 'text-green-800' : fluidBalance < 0 ? 'text-red-800' : 'text-gray-800'}`}>
                  {fluidBalance > 0 ? '+' : ''}{fluidBalance} mL
                </p>
              </div>
            </div>

            {/* Urine Output per kg/hr */}
            {weightNum > 0 && (
              <div className={`p-6 rounded-lg border ${interpretation.color}`}>
                <div className="text-center">
                  <p className="text-4xl font-bold">{urineOutputPerKg.toFixed(2)}</p>
                  <p className="text-lg font-semibold mt-1">mL/kg/hr (24hr avg)</p>
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
                  <li>• <strong>Normal:</strong> 0.5-1.0 mL/kg/hr (800-2000 mL/day)</li>
                  <li>• <strong>Polyuria:</strong> &gt;3 L/day or &gt;2.5 mL/kg/hr</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Clinical Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Assumes 24-hour collection period</li>
                  <li>• Insensible losses (~500-1000 mL/day) not included</li>
                  <li>• Consider additional losses: drains, NG output, wounds</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UrineOutputCalculator;
