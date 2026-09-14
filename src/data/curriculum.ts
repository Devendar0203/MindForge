import { CurriculumDay } from '../types';

export const CURRICULUM: CurriculumDay[] = [
  // WEEK 1
  {
    day: 1,
    week: 'Week 1 — DSA foundations',
    title: 'Arrays & strings: two-pointer, sliding window',
    sub: 'Solve 3-4 problems (LeetCode easy/medium). Pattern > quantity.',
    category: 'dsa',
    keyConcepts: ['Two-pointer left/right bounds', 'Sliding window dynamic sizing', 'In-place array manipulation'],
    practiceProblems: [
      { name: 'Two Sum II (Sorted)', difficulty: 'Easy', description: 'Find two numbers that add up to target using two pointers from outer ends.', technique: 'Two Pointers' },
      { name: '3Sum', difficulty: 'Medium', description: 'Sort array, fix one number, and run two pointers on the remaining subarray.', technique: 'Two Pointers' },
      { name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', description: 'Expand right pointer, contract left pointer whenever duplicate is detected in window map.', technique: 'Sliding Window' },
      { name: 'Container With Most Water', difficulty: 'Medium', description: 'Move the pointer pointing to the shorter wall inward.', technique: 'Two Pointers Greedy' }
    ],
    deepDive: 'Two-pointer replaces quadratic nested loops with a single linear O(n) pass. For sliding window, keep a mental invariant: window is valid when no constraints are breached; expand until invalid, contract until valid again.'
  },
  {
    day: 2,
    title: 'Hashing: hash maps, hash sets, frequency counting',
    sub: 'Focus on when hashing beats brute force.',
    category: 'dsa',
    keyConcepts: ['O(1) average lookup vs O(n) scan', 'Frequency counting arrays', 'Prefix sum hashing'],
    practiceProblems: [
      { name: 'Valid Anagram', difficulty: 'Easy', description: 'Compare character frequencies using array or hash map.', technique: 'Frequency Table' },
      { name: 'Group Anagrams', difficulty: 'Medium', description: 'Categorize strings by sorted key or character frequency tuple.', technique: 'Hash Map Bucket' },
      { name: 'Subarray Sum Equals K', difficulty: 'Medium', description: 'Store prefix sums in hash map to find contiguous ranges in O(n).', technique: 'Prefix Sum + Hash Map' }
    ],
    deepDive: 'Trading memory for time is the primary interview superpower. Frequency tables on fixed alphabets (ASCII 128 or lowercase 26) can use simple integer arrays for maximum cache locality.'
  },
  {
    day: 3,
    title: 'Recursion & backtracking basics',
    sub: 'Draw the recursion tree before coding.',
    category: 'dsa',
    keyConcepts: ['Base cases & recursive steps', 'Decision tree branching', 'State restoration (backtracking)'],
    practiceProblems: [
      { name: 'Subsets (Power Set)', difficulty: 'Medium', description: 'At each index choose to include or exclude current element.', technique: 'Decision Tree Backtracking' },
      { name: 'Permutations', difficulty: 'Medium', description: 'Swap elements or track visited array to generate all ordering states.', technique: 'Backtracking' },
      { name: 'Combination Sum', difficulty: 'Medium', description: 'Subtract candidates from target, allowing repeated selections.', technique: 'Pruned Recursion' }
    ],
    deepDive: 'Never write a single line of backtracking code without drawing the call tree on paper first. Clearly identify: (1) Current state, (2) Choices available, (3) Base case/terminator, (4) Undo action.'
  },
  {
    day: 4,
    title: 'Sorting algorithms + when to use which',
    sub: 'Merge sort, quick sort — implement one from scratch.',
    category: 'dsa',
    keyConcepts: ['Divide and conquer', 'Pivot partitioning (Lomuto vs Hoare)', 'Stability in sorting'],
    practiceProblems: [
      { name: 'Implement Merge Sort', difficulty: 'Medium', description: 'Divide array into halves, recursively sort, and merge two sorted arrays.', technique: 'Divide & Conquer' },
      { name: 'Implement Quick Sort', difficulty: 'Medium', description: 'Select pivot, partition elements smaller to left and larger to right.', technique: 'In-place Partitioning' },
      { name: 'Top K Frequent Elements', difficulty: 'Medium', description: 'Use QuickSelect or Min-Heap to find top k elements in O(n) average.', technique: 'QuickSelect / Bucket Sort' }
    ],
    deepDive: 'Merge sort guarantees O(n log n) even in the worst case with stable sorting at the cost of O(n) extra memory. Quick sort is faster in practice due to CPU cache warmth, but can degrade to O(n^2) without randomized pivots.'
  },
  {
    day: 5,
    title: 'Binary search & its variants',
    sub: 'Search space reduction, not just sorted arrays.',
    category: 'dsa',
    keyConcepts: ['Condition monotonicity', 'Left vs right boundary search', 'Search on answer space'],
    practiceProblems: [
      { name: 'Search in Rotated Sorted Array', difficulty: 'Medium', description: 'Determine which half is cleanly sorted before deciding where to branch.', technique: 'Modified Binary Search' },
      { name: 'Find First and Last Position of Element', difficulty: 'Medium', description: 'Run two binary searches: one with right boundary contraction, one left.', technique: 'Boundary Binary Search' },
      { name: 'Koko Eating Bananas', difficulty: 'Medium', description: 'Binary search the eating speed k from 1 to max pile size.', technique: 'Binary Search on Solution' }
    ],
    deepDive: 'Binary search works whenever a predicate P(x) is monotonic: F, F, F, ..., T, T, T. It is not limited to sorted arrays—any time you can answer "is X feasible?" in O(n), you can find the optimum in O(n log(range)).'
  },
  {
    day: 6,
    title: 'Stacks & queues',
    sub: 'Monotonic stack problems — common interview trap.',
    category: 'dsa',
    keyConcepts: ['LIFO vs FIFO mechanics', 'Monotonic increasing/decreasing stacks', 'Breadth vs Depth processing'],
    practiceProblems: [
      { name: 'Valid Parentheses', difficulty: 'Easy', description: 'Push open brackets, pop and verify matching closing brackets.', technique: 'Stack' },
      { name: 'Daily Temperatures', difficulty: 'Medium', description: 'Use a monotonic decreasing stack of indices to find the next warmer day.', technique: 'Monotonic Stack' },
      { name: 'Largest Rectangle in Histogram', difficulty: 'Hard', description: 'Maintain monotonic stack of heights to evaluate maximal rectangle upon popping.', technique: 'Monotonic Stack' }
    ],
    deepDive: 'A monotonic stack answers "What is the next/previous greater/smaller element for every item?" in linear O(n) time, because every element is pushed and popped at most once.'
  },
  {
    day: 7,
    title: 'Weekly review: redo 2 hardest problems untimed',
    sub: 'No new topic — consolidation day.',
    category: 'review',
    keyConcepts: ['Active recall without looking at solutions', 'Explaining complexity tradeoffs out loud', 'Consolidating intuition'],
    practiceProblems: [
      { name: 'Redo Your Week 1 Nemesis Problem', difficulty: 'Medium', description: 'Re-solve the problem you struggled with most this week from a blank file.', technique: 'Deliberate Practice' },
      { name: 'Complexity Audit', difficulty: 'Easy', description: 'Explain Time & Space complexity for all 6 patterns studied this week.', technique: 'Verbal Articulation' }
    ],
    deepDive: 'Consolidation is where long-term neural pathways form. If you only move forward without revisiting your friction points, knowledge evaporates. Embrace the discomfort of re-facing difficult problems.'
  },

  // WEEK 2
  {
    day: 8,
    week: 'Week 2 — DSA + math for ML',
    title: 'Linked lists: reversal, cycle detection',
    sub: 'Pointer manipulation, draw it out first.',
    category: 'dsa',
    keyConcepts: ['Dummy head node pattern', 'Floyd tortoise and hare cycle detection', 'Iterative vs recursive reversal'],
    practiceProblems: [
      { name: 'Reverse Linked List', difficulty: 'Easy', description: 'Maintain prev, curr, and next pointers to reverse list in-place.', technique: 'Pointer Reassignment' },
      { name: 'Linked List Cycle II', difficulty: 'Medium', description: 'Use slow and fast pointers to detect cycle and locate loop entrance.', technique: 'Floyd Cycle Finding' },
      { name: 'Merge k Sorted Lists', difficulty: 'Hard', description: 'Use a min-heap or divide-and-conquer merge pairing.', technique: 'Heap / Divide & Conquer' }
    ],
    deepDive: 'Always initialize a `dummy = ListNode(0)` before the head to eliminate edge cases when mutating the first element of a list.'
  },
  {
    day: 9,
    title: 'Trees & BSTs: traversals, height, balance',
    sub: 'DFS/BFS on trees, not just graphs.',
    category: 'dsa',
    keyConcepts: ['Pre-order, In-order, Post-order traversal', 'Level-order BFS with queue', 'BST invariant: Left < Root < Right'],
    practiceProblems: [
      { name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', description: 'Return 1 + max(depth(left), depth(right)).', technique: 'Recursive DFS' },
      { name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', description: 'Track queue size at the start of each level to group node values.', technique: 'Queue BFS' },
      { name: 'Lowest Common Ancestor of BST', difficulty: 'Medium', description: 'Walk down tree using BST property to find split point.', technique: 'BST Navigation' }
    ],
    deepDive: 'In-order traversal of a Binary Search Tree always yields elements in strictly sorted ascending order. Recursive tree problems almost always boil down to: "What do I need from my children to answer this for myself?"'
  },
  {
    day: 10,
    title: 'Graphs: BFS & DFS fundamentals',
    sub: 'Connected components, shortest path basics.',
    category: 'dsa',
    keyConcepts: ['Adjacency list representation', 'Visited set cycle prevention', 'Unweighted shortest path (BFS)'],
    practiceProblems: [
      { name: 'Number of Islands', difficulty: 'Medium', description: 'Iterate grid and trigger DFS/BFS to sink visited land.', technique: 'Grid DFS/BFS' },
      { name: 'Clone Graph', difficulty: 'Medium', description: 'Traverse graph while caching old-node to new-node mappings in a hash map.', technique: 'Hash Map + Graph Traversal' },
      { name: 'Course Schedule (Cycle Detection)', difficulty: 'Medium', description: 'Topological sort using Kahn’s algorithm (in-degree array) or 3-color DFS.', technique: 'Topological Sort' }
    ],
    deepDive: 'BFS guarantees finding the shortest path in unweighted graphs because it explores outwards level by level. In DFS, track visited state (unvisited, visiting, visited) to reliably detect directed cycles.'
  },
  {
    day: 11,
    title: 'Dynamic programming: intro (1D DP)',
    sub: 'Fibonacci-style → climbing stairs → house robber.',
    category: 'dsa',
    keyConcepts: ['Optimal substructure & overlapping subproblems', 'Memoization (top-down) vs Tabulation (bottom-up)', 'Space optimization to O(1) variables'],
    practiceProblems: [
      { name: 'Climbing Stairs', difficulty: 'Easy', description: 'Ways to reach step n is ways(n-1) + ways(n-2).', technique: '1D DP' },
      { name: 'House Robber', difficulty: 'Medium', description: 'dp[i] = max(dp[i-1], dp[i-2] + nums[i]).', technique: 'State Machine DP' },
      { name: 'Coin Change', difficulty: 'Medium', description: 'dp[amount] = 1 + min(dp[amount - coin] for each coin).', technique: 'Unbounded Knapsack DP' }
    ],
    deepDive: 'DP is merely recursion with a memory cache. Define the recurrence relation clearly: state what `dp[i]` represents in plain English before writing code.'
  },
  {
    day: 12,
    title: 'Python for ML: NumPy fluency',
    sub: 'Vectorized ops, broadcasting — stop writing loops.',
    category: 'ml',
    keyConcepts: ['Vectorization vs Python loops', 'Broadcasting rules', 'Boolean masking and fancy indexing', 'Axis reductions (axis=0 vs axis=1)'],
    practiceProblems: [
      { name: 'Matrix Normalization', difficulty: 'Easy', description: 'Normalize an (N, D) matrix to zero mean and unit variance along axis=0 without loops.', technique: 'NumPy Broadcasting' },
      { name: 'Pairwise Euclidean Distance', difficulty: 'Medium', description: 'Compute all pairwise distances between two sets of vectors using broadcasting.', technique: 'Vectorization' },
      { name: 'One-Hot Encoding', difficulty: 'Easy', description: 'Convert categorical label vector to one-hot matrix using np.eye or indexing.', technique: 'Array Indexing' }
    ],
    deepDive: 'NumPy executes in compiled C/Fortran SIMD. A Python loop over 1M floats takes ~100ms; vectorized NumPy takes ~1ms. When broadcasting, dimensions match if they are equal or one of them is 1.'
  },
  {
    day: 13,
    title: 'Linear algebra: vectors, matrices, dot products',
    sub: "3Blue1Brown series if concepts feel shaky.",
    category: 'math',
    keyConcepts: ['Dot product as geometric projection & cosine similarity', 'Matrix multiplication as linear transformation of basis vectors', 'Eigenvalues & eigenvectors intuition'],
    practiceProblems: [
      { name: 'Manual Dot Product & Matrix Mult', difficulty: 'Easy', description: 'Write intuition-level code for dot product and matmul to internalize dimensions (M, K) @ (K, N) -> (M, N).', technique: 'Matrix Algebra' },
      { name: 'Cosine Similarity Calculator', difficulty: 'Easy', description: 'Compute cosine similarity: (A · B) / (||A|| * ||B||) for vector embeddings.', technique: 'Geometry of High Dimensions' }
    ],
    deepDive: 'In modern AI/ML and GenAI, everything is an embedding vector. The dot product measures semantic alignment; matrix weights transform one semantic space into another.'
  },
  {
    day: 14,
    title: 'Probability & statistics basics',
    sub: "Distributions, mean/variance, Bayes' theorem intuition.",
    category: 'math',
    keyConcepts: ['Normal / Gaussian distribution & Central Limit Theorem', 'Variance, Covariance, Correlation', "Bayes' theorem: Posterior ∝ Likelihood × Prior"],
    practiceProblems: [
      { name: "Bayesian Spam Classifier Math", difficulty: 'Easy', description: "Calculate P(Spam | 'lottery', 'winner') using Bayes rule and class conditionals.", technique: "Bayes Rule" },
      { name: 'Maximum Likelihood Estimator (MLE)', difficulty: 'Medium', description: 'Derive MLE for the mean of a normal distribution by taking the derivative of log-likelihood.', technique: 'MLE Derivation' }
    ],
    deepDive: 'Loss functions in ML (e.g. Mean Squared Error, Cross-Entropy) are direct consequences of Maximum Likelihood Estimation under Gaussian or Bernoulli noise assumptions.'
  },

  // WEEK 3
  {
    day: 15,
    week: 'Week 3 — ML fundamentals',
    title: 'Linear regression from scratch',
    sub: 'Implement without sklearn first, then compare.',
    category: 'ml',
    keyConcepts: ['Hypothesis function y = Xw + b', 'Mean Squared Error (MSE) loss', 'Closed-form Normal Equation w = (X^T X)^-1 X^T y'],
    practiceProblems: [
      { name: 'Scratch Linear Regression Class', difficulty: 'Medium', description: 'Build a Python class with .fit(X, y) and .predict(X) using NumPy closed-form or gradient updates.', technique: 'Scratch Implementation' },
      { name: 'L1 vs L2 Regularization (Lasso / Ridge)', difficulty: 'Medium', description: 'Add weight decay penalty to loss function and explain why L1 creates sparse feature weights.', technique: 'Regularization' }
    ],
    deepDive: 'Implementing the math from scratch removes the magic. You realize machine learning is just parameter optimization guided by a cost landscape.'
  },
  {
    day: 16,
    title: 'Gradient descent: the actual mechanics',
    sub: 'Code it manually on a toy dataset.',
    category: 'ml',
    keyConcepts: ['Gradient vector direction of steepest ascent', 'Learning rate schedule & convergence', 'Batch vs Mini-batch vs Stochastic Gradient Descent (SGD)'],
    practiceProblems: [
      { name: 'SGD from Scratch', difficulty: 'Medium', description: 'Implement 2D gradient descent optimization on f(x, y) = x^2 + 2y^2 and plot trajectory.', technique: 'Optimization' },
      { name: 'Momentum Optimizer', difficulty: 'Medium', description: 'Implement exponentially moving average velocity to accelerate past ravines.', technique: 'Momentum' }
    ],
    deepDive: 'The gradient ∇L points uphill; we subtract η * ∇L to walk downhill. If η is too large, the loss diverges; if too small, learning stalls in saddle points.'
  },
  {
    day: 17,
    title: 'Logistic regression & classification basics',
    sub: 'Decision boundary, sigmoid, cross-entropy loss.',
    category: 'ml',
    keyConcepts: ['Sigmoid activation σ(z) = 1 / (1 + e^-z)', 'Log-loss / Binary Cross-Entropy', 'Linear decision boundary in feature space'],
    practiceProblems: [
      { name: 'Binary Logistic Regression', difficulty: 'Medium', description: 'Implement sigmoid forward pass and binary cross-entropy gradient update.', technique: 'Classification' },
      { name: 'Softmax for Multiclass', difficulty: 'Medium', description: 'Compute numerically stable softmax: exp(z - max(z)) / sum(exp(z - max(z))).', technique: 'Multinomial Classification' }
    ],
    deepDive: 'Logistic regression is linear regression passed through a squashing function that maps outputs to probabilities between 0 and 1.'
  },
  {
    day: 18,
    title: 'Train/test split, overfitting & underfitting',
    sub: "Bias-variance tradeoff — core concept, don't skip.",
    category: 'ml',
    keyConcepts: ['High bias (underfitting) vs High variance (overfitting)', 'K-Fold cross-validation', 'Data leakage prevention (fit on train only!)'],
    practiceProblems: [
      { name: 'Learning Curves Plotting', difficulty: 'Easy', description: 'Plot training error vs validation error across model complexity degrees.', technique: 'Diagnostic Evaluation' },
      { name: 'Stratified K-Fold Splitter', difficulty: 'Medium', description: 'Implement or verify stratified split maintaining class balance in imbalanced datasets.', technique: 'Cross Validation' }
    ],
    deepDive: 'Bias is error from erroneous assumptions in the learning algorithm. Variance is error from sensitivity to small fluctuations in the training set. Good ML engineers diagnose which problem they have before changing models.'
  },
  {
    day: 19,
    title: 'Decision trees & ensemble methods',
    sub: 'Random forests, intuition over library calls.',
    category: 'ml',
    keyConcepts: ['Information Gain & Gini Impurity splits', 'Bagging (Bootstrap Aggregation) in Random Forests', 'Boosting (AdaBoost, XGBoost, LightGBM) sequentially fixing errors'],
    practiceProblems: [
      { name: 'Calculate Gini Impurity', difficulty: 'Easy', description: 'Given a set of labels, compute Gini = 1 - sum(p_i^2) by hand.', technique: 'Impurity Calculation' },
      { name: 'Feature Importance Inspection', difficulty: 'Easy', description: 'Train a Random Forest on tabular data and plot the top 5 most predictive features.', technique: 'Explainable AI' }
    ],
    deepDive: 'Random forests combine hundreds of high-variance, deep trees via bagging to drastically reduce variance without increasing bias.'
  },
  {
    day: 20,
    title: 'Model evaluation: precision, recall, F1, ROC-AUC',
    sub: 'Know when accuracy alone lies to you.',
    category: 'ml',
    keyConcepts: ['Confusion Matrix (TP, FP, TN, FN)', 'Precision (quality of positive predictions) vs Recall (coverage of true positives)', 'ROC Curve & Area Under Curve (AUC)'],
    practiceProblems: [
      { name: 'Confusion Matrix Calculator', difficulty: 'Easy', description: 'Write functions for precision, recall, and F1 score from raw predictions and ground truth.', technique: 'Metrics' },
      { name: 'Threshold Tuning for Imbalanced Fraud', difficulty: 'Medium', description: 'Vary probability threshold from 0.1 to 0.9 to optimize recall for fraud detection.', technique: 'Decision Thresholds' }
    ],
    deepDive: 'If 99.9% of transactions are legitimate, a model that predicts "always legitimate" gets 99.9% accuracy but catches 0 frauds. Accuracy is lethal on imbalanced data.'
  },
  {
    day: 21,
    title: 'Mini project: end-to-end sklearn pipeline',
    sub: 'Real dataset, clean notebook, written conclusions.',
    category: 'project',
    keyConcepts: ['Scikit-learn Pipeline and ColumnTransformer', 'Feature scaling and one-hot encoding without leakage', 'Hyperparameter tuning with GridSearchCV / RandomizedSearchCV'],
    practiceProblems: [
      { name: 'Build End-to-End Predictor', difficulty: 'Hard', description: 'Load a real tabular dataset (e.g. Housing, Titanic, or Heart Disease), build full preprocessing pipeline, train 2 models, compare test ROC-AUC.', technique: 'Production Pipeline' }
    ],
    deepDive: 'A pipeline bundles preprocessing and modeling into a single atomic object that can be pickled and served in production with zero training data leakage.'
  },

  // WEEK 4
  {
    day: 22,
    week: 'Week 4 — Applied ML/DL + DSA revision',
    title: 'Neural networks: forward pass by hand',
    sub: 'One neuron, one layer — before any framework.',
    category: 'ml',
    keyConcepts: ['Perceptron: z = Wx + b, a = activation(z)', 'Non-linearities: ReLU, Sigmoid, Tanh', 'Multilayer Perceptron (MLP) architecture'],
    practiceProblems: [
      { name: 'Single Neuron NumPy Forward Pass', difficulty: 'Easy', description: 'Compute outputs for 3 inputs, 2 hidden neurons, and 1 output neuron using raw NumPy arrays.', technique: 'Forward Propagation' },
      { name: 'XOR Problem with 2 Layers', difficulty: 'Medium', description: 'Demonstrate why a single linear neuron fails on XOR and how a 2-layer network solves it.', technique: 'Nonlinear Separability' }
    ],
    deepDive: 'Without non-linear activations (like ReLU), stacking 100 neural network layers collapses mathematically into a single linear regression transformation: W_1 * (W_2 * x) = W_comb * x.'
  },
  {
    day: 23,
    title: 'Backpropagation intuition',
    sub: 'Chain rule on paper before trusting autograd.',
    category: 'ml',
    keyConcepts: ['Calculus chain rule: dL/dw = dL/da * da/dz * dz/dw', 'Computational graphs and reverse-mode automatic differentiation', 'Vanishing and exploding gradients'],
    practiceProblems: [
      { name: 'Micrograd-style Scalar Backprop', difficulty: 'Hard', description: 'Write a tiny Value class with .data, .grad, and backward() methods for addition and multiplication.', technique: 'Autograd Engine' }
    ],
    deepDive: 'Backpropagation is reverse-mode automatic differentiation applied to a scalar loss. It computes gradients for millions of parameters in a single backward pass.'
  },
  {
    day: 24,
    title: 'PyTorch or TensorFlow basics',
    sub: 'Pick one. Build a tiny classifier end-to-end.',
    category: 'ml',
    keyConcepts: ['Tensors & GPU acceleration (to device)', 'nn.Module, forward pass, Loss, and optimizer.step()', 'Training loop: zero_grad() -> loss.backward() -> step()'],
    practiceProblems: [
      { name: 'PyTorch MLP on MNIST or Fashion-MNIST', difficulty: 'Medium', description: 'Create a 3-layer nn.Sequential, run 5 epochs, evaluate test accuracy.', technique: 'Deep Learning Workflow' }
    ],
    deepDive: 'Always remember the holy trinity in PyTorch training loops: `optimizer.zero_grad()`, `loss.backward()`, `optimizer.step()`. Forgetting zero_grad accumulates gradients across batches!'
  },
  {
    day: 25,
    title: 'CNNs: convolution & pooling intuition',
    sub: 'Why they work for images — not just the API.',
    category: 'ml',
    keyConcepts: ['Spatial translation invariance & parameter sharing', 'Kernels / filters (edge detectors to high-level features)', 'Stride, padding, and max pooling dimensionality reduction'],
    practiceProblems: [
      { name: 'Calculate Output Dimensions', difficulty: 'Easy', description: 'Given input (28, 28), kernel 3x3, stride 1, padding 1, calculate output spatial dimensions: ((W - K + 2P)/S) + 1.', technique: 'Convolution Math' },
      { name: 'Build a 2-Conv-Layer Net', difficulty: 'Medium', description: 'Implement Conv2d -> ReLU -> MaxPool2d -> Linear in PyTorch.', technique: 'CNN Architecture' }
    ],
    deepDive: 'A 1000x1000 image fully connected to 1000 neurons requires 1 billion weights. A 3x3 convolutional filter uses only 9 weights, sliding across the entire image!'
  },
  {
    day: 26,
    title: 'NLP & transformers: high-level intuition',
    sub: 'Attention mechanism, at a conceptual level.',
    category: 'ml',
    keyConcepts: ['Self-attention: Query, Key, Value vectors', 'Attention formula: Softmax((Q K^T) / sqrt(d_k)) * V', 'Positional encodings and parallel training vs RNNs'],
    practiceProblems: [
      { name: 'Compute Scaled Dot-Product Attention', difficulty: 'Medium', description: 'Implement the Attention equation in 5 lines of NumPy/PyTorch with Q, K, V matrices.', technique: 'Attention Equation' }
    ],
    deepDive: 'Self-attention allows every token in a sequence to dynamically attend to every other token regardless of distance, solving the bottleneck that crippled RNNs and LSTMs.'
  },
  {
    day: 27,
    title: 'DSA revision: medium-level mixed set',
    sub: 'Timed practice — simulate interview pressure.',
    category: 'dsa',
    keyConcepts: ['Time management: 25 minutes per question', 'Communicating assumptions out loud', 'Handling edge cases before writing code'],
    practiceProblems: [
      { name: 'LRU Cache', difficulty: 'Medium', description: 'Combine Hash Map + Doubly Linked List for O(1) get and put.', technique: 'Data Structure Design' },
      { name: 'Word Break', difficulty: 'Medium', description: 'Determine if string can be segmented into dictionary words using 1D DP.', technique: 'DP on Strings' },
      { name: 'Kth Smallest Element in BST', difficulty: 'Medium', description: 'Perform in-order traversal with counter.', technique: 'BST Traversal' }
    ],
    deepDive: 'In technical interviews, silence is failure. Walk the interviewer through your thought process: start with brute force, articulate the bottleneck, and transition to the optimal pattern.'
  },
  {
    day: 28,
    title: 'DSA revision: graphs + DP mixed set',
    sub: 'The two areas people freeze on most.',
    category: 'dsa',
    keyConcepts: ['Recognizing 2D DP table structures (Longest Common Subsequence)', 'Shortest path algorithms (Dijkstra vs BFS)', 'State transition diagrams'],
    practiceProblems: [
      { name: 'Longest Common Subsequence (LCS)', difficulty: 'Medium', description: 'If chars match: 1 + dp[i-1][j-1]; else max(dp[i-1][j], dp[i][j-1]).', technique: '2D DP' },
      { name: 'Network Delay Time (Dijkstra)', difficulty: 'Medium', description: 'Use min-heap priority queue to find shortest time to reach all nodes in weighted graph.', technique: 'Dijkstra Priority Queue' }
    ],
    deepDive: 'When faced with a difficult DP problem, make the 2D grid explicit on paper. What does cell (i, j) depend on? Usually top, left, or top-left.'
  },
  {
    day: 29,
    title: 'Portfolio: document the mini project properly',
    sub: 'README, clear write-up — this is what gets seen.',
    category: 'project',
    keyConcepts: ['Problem statement & business value', 'Architecture diagrams & technical decisions', 'Performance benchmarks and failure modes'],
    practiceProblems: [
      { name: 'Write a Production README', difficulty: 'Easy', description: 'Structure: Overview, Key Results (Metrics), Installation, Architecture Diagram, Retrospective on Tradeoffs.', technique: 'Technical Communication' }
    ],
    deepDive: 'Code that cannot be explained or understood does not exist to hiring managers or engineering peers. Crafting clear documentation demonstrates seniority.'
  },
  {
    day: 30,
    title: 'Full review: what compounded, what didn\'t',
    sub: 'Plan the next 30 days from evidence, not vibes.',
    category: 'review',
    keyConcepts: ['Audit 30 days of logged hours', 'Analyze psychological avoidance patterns from nightly reviews', 'Design the next compounding 30-day block'],
    practiceProblems: [
      { name: 'Retrospective Synthesis', difficulty: 'Medium', description: 'Review your total hours, streak records, and written answers to "What did I avoid?". Formulate 3 non-negotiables for the upcoming month.', technique: 'Self-Mastery' }
    ],
    deepDive: '30 days of disciplined execution rewires identity. You are no longer someone hoping to improve—you are someone with proof of having done the reps.'
  }
];
