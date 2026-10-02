import React, { useState, useMemo } from 'react';
import { masterCurriculum } from '../../data/curriculumData';
import { masterQuestionDatabase } from '../../data/interviewQuestionsData';
import { portfolioProjects } from '../../data/projectsData';

interface SearchWindowProps {
  onOpenDay: (day: number) => void;
  onOpenApp: (appId: string) => void;
}

export const SearchWindow: React.FC<SearchWindowProps> = ({
  onOpenDay,
  onOpenApp
}) => {
  const [query, setQuery] = useState<string>('Kafka');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { days: [], questions: [], projects: [] };

    // Search Days
    const matchedDays = masterCurriculum.filter(day => {
      return (
        day.theme.toLowerCase().includes(q) ||
        day.objective.toLowerCase().includes(q) ||
        day.dsaTrack.pattern.toLowerCase().includes(q) ||
        day.sqlTrack.topic.toLowerCase().includes(q) ||
        day.backendCloudTrack.topic.toLowerCase().includes(q) ||
        day.backendCloudTrack.learn.some(l => l.toLowerCase().includes(q)) ||
        day.aiMlTrack.topic.toLowerCase().includes(q) ||
        day.aiMlTrack.learn.some(l => l.toLowerCase().includes(q)) ||
        day.csFoundationTrack.topic.toLowerCase().includes(q) ||
        day.day.toString() === q
      );
    });

    // Search Interview Questions
    const matchedQuestions = masterQuestionDatabase.filter(ques => {
      return (
        ques.question.toLowerCase().includes(q) ||
        ques.relatedTopic.toLowerCase().includes(q) ||
        ques.expectedConcepts.some(c => c.toLowerCase().includes(q)) ||
        ques.shortAnswerPoints.some(pt => pt.toLowerCase().includes(q))
      );
    });

    // Search Projects
    const matchedProjects = portfolioProjects.filter(proj => {
      return (
        proj.title.toLowerCase().includes(q) ||
        proj.tagline.toLowerCase().includes(q) ||
        proj.domains.some(d => d.toLowerCase().includes(q)) ||
        proj.techStack.some(s => s.technologies.some(t => t.toLowerCase().includes(q))) ||
        proj.resumeBulletPoints.some(b => b.toLowerCase().includes(q))
      );
    });

    return {
      days: matchedDays,
      questions: matchedQuestions,
      projects: matchedProjects
    };
  }, [query]);

  const totalMatches = searchResults.days.length + searchResults.questions.length + searchResults.projects.length;

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Search Input Bar */}
      <div className="bg-white border-2 border-gray-300 p-3 rounded m-1 mb-2 shadow-xs space-y-2">
        <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <span>🔍</span>
          <span>Global Unified Search (Days, Topics, Questions, Projects & Resources)</span>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type any keyword (e.g. Kafka, Redis, Trees, RAG, Virtual Threads)..."
            className="flex-1 xp-inset px-3 py-1.5 text-xs font-mono focus:outline-hidden"
          />
          <button
            onClick={() => {}}
            className="xp-button text-xs font-bold py-1 px-4 cursor-pointer"
          >
            Search
          </button>
        </div>
        <div className="text-[11px] text-gray-500 flex items-center justify-between">
          <span>Found {totalMatches} total results for "{query}"</span>
          <span className="flex gap-2">
            <span>Days: {searchResults.days.length}</span>
            <span>Questions: {searchResults.questions.length}</span>
            <span>Projects: {searchResults.projects.length}</span>
          </span>
        </div>
      </div>

      {/* Results Container */}
      <div className="flex-1 overflow-y-auto m-1 bg-white border border-[#7f9db9] rounded p-3 space-y-4 shadow-inner text-xs">
        {/* MATCHED DAYS */}
        {searchResults.days.length > 0 && (
          <div>
            <div className="font-bold text-xs uppercase text-blue-900 border-b pb-1 mb-2 flex items-center gap-1.5">
              <span>📅</span> Matched Curriculum Days ({searchResults.days.length}):
            </div>
            <div className="space-y-1.5">
              {searchResults.days.map(day => (
                <div
                  key={day.day}
                  onClick={() => onOpenDay(day.day)}
                  className="p-2 border border-gray-200 rounded hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-blue-800 mr-2">Day {day.day}:</span>
                    <span className="font-semibold text-gray-900">{day.theme}</span>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate max-w-xl">
                      {day.objective}
                    </div>
                  </div>
                  <span className="xp-button text-[11px] shrink-0 ml-2">Open Day ▶</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATCHED INTERVIEW QUESTIONS */}
        {searchResults.questions.length > 0 && (
          <div>
            <div className="font-bold text-xs uppercase text-emerald-900 border-b pb-1 mb-2 flex items-center gap-1.5">
              <span>🎤</span> Matched Interview Questions ({searchResults.questions.length}):
            </div>
            <div className="space-y-1.5">
              {searchResults.questions.map(q => (
                <div
                  key={q.id}
                  onClick={() => onOpenApp('interview-center')}
                  className="p-2 border border-gray-200 rounded hover:bg-emerald-50 cursor-pointer flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-900 rounded">
                        {q.category}
                      </span>
                      <span className="text-[10px] text-gray-500">[Related Day {q.relatedDay}: {q.relatedTopic}]</span>
                    </div>
                    <div className="font-semibold text-gray-900">{q.question}</div>
                  </div>
                  <span className="xp-button text-[11px] shrink-0 ml-2">View Answer</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MATCHED PROJECTS */}
        {searchResults.projects.length > 0 && (
          <div>
            <div className="font-bold text-xs uppercase text-purple-900 border-b pb-1 mb-2 flex items-center gap-1.5">
              <span>🚀</span> Matched Portfolio Projects ({searchResults.projects.length}):
            </div>
            <div className="space-y-1.5">
              {searchResults.projects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => onOpenApp('projects')}
                  className="p-2 border border-gray-200 rounded hover:bg-purple-50 cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-gray-900">{proj.title}</div>
                    <div className="text-[11px] text-gray-600">{proj.tagline}</div>
                  </div>
                  <span className="xp-button text-[11px] shrink-0 ml-2">Open Project</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalMatches === 0 && (
          <div className="h-40 flex flex-col items-center justify-center text-gray-400 italic">
            <span>No results found for "{query}". Try a different keyword like "Kafka", "SQL", "Tree", or "AWS".</span>
          </div>
        )}
      </div>
    </div>
  );
};
