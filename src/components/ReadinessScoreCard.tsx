import React, { useState } from 'react';
import { NavigatorAnalysisResult } from '../types/navigator';
import { Target, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight, Sparkles } from 'lucide-react';

interface ReadinessScoreCardProps {
  analysis: NavigatorAnalysisResult;
}

export const ReadinessScoreCard: React.FC<ReadinessScoreCardProps> = ({ analysis }) => {
  const { readinessScore, targetRole, skillGapAnalysis } = analysis;
  const [simulatedSkills, setSimulatedSkills] = useState<Record<string, boolean>>({});

  // Compute simulated what-if readiness boost
  const simulatedBonus = Object.values(simulatedSkills).filter(Boolean).length * 8;
  const currentTotal = Math.min(100, readinessScore + simulatedBonus);

  const toggleSimulatedSkill = (skill: string) => {
    setSimulatedSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Readiness Score Dial */}
        <div className="lg:col-span-5 flex flex-col items-center sm:items-start">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Profile Readiness Score</span>
          </div>

          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
              {currentTotal}%
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-700">Target Role</span>
              <span className="text-sm font-bold text-indigo-600 truncate">{targetRole}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-700 rounded-full ${getScoreProgressColor(currentTotal)}`}
              style={{ width: `${currentTotal}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full text-xs text-slate-500 font-medium">
            <span>Academic Baseline</span>
            <span>Industry Benchmark (80%+)</span>
            <span>Job-Ready</span>
          </div>

          {simulatedBonus > 0 && (
            <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Simulated +{simulatedBonus}% boost from completed roadmap milestones</span>
            </div>
          )}
        </div>

        {/* Right Column: Key Metrics & What-If Simulator */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/50">
              <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Matched</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {skillGapAnalysis.matchedSkills.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Verified strengths</div>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200/80 bg-amber-50/50">
              <div className="flex items-center gap-1.5 text-amber-700 text-xs font-semibold mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Underdeveloped</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {skillGapAnalysis.underdevelopedSkills.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Needs practical depth</div>
            </div>

            <div className="p-3.5 rounded-xl border border-rose-200/80 bg-rose-50/50">
              <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold mb-1">
                <XCircle className="w-3.5 h-3.5" />
                <span>Missing</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
                {skillGapAnalysis.missingSkills.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Critical gaps to fill</div>
            </div>
          </div>

          {/* Interactive What-If Simulator */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600" />
                <span>What-If Skill Simulator (Click to preview score progress):</span>
              </span>
              <span className="text-[11px] text-slate-400">Interactive</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skillGapAnalysis.missingSkills.slice(0, 4).map((missing) => {
                const isChecked = Boolean(simulatedSkills[missing.skill]);
                return (
                  <button
                    key={missing.skill}
                    onClick={() => toggleSimulatedSkill(missing.skill)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                      isChecked
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span>{isChecked ? '✓' : '+'}</span>
                    <span>Acquire {missing.skill}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
