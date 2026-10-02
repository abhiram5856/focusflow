import type { PortfolioProject } from '../types';

export const portfolioProjects: PortfolioProject[] = [
  {
    id: 'project-1',
    title: 'AI Software Engineering Agent & Codebase Graph Platform',
    tagline: 'Autonomous code analysis, static AST dependency graph, vector semantic retrieval, and PR generation with self-healing unit tests.',
    difficulty: 'Production-Grade',
    domains: ['AI/GenAI', 'Java / Spring Boot', 'Python', 'Distributed Systems', 'Cloud / Docker'],
    architectureOverview: `
A distributed autonomous software engineering system that parses multi-million line Git repositories into Abstract Syntax Tree (AST) graphs, computes hybrid embeddings (dense sentence transformers + sparse BM25) stored in PostgreSQL with pgvector, and orchestrates LangGraph agents to debug, refactor, and open GitHub Pull Requests with verified regression test suites.
    `,
    architectureDiagramAscii: `
+-----------------------------------------------------------------------------------+
|                           Client / GitHub Webhook Event                           |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|               API Gateway & Ingestion Service (Spring Boot 3 + Java 21)           |
|                     - HMAC Signature Verification & Event Queue                   |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                                Apache Kafka Cluster                               |
|                  Topics: repo-indexed, agent-tasks, test-results                  |
+-----------------------------------------------------------------------------------+
        |                                                           |
        v                                                           v
+------------------------------------+      +---------------------------------------+
|  Repo Parser & AST Graph Service   |      |        Autonomous Agent Engine        |
|  - Tree-Sitter AST extraction      |      |        (Python + LangGraph + MCP)     |
|  - Symbol call-graph resolution    |      |  - Planning -> Code Gen -> Reviewer   |
|  - Chunking with code boundaries   |      |  - Tool calling via Model Context     |
+------------------------------------+      +---------------------------------------+
        |                                                           |
        v                                                           v
+------------------------------------+      +---------------------------------------+
|  PostgreSQL 16 + pgvector          |      |  Ephemeral Sandbox Runner (Docker)    |
|  - HNSW index on 1536-dim vectors  |      |  - Compiles code (mvn test / pytest)  |
|  - Relational call graph hierarchy |      |  - Captures stdout, stderr, coverage  |
+------------------------------------+      +---------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|       PR Dispatcher & GitHub Integration (GitHub REST API + Branch Protection)     |
+-----------------------------------------------------------------------------------+
    `,
    techStack: [
      { category: 'Backend & Ingestion', technologies: ['Java 21', 'Spring Boot 3.3', 'Virtual Threads', 'HikariCP'] },
      { category: 'AI & Agents', technologies: ['Python 3.12', 'LangGraph', 'FastAPI', 'Tree-Sitter', 'Model Context Protocol (MCP)', 'Claude 3.5 Sonnet / OpenAI GPT-4o'] },
      { category: 'Storage & Embeddings', technologies: ['PostgreSQL 16', 'pgvector (HNSW)', 'Redis 7 (Distributed Cache & State)'] },
      { category: 'Messaging & Isolation', technologies: ['Apache Kafka', 'Docker Engine SDK', 'gVisor sandbox'] },
      { category: 'Cloud & Infrastructure', technologies: ['AWS ECS Fargate', 'AWS S3', 'Terraform', 'GitHub Actions CI/CD'] }
    ],
    githubRepoStructure: `
ai-swe-agent/
├── services/
│   ├── ingestion-service/         # Java 21 Spring Boot webhook receiver & Kafka producer
│   │   ├── src/main/java/com/agent/ingestion/
│   │   │   ├── controller/WebhookController.java
│   │   │   ├── config/KafkaProducerConfig.java
│   │   │   └── service/SignatureVerificationService.java
│   │   └── pom.xml
│   ├── graph-parser/              # Tree-Sitter AST & Call-Graph generator
│   │   ├── parser.py
│   │   ├── chunker.py
│   │   └── db_client.py
│   ├── agent-engine/              # LangGraph multi-agent cognitive loop
│   │   ├── graph.py               # Planner -> Coder -> Tester -> Critic state graph
│   │   ├── tools/                 # MCP tool implementations (grep, ast_query, file_edit)
│   │   └── prompt_templates.py
│   └── sandbox-runner/            # Isolated test execution micro-runner
│       ├── runner.py
│       └── Dockerfile.sandbox
├── infra/
│   ├── terraform/                 # AWS ECS, RDS, Kafka, S3 infrastructure
│   └── docker-compose.yml         # Local development environment
├── tests/
│   ├── integration/
│   └── benchmarks/
└── README.md
    `,
    milestones: [
      {
        week: 1,
        title: 'AST Parser & Hybrid Vector Storage',
        description: 'Set up repository ingestion pipeline with Tree-Sitter AST generation and pgvector embeddings.',
        tasks: [
          'Build Spring Boot GitHub webhook receiver verifying HMAC SHA256 signatures.',
          'Implement Tree-Sitter AST parser extracting function boundaries, class hierarchies, and import statements.',
          'Store 1536-dimensional OpenAI/bge-large embeddings in PostgreSQL with HNSW cosine distance indexing.'
        ],
        deliverables: ['Working parser indexing 50,000 LOC repository in < 45 seconds with hybrid vector + keyword search.']
      },
      {
        week: 2,
        title: 'Cognitive Multi-Agent Workflow with LangGraph',
        description: 'Construct the multi-agent state machine utilizing Model Context Protocol (MCP) for tool execution.',
        tasks: [
          'Design LangGraph state diagram: PlannerAgent, CodeModifierAgent, and ReviewerAgent.',
          'Expose filesystem AST tools via standard Model Context Protocol (MCP) server.',
          'Implement cyclic self-correction loops when static analysis linting errors occur.'
        ],
        deliverables: ['Agent successfully navigates repository, identifies bug location, and generates valid git patch diffs.']
      },
      {
        week: 3,
        title: 'Ephemeral Sandboxing & Self-Healing Test Runner',
        description: 'Execute generated code in secure, isolated Docker containers to execute tests and feed errors back to the agent.',
        tasks: [
          'Build Docker SDK sandbox manager spawning ephemeral containers with 30-second execution quotas.',
          'Capture Maven/PyTest failure stack traces and feed them directly into the agent feedback loop.',
          'Implement maximum 4-iteration self-healing loop until all tests pass.'
        ],
        deliverables: ['Automated test execution pipeline returning pass/fail metrics within 8 seconds.']
      },
      {
        week: 4,
        title: 'End-to-End GitHub Integration, Deployment & Evaluation',
        description: 'Deploy to AWS ECS Fargate, automate PR creation, and benchmark against SWE-bench Lite.',
        tasks: [
          'Automate git branch creation, atomic commit generation, and GitHub Pull Request drafting via REST API.',
          'Provision AWS ECS Fargate clusters, RDS Aurora PostgreSQL, and MSK Kafka using Terraform.',
          'Run benchmark evaluation on SWE-bench Lite test suite measuring pass@1 and cost per resolved issue.'
        ],
        deliverables: ['Production-deployed system with live GitHub App resolving real open-source issues.']
      }
    ],
    testingStrategy: [
      'Unit testing of AST parser on syntax corner cases with JUnit 5 and PyTest.',
      'Integration testing with Testcontainers running real PostgreSQL with pgvector and Kafka brokers.',
      'Chaos testing: injecting container timeouts, API rate-limiting 429s, and simulating network partitions.'
    ],
    deploymentAndMonitoring: [
      'AWS ECS Fargate serverless container deployment across multiple availability zones.',
      'OpenTelemetry distributed tracing tracking request path from GitHub webhook to LLM completion.',
      'Prometheus custom metrics: agent_resolution_time_seconds, token_usage_total, sandbox_execution_duration.'
    ],
    interviewQuestions: [
      {
        question: 'How do you prevent the AI SWE Agent from hallucinating file paths or making circular edits?',
        talkingPoints: [
          'Rely on strict AST call graph ground-truth rather than raw unstructured text embeddings.',
          'Tools enforce deterministic preconditions: before modifying a file, the agent must invoke read_file with exact byte ranges.',
          'LangGraph state transitions maintain visited edit history and abort if the exact same file patch is proposed twice.'
        ]
      },
      {
        question: 'How do you prevent arbitrary code execution (RCE) security attacks when the agent runs generated tests?',
        talkingPoints: [
          'Execution occurs strictly inside non-root, ephemeral Docker containers wrapped in gVisor sandboxes with network egress disabled.',
          'Strict CPU and memory limits (cgroups: 1 CPU, 512MB RAM, 30s timeout) prevent fork-bombs and infinite loops.'
        ]
      },
      {
        question: 'How does your hybrid search balance dense vector similarity against sparse BM25 keyword matching?',
        talkingPoints: [
          'Dense embeddings capture high-level conceptual intent ("user authentication workflow").',
          'BM25 captures exact symbol names ("JwtAuthenticationFilter", "BCryptPasswordEncoder").',
          'Reciprocal Rank Fusion (RRF) combines rankings from both approaches into a unified score before passing to the reranker.'
        ]
      }
    ],
    resumeBulletPoints: [
      'Architected an autonomous AI Software Engineering Agent using Java 21 Spring Boot, Python LangGraph, and PostgreSQL pgvector, indexing multi-million line codebases via Tree-Sitter AST graphs.',
      'Engineered an ephemeral Docker sandbox test-runner with self-healing feedback loops, resolving 32% of benchmark bug tickets autonomously with zero human intervention.',
      'Designed a distributed Kafka event pipeline handling webhook events with sub-200ms latency and deployed across AWS ECS Fargate using Terraform IaC.'
    ]
  },
  {
    id: 'project-2',
    title: 'Enterprise AI/ML Feature Platform & High-Throughput Serving Engine',
    tagline: 'End-to-end ML platform with online/offline feature store, streaming inference, model registry, and data drift detection.',
    difficulty: 'Production-Grade',
    domains: ['AI/ML Engineering', 'Backend / Java', 'AWS Cloud', 'Distributed Databases', 'MLOps'],
    architectureOverview: `
A production-grade enterprise Machine Learning platform supporting sub-10ms real-time inference at 15,000 QPS. Features an online feature store in Redis with an offline historical lake in AWS S3 (Parquet), an automated model training and validation pipeline using Scikit-Learn and PyTorch, Triton/FastAPI model serving behind Application Load Balancers, and real-time Evidently AI drift monitoring.
    `,
    architectureDiagramAscii: `
+-----------------------------------------------------------------------------------+
|               Real-Time Event Stream (Kafka) & Batch Ingestion (Airflow)          |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                            Feature Store Architecture                             |
|       Online Store: Redis 7 (Sub-2ms reads)  <--->  Offline Store: S3 / Parquet   |
+-----------------------------------------------------------------------------------+
                                         |
                     +-------------------+-------------------+
                     |                                       |
                     v                                       v
+---------------------------------------+   +---------------------------------------+
|   Training Pipeline (MLflow / Ray)    |   |   Serving Cluster (Triton / FastAPI)  |
|   - Feature extraction & scaling      |   |   - Sub-10ms real-time P99 latency    |
|   - Hyperparameter tuning (Optuna)    |   |   - Dynamic batching & GPU acceleration|
|   - Model Registry (MLflow staging)   |   |   - Canary deployments (90/10 split)  |
+---------------------------------------+   +---------------------------------------+
                     |                                       |
                     v                                       v
+-----------------------------------------------------------------------------------+
|               Model Monitoring, Drift Detection & Observability Engine            |
|       Evidently AI (KS-statistic & PSI) + Prometheus Metrics + Grafana Dashboard  |
+-----------------------------------------------------------------------------------+
    `,
    techStack: [
      { category: 'Feature Store & DBs', technologies: ['Redis 7 Cluster', 'AWS S3', 'Apache Parquet', 'PostgreSQL 16'] },
      { category: 'Serving & Backend', technologies: ['Triton Inference Server', 'FastAPI', 'Java 21 Spring Cloud Gateway', 'gRPC'] },
      { category: 'ML & MLOps', technologies: ['Scikit-Learn', 'PyTorch 2.4', 'MLflow 2.15', 'Optuna', 'Evidently AI'] },
      { category: 'Infrastructure & Orchestration', technologies: ['Kubernetes (EKS)', 'AWS SageMaker', 'Terraform', 'Helm'] }
    ],
    githubRepoStructure: `
enterprise-ml-platform/
├── services/
│   ├── feature-store/             # Dual Redis/S3 feature ingestion and point-in-time joins
│   │   ├── online_reader.py
│   │   ├── offline_writer.py
│   │   └── entity_definitions.py
│   ├── inference-service/         # High-throughput C++ Triton / Python FastAPI gRPC service
│   │   ├── app.py
│   │   ├── triton_client.py
│   │   └── latency_profiler.py
│   ├── training-pipeline/         # Reproducible model training jobs with MLflow tracking
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── registry_promoter.py
│   └── drift-monitor/             # Population Stability Index (PSI) & Kolmogorov-Smirnov detector
│       ├── drift_calculator.py
│       └── metrics_exporter.py
├── k8s/                           # Helm charts for EKS deployment and HPA configurations
├── terraform/                     # AWS EKS, Redis ElastiCache, S3 buckets
└── README.md
    `,
    milestones: [
      {
        week: 1,
        title: 'Dual Feature Store & Point-in-Time Correctness',
        description: 'Implement dual Redis and S3 feature store guaranteeing point-in-time correctness to prevent training data leakage.',
        tasks: [
          'Design Redis schema for sub-2ms low-latency feature vector lookups by entity ID.',
          'Build offline Apache Parquet partitioner in S3 with point-in-time join logic.',
          'Write integration test verifying training features match exact historical state without data leakage.'
        ],
        deliverables: ['Production feature store serving 15,000 QPS with < 2ms latency in Redis.']
      },
      {
        week: 2,
        title: 'Training Pipeline, Tuning & MLflow Registry',
        description: 'Construct automated training pipelines with hyperparameter optimization and versioned model artifact promotion.',
        tasks: [
          'Implement Optuna Bayesian optimization finding optimal tree depth and regularization parameters.',
          'Track experiments, metrics (PR-AUC, F1, Log-Loss), and artifacts using self-hosted MLflow server.',
          'Automate model registration with automated threshold validation before promotion to Staging.'
        ],
        deliverables: ['Reproducible MLflow pipeline training model with 94.2% ROC-AUC and registered artifact.']
      },
      {
        week: 3,
        title: 'Sub-10ms High-Throughput Serving & Dynamic Batching',
        description: 'Deploy optimized Triton Inference Server with dynamic request batching and canary deployment routing.',
        tasks: [
          'Convert PyTorch model weights to ONNX format with FP16 precision quantization.',
          'Configure Triton dynamic batching (max_queue_delay_microseconds = 2000, max_batch_size = 64).',
          'Deploy Spring Cloud Gateway managing 90/10 traffic splitting for canary validation.'
        ],
        deliverables: ['Load test sustaining 12,000 QPS with P99 latency < 8.4ms on AWS EC2 GPU instances.']
      },
      {
        week: 4,
        title: 'Data Drift Detection, Monitoring & CI/CD Rollback',
        description: 'Implement real-time feature drift detection using Evidently AI and automated rollback triggers.',
        tasks: [
          'Compute Population Stability Index (PSI) and Kolmogorov-Smirnov test statistics over 1-hour sliding windows.',
          'Expose drift metrics to Prometheus and construct executive Grafana dashboard.',
          'Implement automated Kubernetes rolling rollback to previous model version if drift threshold > 0.25.'
        ],
        deliverables: ['Automated monitoring system alerting and rolling back poisoned distributions within 60 seconds.']
      }
    ],
    testingStrategy: [
      'Data validation tests using Great Expectations on input feature distributions.',
      'Stress testing with Locust verifying P99 latency under 20,000 concurrent virtual users.',
      'Shadow deployment testing validating outputs against legacy baseline model without impacting users.'
    ],
    deploymentAndMonitoring: [
      'AWS EKS Kubernetes cluster with Horizontal Pod Autoscaler (HPA) scaling on custom request metrics.',
      'Prometheus and Grafana dashboards tracking throughput, P50/P90/P99 latency, and feature drift scores.',
      'AWS CloudWatch alarms triggering automated PagerDuty incidents for error spikes.'
    ],
    interviewQuestions: [
      {
        question: 'What is training-serving skew and how does your architecture prevent it?',
        talkingPoints: [
          'Training-serving skew occurs when feature transformations in the offline training pipeline diverge from real-time serving transformations.',
          'Prevented by sharing unified feature definition code between offline batch processing (S3) and online real-time serving (Redis), along with point-in-time join validation.'
        ]
      },
      {
        question: 'How does dynamic batching in Triton Inference Server reduce latency under high load?',
        talkingPoints: [
          'Instead of processing single requests sequentially on GPU cores, the server groups incoming requests across a brief time window (e.g. 2ms) into a single tensor batch.',
          'Saturates parallel GPU tensor cores, dramatically increasing overall throughput (QPS) while keeping latency well under SLA limits.'
        ]
      },
      {
        question: 'Explain the difference between Data Drift and Concept Drift.',
        talkingPoints: [
          'Data Drift: P(X) changes while P(Y|X) remains constant (e.g. user age distribution changes, but relationship to purchase intent is unchanged). Measured via Kolmogorov-Smirnov and PSI.',
          'Concept Drift: P(Y|X) changes (e.g. consumer purchasing behavior changes fundamentally during an economic crisis even if demographics remain identical).'
        ]
      }
    ],
    resumeBulletPoints: [
      'Built an enterprise ML feature and serving platform processing 15,000 QPS with P99 latency < 8.4ms using Redis, Triton Inference Server, and AWS EKS.',
      'Eliminated training-serving data leakage by designing dual Redis/S3 point-in-time feature store with automated Parquet partitioners.',
      'Implemented real-time Population Stability Index (PSI) drift monitoring in Prometheus/Grafana, automating model rollbacks upon distribution shifts.'
    ]
  },
  {
    id: 'project-3',
    title: 'Autonomous Cloud SRE & Remediation Agent',
    tagline: 'Self-healing Kubernetes infrastructure agent correlating distributed traces, logs, and metrics with automated root-cause analysis and safe remediation.',
    difficulty: 'Production-Grade',
    domains: ['Cloud / AWS', 'DevOps / Kubernetes', 'Backend / Java', 'AI / GenAI', 'Distributed Systems'],
    architectureOverview: `
An autonomous Site Reliability Engineering (SRE) agent that continuously monitors Kubernetes clusters, collects OpenTelemetry traces, Prometheus metrics, and FluentBit log streams, detects operational anomalies using isolation forests and statistical baselines, performs automated LLM-assisted root-cause analysis, and applies safe, audited remediation runbooks via Kubernetes client APIs.
    `,
    architectureDiagramAscii: `
+-----------------------------------------------------------------------------------+
|                   Kubernetes Cluster (EKS) Workloads & Pods                       |
+-----------------------------------------------------------------------------------+
           | (Metrics)                         | (Logs)                       | (Traces)
           v                                   v                              v
+-----------------------+           +--------------------+         +----------------+
|  Prometheus Server    |           |    FluentBit Daemon|         | OpenTelemetry  |
|  - CPU, RAM, Latency  |           |    - JSON Logs     |         | Collector      |
+-----------------------+           +--------------------+         +----------------+
           |                                   |                              |
           +-----------------------------------+------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|               Telemetry Ingestion & Anomaly Detection Engine (Java 21)             |
|       - 3-sigma dynamic baseline thresholds + Isolation Forest Anomaly Scoring     |
+-----------------------------------------------------------------------------------+
                                         | (Trigger on Anomaly Incident)
                                         v
+-----------------------------------------------------------------------------------+
|                 Autonomous RCA & Reasoning Agent (Python + LangGraph)             |
|       1. Correlate Metric Spike with Error Log Stack Traces                       |
|       2. Trace Downstream RPC Bottlenecks                                         |
|       3. Formulate Hypothesis & Verify with Kubernetes API Inspection             |
+-----------------------------------------------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|               Safe Remediation Controller (Kubernetes Go / Java SDK)              |
|       - Canary Rollback | Pod Restart | HPA Scaling | Traffic Rerouting           |
|       - Audited Approval Gate + Post-Remediation Health Verification               |
+-----------------------------------------------------------------------------------+
    `,
    techStack: [
      { category: 'Telemetry & Ingestion', technologies: ['OpenTelemetry', 'Prometheus', 'FluentBit', 'Jaeger', 'Java 21'] },
      { category: 'AI & Root Cause Analysis', technologies: ['Python 3.12', 'LangGraph', 'Scikit-learn (Isolation Forest)', 'OpenAI GPT-4o / Claude'] },
      { category: 'Orchestration & Cloud', technologies: ['Kubernetes (EKS)', 'AWS Lambda', 'AWS CloudWatch', 'Terraform', 'Helm'] },
      { category: 'Auditing & Communication', technologies: ['Slack Webhook API', 'PostgreSQL 16 (Incident Store)', 'Docker'] }
    ],
    githubRepoStructure: `
autonomous-cloud-sre-agent/
├── agent-core/
│   ├── anomaly_detector.py        # Streaming anomaly scoring on CPU, memory, error rates
│   ├── rca_engine.py              # LangGraph multi-step log/metric correlation engine
│   └── prompt_library.py
├── telemetry-collector/           # High-throughput Java collector aggregating OTel traces
│   ├── src/main/java/com/sre/collector/
│   │   ├── TraceAggregator.java
│   │   └── PrometheusQueryClient.java
│   └── pom.xml
├── remediation-operator/          # Audited Kubernetes remediation controller
│   ├── operator.py
│   ├── runbooks/                  # Deterministic actions: restart_pod, scale_deployment, rollback
│   └── safety_guardrails.py       # Prevents cascading restarts and limits max pods altered
├── deploy/                        # Kubernetes DaemonSets and Helm charts
│   ├── agent-deployment.yaml
│   └── rbac.yaml
└── README.md
    `,
    milestones: [
      {
        week: 1,
        title: 'Telemetry Pipeline & Dynamic Anomaly Baselines',
        description: 'Aggregate OpenTelemetry traces, Prometheus metrics, and FluentBit logs into unified incident correlation windows.',
        tasks: [
          'Deploy OpenTelemetry collectors and Prometheus scrape jobs across EKS clusters.',
          'Build dynamic baselining algorithm tracking 3-sigma standard deviations on HTTP 5xx error rates and P99 response times.',
          'Store detected incident windows in PostgreSQL with structured telemetry snapshots.'
        ],
        deliverables: ['Real-time pipeline identifying latency anomalies within 15 seconds of occurrence.']
      },
      {
        week: 2,
        title: 'Multi-Modal RCA Reasoning Engine',
        description: 'Develop LangGraph agent correlating metric spikes with exact log stack traces and trace dependency spans.',
        tasks: [
          'Build trace analyzer isolating slowest span in distributed microservice call graphs.',
          'Implement log clusterer grouping thousands of raw exception lines into unique canonical error signatures.',
          'Construct RCA reasoning prompt generating human-readable hypothesis, severity rating, and suggested runbook.'
        ],
        deliverables: ['RCA engine diagnosing memory leaks and database connection pool exhaustion with 91% accuracy.']
      },
      {
        week: 3,
        title: 'Safe Remediation Operator & Guardrails',
        description: 'Implement automated remediation controller with safety limits and Slack interactive approval gates.',
        tasks: [
          'Build Kubernetes remediation controller implementing canary rollback, pod restart, and HPA target scaling.',
          'Engineer safety guardrails: limit remediation to max 20% of replica count to prevent catastrophic outages.',
          'Integrate interactive Slack notifications with "Approve Remediation" / "Reject" buttons.'
        ],
        deliverables: ['Remediation controller executing rolling restarts and rollbacks with zero collateral downtime.']
      },
      {
        week: 4,
        title: 'Chaos Engineering Validation & End-to-End Simulation',
        description: 'Simulate realistic production outages using Chaos Mesh to validate autonomous detection, RCA, and self-healing.',
        tasks: [
          'Inject simulated pod CPU saturation, network latency, and database packet drops using Chaos Mesh.',
          'Verify end-to-end autonomous flow: Anomaly Detection -> RCA -> Slack Notification -> Self-Healing Rollback.',
          'Measure MTTR (Mean Time to Resolution) reduction compared to manual engineer on-call response.'
        ],
        deliverables: ['Demonstrated reduction in MTTR from 24 minutes down to 90 seconds in simulated production outages.']
      }
    ],
    testingStrategy: [
      'Chaos engineering testing using Chaos Mesh to simulate network partitions and CPU throttling.',
      'Unit testing of safety guardrails to prove controller rejects dangerous commands exceeding blast radius limits.',
      'Mock telemetry replay testing evaluating RCA accuracy against 50 documented historical outages.'
    ],
    deploymentAndMonitoring: [
      'Deployed as an audited in-cluster Kubernetes Operator with least-privilege RBAC service accounts.',
      'Grafana dashboard tracking MTTR, autonomous remediation success rates, and cost savings.',
      'PostgreSQL audit ledger logging every automated command, timestamp, approver, and output.'
    ],
    interviewQuestions: [
      {
        question: 'How do you prevent an autonomous remediation agent from causing a cascading failure loop?',
        talkingPoints: [
          'Enforce strict blast radius limits: an action cannot alter more than 1 pod or 20% of a deployment at a time.',
          'Implement cooldown periods and rate-limiting: if a deployment is restarted, no further automated action is allowed on that service for 30 minutes.',
          'If health checks do not recover within 120 seconds post-remediation, the agent automatically reverts the action and pages a human engineer immediately.'
        ]
      },
      {
        question: 'How does your RCA engine isolate root causes in deep distributed call graphs?',
        talkingPoints: [
          'Leverages OpenTelemetry distributed trace spans with parent-child relationships.',
          'Traverses the span DAG from the edge API gateway down to the deepest leaf node, identifying the exact microservice where self-time latency spiked or where error status codes originated.',
          'Cross-references the offending span timestamp with log streams from that specific pod instance.'
        ]
      },
      {
        question: 'Why not simply use an LLM directly to read all logs and fix issues?',
        talkingPoints: [
          'Raw logs at scale generate gigabytes per minute, which would exceed context windows and cost thousands of dollars per incident.',
          'Deterministic code first performs statistical anomaly detection and log clustering to reduce millions of log lines to 3 key error signatures before passing to the LLM.',
          'Remediation actions are strictly constrained to pre-vetted deterministic runbooks rather than executing arbitrary bash scripts.'
        ]
      }
    ],
    resumeBulletPoints: [
      'Architected an Autonomous Cloud SRE Agent in Java 21 and Python, reducing simulated MTTR by 85% through automated telemetry correlation across Prometheus, OpenTelemetry, and FluentBit.',
      'Engineered an LLM-powered root-cause analysis engine diagnosing microservice bottlenecks and memory leaks with 91% accuracy across 50 simulated outage scenarios.',
      'Built a safe Kubernetes remediation controller with blast radius guardrails and Slack approval webhooks, executing audited canaries and rollbacks.'
    ]
  }
];
