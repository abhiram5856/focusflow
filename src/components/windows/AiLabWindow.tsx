import React, { useState } from 'react';

export const AiLabWindow: React.FC = () => {
  const [knowledgeText, setKnowledgeText] = useState<string>(
`Kafka cluster utilizes 3-way replication across availability zones.
Session timeouts are configured to 10000ms with a heartbeat interval of 3000ms.
Circuit breakers trip after 5 consecutive 5xx errors or when P99 latency exceeds 250ms over a 1-minute window.
Redis clusters use write-through caching with a TTL of 3600 seconds on user sessions.`
  );
  const [userQuery, setUserQuery] = useState<string>('When does the circuit breaker trip and what is the timeout?');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ragResult, setRagResult] = useState<{
    chunks: string[];
    topChunk: string;
    denseScore: number;
    bm25Score: number;
    rerankScore: number;
    response: string;
  } | null>(null);

  const handleRunRag = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setRagResult({
        chunks: [
          'Kafka cluster utilizes 3-way replication across availability zones.',
          'Session timeouts are configured to 10000ms with a heartbeat interval of 3000ms.',
          'Circuit breakers trip after 5 consecutive 5xx errors or when P99 latency exceeds 250ms over a 1-minute window.',
          'Redis clusters use write-through caching with a TTL of 3600 seconds on user sessions.'
        ],
        topChunk: 'Circuit breakers trip after 5 consecutive 5xx errors or when P99 latency exceeds 250ms over a 1-minute window.',
        denseScore: 0.942,
        bm25Score: 14.82,
        rerankScore: 0.988,
        response: 'Based on the system documentation, circuit breakers trip after encountering 5 consecutive 5xx errors or when P99 latency exceeds 250ms over a 1-minute window. Additionally, Kafka session timeouts are configured at 10,000ms with a 3,000ms heartbeat interval.'
      });
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text overflow-y-auto p-2 space-y-3">
      {/* Header */}
      <div className="bg-white border-2 border-gray-300 p-2.5 rounded shadow-xs">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
          <span>🤖</span>
          <span>GenAI & RAG Pipeline Interactive Simulator</span>
        </h2>
        <p className="text-xs text-gray-600">
          Visualize each stage of production RAG: Chunking, Dense Vector Embeddings (pgvector), BM25 Keyword Search, Cross-Encoder Reranking & LLM Generation.
        </p>
      </div>

      {/* RAG Pipeline Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Step 1: Knowledge Ingestion */}
        <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-blue-900">
            <span>Step 1: Document Knowledge Ingestion</span>
            <span className="text-[10px] text-gray-500 font-mono">Input Corpus</span>
          </div>
          <textarea
            value={knowledgeText}
            onChange={e => setKnowledgeText(e.target.value)}
            rows={5}
            className="w-full p-2 font-mono text-xs border rounded bg-gray-50 text-gray-800"
          />
        </div>

        {/* Step 2: Query & Execution */}
        <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-purple-900">
            <span>Step 2: Semantic User Query</span>
            <span className="text-[10px] text-gray-500 font-mono">Prompt Input</span>
          </div>
          <input
            type="text"
            value={userQuery}
            onChange={e => setUserQuery(e.target.value)}
            className="w-full p-2 text-xs border rounded bg-gray-50 text-gray-900 font-semibold"
          />
          <button
            onClick={handleRunRag}
            disabled={isProcessing}
            className="w-full xp-button bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-1.5 text-xs shadow hover:brightness-105"
          >
            {isProcessing ? 'Processing Embeddings & Reranking...' : '🚀 Execute End-to-End RAG Pipeline'}
          </button>
        </div>
      </div>

      {/* Pipeline Stages Visualization */}
      {ragResult && (
        <div className="space-y-3 animate-in fade-in duration-200">
          {/* Metrics bar */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-blue-50 border border-blue-200 rounded p-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Dense Cosine Similarity</span>
              <span className="font-mono text-sm font-bold text-blue-900">{ragResult.denseScore}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded p-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 block uppercase">BM25 Sparse Score</span>
              <span className="font-mono text-sm font-bold text-emerald-900">{ragResult.bm25Score}</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded p-2 text-center">
              <span className="text-[10px] font-bold text-gray-500 block uppercase">Cross-Encoder Rerank</span>
              <span className="font-mono text-sm font-bold text-purple-900">{ragResult.rerankScore}</span>
            </div>
          </div>

          {/* Top Retrieved Chunk */}
          <div className="bg-white border border-[#7f9db9] rounded p-3 shadow-xs">
            <div className="font-bold text-xs text-gray-700 uppercase mb-1">
              Top Retrieved Context Chunk (PostgreSQL pgvector + Reranker):
            </div>
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded font-mono text-xs text-amber-950">
              "{ragResult.topChunk}"
            </div>
          </div>

          {/* Generated Augmented Response */}
          <div className="bg-white border-2 border-emerald-500 rounded p-3 shadow-sm">
            <div className="font-bold text-xs text-emerald-800 uppercase mb-1 flex items-center gap-1.5">
              <span>✨</span>
              <span>Augmented Generation Output (Synthesized by LLM):</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-900 leading-relaxed font-sans">
              {ragResult.response}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
