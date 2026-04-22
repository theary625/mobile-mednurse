import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Info } from 'lucide-react';

interface MoCASection {
  id: string;
  title: string;
  maxPoints: number;
  items: { id: string; label: string; points: number }[];
}

const mocaSections: MoCASection[] = [
  {
    id: 'visuospatial',
    title: 'Visuospatial / Executive',
    maxPoints: 5,
    items: [
      { id: 'trail', label: 'Alternating Trail Making (1 pt)', points: 1 },
      { id: 'cube', label: 'Copy Cube (1 pt)', points: 1 },
      { id: 'clock_contour', label: 'Clock - Contour (1 pt)', points: 1 },
      { id: 'clock_numbers', label: 'Clock - Numbers (1 pt)', points: 1 },
      { id: 'clock_hands', label: 'Clock - Hands (1 pt)', points: 1 }
    ]
  },
  {
    id: 'naming',
    title: 'Naming',
    maxPoints: 3,
    items: [
      { id: 'lion', label: 'Lion (1 pt)', points: 1 },
      { id: 'rhino', label: 'Rhinoceros (1 pt)', points: 1 },
      { id: 'camel', label: 'Camel (1 pt)', points: 1 }
    ]
  },
  {
    id: 'attention',
    title: 'Attention',
    maxPoints: 6,
    items: [
      { id: 'forward', label: 'Digit Span Forward (5-digits) (1 pt)', points: 1 },
      { id: 'backward', label: 'Digit Span Backward (3-digits) (1 pt)', points: 1 },
      { id: 'vigilance', label: 'Vigilance - Letter A (1 pt)', points: 1 },
      { id: 'serial7', label: 'Serial 7s (4-5 correct = 3pts, 2-3 = 2pts, 1 = 1pt)', points: 3 }
    ]
  },
  {
    id: 'language',
    title: 'Language',
    maxPoints: 3,
    items: [
      { id: 'sentence1', label: 'Repeat Sentence 1 (1 pt)', points: 1 },
      { id: 'sentence2', label: 'Repeat Sentence 2 (1 pt)', points: 1 },
      { id: 'fluency', label: 'Fluency (≥11 words) (1 pt)', points: 1 }
    ]
  },
  {
    id: 'abstraction',
    title: 'Abstraction',
    maxPoints: 2,
    items: [
      { id: 'abstraction1', label: 'Train-Bicycle similarity (1 pt)', points: 1 },
      { id: 'abstraction2', label: 'Watch-Ruler similarity (1 pt)', points: 1 }
    ]
  },
  {
    id: 'delayed_recall',
    title: 'Delayed Recall',
    maxPoints: 5,
    items: [
      { id: 'face', label: 'FACE (1 pt)', points: 1 },
      { id: 'velvet', label: 'VELVET (1 pt)', points: 1 },
      { id: 'church', label: 'CHURCH (1 pt)', points: 1 },
      { id: 'daisy', label: 'DAISY (1 pt)', points: 1 },
      { id: 'red', label: 'RED (1 pt)', points: 1 }
    ]
  },
  {
    id: 'orientation',
    title: 'Orientation',
    maxPoints: 6,
    items: [
      { id: 'date', label: 'Date (1 pt)', points: 1 },
      { id: 'month', label: 'Month (1 pt)', points: 1 },
      { id: 'year', label: 'Year (1 pt)', points: 1 },
      { id: 'day', label: 'Day (1 pt)', points: 1 },
      { id: 'place', label: 'Place (1 pt)', points: 1 },
      { id: 'city', label: 'City (1 pt)', points: 1 }
    ]
  }
];

const getInterpretation = (score: number) => {
  if (score >= 26) {
    return {
      level: "Normal",
      description: "Cognitive function within normal limits",
      colorClass: "bg-green-100 text-green-800 border-green-200"
    };
  } else if (score >= 18) {
    return {
      level: "Mild Cognitive Impairment",
      description: "Scores 18-25 suggest mild cognitive impairment (MCI)",
      colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200"
    };
  } else if (score >= 10) {
    return {
      level: "Moderate Impairment",
      description: "Scores 10-17 suggest moderate cognitive impairment",
      colorClass: "bg-orange-100 text-orange-800 border-orange-200"
    };
  } else {
    return {
      level: "Severe Impairment",
      description: "Scores <10 suggest severe cognitive impairment",
      colorClass: "bg-red-100 text-red-800 border-red-200"
    };
  }
};

const MoCACalculator: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [serial7Score, setSerial7Score] = useState<number>(0);
  const [yearsEducation, setYearsEducation] = useState<string>('');
  const [showResults, setShowResults] = useState(false);

  const handleCheck = (itemId: string, checked: boolean) => {
    setAnswers(prev => ({ ...prev, [itemId]: checked }));
  };

  const calculateScore = () => {
    let total = 0;
    
    mocaSections.forEach(section => {
      section.items.forEach(item => {
        if (item.id === 'serial7') {
          total += serial7Score;
        } else if (answers[item.id]) {
          total += item.points;
        }
      });
    });

    // Add 1 point if education ≤12 years (up to max 30)
    const educationBonus = parseInt(yearsEducation) <= 12 && yearsEducation !== '' ? 1 : 0;
    
    return Math.min(total + educationBonus, 30);
  };

  const getSectionScore = (section: MoCASection) => {
    let score = 0;
    section.items.forEach(item => {
      if (item.id === 'serial7') {
        score += serial7Score;
      } else if (answers[item.id]) {
        score += item.points;
      }
    });
    return score;
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleReset = () => {
    setAnswers({});
    setSerial7Score(0);
    setYearsEducation('');
    setShowResults(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">MoCA - Montreal Cognitive Assessment</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          Cognitive Screening Tool — Total Score: 30 points | Normal ≥26
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <Label htmlFor="education" className="font-medium">Years of Education</Label>
          <Input
            id="education"
            type="number"
            value={yearsEducation}
            onChange={(e) => setYearsEducation(e.target.value)}
            placeholder="Enter years of education"
            className="mt-2 max-w-xs"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Add 1 point if ≤12 years of education (max total 30)
          </p>
        </div>

        {mocaSections.map((section) => (
          <div key={section.id} className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between items-center">
              <p className="font-medium text-foreground">{section.title}</p>
              <span className="text-sm text-muted-foreground">
                {getSectionScore(section)}/{section.maxPoints} pts
              </span>
            </div>
            <div className="grid gap-2">
              {section.items.map((item) => (
                <div key={item.id}>
                  {item.id === 'serial7' ? (
                    <div className="flex items-center gap-4">
                      <Label className="text-sm">{item.label}</Label>
                      <select
                        value={serial7Score}
                        onChange={(e) => setSerial7Score(parseInt(e.target.value))}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value={0}>0 correct (0 pts)</option>
                        <option value={1}>1 correct (1 pt)</option>
                        <option value={2}>2-3 correct (2 pts)</option>
                        <option value={3}>4-5 correct (3 pts)</option>
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={item.id}
                        checked={answers[item.id] || false}
                        onCheckedChange={(checked) => handleCheck(item.id, checked as boolean)}
                      />
                      <Label htmlFor={item.id} className="text-sm cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-4 pt-4">
          <Button onClick={handleCalculate} className="flex-1">
            Calculate MoCA Score
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 pt-4">
            <div className={`p-6 rounded-lg border ${interpretation.colorClass}`}>
              <div className="text-center mb-4">
                <p className="text-4xl font-bold">{score}/30</p>
                <p className="text-lg font-semibold">{interpretation.level}</p>
              </div>
              <p className="text-sm text-center">{interpretation.description}</p>
              
              {parseInt(yearsEducation) <= 12 && yearsEducation !== '' && (
                <p className="text-xs text-center mt-2 opacity-75">
                  (Includes +1 education adjustment)
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mocaSections.map(section => (
                <div key={section.id} className="p-2 bg-muted rounded text-center text-sm">
                  <p className="font-medium truncate">{section.title}</p>
                  <p>{getSectionScore(section)}/{section.maxPoints}</p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-semibold">Interpretation Guide</p>
                <ul className="mt-1 space-y-1">
                  <li>≥26: Normal cognition</li>
                  <li>18-25: Mild cognitive impairment (MCI)</li>
                  <li>10-17: Moderate impairment</li>
                  <li>&lt;10: Severe impairment</li>
                </ul>
                <p className="mt-2 text-xs">
                  MoCA is more sensitive than MMSE for detecting MCI. 
                  Sensitivity 90%, Specificity 87% for MCI at cutoff 26.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MoCACalculator;
