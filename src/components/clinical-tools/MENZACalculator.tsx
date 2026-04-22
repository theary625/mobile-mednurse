import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertCircle, Brain, RefreshCw, CheckCircle2 } from 'lucide-react';

interface MENZASection {
  id: string;
  name: string;
  maxPoints: number;
  questions: {
    id: string;
    question: string;
    points: number;
  }[];
}

const menzaSections: MENZASection[] = [
  {
    id: 'orientation',
    name: 'Orientation',
    maxPoints: 10,
    questions: [
      { id: 'year', question: 'What year is it?', points: 1 },
      { id: 'season', question: 'What season is it?', points: 1 },
      { id: 'date', question: 'What is today\'s date?', points: 1 },
      { id: 'day', question: 'What day of the week is it?', points: 1 },
      { id: 'month', question: 'What month is it?', points: 1 },
      { id: 'country', question: 'What country are we in?', points: 1 },
      { id: 'state', question: 'What state/province are we in?', points: 1 },
      { id: 'city', question: 'What city/town are we in?', points: 1 },
      { id: 'building', question: 'What building are we in?', points: 1 },
      { id: 'floor', question: 'What floor are we on?', points: 1 },
    ]
  },
  {
    id: 'registration',
    name: 'Registration',
    maxPoints: 3,
    questions: [
      { id: 'word1', question: 'Repeat: "Apple"', points: 1 },
      { id: 'word2', question: 'Repeat: "Table"', points: 1 },
      { id: 'word3', question: 'Repeat: "Penny"', points: 1 },
    ]
  },
  {
    id: 'attention',
    name: 'Attention & Calculation',
    maxPoints: 5,
    questions: [
      { id: 'serial1', question: 'Serial 7s: 100 - 7 = 93', points: 1 },
      { id: 'serial2', question: 'Serial 7s: 93 - 7 = 86', points: 1 },
      { id: 'serial3', question: 'Serial 7s: 86 - 7 = 79', points: 1 },
      { id: 'serial4', question: 'Serial 7s: 79 - 7 = 72', points: 1 },
      { id: 'serial5', question: 'Serial 7s: 72 - 7 = 65', points: 1 },
    ]
  },
  {
    id: 'recall',
    name: 'Recall',
    maxPoints: 3,
    questions: [
      { id: 'recall1', question: 'Recall word 1 (Apple)', points: 1 },
      { id: 'recall2', question: 'Recall word 2 (Table)', points: 1 },
      { id: 'recall3', question: 'Recall word 3 (Penny)', points: 1 },
    ]
  },
  {
    id: 'language',
    name: 'Language',
    maxPoints: 9,
    questions: [
      { id: 'naming1', question: 'Name this object (show pencil)', points: 1 },
      { id: 'naming2', question: 'Name this object (show watch)', points: 1 },
      { id: 'repetition', question: 'Repeat: "No ifs, ands, or buts"', points: 1 },
      { id: 'command1', question: '3-stage command: Take paper in right hand', points: 1 },
      { id: 'command2', question: '3-stage command: Fold it in half', points: 1 },
      { id: 'command3', question: '3-stage command: Put it on the floor', points: 1 },
      { id: 'reading', question: 'Read and obey: "Close your eyes"', points: 1 },
      { id: 'writing', question: 'Write a sentence', points: 1 },
      { id: 'copying', question: 'Copy intersecting pentagons', points: 1 },
    ]
  },
];

const getInterpretation = (score: number) => {
  if (score >= 24) {
    return {
      level: 'normal',
      label: 'Normal Cognition',
      description: 'No cognitive impairment indicated',
      color: 'bg-green-500',
      textColor: 'text-green-600',
    };
  } else if (score >= 19) {
    return {
      level: 'mild',
      label: 'Mild Cognitive Impairment',
      description: 'May indicate early dementia or other cognitive issues',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    };
  } else if (score >= 10) {
    return {
      level: 'moderate',
      label: 'Moderate Cognitive Impairment',
      description: 'Significant cognitive decline - further evaluation needed',
      color: 'bg-orange-500',
      textColor: 'text-orange-600',
    };
  } else {
    return {
      level: 'severe',
      label: 'Severe Cognitive Impairment',
      description: 'Severe cognitive decline - comprehensive evaluation required',
      color: 'bg-red-500',
      textColor: 'text-red-600',
    };
  }
};

const MENZACalculator = () => {
  const [answers, setAnswers] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: 'correct' | 'incorrect') => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setShowResult(false);
  };

  const calculateScore = () => {
    let total = 0;
    menzaSections.forEach(section => {
      section.questions.forEach(q => {
        if (answers[q.id] === 'correct') {
          total += q.points;
        }
      });
    });
    return total;
  };

  const getSectionScore = (section: MENZASection) => {
    let score = 0;
    section.questions.forEach(q => {
      if (answers[q.id] === 'correct') {
        score += q.points;
      }
    });
    return score;
  };

  const getAnsweredCount = () => {
    return Object.values(answers).filter(v => v !== null).length;
  };

  const getTotalQuestions = () => {
    return menzaSections.reduce((acc, s) => acc + s.questions.length, 0);
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  const handleCalculate = () => {
    setShowResult(true);
  };

  const score = calculateScore();
  const interpretation = getInterpretation(score);
  const maxScore = 30;

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-border/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <CardTitle className="text-xl">MMSE / MENZA</CardTitle>
            <CardDescription>Mini-Mental State Examination</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Progress: {getAnsweredCount()} / {getTotalQuestions()} questions
          </span>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {menzaSections.map((section) => (
            <div key={section.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">{section.name}</h3>
                <Badge variant="outline" className="rounded-lg">
                  {getSectionScore(section)} / {section.maxPoints}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {section.questions.map((q) => (
                  <div
                    key={q.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      answers[q.id] === 'correct'
                        ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800'
                        : answers[q.id] === 'incorrect'
                        ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'
                        : 'bg-muted/30 border-border/50'
                    }`}
                  >
                    <span className="text-sm flex-1">{q.question}</span>
                    <RadioGroup
                      value={answers[q.id] || ''}
                      onValueChange={(value) => handleAnswer(q.id, value as 'correct' | 'incorrect')}
                      className="flex gap-2"
                    >
                      <div className="flex items-center">
                        <RadioGroupItem value="correct" id={`${q.id}-correct`} className="sr-only" />
                        <Label
                          htmlFor={`${q.id}-correct`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            answers[q.id] === 'correct'
                              ? 'bg-green-500 text-white'
                              : 'bg-muted hover:bg-green-100 dark:hover:bg-green-900/30'
                          }`}
                        >
                          ✓
                        </Label>
                      </div>
                      <div className="flex items-center">
                        <RadioGroupItem value="incorrect" id={`${q.id}-incorrect`} className="sr-only" />
                        <Label
                          htmlFor={`${q.id}-incorrect`}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                            answers[q.id] === 'incorrect'
                              ? 'bg-red-500 text-white'
                              : 'bg-muted hover:bg-red-100 dark:hover:bg-red-900/30'
                          }`}
                        >
                          ✗
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Calculate Button */}
        <Button onClick={handleCalculate} className="w-full rounded-xl" size="lg">
          Calculate Score
        </Button>

        {/* Results */}
        {showResult && (
          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Total Score</span>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{score}</span>
                <span className="text-muted-foreground">/ {maxScore}</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl ${interpretation.level === 'normal' ? 'bg-green-50 dark:bg-green-950/30' : interpretation.level === 'mild' ? 'bg-yellow-50 dark:bg-yellow-950/30' : interpretation.level === 'moderate' ? 'bg-orange-50 dark:bg-orange-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
              <div className="flex items-start gap-3">
                {interpretation.level === 'normal' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                ) : (
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${interpretation.textColor}`} />
                )}
                <div>
                  <p className={`font-semibold ${interpretation.textColor}`}>{interpretation.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{interpretation.description}</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Score Breakdown</h4>
              <div className="grid grid-cols-2 gap-2">
                {menzaSections.map((section) => (
                  <div key={section.id} className="flex justify-between text-sm p-2 bg-muted/30 rounded-lg">
                    <span>{section.name}</span>
                    <span className="font-medium">{getSectionScore(section)}/{section.maxPoints}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="p-4 bg-muted/30 rounded-xl text-sm space-y-2">
              <p className="font-medium">Interpretation Guidelines:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>24-30: Normal cognition</li>
                <li>19-23: Mild cognitive impairment</li>
                <li>10-18: Moderate cognitive impairment</li>
                <li>0-9: Severe cognitive impairment</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Education level, age, and cultural factors may affect scores. Consider comprehensive neuropsychological testing for diagnosis.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MENZACalculator;
