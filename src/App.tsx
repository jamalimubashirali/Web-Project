import { useState } from "react";
import { SimulationCanvas } from "./components/SimulationCanvas";
import { ControlPanel } from "./components/ControlPanel";
import { StatsDisplay } from "./components/StatsDisplay";
import { TargetEditor } from "./components/TargetEditor";
import { OperationalRange } from "./components/OperationalRange";
import {
  type SimulationParams,
  type SimulationResults,
  runSimulation,
  DEFAULT_DEPOT_COORDS,
} from "./utils/simulation";

function App() {
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [runNumber, setRunNumber] = useState(0);

  const defaultParams: SimulationParams = {
    numBombers: 10,
    sigmaX: 500,
    sigmaY: 350,
    depotCoords: DEFAULT_DEPOT_COORDS,
  };

  const [currentParams, setCurrentParams] =
    useState<SimulationParams>(defaultParams);
  const [targetCoords, setTargetCoords] =
    useState<[number, number][]>(DEFAULT_DEPOT_COORDS);

  const handleStartSimulation = (params: SimulationParams) => {
    setIsRunning(true);
    const updatedParams = { ...params, depotCoords: targetCoords };
    setCurrentParams(updatedParams);

    // Run simulation
    const simulationResults = runSimulation(updatedParams);
    setResults(simulationResults);
    setRunNumber((prev) => prev + 1);
  };

  const handleSigmaChange = (sigmaX: number, sigmaY: number) => {
    setCurrentParams((prev) => ({ ...prev, sigmaX, sigmaY }));
  };

  const handleSimulationComplete = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setResults(null);
    setIsRunning(false);
    setRunNumber(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass-card border-b border-white/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
              🎯
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent text-shadow">
                Bomber Squadron Simulation
              </h1>
              <p className="text-gray-600 mt-1 text-lg">
                Interactive Monte Carlo simulation of bombing accuracy analysis
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Configuration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TargetEditor
            coordinates={targetCoords}
            onCoordinatesChange={setTargetCoords}
            isRunning={isRunning}
          />
          <OperationalRange
            sigmaX={currentParams.sigmaX}
            sigmaY={currentParams.sigmaY}
            onSigmaChange={handleSigmaChange}
            isRunning={isRunning}
          />
        </div>

        {/* Full-Width Simulation Canvas */}
        <div className="mb-8 -mx-6">
          <ControlPanel
            onStartSimulation={handleStartSimulation}
            onReset={handleReset}
            isRunning={isRunning}
            currentParams={currentParams}
          />
          <SimulationCanvas
            results={results}
            depotCoords={targetCoords}
            isRunning={isRunning}
            onSimulationComplete={handleSimulationComplete}
            currentParams={currentParams}
          />
        </div>

        {/* Control Panel and Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatsDisplay results={results} runNumber={runNumber} />

          {/* Quick Mission Summary */}
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                📋
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Mission Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-medium">Target Type</span>
                <span className="text-blue-700 font-bold">
                  {targetCoords.length === 6
                    ? "Ammunition Depot"
                    : targetCoords.length === 4
                    ? "Military Base"
                    : targetCoords.length === 12
                    ? "Airfield"
                    : "Custom Target"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-medium">
                  Mission Profile
                </span>
                <span className="text-orange-700 font-bold">
                  {currentParams.sigmaX <= 200
                    ? "Precision Strike"
                    : currentParams.sigmaX <= 600
                    ? "Standard Artillery"
                    : currentParams.sigmaX <= 900
                    ? "Area Bombardment"
                    : "Long Range"}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-medium">Squadron Size</span>
                <span className="text-green-700 font-bold">
                  {currentParams.numBombers} Bombers
                </span>
              </div>

              {results && (
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-700 font-medium">
                    Last Mission
                  </span>
                  <span className="text-purple-700 font-bold">
                    {results.hitPercentage.toFixed(1)}% Success
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="mt-12 glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              📋
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              Simulation Overview
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Problem Setup
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Irregular polygon ammunition depot target</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Aiming point at coordinate origin (0, 0)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Normal distribution impact pattern</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">▸</span>
                  <span>Default: σₓ = 500m, σᵧ = 350m</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Features
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">▸</span>
                  <span>Animated aircraft and bomb drops</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">▸</span>
                  <span>Real-time hit/miss detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">▸</span>
                  <span>Interactive parameter adjustment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">▸</span>
                  <span>Visual explosion and impact effects</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Technology
              </h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>React 18+ with TypeScript</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>Framer Motion animations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>TailwindCSS styling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">▸</span>
                  <span>Monte Carlo simulation method</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-card border-t border-white/30 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Built with</span>
            <span className="font-semibold text-blue-600">React</span>
            <span>+</span>
            <span className="font-semibold text-blue-600">TypeScript</span>
            <span>+</span>
            <span className="font-semibold text-cyan-600">TailwindCSS</span>
            <span>+</span>
            <span className="font-semibold text-purple-600">Framer Motion</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Interactive Monte Carlo Simulation • Educational Purpose
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
