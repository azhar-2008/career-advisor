import React, { useState } from 'react';
import { TargetRoleBenchmark } from '../types/navigator';
import { INDUSTRY_ROLES } from '../data/industryRoles';
import { Upload, FileText, Briefcase, User, GraduationCap, Play, RefreshCw, Sliders } from 'lucide-react';

interface ProfileInputStudioProps {
  cvText: string;
  setCvText: (text: string) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  targetRole: string;
  setTargetRole: (role: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const ProfileInputStudio: React.FC<ProfileInputStudioProps> = ({
  cvText,
  setCvText,
  studentName,
  setStudentName,
  targetRole,
  setTargetRole,
  onAnalyze,
  isLoading
}) => {
  const [showAdvancedOverride, setShowAdvancedOverride] = useState(false);
  const [roleOverride, setRoleOverride] = useState('');

  const selectedBenchmark = INDUSTRY_ROLES.find(r => r.title === targetRole) || INDUSTRY_ROLES[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCvText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span>Profile & Coursework Studio</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Provide student academic history, completed courses, and project experience to benchmark against industry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>Upload .txt / .md</span>
            <input
              type="file"
              accept=".txt,.md,.rtf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Metadata & Target Role */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Student Name</span>
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Industry Role</span>
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
            >
              {INDUSTRY_ROLES.map((role) => (
                <option key={role.id} value={role.title}>
                  {role.title}
                </option>
              ))}
            </select>
          </div>

          {/* Role Snapshot & Industry Expectations */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-2.5">
            <div className="flex items-center justify-between text-slate-900 font-semibold">
              <span>Standard Role Expectations:</span>
              <span className="text-[11px] text-emerald-700 font-mono">{selectedBenchmark.demandTrend}</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {selectedBenchmark.shortDescription}
            </p>
            <div className="pt-2 border-t border-slate-200 text-slate-500 space-y-1 text-[11px]">
              <div>
                <span className="font-semibold text-slate-700">Core Stack: </span>
                <span>{selectedBenchmark.requiredHardSkills.slice(0, 4).join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-700">Expected Tools: </span>
                <span>{selectedBenchmark.industryExpectedTools.slice(0, 4).join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Optional Role Override toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowAdvancedOverride(!showAdvancedOverride)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <Sliders className="w-3 h-3" />
              <span>{showAdvancedOverride ? 'Hide Custom Job Spec' : '+ Add Custom Job Description Requirements'}</span>
            </button>
            {showAdvancedOverride && (
              <textarea
                value={roleOverride}
                onChange={(e) => setRoleOverride(e.target.value)}
                placeholder="Paste requirements from a specific job posting (e.g. AWS, Next.js, GraphQL, Redis)..."
                rows={3}
                className="mt-2 w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            )}
          </div>
        </div>

        {/* Right Side: Resume / Transcript Raw Text */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>Resume / CV / Academic Transcript Content</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {cvText.length} characters
              </span>
            </div>

            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Paste student CV, coursework transcript, GitHub profile summary, or project details..."
              rows={14}
              className="w-full px-3.5 py-3 text-xs md:text-sm font-mono leading-relaxed bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
            />
          </div>

          {/* Action Footer */}
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="text-xs text-slate-500">
              Evaluates hard skills, soft skills, coursework, and practical project depth.
            </div>

            <button
              onClick={onAnalyze}
              disabled={isLoading || !cvText.trim()}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Profile with Career Engine...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Run Career & Skill-Gap Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
