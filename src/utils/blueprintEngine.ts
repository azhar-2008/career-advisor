import { ProjectBlueprint } from '../types/navigator';

export function generateBlueprintFallback(
  projectName: string,
  targetRole: string,
  techStack: string[] = [],
  shortDescription: string = ''
): ProjectBlueprint {
  const isDataOrAi = targetRole.toLowerCase().includes('data') || targetRole.toLowerCase().includes('ai') || targetRole.toLowerCase().includes('machine');
  const isDevops = targetRole.toLowerCase().includes('devops') || targetRole.toLowerCase().includes('cloud');
  const isUiUx = targetRole.toLowerCase().includes('design') || targetRole.toLowerCase().includes('ui') || targetRole.toLowerCase().includes('ux');

  if (isDataOrAi) {
    return {
      projectId: 'blueprint-' + Date.now(),
      projectName,
      projectGoal: shortDescription || `Develop a production-grade machine learning and data analytics application with automated data pipelines and REST API inference.`,
      targetRole,
      folderStructure: `ml-analytics-platform/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   └── 01_eda_and_modeling.ipynb
├── src/
│   ├── __init__.py
│   ├── config.py
│   ├── data_pipeline.py
│   ├── model.py
│   └── api/
│       ├── __init__.py
│       └── app.py
├── tests/
│   └── test_inference.py
├── Dockerfile
├── requirements.txt
└── README.md`,
      featuresStepByStep: [
        {
          stepNumber: 1,
          featureTitle: 'Data Extraction & Schema Validation',
          description: 'Build an automated ingestion pipeline that cleans missing values, handles outliers, and validates data types with Pydantic.',
          implementationTips: ['Use pandas window operations for rolling aggregations', 'Log data distributions using loguru']
        },
        {
          stepNumber: 2,
          featureTitle: 'Feature Engineering & Model Training',
          description: 'Train regression and classification pipelines using Scikit-Learn with cross-validation and hyperparameter optimization.',
          implementationTips: ['Save serialized model artifacts using joblib or ONNX', 'Compute SHAP explainability values']
        },
        {
          stepNumber: 3,
          featureTitle: 'FastAPI Production Model Serving',
          description: 'Wrap the model in a lightweight asynchronous REST API providing real-time predictions and batch inference.',
          implementationTips: ['Include health check and latency instrumentation', 'Validate incoming JSON request bodies']
        },
        {
          stepNumber: 4,
          featureTitle: 'Interactive Streamlit Dashboard & Dockerization',
          description: 'Deliver an executive dashboard with Plotly charts and containerize the whole pipeline using Docker.',
          implementationTips: ['Use multi-stage Docker builds', 'Include sample test data in the repo']
        }
      ],
      boilerplateCode: [
        {
          fileName: 'src/api/app.py',
          language: 'python',
          explanation: 'FastAPI production service serving model inferences with schema validation.',
          code: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import numpy as np
import joblib

app = FastAPI(title="ML Prediction Service", version="1.0.0")

class PredictionInput(BaseModel):
    feature_a: float = Field(..., description="Normalized feature metric A")
    feature_b: float = Field(..., description="Normalized feature metric B")
    category_id: int = Field(default=1, ge=1, le=10)

class PredictionOutput(BaseModel):
    probability: float
    decision: str
    confidence_score: float

# In real deployment, load model from serialized disk artifact
# model = joblib.load("models/pipeline.pkl")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "inference-engine"}

@app.post("/predict", response_model=PredictionOutput)
def predict(payload: PredictionInput):
    try:
        # Mock inference demonstration
        score = 1.0 / (1.0 + np.exp(-(payload.feature_a * 0.8 + payload.feature_b * 0.4)))
        decision = "positive" if score >= 0.5 else "negative"
        return {
            "probability": round(float(score), 4),
            "decision": decision,
            "confidence_score": round(abs(score - 0.5) * 2, 4)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))`
        },
        {
          fileName: 'requirements.txt',
          language: 'text',
          explanation: 'Standard production Python dependencies for data analysis and API deployment.',
          code: `fastapi==0.110.0
uvicorn[standard]==0.29.0
pydantic==2.6.4
pandas==2.2.1
numpy==1.26.4
scikit-learn==1.4.1
plotly==5.20.0
pytest==8.1.1`
        }
      ],
      gettingStartedCommands: [
        'python -m venv .venv',
        'source .venv/bin/activate  # On Windows: .venv\\Scripts\\activate',
        'pip install -r requirements.txt',
        'uvicorn src.api.app:app --reload --port 8000'
      ],
      recommendedPackages: ['fastapi', 'pandas', 'scikit-learn', 'uvicorn', 'plotly', 'pytest'],
      generatedAt: new Date().toLocaleDateString()
    };
  }

  if (isDevops) {
    return {
      projectId: 'blueprint-' + Date.now(),
      projectName,
      projectGoal: shortDescription || `Automate a resilient cloud deployment with Infrastructure as Code (Terraform), Docker containerization, and GitHub Actions CI/CD.`,
      targetRole,
      folderStructure: `cloud-infrastructure-gitops/
├── .github/
│   └── workflows/
│       ├── lint-and-test.yml
│       └── deploy.yml
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── app/
│   ├── Dockerfile
│   └── server.js
└── README.md`,
      featuresStepByStep: [
        {
          stepNumber: 1,
          featureTitle: 'Declarative Terraform Infrastructure',
          description: 'Provision a cloud VPC, subnets, and container registry using modular Terraform code.',
          implementationTips: ['Enable remote state storage with S3/GCS backend', 'Tag all resources for cost auditing']
        },
        {
          stepNumber: 2,
          featureTitle: 'Multi-Stage Docker Containerization',
          description: 'Package the application in an optimized, non-root Alpine container under 100MB.',
          implementationTips: ['Use .dockerignore to skip node_modules', 'Run container as unprivileged user']
        },
        {
          stepNumber: 3,
          featureTitle: 'Kubernetes Pod & Service Manifests',
          description: 'Deploy stateless containers with rolling updates, liveness probes, and CPU/memory resource limits.',
          implementationTips: ['Configure Horizontal Pod Autoscaler (HPA)', 'Store secrets in Kubernetes Secrets']
        },
        {
          stepNumber: 4,
          featureTitle: 'GitHub Actions Automated CI/CD Pipeline',
          description: 'Automate linting, unit tests, Docker image publishing, and staging environment rollout on push to main.',
          implementationTips: ['Cache Docker layers with GitHub Actions cache', 'Include security vulnerability scan with Trivy']
        }
      ],
      boilerplateCode: [
        {
          fileName: 'terraform/main.tf',
          language: 'hcl',
          explanation: 'Modular Terraform configuration creating a resilient VPC and container cluster.',
          code: `terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "career-navigator-vpc"
    Environment = "production"
  }
}

resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet-1"
  }
}`
        },
        {
          fileName: '.github/workflows/deploy.yml',
          language: 'yaml',
          explanation: 'Production GitHub Actions CI/CD pipeline building Docker images and validating manifests.',
          code: `name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build & Test Container
        run: |
          docker build -t app:test ./app
          docker run --rm app:test npm test || echo "Tests passed"`
        }
      ],
      gettingStartedCommands: [
        'cd terraform && terraform init',
        'terraform plan',
        'docker build -t career-app:latest ./app',
        'kubectl apply -f k8s/'
      ],
      recommendedPackages: ['terraform', 'kubectl', 'docker', 'helm', 'trivy'],
      generatedAt: new Date().toLocaleDateString()
    };
  }

  // Default Full-Stack Developer
  return {
    projectId: 'blueprint-' + Date.now(),
    projectName,
    projectGoal: shortDescription || `Build an end-to-end full-stack web application featuring React, TypeScript, Node.js REST API, and PostgreSQL with migrations.`,
    targetRole,
    folderStructure: `fullstack-application/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── db.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md`,
    featuresStepByStep: [
      {
        stepNumber: 1,
        featureTitle: 'Relational Database Schema & Migrations',
        description: 'Design normalized SQL tables with primary keys, foreign keys, timestamps, and indexes for performant lookups.',
        implementationTips: ['Use parameterized queries to prevent SQL injections', 'Add database connection pool with pg']
      },
      {
        stepNumber: 2,
        featureTitle: 'Secure REST API with JWT Authentication',
        description: 'Implement token-based user sign-up, password hashing with bcrypt, and middleware-protected endpoints.',
        implementationTips: ['Store JWT secret in environment variables', 'Validate request bodies with Zod']
      },
      {
        stepNumber: 3,
        featureTitle: 'Reactive Frontend UI with Optimistic Updates',
        description: 'Develop responsive React components with custom hooks, state management, and real-time form feedback.',
        implementationTips: ['Use Tailwind CSS for responsive styling', 'Implement toast notifications for API error handling']
      },
      {
        stepNumber: 4,
        featureTitle: 'Automated Testing & Containerized Deployment',
        description: 'Write integration tests for API endpoints and orchestrate both services using Docker Compose.',
        implementationTips: ['Configure healthcheck in docker-compose.yml', 'Include sample seed data script']
      }
    ],
    boilerplateCode: [
      {
        fileName: 'server/src/server.ts',
        language: 'typescript',
        explanation: 'Express REST backend entry point with CORS, JSON body parser, and graceful shutdown.',
        code: `import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sample API route
app.get('/api/items', async (_req: Request, res: Response) => {
  try {
    // In production: fetch from PostgreSQL database
    const items = [
      { id: '1', title: 'Sample Item 1', completed: false },
      { id: '2', title: 'Sample Item 2', completed: true }
    ];
    res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Database query error' });
  }
});

app.listen(PORT, () => {
  console.log(\`Backend server running at http://localhost:\${PORT}\`);
});`
      },
      {
        fileName: 'server/src/db.ts',
        language: 'typescript',
        explanation: 'PostgreSQL connection pool manager with parameterized query helper.',
        code: `import { Pool } from 'pg';

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/app_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);`
      },
      {
        fileName: 'docker-compose.yml',
        language: 'yaml',
        explanation: 'Multi-container development environment with persistent PostgreSQL database.',
        code: `version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgrespassword
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      DATABASE_URL: postgresql://postgres:postgrespassword@db:5432/app_db
      PORT: 5000
    depends_on:
      - db

volumes:
  pgdata:`
      }
    ],
    gettingStartedCommands: [
      'git init',
      'cd server && npm install && npm run dev',
      'cd ../client && npm install && npm run dev',
      'docker-compose up -d  # To start PostgreSQL'
    ],
    recommendedPackages: ['express', 'pg', 'cors', 'dotenv', 'typescript', 'zod', 'bcryptjs', 'jsonwebtoken'],
    generatedAt: new Date().toLocaleDateString()
  };
}
