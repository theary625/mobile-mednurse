import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Scale, ArrowRightLeft, RotateCcw } from 'lucide-react';

const WeightConverter = () => {
  const [pounds, setPounds] = useState<string>('');
  const [kilograms, setKilograms] = useState<string>('');

  const lbsToKg = (lbs: number) => lbs * 0.453592;
  const kgToLbs = (kg: number) => kg / 0.453592;

  const handlePoundsChange = (value: string) => {
    setPounds(value);
    if (value && !isNaN(parseFloat(value))) {
      setKilograms(lbsToKg(parseFloat(value)).toFixed(2));
    } else {
      setKilograms('');
    }
  };

  const handleKilogramsChange = (value: string) => {
    setKilograms(value);
    if (value && !isNaN(parseFloat(value))) {
      setPounds(kgToLbs(parseFloat(value)).toFixed(2));
    } else {
      setPounds('');
    }
  };

  const reset = () => {
    setPounds('');
    setKilograms('');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="w-5 h-5 text-primary" />
            Weight Converter (lbs ↔ kg)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="pounds">Pounds (lbs)</Label>
              <Input
                id="pounds"
                type="number"
                step="0.1"
                placeholder="150"
                value={pounds}
                onChange={(e) => handlePoundsChange(e.target.value)}
              />
            </div>
            <ArrowRightLeft className="w-5 h-5 text-muted-foreground mb-2" />
            <div className="space-y-2">
              <Label htmlFor="kilograms">Kilograms (kg)</Label>
              <Input
                id="kilograms"
                type="number"
                step="0.1"
                placeholder="68"
                value={kilograms}
                onChange={(e) => handleKilogramsChange(e.target.value)}
              />
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Quick Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="p-2 bg-muted rounded">100 lbs = 45.4 kg</div>
            <div className="p-2 bg-muted rounded">50 kg = 110.2 lbs</div>
            <div className="p-2 bg-muted rounded">150 lbs = 68.0 kg</div>
            <div className="p-2 bg-muted rounded">75 kg = 165.3 lbs</div>
            <div className="p-2 bg-muted rounded">200 lbs = 90.7 kg</div>
            <div className="p-2 bg-muted rounded">100 kg = 220.5 lbs</div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Formula: 1 lb = 0.453592 kg | 1 kg = 2.20462 lbs
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightConverter;
