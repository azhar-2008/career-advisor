import {
  NavigatorAnalysisResult,
  ParsedCapabilities,
  SkillGapEvaluation,
  RoadmapPhase,
  PortfolioProject,
  LearningResource,
  TargetRoleBenchmark
} from '../types/navigator';
import { INDUSTRY_ROLES } from '../data/industryRoles';

export function formatStandardMarkdown(result: {
  readinessScore?: number;
  targetRole?: string;
  skillGapAnalysis?: SkillGapEvaluation;
  careerRoadmap?: RoadmapPhase[];
  recommendedProjects?: PortfolioProject[];
  learningResources?: LearningResource[];
}): string {
  const score = typeof result?.readinessScore === 'number' ? result.readinessScore : 0;
  const role = result?.targetRole || 'Target Role';
  const cleanTableField = (str: string) => (str || '').replace(/\|/g, '-').replace(/\n+/g, ' ').trim();

  const matchedList = result?.skillGapAnalysis?.matchedSkills || [];
  const underdevelopedList = result?.skillGapAnalysis?.underdevelopedSkills || [];
  const missingList = result?.skillGapAnalysis?.missingSkills || [];

  const matchedStr = matchedList.length > 0
    ? cleanTableField(matchedList.map(s => s.skill).join(', '))
    : 'None explicitly identified yet';

  const underdevelopedStr = underdevelopedList.length > 0
    ? cleanTableField(underdevelopedList.map(s => s.skill).join(', '))
    : 'None identified';

  const missingStr = missingList.length > 0
    ? cleanTableField(missingList.map(s => s.skill).join(', '))
    : 'None critical';

  const roadmap = result?.careerRoadmap || [];
  const p1 = roadmap.find(p => p.phaseNumber === 1) || {
    targetFocus: 'Core Knowledge Gaps',
    actionItems: ['Review foundational CS and domain concepts']
  };
  const p2 = roadmap.find(p => p.phaseNumber === 2) || {
    targetFocus: 'Build Real-World Projects',
    actionItems: ['Implement practical full-lifecycle project']
  };
  const p3 = roadmap.find(p => p.phaseNumber === 3) || {
    targetFocus: 'Portfolio & Job Application Readiness',
    actionItems: ['Resume optimization, GitHub polishing, mock interviews']
  };

  const formatActions = (items: string[] | undefined) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return 'Complete foundational coursework and review key domain concepts';
    }
    return items.join('; ');
  };

  const projectsList = result?.recommendedProjects || [];
  const projectsMarkdown = projectsList.length > 0
    ? projectsList.map((proj, idx) => {
        return `${idx + 1}. **${proj.projectName || `Project ${idx + 1}`}**: ${proj.shortDescription || 'Applied project demonstrating required industry skills.'}`;
      }).join('\n')
    : '1. **Portfolio Project**: Build an end-to-end application demonstrating core competencies.';

  const resourcesList = result?.learningResources || [];
  const resourcesMarkdown = resourcesList.length > 0
    ? resourcesList.map(res => {
        return `* [${res.name || 'Resource'}${res.platform ? ` / ${res.platform}` : ''}] - ${res.whatToLearn || 'Skill curriculum'}`;
      }).join('\n')
    : '* [Official Documentation] - Read system architecture guides';

  return `## 📊 Profile Readiness Score: ${score}% for ${role}

### 🔍 Skill Gap Analysis
| Category | Identified Skills |
| :--- | :--- |
| **Matched Skills** | ${matchedStr} |
| **Underdeveloped Skills** | ${underdevelopedStr} |
| **Missing Skills** | ${missingStr} |

---

### 🗺️ Step-by-Step Career Roadmap
* **Phase 1: Fill Core Knowledge Gaps**
  * Target: ${p1.targetFocus || 'Core Fundamentals'}
  * Action Items: ${formatActions(p1.actionItems)}
* **Phase 2: Build Real-World Projects**
  * Target: ${p2.targetFocus || 'Applied Projects'}
  * Action Items: ${formatActions(p2.actionItems)}
* **Phase 3: Portfolio & Job Application Readiness**
  * Target: ${p3.targetFocus || 'Career Polish'}
  * Action Items: ${formatActions(p3.actionItems)}

---

### 💡 Recommended Portfolio Projects
${projectsMarkdown}

---

### 📚 Learning Resources
${resourcesMarkdown}`;
}

export function analyzeProfileFallback(
  cvText: string,
  targetRoleIdOrTitle: string,
  studentNameInput?: string
): NavigatorAnalysisResult {
  const normalizedRole = targetRoleIdOrTitle.toLowerCase();
  const benchmark: TargetRoleBenchmark = INDUSTRY_ROLES.find(
    r => r.id === targetRoleIdOrTitle || r.title.toLowerCase().includes(normalizedRole) || normalizedRole.includes(r.title.toLowerCase())
  ) || INDUSTRY_ROLES[0];

  const lowerCv = cvText.toLowerCase();

  // 1. Parse Student Capabilities
  const firstLine = cvText.trim().split('\n')[0] || '';
  const detectedName = studentNameInput || (firstLine.length < 35 && !firstLine.includes(':') ? firstLine.trim() : 'University Student');

  // Hard skills parsing
  const commonHardSkills = [
    { name: 'Python', category: 'Languages' },
    { name: 'Java', category: 'Languages' },
    { name: 'JavaScript', category: 'Languages' },
    { name: 'TypeScript', category: 'Languages' },
    { name: 'C++', category: 'Languages' },
    { name: 'C', category: 'Languages' },
    { name: 'React', category: 'Frontend' },
    { name: 'HTML5 & CSS3', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'SQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'MongoDB', category: 'Databases' },
    { name: 'Git', category: 'Tools' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'Linux', category: 'Systems' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Figma', category: 'Design' },
    { name: 'REST APIs', category: 'Architecture' },
    { name: 'Pandas', category: 'Data/ML' },
    { name: 'PyTorch', category: 'Data/ML' },
    { name: 'Wireshark', category: 'Security' }
  ];

  const parsedHardSkills: ParsedCapabilities['hardSkills'] = [];
  for (const skill of commonHardSkills) {
    if (lowerCv.includes(skill.name.toLowerCase())) {
      // Determine proficiency based on whether it appears in projects or basic skills
      const inProject = lowerCv.split(/projects|experience/i)[1]?.includes(skill.name.toLowerCase());
      parsedHardSkills.push({
        name: skill.name,
        category: skill.category,
        proficiency: inProject ? 'Intermediate' : 'Beginner',
        evidence: inProject ? `Demonstrated in applied coursework/project section` : `Mentioned in skill section`
      });
    }
  }

  // Soft skills parsing
  const commonSoftSkills = ['Agile', 'Scrum', 'Problem Solving', 'Communication', 'Collaboration', 'Research', 'Leadership', 'Critical Thinking'];
  const parsedSoftSkills: ParsedCapabilities['softSkills'] = [];
  for (const soft of commonSoftSkills) {
    if (lowerCv.includes(soft.toLowerCase())) {
      parsedSoftSkills.push({
        name: soft,
        evidence: `Extracted from resume experience statements`
      });
    }
  }

  // Academic courses parsing
  const parsedCourses: ParsedCapabilities['academicCourses'] = [];
  const lines = cvText.split('\n');
  for (const line of lines) {
    if (/CS\s*\d+|CE\s*\d+|MATH\s*\d+|STAT\s*\d+|INF\s*\d+|DES\s*\d+|course|structures|algorithms|database|operating systems/i.test(line)) {
      const cleanLine = line.replace(/^[-\s*•]+/, '').trim();
      if (cleanLine.length > 5 && cleanLine.length < 100) {
        parsedCourses.push({
          name: cleanLine,
          relevance: 'University Academic Curriculum'
        });
      }
    }
  }

  // Projects parsing
  const parsedProjects: ParsedCapabilities['projects'] = [];
  const projectSplits = cvText.split(/(?:\d+\.|\bproject\b|\baccomplistment\b)/i);
  for (let i = 1; i < Math.min(projectSplits.length, 4); i++) {
    const chunk = projectSplits[i].trim();
    const chunkLines = chunk.split('\n').filter(l => l.trim().length > 0);
    if (chunkLines.length > 0) {
      const title = chunkLines[0].substring(0, 50).trim();
      parsedProjects.push({
        title: title || `Academic Project ${i}`,
        techStack: parsedHardSkills.slice(0, 3).map(s => s.name),
        description: chunkLines.slice(1, 3).join(' ').substring(0, 180) || 'Coursework assignment and implementation.'
      });
    }
  }

  // 2. Skill Gap Analysis
  const matchedSkills: SkillGapEvaluation['matchedSkills'] = [];
  const underdevelopedSkills: SkillGapEvaluation['underdevelopedSkills'] = [];
  const missingSkills: SkillGapEvaluation['missingSkills'] = [];

  for (const reqSkill of benchmark.requiredHardSkills) {
    const reqLower = reqSkill.toLowerCase();
    const foundSkill = parsedHardSkills.find(s => 
      reqLower.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(reqLower.split(' ')[0])
    );

    if (foundSkill) {
      if (foundSkill.proficiency === 'Intermediate' || foundSkill.proficiency === 'Advanced') {
        matchedSkills.push({
          skill: reqSkill,
          studentEvidence: foundSkill.evidence || 'Applied in candidate projects',
          industryRequirement: `Core requirement for ${benchmark.title}`,
          importance: 'High'
        });
      } else {
        underdevelopedSkills.push({
          skill: reqSkill,
          studentEvidence: 'Has foundational knowledge, but lacks complex production implementation',
          industryRequirement: `Production experience with standard industry frameworks required`,
          gapExplanation: 'Candidate has conceptual understanding or basic coursework, but lacks practical system depth.'
        });
      }
    } else {
      missingSkills.push({
        skill: reqSkill,
        industryRequirement: `Critical industry baseline requirement`,
        importance: 'Critical',
        whyNeeded: `Industry roles expect proficiency in ${reqSkill} for day-to-day development.`
      });
    }
  }

  // 3. Readiness Score Calculation
  // Formula: (Matched * 1.0 + Underdeveloped * 0.45) / Total Required * 100
  const totalBenchSkills = benchmark.requiredHardSkills.length;
  const rawScore = totalBenchSkills > 0
    ? Math.round(((matchedSkills.length * 1.0 + underdevelopedSkills.length * 0.45) / totalBenchSkills) * 85 + 10)
    : 50;
  const readinessScore = Math.max(25, Math.min(95, rawScore));

  // 4. Step-by-Step Career Roadmap
  const p1Actions: string[] = [
    `Master foundational syntax and theory for ${missingSkills.slice(0, 2).map(m => m.skill).join(' & ') || 'target role requirements'}.`,
    `Review system design principles, data flow models, and industry style guides.`,
    `Complete targeted tutorials on core tools: ${benchmark.industryExpectedTools.slice(0, 2).join(', ')}.`
  ];

  const p2Actions: string[] = [
    `Architect and build an end-to-end applied project integrating ${missingSkills[0]?.skill || 'modern APIs'} with persistent database storage.`,
    `Implement comprehensive test coverage (unit/integration) and structured error handling.`,
    `Configure automated CI/CD workflows and containerization using Docker.`
  ];

  const p3Actions: string[] = [
    `Publish live hosted demo with interactive documentation and clean GitHub README with architecture diagrams.`,
    `Conduct targeted behavioral and technical mock interviews focusing on data structures and role-specific scenarios.`,
    `Optimize student resume using STAR metric-based bullet points targeting ${benchmark.title} openings.`
  ];

  const careerRoadmap: RoadmapPhase[] = [
    {
      phaseNumber: 1,
      phaseName: 'Phase 1: Fill Core Knowledge Gaps',
      targetFocus: missingSkills.length > 0 ? missingSkills.slice(0, 2).map(s => s.skill).join(', ') : 'Advanced Concepts',
      actionItems: p1Actions,
      estimatedWeeks: 4
    },
    {
      phaseNumber: 2,
      phaseName: 'Phase 2: Build Real-World Projects',
      targetFocus: 'End-to-End Production Applications',
      actionItems: p2Actions,
      estimatedWeeks: 6
    },
    {
      phaseNumber: 3,
      phaseName: 'Phase 3: Portfolio & Job Application Readiness',
      targetFocus: 'Industry Polish, Showcase & Interview Prep',
      actionItems: p3Actions,
      estimatedWeeks: 3
    }
  ];

  // 5. Recommended Portfolio Projects tailored to role
  const recommendedProjects: PortfolioProject[] = getProjectsForRole(benchmark, missingSkills, underdevelopedSkills);

  // 6. Learning Resources
  const learningResources: LearningResource[] = getResourcesForRole(benchmark, missingSkills);

  const standardMarkdown = formatStandardMarkdown({
    readinessScore,
    targetRole: benchmark.title,
    skillGapAnalysis: { matchedSkills, underdevelopedSkills, missingSkills },
    careerRoadmap,
    recommendedProjects,
    learningResources
  });

  return {
    studentName: detectedName,
    targetRole: benchmark.title,
    readinessScore,
    parsedCapabilities: {
      hardSkills: parsedHardSkills,
      softSkills: parsedSoftSkills,
      academicCourses: parsedCourses,
      projects: parsedProjects
    },
    skillGapAnalysis: {
      matchedSkills,
      underdevelopedSkills,
      missingSkills
    },
    careerRoadmap,
    recommendedProjects,
    learningResources,
    standardMarkdown,
    rawJsonExport: {
      metadata: {
        platform: 'Career and Skill-Gap Navigator',
        targetRole: benchmark.title,
        readinessScore,
        generatedAt: new Date().toISOString()
      },
      parsedStudent: {
        name: detectedName,
        hardSkillsCount: parsedHardSkills.length,
        softSkillsCount: parsedSoftSkills.length,
        coursesCount: parsedCourses.length
      },
      gapMetrics: {
        matchedCount: matchedSkills.length,
        underdevelopedCount: underdevelopedSkills.length,
        missingCount: missingSkills.length
      },
      roadmapPhases: careerRoadmap,
      portfolioBlueprints: recommendedProjects,
      resources: learningResources
    },
    generatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    modelPowered: false
  };
}

function getProjectsForRole(
  benchmark: TargetRoleBenchmark,
  missing: SkillGapEvaluation['missingSkills'],
  underdeveloped: SkillGapEvaluation['underdevelopedSkills']
): PortfolioProject[] {
  const missingNames = missing.map(m => m.skill);

  if (benchmark.id === 'data-scientist') {
    return [
      {
        id: 'ds-proj-1',
        projectName: 'Customer Churn & Lifetime Value Predictive Engine',
        shortDescription: 'Build an end-to-end machine learning pipeline that ingests transactional data, engineers temporal features, trains gradient-boosted models, and serves predictive probabilities via a REST API. Proves missing production SQL and model serving capabilities.',
        provesSkills: ['Python (scikit-learn)', 'SQL Window Functions', 'Model Deployment', 'Data Storytelling'],
        suggestedTechStack: ['Python', 'PostgreSQL', 'FastAPI', 'Streamlit', 'Docker'],
        keyArchitectureSteps: [
          'Extract raw transactional events and write SQL window functions to compute 30-day rolling spend and activity decay.',
          'Build an automated Scikit-Learn Pipeline with cross-validation and SHAP explainability values.',
          'Deploy model inference endpoint in a lightweight FastAPI container.'
        ]
      },
      {
        id: 'ds-proj-2',
        projectName: 'Algorithmic Financial Sentiment & Trend Intelligence Dashboard',
        shortDescription: 'Extracts real-time financial headlines, applies NLP sentiment scoring, and visualizes correlation with market volatility. Proves underdeveloped data visualization and statistical hypothesis testing in real market conditions.',
        provesSkills: ['NLP Transformers', 'Time-Series Analysis', 'Interactive Visualization', 'Git'],
        suggestedTechStack: ['Python', 'Hugging Face', 'Plotly / Dash', 'GitHub Actions'],
        keyArchitectureSteps: [
          'Scrape or query financial news feeds and compute sentiment polarity scores.',
          'Run Granger causality and Pearson correlation tests against time-series price data.',
          'Host an interactive dashboard with live filtering and automated data updates.'
        ]
      }
    ];
  }

  if (benchmark.id === 'devops-engineer') {
    return [
      {
        id: 'devops-proj-1',
        projectName: 'Automated Multi-Environment GitOps Cloud Pipeline',
        shortDescription: 'Construct a declarative Infrastructure-as-Code repository provisioning an AWS or GCP cluster with Terraform, complete with automated GitHub Actions CI/CD and ArgoCD GitOps deployments. Proves missing Terraform and Kubernetes orchestration skills.',
        provesSkills: ['Terraform', 'Kubernetes', 'GitHub Actions', 'Docker'],
        suggestedTechStack: ['Terraform', 'Kubernetes (Minikube/EKS)', 'GitHub Actions', 'ArgoCD'],
        keyArchitectureSteps: [
          'Write modular Terraform templates provisioning VPC, security groups, and container registry.',
          'Containerize a multi-tier microservice with health checks and resource limits.',
          'Establish a zero-downtime rolling update deployment triggered by pull requests.'
        ]
      },
      {
        id: 'devops-proj-2',
        projectName: 'Observability & Automated Incident Recovery Stack',
        shortDescription: 'Deploy Prometheus and Grafana monitoring agents across a distributed cluster with customized alert thresholds, Slack webhooks, and automated self-healing scripts. Demonstrates production system reliability and root cause analysis depth.',
        provesSkills: ['Prometheus & Grafana', 'Linux Systems Admin', 'Bash Scripting', 'Site Reliability'],
        suggestedTechStack: ['Prometheus', 'Grafana', 'Docker Compose', 'Bash', 'Alertmanager'],
        keyArchitectureSteps: [
          'Instrument application metrics (latency, error rates, CPU/Memory saturation).',
          'Configure Grafana dashboards reflecting Golden Signals (Latency, Traffic, Errors, Saturation).',
          'Write a watchdog daemon that triggers automated container restart and sends webhook triage notifications.'
        ]
      }
    ];
  }

  if (benchmark.id === 'ui-ux-designer') {
    return [
      {
        id: 'ui-proj-1',
        projectName: 'Accessible Health & Wellness Multi-Platform Design System',
        shortDescription: 'Design an exhaustive enterprise Figma design system with strict WCAG 2.1 AAA token variables, dark/light semantic modes, responsive auto-layout components, and an interactive prototype tested on real users. Proves industry design system and accessibility competency.',
        provesSkills: ['Figma Design Tokens', 'WCAG Accessibility', 'Usability Testing', 'Interactive Prototyping'],
        suggestedTechStack: ['Figma', 'FigJam', 'Tokens Studio', 'Maze User Testing'],
        keyArchitectureSteps: [
          'Establish foundational color scales with automated 4.5:1 / 7:1 contrast ratios.',
          'Build atomic components with comprehensive states (default, hover, active, focused, disabled).',
          'Conduct unmoderated usability tests on 10 users and publish synthesized heuristic findings.'
        ]
      },
      {
        id: 'ui-proj-2',
        projectName: 'EdTech Student Course Collaboration Mobile & Web Experience',
        shortDescription: 'Conduct contextual student user interviews, create detailed persona empathy maps, wireframe low-fidelity flows, and deliver an interactive micro-animated prototype ready for developer handoff with documentation. Proves end-to-end design thinking.',
        provesSkills: ['User Research', 'Information Architecture', 'Developer Handoff', 'Framer'],
        suggestedTechStack: ['Figma', 'Miro', 'Framer / Storybook'],
        keyArchitectureSteps: [
          'Document user pain points, affinity diagrams, and task success metrics.',
          'Create responsive mobile and desktop screen variations with clear component specs.',
          'Provide interactive handoff specs detailing spacing, transitions, and responsive behavior.'
        ]
      }
    ];
  }

  // Default Full-Stack Developer
  return [
    {
      id: 'fs-proj-1',
      projectName: 'Full-Stack Team Project Management Platform with Real-Time Collaboration',
      shortDescription: 'Architect a responsive web application featuring React, TypeScript, a secure Node.js REST/WebSocket backend, and PostgreSQL with migrations. Solves the missing modern framework and relational database gap by delivering production authentication and CRUD operations.',
      provesSkills: ['React & TypeScript', 'PostgreSQL / SQL', 'REST APIs', 'Node.js Backend'],
      suggestedTechStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Docker'],
      keyArchitectureSteps: [
        'Model normalized relational database schema with foreign keys, indexes, and parameterized queries.',
        'Implement JWT authentication, role-based access control, and validated API endpoints.',
        'Build responsive frontend components with optimistic UI updates and live state synchronization.'
      ]
    },
    {
      id: 'fs-proj-2',
      projectName: 'E-Commerce Marketplace with Automated Stripe Checkout & Webhook Handling',
      shortDescription: 'Build an end-to-end transactional storefront complete with inventory tracking, server-side order validation, secure third-party payment integration, and Docker container deployment. Proves underdeveloped state management and deployment skills.',
      provesSkills: ['Payment Webhooks', 'Docker Containerization', 'State Management', 'Git CI/CD'],
      suggestedTechStack: ['React / Vite', 'Express', 'PostgreSQL / Prisma', 'Stripe API', 'Docker'],
      keyArchitectureSteps: [
        'Design idempotent webhook handler ensuring order integrity during network failures.',
        'Implement product search, category filtering, and shopping cart persistence in browser storage.',
        'Package client and server in multi-stage Dockerfiles and deploy to a cloud container runtime.'
      ]
    }
  ];
}

function getResourcesForRole(
  benchmark: TargetRoleBenchmark,
  missing: SkillGapEvaluation['missingSkills']
): LearningResource[] {
  if (benchmark.id === 'data-scientist') {
    return [
      {
        name: 'Full Stack Deep Learning & Production ML',
        platform: 'GitHub & Official Site',
        resourceType: 'GitHub',
        whatToLearn: 'Best practices for shipping ML models, automated testing, and inference pipelines',
        url: 'https://fullstackdeeplearning.com'
      },
      {
        name: 'Mode SQL Tutorial & Advanced Window Functions',
        platform: 'Mode Analytics',
        resourceType: 'Documentation',
        whatToLearn: 'Master partition-by, lead, lag, and complex business analytics queries',
        url: 'https://mode.com/sql-tutorial/'
      },
      {
        name: 'Scikit-Learn Official User Guide',
        platform: 'Documentation',
        resourceType: 'Documentation',
        whatToLearn: 'Preprocessing, feature selection, pipeline architecture, and hyperparameter tuning',
        url: 'https://scikit-learn.org/stable/user_guide.html'
      },
      {
        name: 'Data Science & Machine Learning Course',
        platform: 'freeCodeCamp',
        resourceType: 'freeCodeCamp',
        whatToLearn: 'Hands-on projects covering regression, classification, and clustering',
        url: 'https://www.freecodecamp.org/learn'
      }
    ];
  }

  if (benchmark.id === 'devops-engineer') {
    return [
      {
        name: 'Docker & Kubernetes Fundamentals',
        platform: 'freeCodeCamp',
        resourceType: 'freeCodeCamp',
        whatToLearn: 'Multi-stage Dockerfiles, networking, volumes, pods, deployments, and services',
        url: 'https://www.freecodecamp.org/news/the-docker-handbook/'
      },
      {
        name: 'Terraform Associate HashiCorp Tutorials',
        platform: 'Documentation',
        resourceType: 'Documentation',
        whatToLearn: 'Declarative cloud infrastructure provisioning, state locks, and reusable modules',
        url: 'https://developer.hashicorp.com/terraform/tutorials'
      },
      {
        name: 'DevOps Roadmap by Kamran Ahmed',
        platform: 'GitHub',
        resourceType: 'GitHub',
        whatToLearn: 'Interactive step-by-step career path from Linux to CI/CD and Cloud',
        url: 'https://roadmap.sh/devops'
      },
      {
        name: 'Site Reliability Engineering (SRE) Book',
        platform: 'Google SRE',
        resourceType: 'Documentation',
        whatToLearn: 'SLIs, SLOs, error budgets, monitoring, and post-mortem incident culture',
        url: 'https://sre.google/books/'
      }
    ];
  }

  if (benchmark.id === 'ui-ux-designer') {
    return [
      {
        name: 'Figma Auto-Layout & Design Tokens Guide',
        platform: 'Documentation',
        resourceType: 'Documentation',
        whatToLearn: 'Master modern variable collections, auto-layout constraints, and typography scales',
        url: 'https://help.figma.com'
      },
      {
        name: 'Web Content Accessibility Guidelines (WCAG) 2.1 Guide',
        platform: 'Documentation',
        resourceType: 'Documentation',
        whatToLearn: 'Contrast standards, keyboard accessibility, screen-reader focus, and semantic landmarks',
        url: 'https://www.w3.org/WAI/standards-guidelines/wcag/'
      },
      {
        name: 'Laws of UX',
        platform: 'Interactive',
        resourceType: 'Interactive',
        whatToLearn: 'Heuristic psychology principles (Fitts law, Hick law, Jakob law) applied to interface design',
        url: 'https://lawsofux.com'
      },
      {
        name: 'Refactoring UI & Design System Patterns',
        platform: 'GitHub',
        resourceType: 'GitHub',
        whatToLearn: 'Practical typography hierarchy, spatial spacing, and UI polish techniques',
        url: 'https://github.com'
      }
    ];
  }

  // Default Full-Stack Developer
  return [
    {
      name: 'Full Stack Open - University of Helsinki',
      platform: 'Documentation',
      resourceType: 'Documentation',
      whatToLearn: 'Deep dive into React, Redux, Node.js, Express, MongoDB/PostgreSQL, TypeScript, and CI/CD',
      url: 'https://fullstackopen.com/en/'
    },
    {
      name: 'The Odin Project - Full Stack JavaScript',
      platform: 'Interactive',
      resourceType: 'Interactive',
      whatToLearn: 'Curated curriculum with hands-on projects, Git branching workflows, and API architectures',
      url: 'https://www.theodinproject.com'
    },
    {
      name: 'PostgreSQL Official Documentation & Tutorial',
      platform: 'Documentation',
      resourceType: 'Documentation',
      whatToLearn: 'Relational modeling, indexing, foreign keys, transactions, and performance query plans',
      url: 'https://www.postgresql.org/docs/'
    },
    {
      name: 'freeCodeCamp Full-Stack Developer Certification',
      platform: 'freeCodeCamp',
      resourceType: 'freeCodeCamp',
      whatToLearn: 'Interactive coding exercises for modern frontend, backend APIs, and algorithms',
      url: 'https://www.freecodecamp.org/learn'
    }
  ];
}
