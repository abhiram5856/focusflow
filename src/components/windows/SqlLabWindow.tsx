import React, { useState } from 'react';
import { sampleDatabaseTables, sqlLabChallenges, SqlLabChallenge } from '../../data/sqlLabsData';

export const SqlLabWindow: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState(sampleDatabaseTables[0]);
  const [selectedChallenge, setSelectedChallenge] = useState<SqlLabChallenge>(sqlLabChallenges[0]);
  const [queryInput, setQueryInput] = useState(sqlLabChallenges[0].initialQuery || '');
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);

  const handleSelectChallenge = (c: SqlLabChallenge) => {
    setSelectedChallenge(c);
    setQueryInput(c.initialQuery || '');
    setQueryResult(null);
    setExecutionMessage(null);
  };

  const handleRunQuery = () => {
    // Interactive mock query executor simulation
    const trimmed = queryInput.trim().toUpperCase();
    if (!trimmed.startsWith('SELECT') && !trimmed.startsWith('WITH')) {
      setExecutionMessage('Error: Only read-only SELECT queries and Common Table Expressions (WITH) are permitted in this sandbox.');
      setQueryResult(null);
      return;
    }

    if (trimmed.includes('DEPARTMENTS') && (trimmed.includes('AVG') || trimmed.includes('COUNT'))) {
      setQueryResult([
        { dept_id: 102, headcount: 3, avg_salary: '$175,000.00', max_salary: '$210,000.00' },
        { dept_id: 101, headcount: 2, avg_salary: '$170,000.00', max_salary: '$185,000.00' }
      ]);
      setExecutionMessage('Query executed successfully. 2 rows returned in 1.4ms (Index Scan).');
    } else if (trimmed.includes('ORGCHART') || trimmed.includes('RECURSIVE')) {
      setQueryResult([
        { emp_id: 1, name: 'Ayush Sharma', manager_id: 'NULL', level: 1 },
        { emp_id: 2, name: 'Sarah Chen', manager_id: 1, level: 2 },
        { emp_id: 3, name: 'Vikram Patel', manager_id: 1, level: 2 },
        { emp_id: 6, name: 'Maya Lin', manager_id: 1, level: 2 },
        { emp_id: 4, name: 'Elena Rostova', manager_id: 2, level: 3 },
        { emp_id: 5, name: 'David Kim', manager_id: 2, level: 3 },
        { emp_id: 7, name: 'Rohan Gupta', manager_id: 3, level: 3 }
      ]);
      setExecutionMessage('Recursive CTE executed successfully. 7 hierarchical rows returned in 3.1ms.');
    } else if (trimmed.includes('RANKED') || trimmed.includes('DENSE_RANK')) {
      setQueryResult([
        { emp_id: 1, name: 'Ayush Sharma', dept_id: 102, salary: '$210,000.00' },
        { emp_id: 2, name: 'Sarah Chen', dept_id: 101, salary: '$185,000.00' },
        { emp_id: 4, name: 'Elena Rostova', dept_id: 103, salary: '$160,000.00' },
        { emp_id: 6, name: 'Maya Lin', dept_id: 104, salary: '$170,000.00' }
      ]);
      setExecutionMessage('Window Function query executed successfully. 4 ranked partition rows returned in 2.2ms.');
    } else {
      // Default sample table rows
      setQueryResult(selectedTable.sampleRows);
      setExecutionMessage(`Query executed successfully. ${selectedTable.sampleRows.length} rows returned in 0.8ms.`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Header Bar */}
      <div className="bg-white border-2 border-gray-300 p-2 rounded m-1 mb-2 shadow-xs">
        <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <span>🗄️</span>
          <span>Being Zero SQL Interactive Sandbox & PostgreSQL Query Runner</span>
        </h2>
        <p className="text-xs text-gray-600">
          Practice the full Being Zero sequence: DDL, DML, Aggregations, Window Functions, and Recursive CTEs on mock database schemas.
        </p>
      </div>

      {/* Main Dual Panes */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 m-1 overflow-hidden">
        {/* Left Column: Schema Browser & Being Zero Challenges */}
        <div className="w-full md:w-80 flex flex-col gap-2 shrink-0 overflow-y-auto">
          {/* Table Selector */}
          <div className="bg-white border border-[#7f9db9] rounded p-2.5 shadow-xs">
            <div className="font-bold text-xs text-gray-700 uppercase mb-1.5 flex items-center gap-1">
              <span>📋</span> Database Tables:
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {sampleDatabaseTables.map(t => (
                <button
                  key={t.tableName}
                  onClick={() => setSelectedTable(t)}
                  className={`px-2 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-colors ${
                    selectedTable.tableName === t.tableName
                      ? 'bg-[#245edb] text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border'
                  }`}
                >
                  {t.tableName}
                </button>
              ))}
            </div>

            {/* Table Schema Viewer */}
            <div className="border border-gray-200 rounded p-1.5 bg-gray-50 text-[11px] font-mono">
              <div className="font-bold text-gray-800 mb-1">{selectedTable.tableName} ({selectedTable.description})</div>
              <ul className="space-y-0.5">
                {selectedTable.columns.map(col => (
                  <li key={col.name} className="flex justify-between">
                    <span className="text-blue-900 font-semibold">
                      {col.name} {col.isPk ? '🔑' : col.isFk ? '🔗' : ''}
                    </span>
                    <span className="text-gray-500">{col.type}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Being Zero Challenges */}
          <div className="bg-white border border-[#7f9db9] rounded p-2.5 shadow-xs flex-1">
            <div className="font-bold text-xs text-gray-700 uppercase mb-1.5 flex items-center gap-1">
              <span>🎯</span> Being Zero SQL Challenges:
            </div>
            <div className="space-y-1.5">
              {sqlLabChallenges.map(c => (
                <div
                  key={c.id}
                  onClick={() => handleSelectChallenge(c)}
                  className={`p-2 rounded cursor-pointer border text-xs transition-colors ${
                    selectedChallenge.id === c.id
                      ? 'bg-blue-50 border-[#245edb]'
                      : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                  }`}
                >
                  <div className="font-bold text-gray-900 flex items-center justify-between">
                    <span className="truncate">{c.title}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ml-1 ${
                      c.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      c.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {c.difficulty}
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5 truncate">{c.beingZeroTopic}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: SQL Query Editor & Output Grid */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {/* Active Challenge Prompt Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded p-2.5 text-xs shrink-0">
            <div className="text-[10px] font-bold text-emerald-800 uppercase">{selectedChallenge.beingZeroTopic}</div>
            <div className="font-bold text-sm text-emerald-950 mt-0.5">{selectedChallenge.title}</div>
            <p className="text-gray-700 mt-1">{selectedChallenge.description}</p>
            <div className="text-[11px] text-emerald-800 mt-1.5 font-medium bg-emerald-100/60 p-1.5 rounded">
              💡 <strong>Hint:</strong> {selectedChallenge.hint}
            </div>
          </div>

          {/* SQL Editor Area */}
          <div className="bg-white border border-[#7f9db9] rounded p-2 flex flex-col shrink-0 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-xs text-gray-700 font-mono">SQL Query Editor:</span>
              <button
                onClick={handleRunQuery}
                className="xp-button bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-xs py-1 px-3 shadow cursor-pointer hover:brightness-105"
              >
                ▶ Run SQL Query (F5)
              </button>
            </div>
            <textarea
              value={queryInput}
              onChange={e => setQueryInput(e.target.value)}
              rows={5}
              className="w-full p-2 font-mono text-xs bg-gray-900 text-green-400 rounded border border-gray-700 focus:outline-hidden"
              placeholder="Write SQL query here..."
            />
          </div>

          {/* Results Output Grid */}
          <div className="flex-1 overflow-auto bg-white border border-[#7f9db9] rounded p-2 shadow-inner">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 border-b pb-1.5 mb-2">
              <span>Query Results:</span>
              {executionMessage && (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {executionMessage}
                </span>
              )}
            </div>

            {queryResult && queryResult.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr>
                      {Object.keys(queryResult[0]).map(key => (
                        <th key={key} className="p-2 border-r border-gray-200 text-gray-800 font-bold uppercase text-[10px]">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {queryResult.map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/50">
                        {Object.values(row).map((val: any, colIdx) => (
                          <td key={colIdx} className="p-2 border-r border-gray-200 text-gray-900 truncate max-w-xs">
                            {val === null ? <span className="text-gray-400 italic">NULL</span> : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center text-xs text-gray-400 italic">
                Press "Run SQL Query" to execute the current query and display returned rows.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
