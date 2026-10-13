import React, { useState } from 'react';
import { ProjectBlueprint } from '../types/navigator';
import { X, Copy, Check, Terminal, FolderTree, ListChecks, FileCode2, Sparkles, Download } from 'lucide-react';

interface ProjectBlueprintModalProps {
  blueprint: ProjectBlueprint | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export const ProjectBlueprintModal: React.FC<ProjectBlueprintModalProps> = ({
  blueprint,
  isOpen,
  onClose,
  isLoading
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'steps' | 'code' | 'commands'>('structure');
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-999999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (e) {
      console.warn('Copy failed', e);
    }
  };

  const currentFile = blueprint?.boilerplateCode?.[activeFileIndex] || blueprint?.boilerplateCode?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  AI Architecture Blueprint
                </span>
                <span className="text-xs text-slate-400">· {blueprint?.targetRole || 'Engineering'}</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 truncate mt-0.5">
                {blueprint?.projectName || 'Project Blueprint'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
            <div>
              <div className="text-sm font-bold text-slate-800">Generating Project Architecture with Gemini...</div>
              <div className="text-xs text-slate-500 mt-1 max-w-sm">
                Designing file tree, step-by-step milestones, and starting boilerplate code for your target role.
              </div>
            </div>
          </div>
        ) : blueprint ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Project Goal Brief */}
            <div className="px-6 py-3 bg-indigo-50/40 border-b border-indigo-100/60 text-xs text-slate-700 flex items-start gap-2">
              <span className="font-semibold text-indigo-800 shrink-0">Objective:</span>
              <span className="leading-relaxed">{blueprint.projectGoal}</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('structure')}
                className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'structure'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>Folder Structure</span>
              </button>
              <button
                onClick={() => setActiveTab('steps')}
                className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'steps'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Step-by-Step Features ({blueprint.featuresStepByStep?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'code'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileCode2 className="w-3.5 h-3.5" />
                <span>Boilerplate Starter Code ({blueprint.boilerplateCode?.length || 0})</span>
              </button>
              <button
                onClick={() => setActiveTab('commands')}
                className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeTab === 'commands'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Getting Started Commands</span>
              </button>
            </div>

            {/* Tab Views */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-slate-50/30">
              {/* 1. Folder Structure */}
              {activeTab === 'structure' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Project Directory Layout</span>
                    <button
                      onClick={() => handleCopy(blueprint.folderStructure, 'tree')}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'tree' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'tree' ? 'Copied Tree' : 'Copy Structure'}</span>
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
                    {blueprint.folderStructure}
                  </pre>
                </div>
              )}

              {/* 2. Step-by-Step Features */}
              {activeTab === 'steps' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 font-medium">
                    Sequential implementation phases to build this project from scratch:
                  </div>
                  <div className="space-y-3">
                    {blueprint.featuresStepByStep?.map((feature) => (
                      <div
                        key={feature.stepNumber}
                        className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                            {feature.stepNumber}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {feature.featureTitle}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-8 mb-2.5">
                          {feature.description}
                        </p>
                        {feature.implementationTips && feature.implementationTips.length > 0 && (
                          <div className="pl-8 pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                            <span className="font-semibold text-slate-700 block">Implementation Tips:</span>
                            {feature.implementationTips.map((tip, tIdx) => (
                              <div key={tIdx} className="flex items-start gap-1.5">
                                <span className="text-indigo-600">•</span>
                                <span>{tip}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Boilerplate Starter Code */}
              {activeTab === 'code' && (
                <div className="space-y-4">
                  {/* File Selector Tabs */}
                  <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-200">
                    {blueprint.boilerplateCode?.map((file, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveFileIndex(idx)}
                        className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all cursor-pointer ${
                          activeFileIndex === idx
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {file.fileName}
                      </button>
                    ))}
                  </div>

                  {currentFile && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600 font-medium">{currentFile.explanation}</span>
                        <button
                          onClick={() => handleCopy(currentFile.code, currentFile.fileName)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                        >
                          {copiedKey === currentFile.fileName ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === currentFile.fileName ? 'Copied' : 'Copy File'}</span>
                        </button>
                      </div>

                      <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs leading-relaxed overflow-x-auto max-h-[400px] shadow-inner">
                        {currentFile.code}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* 4. Getting Started Commands */}
              {activeTab === 'commands' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Run in your local terminal:</span>
                    <button
                      onClick={() => handleCopy(blueprint.gettingStartedCommands.join('\n'), 'commands')}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center gap-1"
                    >
                      {copiedKey === 'commands' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'commands' ? 'Copied All' : 'Copy All Commands'}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl space-y-2 font-mono text-xs">
                    {blueprint.gettingStartedCommands?.map((cmd, cIdx) => (
                      <div key={cIdx} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2 text-slate-200">
                          <span className="text-indigo-400 select-none">$</span>
                          <span>{cmd}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(cmd, `cmd-${cIdx}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white p-1"
                          title="Copy command"
                        >
                          {copiedKey === `cmd-${cIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    ))}
                  </div>

                  {blueprint.recommendedPackages && blueprint.recommendedPackages.length > 0 && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200">
                      <span className="text-xs font-bold text-slate-900 block mb-2">Recommended Dependencies:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {blueprint.recommendedPackages.map((pkg, pIdx) => (
                          <span key={pIdx} className="font-mono text-xs px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                            {pkg}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Use this blueprint as your portfolio project foundation</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
