export interface SqlSandboxTable {
  tableName: string;
  description: string;
  columns: { name: string; type: string; isPk?: boolean; isFk?: boolean }[];
  sampleRows: Record<string, any>[];
}

export interface SqlLabChallenge {
  id: string;
  beingZeroTopic: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  expectedQuery: string;
  hint: string;
  initialQuery?: string;
}

export const sampleDatabaseTables: SqlSandboxTable[] = [
  {
    tableName: 'departments',
    description: 'Corporate organizational departments and budget allocations',
    columns: [
      { name: 'dept_id', type: 'INTEGER', isPk: true },
      { name: 'dept_name', type: 'VARCHAR(50)' },
      { name: 'budget', type: 'NUMERIC(12,2)' },
      { name: 'location', type: 'VARCHAR(50)' }
    ],
    sampleRows: [
      { dept_id: 101, dept_name: 'Engineering', budget: 1500000.00, location: 'San Francisco' },
      { dept_id: 102, dept_name: 'AI Research', budget: 2200000.00, location: 'Seattle' },
      { dept_id: 103, dept_name: 'Data Platform', budget: 950000.00, location: 'New York' },
      { dept_id: 104, dept_name: 'Security & SRE', budget: 800000.00, location: 'Austin' },
      { dept_id: 105, dept_name: 'Product Management', budget: 600000.00, location: 'San Francisco' }
    ]
  },
  {
    tableName: 'employees',
    description: 'Engineering personnel, salary compensation, and management hierarchy',
    columns: [
      { name: 'emp_id', type: 'INTEGER', isPk: true },
      { name: 'name', type: 'VARCHAR(100)' },
      { name: 'dept_id', type: 'INTEGER', isFk: true },
      { name: 'manager_id', type: 'INTEGER', isFk: true },
      { name: 'salary', type: 'NUMERIC(10,2)' },
      { name: 'hire_date', type: 'DATE' },
      { name: 'title', type: 'VARCHAR(80)' }
    ],
    sampleRows: [
      { emp_id: 1, name: 'Ayush Sharma', dept_id: 102, manager_id: null, salary: 210000.00, hire_date: '2021-03-01', title: 'VP of AI Research' },
      { emp_id: 2, name: 'Sarah Chen', dept_id: 101, manager_id: 1, salary: 185000.00, hire_date: '2022-01-15', title: 'Principal Backend Engineer' },
      { emp_id: 3, name: 'Vikram Patel', dept_id: 102, manager_id: 1, salary: 175000.00, hire_date: '2022-06-10', title: 'Senior GenAI Engineer' },
      { emp_id: 4, name: 'Elena Rostova', dept_id: 103, manager_id: 2, salary: 160000.00, hire_date: '2023-02-20', title: 'Data Engineer II' },
      { emp_id: 5, name: 'David Kim', dept_id: 101, manager_id: 2, salary: 155000.00, hire_date: '2023-08-01', title: 'Cloud Infrastructure Engineer' },
      { emp_id: 6, name: 'Maya Lin', dept_id: 104, manager_id: 1, salary: 170000.00, hire_date: '2022-11-05', title: 'Staff SRE Engineer' },
      { emp_id: 7, name: 'Rohan Gupta', dept_id: 102, manager_id: 3, salary: 140000.00, hire_date: '2024-01-10', title: 'MLOps Engineer' }
    ]
  },
  {
    tableName: 'customer_orders',
    description: 'E-commerce platform orders with revenue, timestamps, and customer ids',
    columns: [
      { name: 'order_id', type: 'INTEGER', isPk: true },
      { name: 'customer_id', type: 'INTEGER' },
      { name: 'order_date', type: 'DATE' },
      { name: 'amount', type: 'NUMERIC(10,2)' },
      { name: 'status', type: 'VARCHAR(20)' }
    ],
    sampleRows: [
      { order_id: 1001, customer_id: 501, order_date: '2024-01-05', amount: 320.50, status: 'COMPLETED' },
      { order_id: 1002, customer_id: 502, order_date: '2024-01-08', amount: 1500.00, status: 'COMPLETED' },
      { order_id: 1003, customer_id: 501, order_date: '2024-02-12', amount: 450.00, status: 'COMPLETED' },
      { order_id: 1004, customer_id: 503, order_date: '2024-02-15', amount: 89.90, status: 'REFUNDED' },
      { order_id: 1005, customer_id: 504, order_date: '2024-03-01', amount: 2400.00, status: 'COMPLETED' },
      { order_id: 1006, customer_id: 502, order_date: '2024-03-22', amount: 650.00, status: 'COMPLETED' }
    ]
  }
];

export const sqlLabChallenges: SqlLabChallenge[] = [
  {
    id: 'bz-challenge-1',
    beingZeroTopic: 'Being Zero Topic 19: Grouping and Aggregating Data in SQL',
    title: 'Department Salary Metrics & Headcount',
    difficulty: 'Easy',
    description: 'Calculate the total headcount, maximum salary, and average salary rounded to 2 decimal places for each department. Filter to include only departments with more than 1 employee.',
    hint: 'Use GROUP BY dept_id and HAVING COUNT(*) > 1 with ROUND(AVG(salary), 2).',
    initialQuery: `SELECT dept_id, COUNT(*) AS headcount, ROUND(AVG(salary), 2) AS avg_salary, MAX(salary) AS max_salary
FROM employees
GROUP BY dept_id
HAVING COUNT(*) > 1
ORDER BY avg_salary DESC;`,
    expectedQuery: `SELECT dept_id, COUNT(*) AS headcount, ROUND(AVG(salary), 2) AS avg_salary, MAX(salary) AS max_salary FROM employees GROUP BY dept_id HAVING COUNT(*) > 1 ORDER BY avg_salary DESC;`
  },
  {
    id: 'bz-challenge-2',
    beingZeroTopic: 'Being Zero Topic 21: Joins & Multi-Table Analysis',
    title: 'Employee Details with Department and Manager Name',
    difficulty: 'Medium',
    description: 'Perform a self-join and inner join to list each employee name, their department name, their salary, and their direct manager’s name. If an employee has no manager, display "Top Executive".',
    hint: 'Use a LEFT JOIN on employees m ON e.manager_id = m.emp_id and COALESCE(m.name, "Top Executive").',
    initialQuery: `SELECT e.name AS employee_name, d.dept_name, e.salary,
       COALESCE(m.name, 'Top Executive') AS manager_name
FROM employees e
JOIN departments d ON e.dept_id = d.dept_id
LEFT JOIN employees m ON e.manager_id = m.emp_id
ORDER BY e.salary DESC;`,
    expectedQuery: `SELECT e.name AS employee_name, d.dept_name, e.salary, COALESCE(m.name, 'Top Executive') AS manager_name FROM employees e JOIN departments d ON e.dept_id = d.dept_id LEFT JOIN employees m ON e.manager_id = m.emp_id ORDER BY e.salary DESC;`
  },
  {
    id: 'bz-challenge-3',
    beingZeroTopic: 'Being Zero Topic 30: PARTITION BY & Ranking Functions',
    title: 'Top Paid Employee per Department via DENSE_RANK()',
    difficulty: 'Medium',
    description: 'Find the highest-earning employee in each department using DENSE_RANK() partitioned by dept_id. Include ties if present.',
    hint: 'Wrap the window function query in a Common Table Expression (CTE) and filter WHERE rnk = 1.',
    initialQuery: `WITH RankedSalaries AS (
  SELECT emp_id, name, dept_id, salary,
         DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT emp_id, name, dept_id, salary
FROM RankedSalaries
WHERE rnk = 1;`,
    expectedQuery: `WITH RankedSalaries AS (SELECT emp_id, name, dept_id, salary, DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) AS rnk FROM employees) SELECT emp_id, name, dept_id, salary FROM RankedSalaries WHERE rnk = 1;`
  },
  {
    id: 'bz-challenge-4',
    beingZeroTopic: 'Being Zero Topic 37: Recursive CTEs',
    title: 'Organizational Hierarchy Depth using Recursive CTE',
    difficulty: 'Hard',
    description: 'Generate an organizational tree showing the hierarchy level (depth) for every employee starting from Top Executive (Level 1) downward.',
    hint: 'Start with base query WHERE manager_id IS NULL, then UNION ALL join with employees on manager_id.',
    initialQuery: `WITH RECURSIVE OrgChart AS (
  SELECT emp_id, name, manager_id, 1 AS level
  FROM employees
  WHERE manager_id IS NULL
  UNION ALL
  SELECT e.emp_id, e.name, e.manager_id, o.level + 1
  FROM employees e
  JOIN OrgChart o ON e.manager_id = o.emp_id
)
SELECT * FROM OrgChart ORDER BY level, emp_id;`,
    expectedQuery: `WITH RECURSIVE OrgChart AS (SELECT emp_id, name, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.emp_id, e.name, e.manager_id, o.level + 1 FROM employees e JOIN OrgChart o ON e.manager_id = o.emp_id) SELECT * FROM OrgChart ORDER BY level, emp_id;`
  },
  {
    id: 'bz-challenge-5',
    beingZeroTopic: 'Advanced SQL: Gaps, Islands & Cumulative Totals',
    title: 'Running Total & 30-Day Order Retention',
    difficulty: 'Hard',
    description: 'Compute a running cumulative sum of completed order amounts ordered by date, along with the previous order amount using LAG().',
    hint: 'Use SUM(amount) OVER (ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) and LAG(amount).',
    initialQuery: `SELECT order_id, customer_id, order_date, amount,
       LAG(amount) OVER (ORDER BY order_date) AS prev_amount,
       SUM(amount) OVER (ORDER BY order_date) AS cumulative_revenue
FROM customer_orders
WHERE status = 'COMPLETED';`,
    expectedQuery: `SELECT order_id, customer_id, order_date, amount, LAG(amount) OVER (ORDER BY order_date) AS prev_amount, SUM(amount) OVER (ORDER BY order_date) AS cumulative_revenue FROM customer_orders WHERE status = 'COMPLETED';`
  }
];
