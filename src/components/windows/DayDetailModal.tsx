import React, { useState } from 'react';
import { DayPlan, UserProgress } from '../../types';

interface DayDetailModalProps {
  dayPlan: DayPlan;
  progress: UserProgress;
  onClose: () => void;
  onToggleComplete: (day: number) => void;
  onToggleBookmark: (day: number) => void;
  onToggleTask: (day: number, task: 'dsa' | 'sql' | 'backendCloud' | 'aiMl' | 'cs' | 'handsOn' | 'questions' | 'deliverable') => void;
  onSaveNote: (key: string, content: string) => void;
  onSelectDay: (day: number) => void;
  onToggleProblemSolved?: (title: string) => void;
  onToggleQuestionMastered?: (questionId: string) => void;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  dayPlan,
  progress,
  onClose,
  onToggleComplete,
  onToggleBookmark,
  onToggleTask,
  onSaveNote,
  onSelectDay,
  onToggleProblemSolved,
  onToggleQuestionMastered
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'dsa' | 'sql' | 'backend' | 'ai' | 'questions' | 'notes'>('overview');
  const [revealedQuestions, setRevealedQuestions] = useState<Record<number, boolean>>({});
  const [localNote, setLocalNote] = useState<string>(progress.notes[`day-${dayPlan.day}`] || '');

  const isCompleted = progress.completedDays.includes(dayPlan.day);
  const isBookmarked = progress.bookmarkedDays.includes(dayPlan.day);
  const dayTasks = progress.dayTasks[dayPlan.day] || {
    dsa: false,
    sql: false,
    backendCloud: false,
    aiMl: false,
    cs: false,
    handsOn: false,
    questions: false,
    deliverable: false
  };

  const toggleQuestion = (idx: number) => {
    setRevealedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSaveNote = () => {
    onSaveNote(`day-${dayPlan.day}`, localNote);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 animate-in fade-in duration-100">
      <div className="xp-window w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border-3 border-[#0055ea]">
        {/* Title Bar */}
        <div className="xp-window-titlebar flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2 truncate">
            <span>📅</span>
            <span className="font-bold text-xs md:text-sm text-white drop-shadow truncate">
              Day {dayPlan.day}: {dayPlan.theme}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => onToggleBookmark(dayPlan.day)}
              className="text-xs px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white cursor-pointer"
              title="Bookmark Day"
            >
              {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
            <button
              onClick={() => onToggleComplete(dayPlan.day)}
              className={`text-xs px-2.5 py-0.5 rounded font-bold cursor-pointer transition-colors ${
                isCompleted
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-amber-400 text-gray-900 hover:bg-amber-500'
              }`}
            >
              {isCompleted ? '✓ Completed' : 'Mark Complete'}
            </button>
            <button
              onClick={onClose}
              className="xp-titlebar-btn xp-btn-close text-xs ml-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Header */}
        <div className="bg-[#ece9d8] border-b border-[#a09e97] px-2 pt-1 flex gap-1 overflow-x-auto text-xs shrink-0">
          {[
            { id: 'overview', label: '🎯 Daily Overview', icon: '📋' },
            { id: 'dsa', label: '💻 DSA Pillar', icon: '⚡' },
            { id: 'sql', label: '🗄️ Being Zero SQL', icon: '📊' },
            { id: 'backend', label: '🌐 Backend & Cloud', icon: '☁️' },
            { id: 'ai', label: '🤖 AI / ML / GenAI', icon: '🧠' },
            { id: 'questions', label: `🎤 Questions (${dayPlan.interviewQuestions.length})`, icon: '❓' },
            { id: 'notes', label: '📝 Notepad Notes', icon: '✍️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-t font-medium border-t border-l border-r cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors ${
                activeTab === tab.id
                  ? 'bg-white border-[#7f9db9] font-bold text-[#0055ea] -mb-px z-10 shadow-xs'
                  : 'bg-[#d8d4c8] border-[#a09e97] text-gray-700 hover:bg-[#e4e0d4]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto bg-white p-3 sm:p-4 text-gray-800 text-xs sm:text-sm select-text">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded p-3">
                <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-1">
                  {dayPlan.stage} • Target Study Time: {dayPlan.hours} Hours
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5">{dayPlan.theme}</h2>
                <p className="text-gray-700 leading-relaxed"><span className="font-bold text-blue-900">🎯 Objective:</span> {dayPlan.objective}</p>
              </div>

              {/* FINAL 30-DAY JOB MODE BANNER (IF ACTIVE) */}
              {dayPlan.isJobMode && dayPlan.mockRound && (
                <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-3 rounded-lg border-2 border-purple-400 shadow-md">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="font-bold text-sm flex items-center gap-2">
                      <span className="text-amber-300">🎯 FINAL 30-DAY JOB MODE:</span>
                      <span>{dayPlan.mockRound.type} Simulation</span>
                    </div>
                    <span className="text-xs bg-purple-700/80 border border-purple-400 px-2 py-0.5 rounded font-mono">
                      ⏱️ Time Limit: {dayPlan.mockRound.durationMinutes} Minutes
                    </span>
                  </div>
                  <p className="text-xs text-purple-100 mb-2">{dayPlan.mockRound.simulationGoal}</p>
                  <div className="text-[11px] bg-purple-950/70 p-2 rounded border border-purple-500/40">
                    <div className="font-bold text-amber-300 mb-1">Interview Evaluation Rubric:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-purple-200">
                      {dayPlan.mockRound.rubric.map((r, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-emerald-400">✓</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3-TIER REALISTIC DAILY WORKLOAD */}
              {dayPlan.dailyWorkload && (
                <div className="border border-indigo-200 rounded p-3 bg-gradient-to-br from-indigo-50/50 to-white space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-950 border-b pb-1">
                    <span>⏱️ Realistic 3-Tier Daily Workload Priority:</span>
                    <span className="text-[11px] text-gray-500 font-normal">Busy day? Do MUST only (60–90 min)</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {/* Tier 1: MUST */}
                    <div className="bg-red-50/70 border border-red-200 rounded p-2 text-xs">
                      <div className="font-bold text-red-900 mb-1 flex items-center justify-between">
                        <span>🔴 MUST DO (Core)</span>
                        <span className="text-[10px] bg-red-100 text-red-800 px-1 rounded font-normal">60–90m</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-800 text-[11px]">
                        {dayPlan.dailyWorkload.mustDo.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Tier 2: SHOULD */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded p-2 text-xs">
                      <div className="font-bold text-amber-900 mb-1 flex items-center justify-between">
                        <span>🟡 SHOULD DO</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded font-normal">45–60m</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-800 text-[11px]">
                        {dayPlan.dailyWorkload.shouldDo.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Tier 3: OPTIONAL */}
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded p-2 text-xs">
                      <div className="font-bold text-emerald-900 mb-1 flex items-center justify-between">
                        <span>🟢 OPTIONAL (Stretch)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded font-normal">20–30m</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-gray-800 text-[11px]">
                        {dayPlan.dailyWorkload.optionalDo.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Daily Checklist Tracker */}
              <div className="border border-gray-300 rounded p-3 bg-gray-50">
                <div className="font-bold text-xs uppercase text-gray-700 mb-2 flex items-center justify-between">
                  <span>8-Pillar Daily Completion Checklist:</span>
                  <span className="text-blue-600 font-semibold">
                    {Object.values(dayTasks).filter(Boolean).length} / 8 Completed
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[
                    { key: 'dsa', label: '1. DSA Practice Solved' },
                    { key: 'sql', label: '2. SQL Exercise Run' },
                    { key: 'backendCloud', label: '3. Backend/Cloud Concept' },
                    { key: 'aiMl', label: '4. AI/ML/GenAI Concept' },
                    { key: 'cs', label: '5. CS Foundation Studied' },
                    { key: 'handsOn', label: '6. Hands-On Task Verified' },
                    { key: 'questions', label: '7. 5 Questions Mastered' },
                    { key: 'deliverable', label: '8. Deliverable Produced' }
                  ].map(item => (
                    <label
                      key={item.key}
                      className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded cursor-pointer hover:bg-blue-50/50"
                    >
                      <input
                        type="checkbox"
                        checked={dayTasks[item.key as keyof typeof dayTasks]}
                        onChange={() => onToggleTask(dayPlan.day, item.key as any)}
                        className="rounded text-blue-600 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-gray-800">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Pillars Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="border border-blue-200 bg-blue-50/40 rounded p-2.5">
                  <div className="font-bold text-xs text-blue-800 mb-1 flex items-center gap-1">
                    <span>💻</span> DSA: {dayPlan.dsaTrack.pattern}
                  </div>
                  <p className="text-xs text-gray-700">{dayPlan.dsaTrack.concept}</p>
                </div>

                <div className="border border-emerald-200 bg-emerald-50/40 rounded p-2.5">
                  <div className="font-bold text-xs text-emerald-800 mb-1 flex items-center gap-1">
                    <span>🗄️</span> SQL: {dayPlan.sqlTrack.topic}
                  </div>
                  <p className="text-xs text-gray-700">{dayPlan.sqlTrack.beingZeroModule}</p>
                </div>

                <div className="border border-purple-200 bg-purple-50/40 rounded p-2.5">
                  <div className="font-bold text-xs text-purple-800 mb-1 flex items-center gap-1">
                    <span>🤖</span> AI/ML: {dayPlan.aiMlTrack.track}
                  </div>
                  <p className="text-xs text-gray-700">{dayPlan.aiMlTrack.topic}</p>
                </div>
              </div>

              {/* Hands-On Task */}
              <div className="border border-amber-300 bg-amber-50/50 rounded p-3">
                <div className="font-bold text-xs text-amber-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span>🛠️</span> Hands-on Engineering Task: {dayPlan.handsOnEngineering.title}
                </div>
                <p className="text-xs text-gray-800 mb-2">{dayPlan.handsOnEngineering.task}</p>
                {dayPlan.handsOnEngineering.commandOrCode && (
                  <pre className="bg-gray-900 text-green-400 p-2 rounded text-xs overflow-x-auto font-mono mb-2">
                    <code>{dayPlan.handsOnEngineering.commandOrCode}</code>
                  </pre>
                )}
                <div className="text-[11px] text-amber-800 bg-amber-100/70 p-1.5 rounded">
                  <span className="font-bold">Verification:</span> {dayPlan.handsOnEngineering.verification}
                </div>
              </div>

              {/* CS Foundation & Deliverable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-gray-200 rounded p-2.5 bg-gray-50">
                  <div className="font-bold text-xs text-gray-800 mb-1">🧠 CS Foundation: {dayPlan.csFoundationTrack.topic}</div>
                  <p className="text-xs text-gray-600">{dayPlan.csFoundationTrack.concept}</p>
                </div>
                <div className="border border-gray-200 rounded p-2.5 bg-gray-50">
                  <div className="font-bold text-xs text-gray-800 mb-1">📦 Deliverable</div>
                  <p className="text-xs text-gray-600">{dayPlan.deliverable}</p>
                </div>
              </div>

              {/* Spaced Revision Recommendations */}
              {dayPlan.revisionDays.length > 0 && (
                <div className="border border-indigo-200 bg-indigo-50/40 rounded p-2.5">
                  <div className="font-bold text-xs text-indigo-900 mb-1">🔁 Spaced Repetition Revision for Today:</div>
                  <div className="flex flex-wrap gap-2">
                    {dayPlan.revisionDays.map(revDay => (
                      <button
                        key={revDay}
                        onClick={() => onSelectDay(revDay)}
                        className="px-2 py-0.5 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700 cursor-pointer font-medium"
                      >
                        Revise Day {revDay}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* External Resources */}
              <div className="border border-gray-200 rounded p-2.5">
                <div className="font-bold text-xs text-gray-800 mb-1.5">🔗 Verified Real Resource Links:</div>
                <div className="flex flex-wrap gap-2">
                  {dayPlan.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs rounded border border-blue-300 font-medium"
                    >
                      <span>{res.type === 'code' ? '💻' : res.type === 'video' ? '🎥' : '📖'}</span>
                      <span>{res.title}</span>
                      <span className="text-[10px] opacity-75">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DSA TAB */}
          {activeTab === 'dsa' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <div className="font-bold text-sm text-blue-900 mb-1">Pattern: {dayPlan.dsaTrack.pattern}</div>
                <p className="text-xs text-gray-700">{dayPlan.dsaTrack.concept}</p>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900 mb-2">Target Practice Problems</h3>
                <div className="space-y-2">
                  {dayPlan.dsaTrack.problems.map((prob, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 border rounded hover:bg-gray-50 bg-white">
                      <div>
                        <div className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                          <span>{prob.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                            prob.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            prob.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {prob.difficulty}
                          </span>
                        </div>
                        {prob.description && <div className="text-xs text-gray-500 mt-0.5">{prob.description}</div>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {onToggleProblemSolved && (
                          <button
                            onClick={() => onToggleProblemSolved(prob.title)}
                            className={`px-2.5 py-1 text-xs font-bold rounded cursor-pointer transition-colors ${
                              progress.solvedProblems[prob.title]
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                            }`}
                          >
                            {progress.solvedProblems[prob.title] ? '✓ Solved' : 'Mark Solved'}
                          </button>
                        )}
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-[#245edb] hover:bg-[#1941a5] text-white text-xs font-bold rounded shadow-xs"
                        >
                          [💻 {prob.platform}] ↗
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SQL TAB */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded">
                <div className="text-[11px] font-bold text-emerald-800 uppercase">{dayPlan.sqlTrack.beingZeroModule}</div>
                <div className="font-bold text-sm text-emerald-950 mt-0.5">{dayPlan.sqlTrack.topic}</div>
              </div>

              <div className="border border-gray-200 rounded p-3 bg-white space-y-2">
                <div className="font-bold text-xs sm:text-sm text-gray-900">
                  Exercise: {dayPlan.sqlTrack.exercise.title}
                </div>
                <p className="text-xs text-gray-700">{dayPlan.sqlTrack.exercise.objective}</p>

                {dayPlan.sqlTrack.exercise.sampleTable && (
                  <div>
                    <div className="text-xs font-bold text-gray-600 mb-1">Target Table Schema:</div>
                    <pre className="bg-gray-100 p-2 rounded text-xs font-mono overflow-x-auto text-gray-800 border">
                      <code>{dayPlan.sqlTrack.exercise.sampleTable}</code>
                    </pre>
                  </div>
                )}

                {dayPlan.sqlTrack.exercise.solutionSql && (
                  <div>
                    <div className="text-xs font-bold text-emerald-700 mb-1">Optimal Solution Query:</div>
                    <pre className="bg-gray-900 text-emerald-400 p-2.5 rounded text-xs font-mono overflow-x-auto">
                      <code>{dayPlan.sqlTrack.exercise.solutionSql}</code>
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BACKEND TAB */}
          {activeTab === 'backend' && (
            <div className="space-y-4">
              <div className="bg-purple-50 border border-purple-200 p-3 rounded">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-purple-200 text-purple-900 rounded uppercase">
                  {dayPlan.backendCloudTrack.track}
                </span>
                <h3 className="font-bold text-sm text-purple-950 mt-1">{dayPlan.backendCloudTrack.topic}</h3>
              </div>

              <div className="border border-gray-200 rounded p-3 bg-white">
                <div className="font-bold text-xs text-gray-800 mb-2">Core Production Engineering Concepts:</div>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                  {dayPlan.backendCloudTrack.learn.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* AI / ML TAB */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 p-3 rounded">
                <span className="text-[11px] font-bold px-2 py-0.5 bg-indigo-200 text-indigo-900 rounded uppercase">
                  {dayPlan.aiMlTrack.track}
                </span>
                <h3 className="font-bold text-sm text-indigo-950 mt-1">{dayPlan.aiMlTrack.topic}</h3>
              </div>

              <div className="border border-gray-200 rounded p-3 bg-white">
                <div className="font-bold text-xs text-gray-800 mb-2">Target Skills & Model Architecture:</div>
                <ul className="list-disc list-inside space-y-1 text-xs text-gray-700">
                  {dayPlan.aiMlTrack.learn.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* QUESTIONS TAB */}
          {activeTab === 'questions' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-500 mb-1">
                Click on any question to test yourself and reveal the interviewer's expected talking points.
              </div>
              {dayPlan.interviewQuestions.map((q, i) => (
                <div key={i} className="border border-gray-200 rounded overflow-hidden bg-white shadow-2xs">
                  <div
                    onClick={() => toggleQuestion(i)}
                    className="p-3 bg-gray-50 hover:bg-gray-100 flex items-center justify-between cursor-pointer border-b"
                  >
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                      <span className="font-bold text-blue-600">Q{i + 1}.</span>
                      <span className="font-semibold text-xs sm:text-sm text-gray-900">{q.question}</span>
                      {onToggleQuestionMastered && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleQuestionMastered(q.id || q.question);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                            progress.masteredQuestions[q.id || q.question]
                              ? 'bg-amber-400 text-amber-950 font-black'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {progress.masteredQuestions[q.id || q.question] ? '★ Mastered' : '☆ Mark Mastered'}
                        </button>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 shrink-0 ml-2 font-mono">
                      {revealedQuestions[i] ? '▲ Hide' : '▼ Reveal Answer'}
                    </span>
                  </div>
                  {revealedQuestions[i] && (
                    <div className="p-3 bg-white text-xs space-y-2">
                      <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wide">Key Points Interviewers Expect:</div>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {q.keyAnswerPoints.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
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
              ))}
            </div>
          )}

          {/* NOTEPAD NOTES TAB */}
          {activeTab === 'notes' && (
            <div className="space-y-3">
              <div className="text-xs text-gray-600">
                Personal scratchpad for Day {dayPlan.day}. Auto-saved to localStorage and synchronized with <strong>Notepad.exe</strong>.
              </div>
              <textarea
                value={localNote}
                onChange={e => setLocalNote(e.target.value)}
                placeholder="Type your notes, edge cases, formulas, or implementation details for this day..."
                rows={12}
                className="w-full p-2.5 font-mono text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-hidden bg-amber-50/20"
              />
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 bg-[#245edb] hover:bg-[#1941a5] text-white text-xs font-bold rounded shadow-xs cursor-pointer"
              >
                💾 Save Note to Notepad.exe
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#ece9d8] border-t border-[#a09e97] p-2 flex justify-between items-center text-xs">
          <div className="text-gray-600 flex items-center gap-2">
            <span>Day {dayPlan.day} of 150</span>
            <span>•</span>
            <span className={isCompleted ? 'text-green-700 font-bold' : 'text-amber-700'}>
              {isCompleted ? 'Status: Complete' : 'Status: In Progress'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="xp-button px-4 py-1 font-bold text-xs"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
