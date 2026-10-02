import React, { useState } from 'react';

interface NotepadWindowProps {
  initialNotes: Record<string, string>;
  onSaveNote: (key: string, content: string) => void;
}

export const NotepadWindow: React.FC<NotepadWindowProps> = ({
  initialNotes,
  onSaveNote
}) => {
  const [activeNoteKey, setActiveNoteKey] = useState<string>('general');
  const [content, setContent] = useState<string>(initialNotes['general'] || '');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleKeyChange = (newKey: string) => {
    setActiveNoteKey(newKey);
    setContent(initialNotes[newKey] || '');
  };

  const handleSave = () => {
    onSaveNote(activeNoteKey, content);
    setStatusMessage(`Saved "${activeNoteKey}" at ${new Date().toLocaleTimeString()}!`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${activeNoteKey}-notes.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-white select-text">
      {/* Classic Notepad Menu */}
      <div className="bg-[#ece9d8] border-b border-[#a09e97] px-2 py-1 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-700">Note File:</span>
          <select
            value={activeNoteKey}
            onChange={e => handleKeyChange(e.target.value)}
            className="xp-inset px-2 py-0.5 text-xs bg-white cursor-pointer"
          >
            <option value="general">general.txt (Master Notes)</option>
            {Array.from({ length: 150 }, (_, i) => i + 1).map(day => (
              <option key={day} value={`day-${day}`}>
                day-{day}.txt {initialNotes[`day-${day}`] ? '•' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-emerald-700 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {statusMessage}
            </span>
          )}
          <button
            onClick={handleSave}
            className="xp-button text-xs py-0.5 px-3 font-bold cursor-pointer"
          >
            💾 Save
          </button>
          <button
            onClick={handleDownload}
            className="xp-button text-xs py-0.5 px-2 cursor-pointer"
            title="Download TXT file"
          >
            ⬇ Export
          </button>
        </div>
      </div>

      {/* Text Area Body */}
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        className="flex-1 p-3 font-mono text-xs text-gray-900 border-none resize-none focus:outline-hidden leading-relaxed"
        placeholder="Type or paste your notes here..."
      />

      {/* Status Bar */}
      <div className="bg-[#ece9d8] border-t border-[#d4d0c8] px-2 py-0.5 text-[11px] text-gray-600 flex justify-between select-none">
        <span>Editing: {activeNoteKey}.txt</span>
        <span>Lines: {content.split('\n').length} | Characters: {content.length}</span>
      </div>
    </div>
  );
};
