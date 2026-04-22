import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Thermometer, ArrowRightLeft, RotateCcw } from 'lucide-react';

const TemperatureConverter = () => {
  const [fahrenheit, setFahrenheit] = useState<string>('');
  const [celsius, setCelsius] = useState<string>('');

  const convertToC = (f: number) => ((f - 32) * 5) / 9;
  const convertToF = (c: number) => (c * 9) / 5 + 32;

  const handleFahrenheitChange = (value: string) => {
    setFahrenheit(value);
    if (value && !isNaN(parseFloat(value))) {
      setCelsius(convertToC(parseFloat(value)).toFixed(1));
    } else {
      setCelsius('');
    }
  };

  const handleCelsiusChange = (value: string) => {
    setCelsius(value);
    if (value && !isNaN(parseFloat(value))) {
      setFahrenheit(convertToF(parseFloat(value)).toFixed(1));
    } else {
      setFahrenheit('');
    }
  };

  const reset = () => {
    setFahrenheit('');
    setCelsius('');
  };

  const getFeverStatus = (tempC: number) => {
    if (tempC >= 40) return { status: 'High Fever', color: 'text-destructive', bg: 'bg-destructive/10' };
    if (tempC >= 38) return { status: 'Fever', color: 'text-orange-600', bg: 'bg-orange-100' };
    if (tempC >= 37.5) return { status: 'Low-Grade Fever', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (tempC >= 36) return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
    if (tempC >= 35) return { status: 'Low', color: 'text-blue-600', bg: 'bg-blue-100' };
    return { status: 'Hypothermia', color: 'text-blue-800', bg: 'bg-blue-200' };
  };

  const tempC = celsius ? parseFloat(celsius) : null;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Thermometer className="w-5 h-5 text-primary" />
            Temperature Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-[1fr,auto,1fr] gap-3 items-end">
            <div className="space-y-2">
              <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
              <Input
                id="fahrenheit"
                type="number"
                step="0.1"
                placeholder="98.6"
                value={fahrenheit}
                onChange={(e) => handleFahrenheitChange(e.target.value)}
              />
            </div>
            <ArrowRightLeft className="w-5 h-5 text-muted-foreground mb-2" />
            <div className="space-y-2">
              <Label htmlFor="celsius">Celsius (°C)</Label>
              <Input
                id="celsius"
                type="number"
                step="0.1"
                placeholder="37.0"
                value={celsius}
                onChange={(e) => handleCelsiusChange(e.target.value)}
              />
            </div>
          </div>

          {tempC !== null && !isNaN(tempC) && (
            <div className={`p-3 rounded-lg ${getFeverStatus(tempC).bg}`}>
              <p className={`font-medium ${getFeverStatus(tempC).color}`}>
                {getFeverStatus(tempC).status}
              </p>
            </div>
          )}

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
            <div className="p-2 bg-muted rounded">97.0°F = 36.1°C</div>
            <div className="p-2 bg-muted rounded">98.6°F = 37.0°C</div>
            <div className="p-2 bg-muted rounded">100.4°F = 38.0°C</div>
            <div className="p-2 bg-muted rounded">101.3°F = 38.5°C</div>
            <div className="p-2 bg-muted rounded">102.2°F = 39.0°C</div>
            <div className="p-2 bg-muted rounded">104.0°F = 40.0°C</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemperatureConverter;
