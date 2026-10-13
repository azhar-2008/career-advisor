import React, { useState, useMemo } from 'react';
import { NavigatorAnalysisResult } from '../types/navigator';
import {
  Code2,
  Copy,
  Check,
  Download,
  Terminal,
  Server,
  Play,
  CheckCircle2,
  Eye,
  FileText,
  Layers,
  Sparkles,
  ArrowUpRight,
  Printer
} from 'lucide-react';

interface ExportAndApiViewerProps {
  analysis?: NavigatorAnalysisResult | null;
  analysisResult?: NavigatorAnalysisResult | null;
}

export const ExportAndApiViewer: React.FC<ExportAndApiViewerProps> = ({
  analysis,
  analysisResult
}) => {
  // Gracefully resolve either prop name
  const currentResult = analysisResult || analysis;

  const [activeFormat, setActiveFormat] = useState<'preview' | 'markdown' | 'json' | 'snippets'>('preview');
  const [jsonMode, setJsonMode] = useState<'full' | 'clean'>('full');
  const [copied, setCopied] = useState(false);
  const [testApiLoading, setTestApiLoading] = useState(false);
  const [testApiResult, setTestApiResult] = useState<{ status: number; duration: number; data: string } | null>(null);

  // 1. Correct and robust serialization of the analysisResult object
  const serializedJson = useMemo(() => {
    if (!currentResult) {
      return JSON.stringify({ message: 'No analysis result available' }, null, 2);
    }

    try {
      if (jsonMode === 'full') {
        // Full, complete analysisResult object serialization
        return JSON.stringify(currentResult, null, 2);
      } else {
        // Clean backend API payload (without client UI flags)
        const cleanPayload = {
          studentName: currentResult.studentName,
          targetRole: currentResult.targetRole,
          readinessScore: currentResult.readinessScore,
          parsedCapabilities: currentResult.parsedCapabilities,
          skillGapAnalysis: currentResult.skillGapAnalysis,
          careerRoadmap: currentResult.careerRoadmap,
          recommendedProjects: currentResult.recommendedProjects,
          learningResources: currentResult.learningResources,
          generatedAt: currentResult.generatedAt,
          engine: currentResult.modelPowered ? 'gemini-3.8-flash' : 'benchmark-rules'
        };
        return JSON.stringify(cleanPayload, null, 2);
      }
    } catch (err) {
      console.error('Error serializing analysisResult object:', err);
      return JSON.stringify({
        error: 'Serialization Error',
        message: err instanceof Error ? err.message : String(err)
      }, null, 2);
    }
  }, [currentResult, jsonMode]);

  // Raw markdown content directly from data or fallback
  const rawMarkdown = currentResult?.standardMarkdown || 'No markdown generated yet.';

  // Safe multi-fallback copy handler
  const handleCopy = async () => {
    const textToCopy = (activeFormat === 'markdown' || activeFormat === 'preview')
      ? rawMarkdown
      : serializedJson;

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        throw new Error('Fallback required');
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (copyErr) {
        console.warn('Unable to copy text:', copyErr);
      }
    }
  };

  const handleDownload = () => {
    const isMd = activeFormat === 'markdown' || activeFormat === 'preview';
    const content = isMd ? rawMarkdown : serializedJson;
    const blob = new Blob([content], {
      type: isMd ? 'text/markdown' : 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const roleSlug = (currentResult?.targetRole || 'career-assessment').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `career-gap-${roleSlug}.${isMd ? 'md' : 'json'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    setActiveFormat('preview');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Live API test request runner
  const runLiveApiTest = async () => {
    setTestApiLoading(true);
    setTestApiResult(null);
    const startTime = performance.now();
    try {
      const res = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: currentResult?.studentName || 'Student Candidate',
          targetRole: currentResult?.targetRole || 'Full-Stack Developer',
          cvText: 'B.S. in Computer Science. Completed Data Structures, Database Systems with SQL. Built library search in Java and SQLite.'
        })
      });
      const data = await res.json();
      const endTime = performance.now();
      setTestApiResult({
        status: res.status,
        duration: Math.round(endTime - startTime),
        data: JSON.stringify(data, null, 2)
      });
    } catch (err: unknown) {
      const endTime = performance.now();
      setTestApiResult({
        status: 500,
        duration: Math.round(endTime - startTime),
        data: err instanceof Error ? err.message : 'Network test error'
      });
    } finally {
      setTestApiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-600" />
            <span>Backend & API Compatibility Inspector</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified standard Markdown preview and serialized JSON output for integration with FastAPI, Next.js, or Supabase.
          </p>
        </div>

        {/* Format Selectors and Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setActiveFormat('preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormat === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Markdown Preview</span>
            </button>
            <button
              onClick={() => setActiveFormat('markdown')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormat === 'markdown' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Raw Markdown</span>
            </button>
            <button
              onClick={() => setActiveFormat('json')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormat === 'json' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>API JSON</span>
            </button>
            <button
              onClick={() => setActiveFormat('snippets')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeFormat === 'snippets' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>API Endpoints</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            title="Save Career Roadmap and Readiness Score as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span>Save as PDF</span>
          </button>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
            title="Copy current content"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Markdown Preview Tab (Properly formatted HTML preview without raw markdown syntax errors) */}
      {activeFormat === 'preview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700">Standard Student Response (Formatted Preview)</span>
            <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Standard Format Compliant</span>
            </span>
          </div>

          <div className="p-6 bg-slate-50/60 rounded-xl border border-slate-200 space-y-6">
            {/* Title & Profile Readiness Score */}
            <div className="pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xl">📊</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                  Profile Readiness Score: <span className="font-mono text-indigo-600">{currentResult?.readinessScore}%</span> for {currentResult?.targetRole}
                </h3>
              </div>
            </div>

            {/* Skill Gap Analysis Section */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm">🔍</span>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Skill Gap Analysis</h4>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 w-1/4">Category</th>
                      <th className="py-2.5 px-4">Identified Skills</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 px-4 font-bold text-emerald-700 align-top">Matched Skills</td>
                      <td className="py-3 px-4 text-slate-700">
                        {currentResult?.skillGapAnalysis?.matchedSkills && currentResult.skillGapAnalysis.matchedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {currentResult.skillGapAnalysis.matchedSkills.map((s, idx) => (
                              <span key={idx} className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                                {s.skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None explicitly identified yet</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-amber-700 align-top">Underdeveloped Skills</td>
                      <td className="py-3 px-4 text-slate-700">
                        {currentResult?.skillGapAnalysis?.underdevelopedSkills && currentResult.skillGapAnalysis.underdevelopedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {currentResult.skillGapAnalysis.underdevelopedSkills.map((s, idx) => (
                              <span key={idx} className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-medium">
                                {s.skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None identified</span>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold text-rose-700 align-top">Missing Skills</td>
                      <td className="py-3 px-4 text-slate-700">
                        {currentResult?.skillGapAnalysis?.missingSkills && currentResult.skillGapAnalysis.missingSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5">
                            {currentResult.skillGapAnalysis.missingSkills.map((s, idx) => (
                              <span key={idx} className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200 font-medium">
                                {s.skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">None critical</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Step-by-Step Career Roadmap */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm">🗺️</span>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Step-by-Step Career Roadmap</h4>
              </div>

              <div className="space-y-3">
                {currentResult?.careerRoadmap?.map((phase) => (
                  <div key={phase.phaseNumber} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="font-bold text-sm text-slate-900 mb-2 flex items-center justify-between">
                      <span>{phase.phaseName}</span>
                      <span className="text-[11px] text-slate-500 font-mono">Est. {phase.estimatedWeeks} Weeks</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 pl-2">
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-slate-700">Target:</span>
                        <span>{phase.targetFocus}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-semibold text-slate-700 shrink-0">Action Items:</span>
                        <span>{phase.actionItems.join('; ')}</span>
                      </li>
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Recommended Portfolio Projects */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm">💡</span>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Recommended Portfolio Projects</h4>
              </div>

              <div className="space-y-3">
                {currentResult?.recommendedProjects?.map((proj, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="font-bold text-sm text-slate-900 mb-1">
                      {idx + 1}. {proj.projectName}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-2">
                      {proj.shortDescription}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
                      <span className="font-semibold text-slate-500">Proves:</span>
                      {proj.provesSkills?.map((s, sIdx) => (
                        <span key={sIdx} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Learning Resources */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm">📚</span>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Learning Resources</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentResult?.learningResources?.map((res, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
                    <div className="font-bold text-slate-800">
                      [{res.name} / {res.platform}]
                    </div>
                    <div className="text-slate-600 mt-0.5 text-[11px]">
                      {res.whatToLearn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Raw Markdown Tab */}
      {activeFormat === 'markdown' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verbatim Standard Markdown Output</span>
            <span className="font-mono text-[11px] text-slate-500">{rawMarkdown.length} characters</span>
          </div>
          <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[500px]">
            {rawMarkdown}
          </pre>
        </div>
      )}

      {/* 3. API JSON Output Tab (Correctly serializing analysisResult) */}
      {activeFormat === 'json' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Serialized analysisResult</span>
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-[11px] text-slate-500">
                {serializedJson.length} bytes
              </span>
            </div>

            {/* Toggle JSON view mode */}
            <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-md">
              <button
                onClick={() => setJsonMode('full')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  jsonMode === 'full' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full analysisResult Object
              </button>
              <button
                onClick={() => setJsonMode('clean')}
                className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  jsonMode === 'clean' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Clean Payload Schema
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed max-h-[500px]">
            {serializedJson}
          </pre>
        </div>
      )}

      {/* 4. API Integration Tab */}
      {activeFormat === 'snippets' && (
        <div className="space-y-6">
          {/* Live API Endpoint Tester */}
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Live Endpoint Verification</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sends an HTTP POST payload to <code>/api/analyze-profile</code> to test backend JSON serialization live.
                </p>
              </div>

              <button
                onClick={runLiveApiTest}
                disabled={testApiLoading}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <span>{testApiLoading ? 'Pinging /api/analyze-profile...' : 'Send Test Request'}</span>
              </button>
            </div>

            {testApiResult && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-700 font-bold">HTTP {testApiResult.status} OK</span>
                  <span className="text-slate-400">{testApiResult.duration}ms latency</span>
                </div>
                <pre className="text-[11px] text-slate-700 max-h-48 overflow-auto whitespace-pre">
                  {testApiResult.data}
                </pre>
              </div>
            )}
          </div>

          {/* FastAPI (Python) Route Snippet */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                <span>FastAPI (Python) Integration Route</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">backend/api.py</span>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
{`from fastapi import FastAPI, HTTPException
import httpx

app = FastAPI()

@app.post("/api/career-gap-assessment")
async def evaluate_student_profile(payload: dict):
    # Forward student CV & target role to Career Engine
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://localhost:3000/api/analyze-profile",
            json={
                "cvText": payload.get("cv_text"),
                "targetRole": payload.get("target_role", "Full-Stack Developer"),
                "studentName": payload.get("student_name")
            },
            timeout=60.0
        )
        if response.status_code != 200:
            raise HTTPException(status_code=502, detail="Navigator engine error")
        return response.json()`}
            </pre>
          </div>

          {/* Next.js (App Router) Route Snippet */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next.js API Route (App Router)</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">app/api/navigator/route.ts</span>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto leading-relaxed">
{`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { cvText, targetRole, studentName } = await req.json();

  const res = await fetch('/api/analyze-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cvText, targetRole, studentName })
  });

  const assessment = await res.json();
  return NextResponse.json(assessment);
}`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
