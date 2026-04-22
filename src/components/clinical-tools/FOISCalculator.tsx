import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Info, TrendingUp, Calendar } from 'lucide-react';

const foisLevels = [
  {
    level: 1,
    name: 'Nothing by mouth',
    description: 'NPO - No oral intake of any kind',
    category: 'Tube Dependent',
    colorClass: 'bg-red-100 border-red-300',
  },
  {
    level: 2,
    name: 'Tube dependent with minimal attempts',
    description: 'Minimal oral intake of food or liquid for pleasure only',
    category: 'Tube Dependent',
    colorClass: 'bg-red-100 border-red-300',
  },
  {
    level: 3,
    name: 'Tube dependent with consistent oral intake',
    description: 'Consistent oral intake of food or liquid',
    category: 'Tube Dependent',
    colorClass: 'bg-orange-100 border-orange-300',
  },
  {
    level: 4,
    name: 'Total oral diet of a single consistency',
    description: 'All nutrition by mouth, single texture only',
    category: 'Total Oral',
    colorClass: 'bg-yellow-100 border-yellow-300',
  },
  {
    level: 5,
    name: 'Total oral diet with multiple consistencies',
    description: 'Multiple textures but requiring special preparation or compensations',
    category: 'Total Oral',
    colorClass: 'bg-lime-100 border-lime-300',
  },
  {
    level: 6,
    name: 'Total oral diet with no special preparation',
    description: 'Multiple textures without special preparation, but with specific food limitations',
    category: 'Total Oral',
    colorClass: 'bg-green-100 border-green-300',
  },
  {
    level: 7,
    name: 'Total oral diet with no restrictions',
    description: 'Normal diet - all foods and liquids without restriction',
    category: 'Total Oral',
    colorClass: 'bg-green-100 border-green-300',
  },
];

interface Assessment {
  date: string;
  level: number;
}

const FOISCalculator: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const currentLevel = selectedLevel ? foisLevels.find(l => l.level === parseInt(selectedLevel)) : null;

  const handleSaveAssessment = () => {
    if (selectedLevel) {
      const newAssessment: Assessment = {
        date: new Date().toLocaleDateString(),
        level: parseInt(selectedLevel),
      };
      setAssessments([newAssessment, ...assessments.slice(0, 9)]); // Keep last 10
    }
  };

  const handleReset = () => {
    setSelectedLevel('');
  };

  const getProgressIndicator = () => {
    if (assessments.length < 2) return null;
    const current = assessments[0].level;
    const previous = assessments[1].level;
    if (current > previous) return { text: 'Improving', color: 'text-green-600' };
    if (current < previous) return { text: 'Declining', color: 'text-red-600' };
    return { text: 'Stable', color: 'text-blue-600' };
  };

  const progress = getProgressIndicator();

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">FOIS - Functional Oral Intake Scale</CardTitle>
        <p className="text-emerald-100 text-sm mt-1">
          7-level ordinal scale to track oral intake and dysphagia treatment progress
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Select the level that best describes the patient's current 
            functional oral intake status. Use for baseline assessment and to track progress over time.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Select Current FOIS Level</h3>
          <RadioGroup
            value={selectedLevel}
            onValueChange={setSelectedLevel}
            className="space-y-3"
          >
            {foisLevels.map((level) => (
              <div
                key={level.level}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLevel === level.level.toString()
                    ? level.colorClass + ' border-opacity-100'
                    : 'bg-muted/30 border-transparent hover:border-muted'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={level.level.toString()} id={`fois-${level.level}`} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={`fois-${level.level}`} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">Level {level.level}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted">
                          {level.category}
                        </span>
                      </div>
                      <p className="font-medium mt-1">{level.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{level.description}</p>
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {currentLevel && (
          <div className={`p-6 rounded-lg border-2 ${currentLevel.colorClass}`}>
            <div className="text-center">
              <p className="text-4xl font-bold">Level {currentLevel.level}</p>
              <p className="text-lg font-semibold mt-2">{currentLevel.name}</p>
              <p className="text-sm mt-1 opacity-80">{currentLevel.category}</p>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Button onClick={handleSaveAssessment} disabled={!selectedLevel} className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Log Assessment
          </Button>
          <Button onClick={() => setShowHistory(!showHistory)} variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            {showHistory ? 'Hide' : 'Show'} History
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>

        {showHistory && assessments.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Assessment History</h3>
              {progress && (
                <span className={`text-sm font-medium ${progress.color}`}>
                  Trend: {progress.text}
                </span>
              )}
            </div>
            <div className="space-y-2">
              {assessments.map((assessment, index) => {
                const levelInfo = foisLevels.find(l => l.level === assessment.level);
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-center justify-between ${levelInfo?.colorClass || 'bg-muted/30'}`}
                  >
                    <div>
                      <span className="font-medium">Level {assessment.level}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        {levelInfo?.name}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{assessment.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">FOIS Clinical Notes</p>
            <ul className="mt-1 space-y-1">
              <li>• Levels 1-3: Tube dependent (some or all nutrition via tube)</li>
              <li>• Levels 4-7: Total oral diet (no tube feeding required)</li>
              <li>• Higher levels indicate better functional swallowing</li>
              <li>• Validated outcome measure for dysphagia treatment</li>
              <li>• Use serial assessments to document treatment response</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FOISCalculator;
