import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText, RotateCcw, Info, AlertTriangle } from 'lucide-react';

const FIB4Calculator = () => {
  const [age, setAge] = useState<string>('');
  const [ast, setAst] = useState<string>('');
  const [alt, setAlt] = useState<string>('');
  const [platelets, setPlatelets] = useState<string>('');

  // FIB-4 = (Age × AST) / (Platelet × √ALT)
  const calculateFIB4 = () => {
    const ageVal = parseFloat(age);
    const astVal = parseFloat(ast);
    const altVal = parseFloat(alt);
    const plateletVal = parseFloat(platelets);
    
    if (ageVal > 0 && astVal > 0 && altVal > 0 && plateletVal > 0) {
      return (ageVal * astVal) / (plateletVal * Math.sqrt(altVal));
    }
    return null;
  };

  const fib4 = calculateFIB4();

  const getInterpretation = (score: number) => {
    if (score < 1.30) return { 
      level: 'Low Risk', 
      color: 'text-green-600', 
      bg: 'bg-green-100',
      fibrosis: 'F0-F1 (No/Minimal Fibrosis)',
      message: 'Low probability of advanced fibrosis. NPV 90%',
      action: 'Reassess in 1-2 years or if clinical change'
    };
    if (score <= 2.67) return { 
      level: 'Indeterminate', 
      color: 'text-yellow-600', 
      bg: 'bg-yellow-100',
      fibrosis: 'Uncertain',
      message: 'Cannot rule out advanced fibrosis',
      action: 'Consider elastography or liver biopsy'
    };
    return { 
      level: 'High Risk', 
      color: 'text-destructive', 
      bg: 'bg-destructive/10',
      fibrosis: 'F3-F4 (Advanced Fibrosis/Cirrhosis)',
      message: 'High probability of advanced fibrosis. PPV 65%',
      action: 'Refer to hepatology, consider additional testing'
    };
  };

  const reset = () => {
    setAge('');
    setAst('');
    setAlt('');
    setPlatelets('');
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6" />
          FIB-4 Index
        </CardTitle>
        <p className="text-purple-100 text-sm mt-1">
          Liver Fibrosis Assessment
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">Age (years)</Label>
            <Input
              id="age"
              type="number"
              placeholder="55"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="platelets">Platelets (×10⁹/L)</Label>
            <Input
              id="platelets"
              type="number"
              placeholder="200"
              value={platelets}
              onChange={(e) => setPlatelets(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ast">AST (U/L)</Label>
            <Input
              id="ast"
              type="number"
              placeholder="35"
              value={ast}
              onChange={(e) => setAst(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt">ALT (U/L)</Label>
            <Input
              id="alt"
              type="number"
              placeholder="30"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
          </div>
        </div>

        {fib4 !== null && (
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${getInterpretation(fib4).bg} text-center`}>
              <p className="text-sm font-medium text-muted-foreground mb-1">FIB-4 Score</p>
              <p className="text-4xl font-bold">{fib4.toFixed(2)}</p>
              <p className={`font-semibold mt-1 ${getInterpretation(fib4).color}`}>
                {getInterpretation(fib4).level}
              </p>
              <p className="text-sm font-medium mt-1">{getInterpretation(fib4).fibrosis}</p>
            </div>

            <div className="p-3 bg-muted rounded-lg text-sm space-y-2">
              <p className="text-muted-foreground">{getInterpretation(fib4).message}</p>
              <div className="flex items-start gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p><strong>Action:</strong> {getInterpretation(fib4).action}</p>
              </div>
            </div>
          </div>
        )}

        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">Formula & Cut-offs</p>
              <p className="mt-1 font-mono text-xs">
                FIB-4 = (Age × AST) / (Platelets × √ALT)
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• <strong>&lt;1.30:</strong> Low risk (NPV 90% for F3-F4)</li>
                <li>• <strong>1.30-2.67:</strong> Indeterminate</li>
                <li>• <strong>&gt;2.67:</strong> High risk (PPV 65% for F3-F4)</li>
                <li>• Best validated for HCV, NAFLD, HBV</li>
                <li>• Age &lt;35 or &gt;65 may reduce accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FIB4Calculator;