import React, { useState } from 'react';
import { GitHubAuditResult } from '../types/navigator';
import {
  Github,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  GitFork,
  FileCheck2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';

interface GitHubAuditorProps {
  claimedSkills?: string[];
  targetRole?: string;
  initialUsername?: string;
  onAuditComplete?: (result: GitHubAuditResult) => void;
}

export const GitHubAuditor: React.FC<GitHubAuditorProps> = ({
  claimedSkills = ['React', 'Python', 'SQL', 'Git', 'Docker'],
  targetRole = 'Full-Stack Developer',
  initialUsername = 'mayalin-cs',
  onAuditComplete
}) => {
  const [githubInput, setGithubInput] = useState(initialUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<GitHubAuditResult | null>(null);

  const sampleHandles = [
    { label: 'Maya Lin (CS Junior)', handle: 'mayalin-cs' },
    { label: 'Marcus Vance (Data/Math)', handle: 'marcus-math' },
    { label: 'Elena Rostova (Systems)', handle: 'elena-systems' },
    { label: 'Public Repo Example', handle: 'https://github.com/torvalds/linux' }
  ];

  const handleAudit = async (customHandle?: string) => {
    const handleToUse = (customHandle || githubInput).trim();
    if (!handleToUse) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/audit-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubInput: handleToUse,
          claimedSkills,
          targetRole
        })
      });

      if (res.ok) {
        const data: GitHubAuditResult = await res.json();
        setAuditResult(data);
        if (onAuditComplete) {
          onAuditComplete(data);
        }
      }
    } catch (err) {
      console.warn('Audit error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
              <Github className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              GitHub & Portfolio Auto-Auditor
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Paste your GitHub username or repository link. The auditor checks your public repositories, code languages, and README files to verify your skills with real code.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 font-medium shrink-0">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Real Code Verification</span>
        </div>
      </div>

      {/* Input Studio Bar */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={githubInput}
              onChange={(e) => setGithubInput(e.target.value)}
              placeholder="Enter GitHub username or repo link (e.g. mayalin-cs or github.com/username/repo)"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono text-slate-800"
            />
          </div>

          <button
            onClick={() => handleAudit()}
            disabled={isLoading || !githubInput.trim()}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Repositories...</span>
              </>
            ) : (
              <>
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Audit GitHub Profile</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Handles */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <span className="text-[11px] font-medium text-slate-400">Quick Test Profiles:</span>
          {sampleHandles.map((sample) => (
            <button
              key={sample.handle}
              onClick={() => {
                setGithubInput(sample.handle);
                handleAudit(sample.handle);
              }}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors font-medium cursor-pointer"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Results */}
      {auditResult && (
        <div className="space-y-6 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
          {/* Top Score Banner */}
          <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold font-mono text-slate-900 tabular-nums">
                  {auditResult.auditScore}%
                </span>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
                  Verified
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    GitHub Audit: @{auditResult.username}
                  </h3>
                  <a
                    href={auditResult.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Audited {auditResult.totalPublicRepos} public repositories · Benchmark Target: {targetRole}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{auditResult.verifiedSkills.length} Verified in Code</span>
              </div>
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{auditResult.unverifiedSkills.length} Need Projects</span>
              </div>
            </div>
          </div>

          {/* 2 Columns: Verified Skills vs Unverified Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Verified Skills */}
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Skills Backed by Code</span>
                </h4>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                  {auditResult.verifiedSkills.length} Skills Proven
                </span>
              </div>

              <div className="space-y-2">
                {auditResult.verifiedSkills.length === 0 ? (
                  <div className="text-xs text-slate-400 italic">No direct skill proof found in public repos yet.</div>
                ) : (
                  auditResult.verifiedSkills.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-lg border border-emerald-100 shadow-xs text-xs">
                      <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                        <span>{item.skill}</span>
                        <span className="text-[10px] text-emerald-700 font-mono font-medium bg-emerald-50 px-1.5 py-0.5 rounded">
                          backed by {item.backedByRepo}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 leading-relaxed">
                        {item.evidence}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Unverified / Overclaimed Skills */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Skills Needing Code Proof</span>
                </h4>
                <span className="text-[11px] font-mono text-amber-700 font-semibold">
                  Action Required
                </span>
              </div>

              <div className="space-y-2">
                {auditResult.unverifiedSkills.length === 0 ? (
                  <div className="text-xs text-emerald-700 font-medium">
                    All claimed resume skills have matching code in public repositories!
                  </div>
                ) : (
                  auditResult.unverifiedSkills.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-white rounded-lg border border-amber-100 shadow-xs text-xs">
                      <div className="font-bold text-slate-900 mb-0.5 flex items-center justify-between">
                        <span>{item.skill}</span>
                        <span className="text-[10px] text-amber-700 font-mono">No Code Proof</span>
                      </div>
                      <div className="text-[11px] text-slate-600 leading-relaxed">
                        {item.recommendation}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Audited Repositories Showcase */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Audited Public Repositories ({auditResult.repositories.length})
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {auditResult.repositories.map((repo, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-colors flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <a
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-xs text-indigo-600 hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{repo.name}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-medium ${
                        repo.readmeQuality === 'High'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        README: {repo.readmeQuality}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                      {repo.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-2">
                      {repo.verifiedSkills.map((s, sIdx) => (
                        <span key={sIdx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-slate-600">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {repo.stars}
                      </span>
                      <span className="flex items-center gap-0.5 text-slate-600">
                        <GitFork className="w-3 h-3" />
                        {repo.forks}
                      </span>
                    </div>
                    <span>{repo.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recruiter Readiness Recommendations */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Tips to Strengthen Your GitHub Profile:</span>
            </span>
            <ul className="space-y-1.5 text-slate-600">
              {auditResult.recruiterReadinessSuggestions.map((rec, rIdx) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-mono mt-0.5">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
