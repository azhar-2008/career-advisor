import React, { useState } from 'react';
import { RoadmapPhase } from '../types/navigator';
import { Map, CheckSquare, Square, Calendar, ArrowRight, Target } from 'lucide-react';

interface CareerRoadmapViewProps {
  roadmap: RoadmapPhase[];
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ roadmap }) => {
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const totalActions = roadmap.reduce((acc, p) => acc + p.actionItems.length, 0);
  const completedCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = totalActions > 0 ? Math.round((completedCount / totalActions) * 100) : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Map className="w-5 h-5 text-indigo-600" />
            <span>Step-by-Step Career Roadmap</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Structured 3-phase execution path to transition from academic concepts to industry hireability.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <div className="text-xs font-semibold text-slate-700">
            Roadmap Progress: <span className="font-mono text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phased Roadmap Timeline */}
      <div className="space-y-6">
        {roadmap.map((phase) => {
          const isPhase1 = phase.phaseNumber === 1;
          const isPhase2 = phase.phaseNumber === 2;
          const isPhase3 = phase.phaseNumber === 3;

          const badgeColor = isPhase1
            ? 'bg-blue-50 text-blue-700 border-blue-200'
            : isPhase2
            ? 'bg-purple-50 text-purple-700 border-purple-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200';

          return (
            <div
              key={phase.phaseNumber}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-5 transition-all hover:border-slate-300"
            >
              {/* Phase Title & Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200/80 gap-2">
                <div className="flex items-center gap-3">
                  <div className={`text-xs font-bold px-2.5 py-1 rounded-md border font-mono ${badgeColor}`}>
                    Phase {phase.phaseNumber}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{phase.phaseName}</h3>
                    <div className="text-xs text-indigo-700 flex items-center gap-1 mt-0.5 font-medium">
                      <Target className="w-3.5 h-3.5" />
                      <span>Target: {phase.targetFocus}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est. {phase.estimatedWeeks} Weeks</span>
                </div>
              </div>

              {/* Action Items with Interactive Checkboxes */}
              <div className="space-y-2.5">
                <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                  Action Items:
                </div>
                {phase.actionItems.map((item, idx) => {
                  const key = `p${phase.phaseNumber}_item${idx}`;
                  const isDone = Boolean(completedItems[key]);

                  return (
                    <button
                      key={idx}
                      onClick={() => toggleItem(key)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-50/60 border-emerald-200 text-slate-500 line-through'
                          : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0 text-indigo-600">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <div className="text-xs leading-relaxed font-medium">
                        {item}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
