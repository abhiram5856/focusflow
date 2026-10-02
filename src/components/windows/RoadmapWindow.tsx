import React, { useState, useMemo } from 'react';
import { masterCurriculum } from '../../data/curriculumData';
import { DayPlan, UserProgress } from '../../types';
import { DayDetailModal } from './DayDetailModal';

interface RoadmapWindowProps {
  progress: UserProgress;
  onToggleComplete: (day: number) => void;
  onToggleBookmark: (day: number) => void;
  onToggleTask: (day: number, task: 'dsa' | 'sql' | 'backendCloud' | 'aiMl' | 'cs' | 'handsOn' | 'questions' | 'deliverable') => void;
  onSaveNote: (key: string, content: string) => void;
  onToggleProblemSolved?: (title: string) => void;
  onToggleQuestionMastered?: (questionId: string) => void;
}

export const RoadmapWindow: React.FC<RoadmapWindowProps> = ({
  progress,
  onToggleComplete,
  onToggleBookmark,
  onToggleTask,
  onSaveNote,
  onToggleProblemSolved,
  onToggleQuestionMastered
}) => {
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDays = useMemo(() => {
    return masterCurriculum.filter(day => {
      // Stage filter
      if (stageFilter === 'stage-1' && (day.day < 1 || day.day > 30)) return false;
      if (stageFilter === 'stage-2' && (day.day < 31 || day.day > 60)) return false;
      if (stageFilter === 'stage-3' && (day.day < 61 || day.day > 90)) return false;
      if (stageFilter === 'stage-4' && (day.day < 91 || day.day > 120)) return false;
      if (stageFilter === 'stage-5' && (day.day < 121 || day.day > 150)) return false;

      // Status filter
      const isCompleted = progress.completedDays.includes(day.day);
      const isBookmarked = progress.bookmarkedDays.includes(day.day);
      if (statusFilter === 'completed' && !isCompleted) return false;
      if (statusFilter === 'in-progress' && (isCompleted || !progress.inProgressDays.includes(day.day))) return false;
      if (statusFilter === 'not-started' && (isCompleted || progress.inProgressDays.includes(day.day))) return false;
      if (statusFilter === 'bookmarked' && !isBookmarked) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTheme = day.theme.toLowerCase().includes(query);
        const matchesDsa = day.dsaTrack.pattern.toLowerCase().includes(query) || day.dsaTrack.concept.toLowerCase().includes(query);
        const matchesSql = day.sqlTrack.topic.toLowerCase().includes(query) || day.sqlTrack.beingZeroModule.toLowerCase().includes(query);
        const matchesBackend = day.backendCloudTrack.topic.toLowerCase().includes(query);
        const matchesAi = day.aiMlTrack.topic.toLowerCase().includes(query);
        const matchesDayNum = day.day.toString() === query || `day ${day.day}`.includes(query);

        if (!matchesTheme && !matchesDsa && !matchesSql && !matchesBackend && !matchesAi && !matchesDayNum) {
          return false;
        }
      }

      return true;
    });
  }, [stageFilter, statusFilter, searchQuery, progress]);

  const completionPct = Math.round((progress.completedDays.length / masterCurriculum.length) * 100);

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Top Banner / Filter Toolbar */}
      <div className="bg-white border-2 border-gray-300 p-2.5 rounded m-1 mb-2 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div>
            <h1 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
              <span>📚</span>
              <span>150-Day Simultaneous Multi-Pillar Curriculum</span>
            </h1>
            <p className="text-xs text-gray-600">
              DSA, SQL (Being Zero Backbone), Backend/Cloud, and AI/GenAI covered simultaneously every single day.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              Completed: {progress.completedDays.length} / 150 ({completionPct}%)
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            type="text"
            placeholder="Search topic, pattern, or keyword..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="xp-inset px-2.5 py-1 text-xs w-48 sm:w-60 focus:outline-hidden"
          />

          <select
            value={stageFilter}
            onChange={e => setStageFilter(e.target.value)}
            className="xp-inset px-2 py-1 text-xs bg-white cursor-pointer"
          >
            <option value="all">All 5 Stages (Days 1–150)</option>
            <option value="stage-1">Stage 1: Multi-Pillar Foundations (Days 1–30)</option>
            <option value="stage-2">Stage 2: Core Engineering Patterns (Days 31–60)</option>
            <option value="stage-3">Stage 3: Advanced Systems & Concurrency (Days 61–90)</option>
            <option value="stage-4">Stage 4: Distributed Systems & GenAI (Days 91–120)</option>
            <option value="stage-5">Stage 5: Production LLMOps & Mocks (Days 121–150)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="xp-inset px-2 py-1 text-xs bg-white cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="completed">✅ Completed</option>
            <option value="in-progress">🟡 In Progress</option>
            <option value="bookmarked">★ Bookmarked</option>
          </select>

          <button
            onClick={() => setStatusFilter(prev => prev === 'bookmarked' ? 'all' : 'bookmarked')}
            className={`px-2 py-1 rounded border text-xs font-bold cursor-pointer transition-colors flex items-center gap-1 ${
              statusFilter === 'bookmarked'
                ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
            title="Toggle bookmarked days filter"
          >
            <span>★</span>
            <span>Bookmarks ({progress.bookmarkedDays.length})</span>
          </button>

          <span className="text-[11px] text-gray-500 ml-auto">
            Showing {filteredDays.length} of 150 days
          </span>
        </div>
      </div>

      {/* 150-Day Interactive Master Table */}
      <div className="flex-1 overflow-auto bg-white border border-[#7f9db9] m-1 rounded shadow-inner">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-[#ece9d8] border-b border-[#a09e97] text-gray-700 sticky top-0 z-10 text-[11px] font-bold">
            <tr>
              <th className="p-2 border-r border-[#d4d0c8] w-12 text-center">Day</th>
              <th className="p-2 border-r border-[#d4d0c8] w-24 text-center">Status / ★</th>
              <th className="p-2 border-r border-[#d4d0c8]">Daily Integrated Theme</th>
              <th className="p-2 border-r border-[#d4d0c8]">💻 DSA Pattern</th>
              <th className="p-2 border-r border-[#d4d0c8]">🗄️ SQL Track</th>
              <th className="p-2 border-r border-[#d4d0c8] hidden md:table-cell">🌐 Backend / Cloud</th>
              <th className="p-2 border-r border-[#d4d0c8] hidden lg:table-cell">🤖 AI / ML / GenAI</th>
              <th className="p-2 w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredDays.map(day => {
              const isCompleted = progress.completedDays.includes(day.day);
              const isBookmarked = progress.bookmarkedDays.includes(day.day);

              return (
                <tr
                  key={day.day}
                  onClick={() => setSelectedDay(day)}
                  className={`hover:bg-blue-50 cursor-pointer transition-colors ${
                    isCompleted ? 'bg-emerald-50/40' : day.day === 1 ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="p-2 border-r border-gray-200 text-center font-bold text-gray-800">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-gray-100 border border-gray-300">
                      #{day.day}
                    </span>
                  </td>

                  <td className="p-2 border-r border-gray-200 text-center" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-center gap-1.5">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => onToggleComplete(day.day)}
                        title="Mark day completed"
                        className="rounded text-emerald-600 cursor-pointer w-4 h-4"
                      />
                      <button
                        onClick={() => onToggleBookmark(day.day)}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark this day"}
                        className={`text-sm cursor-pointer transition-transform hover:scale-125 ${
                          isBookmarked ? 'text-amber-500 font-bold' : 'text-gray-300 hover:text-amber-400'
                        }`}
                      >
                        ★
                      </button>
                    </div>
                  </td>

                  <td className="p-2 border-r border-gray-200 font-semibold text-gray-900">
                    <div className="flex items-center gap-1.5">
                      {isBookmarked && <span className="text-amber-500 font-bold">★</span>}
                      <span>{day.theme}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-normal truncate max-w-md">
                      {day.objective}
                    </div>
                  </td>

                  <td className="p-2 border-r border-gray-200 text-blue-900 font-medium">
                    <div className="truncate max-w-[180px]">{day.dsaTrack.pattern}</div>
                  </td>

                  <td className="p-2 border-r border-gray-200 text-emerald-900 font-medium">
                    <div className="truncate max-w-[180px]">{day.sqlTrack.topic}</div>
                  </td>

                  <td className="p-2 border-r border-gray-200 text-purple-900 hidden md:table-cell">
                    <div className="truncate max-w-[160px]">{day.backendCloudTrack.topic}</div>
                  </td>

                  <td className="p-2 border-r border-gray-200 text-indigo-900 hidden lg:table-cell">
                    <div className="truncate max-w-[160px]">{day.aiMlTrack.topic}</div>
                  </td>

                  <td className="p-2 text-center" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedDay(day)}
                      className="xp-button text-[11px] py-0.5 px-2 font-semibold"
                    >
                      Open Plan
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Day Detail Modal View */}
      {selectedDay && (
        <DayDetailModal
          dayPlan={selectedDay}
          progress={progress}
          onClose={() => setSelectedDay(null)}
          onToggleComplete={onToggleComplete}
          onToggleBookmark={onToggleBookmark}
          onToggleTask={onToggleTask}
          onSaveNote={onSaveNote}
          onToggleProblemSolved={onToggleProblemSolved}
          onToggleQuestionMastered={onToggleQuestionMastered}
          onSelectDay={(dayNum) => {
            const nextDay = masterCurriculum.find(d => d.day === dayNum);
            if (nextDay) setSelectedDay(nextDay);
          }}
        />
      )}
    </div>
  );
};
