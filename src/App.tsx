import React, { useState, useEffect } from 'react';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { ProfileInputStudio } from './components/ProfileInputStudio';
import { ReadinessScoreCard } from './components/ReadinessScoreCard';
import { SkillGapMatrix } from './components/SkillGapMatrix';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { PortfolioBlueprints } from './components/PortfolioBlueprints';
import { LearningResourcesSection } from './components/LearningResourcesSection';
import { ExportAndApiViewer } from './components/ExportAndApiViewer';
import { GitHubAuditor } from './components/GitHubAuditor';
import { ContactSection } from './components/ContactSection';
import { ContactModal } from './components/ContactModal';
import { SAMPLE_STUDENT_PROFILES, PresetStudentProfile, INDUSTRY_ROLES } from './data/industryRoles';
import { NavigatorAnalysisResult } from './types/navigator';
import { analyzeProfileFallback } from './utils/engine';
import { Compass, GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const defaultPreset = SAMPLE_STUDENT_PROFILES[0];

  const [activeTab, setActiveTab] = useState<string>('studio');
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(defaultPreset.id);
  const [studentName, setStudentName] = useState<string>(defaultPreset.name);
  const [targetRole, setTargetRole] = useState<string>('Full-Stack Developer');
  const [cvText, setCvText] = useState<string>(defaultPreset.cvText);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<NavigatorAnalysisResult | null>(null);

  // Initial load: parse default preset immediately
  useEffect(() => {
    const initialResult = analyzeProfileFallback(
      defaultPreset.cvText,
      'Full-Stack Developer',
      defaultPreset.name
    );
    setAnalysisResult(initialResult);
  }, []);

  const handleSelectPreset = async (preset: PresetStudentProfile) => {
    setSelectedPresetId(preset.id);
    setStudentName(preset.name);
    setCvText(preset.cvText);

    const matchingRole = INDUSTRY_ROLES.find(r => r.id === preset.targetRoleId)?.title || 'Full-Stack Developer';
    setTargetRole(matchingRole);

    // Run analysis
    await runAnalysis(preset.cvText, matchingRole, preset.name);
  };

  const handleExploreCustom = () => {
    setSelectedPresetId('custom');
    setStudentName('');
    setCvText('');
    setActiveTab('studio');
  };

  const runAnalysis = async (textToAnalyze = cvText, roleToAnalyze = targetRole, nameToAnalyze = studentName) => {
    if (!textToAnalyze.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvText: textToAnalyze,
          targetRole: roleToAnalyze,
          studentName: nameToAnalyze
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysisResult(data);
      } else {
        // Fallback engine
        const fallback = analyzeProfileFallback(textToAnalyze, roleToAnalyze, nameToAnalyze);
        setAnalysisResult(fallback);
      }
    } catch {
      // Fallback engine on fetch failure
      const fallback = analyzeProfileFallback(textToAnalyze, roleToAnalyze, nameToAnalyze);
      setAnalysisResult(fallback);
    } finally {
      setIsLoading(false);
      // Switch view smoothly to see results if currently on input studio
      if (activeTab === 'studio') {
        setActiveTab('analysis');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      {/* Top Bar adhering to Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewAnalysis={() => setActiveTab('studio')}
        onOpenContact={() => setIsContactOpen(true)}
        modelPowered={analysisResult?.modelPowered}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Quick Presets */}
        <HeroSection
          onSelectPreset={handleSelectPreset}
          onExploreCustom={handleExploreCustom}
          selectedPresetId={selectedPresetId}
        />

        {/* Studio View or Tabbed Views */}
        {activeTab === 'studio' && (
          <ProfileInputStudio
            cvText={cvText}
            setCvText={setCvText}
            studentName={studentName}
            setStudentName={setStudentName}
            targetRole={targetRole}
            setTargetRole={setTargetRole}
            onAnalyze={() => runAnalysis()}
            isLoading={isLoading}
          />
        )}

        {/* Global Readiness Score banner when analysis is present */}
        {analysisResult && (
          <ReadinessScoreCard analysis={analysisResult} />
        )}

        {/* Tab-driven Content Views */}
        {analysisResult && (
          <>
            {activeTab === 'analysis' && (
              <SkillGapMatrix
                skillGap={analysisResult.skillGapAnalysis}
                parsedCapabilities={analysisResult.parsedCapabilities}
                onOpenAuditor={() => setActiveTab('auditor')}
              />
            )}

            {activeTab === 'auditor' && (
              <GitHubAuditor
                claimedSkills={analysisResult.parsedCapabilities.hardSkills.map(s => s.name)}
                targetRole={analysisResult.targetRole}
                initialUsername={
                  studentName.toLowerCase().includes('marcus')
                    ? 'marcus-math'
                    : studentName.toLowerCase().includes('elena')
                    ? 'elena-systems'
                    : 'mayalin-cs'
                }
              />
            )}

            {activeTab === 'roadmap' && (
              <CareerRoadmapView roadmap={analysisResult.careerRoadmap} />
            )}

            {activeTab === 'portfolio' && (
              <>
                <PortfolioBlueprints
                  projects={analysisResult.recommendedProjects}
                  targetRole={analysisResult.targetRole}
                />
                <LearningResourcesSection resources={analysisResult.learningResources} />
              </>
            )}

            {activeTab === 'export' && (
              <ExportAndApiViewer analysisResult={analysisResult} analysis={analysisResult} />
            )}
          </>
        )}

        {/* Secondary Navigation Strip if viewing a specific section to quickly jump */}
        {analysisResult && activeTab !== 'studio' && (
          <div className="flex flex-wrap items-center justify-between p-4 bg-white rounded-xl border border-slate-200 shadow-xs mb-8 gap-3">
            <div className="text-xs text-slate-500">
              Viewing assessment for <strong className="text-slate-800">{analysisResult.studentName}</strong> targeting <strong className="text-indigo-600">{analysisResult.targetRole}</strong>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('studio')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Edit Resume / Change Role
              </button>
              <button
                onClick={() => setActiveTab('auditor')}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                GitHub Auditor
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
              >
                View Markdown & API
              </button>
            </div>
          </div>
        )}

        {/* Contact Options Section (simple and short text) */}
        <ContactSection />
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700">Avengers Career Advisor</span>
            <span aria-hidden="true">·</span>
            <span>Skill-Gap Navigator</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsContactOpen(true)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors cursor-pointer"
            >
              Contact Us (Email)
            </button>
            <a href="#privacy" className="hover:text-slate-800 transition-colors">Academic Standards</a>
            <a href="#terms" className="hover:text-slate-800 transition-colors">Role Benchmarks</a>
            <a href="#api" onClick={(e) => { e.preventDefault(); setActiveTab('export'); }} className="hover:text-slate-800 transition-colors">API Specs</a>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
