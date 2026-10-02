import React, { useState } from 'react';

interface SystemDesignCase {
  id: string;
  title: string;
  scale: string;
  functionalReqs: string[];
  nonFunctionalReqs: string[];
  apis: string[];
  architectureAscii: string;
  dataModel: string;
  scalingAndBottlenecks: string[];
}

const systemDesignBlueprints: SystemDesignCase[] = [
  {
    id: 'url-shortener',
    title: 'Distributed URL Shortener (Bit.ly Scale)',
    scale: '100M URLs created per month, 100:1 Read-to-Write ratio, 10B reads/month (~4,000 read QPS, peak 20,000 QPS)',
    functionalReqs: [
      'Generate a unique short alias (<= 7 characters) from a given long URL.',
      'Redirect user to original long URL with HTTP 301 (Permanent) or 302 (Found) within 10ms.',
      'Optionally set custom expiration date for links and track click metrics.'
    ],
    nonFunctionalReqs: [
      'High Availability (99.999% uptime) - links must never fail to redirect.',
      'Ultra-low read latency (< 10ms redirect latency globally).',
      'No hash collisions; aliases must be strictly unique.'
    ],
    apis: [
      'POST /api/v1/urls -> Request: { "longUrl": string, "customAlias"?: string } -> Response: { "shortUrl": string, "expiresAt": string }',
      'GET /{shortKey} -> HTTP 302 Redirect to Long URL'
    ],
    architectureAscii: `
+------------+       +-------------------+       +---------------------+
|   Client   | ----> |  CloudFront CDN   | ----> | Application LB(ALB) |
+------------+       +-------------------+       +---------------------+
                                                            |
                                                            v
                                                 +---------------------+
                                                 | API Service Cluster |
                                                 +---------------------+
                                                   |                 |
                         (Cache Hit < 2ms)         v                 v       (Cache Miss)
                                          +---------------+   +-----------------------+
                                          | Redis Cluster |   | Cassandra / DynamoDB  |
                                          |  (Top 20% URLs|   | (Primary Key: shortId)|
                                          +---------------+   +-----------------------+
                                                                         ^
                                                                         |
                                                              +-----------------------+
                                                              | Twitter Snowflake ID  |
                                                              | Range Ticket Server   |
                                                              +-----------------------+
    `,
    dataModel: 'NoSQL Key-Value / Columnar (DynamoDB): Partition Key = short_key (Base62 encoded), long_url, created_at, expires_at, user_id.',
    scalingAndBottlenecks: [
      'ID Generation: Use Twitter Snowflake or Zookeeper range-allocator (e.g. Server 1 gets 1-1M, Server 2 gets 1M-2M) to prevent database roundtrips during encoding.',
      'Base62 Encoding: 62^7 combinations (~3.5 trillion URLs) guarantees capacity for 30+ years.',
      'Caching: 80-20 Pareto principle; cache top 20% daily URLs in Redis with LRU eviction to serve 95% of reads entirely from RAM.'
    ]
  },
  {
    id: 'ai-gateway',
    title: 'High-Throughput AI Inference Gateway & LLM Router',
    scale: '50M tokens/min, 2,000 concurrent streaming connections, Multi-model fallback (OpenAI, Claude, Llama 3 on vLLM)',
    functionalReqs: [
      'Unified OpenAI-compatible API endpoint routing requests dynamically across internal vLLM clusters and commercial cloud APIs.',
      'Semantic caching with embedding distance thresholds to eliminate redundant LLM calls.',
      'Streaming token generation via Server-Sent Events (SSE) with token rate-limiting per tenant.'
    ],
    nonFunctionalReqs: [
      'Time-to-First-Token (TTFT) < 300ms.',
      'Cost optimization via automatic model routing (Tier 1 cheap models for simple queries, Tier 3 reasoning models for complex prompts).',
      'Zero downtime failover: automatic fallback to secondary provider on HTTP 429 / 503 errors.'
    ],
    apis: [
      'POST /v1/chat/completions -> Request: { "model": "auto", "messages": [...], "stream": true } -> SSE Stream Tokens'
    ],
    architectureAscii: `
+----------+      +-------------------+      +--------------------------------------+
|  Client  | ---> |   Cloudflare WAF  | ---> |  API Gateway (Java 21 + Spring Web)  |
+----------+      +-------------------+      +--------------------------------------+
                                                                |
                                                                v
                                             +--------------------------------------+
                                             |  Semantic Cache (pgvector + Redis)   |
                                             |  - Cosine Distance < 0.05 => Cache Hit|
                                             +--------------------------------------+
                                                  |                     | (Cache Miss)
                                                  v                     v
                                    +--------------------+   +----------------------+
                                    | Fast Prompt Reroute|   | Self-Hosted vLLM GPU |
                                    | (DeepSeek/GPT-4o)  |   | (PagedAttention EKS) |
                                    +--------------------+   +----------------------+
    `,
    dataModel: 'PostgreSQL pgvector for prompt embeddings and semantic cache; Redis Token Bucket for tenant rate limits; ClickHouse for token analytics.',
    scalingAndBottlenecks: [
      'PagedAttention: Partitions GPU KV-cache into virtual blocks to prevent memory fragmentation and double throughput.',
      'Semantic Cache: Hashes user prompt, checks pgvector distance; if distance < 0.05, returns cached response instantly saving $0.03 and 2 seconds per query.',
      'Circuit Breakers: Resilience4j circuit breakers trip on vendor rate limits and reroute traffic within 50ms.'
    ]
  }
];

export const SystemDesignWindow: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<SystemDesignCase>(systemDesignBlueprints[0]);

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Header */}
      <div className="bg-white border-2 border-gray-300 p-2.5 rounded m-1 mb-2 shadow-xs">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
          <span>⚙️</span>
          <span>System Design Architecture Blueprints & Interactive Whiteboard</span>
        </h2>
        <p className="text-xs text-gray-600">
          Requirements → APIs → High-Level Architecture → Data Modeling → Scaling Bottlenecks → Tradeoffs.
        </p>
      </div>

      {/* Main Two-Pane View */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 m-1 overflow-hidden">
        {/* Left Column: Blueprint Selector */}
        <div className="w-full md:w-64 bg-white border border-[#7f9db9] rounded p-2 flex flex-col gap-1.5 overflow-y-auto shrink-0 shadow-xs">
          <div className="font-bold text-xs text-gray-700 uppercase mb-1">Architecture Blueprints:</div>
          {systemDesignBlueprints.map(bp => (
            <button
              key={bp.id}
              onClick={() => setSelectedCase(bp)}
              className={`w-full text-left p-2 rounded text-xs transition-colors border cursor-pointer ${
                selectedCase.id === bp.id
                  ? 'bg-blue-50 border-[#245edb] font-bold text-blue-950 shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800'
              }`}
            >
              <div className="font-bold text-xs">{bp.title}</div>
            </button>
          ))}
        </div>

        {/* Right Column: Case Study Deep Dive */}
        <div className="flex-1 overflow-y-auto bg-white border border-[#7f9db9] rounded p-3 sm:p-4 space-y-4 shadow-inner text-xs sm:text-sm">
          <div>
            <h3 className="text-base font-bold text-gray-900">{selectedCase.title}</h3>
            <div className="text-xs text-blue-900 font-mono bg-blue-50 p-2 rounded border border-blue-200 mt-1">
              <strong>Scale:</strong> {selectedCase.scale}
            </div>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="border border-gray-200 rounded p-2.5 bg-gray-50">
              <div className="font-bold text-gray-800 mb-1">Functional Requirements:</div>
              <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                {selectedCase.functionalReqs.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            <div className="border border-gray-200 rounded p-2.5 bg-gray-50">
              <div className="font-bold text-gray-800 mb-1">Non-Functional Requirements:</div>
              <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                {selectedCase.nonFunctionalReqs.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Architecture Diagram */}
          <div>
            <div className="font-bold text-xs uppercase text-gray-700 mb-1">System Architecture Flow:</div>
            <pre className="p-3 bg-gray-900 text-green-400 font-mono text-[11px] sm:text-xs rounded border border-gray-700 overflow-x-auto">
              <code>{selectedCase.architectureAscii}</code>
            </pre>
          </div>

          {/* Data Modeling & APIs */}
          <div className="space-y-2 text-xs">
            <div className="border border-gray-200 rounded p-2.5 bg-gray-50">
              <div className="font-bold text-gray-800 mb-1">Database Model & Storage Choice:</div>
              <p className="text-gray-700 font-mono text-xs">{selectedCase.dataModel}</p>
            </div>

            <div className="border border-gray-200 rounded p-2.5 bg-gray-50">
              <div className="font-bold text-gray-800 mb-1">Key Scaling Strategies & Bottlenecks:</div>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {selectedCase.scalingAndBottlenecks.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
