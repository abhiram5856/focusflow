export interface DbInterviewQuestion {
  id: string;
  category: 'Java' | 'DSA' | 'OS' | 'CN' | 'DBMS' | 'SQL' | 'Spring Boot' | 'Backend' | 'System Design' | 'AWS' | 'Docker' | 'Kubernetes' | 'ML' | 'AI' | 'GenAI' | 'MLOps' | 'Behavioral' | 'Project Defense';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  relatedDay: number;
  relatedTopic: string;
  expectedConcepts: string[];
  shortAnswerPoints: string[];
  codeSnippet?: string;
  whatInterviewerIsTesting?: string;
  commonTrap?: string;
  commonFollowUp?: string;
}

export const masterQuestionDatabase: DbInterviewQuestion[] = [
  // --- JAVA ---
  {
    id: 'q-java-1',
    category: 'Java',
    difficulty: 'Medium',
    question: 'How does HashMap handle hash collisions in Java 8+ and what is the treeification threshold?',
    relatedDay: 5,
    relatedTopic: 'Java Collections Framework',
    expectedConcepts: ['Chaining', 'Red-Black Tree', 'TREEIFY_THRESHOLD = 8', 'UNTREEIFY_THRESHOLD = 6', 'MIN_TREEIFY_CAPACITY = 64'],
    shortAnswerPoints: [
      'Java 8 stores collisions in singly-linked lists initially.',
      'When a bucket chain length reaches 8 AND total map capacity is at least 64, the linked list converts into a balanced Red-Black Tree.',
      'This improves worst-case lookup from O(N) down to O(log N).',
      'When entries in a treeified bucket drop to 6 during resizing or removal, it converts back to a linked list.'
    ],
    whatInterviewerIsTesting: 'Understanding of hash table collisions, worst-case complexity, and Java 8 performance optimizations.',
    commonTrap: 'Forgetting that total capacity must also be >= 64, otherwise the map simply resizes/doubles instead of treeifying.',
    commonFollowUp: 'What are the equals() and hashCode() requirements for objects used as HashMap keys?'
  },
  {
    id: 'q-java-2',
    category: 'Java',
    difficulty: 'Medium',
    question: 'What is the contract between equals() and hashCode() in Java, and what happens if only equals() is overridden?',
    relatedDay: 7,
    relatedTopic: 'Java Object Contract & Immutability',
    expectedConcepts: ['Contractual consistency', 'Bucketing in HashMap', 'Object identity vs state equality'],
    shortAnswerPoints: [
      'If two objects are equal by equals(), their hashCode() must return the exact same integer value.',
      'If only equals() is overridden, two logically equal objects will produce different default hash codes from Object.hashCode().',
      'They will be placed into different hash buckets in a HashMap or HashSet, making it impossible to retrieve the stored value using an equal key.'
    ],
    whatInterviewerIsTesting: 'Core Java language contracts and practical debugging knowledge in collections.',
    commonTrap: 'Saying two objects with the same hashCode must be equal (hash collisions are allowed).',
    commonFollowUp: 'Why is it recommended to make HashMap keys immutable?'
  },
  {
    id: 'q-java-3',
    category: 'Java',
    difficulty: 'Hard',
    question: 'How do Virtual Threads in Java 21 work under the hood and why should they not be pooled?',
    relatedDay: 12,
    relatedTopic: 'Java 21 Virtual Threads & Loom',
    expectedConcepts: ['Project Loom', 'Carrier Threads', 'User-mode scheduling', 'Parking on blocking I/O', 'Heap-allocated stack frames'],
    shortAnswerPoints: [
      'Virtual threads are lightweight, user-mode threads managed directly by the JVM rather than 1:1 OS kernel threads.',
      'When a virtual thread executes a blocking socket read or sleep, JVM unmounts it from its OS carrier thread and parks its stack frames on the Java heap.',
      'The carrier thread is freed immediately to execute other virtual threads.',
      'Pooling them is an anti-pattern because they take negligible memory (~hundreds of bytes) and creating millions is virtually free.'
    ],
    whatInterviewerIsTesting: 'Modern Java 21 knowledge and understanding of reactive vs virtual thread concurrency.',
    commonTrap: 'Attempting to use an ExecutorService pool with fixed thread count for Virtual Threads instead of newVirtualThreadPerTaskExecutor().',
    commonFollowUp: 'What is thread pinning and how do synchronized blocks affect Virtual Threads?'
  },

  // --- DSA ---
  {
    id: 'q-dsa-1',
    category: 'DSA',
    difficulty: 'Medium',
    question: 'Why does Kadane’s algorithm achieve O(N) time and O(1) space for Maximum Subarray?',
    relatedDay: 23,
    relatedTopic: 'Kadane & Dynamic Programming',
    expectedConcepts: ['Local optimum vs Global optimum', 'DP state compression', 'Decision at index i'],
    shortAnswerPoints: [
      'At each index i, we decide whether to add nums[i] to the running subarray or start a new subarray at nums[i].',
      'Recurrence: currentMax = Math.max(nums[i], currentMax + nums[i]).',
      'Since currentMax only depends on the immediately preceding index, space compresses from O(N) to O(1).'
    ],
    whatInterviewerIsTesting: 'DP state optimization and array scanning mechanics.',
    commonTrap: 'Initializing currentMax to 0 when all array elements are negative numbers.',
    commonFollowUp: 'How would you return the actual starting and ending indices of the maximum subarray?'
  },
  {
    id: 'q-dsa-2',
    category: 'DSA',
    difficulty: 'Hard',
    question: 'Explain the Monotonic Deque algorithm for Sliding Window Maximum.',
    relatedDay: 44,
    relatedTopic: 'Queue & Monotonic Deque',
    expectedConcepts: ['Amortized O(1)', 'Indices storage', 'Evicting suboptimal candidates'],
    shortAnswerPoints: [
      'Maintain an ArrayDeque storing indices in strictly decreasing order of their array values.',
      'Before adding current index i, pop all elements from the back whose values are <= nums[i] (they can never be the maximum in any current or future window).',
      'Pop elements from the front if their index <= i - k (out of window).',
      'The front of the deque always holds the index of the maximum element for the current window in O(1).'
    ],
    whatInterviewerIsTesting: 'Advanced data structure invariants and amortized O(1) analysis.',
    commonTrap: 'Storing element values in the deque instead of their indices, making it impossible to check if the front element is out of window.',
    commonFollowUp: 'What is the total number of push and pop operations across the entire array of size N?'
  },

  // --- SQL & BEING ZERO BACKBONE ---
  {
    id: 'q-sql-1',
    category: 'SQL',
    difficulty: 'Medium',
    question: 'Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL window functions.',
    relatedDay: 30,
    relatedTopic: 'Being Zero: Window Functions & Ranking',
    expectedConcepts: ['Ties handling', 'Gaps in ranking sequence', 'PARTITION BY'],
    shortAnswerPoints: [
      'ROW_NUMBER(): Assigns unique sequential integers (1, 2, 3, 4) regardless of duplicate values.',
      'RANK(): Assigns identical rank to ties, but leaves gaps for subsequent ranks (1, 2, 2, 4).',
      'DENSE_RANK(): Assigns identical rank to ties without skipping subsequent ranks (1, 2, 2, 3).'
    ],
    whatInterviewerIsTesting: 'Core analytical SQL competence and handling ties in competitive/business queries.',
    commonTrap: 'Confusing RANK() and DENSE_RANK() behavior after duplicate ties.',
    commonFollowUp: 'How would you find the 2nd highest salary in each department using DENSE_RANK()?'
  },
  {
    id: 'q-sql-2',
    category: 'SQL',
    difficulty: 'Hard',
    question: 'How do you solve the "Gaps and Islands" problem in SQL to identify contiguous active streaks?',
    relatedDay: 98,
    relatedTopic: 'Advanced SQL: Gaps & Islands',
    expectedConcepts: ['ROW_NUMBER difference trick', 'Date arithmetic', 'Group clustering'],
    shortAnswerPoints: [
      'Compute ROW_NUMBER() over (ORDER BY activity_date).',
      'Subtract the row number from the activity date: group_date = activity_date - ROW_NUMBER().',
      'For contiguous consecutive dates, both date and row number increment by 1 each day, making their difference a constant value.',
      'Group by (user_id, group_date) to aggregate each continuous island/streak.'
    ],
    whatInterviewerIsTesting: 'Elite relational problem-solving and window function arithmetic.',
    commonTrap: 'Attempting to use iterative cursor loops instead of declarative window functions.',
    commonFollowUp: 'How would you handle duplicate login events on the exact same date?'
  },

  // --- SYSTEM DESIGN ---
  {
    id: 'q-sd-1',
    category: 'System Design',
    difficulty: 'Hard',
    question: 'How do you design a globally scalable URL Shortener handling 100M new links per month with sub-10ms read latency?',
    relatedDay: 106,
    relatedTopic: 'System Design: URL Shortener',
    expectedConcepts: ['Base62 encoding', 'Snowflake / distributed ID generator', 'Redis LRU Cache', 'Database sharding'],
    shortAnswerPoints: [
      'Generate a 64-bit unique numeric ID using Twitter Snowflake or distributed zookeeper counter (prevents collision without DB lookups).',
      'Convert 64-bit ID to a 7-character string using Base62 encoding [0-9a-zA-Z] (62^7 ~ 3.5 trillion URLs).',
      'Store mapping in a NoSQL key-value store (DynamoDB or Cassandra) partitioned by the hash of the short key.',
      'Place Redis cache in front of DB caching the top 20% most accessed URLs (80/20 Pareto principle) for sub-5ms redirection.'
    ],
    whatInterviewerIsTesting: 'Capacity estimation, ID generation strategy, caching patterns, and high read-throughput scaling.',
    commonTrap: 'Using MD5/SHA256 and taking the first 7 characters, which causes inevitable hash collisions at scale.',
    commonFollowUp: 'Should the redirect return HTTP 301 Permanent Redirect or HTTP 302 Found? (301 reduces server load via browser cache, 302 allows tracking analytics).'
  },

  // --- SPRING BOOT & BACKEND ---
  {
    id: 'q-spring-1',
    category: 'Spring Boot',
    difficulty: 'Medium',
    question: 'How do you solve the Hibernate N+1 Select Problem in a Spring Boot JPA application?',
    relatedDay: 48,
    relatedTopic: 'Spring Data JPA & Hibernate Performance',
    expectedConcepts: ['Lazy loading', 'JOIN FETCH', 'EntityGraph', 'Batch size'],
    shortAnswerPoints: [
      'N+1 occurs when fetching N parent entities triggers N separate secondary queries to load related lazy child entities.',
      'Solution 1: Use JPQL "JOIN FETCH p.children" to load parent and children in a single SQL inner/left join.',
      'Solution 2: Use @EntityGraph specifying attribute paths.',
      'Solution 3: Configure default_batch_fetch_size: 50 in application.yml to fetch collections in batches via WHERE parent_id IN (...).'
    ],
    whatInterviewerIsTesting: 'Real-world ORM performance troubleshooting and SQL awareness under JPA.',
    commonTrap: 'Switching lazy fetching to EAGER fetching, which actually worsens the N+1 problem on JPQL queries.',
    commonFollowUp: 'What happens if you use JOIN FETCH with multiple bag collections in Hibernate?'
  },

  // --- AWS CLOUD & DEVOPS ---
  {
    id: 'q-cloud-1',
    category: 'AWS',
    difficulty: 'Medium',
    question: 'What is the architectural difference between a Security Group and a Network ACL (NACL) in AWS VPC?',
    relatedDay: 72,
    relatedTopic: 'AWS VPC Networking',
    expectedConcepts: ['Stateful vs Stateless', 'Instance level vs Subnet level', 'Allow rules vs Allow/Deny rules'],
    shortAnswerPoints: [
      'Security Group: Operates at the EC2/ENI instance level. Stateful (inbound traffic allowed automatically allows return outbound traffic). Supports Allow rules only.',
      'NACL: Operates at the Subnet boundary level. Stateless (inbound and outbound rules must be explicitly configured). Evaluated in numbered rule order; supports both Allow and Deny rules.'
    ],
    whatInterviewerIsTesting: 'Cloud network security fundamentals and VPC architecture.',
    commonTrap: 'Thinking Security Groups support explicit Deny rules (only NACLs support explicit Deny).',
    commonFollowUp: 'If an EC2 instance in a private subnet needs to download packages from GitHub, what VPC component is required? (NAT Gateway).'
  },
  {
    id: 'q-devops-1',
    category: 'Kubernetes',
    difficulty: 'Medium',
    question: 'What is the difference between a Kubernetes Liveness Probe and a Readiness Probe?',
    relatedDay: 122,
    relatedTopic: 'Kubernetes Health Checks',
    expectedConcepts: ['Pod lifecycle', 'Restart policy', 'Service endpoint routing'],
    shortAnswerPoints: [
      'Liveness Probe: Checks if the application container is still running. If it fails, Kubernetes kills the container and restarts it according to its restartPolicy.',
      'Readiness Probe: Checks if the application is ready to accept incoming traffic (e.g. finished warming caches, DB connected). If it fails, the pod is removed from Service endpoints so no traffic routes to it, but the pod is NOT killed.'
    ],
    whatInterviewerIsTesting: 'Container orchestration resiliency and zero-downtime deployment mechanics.',
    commonTrap: 'Using heavy external database queries inside the Liveness probe (if DB is slow, Kubernetes cascades container restarts).',
    commonFollowUp: 'What is a Startup Probe and when should it be used?'
  },

  // --- AI / ML / GENAI / MLOPS ---
  {
    id: 'q-ai-1',
    category: 'GenAI',
    difficulty: 'Hard',
    question: 'Explain how Hybrid Search combines dense vector embeddings with sparse BM25 and why it outperforms naive RAG.',
    relatedDay: 114,
    relatedTopic: 'Advanced RAG & Vector Retrieval',
    expectedConcepts: ['Dense embeddings', 'BM25 sparse keyword', 'Reciprocal Rank Fusion (RRF)', 'Out-of-domain generalization'],
    shortAnswerPoints: [
      'Dense embeddings excel at semantic similarity and conceptual matches, but often fail on exact keyword search (e.g. acronyms, error codes, part numbers).',
      'BM25 is a frequency-based sparse search that excels at exact lexical matching.',
      'Hybrid search executes both in parallel and merges ranked lists using Reciprocal Rank Fusion: RRF_score = sum(1 / (k + rank_i)), then reranks with a cross-encoder.',
      'Eliminates the major retrieval failure modes of standard vector-only RAG.'
    ],
    whatInterviewerIsTesting: 'Deep GenAI retrieval architectures and understanding the limitations of pure vector similarity.',
    commonTrap: 'Assuming dense vector embeddings capture all nuance and that BM25 is obsolete.',
    commonFollowUp: 'How does Cross-Encoder reranking differ in latency and architecture from Bi-Encoder embedding retrieval?'
  },
  {
    id: 'q-mlops-1',
    category: 'MLOps',
    difficulty: 'Hard',
    question: 'What is PagedAttention in vLLM and how does it solve GPU memory fragmentation during LLM inference?',
    relatedDay: 138,
    relatedTopic: 'vLLM & LLM Serving Optimization',
    expectedConcepts: ['KV Cache', 'Virtual memory paging analogy', 'Continuous batching', 'Memory waste elimination'],
    shortAnswerPoints: [
      'During LLM generation, the Key-Value (KV) cache grows dynamically with each generated token.',
      'Traditional serving pre-allocates contiguous memory for maximum context length, wasting 60-80% of GPU RAM due to internal and external fragmentation.',
      'PagedAttention applies OS virtual memory paging to the KV cache: it partitions KV cache into fixed-size blocks (e.g. 16 tokens) stored in non-contiguous physical GPU memory.',
      'Achieves near-zero memory waste and enables 2x-4x higher concurrency (QPS).'
    ],
    whatInterviewerIsTesting: 'Modern high-throughput LLM serving infrastructure and GPU VRAM management.',
    commonTrap: 'Thinking PagedAttention quantizes model weights (it optimizes KV cache memory layout, not weight precision).',
    commonFollowUp: 'How does speculative decoding further reduce latency on top of PagedAttention?'
  },

  // --- PROJECT DEFENSE (FOR CAPSTONE PORTFOLIO INTERVIEWS) ---
  {
    id: 'q-proj-def-1',
    category: 'Project Defense',
    difficulty: 'Hard',
    question: 'Why did you choose PostgreSQL with pgvector instead of a dedicated standalone vector database like Pinecone or Milvus?',
    relatedDay: 146,
    relatedTopic: 'Project 1 & 2 Architectural Defense',
    expectedConcepts: ['ACID consistency', 'Eliminating dual-write distributed transactions', 'Metadata filtering efficiency', 'Operational overhead'],
    shortAnswerPoints: [
      'Single Source of Truth: In our AI SWE Agent, codebase metadata (file paths, commit hashes, AST symbol tables) lives directly alongside vector embeddings.',
      'Zero Distributed Inconsistency: Using an external vector DB requires 2-phase commits or outbox patterns to prevent vector/metadata drift when files change.',
      'Filtered Vector Search: PostgreSQL executes relational filters (e.g. WHERE repo_id = 42 AND branch = "main") and vector similarity in a single query execution plan using HNSW indexing.',
      'Operational Simplicity: Eliminates the cost, network hop, and maintenance burden of running an independent third-party cluster.'
    ],
    whatInterviewerIsTesting: 'Practical systems maturity and resisting the urge to adopt specialized tools when relational solutions excel.',
    commonTrap: 'Saying pgvector is faster at 100M+ scale (dedicated vector DBs scale better horizontally, but pgvector is ideal for unified relational metadata).',
    commonFollowUp: 'At what vector scale would pgvector become a bottleneck and necessitate migrating to a distributed vector index?'
  },
  {
    id: 'q-proj-def-2',
    category: 'Project Defense',
    difficulty: 'Hard',
    question: 'In your AI SWE Agent or ML Platform, what happens if Apache Kafka crashes or a broker partition becomes unavailable?',
    relatedDay: 147,
    relatedTopic: 'Project Resiliency & Failure Modes',
    expectedConcepts: ['Replication factor', 'min.insync.replicas', 'Transactional Outbox', 'Consumer rebalance'],
    shortAnswerPoints: [
      'Cluster Durability: We configure topics with replication.factor=3 and min.insync.replicas=2 with acks=all so a single broker crash causes zero message loss.',
      'Ingestion Resiliency: If Kafka is completely unreachable, Spring Boot producers fall back to writing events into a local PostgreSQL transactional outbox table.',
      'CDC / Debezium polling resumes pushing from the outbox table to Kafka as soon as connectivity restores.',
      'Consumer Rebalancing: CooperativeStickyAssignor ensures unimpacted consumer instances continue processing during partition reassignment.'
    ],
    whatInterviewerIsTesting: 'Understanding distributed failure scenarios and the Transactional Outbox pattern.',
    commonTrap: 'Claiming Kafka will never fail or having no fallback storage strategy.',
    commonFollowUp: 'How do you guarantee that consumer microservices process webhook events idempotently without double-charging or duplicate PR creation?'
  },
  {
    id: 'q-proj-def-3',
    category: 'Project Defense',
    difficulty: 'Hard',
    question: 'How do you evaluate whether your RAG retrieval pipeline is genuinely retrieving relevant context or hallucinating?',
    relatedDay: 148,
    relatedTopic: 'RAG Evaluation & Quality Assurance',
    expectedConcepts: ['Ragas evaluation framework', 'Faithfulness metric', 'Context Precision & Recall', 'Ground truth synthetic datasets'],
    shortAnswerPoints: [
      'We use Ragas (Retrieval Augmented Generation Assessment) to compute objective component scores on synthetic test splits.',
      'Context Precision & Recall: Measures whether retrieved chunks from pgvector contain the exact ground-truth answer and minimize noise.',
      'Faithfulness: Measures whether claims in the generated response can be directly inferred from the retrieved context (hallucination detection).',
      'Answer Relevance: Measures semantic alignment between the user query and generated response.',
      'Automated CI/CD Thresholds: Any prompt template or chunking strategy change must maintain Faithfulness > 0.90 to pass the build.'
    ],
    whatInterviewerIsTesting: 'Rigorous engineering methodology vs "eyeballing" LLM responses.',
    commonTrap: 'Saying "I test it with a few prompt examples manually and it looks good."',
    commonFollowUp: 'How do you generate a golden synthetic evaluation dataset when ground truth human labels are scarce?'
  },

  // --- BEHAVIORAL ---
  {
    id: 'q-beh-1',
    category: 'Behavioral',
    difficulty: 'Medium',
    question: 'Tell me about a time you encountered a catastrophic production bug or outage. How did you diagnose, resolve, and prevent it?',
    relatedDay: 149,
    relatedTopic: 'STAR Behavioral Interview',
    expectedConcepts: ['STAR framework', 'Blameless post-mortem', 'Root-cause analysis', 'Guardrail implementation'],
    shortAnswerPoints: [
      'Situation: Database connection pool exhaustion caused 500 errors on checkout API during holiday peak traffic.',
      'Task: Mitigate user impact immediately, identify the leak, and restore checkout transactions.',
      'Action: Rolled back recent deployment to stable version, inspected thread dumps using jstack, found an unclosed JDBC connection inside an asynchronous billing event listener.',
      'Result: Restored traffic within 6 minutes. Added connection leak detection threshold in HikariCP, implemented automated Testcontainers integration tests, and wrote a blameless post-mortem.'
    ],
    whatInterviewerIsTesting: 'Problem solving under pressure, communication structure, and learning from failure.',
    commonTrap: 'Blaming a coworker or not having a concrete technical prevention step.',
    commonFollowUp: 'How did you communicate the issue to non-technical stakeholders during the incident?'
  }
];
