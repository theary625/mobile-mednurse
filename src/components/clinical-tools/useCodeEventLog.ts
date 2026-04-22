import { useState, useCallback } from 'react';

export interface CodeEvent {
  id: string;
  timestamp: string;
  elapsedTime: string;
  type: 'rhythm' | 'shock' | 'medication' | 'intervention' | 'assessment' | 'other';
  description: string;
}

const formatTimestamp = (date: Date) =>
  date.toLocaleTimeString('en-US', { hour12: false });

const formatElapsed = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const useCodeEventLog = () => {
  const [events, setEvents] = useState<CodeEvent[]>([]);

  const addEvent = useCallback((
    type: CodeEvent['type'],
    description: string,
    elapsedSeconds: number
  ) => {
    const newEvent: CodeEvent = {
      id: crypto.randomUUID(),
      timestamp: formatTimestamp(new Date()),
      elapsedTime: formatElapsed(elapsedSeconds),
      type,
      description,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const exportLog = useCallback((meta: {
    startTime: Date | null;
    totalSeconds: number;
    shockCount: number;
    epiCount: number;
    codeType: string;
  }) => {
    const header = `${meta.codeType} Code Documentation
========================
Start Time: ${meta.startTime?.toLocaleString() || 'N/A'}
Total Duration: ${formatElapsed(meta.totalSeconds)}
Total Shocks: ${meta.shockCount}
Total Epinephrine Doses: ${meta.epiCount}

Event Log:
----------
`;
    const eventLog = events
      .map(e => `[${e.timestamp}] (${e.elapsedTime}) ${e.type.toUpperCase()}: ${e.description}`)
      .join('\n');

    const blob = new Blob([header + eventLog], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.codeType.toLowerCase()}-code-${meta.startTime?.toISOString().split('T')[0] || 'log'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [events]);

  return { events, addEvent, deleteEvent, clearEvents, exportLog };
};
