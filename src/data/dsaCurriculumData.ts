export interface UniqueDsaDay {
  day: number;
  pattern: string;
  concept: string;
  problems: {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    url: string;
    platform: 'LeetCode' | 'NeetCode';
    desc: string;
  }[];
}

export const DSA_150_CURRICULUM: UniqueDsaDay[] = [
  // --- DAYS 1-15: ARRAYS, TWO POINTERS & PREFIX SUM ---
  {
    day: 1,
    pattern: 'Arrays: Single-Pass Hash Mapping',
    concept: 'Contiguous memory lookup and single-pass complement discovery in O(N) time and O(N) space.',
    problems: [
      { title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode', desc: 'HashMap complement check before insertion to handle duplicates.' }
    ]
  },
  {
    day: 2,
    pattern: 'Arrays: Two-Pointer In-Place Write',
    concept: 'In-place overwrite with slow/fast pointers avoiding O(N) array shift costs.',
    problems: [
      { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', platform: 'LeetCode', desc: 'Maintain write index for unique elements in O(1) space.' }
    ]
  },
  {
    day: 3,
    pattern: 'Arrays: Running Minimum Tracking',
    concept: 'Single-pass state tracking for optimal valley-to-peak profit calculation.',
    problems: [
      { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', platform: 'LeetCode', desc: 'Track lowest price seen so far and maximum difference.' }
    ]
  },
  {
    day: 4,
    pattern: 'Arrays: Frequency Hash Tables',
    concept: 'Hash set and frequency array lookups for membership and anagram verification.',
    problems: [
      { title: 'Contains Duplicate', difficulty: 'Easy', url: 'https://leetcode.com/problems/contains-duplicate/', platform: 'LeetCode', desc: 'HashSet early-exit check in O(N) time and O(N) space.' },
      { title: 'Valid Anagram', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-anagram/', platform: 'LeetCode', desc: '26-element integer frequency delta buffer.' }
    ]
  },
  {
    day: 5,
    pattern: 'Arrays: Prefix & Suffix Accumulation',
    concept: 'Computing cumulative left and right products to eliminate division in O(1) auxiliary space.',
    problems: [
      { title: 'Product of Array Except Self', difficulty: 'Medium', url: 'https://leetcode.com/problems/product-of-array-except-self/', platform: 'LeetCode', desc: 'Two-pass prefix and suffix product array without division.' }
    ]
  },
  {
    day: 6,
    pattern: 'Arrays: Kadane Algorithm (Dynamic Programming)',
    concept: 'Local optimum vs global optimum choice: extend current subarray or start fresh.',
    problems: [
      { title: 'Maximum Subarray', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-subarray/', platform: 'LeetCode', desc: 'Kadane algorithm with O(1) memory state compression.' }
    ]
  },
  {
    day: 7,
    pattern: 'Arrays: Multi-State Extremum Tracking',
    concept: 'Tracking both running minimum and maximum to handle sign flips with negative numbers.',
    problems: [
      { title: 'Maximum Product Subarray', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximum-product-subarray/', platform: 'LeetCode', desc: 'Swap min/max pointers when encountering negative multipliers.' }
    ]
  },
  {
    day: 8,
    pattern: 'Binary Search: Inflection Point Discovery',
    concept: 'Binary searching on sorted sub-segments to detect the pivot point in rotated arrays.',
    problems: [
      { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', platform: 'LeetCode', desc: 'Compare mid against right boundary to identify sorted half.' }
    ]
  },
  {
    day: 9,
    pattern: 'Binary Search: Rotated Array Target Lookup',
    concept: 'Branch discrimination: check whether the target lies inside the strictly sorted half.',
    problems: [
      { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', platform: 'LeetCode', desc: 'O(log N) search by isolating sorted half in each iteration.' }
    ]
  },
  {
    day: 10,
    pattern: 'Two Pointers: Sorted Triplet Reduction',
    concept: 'Sorting followed by fixed outer loop and inward two-pointer traversal.',
    problems: [
      { title: '3Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/3sum/', platform: 'LeetCode', desc: 'Sort array and skip duplicate elements to ensure unique triplets.' }
    ]
  },
  {
    day: 11,
    pattern: 'Two Pointers: Greedy Shrinking Boundary',
    concept: 'Moving the pointer with shorter height to maximize potential area in O(N).',
    problems: [
      { title: 'Container With Most Water', difficulty: 'Medium', url: 'https://leetcode.com/problems/container-with-most-water/', platform: 'LeetCode', desc: 'Inward two pointers advancing smaller boundary.' }
    ]
  },
  {
    day: 12,
    pattern: 'Two Pointers: Elevation Valley Trapping',
    concept: 'Dual running peak tracking (leftMax, rightMax) to compute trapped rainwater in O(1) space.',
    problems: [
      { title: 'Trapping Rain Water', difficulty: 'Hard', url: 'https://leetcode.com/problems/trapping-rain-water/', platform: 'LeetCode', desc: 'Two pointers computing trapped water column by column.' }
    ]
  },
  {
    day: 13,
    pattern: 'Arrays: Prefix Sum with Frequency Map',
    concept: 'Transforming subarray sum equality into hash map lookup: prefixSum[j] - prefixSum[i] = k.',
    problems: [
      { title: 'Subarray Sum Equals K', difficulty: 'Medium', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', platform: 'LeetCode', desc: 'Prefix sum frequency map handling negative integers.' }
    ]
  },
  {
    day: 14,
    pattern: 'Arrays: Modulo Prefix Hashing',
    concept: 'Prefix sums modulo K to detect multiple-of-k subarray sums of length >= 2.',
    problems: [
      { title: 'Continuous Subarray Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/continuous-subarray-sum/', platform: 'LeetCode', desc: 'Store first occurrence index of prefix mod k.' }
    ]
  },
  {
    day: 15,
    pattern: 'Intervals: Boundary Sorting & Compaction',
    concept: 'Sorting intervals by start time and merging overlapping boundaries greedily.',
    problems: [
      { title: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/', platform: 'LeetCode', desc: 'Sort by start and extend end if intervals overlap.' }
    ]
  },

  // --- DAYS 16-30: SLIDING WINDOW & STRINGS ---
  {
    day: 16,
    pattern: 'Intervals: Disjoint Segment Insertion',
    concept: 'Three-phase linear scan: before overlap, overlapping merge, after overlap.',
    problems: [
      { title: 'Insert Interval', difficulty: 'Medium', url: 'https://leetcode.com/problems/insert-interval/', platform: 'LeetCode', desc: 'Insert new interval into sorted non-overlapping list.' }
    ]
  },
  {
    day: 17,
    pattern: 'Intervals: Greedy Non-Overlapping Scheduling',
    concept: 'Interval scheduling theorem: sort by end time to minimize removals.',
    problems: [
      { title: 'Non-overlapping Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/non-overlapping-intervals/', platform: 'LeetCode', desc: 'Greedy choice of interval with earliest finish time.' }
    ]
  },
  {
    day: 18,
    pattern: 'Sliding Window: Dynamic Character Window',
    concept: 'Expanding right pointer and advancing left pointer to maintain unique character invariant.',
    problems: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', platform: 'LeetCode', desc: 'Hash map of last seen indices for O(N) linear scan.' }
    ]
  },
  {
    day: 19,
    pattern: 'Sliding Window: Frequency Balance with Budget',
    concept: 'Window validity check: windowLength - maxFrequency <= k.',
    problems: [
      { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-repeating-character-replacement/', platform: 'LeetCode', desc: 'Maintain max frequency in current window with replacement budget.' }
    ]
  },
  {
    day: 20,
    pattern: 'Sliding Window: Exact Substring Sub-match',
    concept: 'Two frequency counters (need vs have) with dynamic window expansion and shrinkage.',
    problems: [
      { title: 'Minimum Window Substring', difficulty: 'Hard', url: 'https://leetcode.com/problems/minimum-window-substring/', platform: 'LeetCode', desc: 'Shrink window from left whenever all required characters are satisfied.' }
    ]
  },
  {
    day: 21,
    pattern: 'Monotonic Queue: Sliding Window Extremum',
    concept: 'Double-ended queue maintaining indices in strictly decreasing order of array values.',
    problems: [
      { title: 'Sliding Window Maximum', difficulty: 'Hard', url: 'https://leetcode.com/problems/sliding-window-maximum/', platform: 'LeetCode', desc: 'Amortized O(N) time with monotonic index deque.' }
    ]
  },
  {
    day: 22,
    pattern: 'Sliding Window: Fixed Size Frequency Matching',
    concept: 'Fixed window of size len(s1) tracking exact match count across 26 alphabet characters.',
    problems: [
      { title: 'Permutation in String', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutation-in-string/', platform: 'LeetCode', desc: 'Fixed-size window matching frequency vectors.' }
    ]
  },
  {
    day: 23,
    pattern: 'Strings: Inward Alphanumeric Pointers',
    concept: 'Two pointers skipping non-alphanumeric characters and comparing lowercase values.',
    problems: [
      { title: 'Valid Palindrome', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-palindrome/', platform: 'LeetCode', desc: 'Inward two pointers with Character.isLetterOrDigit check.' }
    ]
  },
  {
    day: 24,
    pattern: 'Strings: Expand Around Center',
    concept: 'Expanding around 2N-1 centers (odd and even lengths) to discover maximal palindromes.',
    problems: [
      { title: 'Longest Palindromic Substring', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-substring/', platform: 'LeetCode', desc: 'O(N^2) time and O(1) space expand-around-center approach.' }
    ]
  },
  {
    day: 25,
    pattern: 'Strings: Palindromic Centers Counting',
    concept: 'Summing palindromic radius lengths across all odd and even center candidates.',
    problems: [
      { title: 'Palindromic Substrings', difficulty: 'Medium', url: 'https://leetcode.com/problems/palindromic-substrings/', platform: 'LeetCode', desc: 'Count all palindromic substrings via center expansion.' }
    ]
  },
  {
    day: 26,
    pattern: 'Strings: Canonical Signature Hashing',
    concept: 'Converting sorted string or character count tuple into canonical hash map grouping keys.',
    problems: [
      { title: 'Group Anagrams', difficulty: 'Medium', url: 'https://leetcode.com/problems/group-anagrams/', platform: 'LeetCode', desc: 'Map sorted string signature to list of anagrams.' }
    ]
  },
  {
    day: 27,
    pattern: 'Heaps: Bucket Sort & Top-K Frequencies',
    concept: 'Counting frequencies with hash map followed by bucket sort by frequency in O(N).',
    problems: [
      { title: 'Top K Frequent Elements', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-elements/', platform: 'LeetCode', desc: 'Bucket sort by count or Min-Heap size K.' }
    ]
  },
  {
    day: 28,
    pattern: 'Strings: Length-Prefixed Delimiter Encoding',
    concept: 'Prefixing string chunk with its length and delimiter (e.g. "4#code") for unambiguous decoding.',
    problems: [
      { title: 'Encode and Decode Strings', difficulty: 'Medium', url: 'https://leetcode.com/problems/encode-and-decode-strings/', platform: 'LeetCode', desc: 'Stateless chunk length delimiter encoding.' }
    ]
  },
  {
    day: 29,
    pattern: 'Arrays: Difference Array Range Updates',
    concept: 'Recording range additions at start and -val at end+1, resolving via prefix sum in O(N).',
    problems: [
      { title: 'Corporate Flight Bookings', difficulty: 'Medium', url: 'https://leetcode.com/problems/corporate-flight-bookings/', platform: 'LeetCode', desc: 'Difference array for O(N + Q) bulk range updates.' }
    ]
  },
  {
    day: 30,
    pattern: 'Sliding Window: Positive Sum Shrinkage',
    concept: 'Expanding right pointer and shrinking left pointer while currentSum >= target.',
    problems: [
      { title: 'Minimum Size Subarray Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-size-subarray-sum/', platform: 'LeetCode', desc: 'Sliding window tracking minimal length subarray with sum >= target.' }
    ]
  },

  // --- DAYS 31-45: LINKED LISTS & BIT MANIPULATION ---
  {
    day: 31,
    pattern: 'Linked Lists: Pointer Reversal',
    concept: 'Iteratively updating next pointers with prev, curr, and next temp pointers in O(1) space.',
    problems: [
      { title: 'Reverse Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-linked-list/', platform: 'LeetCode', desc: 'Three-pointer in-place reversal in O(N) time and O(1) space.' }
    ]
  },
  {
    day: 32,
    pattern: 'Linked Lists: Floyd Tortoise and Hare Cycle Detection',
    concept: 'Fast pointer moving 2 steps and slow pointer moving 1 step to detect circular loops.',
    problems: [
      { title: 'Linked List Cycle', difficulty: 'Easy', url: 'https://leetcode.com/problems/linked-list-cycle/', platform: 'LeetCode', desc: 'Floyd cycle detection algorithm.' }
    ]
  },
  {
    day: 33,
    pattern: 'Linked Lists: Floyd Cycle Entry Point Proof',
    concept: 'Mathematical proof: distance from head to cycle entrance equals distance from meeting point.',
    problems: [
      { title: 'Linked List Cycle II', difficulty: 'Medium', url: 'https://leetcode.com/problems/linked-list-cycle-ii/', platform: 'LeetCode', desc: 'Reset one pointer to head and advance both at 1x speed to find entrance.' }
    ]
  },
  {
    day: 34,
    pattern: 'Linked Lists: Dummy Head Splicing',
    concept: 'Using a dummy head sentinel to simplify list merging and edge cases.',
    problems: [
      { title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', platform: 'LeetCode', desc: 'Iterative merge with dummy head pointer.' }
    ]
  },
  {
    day: 35,
    pattern: 'Linked Lists: Divide-and-Conquer Merge',
    concept: 'Pairwise merging of K sorted lists in O(N log K) time using divide-and-conquer.',
    problems: [
      { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode', desc: 'Min-Heap or divide-and-conquer pairwise merge.' }
    ]
  },
  {
    day: 36,
    pattern: 'Linked Lists: Fixed Offset Pointers',
    concept: 'Maintaining an N-node offset gap between fast and slow pointers to find Nth-from-end.',
    problems: [
      { title: 'Remove Nth Node From End of List', difficulty: 'Medium', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', platform: 'LeetCode', desc: 'One-pass dummy head with two pointers separated by N steps.' }
    ]
  },
  {
    day: 37,
    pattern: 'Linked Lists: Midpoint Split & Interleaving',
    concept: 'Finding midpoint with fast/slow pointers, reversing second half, and interleaving.',
    problems: [
      { title: 'Reorder List', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorder-list/', platform: 'LeetCode', desc: 'Split, reverse second half, and weave nodes in-place.' }
    ]
  },
  {
    day: 38,
    pattern: 'Linked Lists: In-Place Palindrome Check',
    concept: 'Reversing second half in-place and comparing values from both ends in O(1) memory.',
    problems: [
      { title: 'Palindrome Linked List', difficulty: 'Easy', url: 'https://leetcode.com/problems/palindrome-linked-list/', platform: 'LeetCode', desc: 'Find middle, reverse second half, and compare nodes.' }
    ]
  },
  {
    day: 39,
    pattern: 'Linked Lists: Interleaved Node Duplication',
    concept: 'Duplicating nodes inside original list to copy random pointers in O(1) auxiliary space.',
    problems: [
      { title: 'Copy List with Random Pointer', difficulty: 'Medium', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', platform: 'LeetCode', desc: 'Interweave copy nodes or use HashMap old->new mapping.' }
    ]
  },
  {
    day: 40,
    pattern: 'Design: Hash Map + Doubly Linked List',
    concept: 'Combining HashMap for O(1) lookup and Doubly Linked List for O(1) eviction/insertion.',
    problems: [
      { title: 'LRU Cache', difficulty: 'Medium', url: 'https://leetcode.com/problems/lru-cache/', platform: 'LeetCode', desc: 'Least Recently Used cache with dummy head and tail.' }
    ]
  },
  {
    day: 41,
    pattern: 'Bit Manipulation: XOR Duplicate Annihilation',
    concept: 'Exploiting x ^ x = 0 and x ^ 0 = x to cancel out all paired duplicate numbers in O(1) space.',
    problems: [
      { title: 'Single Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/single-number/', platform: 'LeetCode', desc: 'Cumulative XOR across all array numbers.' }
    ]
  },
  {
    day: 42,
    pattern: 'Bit Manipulation: Brian Kernighan Bit Clearing',
    concept: 'Operation n & (n - 1) clears the lowest set bit in each step in O(number of set bits).',
    problems: [
      { title: 'Number of 1 Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/number-of-1-bits/', platform: 'LeetCode', desc: 'Brian Kernighan algorithm counting set bits.' }
    ]
  },
  {
    day: 43,
    pattern: 'Bit Manipulation: Bit-Shift Dynamic Programming',
    concept: 'Recurrence: dp[i] = dp[i >> 1] + (i & 1) to count bits from 0 to N in O(N).',
    problems: [
      { title: 'Counting Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/counting-bits/', platform: 'LeetCode', desc: 'Linear DP using bitwise right-shift.' }
    ]
  },
  {
    day: 44,
    pattern: 'Bit Manipulation: Bit Reversal with Masks',
    concept: 'Reversing 32-bit integers using bitwise extraction and shifting or divide-and-conquer masks.',
    problems: [
      { title: 'Reverse Bits', difficulty: 'Easy', url: 'https://leetcode.com/problems/reverse-bits/', platform: 'LeetCode', desc: 'Extract LSB and shift into reversed 32-bit result.' }
    ]
  },
  {
    day: 45,
    pattern: 'Bit Manipulation: Index-Value XOR Matching',
    concept: 'XORing all numbers in array with indices 0 to N to isolate the missing integer.',
    problems: [
      { title: 'Missing Number', difficulty: 'Easy', url: 'https://leetcode.com/problems/missing-number/', platform: 'LeetCode', desc: 'XOR index with value or Gauss sum formula.' }
    ]
  },

  // --- DAYS 46-60: BINARY SEARCH & MONOTONIC STACK ---
  {
    day: 46,
    pattern: 'Binary Search: Invariant Boundary Search',
    concept: 'Strict boundary maintenance [low, high] with mid = low + (high - low) / 2 to avoid overflow.',
    problems: [
      { title: 'Binary Search', difficulty: 'Easy', url: 'https://leetcode.com/problems/binary-search/', platform: 'LeetCode', desc: 'Classical binary search in sorted array.' }
    ]
  },
  {
    day: 47,
    pattern: 'Binary Search: Monotonic Predicate Boundary',
    concept: 'Binary searching for the first true value in a monotonic boolean predicate array.',
    problems: [
      { title: 'First Bad Version', difficulty: 'Easy', url: 'https://leetcode.com/problems/first-bad-version/', platform: 'LeetCode', desc: 'Search for transition boundary from false to true.' }
    ]
  },
  {
    day: 48,
    pattern: 'Binary Search: Virtual 1D Coordinate Flattening',
    concept: 'Treating M x N matrix as virtual 1D array with row = mid / N and col = mid % N.',
    problems: [
      { title: 'Search a 2D Matrix', difficulty: 'Medium', url: 'https://leetcode.com/problems/search-a-2d-matrix/', platform: 'LeetCode', desc: 'Single binary search over flattened matrix.' }
    ]
  },
  {
    day: 49,
    pattern: 'Binary Search: Monotonic Answer Feasibility',
    concept: 'Binary searching on capacity range [1, max(piles)] with monotonic hours verification.',
    problems: [
      { title: 'Koko Eating Bananas', difficulty: 'Medium', url: 'https://leetcode.com/problems/koko-eating-bananas/', platform: 'LeetCode', desc: 'Answer-space binary search with ceiling division.' }
    ]
  },
  {
    day: 50,
    pattern: 'Binary Search: Greedy Partition Feasibility',
    concept: 'Binary search candidate ship capacity with greedy day-allocation simulation.',
    problems: [
      { title: 'Capacity To Ship Packages Within D Days', difficulty: 'Medium', url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', platform: 'LeetCode', desc: 'Binary search on package ship capacity.' }
    ]
  },
  {
    day: 51,
    pattern: 'Binary Search: Subarray Sum Minimization',
    concept: 'Binary searching maximum subarray sum limit with greedy segment split validation.',
    problems: [
      { title: 'Split Array Largest Sum', difficulty: 'Hard', url: 'https://leetcode.com/problems/split-array-largest-sum/', platform: 'LeetCode', desc: 'Minimize the largest subarray sum across k splits.' }
    ]
  },
  {
    day: 52,
    pattern: 'Binary Search: Dual-Array Partitioning',
    concept: 'Binary search on smaller array to divide both arrays into equal halves in O(log(min(M, N))).',
    problems: [
      { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', platform: 'LeetCode', desc: 'Partitioning two sorted arrays to find combined median.' }
    ]
  },
  {
    day: 53,
    pattern: 'Stack: Bracket Matching Invariant',
    concept: 'Using LIFO stack to match closing brackets with most recent open bracket.',
    problems: [
      { title: 'Valid Parentheses', difficulty: 'Easy', url: 'https://leetcode.com/problems/valid-parentheses/', platform: 'LeetCode', desc: 'Stack validation of nested brackets.' }
    ]
  },
  {
    day: 54,
    pattern: 'Stack: Auxiliary Minimum Tracking',
    concept: 'Tracking running minimum alongside values or storing value deltas in O(1) space.',
    problems: [
      { title: 'Min Stack', difficulty: 'Medium', url: 'https://leetcode.com/problems/min-stack/', platform: 'LeetCode', desc: 'Stack supporting push, pop, and getMin in O(1) time.' }
    ]
  },
  {
    day: 55,
    pattern: 'Stack: Postfix Expression Evaluation',
    concept: 'Popping operands upon encountering operators and pushing result back onto stack.',
    problems: [
      { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', platform: 'LeetCode', desc: 'Stack evaluation of postfix arithmetic.' }
    ]
  },
  {
    day: 56,
    pattern: 'Stack: Backtracking State Synthesis',
    concept: 'Adding opening bracket if open < N, adding closing bracket if close < open.',
    problems: [
      { title: 'Generate Parentheses', difficulty: 'Medium', url: 'https://leetcode.com/problems/generate-parentheses/', platform: 'LeetCode', desc: 'Backtracking recursion generating valid parenthesis combinations.' }
    ]
  },
  {
    day: 57,
    pattern: 'Monotonic Stack: Next Greater Element Distance',
    concept: 'Maintaining stack of indices with decreasing temperatures, resolving spans on pop.',
    problems: [
      { title: 'Daily Temperatures', difficulty: 'Medium', url: 'https://leetcode.com/problems/daily-temperatures/', platform: 'LeetCode', desc: 'Monotonic decreasing index stack in O(N) amortized.' }
    ]
  },
  {
    day: 58,
    pattern: 'Monotonic Stack: Online Stream Compression',
    concept: 'Maintaining pair of (price, span) on stack, popping lesser prices to aggregate span.',
    problems: [
      { title: 'Online Stock Span', difficulty: 'Medium', url: 'https://leetcode.com/problems/online-stock-span/', platform: 'LeetCode', desc: 'Monotonic stack for continuous stream price spans.' }
    ]
  },
  {
    day: 59,
    pattern: 'Monotonic Stack: Rectangle Boundary Resolution',
    concept: 'Popping bar height when smaller bar appears; popped bar width spans from stack top to current index.',
    problems: [
      { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode', desc: 'Single-pass monotonic stack finding left/right boundaries.' }
    ]
  },
  {
    day: 60,
    pattern: 'Monotonic Stack: 2D Matrix Histogram Projection',
    concept: 'Converting 2D binary matrix rows into running histogram heights and applying largest rectangle.',
    problems: [
      { title: 'Maximal Rectangle', difficulty: 'Hard', url: 'https://leetcode.com/problems/maximal-rectangle/', platform: 'LeetCode', desc: 'Running histogram stack across matrix rows.' }
    ]
  },

  // --- DAYS 61-75: HEAPS & PRIORITY QUEUES ---
  {
    day: 61,
    pattern: 'Heaps: Quickselect vs Min-Heap Top-K',
    concept: 'Min-Heap of size K in O(N log K) or randomized Quickselect in O(N) average time.',
    problems: [
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', platform: 'LeetCode', desc: 'Min-Heap size K or Quickselect partition.' }
    ]
  },
  {
    day: 62,
    pattern: 'Heaps: Multi-Criteria Tie-Breaker Ordering',
    concept: 'Priority queue with custom comparator: sort by frequency ascending, then lexicographically descending.',
    problems: [
      { title: 'Top K Frequent Words', difficulty: 'Medium', url: 'https://leetcode.com/problems/top-k-frequent-words/', platform: 'LeetCode', desc: 'Min-Heap with custom word comparator.' }
    ]
  },
  {
    day: 63,
    pattern: 'Heaps: Balanced Max-Heap and Min-Heap',
    concept: 'Max-heap stores smaller half, Min-heap stores larger half; sizes balanced within 1 element.',
    problems: [
      { title: 'Find Median from Data Stream', difficulty: 'Hard', url: 'https://leetcode.com/problems/find-median-from-data-stream/', platform: 'LeetCode', desc: 'Two heaps maintaining continuous median in O(log N).' }
    ]
  },
  {
    day: 64,
    pattern: 'Heaps: K-Way Stream Merging',
    concept: 'Priority queue holding the current head node of K sorted linked lists.',
    problems: [
      { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode', desc: 'Min-heap priority queue k-way merge.' }
    ]
  },
  {
    day: 65,
    pattern: 'Heaps: Max Frequency Cooldown Scheduling',
    concept: 'Max-heap prioritizing highest frequency tasks, using queue to enforce cooldown time N.',
    problems: [
      { title: 'Task Scheduler', difficulty: 'Medium', url: 'https://leetcode.com/problems/task-scheduler/', platform: 'LeetCode', desc: 'Max-Heap and waiting queue with cooldown.' }
    ]
  },
  {
    day: 66,
    pattern: 'Heaps: Interleaved Non-Adjacent Placement',
    concept: 'Max-heap popping top character, holding it in cooldown while placing next character.',
    problems: [
      { title: 'Reorganize String', difficulty: 'Medium', url: 'https://leetcode.com/problems/reorganize-string/', platform: 'LeetCode', desc: 'Greedy max-heap character placement preventing duplicates.' }
    ]
  },
  {
    day: 67,
    pattern: 'Heaps: Euclidean Distance Priority Ordering',
    concept: 'Max-Heap of size K storing points with distance x^2 + y^2; evicting larger distances.',
    problems: [
      { title: 'K Closest Points to Origin', difficulty: 'Medium', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', platform: 'LeetCode', desc: 'Max-heap size K bounded by Euclidean distance.' }
    ]
  },
  {
    day: 68,
    pattern: 'Heaps: Huffman Coding Minimum Cost Merging',
    concept: 'Min-heap continually combining two smallest sticks until single stick remains.',
    problems: [
      { title: 'Minimum Cost to Connect Sticks', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-cost-to-connect-sticks/', platform: 'LeetCode', desc: 'Min-heap greedy pair merge.' }
    ]
  },
  {
    day: 69,
    pattern: 'Heaps: Greedy Replacement with Priority Queue',
    concept: 'Min-heap tracks ladder jumps; replace smallest jump with bricks when ladders exhausted.',
    problems: [
      { title: 'Furthest Building You Can Reach', difficulty: 'Medium', url: 'https://leetcode.com/problems/furthest-building-you-can-reach/', platform: 'LeetCode', desc: 'Min-heap prioritizing largest climbs for ladders.' }
    ]
  },
  {
    day: 70,
    pattern: 'Heaps: Coordinate Exploration in Sorted Matrix',
    concept: 'Priority queue initialized with (nums1[i], nums2[0]), expanding to nums2[j+1].',
    problems: [
      { title: 'Find K Pairs with Smallest Sums', difficulty: 'Medium', url: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/', platform: 'LeetCode', desc: 'Min-heap frontier exploration over sorted pair sums.' }
    ]
  },
  {
    day: 71,
    pattern: 'Heaps: Dual Priority Scheduling',
    concept: 'Min-heap sorted by capital requirement, Max-heap sorted by net profit to maximize capital.',
    problems: [
      { title: 'IPO', difficulty: 'Hard', url: 'https://leetcode.com/problems/ipo/', platform: 'LeetCode', desc: 'Two heaps: available capital filter and greedy max profit.' }
    ]
  },
  {
    day: 72,
    pattern: 'Heaps: Multi-User Feed Aggregation',
    concept: 'Combining user followee tweet lists using K-way merge with priority queue ordered by timestamp.',
    problems: [
      { title: 'Design Twitter', difficulty: 'Medium', url: 'https://leetcode.com/problems/design-twitter/', platform: 'LeetCode', desc: 'Max-heap timestamp merge over followed users.' }
    ]
  },
  {
    day: 73,
    pattern: 'Heaps: Lowest Number Resource Allocation',
    concept: 'Min-heap maintaining unreserved seat numbers, returning minimum available seat in O(log N).',
    problems: [
      { title: 'Seat Reservation Manager', difficulty: 'Medium', url: 'https://leetcode.com/problems/seat-reservation-manager/', platform: 'LeetCode', desc: 'Min-heap seat allocator.' }
    ]
  },
  {
    day: 74,
    pattern: 'Heaps: Multi-Factor CPU Task Scheduling',
    concept: 'Sort by enqueue time; priority queue orders available tasks by duration, then index.',
    problems: [
      { title: 'Single-Threaded CPU', difficulty: 'Medium', url: 'https://leetcode.com/problems/single-threaded-cpu/', platform: 'LeetCode', desc: 'Priority queue simulation of CPU scheduling.' }
    ]
  },
  {
    day: 75,
    pattern: 'Heaps: Greedy Efficiency Sizing with Min-Heap',
    concept: 'Sort engineers by efficiency descending; maintain running speed sum in Min-heap of size K.',
    problems: [
      { title: 'Maximum Performance of a Team', difficulty: 'Hard', url: 'https://leetcode.com/problems/maximum-performance-of-a-team/', platform: 'LeetCode', desc: 'Greedy efficiency sort with Min-heap speed sum.' }
    ]
  },

  // --- DAYS 76-90: RECURSION & BACKTRACKING ---
  {
    day: 76,
    pattern: 'Backtracking: Power Set State Tree',
    concept: 'Binary decision tree at index i: include element or exclude element in recursive branch.',
    problems: [
      { title: 'Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets/', platform: 'LeetCode', desc: 'Backtracking generating 2^N subsets.' }
    ]
  },
  {
    day: 77,
    pattern: 'Backtracking: Duplicate Sibling Pruning',
    concept: 'Sort array and skip if (i > start && nums[i] == nums[i-1]) to eliminate duplicate combinations.',
    problems: [
      { title: 'Subsets II', difficulty: 'Medium', url: 'https://leetcode.com/problems/subsets-ii/', platform: 'LeetCode', desc: 'Pruning duplicate branches in state-space tree.' }
    ]
  },
  {
    day: 78,
    pattern: 'Backtracking: Bounded Combination Generation',
    concept: 'Generating K elements from 1 to N with pruning when remaining numbers cannot fill K.',
    problems: [
      { title: 'Combinations', difficulty: 'Medium', url: 'https://leetcode.com/problems/combinations/', platform: 'LeetCode', desc: 'Backtracking with size and bounds pruning.' }
    ]
  },
  {
    day: 79,
    pattern: 'Backtracking: Unbounded Element Reuse',
    concept: 'Recursion with index unchanged allowing same element reuse until target is exceeded.',
    problems: [
      { title: 'Combination Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum/', platform: 'LeetCode', desc: 'Backtracking with unbounded candidate reuse.' }
    ]
  },
  {
    day: 80,
    pattern: 'Backtracking: Single Use with Pruned Duplicates',
    concept: 'Sorting candidates, single use per candidate (index + 1), and skipping sibling duplicates.',
    problems: [
      { title: 'Combination Sum II', difficulty: 'Medium', url: 'https://leetcode.com/problems/combination-sum-ii/', platform: 'LeetCode', desc: 'Backtracking with duplicate pruning.' }
    ]
  },
  {
    day: 81,
    pattern: 'Backtracking: Visited Set Permutation Tree',
    concept: 'Building N! permutations using boolean visited array or in-place element swapping.',
    problems: [
      { title: 'Permutations', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations/', platform: 'LeetCode', desc: 'All permutations of distinct integer array.' }
    ]
  },
  {
    day: 82,
    pattern: 'Backtracking: Visited Predecessor Check for Duplicates',
    concept: 'Skip if nums[i] == nums[i-1] unless previous duplicate was already used in current branch.',
    problems: [
      { title: 'Permutations II', difficulty: 'Medium', url: 'https://leetcode.com/problems/permutations-ii/', platform: 'LeetCode', desc: 'Permutations of collection containing duplicates.' }
    ]
  },
  {
    day: 83,
    pattern: 'Backtracking: Multi-Way Digit Tree',
    concept: 'Mapping phone digit keypad to letters and expanding combinations in depth-first order.',
    problems: [
      { title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', platform: 'LeetCode', desc: 'DFS expansion across phone keypad mapping.' }
    ]
  },
  {
    day: 84,
    pattern: 'Backtracking: Substring Palindromic Partitioning',
    concept: 'Checking prefix palindrome validity before branching deeper into remaining suffix.',
    problems: [
      { title: 'Palindrome Partitioning', difficulty: 'Medium', url: 'https://leetcode.com/problems/palindrome-partitioning/', platform: 'LeetCode', desc: 'Partitioning string into all palindromic sub-segments.' }
    ]
  },
  {
    day: 85,
    pattern: 'Backtracking: 2D Grid DFS with In-Place Masking',
    concept: 'Replacing visited cell with "#" to avoid separate visited set, restoring character on return.',
    problems: [
      { title: 'Word Search', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-search/', platform: 'LeetCode', desc: 'In-place grid DFS backtracking with character mark.' }
    ]
  },
  {
    day: 86,
    pattern: 'Trie + Backtracking: Multi-Word Grid Search',
    concept: 'Combining Trie prefix tree with grid DFS to search for thousands of words simultaneously.',
    problems: [
      { title: 'Word Search II', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-search-ii/', platform: 'LeetCode', desc: 'Trie-guided grid backtracking search.' }
    ]
  },
  {
    day: 87,
    pattern: 'Backtracking: Numerical Segment Validity',
    concept: 'Partitioning string into 4 segments, validating bounds [0, 255] and leading zero restrictions.',
    problems: [
      { title: 'Restore IP Addresses', difficulty: 'Medium', url: 'https://leetcode.com/problems/restore-ip-addresses/', platform: 'LeetCode', desc: 'Backtracking valid IP address splits.' }
    ]
  },
  {
    day: 88,
    pattern: 'Backtracking: Column & Diagonal Conflict Bitmasks',
    concept: 'Tracking occupied columns and diagonals (row - col, row + col) using hash sets or bitmasks.',
    problems: [
      { title: 'N-Queens', difficulty: 'Hard', url: 'https://leetcode.com/problems/n-queens/', platform: 'LeetCode', desc: 'Non-attacking N-Queens placement on N x N board.' }
    ]
  },
  {
    day: 89,
    pattern: 'Backtracking: Constrained 9x9 Constraint Propagation',
    concept: 'Finding first empty cell, testing valid digits 1-9 checking row, column, and 3x3 box.',
    problems: [
      { title: 'Sudoku Solver', difficulty: 'Hard', url: 'https://leetcode.com/problems/sudoku-solver/', platform: 'LeetCode', desc: 'Backtracking Sudoku grid constraint solver.' }
    ]
  },
  {
    day: 90,
    pattern: 'Backtracking: Bucket Sum Load Balancing',
    concept: 'Sorting array descending to fail fast; distributing numbers into K buckets with early pruning.',
    problems: [
      { title: 'Partition to K Equal Sum Subsets', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/', platform: 'LeetCode', desc: 'Backtracking bucket sum partition with pruning.' }
    ]
  },

  // --- DAYS 91-110: BINARY TREES, BST & TRIES ---
  {
    day: 91,
    pattern: 'Trees: Recursive Tree Height Calculation',
    concept: 'Post-order DFS: height = 1 + max(maxDepth(left), maxDepth(right)) in O(N).',
    problems: [
      { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', platform: 'LeetCode', desc: 'Recursive depth computation.' }
    ]
  },
  {
    day: 92,
    pattern: 'Trees: Structural & Value Identity Verification',
    concept: 'Simultaneous traversal of two trees checking value equality and inverted subtree swaps.',
    problems: [
      { title: 'Same Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/same-tree/', platform: 'LeetCode', desc: 'Dual tree recursive equality check.' },
      { title: 'Invert Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/invert-binary-tree/', platform: 'LeetCode', desc: 'In-place left/right child swap.' }
    ]
  },
  {
    day: 93,
    pattern: 'Trees: Mirror Symmetry Traversal',
    concept: 'Comparing left subtree left child with right subtree right child recursively.',
    problems: [
      { title: 'Symmetric Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/symmetric-tree/', platform: 'LeetCode', desc: 'Mirror equality check between left and right branches.' }
    ]
  },
  {
    day: 94,
    pattern: 'Trees: Subtree Structure Matching',
    concept: 'Traversing main tree and calling isSameTree helper on every node candidate.',
    problems: [
      { title: 'Subtree of Another Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/subtree-of-another-tree/', platform: 'LeetCode', desc: 'Subtree pattern matching.' }
    ]
  },
  {
    day: 95,
    pattern: 'Trees: Post-Order LCA Split Discovery',
    concept: 'Post-order DFS: if root equals p or q, or both left and right return non-null, root is LCA.',
    problems: [
      { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', platform: 'LeetCode', desc: 'Post-order DFS split check in O(N) time.' }
    ]
  },
  {
    day: 96,
    pattern: 'BST: Directional Range Split Navigation',
    concept: 'Exploiting BST ordering: if both values < root move left, if both > root move right, else split point.',
    problems: [
      { title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', platform: 'LeetCode', desc: 'BST LCA in O(H) logarithmic time.' }
    ]
  },
  {
    day: 97,
    pattern: 'Trees: Level-Order Queue Traversal (BFS)',
    concept: 'Queue-based BFS recording level snapshot size before draining nodes into current level list.',
    problems: [
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', platform: 'LeetCode', desc: 'Standard BFS level-by-level processing.' }
    ]
  },
  {
    day: 98,
    pattern: 'Trees: Alternating Directional Level Processing',
    concept: 'Level-order BFS using a boolean flag to append or prepend nodes in alternating levels.',
    problems: [
      { title: 'Binary Tree Zigzag Level Order Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', platform: 'LeetCode', desc: 'Zigzag BFS traversal with deque.' }
    ]
  },
  {
    day: 99,
    pattern: 'Trees: Level-Order Last Element Observation',
    concept: 'BFS taking the last node in each level queue or DFS prioritizing right branch first.',
    problems: [
      { title: 'Binary Tree Right Side View', difficulty: 'Medium', url: 'https://leetcode.com/problems/binary-tree-right-side-view/', platform: 'LeetCode', desc: 'Rightmost node in each horizontal level.' }
    ]
  },
  {
    day: 100,
    pattern: 'Trees: Longest Path Between Any Two Nodes',
    concept: 'Post-order DFS: diameter at node = leftHeight + rightHeight, return 1 + max(left, right).',
    problems: [
      { title: 'Diameter of Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/diameter-of-binary-tree/', platform: 'LeetCode', desc: 'Global max diameter updated during height recursion.' }
    ]
  },
  {
    day: 101,
    pattern: 'Trees: Bottom-Up Height Balance Invariant',
    concept: 'Return -1 immediately if left or right subtree is unbalanced or |left - right| > 1.',
    problems: [
      { title: 'Balanced Binary Tree', difficulty: 'Easy', url: 'https://leetcode.com/problems/balanced-binary-tree/', platform: 'LeetCode', desc: 'Bottom-up O(N) height balance validation.' }
    ]
  },
  {
    day: 102,
    pattern: 'BST: Strict Bounding Invariant [Min, Max]',
    concept: 'Recursive DFS passing valid range (minVal, maxVal); left child bounded by parent value.',
    problems: [
      { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/validate-binary-search-tree/', platform: 'LeetCode', desc: 'Strict [min, max] range invariant DFS.' }
    ]
  },
  {
    day: 103,
    pattern: 'BST: In-Order Traversal Monotonicity',
    concept: 'In-order traversal (left, root, right) of BST produces strictly sorted sequence.',
    problems: [
      { title: 'Kth Smallest Element in a BST', difficulty: 'Medium', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', platform: 'LeetCode', desc: 'In-order traversal with counter stopping at K.' }
    ]
  },
  {
    day: 104,
    pattern: 'Trees: Index Partitioning from Traversal Order',
    concept: 'Root is preorder[0]; look up root in inorder map to determine left/right subtree sizes.',
    problems: [
      { title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', platform: 'LeetCode', desc: 'Recursive tree reconstruction via HashMap.' }
    ]
  },
  {
    day: 105,
    pattern: 'Trees: Path Sum with Gain Pruning',
    concept: 'At each node, compute max(0, gainFromLeft) + max(0, gainFromRight) + node.val.',
    problems: [
      { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', platform: 'LeetCode', desc: 'Global path sum max tracking with negative pruning.' }
    ]
  },
  {
    day: 106,
    pattern: 'Trees: Pre-Order String Serialization',
    concept: 'Encode tree into comma-separated string with "#" for nulls; decode via iterator queue.',
    problems: [
      { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', platform: 'LeetCode', desc: 'Complete tree serialization and deserialization.' }
    ]
  },
  {
    day: 107,
    pattern: 'Trees: Pre-Order In-Place Linked List Splice',
    concept: 'Splice right subtree to rightmost node of left subtree, move left to right, set left null.',
    problems: [
      { title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', platform: 'LeetCode', desc: 'In-place pre-order Morris traversal flattening.' }
    ]
  },
  {
    day: 108,
    pattern: 'Trees: Constant Space Horizontal Pointers',
    concept: 'Using existing next pointers of parent level to link children without queue in O(1) space.',
    problems: [
      { title: 'Populating Next Right Pointers in Each Node', difficulty: 'Medium', url: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/', platform: 'LeetCode', desc: 'Horizontal level next pointer linking.' }
    ]
  },
  {
    day: 109,
    pattern: 'Trie: 26-Way Prefix Tree Construction',
    concept: 'Node structure with TrieNode[26] children array and boolean isWord flag.',
    problems: [
      { title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', platform: 'LeetCode', desc: 'Prefix tree supporting insert, search, and startsWith in O(L).' }
    ]
  },
  {
    day: 110,
    pattern: 'Trie: Wildcard Dot Search Expansion',
    concept: 'Trie DFS expanding across all 26 non-null children when encountering wildcard "." character.',
    problems: [
      { title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', platform: 'LeetCode', desc: 'Trie with recursive wildcard pattern matching.' }
    ]
  },

  // --- DAYS 111-125: GRAPHS & SHORTEST PATHS ---
  {
    day: 111,
    pattern: 'Graphs: Connected Components on 2D Grid',
    concept: 'Draining 1s to 0s via BFS/DFS to count distinct connected land components in O(M * N).',
    problems: [
      { title: 'Number of Islands', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-islands/', platform: 'LeetCode', desc: 'Grid BFS/DFS connected components.' }
    ]
  },
  {
    day: 112,
    pattern: 'Graphs: Flood-Fill Area Accumulation',
    concept: 'Summing 1 + area(up) + area(down) + area(left) + area(right) recursively with in-place sinking.',
    problems: [
      { title: 'Max Area of Island', difficulty: 'Medium', url: 'https://leetcode.com/problems/max-area-of-island/', platform: 'LeetCode', desc: 'Max recursive flood-fill area.' }
    ]
  },
  {
    day: 113,
    pattern: 'Graphs: Deep Copy with Visited Hash Map',
    concept: 'Using HashMap oldNode -> newNode to avoid infinite loops and duplicate node creations.',
    problems: [
      { title: 'Clone Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/clone-graph/', platform: 'LeetCode', desc: 'Deep copy of undirected graph via DFS/BFS.' }
    ]
  },
  {
    day: 114,
    pattern: 'Graphs: Reverse Ocean Inflow Traversal',
    concept: 'Traversing inward from Pacific and Atlantic borders uphill (height >= prev) to find intersection.',
    problems: [
      { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', platform: 'LeetCode', desc: 'Dual-border inward graph traversal.' }
    ]
  },
  {
    day: 115,
    pattern: 'Graphs: Boundary-Connected Escapes',
    concept: 'Marking all 0s connected to grid boundary as non-capturable; flip all remaining 0s to X.',
    problems: [
      { title: 'Surrounded Regions', difficulty: 'Medium', url: 'https://leetcode.com/problems/surrounded-regions/', platform: 'LeetCode', desc: 'Boundary DFS escape marking.' }
    ]
  },
  {
    day: 116,
    pattern: 'Graphs: Multi-Source Simultaneous BFS',
    concept: 'Enqueuing all initially rotten oranges at t=0 and advancing infection in synchronized layers.',
    problems: [
      { title: 'Rotting Oranges', difficulty: 'Medium', url: 'https://leetcode.com/problems/rotting-oranges/', platform: 'LeetCode', desc: 'Multi-source level-synchronized BFS.' }
    ]
  },
  {
    day: 117,
    pattern: 'Graphs: Reverse Distance Infiltration',
    concept: 'Starting BFS from all gate locations simultaneously, setting distance on empty rooms.',
    problems: [
      { title: 'Walls and Gates', difficulty: 'Medium', url: 'https://leetcode.com/problems/walls-and-gates/', platform: 'LeetCode', desc: 'Multi-source gate BFS distance fill.' }
    ]
  },
  {
    day: 118,
    pattern: 'Graphs: Directed Cycle Detection (State Colors)',
    concept: 'Three-state DFS (0 = unvisited, 1 = visiting/ancestor in recursion, 2 = visited/safe).',
    problems: [
      { title: 'Course Schedule', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule/', platform: 'LeetCode', desc: 'Cycle detection in directed prerequisite graph.' }
    ]
  },
  {
    day: 119,
    pattern: 'Graphs: Topological Sort (Kahn In-Degree BFS)',
    concept: 'Calculating in-degrees, queueing 0-degree nodes, and decrementing neighbor in-degrees.',
    problems: [
      { title: 'Course Schedule II', difficulty: 'Medium', url: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'LeetCode', desc: 'Kahn algorithm returning complete linear ordering.' }
    ]
  },
  {
    day: 120,
    pattern: 'Graphs: Character Precedence Graph Synthesis',
    concept: 'Comparing adjacent words in sorted dictionary to extract directed character edges and TopoSort.',
    problems: [
      { title: 'Alien Dictionary', difficulty: 'Hard', url: 'https://leetcode.com/problems/alien-dictionary/', platform: 'LeetCode', desc: 'Topological sort over alien dictionary character precedence.' }
    ]
  },
  {
    day: 121,
    pattern: 'Union-Find: Disjoint Set Cycle Identification',
    concept: 'Finding edge where find(u) == find(v) before union, identifying cycle-causing edge.',
    problems: [
      { title: 'Redundant Connection', difficulty: 'Medium', url: 'https://leetcode.com/problems/redundant-connection/', platform: 'LeetCode', desc: 'Union-Find with path compression and rank.' }
    ]
  },
  {
    day: 122,
    pattern: 'Union-Find: Dynamic Component Count Tracking',
    concept: 'Initialize count = N; decrement count whenever union(u, v) merges two disjoint sets.',
    problems: [
      { title: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', platform: 'LeetCode', desc: 'Union-Find connected component counter.' }
    ]
  },
  {
    day: 123,
    pattern: 'Graphs: Tree Validity (Edges == V - 1 & Acyclic)',
    concept: 'A valid undirected tree must have exactly V - 1 edges and be fully connected without cycles.',
    problems: [
      { title: 'Graph Valid Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/graph-valid-tree/', platform: 'LeetCode', desc: 'Union-Find / DFS verifying tree properties.' }
    ]
  },
  {
    day: 124,
    pattern: 'Graphs: Dijkstra Shortest Path (PriorityQueue)',
    concept: 'Min-heap priority queue expanding shortest tentative path with relaxation check dist[u] + w < dist[v].',
    problems: [
      { title: 'Network Delay Time', difficulty: 'Medium', url: 'https://leetcode.com/problems/network-delay-time/', platform: 'LeetCode', desc: 'Dijkstra shortest path with Min-Heap in O((V + E) log V).' }
    ]
  },
  {
    day: 125,
    pattern: 'Graphs: Constrained Step Shortest Path',
    concept: 'Modified Bellman-Ford or BFS with state (node, cost, stops) tracking at most K intermediate stops.',
    problems: [
      { title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', platform: 'LeetCode', desc: 'Bellman-Ford or Dijkstra tracking stop count.' }
    ]
  },

  // --- DAYS 126-150: DYNAMIC PROGRAMMING & TIMED INTERVIEW SPRINTS ---
  {
    day: 126,
    pattern: 'DP: 1D Fibonacci State Compression',
    concept: 'Recurrence: dp[i] = dp[i-1] + dp[i-2], maintaining only previous two values in O(1) space.',
    problems: [
      { title: 'Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/climbing-stairs/', platform: 'LeetCode', desc: 'Fibonacci state compression.' },
      { title: 'Min Cost Climbing Stairs', difficulty: 'Easy', url: 'https://leetcode.com/problems/min-cost-climbing-stairs/', platform: 'LeetCode', desc: '1D min cost transition.' }
    ]
  },
  {
    day: 127,
    pattern: 'DP: Non-Adjacent State Choice',
    concept: 'Recurrence: rob[i] = max(rob[i-1], nums[i] + rob[i-2]); circular arrays split into two runs.',
    problems: [
      { title: 'House Robber', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber/', platform: 'LeetCode', desc: 'Non-adjacent sum optimization.' },
      { title: 'House Robber II', difficulty: 'Medium', url: 'https://leetcode.com/problems/house-robber-ii/', platform: 'LeetCode', desc: 'Circular array evaluated across [0..n-2] and [1..n-1].' }
    ]
  },
  {
    day: 128,
    pattern: 'DP: Unbounded Knapsack (Min Coins)',
    concept: '1D bottom-up table: dp[i] = min(dp[i], dp[i - coin] + 1) for every coin <= i.',
    problems: [
      { title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/', platform: 'LeetCode', desc: 'Unbounded Knapsack 1D tabulation in O(N * Amount).' }
    ]
  },
  {
    day: 129,
    pattern: 'DP: Combinations vs Permutations Loop Order',
    concept: 'Coins outer loop = combinations count; amount outer loop = permutations count.',
    problems: [
      { title: 'Coin Change II', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change-ii/', platform: 'LeetCode', desc: 'Number of unique coin combinations reaching amount.' }
    ]
  },
  {
    day: 130,
    pattern: 'DP: 0/1 Knapsack (Subset Sum Partition)',
    concept: 'Boolean 1D array traversed backwards from target down to num: dp[j] = dp[j] || dp[j - num].',
    problems: [
      { title: 'Partition Equal Subset Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/partition-equal-subset-sum/', platform: 'LeetCode', desc: '0/1 Knapsack boolean subset sum in O(N * Sum).' }
    ]
  },
  {
    day: 131,
    pattern: 'DP: 0/1 Knapsack Sign Transformation',
    concept: 'Transforming +/- sum: P - N = target, P + N = sum -> P = (sum + target) / 2.',
    problems: [
      { title: 'Target Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/target-sum/', platform: 'LeetCode', desc: 'Mathematical reduction to subset sum count.' }
    ]
  },
  {
    day: 132,
    pattern: 'DP: Valid Prefix Decodability',
    concept: 'Single digit check (1-9) + two-digit check (10-26) to aggregate valid decoding paths.',
    problems: [
      { title: 'Decode Ways', difficulty: 'Medium', url: 'https://leetcode.com/problems/decode-ways/', platform: 'LeetCode', desc: 'Fibonacci-like state with zero-guarding.' }
    ]
  },
  {
    day: 133,
    pattern: 'DP: Dictionary Suffix Reachability',
    concept: 'Boolean dp[i] indicates whether prefix of length i can be segmented into dictionary words.',
    problems: [
      { title: 'Word Break', difficulty: 'Medium', url: 'https://leetcode.com/problems/word-break/', platform: 'LeetCode', desc: '1D DP with HashSet dictionary lookup in O(N^2).' }
    ]
  },
  {
    day: 134,
    pattern: 'DP + Backtracking: Sentence Reconstruction',
    concept: 'Memoized DFS returning all valid sentence completions for each suffix string.',
    problems: [
      { title: 'Word Break II', difficulty: 'Hard', url: 'https://leetcode.com/problems/word-break-ii/', platform: 'LeetCode', desc: 'DFS with memoization returning all sentences.' }
    ]
  },
  {
    day: 135,
    pattern: 'DP: Patience Sorting & Binary Search LIS',
    concept: 'Maintain tails array of smallest tail of all increasing subsequences; binary search in O(N log N).',
    problems: [
      { title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'LeetCode', desc: 'Patience sort binary search in O(N log N).' }
    ]
  },
  {
    day: 136,
    pattern: 'DP: 2D Sorting to 1D LIS Reduction',
    concept: 'Sort width ascending, height descending for same width; apply 1D LIS on heights in O(N log N).',
    problems: [
      { title: 'Russian Doll Envelopes', difficulty: 'Hard', url: 'https://leetcode.com/problems/russian-doll-envelopes/', platform: 'LeetCode', desc: '2D sorting reduction to 1D LIS.' }
    ]
  },
  {
    day: 137,
    pattern: 'DP: 2D Subsequence Alignment Grid',
    concept: 'If s1[i] == s2[j]: 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).',
    problems: [
      { title: 'Longest Common Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-common-subsequence/', platform: 'LeetCode', desc: '2D grid DP alignment in O(M * N).' }
    ]
  },
  {
    day: 138,
    pattern: 'DP: Levenshtein Distance Matrix',
    concept: 'Cost matrix: insert (dp[i][j-1]), delete (dp[i-1][j]), replace (dp[i-1][j-1]) in O(M * N).',
    problems: [
      { title: 'Edit Distance', difficulty: 'Medium', url: 'https://leetcode.com/problems/edit-distance/', platform: 'LeetCode', desc: 'Classic Levenshtein distance matrix.' }
    ]
  },
  {
    day: 139,
    pattern: 'DP: Subsequence Occurrence Counting',
    concept: 'dp[i][j] = dp[i-1][j] + (s[i-1] == t[j-1] ? dp[i-1][j-1] : 0).',
    problems: [
      { title: 'Distinct Subsequences', difficulty: 'Hard', url: 'https://leetcode.com/problems/distinct-subsequences/', platform: 'LeetCode', desc: 'Counting distinct subsequence occurrences in O(M * N).' }
    ]
  },
  {
    day: 140,
    pattern: 'DP: 2D Grid Path Accumulation',
    concept: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]; obstacle cells set dp[i][j] = 0.',
    problems: [
      { title: 'Unique Paths', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-paths/', platform: 'LeetCode', desc: 'Combinatorial grid paths.' },
      { title: 'Unique Paths II', difficulty: 'Medium', url: 'https://leetcode.com/problems/unique-paths-ii/', platform: 'LeetCode', desc: 'Grid path counting with obstacles.' }
    ]
  },
  {
    day: 141,
    pattern: 'DP: In-Place Matrix Coordinate Relaxation',
    concept: 'grid[i][j] += min(grid[i-1][j], grid[i][j-1]) directly in-place in O(1) space.',
    problems: [
      { title: 'Minimum Path Sum', difficulty: 'Medium', url: 'https://leetcode.com/problems/minimum-path-sum/', platform: 'LeetCode', desc: 'In-place min path sum accumulation.' }
    ]
  },
  {
    day: 142,
    pattern: 'DP: Min-Of-Three Square Expansion',
    concept: 'dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) for largest square of 1s.',
    problems: [
      { title: 'Maximal Square', difficulty: 'Medium', url: 'https://leetcode.com/problems/maximal-square/', platform: 'LeetCode', desc: 'Largest all-1 square in binary matrix.' }
    ]
  },
  {
    day: 143,
    pattern: 'DP: Finite State Machine Transitions',
    concept: 'Three states: hold, sold (cooldown), rest; transition equations maintain optimal profit.',
    problems: [
      { title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', platform: 'LeetCode', desc: 'State-machine DP with cooldown.' }
    ]
  },
  {
    day: 144,
    pattern: 'DP: Transaction Fee State Deduction',
    concept: 'Two states: hold and cash; subtract fee on sell transaction: cash = max(cash, hold + price - fee).',
    problems: [
      { title: 'Best Time to Buy and Sell Stock with Transaction Fee', difficulty: 'Medium', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/', platform: 'LeetCode', desc: 'State-machine DP with fee deduction.' }
    ]
  },
  {
    day: 145,
    pattern: 'DP: Subsequence Palindromic Alignment',
    concept: 'Longest common subsequence between string s and its reverse string reverse(s).',
    problems: [
      { title: 'Longest Palindromic Subsequence', difficulty: 'Medium', url: 'https://leetcode.com/problems/longest-palindromic-subsequence/', platform: 'LeetCode', desc: 'LCS between string and its reverse.' }
    ]
  },
  {
    day: 146,
    pattern: 'DP: Palindrome Cuts Minimization',
    concept: 'dp[i] = min(dp[i], 1 + dp[j-1]) for all valid palindrome substrings s[j..i].',
    problems: [
      { title: 'Palindrome Partitioning II', difficulty: 'Hard', url: 'https://leetcode.com/problems/palindrome-partitioning-ii/', platform: 'LeetCode', desc: 'Minimum cuts for valid palindrome partitioning in O(N^2).' }
    ]
  },
  {
    day: 147,
    pattern: 'DP: Interval Bursting Boundary Optimization',
    concept: 'Deciding the LAST balloon to burst in interval (left, right): nums[left] * nums[k] * nums[right].',
    problems: [
      { title: 'Burst Balloons', difficulty: 'Hard', url: 'https://leetcode.com/problems/burst-balloons/', platform: 'LeetCode', desc: 'Interval DP bursting optimization in O(N^3).' }
    ]
  },
  {
    day: 148,
    pattern: 'DP: Multi-Paradigm Comparison (DP vs Two Pointers)',
    concept: 'Contrasting O(N) auxiliary space leftMax/rightMax array with O(1) space dual pointers.',
    problems: [
      { title: 'Trapping Rain Water', difficulty: 'Hard', url: 'https://leetcode.com/problems/trapping-rain-water/', platform: 'LeetCode', desc: 'Comparative deep dive: prefix array vs two-pointer O(1) space.' }
    ]
  },
  {
    day: 149,
    pattern: 'DP: Regular Expression State Alignment',
    concept: 'Matrix matching "." (any char) and "*" (zero or more of preceding char) in O(M * N).',
    problems: [
      { title: 'Regular Expression Matching', difficulty: 'Hard', url: 'https://leetcode.com/problems/regular-expression-matching/', platform: 'LeetCode', desc: 'Regex pattern dynamic programming.' }
    ]
  },
  {
    day: 150,
    pattern: 'Final Timed Gauntlet: Grand Mastery Sprint',
    concept: 'Full mock interview simulation across HashMaps, Intervals, Binary Trees, and Dynamic Programming.',
    problems: [
      { title: 'Two Sum', difficulty: 'Easy', url: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode', desc: 'Sprint problem 1: HashMap complement lookup.' },
      { title: 'Merge Intervals', difficulty: 'Medium', url: 'https://leetcode.com/problems/merge-intervals/', platform: 'LeetCode', desc: 'Sprint problem 2: Interval sorting and boundary extension.' },
      { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', platform: 'LeetCode', desc: 'Sprint problem 3: Post-order DFS LCA split check.' },
      { title: 'Coin Change', difficulty: 'Medium', url: 'https://leetcode.com/problems/coin-change/', platform: 'LeetCode', desc: 'Sprint problem 4: Unbounded Knapsack 1D tabulation.' }
    ]
  }
];
