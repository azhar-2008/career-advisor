import React, { useState } from 'react';
import { PortfolioProject, ProjectBlueprint } from '../types/navigator';
import { ProjectBlueprintModal } from './ProjectBlueprintModal';
import { Lightbulb, Copy, Check, Sparkles, FolderGit2 } from 'lucide-react';

interface PortfolioBlueprintsProps {
  projects: PortfolioProject[];
  targetRole?: string;
}

export const PortfolioBlueprints: React.FC<PortfolioBlueprintsProps> = ({
  projects,
  targetRole = 'Full-Stack Developer'
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);
  const [selectedBlueprint, setSelectedBlueprint] = useState<ProjectBlueprint | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const copyReadme = (project: PortfolioProject) => {
    const readmeContent = `# ${project.projectName}

## 📌 Overview
${project.shortDescription}

## 🎯 Proves Industry Competencies
${project.provesSkills.map(s => `- **${s}**`).join('\n')}

## 🛠️ Tech Stack
${project.suggestedTechStack.map(t => `- ${t}`).join('\n')}

## 🏗️ Architecture & Implementation Milestones
${project.keyArchitectureSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## 🚀 Getting Started
\`\`\`bash
git clone https://github.com/your-username/${project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.git
cd ${project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
npm install
npm run dev
\`\`\`

---
*Generated via Career and Skill-Gap Navigator*
`;

    navigator.clipboard.writeText(readmeContent);
    setCopiedId(project.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateBlueprint = async (project: PortfolioProject) => {
    setGeneratingId(project.id);
    setSelectedBlueprint(null);
    setBlueprintModalOpen(true);

    try {
      const res = await fetch('/api/generate-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project.projectName,
          targetRole,
          techStack: project.suggestedTechStack,
          shortDescription: project.shortDescription
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedBlueprint(data);
      } else {
        throw new Error('Server returned error');
      }
    } catch (err) {
      console.warn('API blueprint generation error, using client architecture fallback:', err);
      // Client fallback to ensure user is never blocked
      setSelectedBlueprint({
        projectId: project.id,
        projectName: project.projectName,
        projectGoal: project.shortDescription,
        targetRole,
        folderStructure: `${project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/
├── src/
│   ├── components/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── index.ts
├── tests/
├── .env.example
├── package.json
└── README.md`,
        featuresStepByStep: project.keyArchitectureSteps.map((step, idx) => ({
          stepNumber: idx + 1,
          featureTitle: step.split(':')[0] || `Phase ${idx + 1}`,
          description: step,
          implementationTips: ['Follow modern industry standard coding conventions', 'Include thorough error handling']
        })),
        boilerplateCode: [
          {
            fileName: 'src/index.ts',
            language: 'typescript',
            explanation: 'Entry point initializing application server with middleware and route controllers.',
            code: `// ${project.projectName} - Starter Boilerplate\nconsole.log("Starting ${project.projectName} service...");`
          }
        ],
        gettingStartedCommands: [
          `git clone https://github.com/username/${project.projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.git`,
          'npm install',
          'npm run dev'
        ]
      });
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="pb-4 mb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <span>Recommended Portfolio Projects</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Actionable projects designed specifically to prove missing and underdeveloped skills to hiring managers.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj, idx) => (
          <div
            key={proj.id || idx}
            className="rounded-xl border border-slate-200 bg-slate-50/40 p-5 flex flex-col justify-between hover:border-indigo-300 transition-all shadow-xs"
          >
            <div>
              {/* Project Badge & Index */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Project {idx + 1}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {proj.suggestedTechStack.slice(0, 3).join(' · ')}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 mb-2 leading-snug">
                {proj.projectName}
              </h3>

              {/* Short Description */}
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {proj.shortDescription}
              </p>

              {/* Skills Proved */}
              <div className="mb-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>Proves Missing Competencies:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {proj.provesSkills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Architecture Milestones */}
              {proj.keyArchitectureSteps && proj.keyArchitectureSteps.length > 0 && (
                <div className="mb-4 pt-3 border-t border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Execution Steps:
                  </div>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {proj.keyArchitectureSteps.map((step, stepIdx) => (
                      <li key={stepIdx} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-mono text-[11px] mt-0.5">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions: Generate Blueprint & Copy README */}
            <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => handleGenerateBlueprint(proj)}
                disabled={generatingId === proj.id}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>{generatingId === proj.id ? 'Generating Architecture...' : 'Generate Project Blueprint'}</span>
              </button>

              <button
                onClick={() => copyReadme(proj)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedId === proj.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">README Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy README</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Blueprint Modal */}
      <ProjectBlueprintModal
        blueprint={selectedBlueprint}
        isOpen={blueprintModalOpen}
        onClose={() => setBlueprintModalOpen(false)}
        isLoading={Boolean(generatingId)}
      />
    </div>
  );
};
