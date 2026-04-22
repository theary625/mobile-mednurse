import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, Baby, Clock, AlertTriangle, Trash2, CheckCircle, Plus } from 'lucide-react';
import { format } from 'date-fns';

interface KickSession {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date | null;
  kicks: Date[];
  completed: boolean;
  duration: number | null; // minutes
}

const KickCounter: React.FC = () => {
  const [sessions, setSessions] = useState<KickSession[]>([]);
  const [activeSession, setActiveSession] = useState<KickSession | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const TARGET_KICKS = 10;
  const MAX_TIME_MINUTES = 120; // 2 hours

  useEffect(() => {
    if (activeSession) {
      intervalRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - activeSession.startTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setElapsedTime(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSession]);

  const startSession = () => {
    const now = new Date();
    const newSession: KickSession = {
      id: Date.now().toString(),
      date: now,
      startTime: now,
      endTime: null,
      kicks: [],
      completed: false,
      duration: null,
    };
    setActiveSession(newSession);
  };

  const recordKick = () => {
    if (!activeSession) return;

    const now = new Date();
    const newKicks = [...activeSession.kicks, now];
    
    if (newKicks.length >= TARGET_KICKS) {
      // Session complete
      const duration = Math.round((now.getTime() - activeSession.startTime.getTime()) / 60000);
      const completedSession: KickSession = {
        ...activeSession,
        kicks: newKicks,
        endTime: now,
        completed: true,
        duration,
      };
      setSessions([completedSession, ...sessions]);
      setActiveSession(null);
    } else {
      setActiveSession({
        ...activeSession,
        kicks: newKicks,
      });
    }
  };

  const endSessionEarly = () => {
    if (!activeSession) return;

    const now = new Date();
    const duration = Math.round((now.getTime() - activeSession.startTime.getTime()) / 60000);
    const incompleteSession: KickSession = {
      ...activeSession,
      endTime: now,
      completed: false,
      duration,
    };
    setSessions([incompleteSession, ...sessions]);
    setActiveSession(null);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
  };

  const clearHistory = () => {
    setSessions([]);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionStatus = (session: KickSession) => {
    if (session.completed && session.duration && session.duration <= 60) {
      return { status: 'Normal', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    } else if (session.completed && session.duration && session.duration <= 120) {
      return { status: 'Normal (Slower)', color: 'bg-yellow-100 text-yellow-800', icon: CheckCircle };
    } else if (!session.completed) {
      return { status: 'Incomplete', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    }
    return { status: 'Delayed', color: 'bg-orange-100 text-orange-800', icon: AlertTriangle };
  };

  const kicksRemaining = activeSession ? TARGET_KICKS - activeSession.kicks.length : TARGET_KICKS;
  const elapsedMinutes = Math.floor(elapsedTime / 60);
  const isOverTime = elapsedMinutes >= MAX_TIME_MINUTES;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Baby className="h-5 w-5" />
          Fetal Kick Counter
        </CardTitle>
        <p className="text-violet-100 text-sm mt-1">
          Count to 10 method for fetal movement monitoring
        </p>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Instructions:</strong> Count any fetal movements (kicks, rolls, swishes, flutters). 
            Aim to feel 10 movements within 2 hours. Best done at the same time daily, when baby is usually active.
          </p>
        </div>

        {/* Main Counter Display */}
        <div className={`p-8 rounded-xl text-center transition-all ${
          activeSession 
            ? isOverTime 
              ? 'bg-gradient-to-br from-red-100 to-orange-100 border-2 border-red-300'
              : 'bg-gradient-to-br from-violet-100 to-purple-100 border-2 border-violet-300' 
            : 'bg-muted/30 border-2 border-transparent'
        }`}>
          {activeSession ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</span>
              </div>
              
              {/* Kick Progress */}
              <div className="mb-6">
                <div className="flex justify-center gap-2 mb-3">
                  {Array.from({ length: TARGET_KICKS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        i < activeSession.kicks.length
                          ? 'bg-violet-500 text-white scale-110'
                          : 'bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {kicksRemaining > 0 ? `${kicksRemaining} more to go` : 'Complete!'}
                </p>
              </div>

              <Button 
                onClick={recordKick} 
                size="lg" 
                className="bg-violet-500 hover:bg-violet-600 text-white px-16 py-10 text-2xl rounded-full shadow-lg"
              >
                <Plus className="h-8 w-8 mr-2" />
                KICK
              </Button>
              
              <p className="text-sm text-muted-foreground mt-4">
                Tap each time you feel movement
              </p>

              {isOverTime && (
                <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-800 text-sm">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Over 2 hours - consider contacting your provider
                </div>
              )}

              <Button 
                onClick={endSessionEarly} 
                variant="ghost" 
                size="sm"
                className="mt-4 text-muted-foreground"
              >
                End Session Early
              </Button>
            </>
          ) : (
            <>
              <Baby className="h-16 w-16 mx-auto text-violet-400 mb-4" />
              <Button 
                onClick={startSession} 
                size="lg" 
                className="bg-violet-500 hover:bg-violet-600 text-white px-12 py-8 text-xl rounded-full"
              >
                Start Counting
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Begin when you're ready to count movements
              </p>
            </>
          )}
        </div>

        {/* Recent Sessions */}
        {sessions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent Sessions</h3>
              <Button onClick={clearHistory} variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-1" />
                Clear History
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {sessions.map((session) => {
                const status = getSessionStatus(session);
                return (
                  <div 
                    key={session.id} 
                    className="p-4 bg-muted/30 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${status.color}`}>
                        <status.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {format(session.date, 'MMM d, yyyy')} at {format(session.startTime, 'h:mm a')}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Badge variant="outline">
                            {session.kicks.length} kicks
                          </Badge>
                          <Badge variant="outline">
                            {session.duration} min
                          </Badge>
                          <Badge className={status.color}>
                            {status.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteSession(session.id)}
                      className="text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Clinical Guidelines */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-green-800">
            <p className="font-semibold">Normal Fetal Movement</p>
            <ul className="mt-1 space-y-1">
              <li>• 10 movements in under 2 hours is reassuring</li>
              <li>• Most babies reach 10 kicks in 15-30 minutes</li>
              <li>• Movements may decrease slightly near term (less room)</li>
              <li>• Pattern matters more than absolute count</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">When to Contact Your Provider</p>
            <ul className="mt-1 space-y-1">
              <li>• Fewer than 10 movements in 2 hours</li>
              <li>• Noticeable decrease from baby's usual pattern</li>
              <li>• No movements felt for several hours</li>
              <li>• Any concerns about baby's activity level</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold">Tips for Counting</p>
            <ul className="mt-1 space-y-1">
              <li>• Count at the same time each day (after meals is often best)</li>
              <li>• Lie on your side or sit with feet up</li>
              <li>• Focus on baby - minimize distractions</li>
              <li>• Drink cold water or juice to stimulate movement</li>
              <li>• Start counting around 28 weeks gestation</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KickCounter;
