import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Info, CalendarIcon, Baby, AlertCircle } from 'lucide-react';
import { BrandHeartIcon as Heart } from '@/components/icons/MedicalSystemIcons';
import { format, addDays, differenceInDays, isSameDay, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';

const OvulationCalendar: React.FC = () => {
  const [lmpDate, setLmpDate] = useState<Date | undefined>();
  const [cycleLength, setCycleLength] = useState<string>('28');
  const [showResults, setShowResults] = useState(false);

  const cycleLengthNum = parseInt(cycleLength) || 28;

  const calculations = useMemo(() => {
    if (!lmpDate) return null;

    // Ovulation typically occurs 14 days before the next period
    const lutealPhase = 14;
    const ovulationDay = cycleLengthNum - lutealPhase;
    const ovulationDate = addDays(lmpDate, ovulationDay);
    
    // Fertile window: 5 days before ovulation + ovulation day + 1 day after
    const fertileStart = addDays(ovulationDate, -5);
    const fertileEnd = addDays(ovulationDate, 1);
    
    // Most fertile days (peak): 2 days before ovulation + ovulation day
    const peakStart = addDays(ovulationDate, -2);
    const peakEnd = ovulationDate;
    
    // Next period
    const nextPeriod = addDays(lmpDate, cycleLengthNum);
    
    // Implantation window (6-12 days after ovulation)
    const implantationStart = addDays(ovulationDate, 6);
    const implantationEnd = addDays(ovulationDate, 12);
    
    // Safe period (low fertility)
    const safeStart = addDays(lmpDate, 1);
    const safeEnd = addDays(fertileStart, -1);
    
    return {
      ovulationDate,
      ovulationDay,
      fertileStart,
      fertileEnd,
      peakStart,
      peakEnd,
      nextPeriod,
      implantationStart,
      implantationEnd,
      safeStart,
      safeEnd,
    };
  }, [lmpDate, cycleLengthNum]);

  const handleCalculate = () => {
    if (lmpDate && cycleLength) {
      setShowResults(true);
    }
  };

  const handleReset = () => {
    setLmpDate(undefined);
    setCycleLength('28');
    setShowResults(false);
  };

  // Custom day renderer for calendar
  const getDayClass = (date: Date) => {
    if (!calculations || !lmpDate) return '';

    // Period days (first 5 days typically)
    if (isWithinInterval(date, { start: lmpDate, end: addDays(lmpDate, 4) })) {
      return 'bg-red-200 text-red-800 rounded-full';
    }

    // Peak fertility (highest chance)
    if (isWithinInterval(date, { start: calculations.peakStart, end: calculations.peakEnd })) {
      return 'bg-pink-400 text-white rounded-full font-bold';
    }

    // Fertile window
    if (isWithinInterval(date, { start: calculations.fertileStart, end: calculations.fertileEnd })) {
      return 'bg-pink-200 text-pink-800 rounded-full';
    }

    // Ovulation day
    if (isSameDay(date, calculations.ovulationDate)) {
      return 'bg-purple-500 text-white rounded-full font-bold';
    }

    // Implantation window
    if (isWithinInterval(date, { start: calculations.implantationStart, end: calculations.implantationEnd })) {
      return 'bg-blue-100 text-blue-800 rounded-full';
    }

    // Next period
    if (isSameDay(date, calculations.nextPeriod)) {
      return 'bg-red-400 text-white rounded-full';
    }

    return '';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Ovulation Calendar
        </CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Track fertile window and predict ovulation for family planning
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Enter the first day of your last menstrual period (LMP) 
            and your average cycle length to calculate your fertile window and predicted ovulation date.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>First Day of Last Period (LMP)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !lmpDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lmpDate ? format(lmpDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lmpDate}
                  onSelect={setLmpDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
            <Input
              id="cycleLength"
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              min="21"
              max="45"
              placeholder="28"
            />
            <p className="text-xs text-muted-foreground">Typical range: 21-35 days</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleCalculate} disabled={!lmpDate} className="flex-1">
            <Baby className="h-4 w-4 mr-2" />
            Calculate Fertile Window
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && calculations && (
          <div className="space-y-6 pt-4">
            {/* Key Dates Summary */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="p-4 bg-purple-100 border border-purple-300 rounded-lg text-center">
                <p className="text-sm font-medium text-purple-800">Ovulation Day</p>
                <p className="text-lg font-bold text-purple-900">
                  {format(calculations.ovulationDate, 'MMM d')}
                </p>
                <p className="text-xs text-purple-700">Cycle Day {calculations.ovulationDay}</p>
              </div>
              
              <div className="p-4 bg-pink-100 border border-pink-300 rounded-lg text-center">
                <p className="text-sm font-medium text-pink-800">Fertile Window</p>
                <p className="text-lg font-bold text-pink-900">
                  {format(calculations.fertileStart, 'MMM d')} - {format(calculations.fertileEnd, 'MMM d')}
                </p>
                <p className="text-xs text-pink-700">7 days total</p>
              </div>
              
              <div className="p-4 bg-rose-100 border border-rose-300 rounded-lg text-center">
                <p className="text-sm font-medium text-rose-800">Peak Fertility</p>
                <p className="text-lg font-bold text-rose-900">
                  {format(calculations.peakStart, 'MMM d')} - {format(calculations.peakEnd, 'MMM d')}
                </p>
                <p className="text-xs text-rose-700">Highest chance</p>
              </div>
              
              <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-center">
                <p className="text-sm font-medium text-red-800">Next Period</p>
                <p className="text-lg font-bold text-red-900">
                  {format(calculations.nextPeriod, 'MMM d')}
                </p>
                <p className="text-xs text-red-700">
                  In {differenceInDays(calculations.nextPeriod, new Date())} days
                </p>
              </div>
            </div>

            {/* Visual Calendar */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold mb-4">Cycle Calendar</h3>
              <Calendar
                mode="single"
                selected={calculations.ovulationDate}
                month={lmpDate}
                className="rounded-md border mx-auto pointer-events-auto"
                modifiers={{
                  period: (date) => lmpDate ? isWithinInterval(date, { start: lmpDate, end: addDays(lmpDate, 4) }) : false,
                  fertile: (date) => isWithinInterval(date, { start: calculations.fertileStart, end: calculations.fertileEnd }),
                  peak: (date) => isWithinInterval(date, { start: calculations.peakStart, end: calculations.peakEnd }),
                  ovulation: (date) => isSameDay(date, calculations.ovulationDate),
                  nextPeriod: (date) => isSameDay(date, calculations.nextPeriod),
                }}
                modifiersStyles={{
                  period: { backgroundColor: '#fecaca', color: '#991b1b', borderRadius: '50%' },
                  fertile: { backgroundColor: '#fbcfe8', color: '#9d174d', borderRadius: '50%' },
                  peak: { backgroundColor: '#ec4899', color: 'white', borderRadius: '50%', fontWeight: 'bold' },
                  ovulation: { backgroundColor: '#8b5cf6', color: 'white', borderRadius: '50%', fontWeight: 'bold' },
                  nextPeriod: { backgroundColor: '#f87171', color: 'white', borderRadius: '50%' },
                }}
              />
              
              {/* Legend */}
              <div className="flex flex-wrap gap-4 justify-center mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-200 border border-red-300"></div>
                  <span>Period</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-200 border border-pink-300"></div>
                  <span>Fertile</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-pink-400"></div>
                  <span>Peak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                  <span>Ovulation</span>
                </div>
              </div>
            </div>

            {/* Implantation Window */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Implantation Window (if conception occurs)</h4>
              <p className="text-sm text-blue-700">
                {format(calculations.implantationStart, 'MMM d')} - {format(calculations.implantationEnd, 'MMM d')}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                6-12 days after ovulation • Early pregnancy test may be positive after this window
              </p>
            </div>

            {/* Clinical Notes */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold">Important Considerations</p>
                <ul className="mt-1 space-y-1">
                  <li>• This is an estimate based on average cycle patterns</li>
                  <li>• Actual ovulation may vary ±2 days from prediction</li>
                  <li>• Irregular cycles reduce prediction accuracy</li>
                  <li>• Sperm can survive 3-5 days; egg viable for 12-24 hours</li>
                  <li>• Not reliable for contraception (use barrier methods)</li>
                  <li>• Consider OPKs (ovulation predictor kits) for confirmation</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Fertility Signs to Monitor</p>
                <ul className="mt-1 space-y-1">
                  <li>• <strong>Cervical mucus:</strong> Egg-white consistency indicates peak fertility</li>
                  <li>• <strong>Basal body temperature:</strong> Rises 0.5-1°F after ovulation</li>
                  <li>• <strong>Mittelschmerz:</strong> Mid-cycle pelvic pain/cramping</li>
                  <li>• <strong>LH surge:</strong> Detected by ovulation predictor kits</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OvulationCalendar;
