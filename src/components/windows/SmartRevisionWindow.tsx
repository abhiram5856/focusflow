import React, { useState } from 'react';
import { masterCurriculum } from '../../data/curriculumData';
import { UserProgress } from '../../types';

interface SmartRevisionWindowProps {
  progress: UserProgress;
  onOpenDay: (day: number) => void;
}

export const SmartRevisionWindow: React.FC<SmartRevisionWindowProps> = ({
  progress,
  onOpenDay
}) => {
  // Current active day is max completed day + 1 or 1
  const currentDay = Math.min(150, Math.max(1, (progress.completedDays[progress.completedDays.length - 1] || 0) + 1));
  const [selectedDayToInspect, setSelectedDayToInspect] = useState<number>(currentDay);

  // Spaced intervals: 1d, 3d, 7d, 14d, 30d
  const intervals = [
    { label: '1 Day Later (Yesterday)', delta: 1 },
    { label: '3 Days Later', delta: 3 },
    { label: '7 Days Later (1 Week)', delta: 7 },
    { label: '14 Days Later (2 Weeks)', delta: 14 },
    { label: '30 Days Later (1 Month)', delta: 30 }
  ];

  const revisionItems = intervals
    .map(inv => {
      const targetDayNum = selectedDayToInspect - inv.delta;
      if (targetDayNum >= 1) {
        const dayPlan = masterCurriculum.find(d => d.day === targetDayNum);
        return {
          interval: inv.label,
          dayNum: targetDayNum,
          plan: dayPlan
        };
      }
      return null;
    })
    .filter(Boolean) as { interval: string; dayNum: number; plan: any }[];

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Top Banner */}
      <div className="bg-white border-2 border-gray-300 p-3 rounded m-1 mb-2 shadow-xs space-y-1.5">
        <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
          <span>🔁</span>
          <span>Smart Spaced Repetition Revision Scheduler</span>
        </h2>
        <p className="text-xs text-gray-600">
          Supercharge long-term memory retention. Uses a scientific spaced interval curve (1d, 3d, 7d, 14d, 30d) to show exactly what to review today.
        </p>

        {/* Day Selector */}
        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="font-bold text-gray-700">Calculate revision schedule for:</span>
          <select
            value={selectedDayToInspect}
            onChange={e => setSelectedDayToInspect(Number(e.target.value))}
            className="xp-inset px-2.5 py-1 text-xs bg-white font-bold cursor-pointer"
          >
            {Array.from({ length: 150 }, (_, i) => i + 1).map(day => (
              <option key={day} value={day}>
                Day {day} {day === currentDay ? '(Current Active Day)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Revision List */}
      <div className="flex-1 overflow-y-auto m-1 bg-white border border-[#7f9db9] rounded p-3 space-y-3 shadow-inner text-xs">
        <div className="text-xs font-bold text-gray-700 uppercase mb-1">
          What you must revise on Day {selectedDayToInspect}:
        </div>

        {revisionItems.length > 0 ? (
          <div className="space-y-2">
            {revisionItems.map(item => (
              <div
                key={item.dayNum}
                className="border border-indigo-200 bg-indigo-50/40 rounded p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-indigo-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold px-2 py-0.5 bg-indigo-600 text-white rounded text-[10px]">
                      {item.interval}
                    </span>
                    <span className="font-bold text-sm text-gray-900">
                      Day {item.dayNum}: {item.plan?.theme}
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    <div><strong>DSA Pattern:</strong> {item.plan?.dsaTrack.pattern}</div>
                    <div><strong>SQL Topic:</strong> {item.plan?.sqlTrack.topic}</div>
                    <div><strong>Key Concept:</strong> {item.plan?.csFoundationTrack.concept}</div>
                  </div>
                </div>

                <button
                  onClick={() => onOpenDay(item.dayNum)}
                  className="xp-button text-xs py-1 px-3 font-bold shrink-0 self-start sm:self-center"
                >
                  Review Day {item.dayNum} Plan ▶
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center text-gray-400 italic">
            Day 1 has no previous days to revise yet. As you advance past Day 2, spaced repetition items will populate here.
          </div>
        )}
      </div>
    </div>
  );
};
