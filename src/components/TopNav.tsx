import React from 'react';
import { Compass, Sparkles, Code2, Terminal } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onNewAnalysis: () => void;
  onOpenContact?: () => void;
  modelPowered?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onNewAnalysis,
  onOpenContact,
  modelPowered
}) => {
  const navItems = [
    { id: 'studio', label: 'Profile Studio' },
    { id: 'analysis', label: 'Skill Gap Matrix' },
    { id: 'auditor', label: 'GitHub Auditor' },
    { id: 'roadmap', label: 'Career Roadmap' },
    { id: 'portfolio', label: 'Project Blueprints' },
    { id: 'export', label: 'API & Markdown' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Compass className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
              Avengers Career Advisor
            </span>
            <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
              Skill-Gap Navigator
            </span>
          </div>
        </div>

        {/* Zone 2: Clean single-line text nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                activeTab === item.id
                  ? 'text-indigo-600 font-semibold'
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {modelPowered && (
            <span className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Gemini 3.8 Flash
            </span>
          )}
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Contact Us
            </button>
          )}
          <button
            onClick={onNewAnalysis}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Analyze Profile</span>
          </button>
        </div>
      </div>
    </header>
  );
};
