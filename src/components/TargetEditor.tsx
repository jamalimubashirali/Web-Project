import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TargetEditorProps {
  coordinates: [number, number][];
  onCoordinatesChange: (coords: [number, number][]) => void;
  isRunning: boolean;
}

interface PresetTarget {
  name: string;
  description: string;
  coordinates: [number, number][];
  icon: string;
}

const PRESET_TARGETS: PresetTarget[] = [
  {
    name: "Ammunition Depot",
    description: "Original irregular polygon depot",
    icon: "🏭",
    coordinates: [
      [-504, 198],
      [-504, -200],
      [-250, -400],
      [552, 18],
      [552, 950],
      [-200, 950]
    ]
  },
  {
    name: "Military Base",
    description: "Rectangular military compound",
    icon: "🏗️",
    coordinates: [
      [-600, -400],
      [600, -400],
      [600, 400],
      [-600, 400]
    ]
  },
  {
    name: "Airfield",
    description: "Cross-shaped runway complex",
    icon: "✈️",
    coordinates: [
      [-800, -100],
      [-200, -100],
      [-200, -300],
      [200, -300],
      [200, -100],
      [800, -100],
      [800, 100],
      [200, 100],
      [200, 300],
      [-200, 300],
      [-200, 100],
      [-800, 100]
    ]
  },
  {
    name: "Harbor",
    description: "L-shaped port facility",
    icon: "⚓",
    coordinates: [
      [-700, -200],
      [300, -200],
      [300, 200],
      [-200, 200],
      [-200, 600],
      [-700, 600]
    ]
  }
];

export function TargetEditor({ coordinates, onCoordinatesChange, isRunning }: TargetEditorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempCoords, setTempCoords] = useState<{ x: string; y: string }>({ x: '', y: '' });

  const handlePresetSelect = (preset: PresetTarget) => {
    onCoordinatesChange(preset.coordinates);
    setIsExpanded(false);
  };

  const handleCreateCustomMap = () => {
    // Start with a basic triangle for custom creation
    const customStartCoords: [number, number][] = [
      [-300, -200],
      [300, -200],
      [0, 400]
    ];
    onCoordinatesChange(customStartCoords);
    // Keep expanded to allow immediate editing
  };

  const handleAddPoint = () => {
    const newCoords: [number, number][] = [...coordinates, [0, 0]];
    onCoordinatesChange(newCoords);
    setEditingIndex(newCoords.length - 1);
    setTempCoords({ x: '0', y: '0' });
  };

  const handleEditPoint = (index: number) => {
    setEditingIndex(index);
    setTempCoords({
      x: coordinates[index][0].toString(),
      y: coordinates[index][1].toString()
    });
  };

  const handleSavePoint = () => {
    if (editingIndex !== null) {
      const newCoords = [...coordinates];
      newCoords[editingIndex] = [parseFloat(tempCoords.x) || 0, parseFloat(tempCoords.y) || 0];
      onCoordinatesChange(newCoords);
      setEditingIndex(null);
    }
  };

  const handleDeletePoint = (index: number) => {
    if (coordinates.length > 3) { // Minimum 3 points for a polygon
      const newCoords = coordinates.filter((_, i) => i !== index);
      onCoordinatesChange(newCoords);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setTempCoords({ x: '', y: '' });
  };

  const handleClearAll = () => {
    // Start with a basic triangle
    const basicTriangle: [number, number][] = [
      [-200, -200],
      [200, -200],
      [0, 300]
    ];
    onCoordinatesChange(basicTriangle);
  };

  const handleShapeTemplate = (shape: string) => {
    let templateCoords: [number, number][] = [];
    
    switch (shape) {
      case 'triangle':
        templateCoords = [
          [-300, -200],
          [300, -200],
          [0, 400]
        ];
        break;
      case 'square':
        templateCoords = [
          [-400, -400],
          [400, -400],
          [400, 400],
          [-400, 400]
        ];
        break;
      case 'pentagon':
        const radius = 350;
        templateCoords = Array.from({ length: 5 }, (_, i) => {
          const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2; // Start from top
          return [
            Math.round(radius * Math.cos(angle)),
            Math.round(radius * Math.sin(angle))
          ] as [number, number];
        });
        break;
      case 'star':
        const outerRadius = 400;
        const innerRadius = 200;
        templateCoords = [];
        for (let i = 0; i < 10; i++) {
          const angle = (i * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          templateCoords.push([
            Math.round(radius * Math.cos(angle)),
            Math.round(radius * Math.sin(angle))
          ]);
        }
        break;
    }
    
    onCoordinatesChange(templateCoords);
  };

  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm">
            🎯
          </div>
          <h3 className="text-lg font-bold text-gray-800">Target Config</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isRunning}
          className={`px-3 py-1 rounded-lg font-semibold text-sm transition-all duration-200 ${
            isRunning
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
          }`}
        >
          {isExpanded ? 'Hide' : 'Edit'}
        </button>
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
            <div className="space-y-6 pt-4 border-t border-gray-200">
              {/* Preset Targets */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Preset Targets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_TARGETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => handlePresetSelect(preset)}
                      disabled={isRunning}
                      className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                        isRunning
                          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{preset.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{preset.name}</div>
                          <div className="text-xs text-gray-600">{preset.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Create Custom Map Option */}
                  <button
                    onClick={() => handleCreateCustomMap()}
                    disabled={isRunning}
                    className={`p-3 rounded-lg border-2 border-dashed text-left transition-all duration-200 ${
                      isRunning
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-300 hover:border-purple-400 hover:bg-gradient-to-br hover:from-purple-100 hover:to-indigo-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <div className="font-semibold text-purple-800">Create Custom Map</div>
                        <div className="text-xs text-purple-600">Design your own target from scratch</div>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Coordinates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Custom Map Builder ({coordinates.length} points)
                  </h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleClearAll()}
                      disabled={isRunning}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isRunning
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      🗑️ Clear All
                    </button>
                    <button
                      onClick={handleAddPoint}
                      disabled={isRunning}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                        isRunning
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      + Add Point
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {coordinates.map((coord, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-600 w-8">
                        {index + 1}.
                      </span>
                      
                      {editingIndex === index ? (
                        <>
                          <div className="flex items-center gap-2 flex-1">
                            <div className="flex items-center gap-1">
                              <label className="text-xs text-gray-600">X:</label>
                              <input
                                type="number"
                                value={tempCoords.x}
                                onChange={(e) => setTempCoords(prev => ({ ...prev, x: e.target.value }))}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="X"
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <label className="text-xs text-gray-600">Y:</label>
                              <input
                                type="number"
                                value={tempCoords.y}
                                onChange={(e) => setTempCoords(prev => ({ ...prev, y: e.target.value }))}
                                className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                                placeholder="Y"
                              />
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={handleSavePoint}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              ✓
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 text-sm text-gray-700">
                            ({coord[0]}, {coord[1]})
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditPoint(index)}
                              disabled={isRunning}
                              className={`px-2 py-1 rounded text-xs ${
                                isRunning
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-500 text-white hover:bg-blue-600'
                              }`}
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeletePoint(index)}
                              disabled={isRunning || coordinates.length <= 3}
                              className={`px-2 py-1 rounded text-xs ${
                                isRunning || coordinates.length <= 3
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-red-500 text-white hover:bg-red-600'
                              }`}
                            >
                              🗑️
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Shape Templates */}
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Quick Shape Templates
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleShapeTemplate('triangle')}
                    disabled={isRunning}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isRunning
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    🔺 Triangle
                  </button>
                  <button
                    onClick={() => handleShapeTemplate('square')}
                    disabled={isRunning}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isRunning
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    ⬜ Square
                  </button>
                  <button
                    onClick={() => handleShapeTemplate('pentagon')}
                    disabled={isRunning}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isRunning
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    ⬟ Pentagon
                  </button>
                  <button
                    onClick={() => handleShapeTemplate('star')}
                    disabled={isRunning}
                    className={`p-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isRunning
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    ⭐ Star
                  </button>
                </div>
              </div>

              {/* Coordinate Range Info */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">📏 Coordinate Guidelines</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Coordinates are in meters from origin (0, 0)</li>
                  <li>• Recommended range: -2000m to +2000m</li>
                  <li>• Minimum 3 points required for polygon</li>
                  <li>• Points should form a closed polygon shape</li>
                  <li>• Use shape templates as starting points for custom designs</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}