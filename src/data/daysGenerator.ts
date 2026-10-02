import type { DayPlan, PracticeProblem, InterviewQuestion, ResourceLink, DailyWorkloadTiers, MockInterviewRound } from '../types';
import { getStageForDay, BEING_ZERO_SQL_TOPICS, calculateRevisionDays } from './curriculumData';

// Domain catalogs for systematic multi-pillar daily progression

interface DsaDayData {
  pattern: string;
  concept: string;
  problems: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; url: string; platform: 'LeetCode' | 'NeetCode'; desc: string }[];
}

interface SqlDayData {
  beingZeroModule: string;
  topic: string;
  exercise: { title: string; objective: string; difficulty: 'Easy' | 'Medium' | 'Hard'; table: string; solution: string };
}

interface BackendCloudDayData {
  track: 'Java' | 'Spring Boot' | 'AWS' | 'DevOps' | 'System Design' | 'Microservices';
  topic: string;
  learn: string[];
}

interface AiMlDayData {
  track: 'Python Data Science' | 'Classical ML' | 'Deep Learning' | 'GenAI & LLMs' | 'MLOps & LLMOps';
  topic: string;
  learn: string[];
}

interface CsDayData {
  topic: string;
  concept: string;
}

interface HandsOnData {
  title: string;
  task: string;
  commandOrCode: string;
  verification: string;
}

interface QuestionItem {
  question: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: any;
  points: string[];
  whatInterviewerIsTesting?: string;
  commonTrap?: string;
  commonFollowUp?: string;
}

// 150 Comprehensive Daily Curriculum Blueprints (Final Lock-In)
export function generateAll150Days(): DayPlan[] {
  const days: DayPlan[] = [];

  for (let d = 1; d <= 150; d++) {
    const stage = getStageForDay(d);
    const revision = calculateRevisionDays(d);

    // Progressive Pillar Synthesis based on day d
    let dsa: DsaDayData;
    let sql: SqlDayData;
    let backendCloud: BackendCloudDayData;
    let aiMl: AiMlDayData;
    let cs: CsDayData;
    let handsOn: HandsOnData;
    let questions: QuestionItem[] = [];
    let deliverable = '';
    let theme = '';
    let objective = '';
    let resources: ResourceLink[] = [];
    let isJobMode = d > 120;
    let mockRound: MockInterviewRound | undefined = undefined;

    // --- DSA PROGRESSION (WITH COMPACT BIT MANIPULATION) ---
    if (d <= 8) {
      dsa = {
        pattern: 'Arrays: Traversal & In-Place Modification',
        concept: 'Contiguous memory locality, in-place pointer shifts, and frequency indexing.',
        problems: [
          { title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode', desc: 'HashMap one-pass lookup in O(N)' },
          { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', platform: 'LeetCode', desc: 'Two pointer in-place overwrite' }
        ]
      };
    } else if (d <= 16) {
      dsa = {
        pattern: 'Arrays: Prefix Sum & Difference Arrays',
        concept: 'O(1) range sum queries via prefix sums and O(1) range updates via difference arrays.',
        problems: [
          { title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', platform: 'LeetCode', desc: 'Prefix sum with frequency map' },
          { title: 'Corporate Flight Bookings', difficulty: 'Medium', url: 'https://leetcode.com/problems/corporate-flight-bookings/', platform: 'LeetCode', desc: 'Difference array range additions' }
        ]
      };
    } else if (d <= 24) {
      dsa = {
        pattern: 'Arrays: Kadane & Intervals',
        concept: 'Contiguous max subarray sum and greedy interval merging by sorting endpoints.',
        problems: [
          { title: 'Maximum Subarray', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/', platform: 'LeetCode', desc: 'Kadane algorithm in O(N)' },
          { title: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/', platform: 'LeetCode', desc: 'Sort by start and compact' }
        ]
      };
    } else if (d <= 32) {
      dsa = {
        pattern: 'Strings: Frequency Hashing & Palindromes',
        concept: 'Character count tuples, anagram grouping, and expand-around-center palindromes.',
        problems: [
          { title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/', platform: 'LeetCode', desc: 'Tuple frequency key grouping' },
          { title: 'Longest Palindromic Substring', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/', platform: 'LeetCode', desc: 'Expand around 2N-1 centers' }
        ]
      };
    } else if (d <= 40) {
      dsa = {
        pattern: 'Two Pointers: Opposite Ends & Fast/Slow',
        concept: 'Shrinking search boundaries and Floyd cycle detection.',
        problems: [
          { title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/', platform: 'LeetCode', desc: 'Sort + two pointers skipping duplicates' },
          { title: 'Linked List Cycle II', difficulty: 'Medium', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', platform: 'LeetCode', desc: 'Cycle start discovery' }
        ]
      };
    } else if (d <= 48) {
      dsa = {
        pattern: 'Binary Search: Rotated & Answer-Space',
        concept: 'Identifying sorted halves in rotated arrays and monotonic feasibility search.',
        problems: [
          { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', platform: 'LeetCode', desc: 'O(log N) branch discrimination' },
          { title: 'Koko Eating Bananas', difficulty: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/', platform: 'LeetCode', desc: 'Binary search on answer space' }
        ]
      };
    } else if (d <= 56) {
      // COMPACT BIT MANIPULATION MODULE (GAPS FIXED)
      dsa = {
        pattern: 'Bit Manipulation: XOR, Bitmasks & Power of Two',
        concept: 'Bitwise identities (x ^ x = 0, x ^ 0 = x), Brian Kernighan bit clearing n & (n-1), and subset masks (1 << i).',
        problems: [
          { title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/', platform: 'LeetCode', desc: 'XOR identity removes duplicates in O(N) time and O(1) space' },
          { title: 'Counting Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/counting-bits/', platform: 'LeetCode', desc: 'DP with bit shift: dp[i] = dp[i >> 1] + (i & 1)' },
          { title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/', platform: 'LeetCode', desc: 'Bitmask enumeration from 0 to (1 << n) - 1' }
        ]
      };
    } else if (d <= 64) {
      dsa = {
        pattern: 'Linked Lists: In-Place Reversal & Merging',
        concept: '3-pointer reversal, dummy heads, and divide-and-conquer k-way merging.',
        problems: [
          { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', platform: 'LeetCode', desc: 'O(1) space pointer rewiring' },
          { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode', desc: 'Min-Heap and divide-and-conquer' }
        ]
      };
    } else if (d <= 72) {
      dsa = {
        pattern: 'Stack: Monotonic Stack & Deque',
        concept: 'Nearest greater/smaller elements and sliding window extremum in O(N).',
        problems: [
          { title: 'Daily Temperatures', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/', platform: 'LeetCode', desc: 'Monotonic decreasing index stack' },
          { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode', desc: 'Single-pass monotonic stack' }
        ]
      };
    } else if (d <= 80) {
      dsa = {
        pattern: 'Heaps & Priority Queues: Top-K & Median',
        concept: 'Min/Max-heap duality, stream processing, and order statistics.',
        problems: [
          { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', platform: 'LeetCode', desc: 'Min-Heap size K or Quickselect' },
          { title: 'Find Median from Data Stream', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/', platform: 'LeetCode', desc: 'Two heaps (max-heap + min-heap) balance' }
        ]
      };
    } else if (d <= 92) {
      dsa = {
        pattern: 'Recursion & Backtracking: Subsets & Pruning',
        concept: 'State-space decision trees, duplicate pruning, and constraint satisfaction.',
        problems: [
          { title: 'Subsets II', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets-ii/', platform: 'LeetCode', desc: 'Sort + skip duplicate siblings' },
          { title: 'Word Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/', platform: 'LeetCode', desc: 'In-place grid DFS backtracking' }
        ]
      };
    } else if (d <= 106) {
      dsa = {
        pattern: 'Binary Trees: DFS/BFS, BST & LCA',
        concept: 'Tree path metrics, level order traversals, and lowest common ancestors.',
        problems: [
          { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', platform: 'LeetCode', desc: 'Post-order DFS split check' },
          { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/', platform: 'LeetCode', desc: 'Bounding range invariant' }
        ]
      };
    } else if (d <= 120) {
      dsa = {
        pattern: 'Graphs: BFS/DFS, TopoSort & Shortest Paths',
        concept: 'Connected components, Kahn algorithm indegrees, and Dijkstra shortest paths.',
        problems: [
          { title: 'Course Schedule II', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'LeetCode', desc: 'Kahn algorithm topological sort' },
          { title: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/', platform: 'LeetCode', desc: 'Dijkstra PriorityQueue min-heap' }
        ]
      };
    } else {
      // DAYS 121-150: FINAL 30-DAY JOB MODE INTERVIEW SPRINTS
      dsa = {
        pattern: 'Job Mode: Timed Interview Sprint & Dynamic Programming',
        concept: 'Knapsack, Subsequences (LCS/LIS), and high-frequency LeetCode 75 timed mock interview sets.',
        problems: [
          { title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/', platform: 'LeetCode', desc: 'Unbounded Knapsack 1D DP' },
          { title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'LeetCode', desc: 'Patience sort binary search O(N log N)' }
        ]
      };
    }

    // --- SQL PROGRESSION (Being Zero Backbone + Advanced SQL) ---
    const bzIdx = Math.min(BEING_ZERO_SQL_TOPICS.length - 1, Math.floor((d - 1) / 2));
    const bzTopic = BEING_ZERO_SQL_TOPICS[bzIdx];

    if (d <= 15) {
      sql = {
        beingZeroModule: `Being Zero Module: ${bzTopic.title}`,
        topic: 'DDL, DML & Table Constraints',
        exercise: {
          title: `Being Zero: ${bzTopic.title} Practice`,
          objective: 'Design normalized schemas with primary, foreign, unique, and check constraints; perform atomic INSERT and UPDATE operations.',
          difficulty: 'Easy',
          table: 'CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(100), dept_id INT, salary NUMERIC(10,2), hire_date DATE);',
          solution: 'INSERT INTO employees VALUES (1, "Alice", 101, 85000.00, "2024-01-15");'
        }
      };
    } else if (d <= 30) {
      sql = {
        beingZeroModule: `Being Zero Module: ${bzTopic.title}`,
        topic: 'Filtering, Expressions & Aggregations',
        exercise: {
          title: 'Departmental Salary Aggregation',
          objective: 'Group records by department, compute count, sum, average salary, and filter groups with HAVING salary > 80000.',
          difficulty: 'Medium',
          table: 'employees (id, name, dept_id, salary, hire_date)',
          solution: 'SELECT dept_id, COUNT(*) AS emp_count, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id HAVING AVG(salary) > 80000;'
        }
      };
    } else if (d <= 50) {
      sql = {
        beingZeroModule: `Being Zero Module: ${bzTopic.title}`,
        topic: 'Multi-Table Joins, Subqueries & Views',
        exercise: {
          title: 'Inner, Outer & Anti-Join Customer Analysis',
          objective: 'Identify customers who placed orders in 2024 but have never initiated a return using LEFT JOIN and WHERE return_id IS NULL.',
          difficulty: 'Medium',
          table: 'customers (c_id, name), orders (o_id, c_id, order_date), returns (r_id, o_id)',
          solution: 'SELECT c.name FROM customers c JOIN orders o ON c.c_id = o.c_id LEFT JOIN returns r ON o.o_id = r.o_id WHERE strftime("%Y", o.order_date) = "2024" AND r.r_id IS NULL;'
        }
      };
    } else if (d <= 75) {
      sql = {
        beingZeroModule: `Being Zero Module: ${bzTopic.title}`,
        topic: 'Window Functions & Recursive CTEs',
        exercise: {
          title: 'Top 3 Salaries per Department via DENSE_RANK',
          objective: 'Assign ranking to salaries partitioned by department, and compute 3-month rolling revenue totals using ROWS BETWEEN.',
          difficulty: 'Hard',
          table: 'salaries (emp_id, dept_id, salary, month_date)',
          solution: 'WITH Ranked AS (SELECT emp_id, dept_id, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rnk FROM salaries) SELECT * FROM Ranked WHERE rnk <= 3;'
        }
      };
    } else if (d <= 100) {
      sql = {
        beingZeroModule: 'Advanced SQL Expansion: Analytics & Optimization',
        topic: 'Gaps & Islands, Sessionization & Retention Cohorts',
        exercise: {
          title: 'User Activity Sessionization (30-Minute Inactivity Window)',
          objective: 'Identify distinct user browsing sessions by flagging events where time since previous event exceeds 30 minutes using LAG().',
          difficulty: 'Hard',
          table: 'user_events (user_id, event_time, event_type)',
          solution: 'SELECT user_id, event_time, SUM(CASE WHEN prev_time IS NULL OR (julianday(event_time) - julianday(prev_time))*24*60 > 30 THEN 1 ELSE 0 END) OVER (PARTITION BY user_id ORDER BY event_time) AS session_id FROM (SELECT *, LAG(event_time) OVER (PARTITION BY user_id ORDER BY event_time) AS prev_time FROM user_events);'
        }
      };
    } else if (d <= 125) {
      sql = {
        beingZeroModule: 'PostgreSQL Deep Dive & Internals',
        topic: 'JSONB Queries, Indexing Strategy & EXPLAIN ANALYZE',
        exercise: {
          title: 'PostgreSQL GIN Indexing on JSONB Attributes',
          objective: 'Query semi-structured telemetry data using JSON path operators (@>, ->>) and benchmark Index Scan vs Sequential Scan.',
          difficulty: 'Hard',
          table: 'events (id SERIAL PRIMARY KEY, payload JSONB); CREATE INDEX idx_payload ON events USING GIN (payload);',
          solution: 'EXPLAIN ANALYZE SELECT * FROM events WHERE payload @> \'{"status": "error", "code": 500}\';'
        }
      };
    } else {
      sql = {
        beingZeroModule: 'Job Mode: Timed SQL Interview Gauntlet',
        topic: 'Timed Analytical Challenges: Retention Cohorts, Funnels & MVCC',
        exercise: {
          title: 'Day 30 User Retention Cohort Analysis',
          objective: 'Calculate the percentage of users active in month 0 who returned and completed a transaction in month 1.',
          difficulty: 'Hard',
          table: 'user_transactions (user_id, transaction_date, amount)',
          solution: 'WITH FirstPurchase AS (SELECT user_id, DATE_TRUNC("month", MIN(transaction_date)) as cohort_month FROM user_transactions GROUP BY user_id) SELECT cohort_month, COUNT(DISTINCT f.user_id) as total_users FROM FirstPurchase f GROUP BY cohort_month;'
        }
      };
    }

    // --- BACKEND & CLOUD PROGRESSION (WITH gRPC, FLYWAY & REBALANCING) ---
    if (d <= 25) {
      backendCloud = {
        track: 'Java',
        topic: `Java Memory, Concurrency & JVM Internals (Day ${d})`,
        learn: [
          'Stack vs Heap memory allocation, Metaspace, and GC roots reachability',
          'Java Memory Model (JMM), synchronized monitors, and volatile visibility',
          'OOP polymorphism dynamic dispatch vtables and interface default resolution'
        ]
      };
    } else if (d <= 50) {
      backendCloud = {
        track: 'Spring Boot',
        topic: `Spring Boot 3 REST, JPA & Flyway Migrations (Day ${d})`,
        learn: [
          'Inversion of Control (IoC) container, Bean scopes, and ApplicationContext lifecycle',
          'Database Migrations with Flyway: versioned V1__init.sql scripts, repeatable migrations, and preventing schema drift',
          'Spring Data JPA, Hibernate L1/L2 cache, HikariCP connection pooling, and solving the N+1 select problem'
        ]
      };
    } else if (d <= 70) {
      backendCloud = {
        track: 'Microservices',
        topic: `Spring Security, Redis & gRPC Services (Day ${d})`,
        learn: [
          'Spring Security 6 filter chain, JWT verification, and stateless REST authentication',
          'Redis Cache-Aside pattern, TTL eviction, and token-bucket rate limiting',
          'gRPC and Protocol Buffers: defining .proto service contracts, HTTP/2 multiplexed framing, and client stubs'
        ]
      };
    } else if (d <= 90) {
      backendCloud = {
        track: 'AWS',
        topic: `Kafka Event Streaming & AWS Cloud Core (Day ${d})`,
        learn: [
          'Kafka broker architecture: topic partitions, consumer groups, offset commit semantics, and rebalancing',
          'AWS IAM least-privilege roles, policies, and AWS STS temporary credentials',
          'VPC networking: public/private subnets, Route Tables, Internet Gateways, and NAT Gateways'
        ]
      };
    } else if (d <= 105) {
      backendCloud = {
        track: 'DevOps',
        topic: `Docker Multi-Stage, Compose & Kubernetes Basics (Day ${d})`,
        learn: [
          'Multi-stage Dockerfile optimization for Java/Python, non-root security, and Docker Compose networks',
          'Kubernetes Pods, Deployments, Services (ClusterIP, NodePort, LoadBalancer), ConfigMaps, and Ingress',
          'Application health probes: Liveness vs Readiness endpoints'
        ]
      };
    } else if (d <= 120) {
      backendCloud = {
        track: 'Microservices',
        topic: `Circuit Breakers, Terraform IaC & Observability (Day ${d})`,
        learn: [
          'Resilience4j circuit breakers, rate limiters, and fallbacks in distributed microservices',
          'Terraform declarative infrastructure: AWS provider, S3 remote state, and DynamoDB locking',
          'Prometheus custom metrics, OpenTelemetry distributed tracing spans, and structured JSON logs'
        ]
      };
    } else {
      backendCloud = {
        track: 'System Design',
        topic: `Job Mode: System Design Whiteboard Defense (Day ${d})`,
        learn: [
          'Mastering the 8 Core Architectures: URL Shortener, Chat System, Notification Service, File Storage, Job Queue, Rate Limiter, API Gateway, and AI RAG System',
          'Capacity estimation math: QPS, read-to-write ratios, ingress/egress bandwidth, and storage projections',
          'Defending trade-offs: Caching vs fresh data, SQL ACID vs NoSQL availability, synchronous REST vs asynchronous Kafka'
        ]
      };
    }

    // --- AI / ML / GenAI PROGRESSION (WITH PEFT/LoRA & SSE TOKEN STREAMING) ---
    if (d <= 25) {
      aiMl = {
        track: 'Python Data Science',
        topic: `Python Memory, SIMD Vectorization & DataFrames (Day ${d})`,
        learn: [
          'CPython object layout (PyObject), reference counting, cyclic garbage collector, and GIL mechanics',
          'NumPy ndarray memory layout, C-contiguous strides, and multidimensional broadcasting rules',
          'Pandas DataFrame indexers (loc vs iloc), vectorized string transformations, and groupby aggregations'
        ]
      };
    } else if (d <= 55) {
      aiMl = {
        track: 'Classical ML',
        topic: `Supervised Learning, Feature Engineering & Tuning (Day ${d})`,
        learn: [
          'Linear/Logistic Regression, cost functions, gradient descent, and L1/L2 regularization (Lasso vs Ridge)',
          'Decision Trees, Random Forest bagging, Gradient Boosting (XGBoost / LightGBM), and handling class imbalance (SMOTE)',
          'Scikit-learn Pipelines, ColumnTransformers, cross-validation, and metrics (Precision, Recall, ROC-AUC, PR-AUC)'
        ]
      };
    } else if (d <= 80) {
      aiMl = {
        track: 'Deep Learning',
        topic: `Neural Networks, PyTorch Tensors & Training Loops (Day ${d})`,
        learn: [
          'Multilayer Perceptrons (MLP), forward pass, backpropagation calculus, and activation functions (ReLU, GELU, Softmax)',
          'Optimizers (SGD with Momentum, AdamW), learning rate schedules, dropout, and batch normalization',
          'Word2Vec, dense vector embeddings, cosine similarity metrics, and PyTorch Tensor operations'
        ]
      };
    } else if (d <= 100) {
      aiMl = {
        track: 'GenAI & LLMs',
        topic: `Transformer Architecture, Vector DBs & Advanced RAG (Day ${d})`,
        learn: [
          'Transformer encoder-decoder mechanics: Self-Attention, Multi-Head Attention, and positional encodings',
          'Vector Databases (pgvector, Chroma, Pinecone) and HNSW (Hierarchical Navigable Small World) indexing',
          'Advanced RAG pipelines: Semantic chunking, Hybrid Search (Dense embeddings + BM25 keyword), and Cross-Encoder reranking'
        ]
      };
    } else if (d <= 110) {
      // PEFT, LoRA & QLoRA MODULE (GAPS FIXED)
      aiMl = {
        track: 'GenAI & LLMs',
        topic: `Fine-Tuning Mechanics: PEFT, LoRA & QLoRA (Day ${d})`,
        learn: [
          'Parameter-Efficient Fine-Tuning (PEFT) intuition: freezing base weights and injecting trainable low-rank decomposition matrices (W + B*A)',
          'LoRA hyperparameters: Rank (r), Alpha scaling factor, and targeting Attention Query/Value projection matrices',
          'Decision Framework: Fine-Tuning vs RAG vs Prompt Engineering — when to fine-tune (domain style, syntax, specialized task) vs RAG (dynamic knowledge, factual grounding)'
        ]
      };
    } else if (d <= 120) {
      // AGENTS & SSE STREAMING (GAPS FIXED)
      aiMl = {
        track: 'GenAI & LLMs',
        topic: `LangGraph Agents & SSE Token Streaming (Day ${d})`,
        learn: [
          'Autonomous Agent architectures: Tool calling, Model Context Protocol (MCP), and cyclic state machines with LangGraph',
          'Frontend/AI Streaming Glue: Server-Sent Events (SSE) protocol, text/event-stream headers, and browser EventSource / fetch stream readers',
          'Handling network disconnects, token buffering, and structured Pydantic JSON output enforcement'
        ]
      };
    } else {
      aiMl = {
        track: 'MLOps & LLMOps',
        topic: `Job Mode: Production LLMOps, vLLM & AI Defense (Day ${d})`,
        learn: [
          'vLLM high-throughput serving with PagedAttention, continuous batching, and semantic prompt caching',
          'LLM evaluation frameworks: Ragas (Faithfulness, Answer Relevance, Context Precision), TruLens, and LLM-as-a-Judge',
          'Defending AI choices in interviews: RAG vs Fine-tuning, chunking trade-offs, vector search latency, and hallucination guardrails'
        ]
      };
    }

    // --- CS FOUNDATIONS & OBSERVABILITY ---
    const csTopics = [
      { topic: 'Operating Systems: Processes vs Threads', concept: 'Address spaces, PCB/TCB structures, and context switching cache overhead.' },
      { topic: 'Operating Systems: CPU Scheduling', concept: 'CFS (Completely Fair Scheduler), Round Robin quantum sizing, and priority inversion.' },
      { topic: 'Operating Systems: Virtual Memory & Paging', concept: 'MMU translation, page tables, Page Fault traps, and TLB hit ratios.' },
      { topic: 'Operating Systems: Concurrency & Futex', concept: 'Atomic CAS, kernel futex wait queues, spinlocks vs blocking mutexes.' },
      { topic: 'Computer Networks: OSI & TCP/IP Model', concept: 'Packet encapsulation, Ethernet MAC framing, and ARP IP resolution.' },
      { topic: 'Computer Networks: TCP Transport Protocol', concept: '3-way handshake, sliding window flow control, and Reno/Cubic congestion avoidance.' },
      { topic: 'Computer Networks: TLS 1.3 & DNS', concept: 'Diffie-Hellman ephemeral key exchange, forward secrecy, and DNS hierarchy.' },
      { topic: 'Linux Systems: Shell & Permissions', concept: 'File descriptors, systemd service units, cron, and sed/awk data parsing.' },
      { topic: 'Linux Systems: Performance Diagnostics', concept: 'Diagnosing CPU, memory, and disk bottlenecks with htop, vmstat, iostat, and strace.' },
      { topic: 'Database Internals: Storage & B+ Trees', concept: 'Page layout, write-ahead logging (WAL), buffer pool eviction, and B+ Tree node splitting.' }
    ];
    cs = csTopics[(d - 1) % csTopics.length];

    // --- HANDS-ON ENGINEERING TASK ---
    handsOn = {
      title: `Day ${d} Actionable Engineering Task`,
      task: `Implement and verify the day's core components: solve ${dsa.problems[0].title} in Java/Python, execute the Being Zero SQL query, and run the practical hands-on engineering lab task.`,
      commandOrCode: d % 2 === 0 
        ? `javac Solution.java && java Solution && sqlite3 test.db < query.sql` 
        : `python -m unittest test_pipeline.py && curl -I http://localhost:8080/actuator/health`,
      verification: `Verify zero runtime exceptions, 100% test assertions passed, and sub-100ms response latency.`
    };

    // --- MOCK INTERVIEW ROUND SETUP (DAYS 121-150) ---
    if (d >= 121 && d <= 125) {
      mockRound = {
        type: 'DSA Mock',
        durationMinutes: 45,
        simulationGoal: 'Solve 1 Medium + 1 Easy DSA problem in under 45 minutes while explaining thoughts aloud.',
        rubric: ['Problem understanding & clarifying questions', 'Brute force vs optimal discussion', 'Clean code without syntax bugs', 'Accurate time and space complexity derivation']
      };
    } else if (d >= 126 && d <= 130) {
      mockRound = {
        type: 'SQL Mock',
        durationMinutes: 30,
        simulationGoal: 'Write 2 complex analytical queries (Window functions, CTEs, Aggregations) in 30 minutes.',
        rubric: ['Correct JOIN syntax and handling of NULLs', 'Appropriate Window function selection', 'Query optimization & index usage discussion']
      };
    } else if (d >= 131 && d <= 135) {
      mockRound = {
        type: 'CS Fundamentals',
        durationMinutes: 45,
        simulationGoal: 'Rapid-fire Q&A across OS (threads, virtual memory), Computer Networks (TCP, TLS, HTTP), and DBMS (ACID, MVCC).',
        rubric: ['Clarity of definitions without rambling', 'Connecting OS/Network concepts to real server performance', 'Understanding database isolation anomalies']
      };
    } else if (d >= 136 && d <= 140) {
      mockRound = {
        type: 'System Design',
        durationMinutes: 45,
        simulationGoal: 'Lead an end-to-end system design interview for a core service (URL Shortener, Chat, Rate Limiter, AI Gateway).',
        rubric: ['Requirements clarification & scope definition', 'Back-of-the-envelope capacity estimations', 'High-level architecture block diagram', 'Deep dive into data model, caching, and failure modes']
      };
    } else if (d >= 141 && d <= 145) {
      mockRound = {
        type: 'AI & GenAI',
        durationMinutes: 45,
        simulationGoal: 'Defend AI/ML and GenAI engineering architectures, RAG design choices, evaluation, and latency bottlenecks.',
        rubric: ['Explaining RAG failure modes (retrieval vs generation)', 'Comparing fine-tuning (LoRA) vs RAG with clear heuristics', 'Understanding vLLM PagedAttention and continuous batching']
      };
    } else if (d >= 146 && d <= 150) {
      mockRound = {
        type: 'Project Defense',
        durationMinutes: 60,
        simulationGoal: 'Senior Engineering Manager Project Defense: Grill every architectural choice, failure scenario, and resume bullet point.',
        rubric: ['Defending tech stack choices (why Postgres, why Kafka, why Redis)', 'Failure mitigation: what happens when Kafka or Redis dies', 'STAR behavioral responses for challenging technical hurdles']
      };
    }

    // --- INTERVIEW QUESTIONS WITH TESTING SIGNAL, TRAP & FOLLOWUP ---
    questions = [
      {
        question: `Explain the algorithmic intuition and time/space complexity of today's DSA pattern: ${dsa.pattern}.`,
        difficulty: 'Medium',
        category: 'DSA',
        points: [
          `Core recognition signal: identify problem constraints that indicate this pattern.`,
          `Optimal complexity: explain why this approach eliminates redundant computation.`,
          `Edge case management: discuss null inputs, single-element collections, and duplicates.`
        ],
        whatInterviewerIsTesting: 'Pattern recognition, clarity of explanation, and Big-O derivation.',
        commonTrap: 'Jumping straight into code without explaining the algorithmic trade-off first.',
        commonFollowUp: 'How would your approach change if the dataset cannot fit into memory?'
      },
      {
        question: `How does the SQL concept "${sql.topic}" impact query performance on multi-million row tables?`,
        difficulty: 'Medium',
        category: 'SQL',
        points: [
          `Index utilization: explain whether the query uses Index Scans or causes Sequential Table Scans.`,
          `Memory overhead: discuss tempdb / work_mem spills during sorting and grouping.`,
          `Optimization: rewrite correlated or nested subqueries into efficient joins or window functions.`
        ],
        whatInterviewerIsTesting: 'Understanding relational query execution, indexes, and memory limits.',
        commonTrap: 'Assuming adding an index always speeds up queries without considering write overhead.',
        commonFollowUp: 'How does EXPLAIN ANALYZE help identify where the query is spending execution time?'
      },
      {
        question: `In production backend architecture, how do you handle failure and ensure resilience for ${backendCloud.topic}?`,
        difficulty: 'Hard',
        category: 'Backend',
        points: [
          `Fault tolerance: apply circuit breakers, retries with exponential backoff, and fallbacks.`,
          `Data consistency: maintain idempotency keys and transactional outbox patterns.`,
          `Observability: instrument distributed trace spans and Prometheus counters.`
        ],
        whatInterviewerIsTesting: 'Real-world distributed systems resilience and failure mode mitigation.',
        commonTrap: 'Suggesting infinite retries without exponential backoff or jitter (causing thundering herds).',
        commonFollowUp: 'What happens if the circuit breaker trips while thousands of users are checking out?'
      },
      {
        question: `What are the critical architectural tradeoffs in ${aiMl.topic}?`,
        difficulty: 'Hard',
        category: 'AI/ML',
        points: [
          `Latency vs Quality: balance model parameter size vs inference time and hardware cost.`,
          `Serving optimizations: utilize quantization (INT8/FP8), model compilation, and batching.`,
          `Evaluation: prevent training data leakage and measure production drift.`
        ],
        whatInterviewerIsTesting: 'Practical AI engineering trade-offs beyond toy API calls.',
        commonTrap: 'Believing fine-tuning is always superior to RAG for factual question answering.',
        commonFollowUp: 'How do you detect when your vector retrieval pipeline is retrieving irrelevant context?'
      },
      {
        question: `Explain the core computer science mechanism underlying ${cs.topic}.`,
        difficulty: 'Medium',
        category: 'CS Fundamentals',
        points: [
          `Hardware interaction: detail CPU cache lines, registers, or kernel privilege rings.`,
          `Kernel coordination: contrast user-space execution with kernel-space system calls.`,
          `Real-world relevance: how high-performance servers (Nginx, Netty, Redis) exploit this mechanism.`
        ],
        whatInterviewerIsTesting: 'Depth of fundamental computer science knowledge and systems intuition.',
        commonTrap: 'Confusing user-mode threads with kernel-scheduled threads or process boundaries.',
        commonFollowUp: 'How does this OS primitive impact multi-threaded Java or Python applications?'
      }
    ];

    // --- DELIVERABLE, THEME & OBJECTIVE ---
    theme = `Day ${d}: ${dsa.pattern} + ${sql.topic} + ${backendCloud.track}`;
    objective = isJobMode 
      ? `[JOB MODE] Execute timed ${mockRound?.type || 'Mock Round'}, drill interview defense on ${backendCloud.topic}, and complete rapid problem sprints.`
      : `Master ${dsa.pattern} in DSA, execute Being Zero ${sql.topic}, configure ${backendCloud.topic}, and evaluate ${aiMl.topic} in high-throughput environments.`;
    deliverable = `A verified Java/Python solution to the day's DSA problems, executed SQL queries with EXPLAIN plans, and a functioning backend or AI micro-component.`;

    // --- REAL RESOURCE LINKS ---
    resources = [
      { title: 'LeetCode Practice Portal', url: dsa.problems[0].url, type: 'code' },
      { title: 'PostgreSQL Official Documentation', url: 'https://www.postgresql.org/docs/current/', type: 'doc' },
      { title: 'Spring Boot Documentation', url: 'https://docs.spring.io/spring-boot/index.html', type: 'doc' },
      { title: 'AWS Well-Architected Framework', url: 'https://aws.amazon.com/architecture/well-architected/', type: 'doc' },
      { title: 'Hugging Face Transformers Documentation', url: 'https://huggingface.co/docs/transformers/index', type: 'doc' }
    ];

    const practiceProblems: PracticeProblem[] = dsa.problems.map(p => ({
      title: p.title,
      difficulty: p.difficulty,
      platform: p.platform,
      url: p.url,
      pattern: dsa.pattern,
      description: p.desc
    }));

    const interviewQuestionsFormatted: InterviewQuestion[] = questions.map(q => ({
      question: q.question,
      difficulty: q.difficulty,
      category: q.category,
      keyAnswerPoints: q.points,
      whatInterviewerIsTesting: q.whatInterviewerIsTesting,
      commonTrap: q.commonTrap,
      commonFollowUp: q.commonFollowUp
    }));

    // --- 3-TIER REALISTIC DAILY WORKLOAD ---
    const dailyWorkload: DailyWorkloadTiers = {
      mustDo: [
        `[DSA Core] Solve ${dsa.problems[0].title} (${dsa.problems[0].difficulty}) — pattern: ${dsa.pattern}`,
        `[SQL Core] Execute Being Zero SQL: ${sql.exercise.title} (${sql.exercise.difficulty})`,
        `[Core Concept] Master ${isJobMode ? `Job Mode Simulation: ${mockRound?.type}` : backendCloud.topic}`
      ],
      shouldDo: [
        `[Hands-On Lab] ${handsOn.title}`,
        `[Interview Prep] Drill top 2 interview flashcards: "${questions[0].question.slice(0, 55)}..." and "${questions[1].question.slice(0, 55)}..."`
      ],
      optionalDo: [
        dsa.problems.length > 1 ? `[DSA Bonus] Solve secondary problem: ${dsa.problems[1].title}` : `[Code Refactor] Profile memory usage and derive asymptotic bound`,
        revision.length > 0 ? `[Spaced Revision] 10-minute flashcard review of Days: ${revision.slice(-2).join(', ')}` : `[Review] Quick scan of yesterday's key notes`
      ]
    };

    days.push({
      day: d,
      stage,
      theme,
      hours: isJobMode ? 4.0 : 3.0,
      objective,
      isJobMode,
      mockRound,
      dailyWorkload,
      dsaTrack: {
        pattern: dsa.pattern,
        concept: dsa.concept,
        problems: practiceProblems
      },
      sqlTrack: sql,
      backendCloudTrack: backendCloud,
      aiMlTrack: aiMl,
      csFoundationTrack: cs,
      handsOnEngineering: handsOn,
      interviewQuestions: interviewQuestionsFormatted,
      revisionDays: revision,
      deliverable,
      resources
    });
  }

  return days;
}
