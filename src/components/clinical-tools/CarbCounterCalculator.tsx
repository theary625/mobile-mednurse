import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Info, Apple, Plus, Trash2 } from 'lucide-react';

interface FoodEntry {
  id: string;
  name: string;
  carbs: number;
  servings: number;
}

const commonFoods = [
  { name: 'Bread (1 slice)', carbs: 15 },
  { name: 'Rice (1/3 cup)', carbs: 15 },
  { name: 'Pasta (1/3 cup)', carbs: 15 },
  { name: 'Apple (small)', carbs: 15 },
  { name: 'Banana (small)', carbs: 15 },
  { name: 'Orange (medium)', carbs: 15 },
  { name: 'Milk (1 cup)', carbs: 12 },
  { name: 'Juice (1/2 cup)', carbs: 15 },
  { name: 'Potato (small)', carbs: 15 },
  { name: 'Corn (1/2 cup)', carbs: 15 },
  { name: 'Beans (1/2 cup)', carbs: 15 },
  { name: 'Cereal (3/4 cup)', carbs: 15 },
];

const CarbCounterCalculator: React.FC = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [customName, setCustomName] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customServings, setCustomServings] = useState('1');
  const [carbRatio, setCarbRatio] = useState('');
  const [targetCarbs, setTargetCarbs] = useState('');
  const [showResults, setShowResults] = useState(false);

  const addFood = (name: string, carbs: number) => {
    setEntries([
      ...entries,
      { id: Date.now().toString(), name, carbs, servings: 1 }
    ]);
  };

  const addCustomFood = () => {
    if (customName && customCarbs) {
      setEntries([
        ...entries,
        {
          id: Date.now().toString(),
          name: customName,
          carbs: parseFloat(customCarbs),
          servings: parseFloat(customServings) || 1
        }
      ]);
      setCustomName('');
      setCustomCarbs('');
      setCustomServings('1');
    }
  };

  const updateServings = (id: string, servings: number) => {
    setEntries(entries.map(e => 
      e.id === id ? { ...e, servings: Math.max(0.25, servings) } : e
    ));
  };

  const removeEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const totalCarbs = entries.reduce((sum, e) => sum + (e.carbs * e.servings), 0);
  const carbRatioNum = parseFloat(carbRatio) || 0;
  const targetCarbsNum = parseFloat(targetCarbs) || 0;
  const insulinDose = carbRatioNum > 0 ? totalCarbs / carbRatioNum : 0;
  const carbsRemaining = targetCarbsNum > 0 ? targetCarbsNum - totalCarbs : 0;

  const handleReset = () => {
    setEntries([]);
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Apple className="h-5 w-5" />
          Carbohydrate Counter
        </CardTitle>
        <p className="text-orange-100 text-sm mt-1">
          Track carbohydrate intake for meal planning and insulin dosing
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Optional Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Insulin-to-Carb Ratio (optional)</Label>
            <Input
              type="number"
              step="1"
              value={carbRatio}
              onChange={(e) => setCarbRatio(e.target.value)}
              placeholder="e.g., 10 (1 unit per 10g carbs)"
            />
            <p className="text-xs text-muted-foreground">For insulin dose calculation</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target Carbs per Meal (optional)</Label>
            <Input
              type="number"
              step="5"
              value={targetCarbs}
              onChange={(e) => setTargetCarbs(e.target.value)}
              placeholder="e.g., 45"
            />
            <p className="text-xs text-muted-foreground">Track against your goal</p>
          </div>
        </div>

        {/* Quick Add Common Foods */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Quick Add (1 serving = ~15g carbs)</Label>
          <div className="flex flex-wrap gap-2">
            {commonFoods.slice(0, 8).map((food) => (
              <Button
                key={food.name}
                variant="outline"
                size="sm"
                onClick={() => addFood(food.name, food.carbs)}
              >
                + {food.name}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonFoods.slice(8).map((food) => (
              <Button
                key={food.name}
                variant="outline"
                size="sm"
                onClick={() => addFood(food.name, food.carbs)}
              >
                + {food.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Entry */}
        <div className="p-4 bg-muted/30 rounded-lg space-y-4">
          <Label className="text-sm font-medium">Add Custom Food</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Input
                placeholder="Food name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                placeholder="Carbs (g)"
                value={customCarbs}
                onChange={(e) => setCustomCarbs(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="number"
                step="0.25"
                placeholder="Servings"
                value={customServings}
                onChange={(e) => setCustomServings(e.target.value)}
              />
            </div>
            <Button onClick={addCustomFood} disabled={!customName || !customCarbs}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Food Entries */}
        {entries.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Food Log</Label>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-orange-50 border border-orange-200"
                >
                  <div className="flex-1">
                    <span className="font-medium">{entry.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      ({entry.carbs}g per serving)
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateServings(entry.id, entry.servings - 0.5)}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-medium">{entry.servings}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => updateServings(entry.id, entry.servings + 0.5)}
                      >
                        +
                      </Button>
                    </div>
                    <span className="font-bold text-orange-700 w-16 text-right">
                      {(entry.carbs * entry.servings).toFixed(0)}g
                    </span>
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
            Calculate Total
          </Button>
          <Button onClick={handleReset} variant="outline">Reset</Button>
        </div>

        {showResults && entries.length > 0 && (
          <div className="space-y-4 pt-4">
            {/* Total Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-orange-100 border border-orange-300 rounded-lg text-center col-span-1 md:col-span-1">
                <p className="text-sm text-orange-700 font-medium">Total Carbohydrates</p>
                <p className="text-4xl font-bold text-orange-800">{totalCarbs.toFixed(0)}g</p>
              </div>
              
              {carbRatioNum > 0 && (
                <div className="p-6 bg-blue-100 border border-blue-300 rounded-lg text-center">
                  <p className="text-sm text-blue-700 font-medium">Suggested Insulin</p>
                  <p className="text-4xl font-bold text-blue-800">{insulinDose.toFixed(1)} units</p>
                  <p className="text-xs text-blue-600 mt-1">Based on 1:{carbRatioNum} ratio</p>
                </div>
              )}
              
              {targetCarbsNum > 0 && (
                <div className={`p-6 rounded-lg text-center border ${
                  carbsRemaining >= 0 
                    ? 'bg-green-100 border-green-300' 
                    : 'bg-red-100 border-red-300'
                }`}>
                  <p className={`text-sm font-medium ${carbsRemaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    {carbsRemaining >= 0 ? 'Carbs Remaining' : 'Over Target'}
                  </p>
                  <p className={`text-4xl font-bold ${carbsRemaining >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    {Math.abs(carbsRemaining).toFixed(0)}g
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Carb Counting Reference</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>1 Carb Choice:</strong> ~15g carbohydrates</li>
                  <li>• <strong>Typical meal:</strong> 45-60g carbs (3-4 choices)</li>
                  <li>• <strong>Typical snack:</strong> 15-30g carbs (1-2 choices)</li>
                  <li>• <strong>ADA recommendation:</strong> Individualized based on needs</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Important Notes</p>
                <ul className="mt-1 space-y-1">
                  <li>• Always verify insulin doses with healthcare provider</li>
                  <li>• Consider correction factor for blood glucose adjustments</li>
                  <li>• Account for fiber (net carbs = total carbs - fiber)</li>
                  <li>• Individual carb ratios vary throughout the day</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarbCounterCalculator;
