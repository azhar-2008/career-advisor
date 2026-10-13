import React, { useState } from 'react';
import { LearningResource } from '../types/navigator';
import { BookOpen, ExternalLink, GraduationCap, Code, Compass } from 'lucide-react';

interface LearningResourcesSectionProps {
  resources: LearningResource[];
}

export const LearningResourcesSection: React.FC<LearningResourcesSectionProps> = ({ resources }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredResources = filterType === 'all'
    ? resources
    : resources.filter(r => r.resourceType.toLowerCase().includes(filterType.toLowerCase()) || r.platform.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Targeted Learning Resources</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Curated high-yield documentation, interactive sandboxes, and reputable course tracks.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setFilterType('documentation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === 'documentation' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Docs
          </button>
          <button
            onClick={() => setFilterType('freecodecamp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              filterType === 'freecodecamp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            freeCodeCamp
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-indigo-700">
                  {res.platform}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {res.resourceType}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 mb-1">
                {res.name}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {res.whatToLearn}
              </p>
            </div>

            {res.url && (
              <div className="mt-3 pt-2.5 border-t border-slate-200/80">
                <a
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>Open Official Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
