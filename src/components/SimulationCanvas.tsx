import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { SimulationResults } from '../utils/simulation';
import { getPolygonBounds, scaleToViewport } from '../utils/geometry';
import { Bomb } from './Bomb';
import { Aircraft } from './Aircraft';

interface SimulationCanvasProps {
  results: SimulationResults | null;
  depotCoords: [number, number][];
  isRunning: boolean;
  onSimulationComplete: () => void;
  currentParams: { sigmaX: number; sigmaY: number; numBombers: number };
}

export function SimulationCanvas({ 
  results, 
  depotCoords, 
  isRunning,
  onSimulationComplete,
  currentParams
}: SimulationCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 1000 });
  const [animatingBombs, setAnimatingBombs] = useState<number>(0);
  const [showCoordinates, setShowCoordinates] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [lastMousePos, setLastMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset animation counter when new simulation starts
  useEffect(() => {
    if (isRunning && results) {
      setAnimatingBombs(0);
    }
  }, [isRunning, results]);

  // Update canvas size on resize
  useEffect(() => {
    const updateSize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Handle bomb animation completion
  useEffect(() => {
    if (results && animatingBombs === results.bombs.length && animatingBombs > 0 && isRunning) {
      const timer = setTimeout(() => {
        onSimulationComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [animatingBombs, results, onSimulationComplete, isRunning]);

  // Zoom and pan functionality
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = 0.1;
      const newZoom = e.deltaY > 0 
        ? Math.max(0.1, zoomLevel - zoomFactor)
        : Math.min(5, zoomLevel + zoomFactor);
      setZoomLevel(newZoom);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      setPanOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoomLevel, isDragging, lastMousePos]);

  // Zoom control functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(5, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(0.1, prev - 0.2));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const bounds = getPolygonBounds(depotCoords);
  
  // Scale depot coordinates to canvas with zoom
  const scaledDepotCoords = depotCoords.map(([x, y]) => {
    const scaled = scaleToViewport(
      { x, y }, 
      bounds, 
      canvasSize.width, 
      canvasSize.height, 
      100,
      zoomLevel,
      panOffset
    );
    return [scaled.x, scaled.y] as [number, number];
  });

  // Create SVG path for depot polygon
  const depotPath = scaledDepotCoords
    .map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ') + ' Z';

  // Scale aiming point (origin) with zoom
  const aimingPoint = scaleToViewport(
    { x: 0, y: 0 }, 
    bounds, 
    canvasSize.width, 
    canvasSize.height, 
    100,
    zoomLevel,
    panOffset
  );

  return (
    <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center text-2xl">
            🎯
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-shadow">
              Combat Theater
            </h2>
            <p className="text-slate-300 text-sm">
              Ammunition Depot Target • Aiming Point: Origin (0, 0)
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Zoom Controls */}
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm font-semibold transition-all duration-200"
                title="Zoom Out"
              >
                🔍−
              </button>
              <span className="text-white text-xs font-semibold px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-sm font-semibold transition-all duration-200"
                title="Zoom In"
              >
                🔍+
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-white text-xs font-semibold transition-all duration-200"
                title="Reset Zoom"
              >
                ↺
              </button>
            </div>

            {/* Coordinate system controls */}
            <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${
              showCoordinates 
                ? 'bg-green-500/20 text-green-200 border border-green-400/30' 
                : 'bg-red-500/20 text-red-200 border border-red-400/30'
            }`}>
              {showCoordinates ? '📐 Grid ON' : '📐 Grid OFF'}
            </div>
            <button
              onClick={() => setShowCoordinates(!showCoordinates)}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-semibold transition-all duration-200 border border-white/20"
            >
              {showCoordinates ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className={`relative w-full h-[70vh] min-h-[600px] bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ userSelect: 'none' }}
      >
        {/* Enhanced coordinate system */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            {/* Fine grid pattern */}
            <pattern id="fineGrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#f3f4f6" strokeWidth="0.5"/>
            </pattern>
            {/* Grid pattern */}
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
            {/* Major grid pattern */}
            <pattern id="majorGrid" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#9ca3af" strokeWidth="2"/>
            </pattern>
          </defs>
          
          {/* Background grids - conditional visibility */}
          {showCoordinates && (
            <>
              <rect width="100%" height="100%" fill="url(#fineGrid)" opacity="0.2" />
              <rect width="100%" height="100%" fill="url(#grid)" opacity="0.4" />
              <rect width="100%" height="100%" fill="url(#majorGrid)" opacity="0.6" />
            </>
          )}
          
          {/* Coordinate axes */}
          <line 
            x1={aimingPoint.x} 
            y1="0" 
            x2={aimingPoint.x} 
            y2={canvasSize.height} 
            stroke="#6b7280" 
            strokeWidth="3" 
            strokeDasharray="8,4"
            opacity="0.8"
          />
          <line 
            x1="0" 
            y1={aimingPoint.y} 
            x2={canvasSize.width} 
            y2={aimingPoint.y} 
            stroke="#6b7280" 
            strokeWidth="3" 
            strokeDasharray="8,4"
            opacity="0.8"
          />
          
          {/* Axis labels */}
          <text 
            x={aimingPoint.x + 15} 
            y="25" 
            fill="#374151" 
            fontSize="14" 
            fontWeight="bold"
            className="drop-shadow-sm"
          >
            +Y (North)
          </text>
          <text 
            x={canvasSize.width - 100} 
            y={aimingPoint.y - 15} 
            fill="#374151" 
            fontSize="14" 
            fontWeight="bold"
            className="drop-shadow-sm"
          >
            +X (East)
          </text>
          <text 
            x={aimingPoint.x + 15} 
            y={canvasSize.height - 15} 
            fill="#374151" 
            fontSize="14" 
            fontWeight="bold"
            className="drop-shadow-sm"
          >
            -Y (South)
          </text>
          <text 
            x="15" 
            y={aimingPoint.y - 15} 
            fill="#374151" 
            fontSize="14" 
            fontWeight="bold"
            className="drop-shadow-sm"
          >
            -X (West)
          </text>
        </svg>

        {/* Target polygon and coordinate markers */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Target polygon */}
          <path
            d={depotPath}
            fill="rgba(239, 68, 68, 0.15)"
            stroke="#dc2626"
            strokeWidth="3"
            strokeDasharray="10,5"
          />
          
          {/* Coordinate markers for each vertex */}
          {scaledDepotCoords.map(([x, y], index) => {
            const originalCoord = depotCoords[index];
            return (
              <g key={index}>
                {/* Vertex marker */}
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill="#dc2626"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                {/* Coordinate label - conditional */}
                {showCoordinates && (
                  <text
                    x={x + 10}
                    y={y - 10}
                    fill="#dc2626"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    ({originalCoord[0]}, {originalCoord[1]})
                  </text>
                )}
                {/* Vertex number */}
                <text
                  x={x}
                  y={y + 4}
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {index + 1}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Enhanced Aiming point */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: aimingPoint.x - 12,
            top: aimingPoint.y - 12
          }}
        >
          {/* Crosshair */}
          <svg width="24" height="24" className="absolute">
            <line x1="0" y1="12" x2="24" y2="12" stroke="#eab308" strokeWidth="2" />
            <line x1="12" y1="0" x2="12" y2="24" stroke="#eab308" strokeWidth="2" />
            <circle cx="12" cy="12" r="8" fill="none" stroke="#eab308" strokeWidth="2" strokeDasharray="2,2" />
          </svg>
          
          {/* Center dot */}
          <motion.div
            className="absolute top-2 left-2 w-2 h-2 bg-yellow-500 rounded-full border border-yellow-600"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Coordinate label */}
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-yellow-800 whitespace-nowrap border border-yellow-300">
            Origin (0, 0)
          </div>
        </motion.div>

        {/* Aircraft */}
        <Aircraft 
          isActive={isRunning} 
          viewportWidth={canvasSize.width}
          viewportHeight={canvasSize.height}
        />

        {/* Bombs with coordinate display */}
        {results?.bombs.map((bomb) => {
          const scaledPosition = scaleToViewport(
            { x: bomb.x, y: bomb.y },
            bounds,
            canvasSize.width,
            canvasSize.height,
            100,
            zoomLevel,
            panOffset
          );

          return (
            <div key={bomb.id}>
              <Bomb
                bomb={bomb}
                scaledPosition={scaledPosition}
                onAnimationComplete={() => {
                  setAnimatingBombs(prev => prev + 1);
                }}
              />
              
              {/* Coordinate label for impact point - conditional */}
              {showCoordinates && (
                <motion.div
                  className="absolute pointer-events-none text-xs font-mono"
                  style={{
                    left: scaledPosition.x + 8,
                    top: scaledPosition.y + 8
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 0.8, scale: 1 }}
                  transition={{ 
                    delay: bomb.id * 0.2 + 2.2,
                    duration: 0.3 
                  }}
                >
                  <div className={`px-2 py-1 rounded text-white text-xs shadow-lg ${
                    bomb.isHit ? 'bg-green-600' : 'bg-red-600'
                  }`}>
                    ({Math.round(bomb.x)}, {Math.round(bomb.y)})
                  </div>
                </motion.div>
              )}
            </div>
          );
        })}

        {/* Enhanced Legend */}
        <div className="absolute bottom-4 left-4 glass-card rounded-xl p-4 text-xs shadow-lg">
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Legend
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm glow-hit"></div>
              <span className="font-semibold text-green-700">Direct Hit</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-500 rounded-full shadow-sm glow-miss"></div>
              <span className="font-semibold text-red-700">Miss</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-yellow-500 rounded-full shadow-sm animate-pulse"></div>
              <span className="font-semibold text-yellow-700">Target Center</span>
            </div>
          </div>
        </div>

        {/* Enhanced Coordinate Info */}
        <div className="absolute bottom-4 right-4 glass-card rounded-xl p-4 text-xs shadow-lg max-w-xs">
          <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
            Mission Data
          </h4>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between gap-4">
              <span>σₓ (Horizontal):</span>
              <span className="font-bold text-orange-600">{currentParams.sigmaX}m</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>σᵧ (Vertical):</span>
              <span className="font-bold text-green-600">{currentParams.sigmaY}m</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Ordnance:</span>
              <span className="font-bold text-blue-600">{results?.totalBombs || currentParams.numBombers}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Target Points:</span>
              <span className="font-bold text-red-600">{depotCoords.length}</span>
            </div>
          </div>
          
          <div className="mt-3 pt-2 border-t border-gray-200">
            <h5 className="font-semibold text-gray-800 mb-1">📐 View Controls</h5>
            <div className="text-gray-600 space-y-1">
              <div>• Zoom: {Math.round(zoomLevel * 100)}%</div>
              <div>• Mouse wheel: Zoom in/out</div>
              <div>• Click & drag: Pan view</div>
              <div>• Origin (0,0) = Aiming Point</div>
              <div>• Units in meters</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}