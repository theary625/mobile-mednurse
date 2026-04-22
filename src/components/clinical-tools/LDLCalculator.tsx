import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RotateCcw, Info, AlertTriangle } from 'lucide-react';
import { BrandHeartIcon } from '@/components/icons/MedicalSystemIcons';

const LDLCalculator = () => {
  const [totalCholesterol, setTotalCholesterol] = useState('');
  const [hdl, setHdl] = useState('');
  const [triglycerides, setTriglycerides] = useState('');

  const calculateLDL = () => {
    const tc = parseFloat(totalCholesterol);
    const hdlVal = parseFloat(hdl);
    const tg = parseFloat(triglycerides);

    if (!tc || !hdlVal || !tg) return null;

    // Friedewald formula: LDL = TC - HDL - (TG/5)
    const ldl = tc - hdlVal - (tg / 5);
    const vldl = tg / 5;
    const nonHdl = tc - hdlVal;

    return {
      ldl: Math.round(ldl),
      vldl: Math.round(vldl),
      nonHdl: Math.round(nonHdl),
      isValid: tg <= 400,
      tgValue: tg
    };
  };

  const result = calculateLDL();

  const getLDLCategory = (ldl: number) => {
    if (ldl < 70) return { category: 'Optimal (for high-risk patients)', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/30' };
    if (ldl < 100) return { category: 'Optimal', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-50 dark:bg-green-950/30' };
    if (ldl < 130) return { category: 'Near/Above Optimal', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-50 dark:bg-yellow-950/30' };
    if (ldl < 160) return { category: 'Borderline High', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-950/30' };
    if (ldl < 190) return { category: 'High', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30' };
    return { category: 'Very High', color: 'text-red-700 dark:text-red-300', bgColor: 'bg-red-100 dark:bg-red-950/50' };
  };

  const resetForm = () => {
    setTotalCholesterol('');
    setHdl('');
    setTriglycerides('');
  };

  const ldlCategory = result ? getLDLCategory(result.ldl) : null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <BrandHeartIcon className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">LDL Cholesterol Calculator</CardTitle>
            <CardDescription className="text-red-100">
              Friedewald Formula
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Friedewald Formula:</p>
              <p className="font-mono">LDL = Total Cholesterol - HDL - (Triglycerides / 5)</p>
              <p className="mt-2 text-xs">All values in mg/dL</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="totalCholesterol">Total Cholesterol (mg/dL)</Label>
            <Input
              id="totalCholesterol"
              type="number"
              placeholder="e.g., 200"
              value={totalCholesterol}
              onChange={(e) => setTotalCholesterol(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hdl">HDL Cholesterol (mg/dL)</Label>
            <Input
              id="hdl"
              type="number"
              placeholder="e.g., 50"
              value={hdl}
              onChange={(e) => setHdl(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="triglycerides">Triglycerides (mg/dL)</Label>
            <Input
              id="triglycerides"
              type="number"
              placeholder="e.g., 150"
              value={triglycerides}
              onChange={(e) => setTriglycerides(e.target.value)}
              min="0"
            />
          </div>
        </div>

        {result && (
          <div className="space-y-4">
            {!result.isValid && (
              <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    <p className="font-semibold">Friedewald Formula Limitation</p>
                    <p>Triglycerides &gt;400 mg/dL ({result.tgValue} mg/dL entered). 
                    The Friedewald equation is unreliable. Use direct LDL measurement.</p>
                  </div>
                </div>
              </div>
            )}

            <div className={`p-6 rounded-lg border ${ldlCategory?.bgColor}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Calculated LDL-C</h3>
                <div className="text-right">
                  <span className={`text-3xl font-bold ${ldlCategory?.color}`}>
                    {result.ldl} mg/dL
                  </span>
                  {!result.isValid && <span className="text-xs text-red-500 block">*unreliable</span>}
                </div>
              </div>
              <p className={`font-semibold ${ldlCategory?.color}`}>{ldlCategory?.category}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Non-HDL Cholesterol</p>
                <p className="text-xl font-bold">{result.nonHdl} mg/dL</p>
                <p className="text-xs text-muted-foreground mt-1">Goal: &lt;130 mg/dL (secondary target)</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <p className="text-sm text-muted-foreground">Estimated VLDL</p>
                <p className="text-xl font-bold">{result.vldl} mg/dL</p>
                <p className="text-xs text-muted-foreground mt-1">Normal: 5-40 mg/dL</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">ATP III LDL-C Goals</h4>
              <div className="text-sm space-y-1">
                <p>• Very high risk (ASCVD + high-risk conditions): &lt;70 mg/dL</p>
                <p>• High risk (CHD or CHD equivalents): &lt;100 mg/dL</p>
                <p>• Moderately high risk (2+ risk factors, 10-20% 10-yr risk): &lt;130 mg/dL</p>
                <p>• Moderate risk (2+ risk factors, &lt;10% 10-yr risk): &lt;130 mg/dL</p>
                <p>• Low risk (0-1 risk factors): &lt;160 mg/dL</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="outline" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <p><strong>Reference:</strong> Friedewald WT, Levy RI, Fredrickson DS. Estimation of the concentration of low-density lipoprotein cholesterol in plasma, without use of the preparative ultracentrifuge. Clin Chem. 1972;18(6):499-502.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LDLCalculator;
