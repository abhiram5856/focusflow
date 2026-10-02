import React, { useState } from 'react';
import { portfolioProjects } from '../../data/projectsData';
import { PortfolioProject, UserProgress } from '../../types';

interface ProjectsWindowProps {
  progress: UserProgress;
  onToggleProjectTask: (projectId: string, taskId: string) => void;
}

export const ProjectsWindow: React.FC<ProjectsWindowProps> = ({
  progress,
  onToggleProjectTask
}) => {
  const [selectedProject, setSelectedProject] = useState<PortfolioProject>(portfolioProjects[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'architecture' | 'milestones' | 'repo' | 'interview' | 'resume'>('overview');

  const projectTasks = progress.projectChecklist[selectedProject.id] || {};

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Top Banner */}
      <div className="bg-white border-2 border-gray-300 p-2.5 rounded m-1 mb-2 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <span>🚀</span>
            <span>3 Enterprise Production Capstone Projects</span>
          </h2>
          <p className="text-xs text-gray-600">
            Non-trivial distributed systems combining AI + Backend + Cloud + SRE to anchor your resume and project interviews.
          </p>
        </div>
      </div>

      {/* Main Two-Pane View */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 m-1 overflow-hidden">
        {/* Left Column: Projects Selector */}
        <div className="w-full md:w-72 bg-white border border-[#7f9db9] rounded p-2 flex flex-col gap-2 shrink-0 overflow-y-auto shadow-xs">
          <div className="font-bold text-xs text-gray-700 uppercase mb-1">Portfolio Projects:</div>
          {portfolioProjects.map((proj, idx) => (
            <button
              key={proj.id}
              onClick={() => {
                setSelectedProject(proj);
                setActiveTab('overview');
              }}
              className={`w-full text-left p-2.5 rounded text-xs transition-colors border cursor-pointer ${
                selectedProject.id === proj.id
                  ? 'bg-blue-50 border-[#245edb] font-bold text-blue-950 shadow-xs'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800'
              }`}
            >
              <div className="text-[10px] text-gray-500 uppercase font-bold">Project {idx + 1}</div>
              <div className="font-bold text-sm text-gray-900 mt-0.5">{proj.title}</div>
              <div className="text-[11px] text-gray-600 line-clamp-2 mt-1 font-normal">{proj.tagline}</div>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {proj.domains.slice(0, 3).map((d, dIdx) => (
                  <span key={dIdx} className="text-[9px] px-1.5 py-0.2 bg-gray-200 text-gray-700 rounded font-normal">
                    {d}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Project Tabs & Deep-Dive */}
        <div className="flex-1 flex flex-col bg-white border border-[#7f9db9] rounded overflow-hidden shadow-inner">
          {/* Tabs */}
          <div className="bg-[#ece9d8] border-b border-[#a09e97] px-2 pt-1 flex gap-1 text-xs shrink-0 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview & Stack', icon: '📋' },
              { id: 'architecture', label: 'Architecture Diagram', icon: '🏗️' },
              { id: 'milestones', label: 'Weekly Milestones', icon: '📅' },
              { id: 'repo', label: 'GitHub Structure', icon: '📁' },
              { id: 'interview', label: 'Interview Defense', icon: '🎤' },
              { id: 'resume', label: 'Resume Bullets', icon: '📄' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-t font-medium border-t border-l border-r cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-white border-[#7f9db9] font-bold text-[#0055ea] -mb-px shadow-xs'
                    : 'bg-[#d8d4c8] border-[#a09e97] text-gray-700 hover:bg-[#e4e0d4]'
                }`}
              >
                <span>{tab.icon}</span> <span className="ml-1">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 text-xs sm:text-sm text-gray-800 space-y-4">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedProject.title}</h3>
                  <p className="text-xs text-gray-600 mt-1 italic">{selectedProject.tagline}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs leading-relaxed text-blue-950">
                  <div className="font-bold uppercase text-[11px] text-blue-800 mb-1">Architecture Overview:</div>
                  {selectedProject.architectureOverview}
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-gray-700 mb-2">Technology Stack Breakdown:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProject.techStack.map((stack, i) => (
                      <div key={i} className="border border-gray-200 rounded p-2.5 bg-gray-50 text-xs">
                        <div className="font-bold text-gray-800 mb-1">{stack.category}</div>
                        <div className="flex flex-wrap gap-1">
                          {stack.technologies.map((t, tIdx) => (
                            <span key={tIdx} className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[11px] font-mono text-blue-900">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="border border-emerald-200 bg-emerald-50/40 rounded p-2.5 text-xs">
                    <div className="font-bold text-emerald-900 mb-1">🧪 Testing Strategy:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                      {selectedProject.testingStrategy.map((test, i) => (
                        <li key={i}>{test}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="border border-purple-200 bg-purple-50/40 rounded p-2.5 text-xs">
                    <div className="font-bold text-purple-900 mb-1">☁️ Deployment & Monitoring:</div>
                    <ul className="list-disc list-inside space-y-0.5 text-gray-700">
                      {selectedProject.deploymentAndMonitoring.map((dep, i) => (
                        <li key={i}>{dep}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ARCHITECTURE DIAGRAM TAB */}
            {activeTab === 'architecture' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 font-medium">
                  End-to-end distributed system flow, message broker decoupling, and data store topologies:
                </div>
                <pre className="p-3 bg-gray-900 text-green-400 font-mono text-[11px] sm:text-xs rounded border border-gray-700 overflow-x-auto leading-tight">
                  <code>{selectedProject.architectureDiagramAscii}</code>
                </pre>
              </div>
            )}

            {/* MILESTONES TAB */}
            {activeTab === 'milestones' && (
              <div className="space-y-3">
                <div className="text-xs text-gray-600">
                  4-Week structured milestone plan. Check off completed items as you build:
                </div>
                {selectedProject.milestones.map((m, idx) => (
                  <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="font-bold text-sm text-gray-900 mb-1">
                      Week {m.week}: {m.title}
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{m.description}</p>

                    <div className="space-y-1 mb-2">
                      {m.tasks.map((task, tIdx) => {
                        const taskId = `task-${idx}-${tIdx}`;
                        const isDone = !!projectTasks[taskId];
                        return (
                          <label key={tIdx} className="flex items-center gap-2 text-xs text-gray-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isDone}
                              onChange={() => onToggleProjectTask(selectedProject.id, taskId)}
                              className="rounded text-blue-600 cursor-pointer"
                            />
                            <span className={isDone ? 'line-through text-gray-400' : ''}>{task}</span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="text-[11px] bg-white p-1.5 rounded border border-gray-200 text-gray-700 font-mono">
                      <span className="font-bold text-blue-800">Deliverable:</span> {m.deliverables.join(' ')}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* GITHUB REPO STRUCTURE TAB */}
            {activeTab === 'repo' && (
              <div className="space-y-2">
                <div className="text-xs text-gray-600 font-medium">
                  Recommended production repository layout for multi-service microservices:
                </div>
                <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-[11px] sm:text-xs rounded border border-gray-700 overflow-x-auto">
                  <code>{selectedProject.githubRepoStructure}</code>
                </pre>
              </div>
            )}

            {/* INTERVIEW DEFENSE TAB */}
            {activeTab === 'interview' && (
              <div className="space-y-3">
                <div className="text-xs text-gray-600 font-medium">
                  High-probability questions interviewers ask about this project and battle-tested talking points:
                </div>
                {selectedProject.interviewQuestions.map((q, i) => (
                  <div key={i} className="border border-gray-200 rounded p-3 bg-gray-50">
                    <div className="font-bold text-xs sm:text-sm text-blue-900 mb-1.5 flex items-start gap-1">
                      <span>🎤</span>
                      <span>{q.question}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-700 bg-white p-2.5 rounded border border-gray-200">
                      {q.talkingPoints.map((pt, pIdx) => (
                        <li key={pIdx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* RESUME BULLETS TAB */}
            {activeTab === 'resume' && (
              <div className="space-y-3">
                <div className="text-xs text-gray-600 font-medium">
                  Ready-to-use quantifiable bullet points tailored for AI Engineer, Backend Engineer, and Cloud roles:
                </div>
                <div className="space-y-2">
                  {selectedProject.resumeBulletPoints.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 bg-gray-50 border border-gray-200 rounded text-xs text-gray-800 font-mono">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
