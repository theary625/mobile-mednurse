import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Baby,
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
  Scale,
  Printer
} from 'lucide-react';
import CodeSummaryPrint, { CodeSummaryData } from './CodeSummaryPrint';

type Rhythm = 'vf_pvt' | 'asystole_pea';
type Phase = 'idle' | 'cpr' | 'rhythm_check' | 'shock' | 'rosc';
type AgeGroup = 'infant' | 'child' | 'adolescent';

interface ActionItem {
  text: string;
  priority: 'current' | 'next' | 'upcoming';
  type: 'cpr' | 'shock' | 'medication' | 'check' | 'assessment' | 'airway';
}

interface CodeChecklist {
  ivIoAccess: boolean;
  advancedAirway: boolean;
  capnography: boolean;
  defibrillatorReady: boolean;
  codeTeamAssembled: boolean;
  weightObtained: boolean;
}

// PALS 2025 Reversible Causes - Pediatric emphasis on hypoxia/respiratory causes
const REVERSIBLE_CAUSES = {
  hs: [
    { id: 'hypoxia', label: 'Hypoxia', hint: '#1 cause in peds - ensure adequate oxygenation/ventilation' },
    { id: 'hypovolemia', label: 'Hypovolemia', hint: '20 mL/kg isotonic crystalloid bolus' },
    { id: 'hydrogen', label: 'Hydrogen ion (acidosis)', hint: 'Bicarb 1 mEq/kg if severe/prolonged arrest' },
    { id: 'hypokalemia', label: 'Hypo/Hyperkalemia', hint: 'Check K+, treat accordingly' },
    { id: 'hypothermia', label: 'Hypothermia', hint: 'Rewarm patient, modify algorithm' },
    { id: 'hypoglycemia', label: 'Hypoglycemia', hint: 'D10W 5 mL/kg or D25W 2 mL/kg' },
  ],
  ts: [
    { id: 'tension', label: 'Tension pneumothorax', hint: 'Needle decompression at 2nd ICS' },
    { id: 'tamponade', label: 'Cardiac Tamponade', hint: 'Pericardiocentesis' },
    { id: 'toxins', label: 'Toxins/Overdose', hint: 'Specific antidotes (naloxone, lipid emulsion)' },
    { id: 'thrombosis', label: 'Thrombosis (PE/coronary)', hint: 'Consider thrombolytics/ECMO' },
    { id: 'trauma', label: 'Trauma (unrecognized)', hint: 'Bleeding control, volume resuscitation' },
  ],
};

const CPR_CYCLE_DURATION = 120; // 2 minutes
const EPI_INTERVAL = 180; // 3-5 min (using 3 min)
const COMPRESSOR_SWITCH_INTERVAL = 120;

// AHA 2025 PALS Guidelines
const PALS_2025 = {
  // Defibrillation
  initialShockDose: 2, // 2 J/kg
  subsequentShockDose: 4, // 4 J/kg (may increase, max 10 J/kg or adult dose)
  maxShockDose: 10, // J/kg or adult dose
  
  // Medications
  epiDose: 0.01, // mg/kg (0.1 mL/kg of 1:10,000)
  epiMaxDose: 1, // mg
  amioDose: 5, // mg/kg (first dose)
  amioMaxDose: 300, // mg
  amioSecondDose: 5, // mg/kg
  lidoDose: 1, // mg/kg
  
  // CPR Quality by age
  cprQuality: {
    infant: {
      depth: 'At least 1.5 inches (4 cm)',
      technique: '2 thumb-encircling or 2-finger',
      ratio: '15:2 (2 rescuers) or 30:2 (1 rescuer)',
    },
    child: {
      depth: 'At least 2 inches (5 cm)',
      technique: '1 or 2 hands',
      ratio: '15:2 (2 rescuers) or 30:2 (1 rescuer)',
    },
    adolescent: {
      depth: 'At least 2 inches (5 cm), max 2.4 inches',
      technique: '2 hands',
      ratio: '30:2 (without advanced airway)',
    },
  },
  
  // Rate
  compressionRate: '100-120/min',
  ventilationWithAirway: '1 breath every 2-3 seconds (20-30/min)',
  
  // Key differences from ACLS
  emphasizeVentilation: true,
  hypoxiaLeadingCause: true,
  etco2Target: '≥10-15 mmHg (> adult threshold sometimes used)',
};

const PALSCodeNarrator = () => {
  // Patient info
  const [weight, setWeight] = useState<number | null>(null);
  const [ageGroup, setAgeGroup] = useState<AgeGroup>('child');
  
  // Code state
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
    ivIoAccess: false,
    advancedAirway: false,
    capnography: false,
    defibrillatorReady: false,
    codeTeamAssembled: false,
    weightObtained: false,
  });
  const [checklistOpen, setChecklistOpen] = useState(true);
  const [codeStartTime, setCodeStartTime] = useState<Date | null>(null);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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

  const playSuccessTone = useCallback(() => {
    playTone(523, 0.1);
    setTimeout(() => playTone(659, 0.1), 100);
    setTimeout(() => playTone(784, 0.2), 200);
  }, [playTone]);

  // Calculate weight-based doses
  const calculateDoses = useCallback(() => {
    if (!weight) return null;
    
    const epiDose = Math.min(weight * PALS_2025.epiDose, PALS_2025.epiMaxDose);
    const epiVolume = epiDose * 10; // mL of 1:10,000 (0.1 mg/mL)
    const amioDose = Math.min(weight * PALS_2025.amioDose, PALS_2025.amioMaxDose);
    const lidoDose = weight * PALS_2025.lidoDose;
    const initialShock = Math.min(weight * PALS_2025.initialShockDose, 200);
    const subsequentShock = Math.min(weight * PALS_2025.subsequentShockDose, 360);
    const maxShock = Math.min(weight * PALS_2025.maxShockDose, 360);
    
    return {
      epiDose: epiDose.toFixed(2),
      epiVolume: epiVolume.toFixed(1),
      amioDose: Math.round(amioDose),
      lidoDose: Math.round(lidoDose),
      initialShock: Math.round(initialShock),
      subsequentShock: Math.round(subsequentShock),
      maxShock: Math.round(maxShock),
    };
  }, [weight]);

  const doses = calculateDoses();

  // Main timer effect
  useEffect(() => {
    if (!isRunning || phase === 'idle' || phase === 'rosc') return;

    const interval = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      
      if (phase === 'cpr') {
        setCprSeconds(prev => {
          if (prev <= 1) {
            playAlertTone();
            setCprCycleCount(c => c + 1);
            setPhase('rhythm_check');
            return CPR_CYCLE_DURATION;
          }
          
          if (prev === 11) {
            playTone(660, 0.1);
          }
          
          if (prev === 61) {
            playTone(550, 0.15);
          }
          
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, playAlertTone, playTone]);

  const epiDueIn = lastEpiTime !== null 
    ? Math.max(0, EPI_INTERVAL - (totalSeconds - lastEpiTime))
    : 0;

  const isEpiDue = lastEpiTime === null || epiDueIn === 0;

  const startCode = useCallback(() => {
    if (!rhythm || !weight) return;
    
    setIsRunning(true);
    setCodeStartTime(new Date());
    setPhase(rhythm === 'vf_pvt' ? 'shock' : 'cpr');
    setCprSeconds(CPR_CYCLE_DURATION);
    setCprCycleCount(1);
    playTone(440, 0.3);
  }, [rhythm, weight, playTone]);

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
      ivIoAccess: false,
      advancedAirway: false,
      capnography: false,
      defibrillatorReady: false,
      codeTeamAssembled: false,
      weightObtained: !!weight,
    });
    setCodeStartTime(null);
  }, [weight]);

  const markShock = useCallback(() => {
    setShockCount(prev => prev + 1);
    setPhase('cpr');
    setCprSeconds(CPR_CYCLE_DURATION);
    playTone(1000, 0.1);
  }, [playTone]);

  const giveEpi = useCallback(() => {
    setEpiCount(prev => prev + 1);
    setLastEpiTime(totalSeconds);
    playTone(600, 0.15);
  }, [totalSeconds, playTone]);

  const giveAmio = useCallback(() => {
    if (amioCount < 2) {
      setAmioCount(prev => prev + 1);
      playTone(700, 0.15);
    }
  }, [amioCount, playTone]);

  const giveLidocaine = useCallback(() => {
    if (!lidocaineGiven) {
      setLidocaineGiven(true);
      playTone(700, 0.15);
    }
  }, [lidocaineGiven, playTone]);

  const continueAfterRhythmCheck = useCallback((newRhythm: Rhythm, hasPulse: boolean = false) => {
    if (hasPulse) {
      setPhase('rosc');
      setIsRunning(false);
      playSuccessTone();
      return;
    }
    
    setRhythm(newRhythm);
    if (newRhythm === 'vf_pvt') {
      setPhase('shock');
    } else {
      setPhase('cpr');
      setCprSeconds(CPR_CYCLE_DURATION);
    }
  }, [playSuccessTone]);

  const markROSC = useCallback(() => {
    setPhase('rosc');
    setIsRunning(false);
    playSuccessTone();
  }, [playSuccessTone]);

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

  const toggleChecklist = useCallback((key: keyof CodeChecklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getShockEnergy = useCallback(() => {
    if (!doses) return 'Enter weight first';
    if (shockCount === 0) return `${doses.initialShock}J (2 J/kg)`;
    return `${doses.subsequentShock}J (4 J/kg, max ${doses.maxShock}J)`;
  }, [doses, shockCount]);

  const getCprQuality = useCallback(() => {
    return PALS_2025.cprQuality[ageGroup];
  }, [ageGroup]);

  const getActions = useCallback((): ActionItem[] => {
    const actions: ActionItem[] = [];
    
    if (phase === 'idle') {
      return [
        { text: 'Verify unresponsive + no pulse (brachial for infant)', priority: 'current', type: 'assessment' },
        { text: 'Activate emergency response / Get help', priority: 'next', type: 'assessment' },
        { text: 'Get defibrillator + emergency equipment', priority: 'upcoming', type: 'check' },
      ];
    }
    
    if (phase === 'rosc') {
      return [
        { text: '🎉 ROSC Achieved!', priority: 'current', type: 'check' },
        { text: 'Support ventilation/oxygenation (avoid hyperoxia)', priority: 'next', type: 'airway' },
        { text: 'Treat hypotension (fluids, vasopressors)', priority: 'next', type: 'medication' },
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
      actions.push({ text: 'Resume CPR IMMEDIATELY after shock', priority: 'next', type: 'cpr' });
      
      if (shockCount >= 2) {
        actions.push({ text: '⚠️ Refractory VF/pVT: Consider increasing energy', priority: 'upcoming', type: 'shock' });
      }
      
      if (shockCount === 0) {
        actions.push({ text: 'Establish IV/IO access during CPR', priority: 'upcoming', type: 'medication' });
      } else if (shockCount >= 1 && epiCount === 0 && doses) {
        actions.push({ text: `Epinephrine ${doses.epiDose}mg (${doses.epiVolume}mL of 1:10,000) IV/IO`, priority: 'upcoming', type: 'medication' });
      }
      
      if (shockCount >= 2 && amioCount === 0 && !lidocaineGiven && doses) {
        actions.push({ text: `Amiodarone ${doses.amioDose}mg OR Lidocaine ${doses.lidoDose}mg IV/IO`, priority: 'upcoming', type: 'medication' });
      }
    } else if (phase === 'cpr') {
      actions.push({ 
        text: `High-Quality CPR — Cycle ${cprCycleCount}`, 
        priority: 'current', 
        type: 'cpr' 
      });
      
      if (cprSeconds <= 65 && cprSeconds > 55) {
        actions.push({ text: '⚡ SWITCH COMPRESSORS!', priority: 'next', type: 'cpr' });
      } else {
        actions.push({ text: `Rhythm/Pulse check in ${formatTime(cprSeconds)}`, priority: 'next', type: 'check' });
      }
      
      // Emphasize ventilation in pediatrics
      if (!checklist.advancedAirway) {
        actions.push({ text: '🫁 Ensure effective ventilation - HYPOXIA is #1 cause!', priority: 'upcoming', type: 'airway' });
      }
      
      if (isEpiDue && checklist.ivIoAccess && doses) {
        actions.push({ text: `💉 EPINEPHRINE ${doses.epiDose}mg IV/IO — DUE NOW`, priority: 'upcoming', type: 'medication' });
      } else if (!checklist.ivIoAccess) {
        actions.push({ text: 'Establish IV/IO access (IO preferred if IV difficult)', priority: 'upcoming', type: 'medication' });
      }
      
      if (checkedCauses.size < 5) {
        actions.push({ text: 'Search H\'s & T\'s (Hypoxia most common in peds)', priority: 'upcoming', type: 'assessment' });
      }
    } else if (phase === 'rhythm_check') {
      actions.push({ 
        text: ageGroup === 'infant' 
          ? 'RHYTHM CHECK — Brachial pulse (<10 sec)'
          : 'RHYTHM CHECK — Carotid/Femoral pulse (<10 sec)', 
        priority: 'current', 
        type: 'check' 
      });
      actions.push({ text: 'Assess: Shockable vs Non-shockable vs Organized rhythm', priority: 'next', type: 'assessment' });
      actions.push({ text: 'Minimize interruptions — resume CPR immediately', priority: 'upcoming', type: 'cpr' });
    }
    
    return actions;
  }, [phase, shockCount, amioCount, epiCount, lidocaineGiven, cprSeconds, isEpiDue, checklist, cprCycleCount, checkedCauses, getShockEnergy, ageGroup, doses]);

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

    const ageGroupLabels: Record<string, string> = {
      'infant': 'Infant (<1 year)',
      'child': 'Child (1-puberty)',
      'adolescent': 'Adolescent',
    };

    const checklistLabels: Record<string, string> = {
      ivIoAccess: 'IV/IO Access',
      advancedAirway: 'Advanced Airway',
      capnography: 'Capnography/ETCO2',
      defibrillatorReady: 'Defibrillator Ready',
      codeTeamAssembled: 'Code Team Assembled',
      weightObtained: 'Weight Obtained',
    };

    const causesLabels: Record<string, string> = {
      hypoxia: 'Hypoxia',
      hypovolemia: 'Hypovolemia',
      hydrogen: 'Hydrogen ion (acidosis)',
      hypokalemia: 'Hypo/Hyperkalemia',
      hypothermia: 'Hypothermia',
      hypoglycemia: 'Hypoglycemia',
      tension: 'Tension pneumothorax',
      tamponade: 'Cardiac Tamponade',
      toxins: 'Toxins/Overdose',
      thrombosis: 'Thrombosis (PE/coronary)',
      trauma: 'Trauma (unrecognized)',
    };

    const medications = [];
    if (epiCount > 0 && doses) {
      medications.push({ name: `Epinephrine ${doses.epiDose}mg IV/IO`, count: epiCount });
    }
    if (amioCount > 0 && doses) {
      medications.push({ 
        name: `Amiodarone ${doses.amioDose}mg IV/IO`, 
        count: amioCount,
      });
    }
    if (lidocaineGiven && doses) {
      medications.push({ name: `Lidocaine ${doses.lidoDose}mg IV/IO`, count: 1 });
    }

    return {
      type: 'PALS',
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
      patientInfo: {
        weight: weight || undefined,
        ageGroup: ageGroupLabels[ageGroup],
      },
    };
  }, [codeStartTime, totalSeconds, phase, rhythm, shockCount, epiCount, amioCount, lidocaineGiven, doses, cprCycleCount, checkedCauses, checklist, weight, ageGroup]);

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
        <title>PALS Code Summary</title>
        <style>
          body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; padding: 20px; max-width: 800px; margin: 0 auto; }
          h1 { font-size: 20px; margin-bottom: 4px; }
          h3 { font-size: 14px; margin: 0 0 8px 0; border-bottom: 1px solid #333; padding-bottom: 4px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 16px; }
          .section { margin-bottom: 16px; padding: 12px; border: 1px solid #ccc; border-radius: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .patient-info { background: #fdf2f8; border-color: #fbcfe8; }
          .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ccc; font-size: 10px; color: #666; }
          .signature { border-bottom: 1px solid #999; width: 200px; height: 30px; margin-top: 8px; }
          ul { margin: 0; padding-left: 20px; }
          @media print { body { padding: 0; } .patient-info { background: #f9f9f9 !important; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PALS Code Summary</h1>
          <p style="color: #666; margin: 0;">AHA 2025 Pediatric Guidelines • Generated: ${formatDateTime(new Date())}</p>
        </div>
        
        ${summary.patientInfo ? `
        <div class="section patient-info">
          <h3>Patient Information</h3>
          <div class="grid">
            ${summary.patientInfo.weight ? `<p><strong>Weight:</strong> ${summary.patientInfo.weight} kg</p>` : ''}
            ${summary.patientInfo.ageGroup ? `<p><strong>Age Group:</strong> ${summary.patientInfo.ageGroup}</p>` : ''}
          </div>
        </div>
        ` : ''}
        
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
                ? `<ul>${summary.medications.map(m => `<li>${m.name}: ${m.count} dose(s)</li>`).join('')}</ul>`
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
  const cprQuality = getCprQuality();

  return (
    <Card className="border-border/50 shadow-soft rounded-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Baby className="w-5 h-5 text-pink-500" />
            </div>
            <div>
              <CardTitle className="text-xl">PALS CODE ASSIST</CardTitle>
              <p className="text-sm text-muted-foreground">AHA 2025 Guidelines • Pediatric Resuscitation</p>
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
        {/* Patient Setup */}
        {phase === 'idle' && (
          <div className="space-y-4">
            {/* Weight & Age Group */}
            <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900 rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-pink-500" />
                <span className="font-semibold text-pink-700 dark:text-pink-300">Patient Weight (CRITICAL for dosing)</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="Enter weight"
                    value={weight || ''}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setWeight(isNaN(val) ? null : val);
                      if (!isNaN(val)) {
                        setChecklist(prev => ({ ...prev, weightObtained: true }));
                      }
                    }}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Age Group</Label>
                  <div className="flex gap-1">
                    {(['infant', 'child', 'adolescent'] as AgeGroup[]).map((age) => (
                      <Button
                        key={age}
                        variant={ageGroup === age ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAgeGroup(age)}
                        className="flex-1 text-xs rounded-lg capitalize"
                      >
                        {age}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {doses && (
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-3 mt-2">
                  <div className="text-sm font-medium mb-2">Calculated Doses ({weight} kg):</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>• Epi: {doses.epiDose}mg ({doses.epiVolume}mL)</div>
                    <div>• Amio: {doses.amioDose}mg</div>
                    <div>• Shock: {doses.initialShock}J → {doses.subsequentShock}J</div>
                    <div>• Lido: {doses.lidoDose}mg</div>
                  </div>
                </div>
              )}
            </div>

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
                  Defibrillator ready (pediatric pads if &lt;10kg)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.weightObtained}
                    onCheckedChange={() => toggleChecklist('weightObtained')}
                  />
                  <Scale className="w-4 h-4 text-muted-foreground" />
                  Weight obtained/estimated (Broselow tape if needed)
                </label>
              </CollapsibleContent>
            </Collapsible>

            {/* Rhythm Selection */}
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
                  <span className="text-xs opacity-80">Shockable (uncommon in peds)</span>
                </Button>
                <Button
                  variant={rhythm === 'asystole_pea' ? 'default' : 'outline'}
                  onClick={() => setRhythm('asystole_pea')}
                  className="h-auto py-4 flex-col gap-1 rounded-xl"
                >
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-semibold">Asystole / PEA</span>
                  <span className="text-xs opacity-80">Non-Shockable (most common)</span>
                </Button>
              </div>
              <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                💡 In pediatrics, asystole/PEA is most common. VF/pVT occurs in ~10-15% of pediatric arrests.
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
                  ? 'bg-pink-500/10 border-2 border-pink-500/30'
                  : action.priority === 'next'
                  ? 'bg-warning/10 border border-warning/30'
                  : 'bg-muted/50 border border-border/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {action.priority === 'current' && (
                  <Badge className="text-xs bg-pink-500 hover:bg-pink-600">NOW</Badge>
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
            
            {/* CPR Quality Reminders - Age Specific */}
            <div className="grid grid-cols-2 gap-2 mt-3">
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-lg p-2 text-xs">
                <div className="font-semibold text-pink-600 dark:text-pink-400">Depth ({ageGroup})</div>
                <div>{cprQuality.depth}</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-lg p-2 text-xs">
                <div className="font-semibold text-pink-600 dark:text-pink-400">Technique</div>
                <div>{cprQuality.technique}</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-lg p-2 text-xs">
                <div className="font-semibold text-pink-600 dark:text-pink-400">Rate</div>
                <div>{PALS_2025.compressionRate}</div>
              </div>
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-lg p-2 text-xs">
                <div className="font-semibold text-pink-600 dark:text-pink-400">Ratio</div>
                <div>{checklist.advancedAirway ? '10 breaths/min' : cprQuality.ratio}</div>
              </div>
            </div>
            
            {/* Ventilation Emphasis - Critical in PALS */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                <Wind className="w-4 h-4" />
                Ventilation is CRITICAL in pediatrics!
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Most pediatric arrests are respiratory in origin. Ensure adequate chest rise with each breath.
              </p>
            </div>
            
            {cprSeconds <= 65 && cprSeconds > 55 && (
              <div className="bg-warning/20 border border-warning/30 rounded-lg p-3 flex items-center gap-2 mt-2">
                <RefreshCw className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Switch compressors at 1 minute!</span>
              </div>
            )}
          </div>
        )}

        {/* Rhythm Check Actions */}
        {phase === 'rhythm_check' && (
          <div className="space-y-4">
            <div className="bg-warning/10 border border-warning/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Stethoscope className="w-5 h-5 text-warning" />
                <span className="font-bold text-warning-foreground">PULSE CHECK</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {ageGroup === 'infant' 
                  ? 'Check BRACHIAL pulse in infants (<1 year) for <10 seconds'
                  : 'Check CAROTID or FEMORAL pulse for <10 seconds'}
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
            {/* Weight Display */}
            {weight && (
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-xl p-2 text-center">
                <span className="text-sm font-medium text-pink-600 dark:text-pink-400">
                  Patient: {weight} kg ({ageGroup})
                </span>
              </div>
            )}
            
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
                    Code Essentials ({Object.values(checklist).filter(Boolean).length}/6)
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${checklistOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3 space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.ivIoAccess}
                    onCheckedChange={() => toggleChecklist('ivIoAccess')}
                  />
                  <Syringe className="w-4 h-4 text-muted-foreground" />
                  IV/IO access (IO preferred if difficult IV)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    checked={checklist.advancedAirway}
                    onCheckedChange={() => toggleChecklist('advancedAirway')}
                  />
                  <Wind className="w-4 h-4 text-muted-foreground" />
                  Advanced airway (ETT/SGA - size appropriate)
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

            {/* ETCO2 Guidance */}
            {checklist.capnography && (
              <div className="bg-muted/30 rounded-xl p-3 text-xs space-y-1">
                <div className="font-semibold">ETCO2 Interpretation (PALS 2025):</div>
                <div>• &lt;10-15 mmHg: Poor prognosis, improve CPR quality</div>
                <div>• 15-20 mmHg: Continue, optimize compressions</div>
                <div>• &gt;35-40 mmHg: May indicate ROSC - check pulse!</div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {phase === 'idle' ? (
            <Button 
              onClick={startCode} 
              disabled={!rhythm || !weight}
              className="flex-1 rounded-xl bg-pink-500 hover:bg-pink-600"
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
                  Shock ({getShockEnergy()})
                </Button>
              )}
              
              {phase === 'cpr' && doses && (
                <>
                  <Button 
                    onClick={giveEpi} 
                    variant={isEpiDue ? 'destructive' : 'outline'}
                    className="flex-1 rounded-xl"
                    disabled={!checklist.ivIoAccess}
                  >
                    <Syringe className="w-4 h-4 mr-2" />
                    Epi {doses.epiDose}mg
                  </Button>
                  
                  {rhythm === 'vf_pvt' && shockCount >= 2 && amioCount < 2 && (
                    <Button 
                      onClick={giveAmio} 
                      variant="outline" 
                      className="rounded-xl"
                      disabled={!checklist.ivIoAccess}
                    >
                      Amio {doses.amioDose}mg
                    </Button>
                  )}
                  
                  {rhythm === 'vf_pvt' && shockCount >= 2 && !lidocaineGiven && amioCount === 0 && (
                    <Button 
                      onClick={giveLidocaine} 
                      variant="ghost" 
                      className="rounded-xl text-xs"
                      disabled={!checklist.ivIoAccess}
                    >
                      Alt: Lido {doses.lidoDose}mg
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

        {/* Reversible Causes - Pediatric Focus */}
        {phase !== 'idle' && phase !== 'rosc' && (
          <Collapsible open={causesOpen} onOpenChange={setCausesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between rounded-xl">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  H's and T's ({checkedCauses.size}/11 assessed)
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${causesOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3">
              <div className="bg-pink-50 dark:bg-pink-950/30 rounded-lg p-2 mb-3 text-xs text-pink-700 dark:text-pink-300">
                💡 In pediatrics, HYPOXIA and HYPOVOLEMIA are the most common causes. Always ensure adequate ventilation first!
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-pink-600">6 H's</h4>
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
                  <h4 className="font-semibold text-sm text-pink-600">5 T's</h4>
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

        {/* References */}
        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border/50">
          Based on AHA 2025 PALS Guidelines • For training and decision support only
        </div>
      </CardContent>
    </Card>
  );
};

export default PALSCodeNarrator;
