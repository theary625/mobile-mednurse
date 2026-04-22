import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { List, AlertTriangle, Info } from 'lucide-react';

type Sensitivity = 'low' | 'medium' | 'high';

interface ScaleRow {
  bgRange: string;
  dose: number;
}

const SlidingScaleCalculator = () => {
  const [sensitivity, setSensitivity] = useState<Sensitivity>('medium');
  const [targetBG, setTargetBG] = useState('140');
  const [result, setResult] = useState<{
    scale: ScaleRow[];
    sensitivityLabel: string;
  } | null>(null);

  const generateScale = () => {
    const target = parseFloat(targetBG);
    if (isNaN(target)) return;

    // Define dose increments based on sensitivity
    const doseIncrements: Record<Sensitivity, number[]> = {
      high: [0, 1, 2, 3, 4, 6, 8, 10], // More sensitive = lower doses
      medium: [0, 2, 4, 6, 8, 10, 12, 14],
      low: [0, 4, 6, 8, 10, 12, 16, 20] // Less sensitive = higher doses
    };

    const increments = doseIncrements[sensitivity];

    // Generate scale based on BG ranges
    const scale: ScaleRow[] = [
      { bgRange: `< ${target}`, dose: 0 },
      { bgRange: `${target}-${target + 50}`, dose: increments[1] },
      { bgRange: `${target + 51}-${target + 100}`, dose: increments[2] },
      { bgRange: `${target + 101}-${target + 150}`, dose: increments[3] },
      { bgRange: `${target + 151}-${target + 200}`, dose: increments[4] },
      { bgRange: `${target + 201}-${target + 250}`, dose: increments[5] },
      { bgRange: `${target + 251}-${target + 300}`, dose: increments[6] },
      { bgRange: `> ${target + 300}`, dose: increments[7] }
    ];

    const sensitivityLabels: Record<Sensitivity, string> = {
      high: 'High Sensitivity (Lower doses - elderly, renal impairment)',
      medium: 'Standard Sensitivity',
      low: 'Low Sensitivity (Higher doses - insulin resistant, steroid use)'
    };

    setResult({
      scale,
      sensitivityLabel: sensitivityLabels[sensitivity]
    });
  };

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <List className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <CardTitle className="text-lg">Sliding Scale Generator</CardTitle>
            <CardDescription>Generate customized sliding scale</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Target Blood Glucose</Label>
            <Input
              type="number"
              placeholder="140"
              value={targetBG}
              onChange={(e) => setTargetBG(e.target.value)}
              className="mt-2 h-11 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Insulin Sensitivity</Label>
            <Select value={sensitivity} onValueChange={(v: Sensitivity) => setSensitivity(v)}>
              <SelectTrigger className="mt-2 h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High (Lower doses)</SelectItem>
                <SelectItem value="medium">Medium (Standard)</SelectItem>
                <SelectItem value="low">Low (Higher doses)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-xl">
          <p className="text-xs text-muted-foreground">
            <strong>High sensitivity:</strong> Elderly, renal impairment, low TDD, hypoglycemia risk<br/>
            <strong>Low sensitivity:</strong> Steroid use, infection, insulin resistance, high TDD
          </p>
        </div>

        <Button onClick={generateScale} className="w-full h-11 rounded-xl">
          Generate Sliding Scale
        </Button>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className="bg-amber-500/20 text-amber-700 rounded-lg">
                {result.sensitivityLabel.split(' (')[0]}
              </Badge>
            </div>
            
            <div className="rounded-xl border border-border/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Blood Glucose (mg/dL)</TableHead>
                    <TableHead className="font-semibold text-right">Insulin Dose (units)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.scale.map((row, idx) => (
                    <TableRow key={idx} className={row.dose === 0 ? 'bg-success/5' : row.dose >= 10 ? 'bg-warning/5' : ''}>
                      <TableCell>{row.bgRange}</TableCell>
                      <TableCell className="text-right font-medium">
                        {row.dose === 0 ? (
                          <span className="text-success">No insulin</span>
                        ) : (
                          <span>{row.dose} units</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Sliding scale alone is not optimal therapy. Use as supplement to scheduled insulin when possible.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SlidingScaleCalculator;
