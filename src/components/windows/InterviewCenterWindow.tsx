import React, { useState, useMemo } from 'react';
import { masterQuestionDatabase } from '../../data/interviewQuestionsData';
import { UserProgress } from '../../types';

interface InterviewCenterWindowProps {
  progress: UserProgress;
  onToggleMastered: (questionId: string) => void;
  onOpenDay: (day: number) => void;
}

export const InterviewCenterWindow: React.FC<InterviewCenterWindowProps> = ({
  progress,
  onToggleMastered,
  onOpenDay
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<'bank' | 'flashcard'>('bank');
  const [flashcardIdx, setFlashcardIdx] = useState<number>(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState<boolean>(false);

  const categories = ['All', 'Project Defense', 'Java', 'DSA', 'SQL', 'Spring Boot', 'Backend', 'System Design', 'AWS', 'Kubernetes', 'GenAI', 'MLOps', 'Behavioral'];

  const filteredQuestions = useMemo(() => {
    return masterQuestionDatabase.filter(q => {
      if (selectedCategory !== 'All' && q.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesTopic = q.relatedTopic.toLowerCase().includes(query);
        const matchesConcepts = q.expectedConcepts.some(c => c.toLowerCase().includes(query));
        const matchesPoints = q.shortAnswerPoints.some(p => p.toLowerCase().includes(query));
        if (!matchesQ && !matchesTopic && !matchesConcepts && !matchesPoints) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const toggleAnswer = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentFlashcard = filteredQuestions[flashcardIdx] || filteredQuestions[0];

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Top Banner & Mode Toggle */}
      <div className="bg-white border-2 border-gray-300 p-2.5 rounded m-1 mb-2 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <span>🎤</span>
              <span>Interview Preparation Center & Master Question Database</span>
            </h2>
            <p className="text-xs text-gray-600">
              Curated interview questions across all 16 domains with expected talking points, related day links, and flashcard simulation.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              Mastered: {Object.values(progress.masteredQuestions).filter(Boolean).length} Questions
            </span>
            <div className="flex border rounded overflow-hidden">
              <button
                onClick={() => setMode('bank')}
                className={`px-2.5 py-1 text-xs font-bold cursor-pointer ${
                  mode === 'bank' ? 'bg-[#245edb] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Question Bank
              </button>
              <button
                onClick={() => {
                  setMode('flashcard');
                  setFlashcardIdx(0);
                  setFlashcardFlipped(false);
                }}
                className={`px-2.5 py-1 text-xs font-bold cursor-pointer ${
                  mode === 'flashcard' ? 'bg-[#245edb] text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                🃏 Flashcards
              </button>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Search questions, concepts, answers..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="xp-inset px-2.5 py-1 text-xs w-48 sm:w-64 focus:outline-hidden"
          />

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="xp-inset px-2 py-1 text-xs bg-white cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>
            ))}
          </select>

          <select
            value={selectedDifficulty}
            onChange={e => setSelectedDifficulty(e.target.value)}
            className="xp-inset px-2 py-1 text-xs bg-white cursor-pointer"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <span className="text-[11px] text-gray-500 ml-auto">
            Showing {filteredQuestions.length} questions
          </span>
        </div>
      </div>

      {/* FLASHCARD MODE */}
      {mode === 'flashcard' && currentFlashcard && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border-2 border-[#7f9db9] rounded-lg shadow-xl overflow-hidden flex flex-col min-h-[340px]">
            <div className="bg-[#ece9d8] border-b border-[#a09e97] p-2 flex items-center justify-between text-xs">
              <span className="font-bold text-gray-700">
                Card {flashcardIdx + 1} of {filteredQuestions.length} • {currentFlashcard.category}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                currentFlashcard.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                currentFlashcard.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentFlashcard.difficulty}
              </span>
            </div>

            <div
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              className="flex-1 p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-50 select-text"
            >
              {!flashcardFlipped ? (
                <div>
                  <div className="text-xs uppercase font-bold text-blue-600 mb-2">Question:</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                    {currentFlashcard.question}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1 mt-4">
                    {currentFlashcard.expectedConcepts.map((c, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 border px-1.5 py-0.5 rounded text-gray-600">
                        {c}
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-6 italic">Click to flip & reveal answer</div>
                </div>
              ) : (
                <div className="text-left w-full">
                  <div className="text-xs uppercase font-bold text-emerald-700 mb-2">Talking Points:</div>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-gray-800">
                    {currentFlashcard.shortAnswerPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                  <div className="text-[11px] text-gray-400 mt-4 text-center italic">Click to flip back to question</div>
                </div>
              )}
            </div>

            <div className="bg-[#ece9d8] border-t border-[#a09e97] p-2 flex items-center justify-between text-xs">
              <button
                disabled={flashcardIdx === 0}
                onClick={() => {
                  setFlashcardIdx(prev => Math.max(0, prev - 1));
                  setFlashcardFlipped(false);
                }}
                className="xp-button text-xs py-1 px-3 disabled:opacity-50"
              >
                ◀ Previous
              </button>

              <button
                onClick={() => onToggleMastered(currentFlashcard.id)}
                className={`xp-button text-xs py-1 px-3 font-bold ${
                  progress.masteredQuestions[currentFlashcard.id] ? 'text-green-700' : 'text-gray-800'
                }`}
              >
                {progress.masteredQuestions[currentFlashcard.id] ? '✓ Mastered' : 'Mark Mastered'}
              </button>

              <button
                disabled={flashcardIdx >= filteredQuestions.length - 1}
                onClick={() => {
                  setFlashcardIdx(prev => Math.min(filteredQuestions.length - 1, prev + 1));
                  setFlashcardFlipped(false);
                }}
                className="xp-button text-xs py-1 px-3 disabled:opacity-50"
              >
                Next ▶
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUESTION BANK TABLE / LIST MODE */}
      {mode === 'bank' && (
        <div className="flex-1 overflow-y-auto bg-white border border-[#7f9db9] m-1 rounded p-2 space-y-2 shadow-inner">
          {filteredQuestions.map(q => {
            const isRevealed = !!revealedAnswers[q.id];
            const isMastered = !!progress.masteredQuestions[q.id];

            return (
              <div key={q.id} className="border border-gray-200 rounded overflow-hidden bg-white shadow-2xs">
                <div className="p-3 bg-gray-50 flex items-start justify-between gap-2 border-b">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-bold px-1.5 py-0.2 bg-blue-100 text-blue-900 rounded uppercase">
                        {q.category}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-bold ${
                        q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {q.difficulty}
                      </span>
                      <button
                        onClick={() => onOpenDay(q.relatedDay)}
                        className="text-blue-600 hover:underline font-mono text-[10px]"
                      >
                        [Day {q.relatedDay}: {q.relatedTopic}]
                      </button>
                    </div>

                    <h3 className="font-bold text-xs sm:text-sm text-gray-900">{q.question}</h3>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {q.expectedConcepts.map((concept, cIdx) => (
                        <span key={cIdx} className="text-[10px] px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded font-mono">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="flex items-center gap-1 text-[11px] text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isMastered}
                        onChange={() => onToggleMastered(q.id)}
                        className="rounded text-green-600 cursor-pointer"
                      />
                      <span>Mastered</span>
                    </label>

                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="xp-button text-[11px] py-0.5 px-2"
                    >
                      {isRevealed ? 'Hide' : 'Answer'}
                    </button>
                  </div>
                </div>

                {isRevealed && (
                  <div className="p-3 bg-white text-xs border-t border-gray-100 space-y-2">
                    <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wide mb-1">
                      Expected Talking Points:
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-gray-800">
                      {q.shortAnswerPoints.map((pt, ptIdx) => (
                        <li key={ptIdx}>{pt}</li>
                      ))}
                    </ul>

                    {q.whatInterviewerIsTesting && (
                      <div className="text-[11px] bg-blue-50 border border-blue-200 p-2 rounded text-blue-900 mt-2">
                        <strong>🎯 What Interviewer is Testing:</strong> {q.whatInterviewerIsTesting}
                      </div>
                    )}

                    {q.commonTrap && (
                      <div className="text-[11px] bg-red-50 border border-red-200 p-2 rounded text-red-900">
                        <strong>⚠️ Common Trap:</strong> {q.commonTrap}
                      </div>
                    )}

                    {q.commonFollowUp && (
                      <div className="text-[11px] bg-purple-50 border border-purple-200 p-2 rounded text-purple-900">
                        <strong>🔄 Follow-Up Question:</strong> {q.commonFollowUp}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
