import { useState } from 'react';
import type { SimulationParams } from '../utils/simulation';

interface ControlPanelProps {
  onStartSimulation: (params: SimulationParams) => void;
  onReset: () => void;
  isRunning: boolean;
  currentParams: SimulationParams;
}

export function ControlPanel({ 
  onStartSimulation, 
  onReset, 
  isRunning, 
  currentParams 
}: ControlPanelProps) {
  const [numBombers, setNumBombers] = useState(currentParams.numBombers);

  const handleStart = () => {
    onStartSimulation({
      ...currentParams,
      numBombers
    });
  };

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm">
          ⚙️
        </div>
        <h3 className="text-lg font-bold text-gray-800">
          Mission Control
        </h3>
      </div>
      
      <div className="space-y-4">
        {/* Number of Bombers */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Squadron Size
            </label>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
              {numBombers} bombers
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={numBombers}
            onChange={(e) => setNumBombers(parseInt(e.target.value))}
            disabled={isRunning}
            className="slider-modern"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>50</span>
          </div>
        </div>

        {/* Mission Readiness Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Mission Readiness
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white rounded-lg p-2 text-center border">
              <div className="font-bold text-orange-600">{currentParams.sigmaX}m</div>
              <div className="text-gray-600">σₓ Range</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center border">
              <div className="font-bold text-green-600">{currentParams.sigmaY}m</div>
              <div className="text-gray-600">σᵧ Range</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center border">
              <div className="font-bold text-blue-600">{currentParams.depotCoords.length}</div>
              <div className="text-gray-600">Target Points</div>
            </div>
            <div className="bg-white rounded-lg p-2 text-center border">
              <div className="font-bold text-purple-600">✓</div>
              <div className="text-gray-600">Ready</div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
              isRunning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'gradient-button shadow-lg hover:shadow-2xl'
            }`}
          >
            {isRunning ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                In Progress...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                🚀 Launch Mission
              </div>
            )}
          </button>
          
          <button
            onClick={onReset}
            disabled={isRunning}
            className={`w-full py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
              isRunning
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'danger-button'
            }`}
          >
            🔄 Reset
          </button>
        </div>
      </div>
    </div>
  );
}