import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Wind, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedHeart from './AnimatedHeart';
import CPRProgressRing from './CPRProgressRing';
import CPRDepthIndicator from './CPRDepthIndicator';
import CPRSessionSummary from './CPRSessionSummary';

type SoundPreset = 'click' | 'beep' | 'tone';
type ProtocolMode = 'bls' | 'acls' | 'pals';
type PedsAge = 'infant' | 'child';
type PedsRescuer = 'one' | 'two';

const CYCLE_DURATION = 120; // 2 minutes

const CPRMetronome = () => {
  const [, setSearchParams] = useSearchParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [beatCount, setBeatCount] = useState(0);
  const [beatTrigger, setBeatTrigger] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(CYCLE_DURATION);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalCompressions, setTotalCompressions] = useState(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState(0);
  const [showSwitchAlert, setShowSwitchAlert] = useState(false);
  const [soundPreset, setSoundPreset] = useState<SoundPreset>('click');
  const [protocol, setProtocol] = useState<ProtocolMode>('bls');
  const [breathPause, setBreathPause] = useState(false);
  const [breathCountdown, setBreathCountdown] = useState(0);
  const [pedsAge, setPedsAge] = useState<PedsAge>('child');
  const [pedsRescuer, setPedsRescuer] = useState<PedsRescuer>('two');

  // BLS = 30:2, ACLS = continuous, PALS = 15:2 (two-rescuer) or 30:2 (single-rescuer)
  const getCprMode = () => {
    if (protocol === 'acls') return 'continuous';
    if (protocol === 'pals') return pedsRescuer === 'two' ? '15:2' : '30:2';
    return '30:2';
  };
  const cprMode = getCprMode();
  const compressionCycleCount = cprMode === '15:2' ? 15 : 30;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bpmAccumRef = useRef<number[]>([]);

  const getSoundParams = useCallback((preset: SoundPreset, isAccent: boolean) => {
    switch (preset) {
      case 'beep':
        return { freq: isAccent ? 1200 : 880, type: 'square' as OscillatorType, duration: 0.06 };
      case 'tone':
        return { freq: isAccent ? 660 : 440, type: 'sine' as OscillatorType, duration: 0.15 };
      case 'click':
      default:
        return { freq: isAccent ? 1000 : 800, type: 'sine' as OscillatorType, duration: 0.08 };
    }
  }, []);

  const playClick = useCallback((isAccent = false) => {
    if (isMuted || !audioContextRef.current) return;

    // Haptic feedback on mobile
    if (navigator.vibrate) navigator.vibrate(30);

    const ctx = audioContextRef.current;
    const { freq, type, duration } = getSoundParams(soundPreset, isAccent);
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [isMuted, volume, soundPreset, getSoundParams]);

  const playChime = useCallback(() => {
    if (isMuted || !audioContextRef.current) return;
    const ctx = audioContextRef.current;
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = 'sine';
      const start = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(volume * 0.6, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + 0.4);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  }, [isMuted, volume]);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      audioContextRef.current?.close();
    };
  }, []);

  // Beat interval
  useEffect(() => {
    if (isPlaying && !breathPause) {
      const interval = (60 / bpm) * 1000;
      intervalRef.current = setInterval(() => {
        setBeatCount(prev => {
          const next = prev + 1;
          // Pause for breaths based on compression cycle count
          if (cprMode !== 'continuous' && next % compressionCycleCount === 0) {
            setBreathPause(true);
            setBreathCountdown(2);
            playChime();
          }
          const isAccent = next % compressionCycleCount === 0;
          playClick(isAccent);
          return next;
        });
        setTotalCompressions(prev => prev + 1);
        setBeatTrigger(prev => prev + 1);
        bpmAccumRef.current.push(bpm);
      }, interval);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, bpm, isMuted, breathPause, cprMode, compressionCycleCount, playClick, playChime]);

  // Breath pause countdown
  useEffect(() => {
    if (!breathPause) return;
    if (breathCountdown <= 0) {
      setBreathPause(false);
      return;
    }
    const t = setTimeout(() => setBreathCountdown(prev => prev - 1), 1500);
    return () => clearTimeout(t);
  }, [breathPause, breathCountdown]);

  // Timer countdown
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            handleCycleEnd();
            return 0;
          }
          return prev - 1;
        });
        setTotalSessionSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying]);

  const handleCycleEnd = () => {
    setIsPlaying(false);
    setCycleCount(prev => prev + 1);
    setShowSwitchAlert(true);
    playChime();

    // Auto-dismiss after 5s
    setTimeout(() => setShowSwitchAlert(false), 5000);
  };

  const handleStart = () => {
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsPlaying(true);
    setBeatCount(0);
    setBeatTrigger(0);
    setTimerSeconds(CYCLE_DURATION);
    setShowSwitchAlert(false);
    setSessionComplete(false);
    setBreathPause(false);
  };

  const handleStop = () => {
    setIsPlaying(false);
    const avgBpm = bpmAccumRef.current.length > 0
      ? Math.round(bpmAccumRef.current.reduce((a, b) => a + b, 0) / bpmAccumRef.current.length)
      : bpm;
    setSessionData({
      totalCompressions: totalCompressions,
      totalCycles: cycleCount + (beatCount > 0 ? 1 : 0),
      totalSeconds: totalSessionSeconds,
      averageBpm: avgBpm,
    });
    setSessionComplete(true);
  };

  const handleNewSession = () => {
    setSessionComplete(false);
    setSessionData(null);
    setBeatCount(0);
    setTotalCompressions(0);
    setTotalSessionSeconds(0);
    setCycleCount(0);
    setTimerSeconds(CYCLE_DURATION);
    bpmAccumRef.current = [];
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const getBpmZone = (): 'optimal' | 'warning' | 'danger' => {
    if (bpm >= 100 && bpm <= 120) return 'optimal';
    if (bpm >= 90 && bpm <= 130) return 'warning';
    return 'danger';
  };

  const getBpmStatus = () => {
    const zone = getBpmZone();
    if (zone === 'optimal') return { label: 'Optimal', className: 'bg-success text-success-foreground' };
    if (zone === 'warning') return { label: bpm < 100 ? 'Slow' : 'Fast', className: 'bg-warning text-warning-foreground' };
    return { label: bpm < 100 ? 'Too Slow' : 'Too Fast', className: 'bg-destructive text-destructive-foreground' };
  };

  const status = getBpmStatus();
  const bpmZone = getBpmZone();
  const progress = timerSeconds / CYCLE_DURATION;
  const heartSize = 208; // w-52 = 208px

  return (
    <div
      ref={containerRef}
      className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, hsl(213 40% 22%) 0%, hsl(213 45% 16%) 100%)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div>
          <h2 className="text-primary-foreground text-lg font-bold tracking-tight">CPR Metronome</h2>
          <p className="text-xs text-primary-foreground/50">AHA: 100-120 compressions/min</p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 h-8 w-8"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Switch Provider Alert */}
      <AnimatePresence>
        {showSwitchAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-4 mb-2 p-3 rounded-lg text-center font-bold text-sm"
            style={{
              background: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(25 95% 55%) 100%)',
              color: 'hsl(0 0% 0%)',
            }}
          >
            ⚡ SWITCH PROVIDER — Cycle {cycleCount} Complete
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breath Pause Overlay */}
      <AnimatePresence>
        {breathPause && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mx-4 mb-2 p-3 rounded-lg text-center font-bold text-sm flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--info)) 0%, hsl(217 91% 50%) 100%)',
              color: 'hsl(0 0% 100%)',
            }}
          >
            <Wind className="w-5 h-5" />
            GIVE {breathCountdown} BREATH{breathCountdown !== 1 ? 'S' : ''}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 pb-6 space-y-5">
        {/* Heart + Progress Ring */}
        <div className="flex justify-center items-center">
          <div className="flex items-center gap-4">
            <CPRDepthIndicator isPlaying={isPlaying} beatTrigger={beatTrigger} bpm={bpm} />

            <div className="relative flex items-center justify-center" style={{ width: heartSize, height: heartSize }}>
              <CPRProgressRing
                progress={progress}
                size={heartSize}
                strokeWidth={5}
                bpmZone={bpmZone}
                isPlaying={isPlaying}
                beatTrigger={beatTrigger}
              />
              <AnimatedHeart
                isPlaying={isPlaying}
                bpm={bpm}
                beatTrigger={beatTrigger}
                className="w-44 h-44"
                onClick={isPlaying ? handleStop : handleStart}
              />
            </div>

            {/* Cycle info column */}
            <div className="flex flex-col items-center gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold font-mono text-primary-foreground">{beatCount}</div>
                <div className="text-[9px] text-primary-foreground/40 uppercase tracking-wider">Compressions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold font-mono text-primary-foreground/70">{cycleCount}</div>
                <div className="text-[9px] text-primary-foreground/40 uppercase tracking-wider">Cycles</div>
              </div>
            </div>
          </div>
        </div>

        {/* BPM Display */}
        <div className="text-center">
          <motion.div
            className="text-5xl font-bold font-mono text-primary-foreground"
            animate={isPlaying ? {
              textShadow: [
                '0 0 10px hsl(var(--primary-foreground) / 0.2)',
                '0 0 20px hsl(var(--primary-foreground) / 0.4)',
                '0 0 10px hsl(var(--primary-foreground) / 0.2)',
              ],
            } : {}}
            transition={{ duration: 60 / bpm, repeat: Infinity }}
          >
            {bpm}
          </motion.div>
          <div className="text-xs text-primary-foreground/40 uppercase tracking-widest mt-1">BPM</div>
          <Badge className={`mt-2 ${status.className} text-[10px] font-bold`}>{status.label}</Badge>
        </div>

        {/* Timer */}
        <div className="text-center">
          <div className={`text-2xl font-mono font-semibold ${timerSeconds <= 10 && isPlaying ? 'text-destructive animate-pulse' : 'text-primary-foreground/60'}`}>
            {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-[9px] text-primary-foreground/30 uppercase tracking-wider">Time Remaining</div>
        </div>

        {/* BPM Slider with colored zones */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-primary-foreground/30 font-mono">
            <span>80</span>
            <span className="text-success/70">100-120</span>
            <span>140</span>
          </div>
          <div className="relative">
            {/* Colored zone background */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none z-0">
              <div className="w-full h-2 rounded-full overflow-hidden flex">
                {/* 80-100: danger/warning zone */}
                <div className="h-full" style={{ width: '33.3%', background: 'linear-gradient(90deg, hsl(0 70% 45% / 0.4), hsl(38 80% 50% / 0.3))' }} />
                {/* 100-120: optimal zone */}
                <div className="h-full" style={{ width: '33.4%', background: 'hsl(160 84% 39% / 0.35)' }} />
                {/* 120-140: warning/danger zone */}
                <div className="h-full" style={{ width: '33.3%', background: 'linear-gradient(90deg, hsl(38 80% 50% / 0.3), hsl(0 70% 45% / 0.4))' }} />
              </div>
            </div>
            <Slider
              value={[bpm]}
              onValueChange={(value) => setBpm(value[0])}
              min={80}
              max={140}
              step={1}
              disabled={isPlaying}
              className="w-full relative z-10"
            />
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex gap-2 justify-center">
          {[100, 110, 120].map(v => (
            <Button
              key={v}
              variant="outline"
              size="sm"
              onClick={() => setBpm(v)}
              disabled={isPlaying}
              className={`border-primary-foreground/20 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground ${bpm === v ? 'border-success/50 text-success bg-success/10' : ''}`}
            >
              {v}
            </Button>
          ))}
        </div>

        {/* BLS / ACLS / PALS Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg overflow-hidden border border-primary-foreground/20">
            {(['bls', 'acls', 'pals'] as ProtocolMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setProtocol(mode)}
                disabled={isPlaying}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
                  protocol === mode
                    ? mode === 'bls'
                      ? 'bg-info/20 text-info border-info/40'
                      : mode === 'pals'
                        ? 'bg-warning/20 text-warning border-warning/40'
                        : 'bg-brand-accent/20 text-brand-accent-foreground border-brand-accent/40'
                    : 'text-primary-foreground/40 hover:text-primary-foreground/60 hover:bg-primary-foreground/5'
                }`}
                style={protocol === mode && mode === 'acls' ? { background: 'hsl(var(--brand-accent) / 0.2)', color: 'hsl(var(--brand-accent-light))' } : undefined}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* PALS sub-options */}
        {protocol === 'pals' && (
          <div className="space-y-2">
            <div className="flex justify-center gap-2">
              {(['infant', 'child'] as PedsAge[]).map(age => (
                <button
                  key={age}
                  onClick={() => setPedsAge(age)}
                  disabled={isPlaying}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all disabled:opacity-50 capitalize ${
                    pedsAge === age
                      ? 'bg-warning/20 text-warning border border-warning/40'
                      : 'text-primary-foreground/40 border border-primary-foreground/10 hover:text-primary-foreground/60'
                  }`}
                >
                  {age === 'infant' ? 'Infant (<1yr)' : 'Child (1yr–puberty)'}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-2">
              {(['one', 'two'] as PedsRescuer[]).map(r => (
                <button
                  key={r}
                  onClick={() => setPedsRescuer(r)}
                  disabled={isPlaying}
                  className={`px-3 py-1.5 text-[11px] font-semibold rounded-md transition-all disabled:opacity-50 ${
                    pedsRescuer === r
                      ? 'bg-warning/20 text-warning border border-warning/40'
                      : 'text-primary-foreground/40 border border-primary-foreground/10 hover:text-primary-foreground/60'
                  }`}
                >
                  {r === 'one' ? '1 Rescuer (30:2)' : '2 Rescuers (15:2)'}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-[10px] text-primary-foreground/40">
          {protocol === 'bls'
            ? '30:2 — 30 compressions, pause for 2 breaths'
            : protocol === 'acls'
              ? 'Continuous — advanced airway, no pause for breaths'
              : pedsRescuer === 'two'
                ? '15:2 — 15 compressions, pause for 2 breaths'
                : '30:2 — 30 compressions, pause for 2 breaths'}
        </div>

        {/* Sound toggles */}
        <div className="flex gap-2 justify-center flex-wrap">
          {(['click', 'beep', 'tone'] as SoundPreset[]).map(preset => (
            <Button
              key={preset}
              variant="outline"
              size="sm"
              onClick={() => setSoundPreset(preset)}
              className={`text-[11px] border-primary-foreground/20 text-primary-foreground/60 hover:bg-primary-foreground/10 capitalize ${soundPreset === preset ? 'border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10' : ''}`}
            >
              {preset}
            </Button>
          ))}
        </div>

        {/* Volume slider */}
        {!isMuted && (
          <div className="flex items-center gap-3 px-2">
            <VolumeX className="w-3.5 h-3.5 text-primary-foreground/30" />
            <Slider
              value={[volume * 100]}
              onValueChange={(v) => setVolume(v[0] / 100)}
              min={5}
              max={100}
              step={5}
              className="flex-1"
            />
            <Volume2 className="w-3.5 h-3.5 text-primary-foreground/30" />
          </div>
        )}

        {/* Play / Pause */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? handleStop : handleStart}
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-colors"
            style={{
              background: isPlaying
                ? 'linear-gradient(135deg, hsl(var(--destructive)), hsl(0 70% 50%))'
                : 'linear-gradient(135deg, hsl(var(--success)), hsl(160 70% 35%))',
            }}
          >
            {isPlaying
              ? <Pause className="w-7 h-7 text-primary-foreground" />
              : <Play className="w-7 h-7 text-primary-foreground ml-0.5" />
            }
          </motion.button>
        </div>

        {/* Session totals (always visible) */}
        {(totalCompressions > 0 || totalSessionSeconds > 0) && !sessionComplete && (
          <div className="flex gap-3 justify-center text-primary-foreground/40">
            <div className="text-center">
              <span className="text-sm font-mono font-semibold text-primary-foreground/60">{totalCompressions}</span>
              <span className="text-[9px] ml-1 uppercase tracking-wider">total</span>
            </div>
            <span className="text-primary-foreground/20">|</span>
            <div className="text-center">
              <span className="text-sm font-mono font-semibold text-primary-foreground/60">
                {Math.floor(totalSessionSeconds / 60)}:{(totalSessionSeconds % 60).toString().padStart(2, '0')}
              </span>
              <span className="text-[9px] ml-1 uppercase tracking-wider">session</span>
            </div>
          </div>
        )}

        {/* Session Summary */}
        {sessionComplete && sessionData && (
          <CPRSessionSummary session={sessionData} onRestart={handleNewSession} />
        )}

        {/* Guidelines — protocol-specific */}
        <div className="text-[11px] text-primary-foreground/30 space-y-1 border-t border-primary-foreground/10 pt-4">
          <p className="text-primary-foreground/50 font-bold uppercase tracking-wider text-[10px] mb-1.5">
            {protocol === 'bls' ? 'BLS Guidelines (AHA 2025)' : protocol === 'pals' ? 'PALS Guidelines (AHA 2025)' : 'ACLS Guidelines (AHA 2025)'}
          </p>
          {protocol === 'pals' ? (
            <>
              <p><strong className="text-primary-foreground/50">Push hard:</strong> {pedsAge === 'infant' ? 'At least 1.5 inches (4 cm) depth' : 'At least 2 inches (5 cm) depth, avoid exceeding 2.4 inches'}</p>
              <p><strong className="text-primary-foreground/50">Push fast:</strong> 100-120 compressions per minute</p>
              <p><strong className="text-primary-foreground/50">Technique:</strong> {pedsAge === 'infant' ? 'Two-thumb encircling technique (2 rescuers) or 2-finger technique (1 rescuer)' : 'One or two hands on lower half of sternum'}</p>
              <p><strong className="text-primary-foreground/50">Ratio:</strong> {pedsRescuer === 'two' ? '15:2 (two-rescuer) — 15 compressions, 2 breaths' : '30:2 (single-rescuer) — 30 compressions, 2 breaths'}</p>
              <p><strong className="text-primary-foreground/50">Allow full recoil:</strong> Let chest fully rise between compressions</p>
              <p><strong className="text-primary-foreground/50">Epinephrine:</strong> 0.01 mg/kg IV/IO (0.1 mL/kg of 0.1 mg/mL) every 3-5 minutes</p>
              <p><strong className="text-primary-foreground/50">Minimize interruptions:</strong> Pause &lt;10 seconds for breaths</p>
            </>
          ) : (
            <>
              <p><strong className="text-primary-foreground/50">Push hard:</strong> At least 2 inches (5 cm) depth</p>
              <p><strong className="text-primary-foreground/50">Push fast:</strong> 100-120 compressions per minute</p>
              <p><strong className="text-primary-foreground/50">Allow full recoil:</strong> Let chest fully rise between compressions</p>
              {protocol === 'bls' ? (
                <>
                  <p><strong className="text-primary-foreground/50">30:2 ratio:</strong> 30 compressions, then 2 breaths</p>
                  <p><strong className="text-primary-foreground/50">Minimize interruptions:</strong> Pause &lt;10 seconds for breaths</p>
                </>
              ) : (
                <>
                  <p><strong className="text-primary-foreground/50">Advanced airway:</strong> Continuous compressions, 1 breath every 6 seconds</p>
                  <p><strong className="text-primary-foreground/50">Rhythm check:</strong> Every 2 minutes during provider switch</p>
                  <p><strong className="text-primary-foreground/50">Epinephrine:</strong> 1 mg IV/IO every 3-5 minutes</p>
                </>
              )}
            </>
          )}
        </div>

        {/* Link to Code Narrators */}
        <div className="flex gap-2 justify-center border-t border-primary-foreground/10 pt-4">
          {protocol !== 'pals' && (
            <button
              onClick={() => setSearchParams({ tool: 'aclsnarrator' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-primary-foreground/10 text-primary-foreground/70 hover:bg-primary-foreground/20 hover:text-primary-foreground transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open ACLS Code Assist
            </button>
          )}
          {protocol !== 'acls' && (
            <button
              onClick={() => setSearchParams({ tool: 'palsnarrator' })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold bg-warning/10 text-warning hover:bg-warning/20 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open PALS Code Assist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CPRMetronome;
