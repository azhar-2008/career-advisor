export interface StudentProfile {
  studentName: string;
  major: string;
  university?: string;
  graduationYear?: string;
  cvRawText: string;
}

export interface ParsedCapabilities {
  hardSkills: Array<{
    name: string;
    category: string; // e.g., 'Languages', 'Frameworks', 'Databases', 'Tools'
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
    evidence?: string;
  }>;
  softSkills: Array<{
    name: string;
    evidence?: string;
  }>;
  academicCourses: Array<{
    name: string;
    code?: string;
    relevance: string;
  }>;
  projects: Array<{
    title: string;
    techStack: string[];
    description: string;
    hasIndustryRelevance?: boolean;
  }>;
}

export interface TargetRoleBenchmark {
  id: string;
  title: string;
  shortDescription: string;
  salaryBenchmark?: string;
  demandTrend?: string;
  requiredHardSkills: string[];
  requiredSoftSkills: string[];
  coreAcademicConcepts: string[];
  industryExpectedTools: string[];
}

export interface SkillGapItem {
  skill: string;
  category?: string;
  studentEvidence?: string;
  industryRequirement?: string;
  importance?: 'Critical' | 'High' | 'Medium';
  gapExplanation?: string;
  whyNeeded?: string;
}

export interface SkillGapEvaluation {
  matchedSkills: SkillGapItem[];
  underdevelopedSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
}

export interface RoadmapPhase {
  phaseNumber: number;
  phaseName: string;
  targetFocus: string;
  actionItems: string[];
  estimatedWeeks: number;
}

export interface PortfolioProject {
  id: string;
  projectName: string;
  shortDescription: string;
  provesSkills: string[];
  suggestedTechStack: string[];
  keyArchitectureSteps: string[];
}

export interface LearningResource {
  name: string;
  platform: string;
  resourceType: 'freeCodeCamp' | 'Coursera' | 'Documentation' | 'GitHub' | 'Interactive' | 'Certification';
  whatToLearn: string;
  url?: string;
}

export interface NavigatorAnalysisResult {
  studentName: string;
  targetRole: string;
  readinessScore: number; // 0-100
  parsedCapabilities: ParsedCapabilities;
  skillGapAnalysis: SkillGapEvaluation;
  careerRoadmap: RoadmapPhase[];
  recommendedProjects: PortfolioProject[];
  learningResources: LearningResource[];
  standardMarkdown: string;
  rawJsonExport: Record<string, unknown>;
  generatedAt: string;
  modelPowered: boolean;
}

export interface AnalyzeRequestPayload {
  cvText: string;
  studentName?: string;
  targetRole: string;
  roleRequirementsOverride?: string;
  mode?: 'comprehensive' | 'quick';
}

export interface BlueprintFeatureStep {
  stepNumber: number;
  featureTitle: string;
  description: string;
  implementationTips: string[];
}

export interface BoilerplateFile {
  fileName: string;
  language: string;
  code: string;
  explanation: string;
}

export interface ProjectBlueprint {
  projectId: string;
  projectName: string;
  projectGoal: string;
  targetRole: string;
  folderStructure: string;
  featuresStepByStep: BlueprintFeatureStep[];
  boilerplateCode: BoilerplateFile[];
  gettingStartedCommands: string[];
  recommendedPackages?: string[];
  generatedAt?: string;
}

export interface AuditedRepository {
  name: string;
  url: string;
  description: string;
  primaryLanguage: string;
  topics: string[];
  stars: number;
  forks: number;
  lastUpdated: string;
  readmeQuality: 'High' | 'Moderate' | 'Missing';
  verifiedSkills: string[];
  auditNotes: string;
}

export interface GitHubAuditResult {
  username: string;
  profileUrl: string;
  auditScore: number; // 0 - 100 Proof-of-Work score
  totalPublicRepos: number;
  repositories: AuditedRepository[];
  verifiedSkills: Array<{
    skill: string;
    backedByRepo: string;
    evidence: string;
  }>;
  unverifiedSkills: Array<{
    skill: string;
    recommendation: string;
  }>;
  recruiterReadinessSuggestions: string[];
  auditedAt: string;
}


