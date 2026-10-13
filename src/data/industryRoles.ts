import { TargetRoleBenchmark } from '../types/navigator';

export const INDUSTRY_ROLES: TargetRoleBenchmark[] = [
  {
    id: 'fullstack-dev',
    title: 'Full-Stack Developer',
    shortDescription: 'Builds end-to-end web applications covering responsive frontend, API backends, databases, and deployment pipelines.',
    salaryBenchmark: '$85,000 - $125,000 (Junior/Entry-Level)',
    demandTrend: '+16% YoY High Demand',
    requiredHardSkills: ['React', 'TypeScript', 'Node.js', 'REST APIs / GraphQL', 'PostgreSQL / SQL', 'Git', 'HTML5 & CSS3 / Tailwind', 'Docker Basics'],
    requiredSoftSkills: ['Agile / Scrum', 'Code Review Etiquette', 'Problem Solving', 'Effective Communication', 'Cross-functional Collaboration'],
    coreAcademicConcepts: ['Data Structures & Algorithms', 'Relational Database Design', 'Client-Server Architecture', 'Computer Networks (HTTP/TCP)', 'Web Security Basics'],
    industryExpectedTools: ['VS Code', 'GitHub / GitLab', 'Postman', 'Docker', 'Vite / Next.js', 'Prisma / Drizzle ORM', 'Vercel / AWS']
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    shortDescription: 'Analyzes complex datasets, trains statistical and ML models, and turns raw data into actionable predictive insights.',
    salaryBenchmark: '$90,000 - $130,000 (Junior/Entry-Level)',
    demandTrend: '+21% YoY Rapid Growth',
    requiredHardSkills: ['Python (pandas, numpy, scikit-learn)', 'SQL (Window Functions, Aggregations)', 'Statistical Modeling', 'Machine Learning Algorithms', 'Data Visualization (Matplotlib, Seaborn)', 'Git', 'Jupyter Notebooks'],
    requiredSoftSkills: ['Hypothesis Testing Mindset', 'Data Storytelling', 'Critical Thinking', 'Translating Business Needs to Math', 'Stakeholder Communication'],
    coreAcademicConcepts: ['Linear Algebra', 'Multivariate Calculus', 'Probability & Inferential Statistics', 'Optimization Theory', 'Database Systems'],
    industryExpectedTools: ['JupyterLab', 'PostgreSQL', 'Tableau / PowerBI', 'MLflow', 'Docker', 'AWS S3 / BigQuery', 'Git']
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX Designer',
    shortDescription: 'Creates user-centric interfaces, conducts heuristic research, and builds high-fidelity interactive design systems.',
    salaryBenchmark: '$78,000 - $115,000 (Junior/Entry-Level)',
    demandTrend: '+12% YoY Steady Demand',
    requiredHardSkills: ['Figma Design Systems', 'User Research & Persona Mapping', 'Wireframing & Interactive Prototyping', 'Information Architecture', 'Usability Testing', 'Design Tokens & Typography', 'WCAG 2.1 Accessibility'],
    requiredSoftSkills: ['Empathy', 'Active Listening', 'Storyboarding', 'Design Critique & Feedback Defense', 'Design-to-Dev Handoff'],
    coreAcademicConcepts: ['Human-Computer Interaction (HCI)', 'Cognitive Psychology in UX', 'Gestalt Principles', 'Color Theory', 'Information Design'],
    industryExpectedTools: ['Figma', 'FigJam', 'Miro', 'Maze / UserTesting', 'Storybook', 'Zeroheight', 'Lottie / Framer']
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    shortDescription: 'Automates cloud infrastructure, manages CI/CD pipelines, container orchestration, and guarantees system reliability.',
    salaryBenchmark: '$95,000 - $135,000 (Junior/Entry-Level)',
    demandTrend: '+24% YoY High Industry Shortage',
    requiredHardSkills: ['Linux Systems Administration', 'Docker Containerization', 'Kubernetes Orchestration', 'CI/CD (GitHub Actions / GitLab CI)', 'Infrastructure as Code (Terraform)', 'Cloud Platforms (AWS / GCP / Azure)', 'Bash / Python Scripting'],
    requiredSoftSkills: ['Incident Response Discipline', 'Root Cause Analysis (RCA)', 'Collaborative Troubleshooting', 'Documentation & Runbooks', 'Security Mindset'],
    coreAcademicConcepts: ['Operating Systems (Kernels, Processes)', 'Computer Networking (DNS, TCP/IP, VPC, Subnets)', 'Distributed Systems', 'System Security & Cryptography'],
    industryExpectedTools: ['Linux/Unix Terminal', 'Docker', 'Kubernetes (kubectl, Helm)', 'Terraform', 'Prometheus & Grafana', 'GitHub Actions', 'AWS CLI']
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    shortDescription: 'Defends digital assets against cyber threats, conducts vulnerability assessments, and enforces security compliance.',
    salaryBenchmark: '$82,000 - $120,000 (Junior/Entry-Level)',
    demandTrend: '+28% YoY Critical National Demand',
    requiredHardSkills: ['Network Packet Analysis (Wireshark)', 'Vulnerability Scanning (Nmap, Nessus)', 'Linux & Windows Security', 'SIEM Tools (Splunk / Elastic Security)', 'Python / Bash Scripting', 'OWASP Top 10 Security Risks', 'Incident Triage'],
    requiredSoftSkills: ['Analytical Rigor', 'High Ethical Standard', 'Crisis Communication', 'Attention to Detail', 'Report Writing'],
    coreAcademicConcepts: ['Applied Cryptography', 'Computer Networks & Firewalls', 'Operating Systems Internals', 'Risk Management Frameworks', 'Malware Basics'],
    industryExpectedTools: ['Wireshark', 'Nmap', 'Burp Suite Community', 'Kali Linux', 'Splunk Free', 'Autopsy / FTK Imager', 'Git']
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / Machine Learning Engineer',
    shortDescription: 'Builds, fine-tunes, and deploys production machine learning models, neural networks, and modern LLM pipelines.',
    salaryBenchmark: '$98,000 - $142,000 (Junior/Entry-Level)',
    demandTrend: '+35% YoY Explosive Growth',
    requiredHardSkills: ['PyTorch or TensorFlow', 'Python Architecture & Type Hinting', 'LLM APIs & Prompt Engineering', 'RAG (Retrieval-Augmented Generation)', 'Vector Databases (Pinecone, Chroma)', 'Model Serving & APIs (FastAPI)', 'Docker for ML'],
    requiredSoftSkills: ['Research Paper Translation', 'Algorithmic Intuition', 'Scientific Experimentation Discipline', 'Ethical AI & Bias Mitigation', 'Presentation of Model Findings'],
    coreAcademicConcepts: ['Deep Learning (Transformers, CNNs)', 'Vector Spaces & Matrix Decompositions', 'Loss Functions & Backpropagation', 'Information Retrieval', 'Computational Complexity'],
    industryExpectedTools: ['PyTorch', 'Hugging Face Transformers', 'FastAPI', 'ChromaDB / Qdrant', 'Weights & Biases (WandB)', 'Docker', 'CUDA / GPU compute']
  }
];

export interface PresetStudentProfile {
  id: string;
  name: string;
  avatarSeed: string;
  major: string;
  year: string;
  university: string;
  targetRoleId: string;
  tagline: string;
  cvText: string;
}

export const SAMPLE_STUDENT_PROFILES: PresetStudentProfile[] = [
  {
    id: 'maya-fullstack',
    name: 'Maya Lin',
    avatarSeed: 'ML',
    major: 'Computer Science (B.S.)',
    year: 'Junior (Class of 2027)',
    university: 'State Polytechnic Institute',
    targetRoleId: 'fullstack-dev',
    tagline: 'Academic coursework completed, needs modern React/TypeScript, production DB & deployment depth',
    cvText: `Maya Lin
Email: maya.lin@statepoly.edu | GitHub: github.com/mayalin-cs | LinkedIn: linkedin.com/in/mayalin-dev

EDUCATION
State Polytechnic Institute — B.S. in Computer Science (Expected May 2027)
GPA: 3.72 / 4.0
Relevant Coursework:
- CS 101: Introduction to Programming (Python)
- CS 201: Data Structures & Algorithms (Java)
- CS 240: Discrete Mathematics & Logic
- CS 320: Database Systems & Relational Modeling (SQL)
- CS 341: Computer Systems & Architecture

SKILLS
- Programming Languages: Python, Java, C (Basic), HTML, CSS, JavaScript (ES6)
- Databases: SQLite, basic MySQL queries
- Tools & Technologies: Git, GitHub, Eclipse, VS Code, Linux bash basics
- Methodologies & Soft Skills: Team project collaboration, technical presentations, problem solving

ACADEMIC PROJECTS
1. Campus Library Book Finder (Java & SQLite)
- Built a command-line and simple Java Swing application for searching book availability by ISBN.
- Implemented binary search trees to quickly index 5,000 sample library records.
- Wrote basic SQL queries to insert and update loan statuses.

2. Weather Query CLI (Python)
- Created a Python script fetching JSON data from a public weather API using the requests library.
- Formatted output in console and handled HTTP errors with try/except blocks.

3. Student Club Website (HTML/CSS)
- Designed a static 3-page website for the university Robotics club using pure HTML5 and CSS flexbox.`
  },
  {
    id: 'marcus-data',
    name: 'Marcus Vance',
    avatarSeed: 'MV',
    major: 'Applied Mathematics & Statistics (B.S.)',
    year: 'Senior (Class of 2026)',
    university: 'Metropolitan University',
    targetRoleId: 'data-scientist',
    tagline: 'Strong mathematical modeling and Python stats, lacks SQL window functions and end-to-end ML pipelines',
    cvText: `Marcus Vance
Email: marcus.vance@metrou.edu | Portfolio: github.com/marcus-math

EDUCATION
Metropolitan University — B.S. in Applied Mathematics & Statistics (Expected Dec 2026)
GPA: 3.85 / 4.0
Relevant Coursework:
- MATH 310: Multivariate Calculus & Differential Equations
- MATH 340: Linear Algebra & Matrix Analysis
- STAT 401: Probability & Mathematical Statistics
- STAT 420: Applied Regression Analysis & ANOVA
- CS 150: Computing in Python for Scientists

SKILLS
- Technical Skills: Python (NumPy, SciPy, Matplotlib, Pandas), R, LaTeX, basic SQL
- Statistical Methods: Hypothesis Testing (t-tests, ANOVA), Ordinary Least Squares regression, Monte Carlo simulation
- Soft Skills: Analytical reasoning, academic research writing, peer tutoring

PROJECTS & RESEARCH
1. Campus Dining Hall Demand Forecasting (Undergraduate Research)
- Processed 6 months of historical swipe card data using Pandas and cleaned missing timestamps.
- Built linear and polynomial regression models to forecast peak lunchtime crowds with 82% R² accuracy.
- Visualized trend charts and seasonal anomalies using Matplotlib.

2. COVID Mobility Correlation Study (Class Project)
- Cleaned open government mobility datasets using Python.
- Evaluated Pearson and Spearman correlation matrices across urban transit utilization patterns.`
  },
  {
    id: 'elena-devops',
    name: 'Elena Rostova',
    avatarSeed: 'ER',
    major: 'Computer Engineering (B.S.)',
    year: 'Senior (Class of 2026)',
    university: 'Western Tech University',
    targetRoleId: 'devops-engineer',
    tagline: 'Firm OS kernels and networking theory, lacks production Docker/K8s, Terraform and CI/CD automation',
    cvText: `Elena Rostova
Email: erostova@westerntech.edu | GitHub: github.com/elena-systems

EDUCATION
Western Tech University — B.S. in Computer Engineering (Graduation May 2026)
GPA: 3.68 / 4.0
Relevant Coursework:
- CE 302: Operating Systems Internals & Memory Management (C/C++)
- CE 350: Computer Networks & Protocols (TCP/IP, sockets)
- CE 410: Distributed Embedded Systems
- CS 210: Algorithms & Data Structures

SKILLS
- Languages: C, C++, Bash scripting, basic Python
- Systems & OS: Linux (Ubuntu/Debian CLI), POSIX threads, Socket programming, Makefiles
- Tools: Git, Vim, GDB, Wireshark (packet inspection)
- Soft Skills: Agile sprints (senior capstone team lead), root cause troubleshooting, system documentation

PROJECTS
1. Multi-Threaded HTTP/1.0 Web Server (C)
- Developed a lightweight HTTP file server using BSD sockets and thread pooling.
- Handled concurrent client requests with mutex locks and non-blocking I/O.
- Benchmarked response latency under synthetic load using ApacheBench.

2. Custom Linux Shell Emulator (C)
- Implemented process management with fork(), execvp(), and signal handling for SIGINT and SIGTSTP.
- Handled input/output file redirection and command piping (|).`
  },
  {
    id: 'sophia-uiux',
    name: 'Sophia Patel',
    avatarSeed: 'SP',
    major: 'Human-Centered Informatics & Design (B.S.)',
    year: 'Junior (Class of 2027)',
    university: 'Creative Arts & Tech College',
    targetRoleId: 'ui-ux-designer',
    tagline: 'Creative visual design & user research talent, needs production design systems & design-to-code handoff',
    cvText: `Sophia Patel
Email: sophia.design@catc.edu | Portfolio: behance.net/sophiadesign | Figma: figma.com/@sophiap

EDUCATION
Creative Arts & Tech College — B.S. in Human-Centered Informatics (Expected 2027)
GPA: 3.79 / 4.0
Relevant Coursework:
- INF 200: Foundations of Human-Computer Interaction
- INF 240: User Experience Research & Fieldwork Methods
- DES 150: Visual Design Fundamentals & Typography
- CS 110: Web Fundamentals (HTML/CSS)

SKILLS
- Design Tools: Figma, FigJam, Adobe Illustrator, Miro
- Research & Methods: Semi-structured user interviews, usability testing, journey mapping, card sorting, low-to-high fidelity wireframing
- Basic Code: HTML5, CSS3, basic JavaScript concepts
- Soft Skills: Empathy, design critiquing, client interview facilitation

PROJECTS
1. MealConnect - Student Food Sharing App Concept (Figma Prototype)
- Conducted 12 student interviews to identify food waste patterns in campus residence dorms.
- Created personas, user journey maps, and wireframes in Figma.
- Built a clickable interactive prototype with 20+ screens and conducted usability testing with 5 participants, achieving an 85% task completion rate.

2. Campus Accessibility Audit (Course Capstone)
- Audited the university student registration portal against WCAG 2.1 AA standards.
- Documented color contrast failures, keyboard navigation traps, and proposed a redesigned interface in Figma.`
  }
];
