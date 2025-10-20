import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Bomb as BombType } from '../utils/simulation';

interface BombProps {
  bomb: BombType;
  scaledPosition: { x: number; y: number };
  onAnimationComplete?: () => void;
  showExplosions?: boolean;
  soundEnabled?: boolean;
}

export function Bomb({ bomb, scaledPosition, onAnimationComplete, showExplosions = true, soundEnabled = false }: BombProps) {
  const [hasExploded, setHasExploded] = useState(false);

  // Realistic explosion sound effect
  useEffect(() => {
    if (soundEnabled && !hasExploded) {
      const dropDelay = bomb.id * 800; // Stagger bomb drops every 800ms
      const impactDelay = dropDelay + 2000; // Impact after 2 seconds of flight
      
      const timer = setTimeout(() => {
        try {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          
          // Create realistic explosion sound
          const createRealisticExplosion = () => {
            // Low frequency rumble (bass)
            const lowOsc = audioContext.createOscillator();
            const lowGain = audioContext.createGain();
            lowOsc.type = 'sawtooth';
            lowOsc.frequency.setValueAtTime(60, audioContext.currentTime);
            lowOsc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.8);
            
            // Mid frequency crack
            const midOsc = audioContext.createOscillator();
            const midGain = audioContext.createGain();
            midOsc.type = 'square';
            midOsc.frequency.setValueAtTime(200, audioContext.currentTime);
            midOsc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
            
            // High frequency sizzle (debris)
            const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 1.2, audioContext.sampleRate);
            const noiseSource = audioContext.createBufferSource();
            const noiseGain = audioContext.createGain();
            const output = noiseBuffer.getChannelData(0);
            
            // Generate filtered noise for debris sound
            for (let i = 0; i < output.length; i++) {
              output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (audioContext.sampleRate * 0.3));
            }
            
            // Connect and configure low rumble
            lowOsc.connect(lowGain);
            lowGain.connect(audioContext.destination);
            lowGain.gain.setValueAtTime(0, audioContext.currentTime);
            lowGain.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05);
            lowGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
            
            // Connect and configure mid crack
            midOsc.connect(midGain);
            midGain.connect(audioContext.destination);
            midGain.gain.setValueAtTime(0, audioContext.currentTime);
            midGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.02);
            midGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            // Connect and configure high sizzle
            noiseSource.buffer = noiseBuffer;
            noiseSource.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.2);
            
            // Start all components
            lowOsc.start(audioContext.currentTime);
            lowOsc.stop(audioContext.currentTime + 0.8);
            
            midOsc.start(audioContext.currentTime);
            midOsc.stop(audioContext.currentTime + 0.3);
            
            noiseSource.start(audioContext.currentTime + 0.05);
            noiseSource.stop(audioContext.currentTime + 1.2);
          };

          createRealisticExplosion();
        } catch (error) {
          console.log('Audio not supported or blocked');
        }
        
        setHasExploded(true);
      }, impactDelay);

      return () => clearTimeout(timer);
    }
  }, [bomb.id, soundEnabled, hasExploded]);
  const dropDelay = bomb.id * 0.8; // Stagger bomb drops every 800ms
  const flightDuration = 2.0; // 2 seconds flight time
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ 
        x: scaledPosition.x - 300, 
        y: -80, 
        scale: 0.3,
        opacity: 0 
      }}
      animate={{ 
        x: scaledPosition.x - 8, 
        y: scaledPosition.y - 8, 
        scale: 1,
        opacity: 1 
      }}
      transition={{ 
        duration: flightDuration, 
        ease: "easeIn",
        delay: dropDelay 
      }}
    >
      {/* Enhanced Detailed Bomb - Premium Design */}
      <motion.div
        className="relative"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: flightDuration, ease: "linear", delay: dropDelay }}
      >
        {/* Compact Detailed Bomb */}
        <div className="w-3 h-7 bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 rounded-full shadow-xl border border-gray-600 relative">
          {/* Bomb nose cone */}
          <div className="absolute -top-1.5 left-1/2 transform -translate-x-1/2 w-2 h-2.5 bg-gradient-to-b from-gray-600 to-gray-800 rounded-t-full border border-gray-500"></div>
          
          {/* Body segments */}
          <div className="absolute top-1 left-0 right-0 h-0.5 bg-gray-600 opacity-50"></div>
          <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-600 opacity-50"></div>
          
          {/* Compact bomb fins */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
            <div className="w-5 h-2 bg-gray-600 rounded-sm relative shadow-md">
              {/* Simplified fins */}
              <div className="absolute -top-1 left-0 w-1 h-3 bg-gray-500 rounded-sm transform -rotate-12 shadow-sm"></div>
              <div className="absolute -top-1 right-0 w-1 h-3 bg-gray-500 rounded-sm transform rotate-12 shadow-sm"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-500 rounded-sm shadow-sm"></div>
            </div>
          </div>
          
          {/* Compact markings */}
          <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-2.5 h-1 bg-yellow-400 rounded-sm opacity-90"></div>
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-red-500 rounded-sm"></div>
          
          {/* Small serial number */}
          <div className="absolute top-4.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-sm opacity-80 flex items-center justify-center">
            <span className="text-gray-800 text-xs font-bold leading-none" style={{ fontSize: '6px' }}>{bomb.id + 1}</span>
          </div>
          
          {/* Metallic highlights */}
          <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-gray-400 to-transparent opacity-30 rounded-l-full"></div>
        </div>
        
        {/* Compact smoke trail */}
        <motion.div
          className="absolute -top-6 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, delay: dropDelay }}
        >
          <div className="w-1 h-4 bg-gradient-to-t from-gray-400 to-transparent rounded-full blur-sm"></div>
        </motion.div>
      </motion.div>
      
      {/* Enhanced Explosion Animation - Conditional */}
      {showExplosions && (
        <>
          {/* Main explosion blast */}
          <motion.div
            className={`absolute -top-8 -left-8 w-16 h-16 rounded-full ${
              bomb.isHit ? 'bg-gradient-radial from-yellow-300 via-orange-400 to-red-500' : 'bg-gradient-radial from-gray-300 via-gray-400 to-gray-600'
            } shadow-2xl`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.8, 1.2, 0], opacity: [0, 1, 0.8, 0] }}
            transition={{ 
              duration: 1.5, 
              delay: dropDelay + flightDuration,
              times: [0, 0.3, 0.7, 1]
            }}
          />
          
          {/* Secondary explosion ring */}
          <motion.div
            className={`absolute -top-6 -left-6 w-12 h-12 rounded-full border-4 ${
              bomb.isHit ? 'border-orange-300' : 'border-gray-400'
            }`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2.5, 3], opacity: [0, 0.8, 0] }}
            transition={{ 
              duration: 1.2, 
              delay: dropDelay + flightDuration + 0.1
            }}
          />
          
          {/* Explosion particles */}
          <motion.div
            className="absolute -top-4 -left-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
            transition={{ 
              duration: 1.0, 
              delay: dropDelay + flightDuration 
            }}
          >
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${
                  bomb.isHit 
                    ? i % 3 === 0 ? 'bg-yellow-300' : i % 3 === 1 ? 'bg-orange-400' : 'bg-red-400'
                    : 'bg-gray-400'
                } shadow-lg`}
                animate={{
                  x: [0, Math.cos(i * 30 * Math.PI / 180) * (25 + Math.random() * 15)],
                  y: [0, Math.sin(i * 30 * Math.PI / 180) * (25 + Math.random() * 15)],
                  opacity: [1, 0.8, 0],
                  scale: [1, 0.5, 0]
                }}
                transition={{
                  duration: 1.2,
                  delay: dropDelay + flightDuration + 0.1 + (i * 0.05)
                }}
              />
            ))}
          </motion.div>
          
          {/* Shockwave effect */}
          <motion.div
            className={`absolute -top-10 -left-10 w-20 h-20 rounded-full border-2 ${
              bomb.isHit ? 'border-yellow-200' : 'border-gray-300'
            } opacity-50`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 4], opacity: [0.8, 0] }}
            transition={{ 
              duration: 0.8, 
              delay: dropDelay + flightDuration,
              ease: "easeOut"
            }}
          />
        </>
      )}
      
      {/* Enhanced Impact crater */}
      <motion.div
        className={`absolute -top-3 -left-3 w-6 h-6 rounded-full ${
          bomb.isHit 
            ? 'bg-gradient-radial from-green-400 via-green-500 to-green-600 shadow-lg shadow-green-500/50' 
            : 'bg-gradient-radial from-red-400 via-red-500 to-red-600 shadow-lg shadow-red-500/50'
        } border-2 border-white`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ 
          duration: 0.4, 
          delay: dropDelay + flightDuration + 0.2 
        }}
        onAnimationComplete={onAnimationComplete}
      >
        {/* Impact glow */}
        <div className={`absolute inset-0 rounded-full ${
          bomb.isHit ? 'bg-green-300' : 'bg-red-300'
        } opacity-60 animate-pulse`}></div>
        
        {/* Hit/Miss indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-xs font-bold">
            {bomb.isHit ? '✓' : '✗'}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}