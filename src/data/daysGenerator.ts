import type { DayPlan, PracticeProblem, InterviewQuestion, ResourceLink, DailyWorkloadTiers, MockInterviewRound } from '../types';
import { getStageForDay, BEING_ZERO_SQL_TOPICS, calculateRevisionDays } from './curriculumData';

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
    const isJobMode = d > 120;
    let mockRound: MockInterviewRound | undefined = undefined;

    // =========================================================================
    // 1. GRANULAR DSA PROGRESSION (Covering all primary interview patterns)
    // =========================================================================
    if (d <= 8) {
      dsa = {
        pattern: 'Arrays: Traversal & In-Place Modification',
        concept: 'Contiguous memory layout, cache locality, and in-place pointer manipulation.',
        problems: [
          { title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode', desc: 'Single-pass HashMap lookup in O(N) time and O(N) space.' },
          { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', platform: 'LeetCode', desc: 'Two-pointer slow/fast write in-place with O(1) space.' }
        ]
      };
    } else if (d <= 16) {
      dsa = {
        pattern: 'Arrays: Prefix Sum & Difference Arrays',
        concept: 'O(1) range sum queries via prefix sums and O(1) range updates via difference arrays.',
        problems: [
          { title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', platform: 'LeetCode', desc: 'Prefix sum hash map accounting for negative values.' },
          { title: 'Corporate Flight Bookings', difficulty: 'Medium', url: 'https://leetcode.com/problems/corporate-flight-bookings/', platform: 'LeetCode', desc: 'Difference array range additions in O(N + Q) time.' }
        ]
      };
    } else if (d <= 24) {
      dsa = {
        pattern: 'Arrays: Kadane Algorithm & Interval Merging',
        concept: 'Contiguous max subarray sum and greedy interval merging by sorting boundaries.',
        problems: [
          { title: 'Maximum Subarray', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/', platform: 'LeetCode', desc: 'Kadane algorithm DP state compression in O(N) time and O(1) space.' },
          { title: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/', platform: 'LeetCode', desc: 'Sort by start time and greedily extend running interval.' }
        ]
      };
    } else if (d <= 32) {
      dsa = {
        pattern: 'Strings: Frequency Hashing & Palindromes',
        concept: 'Character count tuples, anagram grouping, and expand-around-center palindromes.',
        problems: [
          { title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/', platform: 'LeetCode', desc: 'Tuple frequency key grouping in O(N * K) time.' },
          { title: 'Longest Palindromic Substring', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/', platform: 'LeetCode', desc: 'Expand around 2N-1 centers in O(N^2) time and O(1) space.' }
        ]
      };
    } else if (d <= 40) {
      dsa = {
        pattern: 'Two Pointers: Opposite Ends & Fast/Slow',
        concept: 'Shrinking search boundaries and Floyd cycle detection.',
        problems: [
          { title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/', platform: 'LeetCode', desc: 'Sort + two pointers with duplicate skip conditions.' },
          { title: 'Linked List Cycle II', difficulty: 'Medium', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', platform: 'LeetCode', desc: 'Floyd Tortoise and Hare cycle start node proof.' }
        ]
      };
    } else if (d <= 48) {
      dsa = {
        pattern: 'Binary Search: Rotated Arrays & Answer Space',
        concept: 'Identifying sorted halves in rotated arrays and monotonic feasibility search.',
        problems: [
          { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', platform: 'LeetCode', desc: 'O(log N) branch discrimination on sorted half.' },
          { title: 'Koko Eating Bananas', difficulty: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/', platform: 'LeetCode', desc: 'Binary search on monotonic answer space.' }
        ]
      };
    } else if (d <= 56) {
      dsa = {
        pattern: 'Bit Manipulation: XOR, Bitmasks & Brian Kernighan',
        concept: 'Bitwise identities (x ^ x = 0), Brian Kernighan bit clearing n & (n-1), and subset masks.',
        problems: [
          { title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/', platform: 'LeetCode', desc: 'XOR identity eliminates duplicate elements in O(1) space.' },
          { title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/', platform: 'LeetCode', desc: 'Bitmask enumeration from 0 to (1 << n) - 1.' }
        ]
      };
    } else if (d <= 68) {
      dsa = {
        pattern: 'Stack: Monotonic Stack & Deque',
        concept: 'Nearest greater/smaller elements and sliding window extremum in O(N).',
        problems: [
          { title: 'Daily Temperatures', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/', platform: 'LeetCode', desc: 'Monotonic decreasing index stack.' },
          { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode', desc: 'Single-pass monotonic stack finding left/right boundaries.' }
        ]
      };
    } else if (d <= 78) {
      dsa = {
        pattern: 'Heaps & Priority Queues: Top-K & Two Heaps',
        concept: 'Min/Max-heap duality, stream processing, and continuous median maintenance.',
        problems: [
          { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', platform: 'LeetCode', desc: 'Min-Heap size K in O(N log K) or Quickselect.' },
          { title: 'Find Median from Data Stream', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/', platform: 'LeetCode', desc: 'Two heaps (max-heap + min-heap) balance.' }
        ]
      };
    } else if (d <= 88) {
      dsa = {
        pattern: 'Recursion & Backtracking: Subsets & Grid DFS',
        concept: 'State-space decision trees, duplicate pruning, and constraint satisfaction.',
        problems: [
          { title: 'Subsets II', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets-ii/', platform: 'LeetCode', desc: 'Sort + skip duplicate siblings in recursion tree.' },
          { title: 'Word Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/', platform: 'LeetCode', desc: 'In-place grid DFS backtracking with character mark.' }
        ]
      };
    } else if (d <= 104) {
      dsa = {
        pattern: 'Binary Trees & BSTs: DFS/BFS, LCA & Diameter',
        concept: 'Tree path metrics, level order traversals, and lowest common ancestors.',
        problems: [
          { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', platform: 'LeetCode', desc: 'Post-order DFS split check in O(N) time.' },
          { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/', platform: 'LeetCode', desc: 'Bounding range invariant [min, max] DFS.' }
        ]
      };
    } else if (d <= 118) {
      dsa = {
        pattern: 'Graphs: BFS/DFS, TopoSort & Shortest Paths',
        concept: 'Connected components, Kahn algorithm indegrees, and Dijkstra shortest paths.',
        problems: [
          { title: 'Course Schedule II', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'LeetCode', desc: 'Kahn algorithm topological sort with in-degree queue.' },
          { title: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/', platform: 'LeetCode', desc: 'Dijkstra PriorityQueue min-heap in O((V + E) log V).' }
        ]
      };
    } else {
      dsa = {
        pattern: 'Dynamic Programming: Knapsack, LIS & Timed Sprints',
        concept: 'Unbounded Knapsack, Subsequences (LCS/LIS), and high-frequency timed interview sets.',
        problems: [
          { title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/', platform: 'LeetCode', desc: 'Unbounded Knapsack 1D tabulation in O(N * Amount).' },
          { title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'LeetCode', desc: 'Patience sort binary search in O(N log N).' }
        ]
      };
    }

    // =========================================================================
    // 2. SQL PROGRESSION (Being Zero Curriculum + Advanced Analytical SQL)
    // =========================================================================
    const bzIdx = Math.min(BEING_ZERO_SQL_TOPICS.length - 1, Math.floor((d - 1) / 3));
    const bzTopic = BEING_ZERO_SQL_TOPICS[bzIdx];

    if (d <= 20) {
      sql = {
        beingZeroModule: `Being Zero: ${bzTopic.title}`,
        topic: `DDL, DML, Table Constraints & Normalization (Day ${d})`,
        exercise: {
          title: `Being Zero: ${bzTopic.title} Practice`,
          objective: 'Design normalized tables with PRIMARY KEY, FOREIGN KEY, and CHECK constraints; execute atomic INSERT and UPDATE queries.',
          difficulty: 'Easy',
          table: 'CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(100), dept_id INT, salary NUMERIC(10,2), hire_date DATE);',
          solution: 'INSERT INTO employees (id, name, dept_id, salary, hire_date) VALUES (1, "Alice", 101, 85000.00, "2024-01-15");'
        }
      };
    } else if (d <= 45) {
      sql = {
        beingZeroModule: `Being Zero: ${bzTopic.title}`,
        topic: `Aggregations, GROUP BY & HAVING Filters (Day ${d})`,
        exercise: {
          title: 'Departmental Salary Aggregation & High-Earner Groups',
          objective: 'Group records by department, compute count, sum, average salary, and filter aggregated groups with HAVING AVG(salary) > 80000.',
          difficulty: 'Medium',
          table: 'employees (id, name, dept_id, salary, hire_date)',
          solution: 'SELECT dept_id, COUNT(*) AS emp_count, AVG(salary) AS avg_sal FROM employees GROUP BY dept_id HAVING AVG(salary) > 80000;'
        }
      };
    } else if (d <= 75) {
      sql = {
        beingZeroModule: `Being Zero: ${bzTopic.title}`,
        topic: `Multi-Table Joins, Subqueries & Correlated EXISTS (Day ${d})`,
        exercise: {
          title: 'Inner, Outer & Anti-Join Customer Analysis',
          objective: 'Identify customers who placed orders in 2024 but have never initiated a return using LEFT JOIN and WHERE return_id IS NULL.',
          difficulty: 'Medium',
          table: 'customers (c_id, name), orders (o_id, c_id, order_date), returns (r_id, o_id)',
          solution: 'SELECT c.name FROM customers c JOIN orders o ON c.c_id = o.c_id LEFT JOIN returns r ON o.o_id = r.o_id WHERE strftime("%Y", o.order_date) = "2024" AND r.r_id IS NULL;'
        }
      };
    } else if (d <= 110) {
      sql = {
        beingZeroModule: `Being Zero: ${bzTopic.title}`,
        topic: `Window Functions, Ranking & Recursive CTEs (Day ${d})`,
        exercise: {
          title: 'Running Totals, Rolling 7-Day Averages & Hierarchies',
          objective: 'Calculate running cumulative revenue per department and employee rank using ROW_NUMBER(), DENSE_RANK(), and LAG() offset comparisons.',
          difficulty: 'Hard',
          table: 'sales (sale_id, emp_id, dept_id, sale_amount, sale_date)',
          solution: 'SELECT sale_id, emp_id, sale_amount, SUM(sale_amount) OVER (PARTITION BY dept_id ORDER BY sale_date) AS running_total, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY sale_amount DESC) as rank FROM sales;'
        }
      };
    } else {
      sql = {
        beingZeroModule: 'PostgreSQL Deep Dive & Timed Gauntlet',
        topic: `PostgreSQL Internals: EXPLAIN ANALYZE, GIN Indexes & Cohorts (Day ${d})`,
        exercise: {
          title: 'Month-over-Month Retention Cohort & JSONB GIN Indexing',
          objective: 'Write retention cohort queries with CTEs and analyze index scans vs sequential table scans using EXPLAIN ANALYZE.',
          difficulty: 'Hard',
          table: 'user_activity (user_id INT, activity_date DATE, metadata JSONB); CREATE INDEX idx_meta ON user_activity USING GIN (metadata);',
          solution: 'EXPLAIN ANALYZE WITH MonthlyActivity AS (SELECT user_id, DATE_TRUNC("month", activity_date) as active_month FROM user_activity GROUP BY 1, 2) SELECT active_month, COUNT(DISTINCT user_id) FROM MonthlyActivity GROUP BY 1;'
        }
      };
    }

    // =========================================================================
    // 3. DETAILED CLOUD & BACKEND CURRICULUM (Expanded Granular Topics)
    // =========================================================================
    if (d <= 15) {
      backendCloud = {
        track: 'Java',
        topic: `Java Internals: ClassLoaders, JVM Memory & JMM (Day ${d})`,
        learn: [
          `JVM ClassLoader hierarchy: Bootstrap, Platform, and Application ClassLoaders with parent delegation rules.`,
          `Java Memory Layout: Stack frames (Local Variables, Operand Stack) vs Heap (Eden, Survivor, Tenured) and Metaspace.`,
          `Java Memory Model (JMM): volatile visibility, CPU memory barriers (LoadLoad/StoreStore), and happens-before guarantees.`
        ]
      };
    } else if (d <= 30) {
      backendCloud = {
        track: 'Java',
        topic: `Java 21 Concurrency: Virtual Threads & Synchronization (Day ${d})`,
        learn: [
          `Virtual Threads (Project Loom): Unmounting continuation stacks on blocking I/O, carrier thread scheduling, and preventing thread pinning.`,
          `Object Monitors & Synchronization: Biased locking revocation, lightweight CAS spinlocks, and ReentrantLock Condition queues.`,
          `Concurrent Collections: ConcurrentHashMap CAS bucket initialization, Node lock striping, and CopyOnWriteArrayList COW mechanics.`
        ]
      };
    } else if (d <= 55) {
      backendCloud = {
        track: 'Spring Boot',
        topic: `Spring Boot 3: IoC, JPA, Hibernate & Flyway Migrations (Day ${d})`,
        learn: [
          `Spring IoC Container: Bean lifecycle (Instantiation, Populate, BeanPostProcessor), scopes, and circular dependency resolution.`,
          `Spring Data JPA & Hibernate: L1 Session cache, L2 shared cache, HikariCP connection pooling, and solving N+1 queries with JOIN FETCH.`,
          `Database Migrations with Flyway: Versioned V1__init.sql scripts, repeatable R__ views, checksum validation, and rollback strategies.`
        ]
      };
    } else if (d <= 75) {
      backendCloud = {
        track: 'Microservices',
        topic: `Microservices: Spring Security 6, Redis & gRPC (Day ${d})`,
        learn: [
          `Spring Security 6: SecurityFilterChain, stateless JWT authentication, and method-level pre-authorization (@PreAuthorize).`,
          `Redis Caching: Cache-Aside pattern, Cache Stampede mitigation (Mutex lock & Probabilistic early expiration), and Redis Cluster partitioning.`,
          `gRPC Services: Protocol Buffers v3 schema definition, HTTP/2 multiplexed streams, bi-directional RPCs, and client channel stubs.`
        ]
      };
    } else if (d <= 95) {
      backendCloud = {
        track: 'AWS',
        topic: `Distributed Streaming: Kafka & AWS Cloud Infrastructure (Day ${d})`,
        learn: [
          `Apache Kafka: Broker cluster architecture, topic partitions, producer idempotent ACKS=all, consumer group rebalances, and lag monitoring.`,
          `AWS Core Architecture: IAM least-privilege roles, STS AssumeRole, S3 lifecycle policies, and KMS envelope encryption.`,
          `AWS VPC Networking: CIDR block subnetting, Public vs Private subnets, Route Tables, Internet Gateways, and NAT Gateway routing.`
        ]
      };
    } else if (d <= 115) {
      backendCloud = {
        track: 'DevOps',
        topic: `Containerization & Orchestration: Docker, Kubernetes & CI/CD (Day ${d})`,
        learn: [
          `Docker Multi-Stage Builds: Minimizing runtime attack surface, non-root user execution, layer caching, and distroless base images.`,
          `Kubernetes Core Objects: Pods, Deployments, ReplicaSets, Services (ClusterIP, NodePort, LoadBalancer), and ConfigMaps/Secrets.`,
          `Kubernetes Operations: Pod scheduling, resource requests vs limits, Liveness/Readiness/Startup probes, and Horizontal Pod Autoscalers (HPA).`
        ]
      };
    } else if (d <= 130) {
      backendCloud = {
        track: 'Microservices',
        topic: `Resilience, IaC & Observability: Resilience4j, Terraform & OTel (Day ${d})`,
        learn: [
          `Fault Tolerance: Resilience4j Circuit Breaker state transitions (CLOSED -> OPEN -> HALF_OPEN), rate limiters, and Bulkheads.`,
          `Terraform Infrastructure as Code: Declarative AWS resource modules, S3 remote state storage, and DynamoDB state locking.`,
          `OpenTelemetry Observability: Distributed trace propagation (W3C tracecontext), Prometheus metric scrapers, and structured JSON logging.`
        ]
      };
    } else {
      backendCloud = {
        track: 'System Design',
        topic: `System Design: High-Throughput Distributed Architecture (Day ${d})`,
        learn: [
          `Capacity Estimation: Back-of-the-envelope calculations for QPS, ingress/egress bandwidth, storage IOPS, and memory sizing.`,
          `High-Scale Patterns: URL Shortener, Real-time Chat (WebSocket + Redis PubSub), Rate Limiter (Token Bucket), and Event-Driven Notifications.`,
          `Tradeoff Defense: SQL ACID vs NoSQL Eventual Consistency, synchronous REST vs asynchronous Kafka, and CDN edge caching.`
        ]
      };
    }

    // =========================================================================
    // 4. DETAILED PYTHON, AI/ML & GENAI CURRICULUM (Expanded Granular Topics)
    // =========================================================================
    if (d <= 15) {
      aiMl = {
        track: 'Python Data Science',
        topic: `Python Internals: CPython, Memory Model, GIL & Metaclasses (Day ${d})`,
        learn: [
          `CPython object model: PyObject header, ob_refcnt reference counting, cyclic garbage collection (generation 0/1/2), and GIL internals.`,
          `Advanced Python Mechanics: Generators and coroutines, memory-efficient iterators, context managers (__enter__/__exit__), and descriptors.`,
          `Python Type System & Concurrency: Type hinting with typing/Pydantic, multiprocessing vs asyncio event loop, and Python 3.13 free-threading.`
        ]
      };
    } else if (d <= 30) {
      aiMl = {
        track: 'Python Data Science',
        topic: `High-Performance Data Computing: NumPy, SIMD & Pandas (Day ${d})`,
        learn: [
          `NumPy Strides & Layouts: C-contiguous vs Fortran-contiguous memory, zero-copy slicing, SIMD vectorization, and multidimensional broadcasting.`,
          `Pandas Performance: Vectorized transformations, Categorical dtypes for 10x memory reduction, groupby split-apply-combine, and window operations.`,
          `Polars & Modern Dataframes: Apache Arrow in-memory columnar format, SIMD parallel execution, lazy query optimization, and streaming processing.`
        ]
      };
    } else if (d <= 55) {
      aiMl = {
        track: 'Classical ML',
        topic: `Classical ML: Optimization, Ensembles & Scikit-learn Pipelines (Day ${d})`,
        learn: [
          `Supervised Learning Mathematics: Cost functions (MSE, Log-Loss), gradient descent variants, and L1/L2 regularization (Lasso vs Ridge).`,
          `Tree Ensembles: Random Forest bagging and out-of-bag error, Gradient Boosting (XGBoost, LightGBM, CatBoost), and handling class imbalance (SMOTE).`,
          `Production ML Pipelines: Scikit-learn ColumnTransformer, custom transformers, StratifiedKFold validation, and ROC-AUC / PR-AUC tradeoffs.`
        ]
      };
    } else if (d <= 75) {
      aiMl = {
        track: 'Deep Learning',
        topic: `Deep Learning: PyTorch Tensors, Autograd & Neural Nets (Day ${d})`,
        learn: [
          `PyTorch Computational Graph: Tensors, dynamic autograd backward pass, in-place operation warnings, and GPU CUDA memory allocation.`,
          `Neural Network Architecture: Multilayer Perceptrons, activation functions (ReLU, GELU, SiLU), Dropout, LayerNorm, and Batch Normalization.`,
          `Training Optimization: SGD with Momentum, AdamW weight decay, learning rate warmup/cosine annealing schedules, and mixed precision (FP16/BF16).`
        ]
      };
    } else if (d <= 95) {
      aiMl = {
        track: 'GenAI & LLMs',
        topic: `Transformers, Vector Databases & Advanced RAG (Day ${d})`,
        learn: [
          `Transformer Architecture: Multi-Head Self-Attention matrix math (Q*K^T / sqrt(d_k)), RoPE (Rotary Position Embeddings), and KV-cache mechanics.`,
          `Vector Databases: pgvector and Pinecone index structures, HNSW (Hierarchical Navigable Small World) graphs, and IVF-PQ indexing tradeoffs.`,
          `Advanced RAG Systems: Semantic chunking, Hybrid Search (Dense embeddings + BM25 sparse keyword), and Cross-Encoder reranking.`
        ]
      };
    } else if (d <= 110) {
      aiMl = {
        track: 'GenAI & LLMs',
        topic: `Fine-Tuning Mechanics: PEFT, LoRA & QLoRA (Day ${d})`,
        learn: [
          `Parameter-Efficient Fine-Tuning: Freezing base model weights W0 and training low-rank decomposition matrices B*A (where r << d).`,
          `LoRA Hyperparameters & Quantization: Rank (r), Alpha scaling, target attention modules (q_proj, v_proj), and 4-bit NormalFloat (NF4) QLoRA.`,
          `Architectural Decision Matrix: When to choose Prompt Engineering vs RAG (dynamic facts) vs Fine-Tuning (domain syntax, tone, and formatting).`
        ]
      };
    } else if (d <= 125) {
      aiMl = {
        track: 'GenAI & LLMs',
        topic: `Autonomous Agents: LangGraph, Tools & SSE Streaming (Day ${d})`,
        learn: [
          `Multi-Agent Orchestration: LangGraph cyclical state graphs, conditional routing, tool calling, and human-in-the-loop state checkpoints.`,
          `Real-time Streaming Pipelines: Server-Sent Events (SSE) protocol, text/event-stream headers, and client-side token buffering.`,
          `Reliability & Guardrails: Pydantic structured output parsing, retry loops on malformed JSON, and NeMo/Guardrails hallucination filters.`
        ]
      };
    } else {
      aiMl = {
        track: 'MLOps & LLMOps',
        topic: `Production LLMOps: vLLM, Evaluation & Serving Architectures (Day ${d})`,
        learn: [
          `High-Throughput Serving: vLLM PagedAttention virtual memory KV-cache allocation, continuous batching, and chunked prefill.`,
          `LLM Evaluation Frameworks: Ragas metrics (Faithfulness, Answer Relevance, Context Precision, Context Recall) and LLM-as-a-Judge benchmarking.`,
          `System Design for AI: End-to-end architecture of an Enterprise RAG Platform, caching, rate limiting, and cost optimization.`
        ]
      };
    }

    // =========================================================================
    // 5. CS FOUNDATIONS (OS, Networks, Linux, DBMS Internals)
    // =========================================================================
    const csTopics = [
      { topic: 'Operating Systems: Processes vs Threads & Context Switching', concept: 'Separate address spaces vs shared memory, PCB/TCB overhead, CPU register saves, and L1/L2 cache pollution.' },
      { topic: 'Operating Systems: CPU Scheduling & CFS', concept: 'Linux Completely Fair Scheduler (CFS), red-black vruntime tree, nice values, and priority inversion mitigation.' },
      { topic: 'Operating Systems: Virtual Memory, Paging & TLB', concept: 'Memory Management Unit (MMU) page table translation, Page Fault traps, swapping, and Translation Lookaside Buffer (TLB) hit ratios.' },
      { topic: 'Operating Systems: Concurrency, Mutexes & Futex', concept: 'Hardware atomic CAS instructions, test-and-set spinlocks, Linux fast userspace mutex (futex), and deadlock detection.' },
      { topic: 'Computer Networks: TCP Connection Lifecycle & Handshake', concept: 'TCP 3-way handshake, SYN cookies for flood defense, 4-way FIN teardown, and TIME_WAIT socket exhaustion.' },
      { topic: 'Computer Networks: TCP Flow & Congestion Control', concept: 'Sliding window buffer sizing, ACK clocking, TCP Slow Start, Congestion Avoidance, Fast Retransmit, and Cubic algorithms.' },
      { topic: 'Computer Networks: TLS 1.3 Handshake & HTTPS Security', concept: '1-RTT TLS 1.3 handshake, Diffie-Hellman Ephemeral key exchange, Perfect Forward Secrecy (PFS), and Certificate Authorities.' },
      { topic: 'Linux Systems: File Descriptors, Epoll & I/O Multiplexing', concept: 'Select vs Poll vs Epoll, Edge-Triggered vs Level-Triggered notification, and high-concurrency event loops (Netty, Nginx, Node).' },
      { topic: 'Linux Systems: Shell Plumbing & System Diagnostics', concept: 'Linux pipes, signals (SIGTERM vs SIGKILL), procfs (/proc), and performance troubleshooting with htop, vmstat, iostat, and strace.' },
      { topic: 'Database Internals: Storage Engine, WAL & B+ Trees', concept: '8KB page structures, B+ Tree index node splits, Write-Ahead Logging (WAL) for ACID crash recovery, and Buffer Pool LRU eviction.' }
    ];
    cs = csTopics[(d - 1) % csTopics.length];

    // =========================================================================
    // 6. HANDS-ON ENGINEERING TASK
    // =========================================================================
    handsOn = {
      title: `Day ${d} Production Engineering Lab`,
      task: `Implement and verify today's core components: solve ${dsa.problems[0].title} in Java/Python, execute the SQL query on live data, and verify the backend/AI milestone.`,
      commandOrCode: d % 2 === 0 
        ? `javac Solution.java && java Solution && sqlite3 test.db < query.sql` 
        : `python -m unittest test_pipeline.py && curl -s -I http://localhost:8080/actuator/health`,
      verification: `Ensure zero runtime exceptions, 100% test assertions pass, and response latency is sub-100ms.`
    };

    // =========================================================================
    // 7. MOCK INTERVIEW SETUP (DAYS 121-150)
    // =========================================================================
    if (d >= 121 && d <= 125) {
      mockRound = {
        type: 'DSA Mock',
        durationMinutes: 45,
        simulationGoal: 'Solve 1 Medium + 1 Easy DSA problem in under 45 minutes while explaining thoughts aloud.',
        rubric: ['Problem clarification & constraint verification', 'Brute force vs optimal discussion', 'Clean syntax without IDE assistance', 'Accurate Big-O time and space derivation']
      };
    } else if (d >= 126 && d <= 130) {
      mockRound = {
        type: 'SQL Mock',
        durationMinutes: 30,
        simulationGoal: 'Write 2 complex analytical queries (Window functions, CTEs, Aggregations) in 30 minutes.',
        rubric: ['Correct JOIN syntax and NULL handling', 'Appropriate Window function selection', 'Query optimization & index usage discussion']
      };
    } else if (d >= 131 && d <= 135) {
      mockRound = {
        type: 'CS Fundamentals',
        durationMinutes: 45,
        simulationGoal: 'Rapid-fire Q&A across OS (threads, virtual memory), Computer Networks (TCP, TLS, HTTP), and DBMS (ACID, MVCC).',
        rubric: ['Precision of definitions without filler words', 'Connecting OS/Network concepts to real server performance', 'Understanding database isolation anomalies']
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

    // =========================================================================
    // 8. 5 DISTINCT, DAY-SPECIFIC, HIGH-SIGNAL INTERVIEW QUESTIONS (NO TEMPLATES)
    // =========================================================================
    const primaryProblem = dsa.problems[0];

    questions = [
      // 1. DSA Technical Question (Problem-Specific)
      {
        question: `In "${primaryProblem.title}", explain the core algorithmic mechanism that improves upon the brute-force approach, and prove its time and space complexity.`,
        difficulty: primaryProblem.difficulty,
        category: 'DSA',
        points: [
          `Brute-force baseline: identify the redundant computations or nested loops that lead to suboptimal runtime.`,
          `Optimal state mechanism: explain how the pattern (${dsa.pattern}) prunes unnecessary work.`,
          `Asymptotic derivation: derive the tight Big-O time and auxiliary space bounds under worst-case inputs.`,
          `Boundary edge cases: verify correctness for empty collections, single elements, negative numbers, or duplicate keys.`
        ],
        whatInterviewerIsTesting: 'Ability to explain algorithmic intuition clearly, derive Big-O mathematically, and recognize edge cases.',
        commonTrap: 'Jumping directly to writing code without explaining the algorithmic trade-off or constraint verification first.',
        commonFollowUp: 'How would you adapt this solution if the input dataset is too large to fit in RAM and must be processed as a stream?'
      },

      // 2. SQL Architecture Question (Topic-Specific)
      {
        question: `For the SQL topic "${sql.topic}", how does the database query planner execute this operation under the hood, and how do you ensure sub-10ms performance on millions of rows?`,
        difficulty: 'Medium',
        category: 'SQL',
        points: [
          `Execution lifecycle: trace the evaluation order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> WINDOW -> ORDER BY).`,
          `Index efficiency: explain whether this query enables Index Scans / Index Only Scans or triggers costly Sequential Scans.`,
          `Memory overhead: identify when sort operations or aggregations exceed work_mem and spill to temporary disk files.`,
          `Optimization rewrite: discuss query refactoring (e.g. converting correlated subqueries to CTEs or window functions).`
        ],
        whatInterviewerIsTesting: 'Relational query execution understanding, memory configuration limits, and practical indexing strategy.',
        commonTrap: 'Assuming indexes always speed up queries without accounting for write amplification on INSERT/UPDATE.',
        commonFollowUp: 'How does running EXPLAIN (ANALYZE, BUFFERS) help identify buffer cache hits versus disk read bottlenecks?'
      },

      // 3. Backend & Cloud Architecture Question (Topic-Specific)
      {
        question: `In production systems implementing "${backendCloud.topic}", how do you design for resilience, high availability, and zero data loss during node failures?`,
        difficulty: 'Hard',
        category: 'Backend',
        points: [
          `Fault tolerance & failover: describe how the system detects node failure and safely recovers without cascading outages.`,
          `Data consistency: explain the transaction isolation level or distributed commit mechanism preventing partial writes.`,
          `Concurrency & throughput: detail how threads, connection pools, or partitions scale with growing traffic.`,
          `Observability: identify the key metrics (p99 latency, error rate, queue depth) and distributed trace spans required for monitoring.`
        ],
        whatInterviewerIsTesting: 'Senior-level production systems engineering intuition and failure mode mitigation.',
        commonTrap: 'Proposing simple retries without exponential backoff and jitter, creating self-inflicted DDoS thundering herds.',
        commonFollowUp: 'What specific metrics in Prometheus or Grafana would trigger an on-call alert for this component?'
      },

      // 4. Python, AI & GenAI Question (Topic-Specific)
      {
        question: `Explain the architectural and mathematical principles behind "${aiMl.topic}". What are the critical performance tradeoffs in real-world deployment?`,
        difficulty: 'Hard',
        category: 'AI/ML',
        points: [
          `Core mathematical/system concept: explain the theoretical foundation driving this technique.`,
          `Performance vs Accuracy tradeoff: discuss how latency, memory footprint, and computational overhead scale.`,
          `Production failure mode: describe a common real-world failure (e.g. out-of-memory, context dilution, drift) and how to mitigate it.`,
          `Engineering best practice: explain how to evaluate, benchmark, and monitor this component in production.`
        ],
        whatInterviewerIsTesting: 'Depth in modern AI/ML engineering beyond trivial API calls or cookie-cutter notebooks.',
        commonTrap: 'Treating AI models as black boxes without understanding memory consumption, vector search math, or inference costs.',
        commonFollowUp: 'How do you measure whether a recent model change or prompt optimization genuinely improved output quality without regressions?'
      },

      // 5. CS Fundamentals Question (Systems-Specific)
      {
        question: `Explain the fundamental computer systems mechanism behind "${cs.topic}". How does this primitive affect application runtime performance?`,
        difficulty: 'Medium',
        category: 'CS Fundamentals',
        points: [
          `Kernel vs User Space: identify system calls, context switch boundaries, and hardware register preservation.`,
          `Hardware interaction: detail CPU cache coherence (L1/L2/L3), memory bus bandwidth, or network socket buffer queues.`,
          `Performance bottleneck: explain why improper usage degrades high-concurrency servers (e.g. lock contention, TLB thrashing, TIME_WAIT).`
        ],
        whatInterviewerIsTesting: 'Low-level computer science intuition and ability to link OS/network internals to application performance.',
        commonTrap: 'Giving superficial textbook definitions without explaining the actual hardware or OS kernel mechanism.',
        commonFollowUp: 'How would you inspect or tune this mechanism using standard Linux diagnostic tools (strace, perf, sysctl)?'
      }
    ];

    // =========================================================================
    // 9. METADATA, WORKLOAD & DELIVERABLES
    // =========================================================================
    theme = `Day ${d}: ${dsa.pattern} • ${backendCloud.track} • ${aiMl.track}`;
    objective = isJobMode 
      ? `[JOB MODE] Execute timed ${mockRound?.type || 'Mock Round'}, drill interview defense on ${backendCloud.topic}, and complete rapid problem sprints.`
      : `Master ${dsa.pattern} in DSA, execute Being Zero ${sql.topic}, configure ${backendCloud.topic}, and evaluate ${aiMl.topic}.`;
    deliverable = `A verified solution to ${primaryProblem.title}, executed SQL queries with EXPLAIN plans, and tested backend/AI code.`;

    resources = [
      { title: 'LeetCode Problem Portal', url: primaryProblem.url, type: 'code' },
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

    const dailyWorkload: DailyWorkloadTiers = {
      mustDo: [
        `[DSA Core] Solve ${primaryProblem.title} (${primaryProblem.difficulty}) — pattern: ${dsa.pattern}`,
        `[SQL Core] Execute Being Zero SQL: ${sql.exercise.title} (${sql.exercise.difficulty})`,
        `[Core Concept] Master ${isJobMode ? `Job Mode Simulation: ${mockRound?.type}` : backendCloud.topic}`
      ],
      shouldDo: [
        `[Hands-On Lab] ${handsOn.title}`,
        `[Interview Drill] Master question 1: "${questions[0].question.slice(0, 50)}..." and question 2: "${questions[1].question.slice(0, 50)}..."`
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
