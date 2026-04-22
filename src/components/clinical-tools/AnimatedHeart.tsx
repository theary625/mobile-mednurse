import { motion, useAnimation } from 'framer-motion';
import { useEffect, useCallback, useRef } from 'react';
import heartImg from '@/assets/heart-outline.png';

interface AnimatedHeartProps {
  isPlaying: boolean;
  bpm: number;
  beatTrigger: number;
  className?: string;
  onClick?: () => void;
}

const AnimatedHeart = ({ isPlaying, bpm, beatTrigger, className = '', onClick }: AnimatedHeartProps) => {
  const heartControls = useAnimation();
  const beatDuration = 60 / bpm;
  const rotationRef = useRef(0);

  const triggerBeat = useCallback(async () => {
    await heartControls.start({
      scale: [1, 0.88, 1.08, 1],
      filter: [
        'drop-shadow(0 0 18px hsl(220 60% 35% / 0.4)) brightness(1)',
        'drop-shadow(0 0 30px hsl(0 70% 50% / 0.6)) brightness(1.15)',
        'drop-shadow(0 0 24px hsl(220 60% 35% / 0.5)) brightness(1.05)',
        'drop-shadow(0 0 18px hsl(220 60% 35% / 0.4)) brightness(1)',
      ],
      transition: { duration: beatDuration * 0.4, ease: 'easeInOut' },
    });
  }, [heartControls, beatDuration]);

  useEffect(() => {
    if (isPlaying && beatTrigger > 0) {
      triggerBeat();
    }
  }, [beatTrigger, isPlaying, triggerBeat]);

  return (
    <div className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick} style={{ perspective: '600px' }}>
      {/* Pulsing glow behind heart when playing */}
      {isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(0 65% 45% / 0.35) 0%, hsl(220 50% 30% / 0.15) 50%, transparent 70%)',
          }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.95, 1.08, 0.95] }}
          transition={{ duration: beatDuration, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Heart image with 3D perspective rotation + beat */}
      <motion.img
        src={heartImg}
        alt="Anatomical human heart"
        animate={isPlaying ? heartControls : {
          rotateY: ['-5deg', '5deg', '-5deg'],
          scale: [1, 1.02, 1],
        }}
        initial={{ rotateY: '0deg' }}
        transition={!isPlaying ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : undefined}
        className="w-full h-full object-contain relative z-10"
        style={{
          filter: isPlaying
            ? 'drop-shadow(0 0 18px hsl(220 60% 35% / 0.5))'
            : 'drop-shadow(0 4px 12px hsl(0 0% 0% / 0.3))',
          transformStyle: 'preserve-3d',
          
        }}
      />

      {/* Blood flow stream overlay */}
      {isPlaying && (
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full z-20 pointer-events-none"
        >
          <defs>
            <filter id="blood-glow">
              <feGaussianBlur stdDeviation="0.3" />
            </filter>
          </defs>

          {/* Aorta outflow — oxygenated */}
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75].map((delay, i) => (
            <ellipse key={`ao-${i}`} rx="2.2" ry="1" fill="#ee1111" opacity="0.85" filter="url(#blood-glow)">
              <animateMotion
                dur={`${beatDuration * 3}s`}
                repeatCount="indefinite"
                begin={`${delay * beatDuration * 3}s`}
                rotate="auto"
                calcMode="spline"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                path="M48,42 Q48,28 55,18 Q62,10 72,8 Q80,7 85,12"
              />
            </ellipse>
          ))}

          {/* SVC inflow — deoxygenated */}
          {[0, 0.15, 0.3, 0.45, 0.6, 0.75].map((delay, i) => (
            <ellipse key={`svc-${i}`} rx="2" ry="0.9" fill="#2255cc" opacity="0.8" filter="url(#blood-glow)">
              <animateMotion
                dur={`${beatDuration * 3}s`}
                repeatCount="indefinite"
                begin={`${delay * beatDuration * 3}s`}
                rotate="auto"
                calcMode="spline"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                path="M28,8 Q30,18 32,28 Q34,38 36,45"
              />
            </ellipse>
          ))}

          {/* Pulmonary artery — deoxygenated */}
          {[0, 0.18, 0.36, 0.54, 0.72].map((delay, i) => (
            <ellipse key={`pa-${i}`} rx="1.8" ry="0.8" fill="#2255cc" opacity="0.75" filter="url(#blood-glow)">
              <animateMotion
                dur={`${beatDuration * 2.5}s`}
                repeatCount="indefinite"
                begin={`${delay * beatDuration * 2.5}s`}
                rotate="auto"
                calcMode="spline"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                path="M45,40 Q40,30 35,22 Q30,16 24,12"
              />
            </ellipse>
          ))}

          {/* Pulmonary vein — oxygenated */}
          {[0, 0.18, 0.36, 0.54, 0.72].map((delay, i) => (
            <ellipse key={`pv-${i}`} rx="1.8" ry="0.8" fill="#ee1111" opacity="0.75" filter="url(#blood-glow)">
              <animateMotion
                dur={`${beatDuration * 2.5}s`}
                repeatCount="indefinite"
                begin={`${delay * beatDuration * 2.5}s`}
                rotate="auto"
                calcMode="spline"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                path="M82,28 Q75,32 68,38 Q62,42 58,48"
              />
            </ellipse>
          ))}

          {/* Coronary flow */}
          {[0, 0.2, 0.4, 0.6, 0.8].map((delay, i) => (
            <ellipse key={`cor-${i}`} rx="1.4" ry="0.6" fill="#ee1111" opacity="0.65" filter="url(#blood-glow)">
              <animateMotion
                dur={`${beatDuration * 4}s`}
                repeatCount="indefinite"
                begin={`${delay * beatDuration * 4}s`}
                rotate="auto"
                calcMode="spline"
                keySplines="0.42 0 0.58 1"
                keyTimes="0;1"
                path="M50,45 Q45,55 42,65 Q38,75 40,85"
              />
            </ellipse>
          ))}
        </svg>
      )}

      {/* Idle glow */}
      {!isPlaying && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, hsl(220 50% 40% / 0.2) 0%, transparent 65%)',
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </div>
  );
};

export default AnimatedHeart;
