import { motion } from "framer-motion";

interface AircraftProps {
  isActive: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

export function Aircraft({
  isActive,
  viewportWidth,
  viewportHeight,
}: AircraftProps) {
  if (!isActive) return null;

  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      initial={{ x: -100, y: viewportHeight * 0.2 }}
      animate={{
        x: isActive ? viewportWidth + 100 : -100,
        y: viewportHeight * 0.2,
      }}
      transition={{
        duration: 8,
        ease: "linear",
      }}
    >
      {/* Enhanced Aircraft body */}
      <div className="relative">
        <div className="w-20 h-6 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full shadow-2xl">
          {/* Main Wings */}
          <div className="absolute -top-2 left-6 w-12 h-8 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg opacity-90 shadow-lg" />
          {/* Cockpit */}
          <div className="absolute top-0 left-2 w-4 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full opacity-80" />
          {/* Tail */}
          <div className="absolute -right-3 top-1 w-6 h-4 bg-gradient-to-r from-gray-600 to-gray-800 rounded-sm shadow-md" />
          {/* Vertical stabilizer */}
          <div className="absolute -right-2 -top-1 w-3 h-6 bg-gradient-to-b from-gray-500 to-gray-700 rounded-sm" />
        </div>

        {/* Enhanced Engine trails */}
        <motion.div
          className="absolute -right-12 top-2 w-16 h-2 bg-gradient-to-r from-orange-500 via-red-400 to-transparent rounded-full"
          animate={{
            opacity: [0.6, 1, 0.6],
            scaleX: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 0.3, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-10 top-2.5 w-12 h-1 bg-gradient-to-r from-yellow-400 to-transparent rounded-full"
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scaleX: [1, 1.5, 1],
          }}
          transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
        />

        {/* Propeller blur effect */}
        <motion.div
          className="absolute left-0 top-1 w-2 h-4 bg-gray-400 rounded-full opacity-60"
          animate={{ scaleY: [1, 0.2, 1] }}
          transition={{ duration: 0.1, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
