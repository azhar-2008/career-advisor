import React from 'react';
import { SAMPLE_STUDENT_PROFILES, PresetStudentProfile } from '../data/industryRoles';
import { GraduationCap, ArrowRight, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSelectPreset: (preset: PresetStudentProfile) => void;
  onExploreCustom: () => void;
  selectedPresetId?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSelectPreset,
  onExploreCustom,
  selectedPresetId
}) => {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden rounded-2xl mb-8 border border-slate-800 shadow-xl">
      {/* Background Hero Banner with measured contrast scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_career_nav_1791906423343.jpg"
          alt="Modern university digital innovation lab with collaborating students"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/70" />
      </div>

      <div className="relative z-10 p-6 md:p-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-3">
              <GraduationCap className="w-4 h-4" />
              <span>University-to-Industry Academic Transition Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              Bridge the Gap Between Coursework & Industry Expectations
            </h1>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl mb-6">
              Parse your academic transcript and resume against real-world tech role standards.
              Uncover matched strengths, underdeveloped coursework, critical missing tools,
              and receive an actionable portfolio project roadmap.
            </p>

            {/* Quick 1-Click Student Presets */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Select a University Student Benchmark to Test Instantly:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                {SAMPLE_STUDENT_PROFILES.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onSelectPreset(preset)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/30 border-indigo-400 shadow-md ring-1 ring-indigo-400'
                          : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white truncate">{preset.name}</span>
                        <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded">
                          {preset.avatarSeed}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 truncate font-medium">{preset.targetRoleId.replace('-', ' ').toUpperCase()}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">{preset.major}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Advisor Snapshot & Value Anchor */}
          <div className="lg:col-span-4 flex flex-col justify-center">
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 backdrop-blur-sm shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/src/assets/images/mentor_advisor_1791906423194.jpg"
                  alt="Avengers Career Advisor"
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500 shrink-0"
                />
                <div>
                  <h2 className="text-sm font-semibold text-white">Avengers Career Advisor</h2>
                  <div className="text-xs text-slate-400">Industry Alignment Protocol</div>
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 border-t border-slate-700/60 pt-3">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Deep parsing of Hard Skills, Soft Skills & Academic Courses</span>
                </div>
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Calculates role-specific Readiness Score (0–100%)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Delivers 3-phase roadmap and 2–3 portfolio project blueprints</span>
                </div>
              </div>

              <button
                onClick={onExploreCustom}
                className="mt-4 w-full py-2 px-3 text-xs font-semibold text-center text-slate-200 hover:text-white bg-slate-700/70 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Paste Your Own Resume Text</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
