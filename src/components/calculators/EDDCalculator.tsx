import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Info, Baby } from 'lucide-react';
import { format, addDays, addWeeks, differenceInDays, differenceInWeeks } from 'date-fns';
import { cn } from '@/lib/utils';

interface EDDResult {
  edd: Date;
  currentGA: { weeks: number; days: number };
  trimester: string;
  milestones: { name: string; date: Date; weeks: number }[];
}

const EDDCalculator: React.FC = () => {
  const [method, setMethod] = useState<'lmp' | 'conception' | 'ultrasound'>('lmp');
  const [lmpDate, setLmpDate] = useState<Date | undefined>(undefined);
  const [conceptionDate, setConceptionDate] = useState<Date | undefined>(undefined);
  const [usDate, setUsDate] = useState<Date | undefined>(undefined);
  const [usWeeks, setUsWeeks] = useState('');
  const [usDays, setUsDays] = useState('');
  const [result, setResult] = useState<EDDResult | null>(null);

  const calculate = () => {
    const today = new Date();
    let edd: Date;
    let lmp: Date;

    if (method === 'lmp' && lmpDate) {
      // Naegele's Rule: LMP + 280 days (40 weeks)
      edd = addDays(lmpDate, 280);
      lmp = lmpDate;
    } else if (method === 'conception' && conceptionDate) {
      // Conception + 266 days (38 weeks)
      edd = addDays(conceptionDate, 266);
      lmp = addDays(conceptionDate, -14); // Estimate LMP
    } else if (method === 'ultrasound' && usDate && usWeeks) {
      // Calculate EDD from ultrasound dating
      const gaAtUsDays = (parseInt(usWeeks) * 7) + (parseInt(usDays) || 0);
      const daysRemaining = 280 - gaAtUsDays;
      edd = addDays(usDate, daysRemaining);
      lmp = addDays(usDate, -gaAtUsDays); // Back-calculate LMP
    } else {
      return;
    }

    // Calculate current GA
    const totalDays = differenceInDays(today, lmp);
    const currentWeeks = Math.floor(totalDays / 7);
    const currentDays = totalDays % 7;

    // Determine trimester
    let trimester: string;
    if (currentWeeks < 14) {
      trimester = 'First Trimester (weeks 1-13)';
    } else if (currentWeeks < 28) {
      trimester = 'Second Trimester (weeks 14-27)';
    } else {
      trimester = 'Third Trimester (weeks 28-40)';
    }

    // Key milestones
    const milestones = [
      { name: 'End of 1st Trimester', date: addWeeks(lmp, 13), weeks: 13 },
      { name: 'Anatomy Scan Window', date: addWeeks(lmp, 20), weeks: 20 },
      { name: 'Viability (24 weeks)', date: addWeeks(lmp, 24), weeks: 24 },
      { name: 'End of 2nd Trimester', date: addWeeks(lmp, 27), weeks: 27 },
      { name: 'Term (37 weeks)', date: addWeeks(lmp, 37), weeks: 37 },
      { name: 'Due Date (40 weeks)', date: edd, weeks: 40 },
      { name: 'Post-term (42 weeks)', date: addWeeks(lmp, 42), weeks: 42 },
    ];

    setResult({
      edd,
      currentGA: { weeks: Math.max(0, currentWeeks), days: Math.max(0, currentDays) },
      trimester,
      milestones
    });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-6 w-6" />
          EDD Calculator
        </CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Estimated Due Date & Gestational Age
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <Tabs value={method} onValueChange={(v) => setMethod(v as typeof method)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="lmp">By LMP</TabsTrigger>
            <TabsTrigger value="conception">By Conception</TabsTrigger>
            <TabsTrigger value="ultrasound">By Ultrasound</TabsTrigger>
          </TabsList>

          <TabsContent value="lmp" className="space-y-4 pt-4">
            <div>
              <Label>Last Menstrual Period (LMP)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !lmpDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lmpDate ? format(lmpDate, "PPP") : "Select first day of LMP"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lmpDate}
                    onSelect={setLmpDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-sm text-muted-foreground">
              Uses Naegele's Rule: LMP + 280 days (assumes 28-day cycle)
            </p>
          </TabsContent>

          <TabsContent value="conception" className="space-y-4 pt-4">
            <div>
              <Label>Conception / Ovulation Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !conceptionDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {conceptionDate ? format(conceptionDate, "PPP") : "Select conception date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={conceptionDate}
                    onSelect={setConceptionDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-sm text-muted-foreground">
              For IVF or known ovulation date: Conception + 266 days
            </p>
          </TabsContent>

          <TabsContent value="ultrasound" className="space-y-4 pt-4">
            <div>
              <Label>Ultrasound Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !usDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {usDate ? format(usDate, "PPP") : "Select ultrasound date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={usDate}
                    onSelect={setUsDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="us-weeks">GA at Ultrasound (weeks)</Label>
                <Input
                  id="us-weeks"
                  type="number"
                  value={usWeeks}
                  onChange={(e) => setUsWeeks(e.target.value)}
                  placeholder="Weeks"
                  min="0"
                  max="42"
                />
              </div>
              <div>
                <Label htmlFor="us-days">Days</Label>
                <Input
                  id="us-days"
                  type="number"
                  value={usDays}
                  onChange={(e) => setUsDays(e.target.value)}
                  placeholder="Days"
                  min="0"
                  max="6"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              First trimester ultrasound is most accurate (±5-7 days)
            </p>
          </TabsContent>
        </Tabs>

        <Button onClick={calculate} className="w-full">
          Calculate Due Date
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Estimated Due Date</span>
                <span className="text-2xl font-bold text-pink-600">
                  {format(result.edd, "MMMM d, yyyy")}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Current Gestational Age</p>
                  <p className="text-xl font-bold text-primary">
                    {result.currentGA.weeks}w {result.currentGA.days}d
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trimester</p>
                  <p className="font-semibold">{result.trimester.split(' (')[0]}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <p className="font-semibold mb-3">Key Milestones</p>
              <div className="space-y-2">
                {result.milestones.map((milestone, index) => {
                  const isPast = differenceInDays(new Date(), milestone.date) > 0;
                  const isCurrent = result.currentGA.weeks === milestone.weeks;
                  return (
                    <div 
                      key={index} 
                      className={cn(
                        "flex justify-between items-center p-2 rounded",
                        isPast ? "bg-green-100 text-green-800" : 
                        isCurrent ? "bg-primary/20 text-primary font-medium" : 
                        "bg-background"
                      )}
                    >
                      <span className="text-sm">{milestone.name}</span>
                      <span className="text-sm font-medium">{format(milestone.date, "MMM d, yyyy")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Dating Accuracy</p>
              <ul className="mt-2 space-y-1">
                <li>• <strong>1st trimester US:</strong> Most accurate (±5-7 days)</li>
                <li>• <strong>2nd trimester US:</strong> ±10-14 days</li>
                <li>• <strong>3rd trimester US:</strong> ±21 days</li>
                <li>• Discrepancy &gt;7 days in 1st trimester → use US dates</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EDDCalculator;
