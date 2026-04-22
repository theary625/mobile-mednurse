import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Info, RotateCcw, Droplets, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FluidEntry {
  id: string;
  type: string;
  amount: number;
  time: string;
}

const intakeTypes = [
  'IV Fluids', 'PO Fluids', 'Tube Feeding', 'IV Medications', 'Blood Products', 'Other Intake'
];

const outputTypes = [
  'Urine', 'Emesis', 'Stool', 'NG Drainage', 'Chest Tube', 'Wound Drainage', 'Blood Loss', 'Other Output'
];

const IntakeOutputCalculator = () => {
  const [intakeEntries, setIntakeEntries] = useState<FluidEntry[]>([]);
  const [outputEntries, setOutputEntries] = useState<FluidEntry[]>([]);
  const [newIntake, setNewIntake] = useState({ type: '', amount: '', time: '' });
  const [newOutput, setNewOutput] = useState({ type: '', amount: '', time: '' });
  const [patientWeight, setPatientWeight] = useState('');

  const addIntake = () => {
    if (newIntake.type && newIntake.amount) {
      setIntakeEntries(prev => [...prev, {
        id: Date.now().toString(),
        type: newIntake.type,
        amount: parseFloat(newIntake.amount),
        time: newIntake.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewIntake({ type: '', amount: '', time: '' });
    }
  };

  const addOutput = () => {
    if (newOutput.type && newOutput.amount) {
      setOutputEntries(prev => [...prev, {
        id: Date.now().toString(),
        type: newOutput.type,
        amount: parseFloat(newOutput.amount),
        time: newOutput.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewOutput({ type: '', amount: '', time: '' });
    }
  };

  const removeIntake = (id: string) => {
    setIntakeEntries(prev => prev.filter(e => e.id !== id));
  };

  const removeOutput = (id: string) => {
    setOutputEntries(prev => prev.filter(e => e.id !== id));
  };

  const totalIntake = intakeEntries.reduce((sum, e) => sum + e.amount, 0);
  const totalOutput = outputEntries.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalIntake - totalOutput;
  const weight = parseFloat(patientWeight) || 0;
  const urineOutput = outputEntries.filter(e => e.type === 'Urine').reduce((sum, e) => sum + e.amount, 0);

  const getBalanceInterpretation = () => {
    if (netBalance > 1000) {
      return { status: 'Positive Balance', color: 'text-yellow-600 dark:text-yellow-400', message: 'Significant positive fluid balance. Monitor for fluid overload.' };
    } else if (netBalance < -1000) {
      return { status: 'Negative Balance', color: 'text-orange-600 dark:text-orange-400', message: 'Significant negative balance. Assess for dehydration.' };
    } else if (netBalance >= -500 && netBalance <= 500) {
      return { status: 'Balanced', color: 'text-green-600 dark:text-green-400', message: 'Fluid balance within normal range.' };
    } else if (netBalance > 500) {
      return { status: 'Mildly Positive', color: 'text-blue-600 dark:text-blue-400', message: 'Mild positive balance. Continue monitoring.' };
    } else {
      return { status: 'Mildly Negative', color: 'text-blue-600 dark:text-blue-400', message: 'Mild negative balance. Continue monitoring.' };
    }
  };

  const handleReset = () => {
    setIntakeEntries([]);
    setOutputEntries([]);
    setPatientWeight('');
  };

  const interpretation = getBalanceInterpretation();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Intake & Output Calculator</CardTitle>
            <p className="text-blue-100 text-sm mt-1">Fluid Balance Tracking</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Instructions:</strong> Track all fluid intake and output over the shift or 24-hour period. 
            Enter patient weight for urine output calculations (target: 0.5-1 mL/kg/hr for adults).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Patient Weight (kg) - Optional</Label>
            <Input
              type="number"
              value={patientWeight}
              onChange={(e) => setPatientWeight(e.target.value)}
              placeholder="e.g., 70"
            />
          </div>
        </div>

        {/* Intake Section */}
        <div className="space-y-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="font-semibold text-green-800 dark:text-green-200 flex items-center gap-2">
            <Plus className="h-4 w-4" /> INTAKE
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Select value={newIntake.type} onValueChange={(val) => setNewIntake(prev => ({ ...prev, type: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {intakeTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={newIntake.amount}
              onChange={(e) => setNewIntake(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount (mL)"
            />
            <Input
              type="time"
              value={newIntake.time}
              onChange={(e) => setNewIntake(prev => ({ ...prev, time: e.target.value }))}
            />
            <Button onClick={addIntake} disabled={!newIntake.type || !newIntake.amount}>
              Add
            </Button>
          </div>
          {intakeEntries.length > 0 && (
            <div className="space-y-1 mt-2">
              {intakeEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between text-sm bg-white dark:bg-black/20 p-2 rounded">
                  <span>{entry.time} - {entry.type}: {entry.amount} mL</span>
                  <Button variant="ghost" size="sm" onClick={() => removeIntake(entry.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="font-semibold text-green-700 dark:text-green-300 pt-2 border-t">
                Total Intake: {totalIntake} mL
              </div>
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="space-y-4 p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
          <h3 className="font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
            <Droplets className="h-4 w-4" /> OUTPUT
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <Select value={newOutput.type} onValueChange={(val) => setNewOutput(prev => ({ ...prev, type: val }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {outputTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={newOutput.amount}
              onChange={(e) => setNewOutput(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount (mL)"
            />
            <Input
              type="time"
              value={newOutput.time}
              onChange={(e) => setNewOutput(prev => ({ ...prev, time: e.target.value }))}
            />
            <Button onClick={addOutput} disabled={!newOutput.type || !newOutput.amount}>
              Add
            </Button>
          </div>
          {outputEntries.length > 0 && (
            <div className="space-y-1 mt-2">
              {outputEntries.map(entry => (
                <div key={entry.id} className="flex items-center justify-between text-sm bg-white dark:bg-black/20 p-2 rounded">
                  <span>{entry.time} - {entry.type}: {entry.amount} mL</span>
                  <Button variant="ghost" size="sm" onClick={() => removeOutput(entry.id)}>
                    <Trash2 className="h-3 w-3 text-destructive" />
                  </Button>
                </div>
              ))}
              <div className="font-semibold text-red-700 dark:text-red-300 pt-2 border-t">
                Total Output: {totalOutput} mL
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {(intakeEntries.length > 0 || outputEntries.length > 0) && (
          <div className={`p-6 rounded-lg border ${
            netBalance > 500 ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800' :
            netBalance < -500 ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800' :
            'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
          }`}>
            <div className="text-center space-y-2">
              <p className="text-3xl font-bold">
                {netBalance >= 0 ? '+' : ''}{netBalance} mL
              </p>
              <p className={`font-semibold ${interpretation.color}`}>{interpretation.status}</p>
              <p className="text-sm text-muted-foreground">{interpretation.message}</p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t text-center text-sm">
              <div>
                <p className="font-semibold text-green-600 dark:text-green-400">{totalIntake} mL</p>
                <p className="text-muted-foreground">Total In</p>
              </div>
              <div>
                <p className="font-semibold text-red-600 dark:text-red-400">{totalOutput} mL</p>
                <p className="text-muted-foreground">Total Out</p>
              </div>
              <div>
                <p className="font-semibold">{urineOutput} mL</p>
                <p className="text-muted-foreground">Urine</p>
              </div>
            </div>
            {weight > 0 && urineOutput > 0 && (
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-sm">
                  <strong>Urine Output Rate:</strong> {(urineOutput / weight / 8).toFixed(2)} mL/kg/hr (assuming 8hr shift)
                </p>
                <p className="text-xs text-muted-foreground mt-1">Target: 0.5-1 mL/kg/hr for adults</p>
              </div>
            )}
          </div>
        )}

        <Button variant="outline" onClick={handleReset} className="w-full gap-2">
          <RotateCcw className="h-4 w-4" />
          Clear All Entries
        </Button>

        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-semibold">Clinical Guidelines</p>
            <ul className="mt-1 space-y-1 list-disc list-inside">
              <li>Normal urine output: 0.5-1 mL/kg/hr (adults)</li>
              <li>Oliguria: &lt;0.5 mL/kg/hr or &lt;400 mL/24hr</li>
              <li>Insensible losses: ~500-1000 mL/day (fever increases)</li>
              <li>Consider all sources: IV, PO, drains, wounds</li>
            </ul>
          </div>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Note:</strong> This calculator is for tracking purposes. Clinical decisions should consider patient's overall condition, comorbidities, and treatment goals.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntakeOutputCalculator;
