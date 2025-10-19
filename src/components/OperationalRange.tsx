import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OperationalRangeProps {
  sigmaX: number;
  sigmaY: number;
  onSigmaChange: (sigmaX: number, sigmaY: number) => void;
  isRunning: boolean;
}

interface RangePreset {
  name: string;
  description: string;
  sigmaX: number;
  sigmaY: number;
  icon: string;
  accuracy: string;
}

const RANGE_PRESETS: RangePreset[] = [
  {
    name: "Precision Strike",
    description: "High-precision guided munitions",
    icon: "🎯",
    sigmaX: 150,
    sigmaY: 100,
    accuracy: "Very High"
  },
  {
    name: "Standard Artillery",
    description: "Conventional artillery bombardment",
    icon: "💥",
    sigmaX: 500,
    sigmaY: 350,
    accuracy: "Medium"
  },
  {
    name: "Area Bombardment",
    description: "Wide-area saturation bombing",
    icon: "💣",
    sigmaX: 800,
    sigmaY: 600,
    accuracy: "Low"
  },
  {
    name: "Long Range Strike",
    description: "Extended range with reduced accuracy",
    icon: "🚀",
    sigmaX: 1200,
    sigmaY: 900,
    accuracy: "Very Low"
  }
];

export function OperationalRange({ sigmaX, sigmaY, onSigmaChange, isRunning }: OperationalRangeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [customSigmaX, setCustomSigmaX] = useState(sigmaX);
  const [customSigmaY, setCustomSigmaY] = useState(sigmaY);

  const handlePresetSelect = (preset: RangePreset) => {
    setCustomSigmaX(preset.sigmaX);
    setCustomSigmaY(preset.sigmaY);
    onSigmaChange(preset.sigmaX, preset.sigmaY);
  };

  const handleCustomChange = () => {
    onSigmaChange(customSigmaX, customSigmaY);
  };

  const calculateCEP = (sx: number, sy: number) => {
    // Circular Error Probable (50% of shots within this radius)
    return Math.sqrt(sx * sx + sy * sy) * 0.59;
  };

  const getAccuracyLevel = (cep: number) => {
    if (cep < 200) return { level: "Excellent", color: "text-green-600", bg: "bg-green-100" };
    if (cep < 400) return { level: "Good", color: "text-blue-600", bg: "bg-blue-100" };
    if (cep < 700) return { level: "Fair", color: "text-yellow-600", bg: "bg-yellow-100" };
    return { level: "Poor", color: "text-red-600", bg: "bg-red-100" };
  };

  const currentCEP = calculateCEP(sigmaX, sigmaY);
  const accuracy = getAccuracyLevel(currentCEP);

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-sm">
            📡
          </div>
          <h3 className="text-lg font-bold text-gray-800">Parameters</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isRunning}
          className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isRunning
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
          }`}
        >
          {isExpanded ? 'Hide' : 'Config'}
        </button>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center p-2 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="text-lg font-bold text-orange-600">{sigmaX}m</div>
          <div className="text-xs text-gray-600">σₓ</div>
        </div>
        <div className="text-center p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="text-lg font-bold text-green-600">{sigmaY}m</div>
          <div className="text-xs text-gray-600">σᵧ</div>
        </div>
      </div>

      {/* Accuracy Assessment */}
      <div className={`p-3 rounded-lg border ${accuracy.bg} border-opacity-50`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`font-bold text-sm ${accuracy.color}`}>
              {accuracy.level}
            </div>
            <div className="text-xs text-gray-600">
              CEP: {currentCEP.toFixed(0)}m
            </div>
          </div>
          <div className="text-lg">
            {accuracy.level === "Excellent" ? "🏆" : 
             accuracy.level === "Good" ? "⭐" :
             accuracy.level === "Fair" ? "⚡" : "⚠️"}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-6 pt-6 border-t border-gray-200 mt-4">
              {/* Preset Ranges */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  Mission Profiles
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {RANGE_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset)}
                      disabled={isRunning}
                      className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                        isRunning
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{preset.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-800">{preset.name}</div>
                            <div className="text-sm text-gray-600">{preset.description}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-700">
                            σₓ: {preset.sigmaX}m, σᵧ: {preset.sigmaY}m
                          </div>
                          <div className="text-xs text-gray-500">
                            Accuracy: {preset.accuracy}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Range Configuration */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Custom Configuration
                </h4>
                
                <div className="space-y-4">
                  {/* Sigma X Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">
                        Horizontal Spread (σₓ)
                      </label>
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-bold">
                        {customSigmaX}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="25"
                      value={customSigmaX}
                      onChange={(e) => setCustomSigmaX(parseInt(e.target.value))}
                      disabled={isRunning}
                      className="slider-modern"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>50m (Precision)</span>
                      <span>2000m (Area)</span>
                    </div>
                  </div>

                  {/* Sigma Y Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700">
                        Vertical Spread (σᵧ)
                      </label>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                        {customSigmaY}m
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="2000"
                      step="25"
                      value={customSigmaY}
                      onChange={(e) => setCustomSigmaY(parseInt(e.target.value))}
                      disabled={isRunning}
                      className="slider-modern"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>50m (Precision)</span>
                      <span>2000m (Area)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCustomChange}
                    disabled={isRunning}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                      isRunning
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    Apply Custom Settings
                  </button>
                </div>
              </div>

              {/* Technical Information */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h5 className="font-semibold text-gray-800 mb-2">📐 Technical Notes</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• σₓ, σᵧ: Standard deviation of impact distribution</li>
                  <li>• CEP: Circular Error Probable (50% hit probability radius)</li>
                  <li>• Lower values = higher precision, smaller spread</li>
                  <li>• Real-world factors: weather, range, weapon type</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}