import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Play, Square, Clock, Activity, AlertTriangle, Trash2, Baby } from 'lucide-react';
import { format } from 'date-fns';

interface Contraction {
  id: string;
  startTime: Date;
  endTime: Date | null;
  duration: number | null; // seconds
  intensity: 'mild' | 'moderate' | 'strong' | null;
  intervalFromPrevious: number | null; // seconds
}

const ContractionTimer: React.FC = () => {
  const [contractions, setContractions] = useState<Contraction[]>([]);
  const [activeContraction, setActiveContraction] = useState<Contraction | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeSinceLast, setTimeSinceLast] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer for active contraction
  useEffect(() => {
    if (activeContraction) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeContraction.startTime.getTime()) / 1000));
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsedTime(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeContraction]);

  // Timer for time since last contraction
  useEffect(() => {
    if (!activeContraction && contractions.length > 0) {
      const lastContraction = contractions[0];
      if (lastContraction.endTime) {
        restIntervalRef.current = setInterval(() => {
          setTimeSinceLast(Math.floor((Date.now() - lastContraction.endTime!.getTime()) / 1000));
        }, 1000);
      }
    } else {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
      setTimeSinceLast(0);
    }
    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [activeContraction, contractions]);

  const startContraction = () => {
    const now = new Date();
    const lastContraction = contractions[0];
    const interval = lastContraction?.endTime 
      ? Math.floor((now.getTime() - lastContraction.endTime.getTime()) / 1000)
      : null;

    const newContraction: Contraction = {
      id: Date.now().toString(),
      startTime: now,
      endTime: null,
      duration: null,
      intensity: null,
      intervalFromPrevious: interval,
    };
    setActiveContraction(newContraction);
  };

  const stopContraction = (intensity: 'mild' | 'moderate' | 'strong') => {
    if (!activeContraction) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - activeContraction.startTime.getTime()) / 1000);

    const completedContraction: Contraction = {
      ...activeContraction,
      endTime,
      duration,
      intensity,
    };

    setContractions([completedContraction, ...contractions]);
    setActiveContraction(null);
  };

  const deleteContraction = (id: string) => {
    setContractions(contractions.filter(c => c.id !== id));
  };

  const clearAll = () => {
    setContractions([]);
    setActiveContraction(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAverages = () => {
    const completed = contractions.filter(c => c.duration && c.intervalFromPrevious);
    if (completed.length < 2) return null;

    const avgDuration = completed.reduce((sum, c) => sum + (c.duration || 0), 0) / completed.length;
    const withIntervals = completed.filter(c => c.intervalFromPrevious);
    const avgInterval = withIntervals.length > 0
      ? withIntervals.reduce((sum, c) => sum + (c.intervalFromPrevious || 0), 0) / withIntervals.length
      : 0;
    
    // Frequency = interval + duration (time from start of one to start of next)
    const avgFrequency = avgInterval + avgDuration;

    return { avgDuration, avgInterval, avgFrequency };
  };

  const getLaborStage = () => {
    const avgs = getAverages();
    if (!avgs) return null;

    const freqMins = avgs.avgFrequency / 60;
    const durSecs = avgs.avgDuration;

    if (freqMins <= 3 && durSecs >= 60) {
      return { stage: 'Active Labor / Transition', color: 'bg-red-100 text-red-800 border-red-200', alert: true };
    } else if (freqMins <= 5 && durSecs >= 45) {
      return { stage: 'Active Labor', color: 'bg-orange-100 text-orange-800 border-orange-200', alert: true };
    } else if (freqMins <= 10 && durSecs >= 30) {
      return { stage: 'Early Labor', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', alert: false };
    } else {
      return { stage: 'Pre-Labor / Prodromal', color: 'bg-green-100 text-green-800 border-green-200', alert: false };
    }
  };

  const averages = getAverages();
  const laborStage = getLaborStage();

  const getIntensityColor = (intensity: string | null) => {
    switch (intensity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'strong': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" />
          Contraction Timer
        </CardTitle>
        <p className="text-rose-100 text-sm mt-1">
          Track labor contractions - frequency, duration, and intensity
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Main Timer Display */}
        <div className={`p-8 rounded-xl text-center transition-all ${
          activeContraction 
            ? 'bg-gradient-to-br from-rose-100 to-pink-100 border-2 border-rose-300' 
            : 'bg-muted/30 border-2 border-transparent'
        }`}>
          {activeContraction ? (
            <>
              <p className="text-sm font-medium text-rose-600 mb-2">CONTRACTION IN PROGRESS</p>
              <p className="text-6xl font-bold text-rose-700 font-mono">{formatTime(elapsedTime)}</p>
              <p className="text-sm text-rose-600 mt-2">Tap intensity when contraction ends</p>
              
              <div className="flex gap-3 justify-center mt-6">
                <Button 
                  onClick={() => stopContraction('mild')} 
                  variant="outline"
                  className="bg-green-100 hover:bg-green-200 text-green-800 border-green-300"
                >
                  Mild
                </Button>
                <Button 
                  onClick={() => stopContraction('moderate')} 
                  variant="outline"
                  className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
                >
                  Moderate
                </Button>
                <Button 
                  onClick={() => stopContraction('strong')} 
                  variant="outline"
                  className="bg-red-100 hover:bg-red-200 text-red-800 border-red-300"
                >
                  Strong
                </Button>
              </div>
            </>
          ) : (
            <>
              {contractions.length > 0 && (
                <p className="text-sm text-muted-foreground mb-2">
                  Time since last: <span className="font-mono font-bold">{formatTime(timeSinceLast)}</span>
                </p>
              )}
              <Button 
                onClick={startContraction} 
                size="lg" 
                className="bg-rose-500 hover:bg-rose-600 text-white px-12 py-8 text-xl rounded-full"
              >
                <Play className="h-6 w-6 mr-2" />
                Start Contraction
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Press when contraction begins
              </p>
            </>
          )}
        </div>

        {/* Statistics Summary */}
        {averages && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <Clock className="h-5 w-5 mx-auto text-blue-600 mb-1" />
              <p className="text-sm text-blue-700">Avg Duration</p>
              <p className="text-2xl font-bold text-blue-800">{formatTime(Math.round(averages.avgDuration))}</p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
              <Activity className="h-5 w-5 mx-auto text-purple-600 mb-1" />
              <p className="text-sm text-purple-700">Avg Frequency</p>
              <p className="text-2xl font-bold text-purple-800">{(averages.avgFrequency / 60).toFixed(1)} min</p>
              <p className="text-xs text-purple-600">start to start</p>
            </div>
            <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg text-center">
              <Clock className="h-5 w-5 mx-auto text-teal-600 mb-1" />
              <p className="text-sm text-teal-700">Avg Rest</p>
              <p className="text-2xl font-bold text-teal-800">{formatTime(Math.round(averages.avgInterval))}</p>
            </div>
          </div>
        )}

        {/* Labor Stage Indicator */}
        {laborStage && (
          <div className={`p-4 rounded-lg border ${laborStage.color} flex items-center gap-3`}>
            {laborStage.alert && <AlertTriangle className="h-5 w-5 flex-shrink-0" />}
            <div>
              <p className="font-semibold">Estimated Stage: {laborStage.stage}</p>
              {laborStage.alert && (
                <p className="text-sm mt-1">Consider contacting healthcare provider or going to hospital</p>
              )}
            </div>
          </div>
        )}

        {/* Contraction History */}
        {contractions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Contraction History ({contractions.length})</h3>
              <Button onClick={clearAll} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {contractions.map((contraction, index) => (
                <div 
                  key={contraction.id} 
                  className="p-3 bg-muted/30 rounded-lg flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">
                      #{contractions.length - index}
                    </span>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{format(contraction.startTime, 'h:mm:ss a')}</span>
                        {contraction.intervalFromPrevious && (
                          <span className="text-muted-foreground ml-2">
                            ({formatTime(contraction.intervalFromPrevious)} since last)
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {contraction.duration ? formatTime(contraction.duration) : '--'} duration
                        </Badge>
                        {contraction.intensity && (
                          <Badge className={`text-xs ${getIntensityColor(contraction.intensity)}`}>
                            {contraction.intensity}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteContraction(contraction.id)}
                    className="text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical Guidelines */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">When to Go to the Hospital</p>
            <ul className="mt-1 space-y-1">
              <li>• <strong>5-1-1 Rule:</strong> Contractions 5 min apart, lasting 1 min, for 1 hour</li>
              <li>• <strong>4-1-1 Rule:</strong> Some providers recommend 4 min apart</li>
              <li>• Water breaks or significant bleeding</li>
              <li>• Decreased fetal movement</li>
              <li>• Any concerns - trust your instincts</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Labor Progression Guide</p>
            <ul className="mt-1 space-y-1">
              <li>• <strong>Pre-labor:</strong> Irregular, &gt;10 min apart, &lt;30 sec</li>
              <li>• <strong>Early labor:</strong> 5-10 min apart, 30-45 sec, mild-moderate</li>
              <li>• <strong>Active labor:</strong> 3-5 min apart, 45-60 sec, strong</li>
              <li>• <strong>Transition:</strong> 2-3 min apart, 60-90 sec, very strong</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractionTimer;
