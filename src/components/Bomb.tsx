import { motion } from 'framer-motion';
import type { Bomb as BombType } from '../utils/simulation';

interface BombProps {
  bomb: BombType;
  scaledPosition: { x: number; y: number };
  onAnimationComplete?: () => void;
}

export function Bomb({ bomb, scaledPosition, onAnimationComplete }: BombProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      initial={{ 
        x: scaledPosition.x - 200, 
        y: -50, 
        scale: 0.5,
        opacity: 0 
      }}
      animate={{ 
        x: scaledPosition.x - 4, 
        y: scaledPosition.y - 4, 
        scale: 1,
        opacity: 1 
      }}
      transition={{ 
        duration: 1.5, 
        ease: "easeIn",
        delay: bomb.id * 0.2 
      }}
      // Animation completion moved to final impact marker
    >
      {/* Enhanced Bomb falling */}
      <motion.div
        className="w-3 h-6 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        {/* Bomb fins */}
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-gray-600 rounded-sm"></div>
      </motion.div>
      
      {/* Enhanced Explosion effect */}
      <motion.div
        className={`absolute -top-4 -left-4 w-12 h-12 rounded-full ${
          bomb.isHit ? 'bg-gradient-to-r from-green-400 to-emerald-500 glow-hit' : 'bg-gradient-to-r from-red-400 to-rose-500 glow-miss'
        }`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.9, 0] }}
        transition={{ 
          duration: 1.2, 
          delay: bomb.id * 0.2 + 1.5,
          times: [0, 0.4, 1]
        }}
      />
      
      {/* Explosion particles */}
      <motion.div
        className="absolute -top-2 -left-2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 2, 1], opacity: [0, 1, 0] }}
        transition={{ 
          duration: 0.6, 
          delay: bomb.id * 0.2 + 1.5 
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              bomb.isHit ? 'bg-green-300' : 'bg-red-300'
            }`}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 20],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 20],
              opacity: [1, 0]
            }}
            transition={{
              duration: 0.8,
              delay: bomb.id * 0.2 + 1.6
            }}
          />
        ))}
      </motion.div>
      
      {/* Enhanced Impact marker */}
      <motion.div
        className={`absolute -top-2 -left-2 w-4 h-4 rounded-full border-2 ${
          bomb.isHit ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300'
        } shadow-lg`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.9 }}
        transition={{ 
          duration: 0.4, 
          delay: bomb.id * 0.2 + 2.0 
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </motion.div>
  );
}