import type { SimulationResults } from '../utils/simulation';

interface StatsDisplayProps {
  results: SimulationResults | null;
  runNumber: number;
}

export function StatsDisplay({ results, runNumber }: StatsDisplayProps) {
  if (!results) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
            📊
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            Mission Results
          </h3>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <p className="text-gray-500">Launch a mission to see results</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white">
          📊
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Mission #{runNumber} Results
        </h3>
      </div>
      
      <div className="space-y-6">
        {/* Hit Rate - Main Metric */}
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            {results.hitPercentage.toFixed(1)}%
          </div>
          <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Mission Success Rate</div>
        </div>
        
        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="py-2 px-2 stat-card bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 glow-hit rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {results.hits}
            </div>
            <div className="text-sm font-semibold text-gray-600">Direct Hits</div>
            <div className="text-xs text-green-600 mt-1">🎯 On Target</div>
          </div>
          
          <div className="p-2 stat-card bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 glow-miss rounded-xl">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {results.misses}
            </div>
            <div className="text-sm font-semibold text-gray-600">Misses</div>
            <div className="text-xs text-red-600 mt-1">💥 Off Target</div>
          </div>
        </div>
        
        <div className="p-2 stat-card bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl">
          <div className="text-2xl font-bold text-gray-700 mb-1">
            {results.totalBombs}
          </div>
          <div className="text-sm font-semibold text-gray-600">Total Ordnance</div>
          <div className="text-xs text-gray-500 mt-1">💣 Deployed</div>
        </div>
        
        {/* Enhanced Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-gray-600">
            <span>Accuracy</span>
            <span>{results.hitPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 h-4 rounded-full transition-all duration-1000 shadow-lg"
              style={{ width: `${results.hitPercentage}%` }}
            />
          </div>
        </div>
        
        {/* Mission Assessment */}
        <div className={`p-4 rounded-xl border-2 ${
          results.hitPercentage >= 70 ? 'bg-green-50 border-green-200 text-green-800' :
          results.hitPercentage >= 40 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
          'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="text-center font-bold">
            {results.hitPercentage >= 70 ? '🏆 Excellent Mission!' :
             results.hitPercentage >= 40 ? '⚡ Good Performance' :
             '🎯 Needs Improvement'}
          </div>
        </div>
      </div>
    </div>
  );
}