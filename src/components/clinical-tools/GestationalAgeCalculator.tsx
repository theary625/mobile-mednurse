import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Calendar } from 'lucide-react';

const GestationalAgeCalculator: React.FC = () => {
  const [lmpDate, setLmpDate] = useState('');
  const [usDate, setUsDate] = useState('');
  const [usWeeks, setUsWeeks] = useState('');
  const [usDays, setUsDays] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [calcMethod, setCalcMethod] = useState('lmp');

  const calculateFromLMP = () => {
    if (!lmpDate) return null;

    const lmp = new Date(lmpDate);
    const today = new Date();
    const diffTime = today.getTime() - lmp.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return null;

    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;

    // Calculate EDD (Naegele's rule: LMP + 280 days)
    const edd = new Date(lmp);
    edd.setDate(edd.getDate() + 280);

    // Trimester
    let trimester = '';
    if (weeks < 14) trimester = 'First Trimester';
    else if (weeks < 28) trimester = 'Second Trimester';
    else trimester = 'Third Trimester';

    // Days remaining
    const daysRemaining = Math.max(0, Math.floor((edd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    return {
      weeks,
      days,
      totalDays: diffDays,
      edd: edd.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      trimester,
      daysRemaining,
      method: 'LMP'
    };
  };

  const calculateFromUS = () => {
    if (!usDate || !usWeeks) return null;

    const usDateObj = new Date(usDate);
    const today = new Date();
    const gaAtUS = parseInt(usWeeks) * 7 + (parseInt(usDays) || 0);

    const diffTime = today.getTime() - usDateObj.getTime();
    const daysSinceUS = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const currentGA = gaAtUS + daysSinceUS;

    if (currentGA < 0) return null;

    const weeks = Math.floor(currentGA / 7);
    const days = currentGA % 7;

    // Calculate EDD from US-derived GA
    const daysToEDD = 280 - currentGA;
    const edd = new Date(today);
    edd.setDate(edd.getDate() + daysToEDD);

    // Trimester
    let trimester = '';
    if (weeks < 14) trimester = 'First Trimester';
    else if (weeks < 28) trimester = 'Second Trimester';
    else trimester = 'Third Trimester';

    const daysRemaining = Math.max(0, daysToEDD);

    return {
      weeks,
      days,
      totalDays: currentGA,
      edd: edd.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      trimester,
      daysRemaining,
      method: 'Ultrasound'
    };
  };

  const result = showResults ? (calcMethod === 'lmp' ? calculateFromLMP() : calculateFromUS()) : null;

  const resetForm = () => {
    setLmpDate('');
    setUsDate('');
    setUsWeeks('');
    setUsDays('');
    setShowResults(false);
  };

  const isValidLMP = lmpDate;
  const isValidUS = usDate && usWeeks;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Gestational Age Calculator
        </CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Calculate GA and EDD from LMP or Ultrasound
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={calcMethod} onValueChange={(v) => { setCalcMethod(v); setShowResults(false); }}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="lmp">From LMP</TabsTrigger>
            <TabsTrigger value="us">From Ultrasound</TabsTrigger>
          </TabsList>

          <TabsContent value="lmp" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="lmp">Last Menstrual Period (LMP)</Label>
              <Input
                id="lmp"
                type="date"
                value={lmpDate}
                onChange={(e) => setLmpDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">First day of last menstrual period</p>
            </div>
            <Button onClick={() => setShowResults(true)} disabled={!isValidLMP} className="w-full">
              Calculate from LMP
            </Button>
          </TabsContent>

          <TabsContent value="us" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="usdate">Ultrasound Date</Label>
              <Input
                id="usdate"
                type="date"
                value={usDate}
                onChange={(e) => setUsDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="usweeks">GA at Ultrasound (weeks)</Label>
                <Input
                  id="usweeks"
                  type="number"
                  min="0"
                  max="45"
                  value={usWeeks}
                  onChange={(e) => setUsWeeks(e.target.value)}
                  placeholder="e.g., 12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usdays">Days</Label>
                <Input
                  id="usdays"
                  type="number"
                  min="0"
                  max="6"
                  value={usDays}
                  onChange={(e) => setUsDays(e.target.value)}
                  placeholder="0-6"
                />
              </div>
            </div>
            <Button onClick={() => setShowResults(true)} disabled={!isValidUS} className="w-full">
              Calculate from Ultrasound
            </Button>
          </TabsContent>
        </Tabs>

        <Button onClick={resetForm} variant="outline" className="w-full">Reset</Button>

        {result && (
          <div className="space-y-4">
            <div className="p-6 rounded-lg border bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
              <div className="text-center mb-4">
                <p className="text-5xl font-bold text-violet-700">
                  {result.weeks}<span className="text-2xl">w</span> {result.days}<span className="text-2xl">d</span>
                </p>
                <p className="text-sm text-violet-600 font-medium mt-1">Gestational Age</p>
                <p className="text-xs text-muted-foreground">Based on {result.method}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Estimated Due Date</p>
                  <p className="font-semibold text-sm">{result.edd}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Trimester</p>
                  <p className="font-semibold text-sm">{result.trimester}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Days Remaining</p>
                  <p className="font-semibold text-sm">{result.daysRemaining} days</p>
                </div>
                <div className="p-3 bg-white rounded-lg border">
                  <p className="text-xs text-muted-foreground">Total Days Pregnant</p>
                  <p className="font-semibold text-sm">{result.totalDays} days</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="font-semibold text-sm mb-2">Trimester Definitions:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>First:</strong> 0-13 weeks 6 days</li>
            <li><strong>Second:</strong> 14-27 weeks 6 days</li>
            <li><strong>Third:</strong> 28 weeks to delivery</li>
          </ul>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            <strong>Clinical Note:</strong> First trimester ultrasound (CRL) is most accurate for dating (±5-7 days). 
            When US and LMP differ by &gt;7 days in T1, US dating is preferred.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GestationalAgeCalculator;
