import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, RotateCcw, Info, Calculator } from 'lucide-react';

const IVDripRateCalculator = () => {
  const [volume, setVolume] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('hours');
  const [dropFactor, setDropFactor] = useState('');

  const calculateRates = () => {
    const vol = parseFloat(volume);
    const t = parseFloat(time);
    const df = parseFloat(dropFactor);

    if (!vol || !t || vol <= 0 || t <= 0) return null;

    // Convert time to hours
    const timeInHours = timeUnit === 'minutes' ? t / 60 : t;
    const timeInMinutes = timeUnit === 'minutes' ? t : t * 60;

    // mL/hr rate
    const mlPerHour = vol / timeInHours;

    // gtt/min rate (if drop factor provided)
    let gttPerMin = null;
    if (df && df > 0) {
      gttPerMin = (vol * df) / timeInMinutes;
    }

    return {
      mlPerHour: Math.round(mlPerHour * 10) / 10,
      gttPerMin: gttPerMin ? Math.round(gttPerMin * 10) / 10 : null
    };
  };

  const result = calculateRates();

  const resetForm = () => {
    setVolume('');
    setTime('');
    setTimeUnit('hours');
    setDropFactor('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Droplets className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">IV Drip Rate Calculator</CardTitle>
            <CardDescription className="text-sky-100">
              Calculate mL/hr and gtt/min for IV infusions
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-2">
            <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Formulas:</p>
              <ul className="space-y-1">
                <li>• <strong>mL/hr</strong> = Volume (mL) ÷ Time (hours)</li>
                <li>• <strong>gtt/min</strong> = Volume (mL) × Drop Factor ÷ Time (min)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="volume">Total Volume (mL)</Label>
            <Input
              id="volume"
              type="number"
              placeholder="e.g., 1000"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Infusion Time</Label>
            <div className="flex gap-2">
              <Input
                id="time"
                type="number"
                placeholder="e.g., 8"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                min="0"
                className="flex-1"
              />
              <Select value={timeUnit} onValueChange={setTimeUnit}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">hours</SelectItem>
                  <SelectItem value="minutes">minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dropFactor">Drop Factor (gtt/mL) - Optional</Label>
            <Select value={dropFactor} onValueChange={setDropFactor}>
              <SelectTrigger>
                <SelectValue placeholder="Select tubing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Macrodrip: 10 gtt/mL</SelectItem>
                <SelectItem value="15">Macrodrip: 15 gtt/mL</SelectItem>
                <SelectItem value="20">Macrodrip: 20 gtt/mL</SelectItem>
                <SelectItem value="60">Microdrip: 60 gtt/mL</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Required for gtt/min calculation</p>
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 p-6 rounded-lg border border-sky-200 dark:border-sky-800">
              <h3 className="font-semibold text-lg text-sky-800 dark:text-sky-200 mb-4">
                IV Rate Results
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                  <p className="text-sm text-muted-foreground">Pump Rate</p>
                  <p className="text-3xl font-bold text-sky-600">{result.mlPerHour}</p>
                  <p className="text-sm font-medium">mL/hr</p>
                </div>
                {result.gttPerMin !== null ? (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm text-center">
                    <p className="text-sm text-muted-foreground">Manual Rate</p>
                    <p className="text-3xl font-bold text-blue-600">{result.gttPerMin}</p>
                    <p className="text-sm font-medium">gtt/min</p>
                  </div>
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg text-center flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">Select drop factor for gtt/min</p>
                  </div>
                )}
              </div>
            </div>

            {result.gttPerMin !== null && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Counting Tip:</strong> Count drops for 15 seconds and multiply by 4, 
                  or count for 1 minute directly. Target: ~{Math.round(result.gttPerMin / 4)} drops per 15 seconds.
                </p>
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

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-1">Common Drop Factors:</p>
              <ul className="space-y-1">
                <li>• <strong>Macrodrip (10, 15, 20 gtt/mL):</strong> Large volumes, rapid infusions</li>
                <li>• <strong>Microdrip (60 gtt/mL):</strong> Pediatric, precise medication delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IVDripRateCalculator;
