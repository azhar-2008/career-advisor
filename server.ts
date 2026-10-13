import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { analyzeProfileFallback, formatStandardMarkdown } from './src/utils/engine';
import { generateBlueprintFallback } from './src/utils/blueprintEngine';
import { auditGitHubProfile } from './src/utils/githubAuditor';
import { INDUSTRY_ROLES } from './src/data/industryRoles';
import { NavigatorAnalysisResult } from './src/types/navigator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// Get available industry roles
app.get('/api/roles', (_req: Request, res: Response) => {
  res.json({
    roles: INDUSTRY_ROLES
  });
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash'
  });
});

// Primary Career & Skill-Gap Analysis Engine Endpoint
app.post('/api/analyze-profile', async (req: Request, res: Response) => {
  const { cvText, targetRole, studentName, roleRequirementsOverride } = req.body;

  if (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0) {
    res.status(400).json({ error: 'Resume or CV text is required.' });
    return;
  }

  const roleTitle = targetRole || 'Full-Stack Developer';

  // If Gemini API is available, perform real AI reasoning with gemini-3.8-flash
  if (ai) {
    try {
      const systemPrompt = `You are the AI Engine powering the "Career and Skill-Gap Navigator" platform—an intelligent career guidance assistant designed to help university students bridge the gap between academic knowledge and industry expectations.

YOUR PRIMARY FUNCTIONS:
1. CV & PROFILE PARSER:
   - Extract and categorize student capabilities from text or resume data into:
     - Hard Skills (e.g., Python, SQL, React, Git, Data Analysis)
     - Soft Skills & Methodologies (e.g., Agile, Communication, Problem Solving)
     - Courses & Academic Knowledge (e.g., Data Structures, Operating Systems)
     - Projects & Portfolio Experience

2. SKILL-GAP ANALYSIS ENGINE:
   - Compare student capabilities against the requirements of standard tech/industry roles (${roleTitle}).
   - Return structured skill evaluations:
     - Matched Skills: Strengths the student already possesses.
     - Underdeveloped Skills: Skills the student has basic knowledge of, but lacks practical/project depth.
     - Missing Skills: Essential industry requirements absent from the student profile.

3. ROADMAP & PORTFOLIO RECOMMENDATION GENERATOR:
   - Generate a clear, phased learning roadmap (Phase 1: Core Fundamentals, Phase 2: Applied Projects, Phase 3: Career Readiness).
   - Suggest 2–3 actionable portfolio project ideas designed to demonstrate missing/underdeveloped skills.
   - Recommend targeted learning resources (e.g., freeCodeCamp, Coursera, official documentation, GitHub repos).
   - Estimate an overall "Readiness Score" (0–100%) to help track progress toward the target job role.

FORMAT SPECIFICATION:
Return valid JSON conforming to the requested schema.`;

      const userPrompt = `Target Role: ${roleTitle}
${roleRequirementsOverride ? `Specific Industry Requirements: ${roleRequirementsOverride}` : ''}
Student Name: ${studentName || 'University Student'}

STUDENT CV / RESUME TEXT:
${cvText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              studentName: { type: Type.STRING },
              targetRole: { type: Type.STRING },
              readinessScore: { type: Type.INTEGER, description: 'Percentage from 0 to 100' },
              parsedCapabilities: {
                type: Type.OBJECT,
                properties: {
                  hardSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        category: { type: Type.STRING },
                        proficiency: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                        evidence: { type: Type.STRING }
                      },
                      required: ['name', 'category', 'proficiency']
                    }
                  },
                  softSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        evidence: { type: Type.STRING }
                      },
                      required: ['name']
                    }
                  },
                  academicCourses: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        relevance: { type: Type.STRING }
                      },
                      required: ['name', 'relevance']
                    }
                  },
                  projects: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                        description: { type: Type.STRING }
                      },
                      required: ['title', 'techStack', 'description']
                    }
                  }
                },
                required: ['hardSkills', 'softSkills', 'academicCourses', 'projects']
              },
              skillGapAnalysis: {
                type: Type.OBJECT,
                properties: {
                  matchedSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        skill: { type: Type.STRING },
                        studentEvidence: { type: Type.STRING },
                        industryRequirement: { type: Type.STRING }
                      },
                      required: ['skill', 'studentEvidence']
                    }
                  },
                  underdevelopedSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        skill: { type: Type.STRING },
                        studentEvidence: { type: Type.STRING },
                        gapExplanation: { type: Type.STRING }
                      },
                      required: ['skill', 'gapExplanation']
                    }
                  },
                  missingSkills: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        skill: { type: Type.STRING },
                        whyNeeded: { type: Type.STRING },
                        importance: { type: Type.STRING, enum: ['Critical', 'High', 'Medium'] }
                      },
                      required: ['skill', 'whyNeeded']
                    }
                  }
                },
                required: ['matchedSkills', 'underdevelopedSkills', 'missingSkills']
              },
              careerRoadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    phaseNumber: { type: Type.INTEGER },
                    phaseName: { type: Type.STRING },
                    targetFocus: { type: Type.STRING },
                    actionItems: { type: Type.ARRAY, items: { type: Type.STRING } },
                    estimatedWeeks: { type: Type.INTEGER }
                  },
                  required: ['phaseNumber', 'phaseName', 'targetFocus', 'actionItems', 'estimatedWeeks']
                }
              },
              recommendedProjects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    projectName: { type: Type.STRING },
                    shortDescription: { type: Type.STRING },
                    provesSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                    suggestedTechStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keyArchitectureSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['projectName', 'shortDescription', 'provesSkills', 'suggestedTechStack']
                }
              },
              learningResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    platform: { type: Type.STRING },
                    resourceType: { type: Type.STRING },
                    whatToLearn: { type: Type.STRING },
                    url: { type: Type.STRING }
                  },
                  required: ['name', 'platform', 'whatToLearn']
                }
              }
            },
            required: [
              'studentName',
              'targetRole',
              'readinessScore',
              'parsedCapabilities',
              'skillGapAnalysis',
              'careerRoadmap',
              'recommendedProjects',
              'learningResources'
            ]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsedData = JSON.parse(responseText);

        const standardMarkdown = formatStandardMarkdown({
          readinessScore: parsedData.readinessScore,
          targetRole: parsedData.targetRole,
          skillGapAnalysis: parsedData.skillGapAnalysis,
          careerRoadmap: parsedData.careerRoadmap,
          recommendedProjects: parsedData.recommendedProjects,
          learningResources: parsedData.learningResources
        });

        const fullResult: NavigatorAnalysisResult = {
          ...parsedData,
          standardMarkdown,
          rawJsonExport: {
            metadata: {
              platform: 'Career and Skill-Gap Navigator',
              engine: 'gemini-3.8-flash',
              targetRole: parsedData.targetRole,
              readinessScore: parsedData.readinessScore,
              generatedAt: new Date().toISOString()
            },
            data: parsedData
          },
          generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          modelPowered: true
        };

        res.json(fullResult);
        return;
      }
    } catch (err: unknown) {
      console.warn('Gemini API call failed, using intelligent benchmark fallback engine:', err);
      // Fallback seamlessly so the user experience is smooth and uninterrupted
    }
  }

  // Intelligent benchmark fallback
  const fallbackResult = analyzeProfileFallback(cvText, roleTitle, studentName);
  res.json(fallbackResult);
});

// Project Blueprint & Code Starter Generator Endpoint
app.post('/api/generate-blueprint', async (req: Request, res: Response) => {
  const { projectName, targetRole, techStack, shortDescription } = req.body;

  if (!projectName) {
    res.status(400).json({ error: 'Project name is required' });
    return;
  }

  const role = targetRole || 'Full-Stack Developer';

  if (ai) {
    try {
      const prompt = `You are a Lead Software Architect and University Career Mentor.
The student needs to build this recommended portfolio project: "${projectName}"
Target Role: "${role}"
Suggested Tech Stack: ${(techStack || []).join(', ')}
Short Description: "${shortDescription || ''}"

Generate a complete, production-grade project blueprint including:
1. Complete ASCII folder and file structure tree
2. Step-by-step feature implementation guide in sequential order with implementation tips
3. 2 to 3 starter boilerplate code files with full, real, working code (e.g. server entry point, schema/models, configuration)
4. Terminal getting started commands
5. Recommended package dependencies

Return valid JSON conforming to the schema.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectId: { type: Type.STRING },
              projectName: { type: Type.STRING },
              projectGoal: { type: Type.STRING },
              targetRole: { type: Type.STRING },
              folderStructure: { type: Type.STRING, description: 'ASCII tree diagram of directories and files' },
              featuresStepByStep: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    featureTitle: { type: Type.STRING },
                    description: { type: Type.STRING },
                    implementationTips: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['stepNumber', 'featureTitle', 'description', 'implementationTips']
                }
              },
              boilerplateCode: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    fileName: { type: Type.STRING },
                    language: { type: Type.STRING },
                    code: { type: Type.STRING },
                    explanation: { type: Type.STRING }
                  },
                  required: ['fileName', 'language', 'code', 'explanation']
                }
              },
              gettingStartedCommands: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              recommendedPackages: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ['projectName', 'projectGoal', 'targetRole', 'folderStructure', 'featuresStepByStep', 'boilerplateCode', 'gettingStartedCommands']
          }
        }
      });

      if (response.text) {
        const blueprintData = JSON.parse(response.text);
        res.json({
          ...blueprintData,
          generatedAt: new Date().toLocaleDateString(),
          modelPowered: true
        });
        return;
      }
    } catch (err) {
      console.warn('Gemini blueprint generation failed, falling back to blueprintEngine:', err);
    }
  }

  // Fallback blueprint engine
  const fallbackBlueprint = generateBlueprintFallback(projectName, role, techStack, shortDescription);
  res.json(fallbackBlueprint);
});

// GitHub & Portfolio Auto-Auditor Endpoint
app.post('/api/audit-github', async (req: Request, res: Response) => {
  const { githubInput, claimedSkills, targetRole } = req.body;

  if (!githubInput || typeof githubInput !== 'string') {
    res.status(400).json({ error: 'GitHub username or repository link is required.' });
    return;
  }

  const auditResult = await auditGitHubProfile(
    githubInput,
    claimedSkills || [],
    targetRole || 'Full-Stack Developer'
  );

  res.json(auditResult);
});

// Vite or Static file serving
async function setupServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Career & Skill-Gap Navigator server running at http://localhost:${PORT}`);
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
