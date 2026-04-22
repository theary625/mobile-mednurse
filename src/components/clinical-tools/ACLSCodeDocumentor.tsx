import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Pause, 
  Plus, 
  Clock, 
  Zap, 
  Syringe, 
  Heart, 
  Activity,
  FileText,
  Trash2,
  Download,
  RotateCcw
} from 'lucide-react';

interface CodeEvent {
  id: string;
  timestamp: string;
  elapsedTime: string;
  type: 'rhythm' | 'shock' | 'medication' | 'intervention' | 'assessment' | 'other';
  description: string;
}

const rhythmOptions = [
  'Ventricular Fibrillation (VF)',
  'Pulseless Ventricular Tachycardia (pVT)',
  'Asystole',
  'Pulseless Electrical Activity (PEA)',
  'Return of Spontaneous Circulation (ROSC)',
  'Sinus Rhythm',
  'Sinus Bradycardia',
  'Sinus Tachycardia',
  'Atrial Fibrillation',
  'Atrial Flutter',
  'Other',
];

const medicationOptions = [
  'Epinephrine 1mg IV/IO',
  'Amiodarone 300mg IV/IO (1st dose)',
  'Amiodarone 150mg IV/IO (2nd dose)',
  'Lidocaine 1-1.5mg/kg IV/IO',
  'Sodium Bicarbonate 1mEq/kg IV',
  'Calcium Chloride 1g IV',
  'Magnesium Sulfate 2g IV',
  'Atropine 1mg IV',
  'Vasopressin 40 units IV',
  'Naloxone 0.4-2mg IV/IM/IN',
  'D50W 25g IV',
  'Other',
];

const interventionOptions = [
  'CPR Started',
  'CPR Paused - Rhythm Check',
  'CPR Resumed',
  'Advanced Airway - ETT',
  'Advanced Airway - LMA',
  'IV Access Established',
  'IO Access Established',
  'Defibrillator Pads Applied',
  'Pulse Check',
  'ETCO2 Monitoring Started',
  'Therapeutic Hypothermia Initiated',
  'Family Notified',
  'Code Called',
  'Other',
];

const ACLSCodeDocumentor = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [events, setEvents] = useState<CodeEvent[]>([]);
  const [eventType, setEventType] = useState<CodeEvent['type']>('rhythm');
  const [selectedOption, setSelectedOption] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [shockCount, setShockCount] = useState(0);
  const [epiCount, setEpiCount] = useState(0);
  const [lastEpiTime, setLastEpiTime] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false });
  };

  const handleStartCode = () => {
    const now = new Date();
    setStartTime(now);
    setIsRunning(true);
    setElapsedSeconds(0);
    setEvents([{
      id: crypto.randomUUID(),
      timestamp: formatTimestamp(now),
      elapsedTime: '00:00',
      type: 'other',
      description: 'Code Blue Called'
    }]);
  };

  const handleStopCode = () => {
    setIsRunning(false);
    addEvent('Code Ended');
  };

  const handleReset = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setEvents([]);
    setShockCount(0);
    setEpiCount(0);
    setLastEpiTime(null);
  };

  const addEvent = (description?: string) => {
    const desc = description || selectedOption || customDescription;
    if (!desc) return;

    const newEvent: CodeEvent = {
      id: crypto.randomUUID(),
      timestamp: formatTimestamp(new Date()),
      elapsedTime: formatTime(elapsedSeconds),
      type: eventType,
      description: desc
    };

    // Track shocks and epi
    if (desc.toLowerCase().includes('shock') || desc.toLowerCase().includes('defibrillation')) {
      setShockCount(prev => prev + 1);
    }
    if (desc.toLowerCase().includes('epinephrine')) {
      setEpiCount(prev => prev + 1);
      setLastEpiTime(elapsedSeconds);
    }

    setEvents(prev => [...prev, newEvent]);
    setSelectedOption('');
    setCustomDescription('');
  };

  const addQuickShock = (joules: number) => {
    const newEvent: CodeEvent = {
      id: crypto.randomUUID(),
      timestamp: formatTimestamp(new Date()),
      elapsedTime: formatTime(elapsedSeconds),
      type: 'shock',
      description: `Defibrillation ${joules}J delivered`
    };
    setShockCount(prev => prev + 1);
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const getEventIcon = (type: CodeEvent['type']) => {
    switch (type) {
      case 'rhythm': return <Activity className="w-4 h-4" />;
      case 'shock': return <Zap className="w-4 h-4" />;
      case 'medication': return <Syringe className="w-4 h-4" />;
      case 'intervention': return <Heart className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: CodeEvent['type']) => {
    switch (type) {
      case 'rhythm': return 'bg-blue-500';
      case 'shock': return 'bg-yellow-500';
      case 'medication': return 'bg-green-500';
      case 'intervention': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getOptions = () => {
    switch (eventType) {
      case 'rhythm': return rhythmOptions;
      case 'medication': return medicationOptions;
      case 'intervention': return interventionOptions;
      default: return [];
    }
  };

  const exportLog = () => {
    const header = `ACLS Code Documentation
========================
Start Time: ${startTime?.toLocaleString() || 'N/A'}
Total Duration: ${formatTime(elapsedSeconds)}
Total Shocks: ${shockCount}
Total Epinephrine Doses: ${epiCount}

Event Log:
----------
`;
    const eventLog = events.map(e => 
      `[${e.timestamp}] (${e.elapsedTime}) ${e.type.toUpperCase()}: ${e.description}`
    ).join('\n');

    const blob = new Blob([header + eventLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `acls-code-${startTime?.toISOString().split('T')[0] || 'log'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const timeSinceLastEpi = lastEpiTime !== null ? elapsedSeconds - lastEpiTime : null;
  const epiDue = timeSinceLastEpi !== null && timeSinceLastEpi >= 180;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          ACLS Code Documenter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer and Controls */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="text-center">
            <div className={`text-4xl font-mono font-bold ${isRunning ? 'text-red-500' : ''}`}>
              {formatTime(elapsedSeconds)}
            </div>
            <div className="text-xs text-muted-foreground">Elapsed Time</div>
          </div>
          <div className="flex gap-2">
            {!isRunning && events.length === 0 ? (
              <Button onClick={handleStartCode} className="gap-2">
                <Play className="w-4 h-4" />
                Start Code
              </Button>
            ) : !isRunning ? (
              <Button onClick={() => setIsRunning(true)} className="gap-2">
                <Play className="w-4 h-4" />
                Resume
              </Button>
            ) : (
              <Button onClick={handleStopCode} variant="destructive" className="gap-2">
                <Pause className="w-4 h-4" />
                End Code
              </Button>
            )}
            <Button variant="outline" onClick={handleReset} size="icon">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-600">{shockCount}</div>
            <div className="text-xs text-muted-foreground">Shocks</div>
          </div>
          <div className="text-center p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-600">{epiCount}</div>
            <div className="text-xs text-muted-foreground">Epi Doses</div>
          </div>
          <div className={`text-center p-2 rounded-lg border ${epiDue ? 'bg-red-500/10 border-red-500 animate-pulse' : 'bg-muted border-border'}`}>
            <div className={`text-2xl font-bold ${epiDue ? 'text-red-500' : ''}`}>
              {timeSinceLastEpi !== null ? formatTime(timeSinceLastEpi) : '--:--'}
            </div>
            <div className="text-xs text-muted-foreground">Since Last Epi</div>
            {epiDue && <Badge variant="destructive" className="mt-1 text-xs">EPI DUE</Badge>}
          </div>
        </div>

        {/* Quick Actions */}
        {isRunning && (
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Quick Actions</Label>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => addQuickShock(200)} className="gap-1">
                <Zap className="w-3 h-3" /> 200J
              </Button>
              <Button size="sm" variant="outline" onClick={() => addQuickShock(300)} className="gap-1">
                <Zap className="w-3 h-3" /> 300J
              </Button>
              <Button size="sm" variant="outline" onClick={() => addQuickShock(360)} className="gap-1">
                <Zap className="w-3 h-3" /> 360J
              </Button>
              <Button 
                size="sm" 
                variant={epiDue ? 'destructive' : 'outline'} 
                onClick={() => {
                  setEventType('medication');
                  addEvent('Epinephrine 1mg IV/IO');
                }}
                className="gap-1"
              >
                <Syringe className="w-3 h-3" /> Epi 1mg
              </Button>
            </div>
          </div>
        )}

        {/* Add Event Form */}
        {isRunning && (
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Event Type</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v as CodeEvent['type'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rhythm">Rhythm Change</SelectItem>
                    <SelectItem value="shock">Shock/Defib</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="intervention">Intervention</SelectItem>
                    <SelectItem value="assessment">Assessment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Quick Select</Label>
                <Select value={selectedOption} onValueChange={setSelectedOption}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getOptions().map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Or type custom event..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEvent()}
              />
              <Button onClick={() => addEvent()} size="icon">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Event Log */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Event Log ({events.length})</Label>
            {events.length > 0 && (
              <Button variant="outline" size="sm" onClick={exportLog} className="gap-1">
                <Download className="w-3 h-3" /> Export
              </Button>
            )}
          </div>
          <ScrollArea className="h-64 border rounded-lg">
            <div className="p-2 space-y-1">
              {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Start a code to begin documenting</p>
                </div>
              ) : (
                [...events].reverse().map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 group"
                  >
                    <Badge className={`${getEventColor(event.type)} text-white`}>
                      {getEventIcon(event.type)}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground w-12">
                      {event.elapsedTime}
                    </span>
                    <span className="text-sm flex-1">{event.description}</span>
                    <span className="text-xs text-muted-foreground">{event.timestamp}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteEvent(event.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ACLSCodeDocumentor;
