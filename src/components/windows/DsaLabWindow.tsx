import React, { useState } from 'react';
import { UserProgress } from '../../types';

interface DsaLabWindowProps {
  progress: UserProgress;
  onToggleProblemSolved: (title: string) => void;
}

interface PatternDetail {
  id: string;
  name: string;
  category: string;
  signals: string[];
  bruteForce: string;
  optimized: string;
  timeComplexity: string;
  spaceComplexity: string;
  javaCode: string;
  pythonCode: string;
  commonMistakes: string[];
  problems: { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; url: string }[];
}

const dsaPatternsCatalog: PatternDetail[] = [
  {
    id: 'prefix-sum',
    name: 'Prefix Sum & Difference Array',
    category: 'Arrays',
    signals: ['Continuous subarray sum equals K', 'Multiple range sum queries Q in O(1)', 'Range addition updates [L, R] += val'],
    bruteForce: 'Recomputing sum on every query: O(N * Q) time',
    optimized: 'Precompute prefix[i] = prefix[i-1] + nums[i]. Range sum(L, R) = prefix[R] - prefix[L-1] in O(1). Difference array updates range in O(1).',
    timeComplexity: 'O(N) preprocessing, O(1) query time',
    spaceComplexity: 'O(N) auxiliary space (or O(1) in-place)',
    javaCode: `// Subarray Sum Equals K
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> map = new HashMap<>();
    map.put(0, 1); // Base case for subarray starting at index 0
    int currentSum = 0, count = 0;
    for (int num : nums) {
        currentSum += num;
        if (map.containsKey(currentSum - k)) {
            count += map.get(currentSum - k);
        }
        map.put(currentSum, map.getOrDefault(currentSum, 0) + 1);
    }
    return count;
}`,
    pythonCode: `# Subarray Sum Equals K in Python
def subarraySum(nums: list[int], k: int) -> int:
    prefix_counts = {0: 1}
    curr_sum = 0
    count = 0
    for num in nums:
        curr_sum += num
        count += prefix_counts.get(curr_sum - k, 0)
        prefix_counts[curr_sum] = prefix_counts.get(curr_sum, 0) + 1
    return count`,
    commonMistakes: [
      'Forgetting to initialize map.put(0, 1) before the loop.',
      'Checking map before adding currentSum, or mixing up currentSum - k with k - currentSum.'
    ],
    problems: [
      { title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/' },
      { title: 'Corporate Flight Bookings', difficulty: 'Medium', url: 'https://leetcode.com/problems/corporate-flight-bookings/' },
      { title: 'Contiguous Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/contiguous-array/' }
    ]
  },
  {
    id: 'sliding-window-variable',
    name: 'Dynamic Sliding Window (Variable Size)',
    category: 'Two Pointers',
    signals: ['Longest/shortest continuous substring satisfying property', 'Distinct characters <= K', 'At most K replacements'],
    bruteForce: 'Check all O(N^2) substrings in O(N) = O(N^3)',
    optimized: 'Expand right pointer greedily. While window condition is violated, increment left pointer to shrink window. Both pointers advance at most N times.',
    timeComplexity: 'O(N) linear time',
    spaceComplexity: 'O(K) or O(26) auxiliary frequency table',
    javaCode: `// Longest Substring Without Repeating Characters
public int lengthOfLongestSubstring(String s) {
    int[] lastSeen = new int[128];
    Arrays.fill(lastSeen, -1);
    int maxLen = 0, left = 0;
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        if (lastSeen[c] >= left) {
            left = lastSeen[c] + 1; // Jump past previous duplicate
        }
        lastSeen[c] = right;
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
    pythonCode: `# Longest Substring Without Repeating Characters
def lengthOfLongestSubstring(s: str) -> int:
    char_map = {}
    max_len = 0
    left = 0
    for right, c in enumerate(s):
        if c in char_map and char_map[c] >= left:
            left = char_map[c] + 1
        char_map[c] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
    commonMistakes: [
      'Using an "if" statement instead of "while" when shrinking multiple invalid characters.',
      'Updating max length inside the while loop instead of after the window becomes valid.'
    ],
    problems: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { title: 'Minimum Window Substring', difficulty: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/' },
      { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/' }
    ]
  },
  {
    id: 'monotonic-stack',
    name: 'Monotonic Stack (Next Greater / Smaller)',
    category: 'Stack',
    signals: ['Find next greater element', 'Days until warmer temperature', 'Largest rectangle under histogram'],
    bruteForce: 'Scan forward from every index: O(N^2) time',
    optimized: 'Maintain stack of indices in strictly increasing or decreasing order. Elements are popped when an incoming element violates the order.',
    timeComplexity: 'O(N) amortized (each element pushed and popped once)',
    spaceComplexity: 'O(N) auxiliary stack',
    javaCode: `// Daily Temperatures
public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>(); // Store indices
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
            int prevIndex = stack.pop();
            result[prevIndex] = i - prevIndex;
        }
        stack.push(i);
    }
    return result;
}`,
    pythonCode: `# Daily Temperatures
def dailyTemperatures(temperatures: list[int]) -> list[int]:
    n = len(temperatures)
    result = [0] * n
    stack = [] # stores indices
    for i, temp in enumerate(temperatures):
        while stack and temp > temperatures[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)
    return result`,
    commonMistakes: [
      'Pushing values instead of indices onto the stack when distances or widths are required.',
      'Calling stack.pop() or peek() without verifying !stack.isEmpty().'
    ],
    problems: [
      { title: 'Daily Temperatures', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/' },
      { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { title: 'Online Stock Span', difficulty: 'Medium', url: 'https://leetcode.com/problems/online-stock-span/' }
    ]
  },
  {
    id: 'binary-search-answer',
    name: 'Answer-Space Binary Search',
    category: 'Binary Search',
    signals: ['Minimize the maximum / Maximize the minimum', 'Feasibility check canAchieve(cand) is monotonic', 'Search space bounded by min and max capacity'],
    bruteForce: 'Linear scan through answer range from 1 to MaxAns in O(N * MaxAns)',
    optimized: 'Binary search candidate values in [low..high]. If canAchieve(mid) is true, try smaller candidate (high = mid - 1); else try larger (low = mid + 1).',
    timeComplexity: 'O(N * log(Range))',
    spaceComplexity: 'O(1) auxiliary space',
    javaCode: `// Koko Eating Bananas
public int minEatingSpeed(int[] piles, int h) {
    int low = 1, high = 0;
    for (int p : piles) high = Math.max(high, p);
    while (low < high) {
        int mid = low + (high - low) / 2;
        int hoursNeeded = 0;
        for (int p : piles) {
            hoursNeeded += (p + mid - 1) / mid; // Ceil division
        }
        if (hoursNeeded <= h) {
            high = mid; // Can eat at this speed, search for slower
        } else {
            low = mid + 1; // Too slow, increase speed
        }
    }
    return low;
}`,
    pythonCode: `# Koko Eating Bananas
import math
def minEatingSpeed(piles: list[int], h: int) -> int:
    low, high = 1, max(piles)
    while low < high:
        mid = low + (high - low) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            high = mid
        else:
            low = mid + 1
    return low`,
    commonMistakes: [
      'Integer overflow during addition: always use low + (high - low) / 2.',
      'Integer division truncating decimals: use (p + mid - 1) / mid for ceil.'
    ],
    problems: [
      { title: 'Koko Eating Bananas', difficulty: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/' },
      { title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/' },
      { title: 'Split Array Largest Sum', difficulty: 'Hard', url: 'https://leetcode.com/problems/split-array-largest-sum/' }
    ]
  },
  {
    id: 'topo-sort',
    name: 'Topological Sort (Kahn’s In-Degree BFS)',
    category: 'Graphs',
    signals: ['Course prerequisite ordering', 'Build order with circular dependencies', 'Directed Acyclic Graph (DAG) ordering'],
    bruteForce: 'Exhaustive DFS paths with exponential worst-case',
    optimized: 'Count in-degrees of all nodes. Enqueue nodes with in-degree 0. While queue not empty, pop node, add to topo order, and decrement in-degrees of neighbors.',
    timeComplexity: 'O(V + E) linear time',
    spaceComplexity: 'O(V + E) adjacency list and queue',
    javaCode: `// Course Schedule II
public int[] findOrder(int numCourses, int[][] prerequisites) {
    int[] inDegree = new int[numCourses];
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
    for (int[] p : prerequisites) {
        adj.get(p[1]).add(p[0]);
        inDegree[p[0]]++;
    }
    Queue<Integer> queue = new ArrayDeque<>();
    for (int i = 0; i < numCourses; i++) {
        if (inDegree[i] == 0) queue.offer(i);
    }
    int[] order = new int[numCourses];
    int idx = 0;
    while (!queue.isEmpty()) {
        int u = queue.poll();
        order[idx++] = u;
        for (int v : adj.get(u)) {
            if (--inDegree[v] == 0) queue.offer(v);
        }
    }
    return idx == numCourses ? order : new int[0]; // Empty if cycle detected
}`,
    pythonCode: `# Course Schedule II
from collections import deque
def findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:
    in_degree = [0] * numCourses
    adj = [[] for _ in range(numCourses)]
    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in adj[u]:
            in_degree[v] -= 1
            if in_degree[v] == 0:
                queue.append(v)
    return order if len(order) == numCourses else []`,
    commonMistakes: [
      'Orienting edges backward: prerequisite [a, b] means b must be taken before a (b -> a).',
      'Forgetting cycle detection check: if order.size() < V, a directed cycle exists.'
    ],
    problems: [
      { title: 'Course Schedule', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/' },
      { title: 'Course Schedule II', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/' },
      { title: 'Alien Dictionary', difficulty: 'Hard', url: 'https://leetcode.com/problems/alien-dictionary/' }
    ]
  },
  {
    id: 'tree-traversal-lca',
    name: 'Binary Trees & BSTs (DFS / BFS & LCA)',
    category: 'Trees',
    signals: ['Hierarchy path finding', 'Lowest Common Ancestor (LCA)', 'Level-order / Zig-zag BFS', 'Binary Search Tree validity invariant'],
    bruteForce: 'Storing full node ancestor paths in lists and finding first common ancestor: O(N) memory and time overhead',
    optimized: 'Post-order DFS traversal. Recursively query left and right subtrees. If current node is p or q, or if left and right both return non-null, current node is the LCA.',
    timeComplexity: 'O(N) visit every node once',
    spaceComplexity: 'O(H) recursion stack where H is tree height (O(log N) balanced, O(N) skewed)',
    javaCode: `// Lowest Common Ancestor of a Binary Tree
public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null || root == p || root == q) return root;
    
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    
    if (left != null && right != null) return root; // Split point is LCA
    return left != null ? left : right;
}`,
    pythonCode: `# Lowest Common Ancestor of a Binary Tree
def lowestCommonAncestor(root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
    if not root or root == p or root == q:
        return root
    
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    
    if left and right:
        return root # Both branches found target
    return left if left else right`,
    commonMistakes: [
      'Assuming the tree is a Binary Search Tree (BST) when values are arbitrary.',
      'Checking values (root.val == p.val) instead of reference identity (root == p) when duplicate values are possible.'
    ],
    problems: [
      { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' }
    ]
  },
  {
    id: 'graph-shortest-path',
    name: 'Dijkstra & Shortest Path (Weighted Graphs)',
    category: 'Graphs',
    signals: ['Minimum latency / cost in network graph with non-negative edge weights', 'Single source shortest path', 'PriorityQueue state exploration'],
    bruteForce: 'Exhaustive DFS exploring all possible paths: O(V!) exponential time',
    optimized: 'Dijkstra algorithm using Min-Heap (PriorityQueue). Greedily expand shortest tentative distance. Relaxation condition: if dist[u] + w < dist[v], update dist[v] and offer (v, dist[v]).',
    timeComplexity: 'O((V + E) log V) with binary heap',
    spaceComplexity: 'O(V + E) adjacency list and distance array',
    javaCode: `// Network Delay Time (Dijkstra)
public int networkDelayTime(int[][] times, int n, int k) {
    Map<Integer, List<int[]>> graph = new HashMap<>();
    for (int[] edge : times) {
        graph.computeIfAbsent(edge[0], x -> new ArrayList<>()).add(new int[]{edge[1], edge[2]});
    }
    
    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
    int[] dist = new int[n + 1];
    Arrays.fill(dist, Integer.MAX_VALUE);
    dist[k] = 0;
    pq.offer(new int[]{k, 0});
    
    while (!pq.isEmpty()) {
        int[] curr = pq.poll();
        int u = curr[0], d = curr[1];
        if (d > dist[u]) continue; // Stale heap entry
        
        for (int[] edge : graph.getOrDefault(u, Collections.emptyList())) {
            int v = edge[0], weight = edge[1];
            if (dist[u] + weight < dist[v]) {
                dist[v] = dist[u] + weight;
                pq.offer(new int[]{v, dist[v]});
            }
        }
    }
    int maxDist = 0;
    for (int i = 1; i <= n; i++) {
        if (dist[i] == Integer.MAX_VALUE) return -1;
        maxDist = Math.max(maxDist, dist[i]);
    }
    return maxDist;
}`,
    pythonCode: `# Network Delay Time (Dijkstra with heapq)
import heapq
def networkDelayTime(times: list[list[int]], n: int, k: int) -> int:
    graph = {i: [] for i in range(1, n + 1)}
    for u, v, w in times:
        graph[u].append((v, w))
        
    pq = [(0, k)] # (distance, node)
    dist = {}
    
    while pq:
        d, u = heapq.heappop(pq)
        if u in dist:
            continue
        dist[u] = d
        for v, w in graph[u]:
            if v not in dist:
                heapq.heappush(pq, (d + w, v))
                
    return max(dist.values()) if len(dist) == n else -1`,
    commonMistakes: [
      'Forgetting the "if (d > dist[u]) continue;" stale entry check in Java.',
      'Applying Dijkstra on graphs with negative edge weights (requires Bellman-Ford).'
    ],
    problems: [
      { title: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/' },
      { title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/' },
      { title: 'Word Ladder', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-ladder/' }
    ]
  },
  {
    id: 'dp-knapsack-subsequence',
    name: 'Dynamic Programming (Knapsack & Subsequences)',
    category: 'Dynamic Programming',
    signals: ['Optimal sub-structure & overlapping subproblems', 'Min/max ways to reach target sum', 'Item choice with capacity constraint', 'Longest ordered subsequence'],
    bruteForce: 'Recursion with 2^N state tree branch exploration without memoization: O(2^N)',
    optimized: '1D/2D state space table with bottom-up tabulation. Define dp[i] as optimal answer for subproblem i. Transition: dp[i] = min/max over valid predecessor states.',
    timeComplexity: 'O(N * Target) pseudo-polynomial for Knapsack, O(N log N) for LIS with binary search',
    spaceComplexity: 'O(Target) space-optimized rolling 1D array',
    javaCode: `// Coin Change (1D Tabulation DP)
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1); // Sentinel value
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (i >= coin) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    return dp[amount] > amount ? -1 : dp[amount];
}`,
    pythonCode: `# Coin Change (1D DP)
def coinChange(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + 1)
                
    return dp[amount] if dp[amount] != float('inf') else -1`,
    commonMistakes: [
      'Using Integer.MAX_VALUE as sentinel in Java without guarding against overflow (+ 1 becomes negative!).',
      'Confusing Permutations vs Combinations outer loop order (coins outer loop = combinations, amount outer loop = permutations).'
    ],
    problems: [
      { title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/' },
      { title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
      { title: 'Partition Equal Subset Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/' }
    ]
  }
];

export const DsaLabWindow: React.FC<DsaLabWindowProps> = ({
  progress,
  onToggleProblemSolved
}) => {
  const [selectedPattern, setSelectedPattern] = useState<PatternDetail>(dsaPatternsCatalog[0]);
  const [codeLanguage, setCodeLanguage] = useState<'java' | 'python'>('java');

  return (
    <div className="flex flex-col h-full bg-[#ece9d8] select-text">
      {/* Header */}
      <div className="bg-white border-2 border-gray-300 p-2 rounded m-1 mb-2 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <span>💻</span>
            <span>DSA Pattern Visualizer & Algorithmic Blueprint Engine</span>
          </h2>
          <p className="text-xs text-gray-600">
            Deconstruct interview algorithmic patterns: Recognition Signals, Optimal Approaches, Complexity & Dual Java/Python Code.
          </p>
        </div>
        <div className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded border border-blue-200">
          Solved: {Object.values(progress.solvedProblems).filter(Boolean).length} Problems
        </div>
      </div>

      {/* Main Two-Pane View */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 m-1 overflow-hidden">
        {/* Left Column: Patterns List */}
        <div className="w-full md:w-64 bg-white border border-[#7f9db9] rounded p-2 flex flex-col gap-1.5 overflow-y-auto shrink-0 shadow-xs">
          <div className="font-bold text-xs text-gray-700 uppercase mb-1">DSA Patterns:</div>
          {dsaPatternsCatalog.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPattern(p)}
              className={`w-full text-left p-2 rounded text-xs transition-colors border cursor-pointer ${
                selectedPattern.id === p.id
                  ? 'bg-blue-50 border-[#245edb] font-bold text-blue-950'
                  : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-800'
              }`}
            >
              <div className="text-[10px] text-gray-500 uppercase">{p.category}</div>
              <div className="truncate">{p.name}</div>
            </button>
          ))}
        </div>

        {/* Right Column: Pattern Deep Dive */}
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto bg-white border border-[#7f9db9] rounded p-3 shadow-inner">
          <div className="border-b pb-2">
            <span className="text-[11px] font-bold px-2 py-0.5 bg-blue-100 text-blue-900 rounded uppercase">
              {selectedPattern.category}
            </span>
            <h3 className="text-base font-bold text-gray-900 mt-1">{selectedPattern.name}</h3>
          </div>

          {/* Complexity Cards */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-2 rounded">
              <span className="text-gray-500 font-bold block text-[10px] uppercase">Time Complexity:</span>
              <span className="font-mono font-bold text-emerald-900">{selectedPattern.timeComplexity}</span>
            </div>
            <div className="bg-purple-50 border border-purple-200 p-2 rounded">
              <span className="text-gray-500 font-bold block text-[10px] uppercase">Space Complexity:</span>
              <span className="font-mono font-bold text-purple-900">{selectedPattern.spaceComplexity}</span>
            </div>
          </div>

          {/* Recognition Signals */}
          <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded text-xs">
            <div className="font-bold text-amber-950 mb-1 flex items-center gap-1">
              <span>🎯</span> Problem Recognition Signals:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-gray-800">
              {selectedPattern.signals.map((sig, i) => (
                <li key={i}>{sig}</li>
              ))}
            </ul>
          </div>

          {/* Code Viewer with Language Toggle */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="bg-gray-800 text-white px-2.5 py-1.5 flex items-center justify-between text-xs">
              <span className="font-bold font-mono">Reference Implementation:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCodeLanguage('java')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    codeLanguage === 'java' ? 'bg-[#245edb] text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Java 21
                </button>
                <button
                  onClick={() => setCodeLanguage('python')}
                  className={`px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                    codeLanguage === 'python' ? 'bg-[#245edb] text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  Python 3.12
                </button>
              </div>
            </div>
            <pre className="p-3 bg-gray-900 text-gray-100 font-mono text-xs overflow-x-auto">
              <code>{codeLanguage === 'java' ? selectedPattern.javaCode : selectedPattern.pythonCode}</code>
            </pre>
          </div>

          {/* Practice Problems Checklist */}
          <div className="border border-gray-200 rounded p-2.5 bg-gray-50 text-xs">
            <div className="font-bold text-gray-800 mb-2 flex items-center justify-between">
              <span>Selected Practice Problems:</span>
              <span className="text-[11px] text-gray-500">Check box to mark solved</span>
            </div>
            <div className="space-y-1.5">
              {selectedPattern.problems.map((prob, i) => {
                const isSolved = !!progress.solvedProblems[prob.title];
                return (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <label className="flex items-center gap-2 cursor-pointer truncate mr-2">
                      <input
                        type="checkbox"
                        checked={isSolved}
                        onChange={() => onToggleProblemSolved(prob.title)}
                        className="rounded text-blue-600 cursor-pointer"
                      />
                      <span className={`font-semibold ${isSolved ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {prob.title}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                        prob.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        prob.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </label>
                    <a
                      href={prob.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs rounded border border-blue-300 font-medium shrink-0"
                    >
                      Solve on LeetCode ↗
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
