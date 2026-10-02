import type { DayPlan, StageLevel } from '../types';
import { generateAll150Days } from './daysGenerator';

export function getStageForDay(day: number): StageLevel {
  if (day <= 30) return 'Stage 1: Multi-Pillar Foundations (Days 1–30)';
  if (day <= 60) return 'Stage 2: Core Engineering & Algorithmic Patterns (Days 31–60)';
  if (day <= 90) return 'Stage 3: Advanced Systems, Deep Learning & Concurrency (Days 61–90)';
  if (day <= 120) return 'Stage 4: Distributed Systems, GenAI & Cloud Architecture (Days 91–120)';
  return 'Stage 5: Production LLMOps, Portfolio Projects & Mock Gauntlets (Days 121–150)';
}

export const BEING_ZERO_SQL_TOPICS = [
  { id: 1, title: 'Index' },
  { id: 2, title: 'Welcome to Being Zero' },
  { id: 3, title: 'What is Being Zero?' },
  { id: 4, title: 'One More Zero' },
  { id: 5, title: 'Make Effective Use of Program' },
  { id: 6, title: 'Awaken the Ayush within yourself' },
  { id: 7, title: 'Database Programming' },
  { id: 8, title: 'Data Definition — DDL' },
  { id: 9, title: 'Data Manipulation — DML' },
  { id: 10, title: 'Database Objects' },
  { id: 11, title: 'Database Programming — Practice' },
  { id: 12, title: 'SQL Fundamentals' },
  { id: 13, title: 'Constraints in SQL' },
  { id: 14, title: 'Retrieving Data' },
  { id: 15, title: 'Organizing & Summarizing Data' },
  { id: 16, title: 'SQL Expressions' },
  { id: 17, title: 'SQL Fundamentals — Practice' },
  { id: 18, title: 'Advanced Aggregation & Conditional Analytics' },
  { id: 19, title: 'Grouping and Aggregating Data in SQL' },
  { id: 20, title: 'Conditional Analytics' },
  { id: 21, title: 'Joins & Multi-Table Analysis' },
  { id: 22, title: 'Joining Data' },
  { id: 23, title: 'Nested Queries' },
  { id: 24, title: 'Subqueries & EXISTS / NOT EXISTS' },
  { id: 25, title: 'Subqueries — SQL' },
  { id: 26, title: 'Views — SQL' },
  { id: 27, title: 'Set Operators — SQL' },
  { id: 28, title: 'Window Functions & Ranking' },
  { id: 29, title: 'Introduction to Window Functions' },
  { id: 30, title: 'PARTITION BY & Ranking Functions' },
  { id: 31, title: 'LAG() & LEAD()' },
  { id: 32, title: 'Running Totals & Moving Averages' },
  { id: 33, title: 'Recursive CTEs & Hierarchical Queries' },
  { id: 34, title: 'Introduction to CTEs' },
  { id: 35, title: 'CTEs with Filtering, Joins & Aggregations' },
  { id: 36, title: 'Multiple CTEs & Complex Queries' },
  { id: 37, title: 'Recursive CTEs' },
  { id: 38, title: 'Advanced Business Case Studies 1' },
  { id: 39, title: 'Advanced Business Case Studies 2' },
  { id: 40, title: 'Mixed Interview Challenges 1' },
  { id: 41, title: 'Mixed Interview Challenges 2' },
  { id: 42, title: 'SQL vs NoSQL Databases' },
  { id: 43, title: 'SQL vs NoSQL Architecture' },
  { id: 44, title: 'NoSQL Databases' },
  { id: 45, title: 'Choosing the Right Database' }
];

export function calculateRevisionDays(currentDay: number): number[] {
  const intervals = [1, 3, 7, 14, 30];
  const revisions: number[] = [];
  for (const interval of intervals) {
    const target = currentDay - interval;
    if (target >= 1) revisions.push(target);
  }
  return revisions;
}

// Master Array of Exactly 150 Days
export const masterCurriculum: DayPlan[] = generateAll150Days();

export function getDayPlan(day: number): DayPlan | undefined {
  return masterCurriculum.find(d => d.day === day);
}
