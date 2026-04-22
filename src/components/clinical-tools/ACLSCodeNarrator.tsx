import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  Syringe, 
  HeartPulse,
  Volume2,
  VolumeX,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  Users,
  Wind,
  Stethoscope,
  RefreshCw,
  Printer,
  ExternalLink
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import CodeSummaryPrint, { CodeSummaryData } from './CodeSummaryPrint';
import { useCodeEventLog } from './useCodeEventLog';
import CodeEventLogPanel from './CodeEventLogPanel';

type Rhythm = 'vf_pvt' | 'asystole_pea';
type Phase = 'idle' | 'cpr' | 'rhythm_check' | 'shock' | 'rosc';

interface ActionItem {
  text: string;
  priority: 'current' | 'next' | 'upcoming';
  type: 'cpr' | 'shock' | 'medication' | 'check' | 'assessment' | 'airway';
}

interface CodeChecklist {
  ivAccess: boolean;
  advancedAirway: boolean;
  capnography: boolean;
  defibrillatorReady: boolean;
  codeTeamAssembled: boolean;
}

const REVERSIBLE_CAUSES = {
  hs: [
    { id: 'hypovolemia', label: 'Hypovolemia', hint: 'Volume replacement' },
    { id: 'hypoxia', label: 'Hypoxia', hint: 'Oxygenation/ventilation' },
    { id: 'hydrogen', label: 'Hydrogen ion (acidosis)', hint: 'Bicarb if severe' },
    { id: 'hypokalemia', label: 'Hypo/Hyperkalemia', hint: 'Check K+, treat accordingly' },
    { id: 'hypothermia', label: 'Hypothermia', hint: 'Rewarm patient' },
  ],
  ts: [
    { id: 'tension', label: 'Tension pneumothorax', hint: 'Needle decompression' },
    { id: 'tamponade', label: 'Cardiac Tamponade', hint: 'Pericardiocentesis' },
    { id: 'toxins', label: 'Toxins/Overdose', hint: 'Specific antidotes' },
    { id: 'thrombosis_pulmonary', label: 'Thrombosis (PE)', hint: 'Consider thrombolytics' },
    { id: 'thrombosis_coronary', label: 'Thrombosis (MI)', hint: 'PCI if ROSC' },
  ],
};

const CPR_CYCLE_DURATION = 120; // 2 minutes in seconds
const EPI_INTERVAL = 180; // 3-5 minutes between doses (using 3 min)
const COMPRESSOR_SWITCH_INTERVAL = 120; // Switch every 2 minutes
const REFRACTORY_SHOCK_THRESHOLD = 3; // Consider vector change/DSED after 3+ shocks
const TERMINATION_CONSIDER_TIME = 1200; // 20 minutes - consider termination if ETCO2 ≤10

// AHA 2025 CPR Quality Metrics
const CPR_QUALITY = {
  rate: '100-120/min',
  depth: 'At least 2 inches (5 cm)',
  recoil: 'Allow complete chest recoil',
  minimizeInterruptions: '<10 seconds for rhythm check',
  ventilationRatio: '30:2 without advanced airway',
  ventilationRate: '1 breath every 6 sec with advanced airway',
  cprFractionGoal: '>60% (target >80%)',
  etco2Target: '≥10 mmHg (ideal >20 mmHg)',
};

// 2025 Key Updates
const GUIDELINES_2025 = {
  singleShockApproach: true, // Single shock + immediate CPR (not stacked)
  vectorChangeAfterShocks: 3, // May consider after ≥3 shocks
  dsedAfterShocks: 3, // Double sequential defibrillation after ≥3 shocks
  epiAfterDefibFails: true, // For shockable: give after initial defib attempts fail
  epiAsapNonShockable: true, // For non-shockable: give ASAP
  noVasopressinSubstitute: true, // Do NOT substitute vasopressin for epi
  noRoutineCalcium: true,
  noRoutineBicarb: true,
  noRoutineMagnesium: true,
  noHeadUpCPR: true, // Do NOT use head-up CPR outside clinical trials
  deferAirwayIfInterrupts: true, // Defer airway if it interrupts compressions
};

const ACLSCodeNarrator = () => {
  const [rhythm, setRhythm] = useState<Rhythm | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [cprSeconds, setCprSeconds] = useState(CPR_CYCLE_DURATION);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [shockCount, setShockCount] = useState(0);
  const [epiCount, setEpiCount] = useState(0);
  const [amioCount, setAmioCount] = useState(0);
  const [lidocaineGiven, setLidocaineGiven] = useState(false);
  const [lastEpiTime, setLastEpiTime] = useState<number | null>(null);
  const [checkedCauses, setCheckedCauses] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState(false);
  const [causesOpen, setCausesOpen] = useState(false);
  const [cprCycleCount, setCprCycleCount] = useState(0);
  const [checklist, setChecklist] = useState<CodeChecklist>({
    ivAccess: false,
    advancedAirway: false,
    capnography: false,
    defibrillatorReady: false,
    codeTeamAssembled: false,
  });
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [etco2Value, setEtco2Value] = useState<number | null>(null);
  const [codeStartTime, setCodeStartTime] = useState<Date | null>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [, setSearchParams] = useSearchParams();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const printRef = useRef<HTMLDivElement>(null);
  
  const { events: logEvents, addEvent: addLogEvent, deleteEvent: deleteLogEvent, clearEvents: clearLogEvents, exportLog } = useCodeEventLog();

  // Initialize audio context
  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (isMuted) return;
    
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  }, [isMuted, getAudioContext]);

  const playAlertTone = useCallback(() => {
    playTone(880, 0.15, 'square');
    setTimeout(() => playTone(880, 0.15, 'square'), 200);
  }, [playTone]);

  const playUrgentTone = useCallback(() => {
    playTone(1000, 0.1, 'square');
    setTimeout(() => playTone(1200, 0.1, 'square'), 150);
    setTimeout(() => playTone(1000, 0.1, 'square'), 300);
  }, [playTone]);

  const playSuccessTone = useCallback(() => {
    playTone(523, 0.1);
    setTimeout(() => playTone(659, 0.1), 100);
    setTimeout(() => playTone(784, 0.2), 200);
  }, [playTone]);

  // Main timer effect
  useEffect(() => {
    if (!isRunning || phase === 'idle' || phase === 'rosc') return;

    const interval = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      
      if (phase === 'cpr') {
        setCprSeconds(prev => {
          if (prev <= 1) {
            // CPR cycle complete - prompt rhythm check
            playAlertTone();
            setCprCycleCount(c => {
              addLogEvent('assessment', `CPR Cycle ${c} complete — Rhythm Check`, totalSeconds);
              return c + 1;
            });
            setPhase('rhythm_check');
            return CPR_CYCLE_DURATION;
          }
          
          // Warning at 10 seconds remaining
          if (prev === 11) {
            playTone(660, 0.1);
          }
          
          // Compressor switch reminder at 60 seconds
          if (prev === 61) {
            playTone(550, 0.15);
          }
          
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, playAlertTone, playTone]);

  // Epi reminder check
  const epiDueIn = lastEpiTime !== null 
    ? Math.max(0, EPI_INTERVAL - (totalSeconds - lastEpiTime))
    : 0;

  const isEpiDue = lastEpiTime === null || epiDueIn === 0;

  // Should switch compressor check
  const timeSinceLastSwitch = cprSeconds;
  const shouldSwitchCompressor = cprSeconds === 60;

  const startCode = useCallback(() => {
    if (!rhythm) return;
    
    setIsRunning(true);
    setCodeStartTime(new Date());
    setPhase(rhythm === 'vf_pvt' ? 'shock' : 'cpr');
    setCprSeconds(CPR_CYCLE_DURATION);
    setCprCycleCount(1);
    playTone(440, 0.3);
    clearLogEvents();
    addLogEvent('other', 'Code Blue Called', 0);
    addLogEvent('rhythm', `Initial Rhythm: ${rhythm === 'vf_pvt' ? 'VF/pVT (Shockable)' : 'Asystole/PEA (Non-shockable)'}`, 0);
  }, [rhythm, playTone, addLogEvent, clearLogEvents]);

  const pauseCode = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const resetCode = useCallback(() => {
    setIsRunning(false);
    setPhase('idle');
    setRhythm(null);
    setCprSeconds(CPR_CYCLE_DURATION);
    setTotalSeconds(0);
    setShockCount(0);
    setEpiCount(0);
    setAmioCount(0);
    setLidocaineGiven(false);
    setLastEpiTime(null);
    setCheckedCauses(new Set());
    setCprCycleCount(0);
    setChecklist({
      ivAccess: false,
      advancedAirway: false,
      capnography: false,
      defibrillatorReady: false,
      codeTeamAssembled: false,
    });
    setEtco2Value(null);
    setCodeStartTime(null);
    clearLogEvents();
  }, [clearLogEvents]);

  const markShock = useCallback(() => {
    setShockCount(prev => {
      const newCount = prev + 1;
      addLogEvent('shock', `Defibrillation #${newCount} delivered`, totalSeconds);
      return newCount;
    });
    setPhase('cpr');
    setCprSeconds(CPR_CYCLE_DURATION);
    addLogEvent('intervention', 'CPR Resumed (post-shock)', totalSeconds);
    playTone(1000, 0.1);
  }, [playTone, addLogEvent, totalSeconds]);

  const giveEpi = useCallback(() => {
    setEpiCount(prev => prev + 1);
    setLastEpiTime(totalSeconds);
    addLogEvent('medication', 'Epinephrine 1mg IV/IO', totalSeconds);
    playTone(600, 0.15);
  }, [totalSeconds, playTone, addLogEvent]);

  const giveAmio = useCallback(() => {
    if (amioCount < 2) {
      const dose = amioCount === 0 ? '300mg' : '150mg';
      setAmioCount(prev => prev + 1);
      addLogEvent('medication', `Amiodarone ${dose} IV/IO`, totalSeconds);
      playTone(700, 0.15);
    }
  }, [amioCount, playTone, addLogEvent, totalSeconds]);

  const giveLidocaine = useCallback(() => {
    if (!lidocaineGiven) {
      setLidocaineGiven(true);
      addLogEvent('medication', 'Lidocaine 1-1.5mg/kg IV/IO', totalSeconds);
      playTone(700, 0.15);
    }
  }, [lidocaineGiven, playTone, addLogEvent, totalSeconds]);

  const continueAfterRhythmCheck = useCallback((newRhythm: Rhythm, hasPulse: boolean = false) => {
    if (hasPulse) {
      setPhase('rosc');
      setIsRunning(false);
      addLogEvent('assessment', 'ROSC Achieved - Pulse present', totalSeconds);
      playSuccessTone();
      return;
    }
    
    const rhythmLabel = newRhythm === 'vf_pvt' ? 'VF/pVT (Shockable)' : 'Asystole/PEA (Non-shockable)';
    addLogEvent('rhythm', `Rhythm Check: ${rhythmLabel}`, totalSeconds);
    
    setRhythm(newRhythm);
    if (newRhythm === 'vf_pvt') {
      setPhase('shock');
    } else {
      setPhase('cpr');
      setCprSeconds(CPR_CYCLE_DURATION);
    }
  }, [playSuccessTone, addLogEvent, totalSeconds]);

  const markROSC = useCallback(() => {
    setPhase('rosc');
    setIsRunning(false);
    addLogEvent('assessment', 'ROSC Achieved', totalSeconds);
    playSuccessTone();
  }, [playSuccessTone, addLogEvent, totalSeconds]);

  const toggleCause = useCallback((causeId: string) => {
    setCheckedCauses(prev => {
      const next = new Set(prev);
      if (next.has(causeId)) {
        next.delete(causeId);
      } else {
        next.add(causeId);
      }
      return next;
    });
  }, []);

  const checklistLabelsMap: Record<keyof CodeChecklist, string> = {
    ivAccess: 'IV/IO Access Established',
    advancedAirway: 'Advanced Airway Placed',
    capnography: 'Waveform Capnography Attached',
    defibrillatorReady: 'Defibrillator Ready',
    codeTeamAssembled: 'Code Team Assembled',
  };

  const toggleChecklist = useCallback((key: keyof CodeChecklist) => {
    setChecklist(prev => {
      const newVal = !prev[key];
      if (newVal && phase !== 'idle') {
        addLogEvent('intervention', checklistLabelsMap[key], totalSeconds);
      }
      return { ...prev, [key]: newVal };
    });
  }, [addLogEvent, totalSeconds, phase]);

  // Get defibrillator energy recommendation (2025: escalate if device allows)
  const getShockEnergy = useCallback(() => {
    if (shockCount === 0) return 'Biphasic: 120-200J (or manufacturer spec)';
    return 'Biphasic: Same or HIGHER dose (escalate if device allows)';
  }, [shockCount]);

  // 2025: Check if persisting VF/pVT (consider vector change/DSED after ≥3 shocks)
  const isPersistingVF = shockCount >= REFRACTORY_SHOCK_THRESHOLD && rhythm === 'vf_pvt';
  
  // 2025: Consider termination if ETCO2 ≤10 after 20 min
  const shouldConsiderTermination = totalSeconds >= TERMINATION_CONSIDER_TIME;

  // Get current actions based on state
  const getActions = useCallback((): ActionItem[] => {
    const actions: ActionItem[] = [];
    
    if (phase === 'idle') {
      return [
        { text: 'Verify unresponsive + no pulse', priority: 'current', type: 'assessment' },
        { text: 'Activate emergency response', priority: 'next', type: 'assessment' },
        { text: 'Get defibrillator', priority: 'upcoming', type: 'check' },
      ];
    }
    
    if (phase === 'rosc') {
      return [
        { text: '🎉 ROSC Achieved!', priority: 'current', type: 'check' },
        { text: 'Optimize ventilation/oxygenation (SpO2 92-98%)', priority: 'next', type: 'airway' },
        { text: '12-lead ECG, treat precipitating cause', priority: 'next', type: 'assessment' },
        { text: 'Consider targeted temperature management', priority: 'upcoming', type: 'assessment' },
        { text: 'Monitor for re-arrest', priority: 'upcoming', type: 'check' },
      ];
    }
    
    if (phase === 'shock') {
      actions.push({ 
        text: `SHOCK #${shockCount + 1} — ${getShockEnergy()}`, 
        priority: 'current', 
        type: 'shock' 
      });
      actions.push({ text: 'Resume CPR IMMEDIATELY (compressions first)', priority: 'next', type: 'cpr' });
      
      // 2025: Persisting VF/pVT guidance after ≥3 shocks
      if (shockCount >= 2) {
        actions.push({ text: '⚠️ Persisting VF/pVT: Consider Vector Change or DSED', priority: 'upcoming', type: 'shock' });
      }
      
      // Medication guidance (2025: Epi after initial defib attempts fail)
      if (shockCount === 0) {
        actions.push({ text: 'Establish IV/IO access during CPR', priority: 'upcoming', type: 'medication' });
      } else if (shockCount >= 1 && epiCount === 0) {
        actions.push({ text: 'Epinephrine 1mg IV/IO (after initial defib fails)', priority: 'upcoming', type: 'medication' });
      }
      
      // 2025: Amiodarone OR Lidocaine for refractory VF/pVT (both Class 2b)
      if (shockCount >= 2 && amioCount === 0 && !lidocaineGiven) {
        actions.push({ text: 'Amiodarone 300mg OR Lidocaine 1-1.5mg/kg IV/IO', priority: 'upcoming', type: 'medication' });
      } else if (shockCount >= 3 && amioCount === 1) {
        actions.push({ text: 'Amiodarone 150mg IV/IO (2nd dose)', priority: 'upcoming', type: 'medication' });
      }
    } else if (phase === 'cpr') {
      // Primary CPR action with quality reminders
      actions.push({ 
        text: `High-Quality CPR — Cycle ${cprCycleCount}`, 
        priority: 'current', 
        type: 'cpr' 
      });
      
      // Compressor switch reminder
      if (cprSeconds <= 65 && cprSeconds > 55) {
        actions.push({ text: '⚡ SWITCH COMPRESSORS at 1 minute!', priority: 'next', type: 'cpr' });
      } else {
        actions.push({ text: `Rhythm/Pulse check in ${formatTime(cprSeconds)}`, priority: 'next', type: 'check' });
      }
      
      // Medication reminders
      if (isEpiDue && checklist.ivAccess) {
        actions.push({ text: '💉 EPINEPHRINE 1mg IV/IO — DUE NOW', priority: 'upcoming', type: 'medication' });
      } else if (!checklist.ivAccess) {
        actions.push({ text: 'Establish IV/IO access', priority: 'upcoming', type: 'medication' });
      }
      
      // Airway reminders (2025: defer if interrupts compressions)
      if (!checklist.advancedAirway) {
        actions.push({ text: 'Consider advanced airway (defer if interrupts CPR)', priority: 'upcoming', type: 'airway' });
      }
      
      // H's and T's reminder
      if (checkedCauses.size < 5) {
        actions.push({ text: 'Search and treat reversible causes (H\'s & T\'s)', priority: 'upcoming', type: 'assessment' });
      }
      
      // 2025: Termination consideration after 20 minutes
      if (shouldConsiderTermination) {
        actions.push({ text: '⏱️ 20+ min: Consider termination criteria if ETCO2 ≤10', priority: 'upcoming', type: 'assessment' });
      }
    } else if (phase === 'rhythm_check') {
      actions.push({ 
        text: 'RHYTHM CHECK — Pulse check (<10 sec)', 
        priority: 'current', 
        type: 'check' 
      });
      actions.push({ text: 'Assess: Shockable vs Non-shockable vs Organized rhythm', priority: 'next', type: 'assessment' });
      actions.push({ text: 'If organized rhythm → CHECK PULSE', priority: 'next', type: 'check' });
      actions.push({ text: 'Minimize interruptions — resume CPR immediately', priority: 'upcoming', type: 'cpr' });
    }
    
    return actions;
  }, [phase, shockCount, amioCount, epiCount, lidocaineGiven, cprSeconds, isEpiDue, checklist, cprCycleCount, checkedCauses, getShockEnergy, shouldConsiderTermination]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCodeSummary = useCallback((): CodeSummaryData => {
    const rhythmLabels: Record<string, string> = {
      'vf_pvt': 'VF/pVT (Shockable)',
      'asystole_pea': 'Asystole/PEA (Non-shockable)',
    };

    const checklistLabels: Record<string, string> = {
      ivAccess: 'IV/IO Access',
      advancedAirway: 'Advanced Airway',
      capnography: 'Capnography/ETCO2',
      defibrillatorReady: 'Defibrillator Ready',
      codeTeamAssembled: 'Code Team Assembled',
    };

    const causesLabels: Record<string, string> = {
      hypovolemia: 'Hypovolemia',
      hypoxia: 'Hypoxia',
      hydrogen: 'Hydrogen ion (acidosis)',
      hypokalemia: 'Hypo/Hyperkalemia',
      hypothermia: 'Hypothermia',
      tension: 'Tension pneumothorax',
      tamponade: 'Cardiac Tamponade',
      toxins: 'Toxins/Overdose',
      thrombosis_pulmonary: 'Thrombosis (PE)',
      thrombosis_coronary: 'Thrombosis (MI)',
    };

    const medications = [];
    if (epiCount > 0) {
      medications.push({ name: 'Epinephrine 1mg IV/IO', count: epiCount });
    }
    if (amioCount > 0) {
      medications.push({ 
        name: 'Amiodarone IV/IO', 
        count: amioCount,
        doses: amioCount >= 1 ? ['300mg', ...(amioCount >= 2 ? ['150mg'] : [])] : []
      });
    }
    if (lidocaineGiven) {
      medications.push({ name: 'Lidocaine 1-1.5mg/kg IV/IO', count: 1 });
    }

    return {
      type: 'ACLS',
      startTime: codeStartTime || new Date(),
      endTime: new Date(),
      totalDuration: totalSeconds,
      outcome: phase === 'rosc' ? 'ROSC' : 'Ongoing',
      initialRhythm: rhythm ? rhythmLabels[rhythm] : 'Unknown',
      finalRhythm: rhythm ? rhythmLabels[rhythm] : undefined,
      shockCount,
      medications,
      cprCycles: cprCycleCount,
      reversibleCausesChecked: Array.from(checkedCauses).map(id => causesLabels[id] || id),
      checklistCompleted: Object.entries(checklist)
        .filter(([_, checked]) => checked)
        .map(([key]) => checklistLabels[key] || key),
    };
  }, [codeStartTime, totalSeconds, phase, rhythm, shockCount, epiCount, amioCount, lidocaineGiven, cprCycleCount, checkedCauses, checklist]);

  const handlePrint = useCallback(() => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const summary = getCodeSummary();
    const formatDateTime = (date: Date) => date.toLocaleString('en-US', {
      month: '2-digit', day: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const formatDuration = (secs: number) => {
      const mins = Math.floor(secs / 60);
      const s = secs % 60;
      return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>ACLS Code Summary</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          h3 { font-size: 14px; margin: 0 0 8px 0; border-bottom: 1px solid #333; padding-bottom: 4px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
          .section { margin-bottom: 16px; padding: 12px; border: 1px solid #ccc; border-radius: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 10px; color: #666; }
          .signature { border-bottom: 1px solid #999; width: 200px; height: 30px; margin-top: 8px; }
          ul { margin: 0; padding-left: 20px; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ACLS Code Summary</h1>
          <p style="color: #666; margin: 0;">AHA 2025 Guidelines • Generated: ${formatDateTime(new Date())}</p>
        </div>
        
        <div class="section">
          <h3>Code Timeline</h3>
          <div class="grid">
            <div>
              <p><strong>Code Start:</strong> ${formatDateTime(summary.startTime)}</p>
              <p><strong>Code End:</strong> ${formatDateTime(summary.endTime)}</p>
              <p><strong>Total Duration:</strong> ${formatDuration(summary.totalDuration)}</p>
            </div>
            <div>
              <p><strong>Initial Rhythm:</strong> ${summary.initialRhythm}</p>
              <p><strong>Final Rhythm:</strong> ${summary.finalRhythm || 'N/A'}</p>
              <p><strong>Outcome:</strong> <span style="${summary.outcome === 'ROSC' ? 'color: green; font-weight: bold;' : ''}">${summary.outcome}</span></p>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>Interventions Summary</h3>
          <div class="grid">
            <div>
              <p><strong>CPR Cycles:</strong> ${summary.cprCycles}</p>
              <p><strong>Defibrillations:</strong> ${summary.shockCount}</p>
            </div>
            <div>
              <p><strong>Medications:</strong></p>
              ${summary.medications.length > 0 
                ? `<ul>${summary.medications.map(m => `<li>${m.name}: ${m.count} dose(s)${m.doses?.length ? ` (${m.doses.join(', ')})` : ''}</li>`).join('')}</ul>`
                : '<p style="color: #666;">No medications administered</p>'}
            </div>
          </div>
        </div>
        
        <div class="section">
          <h3>Reversible Causes Assessed (H's & T's)</h3>
          ${summary.reversibleCausesChecked.length > 0 
            ? `<div class="grid">${summary.reversibleCausesChecked.map(c => `<p>✓ ${c}</p>`).join('')}</div>`
            : '<p style="color: #666;">No causes documented as assessed</p>'}
        </div>
        
        <div class="section">
          <h3>Code Checklist Completed</h3>
          ${summary.checklistCompleted.length > 0 
            ? `<div class="grid">${summary.checklistCompleted.map(c => `<p>✓ ${c}</p>`).join('')}</div>`
            : '<p style="color: #666;">No checklist items documented</p>'}
        </div>
        
        <div class="footer">
          <div class="grid">
            <div>
              <p><strong>Provider Signature:</strong></p>
              <div class="signature"></div>
            </div>
            <div>
              <p><strong>Date/Time:</strong></p>
              <div class="signature"></div>
            </div>
          </div>
          <p style="text-align: center; margin-top: 16px;">This document is for documentation purposes. Verify all information before inclusion in medical records.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [getCodeSummary]);

  const actions = getActions();
  const cprProgress = ((CPR_CYCLE_DURATION - cprSeconds) / CPR_CYCLE_DURATION) * 100;

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">ACLS CODE ASSIST</CardTitle>
              <p className="text-sm text-muted-foreground">AHA 2025 Guidelines • Real-time guidance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="rounded-xl"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            {phase !== 'idle' && (
              <Badge variant="outline" className="font-mono">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(totalSeconds)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Rhythm Selection */}
        {phase === 'idle' && (
          <div className="space-y-4">
            {/* Pre-Code Checklist */}
            <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between rounded-xl bg-muted/30">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Pre-Code Checklist
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${checklistOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.codeTeamAssembled}
                    onCheckedChange={() => toggleChecklist('codeTeamAssembled')}
                  />
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Code team assembled / Help called
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.defibrillatorReady}
                    onCheckedChange={() => toggleChecklist('defibrillatorReady')}
                  />
                  <Zap className="w-4 h-4 text-muted-foreground" />
                  Defibrillator/AED ready
                </label>
              </CollapsibleContent>
            </Collapsible>

            <div className="space-y-3">
              <label className="text-sm font-medium">Initial Rhythm Assessment</label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={rhythm === 'vf_pvt' ? 'default' : 'outline'}
                  onClick={() => setRhythm('vf_pvt')}
                  className="h-auto py-4 flex-col gap-1 rounded-xl"
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">VF / pVT</span>
                  <span className="text-xs opacity-80">Shockable → Shock first</span>
                </Button>
                <Button
                  variant={rhythm === 'asystole_pea' ? 'default' : 'outline'}
                  onClick={() => setRhythm('asystole_pea')}
                  className="h-auto py-4 flex-col gap-1 rounded-xl"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Asystole / PEA</span>
                  <span className="text-xs opacity-80">Non-Shockable → CPR + Epi</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Current Action Display */}
        <div className="space-y-3">
          {actions.map((action, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl transition-all ${
                action.priority === 'current'
                  ? 'bg-destructive/10 border-2 border-destructive/30'
                  : action.priority === 'next'
                  ? 'bg-warning/10 border border-warning/30'
                  : 'bg-muted/50 border border-border/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {action.priority === 'current' && (
                  <Badge variant="destructive" className="text-xs">NOW</Badge>
                )}
                {action.priority === 'next' && (
                  <Badge variant="outline" className="text-xs bg-warning/20 text-warning-foreground border-warning/30">NEXT</Badge>
                )}
                <span className={`${action.priority === 'current' ? 'text-lg font-bold' : 'text-sm'}`}>
                  {action.text}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CPR Progress Bar */}
        {phase === 'cpr' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">CPR Cycle {cprCycleCount}</span>
              <span className="font-mono text-muted-foreground">{formatTime(cprSeconds)} remaining</span>
            </div>
            <Progress value={cprProgress} className="h-3" />
            
            {/* CPR Quality Reminders */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-primary/5 rounded-lg p-2 text-xs">
                <div className="font-semibold text-primary">Rate</div>
                <div>100-120/min</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2 text-xs">
                <div className="font-semibold text-primary">Depth</div>
                <div>≥2 inches (5 cm)</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2 text-xs">
                <div className="font-semibold text-primary">Recoil</div>
                <div>Full chest recoil</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2 text-xs">
                <div className="font-semibold text-primary">Ventilation</div>
                <div>{checklist.advancedAirway ? '1 breath/6 sec' : '30:2 ratio'}</div>
              </div>
            </div>
            
            {/* Compressor Switch Alert */}
            {cprSeconds <= 65 && cprSeconds > 55 && (
              <div className="bg-warning/20 border border-warning/30 rounded-lg p-3 flex items-center gap-2 mt-2">
                <RefreshCw className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Switch compressors at 1 minute!</span>
              </div>
            )}
          </div>
        )}

        {/* Rhythm Check Actions - Enhanced */}
        {phase === 'rhythm_check' && (
          <div className="space-y-4">
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-5 h-5 text-warning" />
                <span className="font-bold text-warning-foreground">PULSE CHECK</span>
              </div>
              <p className="text-sm text-muted-foreground">
                If organized rhythm → CHECK CAROTID PULSE (&lt;10 sec)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => continueAfterRhythmCheck('vf_pvt')}
                variant="destructive"
                className="h-auto py-4 flex-col gap-1 rounded-xl"
              >
                <Zap className="w-5 h-5" />
                <span className="font-semibold">Shockable</span>
                <span className="text-xs opacity-80">VF/pVT → Shock</span>
              </Button>
              <Button
                onClick={() => continueAfterRhythmCheck('asystole_pea')}
                variant="secondary"
                className="h-auto py-4 flex-col gap-1 rounded-xl"
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Non-Shockable</span>
                <span className="text-xs opacity-80">Asystole/PEA → CPR</span>
              </Button>
            </div>
            
            <Button
              onClick={() => continueAfterRhythmCheck(rhythm || 'asystole_pea', true)}
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-4"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              <span className="font-semibold">Pulse Present → ROSC!</span>
            </Button>
          </div>
        )}

        {/* Code Status Panel */}
        {phase !== 'idle' && (
          <div className="space-y-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Activity className="w-4 h-4 mx-auto mb-1 text-primary" />
                <div className="text-xl font-bold">{cprCycleCount}</div>
                <div className="text-xs text-muted-foreground">Cycles</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Zap className="w-4 h-4 mx-auto mb-1 text-warning" />
                <div className="text-xl font-bold">{shockCount}</div>
                <div className="text-xs text-muted-foreground">Shocks</div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Syringe className="w-4 h-4 mx-auto mb-1 text-primary" />
                <div className="text-xl font-bold">{epiCount}</div>
                <div className="text-xs text-muted-foreground">
                  {isEpiDue ? (
                    <span className="text-destructive font-medium">Due!</span>
                  ) : (
                    `${formatTime(epiDueIn)}`
                  )}
                </div>
              </div>
              <div className="bg-muted/50 rounded-xl p-3 text-center">
                <Syringe className="w-4 h-4 mx-auto mb-1 text-secondary-foreground" />
                <div className="text-xl font-bold">{amioCount}/2</div>
                <div className="text-xs text-muted-foreground">Amio</div>
              </div>
            </div>

            {/* Code Essentials Checklist */}
            <Collapsible open={checklistOpen} onOpenChange={setChecklistOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between rounded-xl bg-muted/30">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Code Essentials ({Object.values(checklist).filter(Boolean).length}/5)
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${checklistOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.ivAccess}
                    onCheckedChange={() => toggleChecklist('ivAccess')}
                  />
                  <Syringe className="w-4 h-4 text-muted-foreground" />
                  IV/IO access established
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.advancedAirway}
                    onCheckedChange={() => toggleChecklist('advancedAirway')}
                  />
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  Advanced airway placed (ETT/SGA)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.capnography}
                    onCheckedChange={() => toggleChecklist('capnography')}
                  />
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  Waveform capnography attached
                </label>
              </CollapsibleContent>
            </Collapsible>

            {/* ETCO2 Guidance - 2025 Updated */}
            {checklist.capnography && (
              <div className="bg-muted/30 rounded-xl p-3 text-xs space-y-1">
                <div className="font-semibold">ETCO2 Interpretation (2025):</div>
                <div>• &lt;10 mmHg: Improve CPR quality (poor prognosis indicator)</div>
                <div>• 10-20 mmHg: Continue, optimize compressions</div>
                <div>• ≥20 mmHg: Target goal for adequate perfusion</div>
                <div>• &gt;40 mmHg: May indicate ROSC - check pulse!</div>
                <div className="text-destructive font-medium mt-2">• If ≤10 mmHg after 20 min → consider as part of termination decision</div>
              </div>
            )}
            
            {/* 2025: Termination Consideration Alert */}
            {shouldConsiderTermination && phase !== 'rosc' && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  20+ Minutes - Consider Termination Criteria
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  2025 AHA: If ETCO2 ≤10 mmHg after 20 min, may be considered as part of multimodal decision to terminate
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {phase === 'idle' ? (
            <Button 
              onClick={startCode} 
              disabled={!rhythm}
              className="flex-1 rounded-xl"
            >
              <Play className="w-4 h-4 mr-2" />
              Start Code
            </Button>
          ) : (
            <>
              <Button
                onClick={pauseCode}
                variant="outline"
                className="rounded-xl"
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              {phase === 'shock' && (
                <Button onClick={markShock} variant="destructive" className="flex-1 rounded-xl">
                  <Zap className="w-4 h-4 mr-2" />
                  Shock Delivered
                </Button>
              )}
              
              {phase === 'cpr' && (
                <>
                  <Button 
                    onClick={giveEpi} 
                    variant={isEpiDue ? 'destructive' : 'outline'}
                    className="flex-1 rounded-xl"
                    disabled={!checklist.ivAccess}
                  >
                    <Syringe className="w-4 h-4 mr-2" />
                    Epi 1mg
                  </Button>
                  
                  {rhythm === 'vf_pvt' && shockCount >= 2 && amioCount < 2 && (
                    <Button 
                      onClick={giveAmio} 
                      variant="outline" 
                      className="rounded-xl"
                      disabled={!checklist.ivAccess}
                    >
                      Amio {amioCount === 0 ? '300mg' : '150mg'}
                    </Button>
                  )}
                  
                  {/* Alternative: Lidocaine if amio unavailable */}
                  {rhythm === 'vf_pvt' && shockCount >= 2 && !lidocaineGiven && amioCount === 0 && (
                    <Button 
                      onClick={giveLidocaine} 
                      variant="ghost" 
                      className="rounded-xl text-xs"
                      disabled={!checklist.ivAccess}
                    >
                      Alt: Lido 1-1.5mg/kg
                    </Button>
                  )}
                </>
              )}
              
              {phase !== 'rhythm_check' && (
                <Button onClick={markROSC} className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  ROSC
                </Button>
              )}
              
              <Button onClick={resetCode} variant="ghost" className="rounded-xl">
                <RotateCcw className="w-4 h-4" />
              </Button>
              
              <Button 
                onClick={handlePrint} 
                variant="ghost" 
                className="rounded-xl"
                title="Print Code Summary"
              >
                <Printer className="w-4 h-4" />
              </Button>
            </>
          )}
        </div>

        {/* Reversible Causes Checklist */}
        {phase !== 'idle' && phase !== 'rosc' && (
          <Collapsible open={causesOpen} onOpenChange={setCausesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between rounded-xl">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  5 H's and 5 T's ({checkedCauses.size}/10 assessed)
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${causesOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-destructive">5 H's</h4>
                  {REVERSIBLE_CAUSES.hs.map(cause => (
                    <label key={cause.id} className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        checked={checkedCauses.has(cause.id)}
                        onCheckedChange={() => toggleCause(cause.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-medium">{cause.label}</div>
                        <div className="text-xs text-muted-foreground">{cause.hint}</div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-destructive">5 T's</h4>
                  {REVERSIBLE_CAUSES.ts.map(cause => (
                    <label key={cause.id} className="flex items-start gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        checked={checkedCauses.has(cause.id)}
                        onCheckedChange={() => toggleCause(cause.id)}
                        className="mt-0.5"
                      />
                      <div>
                        <div className="font-medium">{cause.label}</div>
                        <div className="text-xs text-muted-foreground">{cause.hint}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* ROSC Post-Arrest Care */}
        {phase === 'rosc' && (
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-primary flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Post-Cardiac Arrest Care
            </h4>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                Optimize ventilation: SpO2 92-98%, avoid hyperoxia
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                Treat hypotension: SBP &gt;90 mmHg, MAP ≥65 mmHg
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                12-lead ECG: Consider emergent cardiac intervention
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                Targeted Temperature Management (32-36°C) if comatose
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">5.</span>
                Transfer to critical care unit
              </li>
            </ul>
          </div>
        )}

        {/* Auto Event Log */}
        {phase !== 'idle' && (
          <CodeEventLogPanel
            events={logEvents}
            onDelete={deleteLogEvent}
            onExport={() => exportLog({
              startTime: codeStartTime,
              totalSeconds,
              shockCount,
              epiCount,
              codeType: 'ACLS',
            })}
            defaultOpen={phase === 'rosc'}
          />
        )}

        {/* Cross-Navigation */}
        {phase !== 'idle' && (
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => setSearchParams({ tool: 'cprmetronome' })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <ExternalLink className="w-3 h-3" />
              CPR Metronome
            </button>
          </div>
        )}

        {/* AHA Guidelines Reference */}
        <div className="text-xs text-muted-foreground border-t pt-4 space-y-1">
          <p className="font-medium">Based on 2025 AHA Guidelines for CPR and ECC</p>
          <p>High-quality CPR: 100-120/min • ≥2 inches depth • Full recoil • Minimize interruptions (&lt;10 sec)</p>
          <p>Epinephrine: 1mg IV/IO every 3-5 min (after initial defib fails for shockable, ASAP for non-shockable)</p>
          <p>Refractory VF/pVT: Amiodarone 300mg/150mg OR Lidocaine • Consider Vector Change/DSED after ≥3 shocks</p>
          <p>ETCO2: Target ≥10 mmHg (ideal &gt;20) • If ≤10 after 20 min, consider as part of termination decision</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ACLSCodeNarrator;
