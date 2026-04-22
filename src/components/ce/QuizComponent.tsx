import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { CEQuiz, QuizQuestion } from '@/types/ce';
import { useSubmitQuiz } from '@/hooks/useCEProgress';
import { cn } from '@/lib/utils';

interface QuizComponentProps {
  quiz: CEQuiz;
  courseTitle: string;
  onComplete: (score: number, passed: boolean) => void;
  onBack: () => void;
}

const QuizComponent = ({ quiz, courseTitle, onComplete, onBack }: QuizComponentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitQuiz = useSubmitQuiz();

  const questions = quiz.questions;
  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectAnswer = (optionId: string) => {
    if (showResults) return;
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / totalQuestions) * 100);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const score = calculateScore();
    const passed = score >= quiz.passing_score;

    try {
      await submitQuiz.mutateAsync({
        courseId: quiz.course_id,
        score,
        passed
      });
      setShowResults(true);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentIndex(0);
    setShowResults(false);
  };

  const score = showResults ? calculateScore() : 0;
  const passed = score >= quiz.passing_score;

  // Results Screen
  if (showResults) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Course
        </Button>

        <Card className={cn(
          "border-border/50 shadow-soft rounded-2xl overflow-hidden",
          passed ? "border-success/30" : "border-destructive/30"
        )}>
          <CardContent className="p-8 text-center">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6",
              passed ? "bg-success-glow" : "bg-destructive/10"
            )}>
              {passed ? (
                <Trophy className="w-10 h-10 text-success" />
              ) : (
                <XCircle className="w-10 h-10 text-destructive" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {passed ? 'Congratulations!' : 'Keep Trying!'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {passed 
                ? 'You passed the assessment and earned your CE credits!'
                : `You need ${quiz.passing_score}% to pass. Review the material and try again.`}
            </p>

            <div className="text-5xl font-bold mb-2" style={{ color: passed ? 'hsl(var(--success))' : 'hsl(var(--destructive))' }}>
              {score}%
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {Object.keys(answers).filter(qId => {
                const q = questions.find(question => question.id === qId);
                return q && answers[qId] === q.correct_answer;
              }).length} of {totalQuestions} correct
            </p>

            <div className="flex gap-3 justify-center">
              {passed ? (
                <Button onClick={() => onComplete(score, passed)} className="rounded-xl">
                  Continue
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={onBack} className="rounded-xl">
                    Review Lessons
                  </Button>
                  <Button onClick={handleRetry} className="rounded-xl gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Answer Review</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border/50">
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correct_answer;
              const correctOption = q.options.find(o => o.id === q.correct_answer);
              const userOption = q.options.find(o => o.id === userAnswer);

              return (
                <div key={q.id} className="py-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      isCorrect ? "bg-success-glow text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm mb-2">
                        {idx + 1}. {q.question}
                      </p>
                      {!isCorrect && (
                        <div className="space-y-1 text-sm">
                          <p className="text-destructive">Your answer: {userOption?.text || 'Not answered'}</p>
                          <p className="text-success">Correct answer: {correctOption?.text}</p>
                        </div>
                      )}
                      {q.explanation && (
                        <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Taking Screen
  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="gap-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Course
      </Button>

      {/* Header */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Course Assessment</p>
              <p className="font-medium text-foreground">{courseTitle}</p>
            </div>
            <Badge variant="secondary">
              {answeredCount}/{totalQuestions} Answered
            </Badge>
          </div>
          <Progress value={(currentIndex + 1) / totalQuestions * 100} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Question {currentIndex + 1} of {totalQuestions}</span>
            <span>{quiz.passing_score}% to pass</span>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 text-left transition-all",
                    isSelected 
                      ? "border-primary bg-primary-glow" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                    )}>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
                    </div>
                    <span className={cn(
                      "text-sm",
                      isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                    )}>
                      {option.text}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="gap-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>

        {currentIndex < totalQuestions - 1 ? (
          <Button
            onClick={handleNext}
            className="gap-2 rounded-xl"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={answeredCount < totalQuestions || isSubmitting}
            className="gap-2 rounded-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </Button>
        )}
      </div>

      {/* Warning if not all answered */}
      {currentIndex === totalQuestions - 1 && answeredCount < totalQuestions && (
        <Card className="border-warning/30 bg-warning/5 rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              Please answer all questions before submitting. {totalQuestions - answeredCount} question{totalQuestions - answeredCount !== 1 ? 's' : ''} remaining.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizComponent;
