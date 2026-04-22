import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, Pause, RotateCcw, AlertTriangle, CheckCircle2, Timer } from 'lucide-react';

const DoorToNeedleCalculator = () => {
  const [arrivalTime, setArrivalTime] = useState<Date | null>(null);
  const [needleTime, setNeedleTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && arrivalTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - arrivalTime.getTime()) / 1000));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, arrivalTime]);

  const startTimer = () => {
    const now = new Date();
    setArrivalTime(now);
    setNeedleTime(null);
    setIsRunning(true);
    setElapsedTime(0);
  };

  const stopTimer = () => {
    const now = new Date();
    setNeedleTime(now);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setArrivalTime(null);
    setNeedleTime(null);
    setElapsedTime(0);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeStatus = (seconds: number) => {
    const minutes = seconds / 60;
    if (minutes <= 30) return { label: 'Excellent', color: 'text-success', bg: 'bg-success' };
    if (minutes <= 45) return { label: 'Good', color: 'text-success', bg: 'bg-success/80' };
    if (minutes <= 60) return { label: 'Target Met', color: 'text-warning', bg: 'bg-warning' };
    return { label: 'Exceeded Target', color: 'text-destructive', bg: 'bg-destructive' };
  };

  const targetSeconds = 60 * 60; // 60 minutes
  const goalSeconds = 45 * 60; // 45 minutes goal
  const progressPercent = Math.min((elapsedTime / targetSeconds) * 100, 100);

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-warning/10 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Timer className="w-5 h-5 text-warning" />
          </div>
          <div>
            <CardTitle className="text-lg">Door-to-Needle Timer</CardTitle>
            <CardDescription>Target: ≤60 min (Goal: ≤45 min)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 pt-4">
        {/* Timer Display */}
        <div className="text-center py-6">
          <div className={`text-6xl font-mono font-bold ${
            elapsedTime > targetSeconds ? 'text-destructive' :
            elapsedTime > goalSeconds ? 'text-warning' : 'text-foreground'
          }`}>
            {formatTime(elapsedTime)}
          </div>
          {isRunning && (
            <p className="text-sm text-muted-foreground mt-2">
              Time since arrival
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 min</span>
            <span className="text-success">45 min (goal)</span>
            <span className="text-warning">60 min (target)</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden relative">
            {/* Goal marker */}
            <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-success z-10" />
            {/* Progress */}
            <div 
              className={`h-full transition-all duration-300 ${
                progressPercent > 100 ? 'bg-destructive' :
                progressPercent > 75 ? 'bg-warning' : 'bg-success'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isRunning && !arrivalTime && (
            <Button onClick={startTimer} className="flex-1 h-12 rounded-xl gap-2">
              <Play className="w-5 h-5" />
              Start Timer (Patient Arrived)
            </Button>
          )}
          
          {isRunning && (
            <Button onClick={stopTimer} className="flex-1 h-12 rounded-xl gap-2 bg-success hover:bg-success/90">
              <CheckCircle2 className="w-5 h-5" />
              Stop (tPA Administered)
            </Button>
          )}
          
          {arrivalTime && (
            <Button onClick={resetTimer} variant="outline" className="h-12 rounded-xl gap-2">
              <RotateCcw className="w-5 h-5" />
              Reset
            </Button>
          )}
        </div>

        {/* Time Stamps */}
        {arrivalTime && (
          <div className="p-4 rounded-xl bg-muted/50 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Arrival Time</span>
              </div>
              <span className="font-mono font-medium">
                {arrivalTime.toLocaleTimeString()}
              </span>
            </div>
            
            {needleTime && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span className="text-sm">Needle Time</span>
                  </div>
                  <span className="font-mono font-medium">
                    {needleTime.toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-sm font-medium">Door-to-Needle Time</span>
                  <Badge className={getTimeStatus(elapsedTime).bg}>
                    {formatTime(elapsedTime)} - {getTimeStatus(elapsedTime).label}
                  </Badge>
                </div>
              </>
            )}
          </div>
        )}

        {/* Warning for exceeded time */}
        {isRunning && elapsedTime > goalSeconds && (
          <div className={`p-3 rounded-xl ${
            elapsedTime > targetSeconds ? 'bg-destructive/10 border border-destructive/20' : 'bg-warning/10 border border-warning/20'
          }`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-4 h-4 ${
                elapsedTime > targetSeconds ? 'text-destructive' : 'text-warning'
              }`} />
              <p className={`text-sm font-medium ${
                elapsedTime > targetSeconds ? 'text-destructive' : 'text-warning'
              }`}>
                {elapsedTime > targetSeconds 
                  ? 'TARGET TIME EXCEEDED - Expedite administration'
                  : 'Approaching target time - Expedite if possible'
                }
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoorToNeedleCalculator;
