import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { format, addDays, addWeeks, differenceInDays, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';

interface DepoResult {
  dose: string;
  route: string;
  nextDueDate: Date;
  windowStart: Date;
  windowEnd: Date;
  gracePeriodEnd: Date;
  isWithinWindow: boolean;
  isInGracePeriod: boolean;
  isLate: boolean;
  daysUntilDue: number;
}

const DepoCalculator: React.FC = () => {
  const [lastInjectionDate, setLastInjectionDate] = useState<Date | undefined>(undefined);
  const [route, setRoute] = useState<'im' | 'sq'>('im');
  const [isPostpartum, setIsPostpartum] = useState(false);
  const [result, setResult] = useState<DepoResult | null>(null);

  const calculate = () => {
    if (!lastInjectionDate) return;

    const today = new Date();
    
    // Next injection due in 12-13 weeks (84-91 days)
    // IM: 150mg every 12-14 weeks
    // SQ: 104mg every 12-14 weeks
    const nextDueDate = addWeeks(lastInjectionDate, 12);
    const windowStart = addDays(nextDueDate, -7); // Can give 1 week early
    const windowEnd = addWeeks(lastInjectionDate, 13); // 13 weeks is still on-time
    const gracePeriodEnd = addWeeks(lastInjectionDate, 15); // 2 week grace period

    const daysUntilDue = differenceInDays(nextDueDate, today);
    
    const isWithinWindow = isWithinInterval(today, { start: windowStart, end: windowEnd });
    const isInGracePeriod = !isWithinWindow && isWithinInterval(today, { start: windowEnd, end: gracePeriodEnd });
    const isLate = differenceInDays(today, gracePeriodEnd) > 0;

    setResult({
      dose: route === 'im' ? '150 mg' : '104 mg',
      route: route === 'im' ? 'Intramuscular (IM)' : 'Subcutaneous (SQ)',
      nextDueDate,
      windowStart,
      windowEnd,
      gracePeriodEnd,
      isWithinWindow,
      isInGracePeriod,
      isLate,
      daysUntilDue
    });
  };

  const getStatusColor = () => {
    if (!result) return '';
    if (result.isLate) return 'bg-red-50 border-red-200';
    if (result.isInGracePeriod) return 'bg-amber-50 border-amber-200';
    if (result.isWithinWindow) return 'bg-green-50 border-green-200';
    return 'bg-blue-50 border-blue-200';
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Depo-Provera Calculator</CardTitle>
        <p className="text-pink-100 text-sm mt-1">
          Medroxyprogesterone injection scheduling
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Dosing Schedule</p>
            <p>Depo-Provera is given every 12-13 weeks. A 2-week grace period is allowed before backup contraception is needed.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Last Injection Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal mt-1",
                    !lastInjectionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {lastInjectionDate ? format(lastInjectionDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={lastInjectionDate}
                  onSelect={setLastInjectionDate}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Formulation / Route</Label>
            <RadioGroup value={route} onValueChange={(v) => setRoute(v as 'im' | 'sq')} className="flex gap-6 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="im" id="depo-im" />
                <Label htmlFor="depo-im" className="cursor-pointer">
                  <span className="font-medium">IM</span>
                  <span className="text-muted-foreground ml-1">(150 mg)</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sq" id="depo-sq" />
                <Label htmlFor="depo-sq" className="cursor-pointer">
                  <span className="font-medium">SubQ</span>
                  <span className="text-muted-foreground ml-1">(104 mg)</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="postpartum"
              checked={isPostpartum}
              onChange={(e) => setIsPostpartum(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="postpartum" className="cursor-pointer text-sm">
              Postpartum patient (affects timing recommendations)
            </Label>
          </div>
        </div>

        <Button onClick={calculate} disabled={!lastInjectionDate} className="w-full">
          Calculate Next Injection
        </Button>

        {result && (
          <div className="space-y-4 pt-4">
            <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
              {result.isLate && (
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-bold text-red-800">LATE - Pregnancy test recommended</span>
                </div>
              )}
              {result.isInGracePeriod && (
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-bold text-amber-800">In Grace Period - Give injection today</span>
                </div>
              )}
              {result.isWithinWindow && (
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-bold text-green-800">Within Optimal Window</span>
                </div>
              )}
              {!result.isLate && !result.isInGracePeriod && !result.isWithinWindow && (
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-blue-600" />
                  <span className="font-bold text-blue-800">Not yet due</span>
                </div>
              )}

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Dose</p>
                    <p className="font-bold text-primary">{result.dose}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Route</p>
                    <p className="font-bold">{result.route}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-medium text-muted-foreground">Next Due Date</p>
                  <p className="font-bold text-xl text-primary">{format(result.nextDueDate, "MMMM d, yyyy")}</p>
                  {result.daysUntilDue > 0 && (
                    <p className="text-sm text-muted-foreground">({result.daysUntilDue} days from now)</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs font-medium text-muted-foreground">Optimal Window</p>
                    <p className="text-sm font-medium">
                      {format(result.windowStart, "MMM d")} - {format(result.windowEnd, "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="p-2 bg-background rounded">
                    <p className="text-xs font-medium text-muted-foreground">Grace Period Ends</p>
                    <p className="text-sm font-medium">{format(result.gracePeriodEnd, "MMM d, yyyy")}</p>
                  </div>
                </div>
              </div>
            </div>

            {result.isLate && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-semibold text-red-800 mb-2">Late Injection Protocol:</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>1. Rule out pregnancy before administration</li>
                  <li>2. Use backup contraception for 7 days after injection</li>
                  <li>3. Consider emergency contraception if unprotected intercourse in past 5 days</li>
                </ul>
              </div>
            )}

            {isPostpartum && (
              <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
                <p className="font-semibold text-pink-800 mb-2">Postpartum Considerations:</p>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• <strong>Breastfeeding:</strong> Can start at 6 weeks postpartum (some guidelines allow immediately)</li>
                  <li>• <strong>Non-breastfeeding:</strong> Can start immediately postpartum</li>
                  <li>• May affect milk production if given before 6 weeks in breastfeeding mothers</li>
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm font-medium mb-2">Quick Reference</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Formulation</th>
                  <th className="text-left py-1">Dose</th>
                  <th className="text-left py-1">Site</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted-foreground/20">
                  <td className="py-1">Depo-Provera (IM)</td>
                  <td>150 mg</td>
                  <td>Deltoid or gluteus</td>
                </tr>
                <tr>
                  <td className="py-1">Depo-SubQ Provera 104</td>
                  <td>104 mg</td>
                  <td>Anterior thigh or abdomen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Clinical Considerations</p>
              <ul className="mt-2 space-y-1">
                <li>• FDA black box warning: bone density loss (consider calcium/vitamin D)</li>
                <li>• Return to fertility may be delayed 6-12 months after discontinuation</li>
                <li>• Common side effects: irregular bleeding, weight gain, headache</li>
                <li>• Contraindications: known/suspected pregnancy, breast cancer</li>
                <li>• No protection against STIs - counsel on barrier methods</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DepoCalculator;
