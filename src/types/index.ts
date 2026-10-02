export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Hard';

export type StageLevel = 
  | 'Stage 1: Multi-Pillar Foundations (Days 1–30)'
  | 'Stage 2: Core Engineering & Algorithmic Patterns (Days 31–60)'
  | 'Stage 3: Advanced Systems, Deep Learning & Concurrency (Days 61–90)'
  | 'Stage 4: Distributed Systems, GenAI & Cloud Architecture (Days 91–120)'
  | 'Stage 5: Production LLMOps, Portfolio Projects & Mock Gauntlets (Days 121–150)';

export interface ResourceLink {
  title: string;
  url: string;
  type: 'doc' | 'code' | 'video' | 'lab' | 'interview';
}

export interface PracticeProblem {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  platform: 'LeetCode' | 'NeetCode' | 'HackerRank' | 'GeeksforGeeks' | 'Custom';
  url: string;
  pattern: string;
  description?: string;
}

export interface SqlExercise {
  beingZeroTopicId?: number;
  beingZeroTopicTitle?: string;
  title: string;
  objective: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sampleTable?: string;
  solutionSql?: string;
  url?: string;
}

export interface InterviewQuestion {
  id?: string;
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Java' | 'Python' | 'DSA' | 'SQL' | 'Backend' | 'System Design' | 'AWS' | 'DevOps' | 'AI/ML' | 'GenAI' | 'MLOps' | 'CS Fundamentals' | 'Behavioral' | 'Project Defense';
  keyAnswerPoints: string[];
  codeSnippet?: string;
  whatInterviewerIsTesting?: string;
  commonTrap?: string;
  commonFollowUp?: string;
}

export interface DailyWorkloadTiers {
  mustDo: string[];      // Core 60–90 min: Non-negotiable DSA (1-2 problems), SQL (1 query), primary concept
  shouldDo: string[];    // 45–60 min: Hands-on lab execution, top 2 interview flashcards
  optionalDo: string[];  // 20–30 min: Edge case exploration, advanced deep dive (skip without guilt if busy)
}

export interface MockInterviewRound {
  type: 'DSA Mock' | 'SQL Mock' | 'CS Fundamentals' | 'Java & Backend' | 'System Design' | 'AI & GenAI' | 'Project Defense' | 'Full Simulation';
  durationMinutes: number;
  rubric: string[];
  simulationGoal: string;
}

export interface DayPlan {
  day: number;
  stage: StageLevel;
  theme: string;
  hours: number;
  objective: string;
  isJobMode?: boolean;
  mockRound?: MockInterviewRound;
  dailyWorkload: DailyWorkloadTiers;
  
  // Simultaneous Pillars Studied on This Day:
  dsaTrack: {
    pattern: string;
    concept: string;
    problems: PracticeProblem[];
  };
  sqlTrack: {
    beingZeroModule: string;
    topic: string;
    exercise: SqlExercise;
  };
  backendCloudTrack: {
    track: 'Java' | 'Spring Boot' | 'AWS' | 'DevOps' | 'System Design' | 'Microservices';
    topic: string;
    learn: string[];
  };
  aiMlTrack: {
    track: 'Python Data Science' | 'Classical ML' | 'Deep Learning' | 'GenAI & LLMs' | 'MLOps & LLMOps';
    topic: string;
    learn: string[];
  };
  csFoundationTrack: {
    topic: string; // OS, Computer Networks, DBMS internals, Computer Architecture, Linux
    concept: string;
  };
  
  // Hands-on Engineering & Actionable Work:
  handsOnEngineering: {
    title: string;
    task: string;
    commandOrCode?: string;
    verification: string;
  };
  
  // Daily Questions & Tangibles:
  interviewQuestions: InterviewQuestion[];
  revisionDays: number[];
  deliverable: string;
  resources: ResourceLink[];
}

export interface ProjectMilestone {
  week: number;
  title: string;
  description: string;
  tasks: string[];
  deliverables: string[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  tagline: string;
  difficulty: 'Production-Grade';
  domains: string[];
  architectureOverview: string;
  techStack: {
    category: string;
    technologies: string[];
  }[];
  architectureDiagramAscii?: string;
  githubRepoStructure: string;
  milestones: ProjectMilestone[];
  testingStrategy: string[];
  deploymentAndMonitoring: string[];
  interviewQuestions: {
    question: string;
    talkingPoints: string[];
  }[];
  resumeBulletPoints: string[];
}

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  customData?: any;
}

export interface UserProgress {
  completedDays: number[];
  inProgressDays: number[];
  bookmarkedDays: number[];
  dayTasks: Record<number, {
    dsa: boolean;
    sql: boolean;
    backendCloud: boolean;
    aiMl: boolean;
    cs: boolean;
    handsOn: boolean;
    questions: boolean;
    deliverable: boolean;
  }>;
  solvedProblems: Record<string, boolean>;
  masteredQuestions: Record<string, boolean>;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  studyMinutes: number;
  notes: Record<string, string>;
  projectChecklist: Record<string, Record<string, boolean>>;
}

export interface AppSettings {
  isDemoMode: boolean;
  theme: 'luna-blue' | 'classic';
  soundEnabled: boolean;
  autoSaveIntervalMs: number;
  lastBackupDate?: string;
}

export interface BackupPayload {
  schemaVersion: number;
  exportedAt: string;
  app: 'FocusFlow 150-Day OS';
  progress: UserProgress;
  settings?: AppSettings;
}

