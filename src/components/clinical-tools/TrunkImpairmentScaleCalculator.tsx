import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, AlertTriangle, Brain } from 'lucide-react';

const TrunkImpairmentScaleCalculator: React.FC = () => {
  // Static Sitting Balance
  const [staticBalance1, setStaticBalance1] = useState<string>('');
  const [staticBalance2, setStaticBalance2] = useState<string>('');
  const [staticBalance3, setStaticBalance3] = useState<string>('');
  
  // Dynamic Sitting Balance
  const [dynamicBalance1, setDynamicBalance1] = useState<string>('');
  const [dynamicBalance2, setDynamicBalance2] = useState<string>('');
  const [dynamicBalance3, setDynamicBalance3] = useState<string>('');
  const [dynamicBalance4, setDynamicBalance4] = useState<string>('');
  
  // Coordination
  const [coordination1, setCoordination1] = useState<string>('');
  const [coordination2, setCoordination2] = useState<string>('');
  const [coordination3, setCoordination3] = useState<string>('');
  const [coordination4, setCoordination4] = useState<string>('');

  const [showResults, setShowResults] = useState(false);

  const staticItems = [
    {
      id: 'static1',
      label: 'Starting position maintained for 10 seconds',
      description: 'Patient sits on edge of bed, feet on floor, arms folded across chest',
      value: staticBalance1,
      setValue: setStaticBalance1,
      options: [
        { value: '0', label: 'Falls or cannot maintain for 10s' },
        { value: '2', label: 'Maintains starting position for 10s' }
      ]
    },
    {
      id: 'static2',
      label: 'Therapist crosses unaffected leg over affected leg',
      description: 'Patient maintains sitting balance',
      value: staticBalance2,
      setValue: setStaticBalance2,
      options: [
        { value: '0', label: 'Falls' },
        { value: '2', label: 'Maintains sitting balance' }
      ]
    },
    {
      id: 'static3',
      label: 'Patient crosses unaffected leg over affected leg',
      description: 'Patient actively performs movement and maintains balance',
      value: staticBalance3,
      setValue: setStaticBalance3,
      options: [
        { value: '0', label: 'Falls' },
        { value: '1', label: 'Cannot cross without arm support' },
        { value: '2', label: 'Crosses without arm support' },
        { value: '3', label: 'Crosses and maintains for 10s' }
      ]
    }
  ];

  const dynamicItems = [
    {
      id: 'dynamic1',
      label: 'Touch bed with affected elbow (shorten affected side)',
      description: 'Return to starting position',
      value: dynamicBalance1,
      setValue: setDynamicBalance1,
      options: [
        { value: '0', label: 'Falls, needs arm support, or elbow does not touch bed' },
        { value: '1', label: 'Moves actively without arm support, elbow touches bed' }
      ]
    },
    {
      id: 'dynamic2',
      label: 'Touch bed with unaffected elbow (shorten unaffected side)',
      description: 'Return to starting position',
      value: dynamicBalance2,
      setValue: setDynamicBalance2,
      options: [
        { value: '0', label: 'Falls, needs arm support, or elbow does not touch bed' },
        { value: '1', label: 'Moves actively without arm support, elbow touches bed' }
      ]
    },
    {
      id: 'dynamic3',
      label: 'Lift affected side from bed (elevate pelvis)',
      description: 'Repeat 3 times',
      value: dynamicBalance3,
      setValue: setDynamicBalance3,
      options: [
        { value: '0', label: 'Falls or needs arm support' },
        { value: '1', label: 'Lifts pelvis, but <3 times or asymmetric' },
        { value: '2', label: 'Lifts pelvis 3 times symmetrically' },
        { value: '3', label: 'Lifts pelvis 3 times within 6 seconds' }
      ]
    },
    {
      id: 'dynamic4',
      label: 'Lift unaffected side from bed (elevate pelvis)',
      description: 'Repeat 3 times',
      value: dynamicBalance4,
      setValue: setDynamicBalance4,
      options: [
        { value: '0', label: 'Falls or needs arm support' },
        { value: '1', label: 'Lifts pelvis, but <3 times or asymmetric' },
        { value: '2', label: 'Lifts pelvis 3 times symmetrically' },
        { value: '3', label: 'Lifts pelvis 3 times within 6 seconds' }
      ]
    }
  ];

  const coordinationItems = [
    {
      id: 'coord1',
      label: 'Rotate upper trunk 6 times (shoulders move, pelvis fixed)',
      description: 'Evaluate as one movement',
      value: coordination1,
      setValue: setCoordination1,
      options: [
        { value: '0', label: 'No rotation, asymmetric rotation, or <6 times' },
        { value: '1', label: 'Symmetric rotation 6 times' },
        { value: '2', label: 'Symmetric rotation 6 times within 6 seconds' }
      ]
    },
    {
      id: 'coord2',
      label: 'Rotate lower trunk 6 times (pelvis moves, shoulders fixed)',
      description: 'Evaluate as one movement',
      value: coordination2,
      setValue: setCoordination2,
      options: [
        { value: '0', label: 'No rotation, asymmetric rotation, or <6 times' },
        { value: '1', label: 'Symmetric rotation 6 times' },
        { value: '2', label: 'Symmetric rotation 6 times within 6 seconds' }
      ]
    },
    {
      id: 'coord3',
      label: 'Rotate upper and lower trunk 6 times in same direction',
      description: 'Combined movement (en bloc)',
      value: coordination3,
      setValue: setCoordination3,
      options: [
        { value: '0', label: 'No rotation, asymmetric rotation, or <6 times' },
        { value: '1', label: 'Symmetric rotation 6 times' },
        { value: '2', label: 'Symmetric rotation 6 times within 6 seconds' }
      ]
    },
    {
      id: 'coord4',
      label: 'Rotate upper and lower trunk 6 times in opposite directions',
      description: 'Counter-rotation (dissociation)',
      value: coordination4,
      setValue: setCoordination4,
      options: [
        { value: '0', label: 'No rotation, asymmetric rotation, or <6 times' },
        { value: '1', label: 'Symmetric rotation 6 times' },
        { value: '2', label: 'Symmetric rotation 6 times within 6 seconds' }
      ]
    }
  ];

  const calculateScore = () => {
    const staticScore = [staticBalance1, staticBalance2, staticBalance3]
      .reduce((sum, v) => sum + parseInt(v || '0'), 0);
    const dynamicScore = [dynamicBalance1, dynamicBalance2, dynamicBalance3, dynamicBalance4]
      .reduce((sum, v) => sum + parseInt(v || '0'), 0);
    const coordScore = [coordination1, coordination2, coordination3, coordination4]
      .reduce((sum, v) => sum + parseInt(v || '0'), 0);
    
    return {
      static: staticScore,
      dynamic: dynamicScore,
      coordination: coordScore,
      total: staticScore + dynamicScore + coordScore
    };
  };

  const getInterpretation = (total: number) => {
    if (total >= 20) {
      return { level: 'Minimal Impairment', color: 'bg-green-100 border-green-200 text-green-800' };
    } else if (total >= 14) {
      return { level: 'Mild Impairment', color: 'bg-lime-100 border-lime-200 text-lime-800' };
    } else if (total >= 8) {
      return { level: 'Moderate Impairment', color: 'bg-yellow-100 border-yellow-200 text-yellow-800' };
    } else {
      return { level: 'Severe Impairment', color: 'bg-red-100 border-red-200 text-red-800' };
    }
  };

  const allItemsFilled = () => {
    return staticBalance1 && staticBalance2 && staticBalance3 &&
           dynamicBalance1 && dynamicBalance2 && dynamicBalance3 && dynamicBalance4 &&
           coordination1 && coordination2 && coordination3 && coordination4;
  };

  const scores = calculateScore();
  const interpretation = getInterpretation(scores.total);

  const resetForm = () => {
    setStaticBalance1('');
    setStaticBalance2('');
    setStaticBalance3('');
    setDynamicBalance1('');
    setDynamicBalance2('');
    setDynamicBalance3('');
    setDynamicBalance4('');
    setCoordination1('');
    setCoordination2('');
    setCoordination3('');
    setCoordination4('');
    setShowResults(false);
  };

  const renderItemGroup = (items: typeof staticItems, title: string, maxScore: number) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">{title}</Label>
        <span className="text-sm text-muted-foreground">(max {maxScore} pts)</span>
      </div>
      {items.map((item) => (
        <div key={item.id} className="space-y-2 p-3 bg-muted/30 rounded-lg">
          <Label className="text-sm font-medium">{item.label}</Label>
          <p className="text-xs text-muted-foreground">{item.description}</p>
          <RadioGroup value={item.value} onValueChange={item.setValue} className="space-y-1">
            {item.options.map((opt) => (
              <div key={opt.value} className="flex items-center space-x-2">
                <RadioGroupItem value={opt.value} id={`${item.id}-${opt.value}`} />
                <Label htmlFor={`${item.id}-${opt.value}`} className="cursor-pointer text-sm">
                  ({opt.value}) {opt.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Trunk Impairment Scale (TIS)
        </CardTitle>
        <p className="text-indigo-100 text-sm mt-1">
          Quantifies trunk motor impairment after stroke; also validated in Parkinson's disease
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
          <strong>Test Position:</strong> Patient sits on edge of bed/plinth without back or arm support, 
          hips and knees at 90°, feet flat on floor (or supported), arms folded across chest.
        </div>

        {renderItemGroup(staticItems, 'Static Sitting Balance', 7)}
        {renderItemGroup(dynamicItems, 'Dynamic Sitting Balance', 10)}
        {renderItemGroup(coordinationItems, 'Coordination', 6)}

        <div className="flex gap-4 pt-4">
          <Button onClick={() => setShowResults(true)} disabled={!allItemsFilled()} className="flex-1">
            Calculate TIS Score
          </Button>
          <Button onClick={resetForm} variant="outline">Reset</Button>
        </div>

        {showResults && allItemsFilled() && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.color}`}>
              <div className="text-center space-y-2">
                <p className="text-5xl font-bold">{scores.total}</p>
                <p className="text-lg">Total TIS Score (out of 23)</p>
                <p className="text-xl font-semibold">{interpretation.level}</p>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div className="p-2 bg-white/50 rounded">
                  <p className="text-lg font-bold">{scores.static}/7</p>
                  <p className="text-xs">Static Balance</p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="text-lg font-bold">{scores.dynamic}/10</p>
                  <p className="text-xs">Dynamic Balance</p>
                </div>
                <div className="p-2 bg-white/50 rounded">
                  <p className="text-lg font-bold">{scores.coordination}/6</p>
                  <p className="text-xs">Coordination</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Clinical Interpretation</p>
                <ul className="mt-2 space-y-1">
                  <li>• <strong>Total Score:</strong> 0-23 points</li>
                  <li>• <strong>Static Balance:</strong> 0-7 points (ability to maintain sitting)</li>
                  <li>• <strong>Dynamic Balance:</strong> 0-10 points (active trunk movements)</li>
                  <li>• <strong>Coordination:</strong> 0-6 points (selective trunk control)</li>
                  <li>• Higher scores indicate better trunk control</li>
                  <li>• TIS correlates with functional outcomes (gait, balance, ADLs)</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-amber-800">
                <strong>References:</strong> Verheyden G, et al. The Trunk Impairment Scale: a new tool to measure motor 
                impairment of the trunk after stroke. Clin Rehabil. 2004;18(3):326-334. Also validated in Parkinson's disease 
                (Verheyden G, et al. 2007).
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrunkImpairmentScaleCalculator;
