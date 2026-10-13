import React, { useState } from 'react';
import { SkillGapEvaluation, ParsedCapabilities } from '../types/navigator';
import { CheckCircle2, AlertTriangle, XCircle, BookOpen, Layers, Code, Award, Github, ArrowRight } from 'lucide-react';

interface SkillGapMatrixProps {
  skillGap: SkillGapEvaluation;
  parsedCapabilities: ParsedCapabilities;
  onOpenAuditor?: () => void;
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({ skillGap, parsedCapabilities, onOpenAuditor }) => {
  const [activeView, setActiveView] = useState<'matrix' | 'parsed'>('matrix');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header and View Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <span>Skill Gap Analysis Engine</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Detailed comparison of student capabilities against industry baseline expectations.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveView('matrix')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'matrix'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skill Gap Matrix
          </button>
          <button
            onClick={() => setActiveView('parsed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeView === 'parsed'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parsed Profile & Courses
          </button>
        </div>
      </div>

      {activeView === 'matrix' ? (
        <div className="space-y-6">
          {/* 3 Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/20 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-emerald-200/80">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Matched Skills</h3>
                    <div className="text-[11px] text-emerald-700 font-medium">Demonstrated Strengths</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {skillGap.matchedSkills.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No direct matches identified yet.</div>
                  ) : (
                    skillGap.matchedSkills.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-emerald-100 shadow-xs">
                        <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                          <span>{item.skill}</span>
                          <span className="text-[10px] text-emerald-700 font-medium">Proficient</span>
                        </div>
                        {item.studentEvidence && (
                          <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                            {item.studentEvidence}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Underdeveloped Skills */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/20 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-amber-200/80">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Underdeveloped Skills</h3>
                    <div className="text-[11px] text-amber-700 font-medium">Lacks Practical/Project Depth</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {skillGap.underdevelopedSkills.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No underdeveloped skills identified.</div>
                  ) : (
                    skillGap.underdevelopedSkills.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-amber-100 shadow-xs">
                        <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                          <span>{item.skill}</span>
                          <span className="text-[10px] text-amber-700 font-medium">Basic / Theory</span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.gapExplanation || item.studentEvidence || 'Has basic familiarity but needs applied production context.'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Missing Skills */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/20 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-rose-200/80">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Missing Skills</h3>
                    <div className="text-[11px] text-rose-700 font-medium">Essential Industry Requirements</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {skillGap.missingSkills.length === 0 ? (
                    <div className="text-xs text-slate-400 italic">No critical missing skills.</div>
                  ) : (
                    skillGap.missingSkills.map((item, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-lg border border-rose-100 shadow-xs">
                        <div className="font-semibold text-xs text-slate-900 flex items-center justify-between">
                          <span>{item.skill}</span>
                          <span className="text-[10px] text-rose-700 font-medium font-mono">
                            {item.importance || 'Critical'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {item.whyNeeded || item.industryRequirement || 'Essential for day-to-day industry execution.'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clean Standard Table Format */}
          <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-xs text-slate-700">
              Standard Skill Gap Matrix Table
            </div>
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/60 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold w-1/4">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Identified Skills & Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3 px-4 font-bold text-emerald-700 align-top">Matched Skills</td>
                  <td className="py-3 px-4 text-slate-700">
                    {skillGap.matchedSkills.map(s => s.skill).join(', ') || 'None'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-amber-700 align-top">Underdeveloped Skills</td>
                  <td className="py-3 px-4 text-slate-700">
                    {skillGap.underdevelopedSkills.map(s => s.skill).join(', ') || 'None'}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-rose-700 align-top">Missing Skills</td>
                  <td className="py-3 px-4 text-slate-700">
                    {skillGap.missingSkills.map(s => s.skill).join(', ') || 'None'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* GitHub Auditor Callout Banner */}
          {onOpenAuditor && (
            <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Want to verify your skills with real code?</div>
                  <div className="text-slate-500 text-[11px]">Audit your public GitHub repositories, commit history, and README files.</div>
                </div>
              </div>

              <button
                onClick={onOpenAuditor}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs self-start sm:self-center"
              >
                <span>Launch GitHub Auditor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Parsed Capabilities View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Hard Skills */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Code className="w-4 h-4 text-indigo-600" />
              <span>Extracted Hard Skills ({parsedCapabilities.hardSkills.length})</span>
            </h3>
            <div className="space-y-2">
              {parsedCapabilities.hardSkills.map((h, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2 bg-white rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">{h.name}</div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{h.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-indigo-600">{h.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Courses */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>Courses & Academic Knowledge ({parsedCapabilities.academicCourses.length})</span>
            </h3>
            <div className="space-y-2">
              {parsedCapabilities.academicCourses.map((c, i) => (
                <div key={i} className="text-xs p-2.5 bg-white rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">{c.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{c.relevance}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-indigo-600" />
              <span>Soft Skills & Methodologies</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {parsedCapabilities.softSkills.map((s, i) => (
                <div key={i} className="text-xs px-2.5 py-1 bg-white rounded-md border border-slate-200 text-slate-700">
                  {s.name}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Identified Projects ({parsedCapabilities.projects.length})</span>
            </h3>
            <div className="space-y-2">
              {parsedCapabilities.projects.map((p, i) => (
                <div key={i} className="text-xs p-2.5 bg-white rounded border border-slate-200">
                  <div className="font-semibold text-slate-800">{p.title}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
