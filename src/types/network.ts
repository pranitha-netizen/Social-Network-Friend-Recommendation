/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  handle: string;
  role: string;
  department: string;
  avatar: string;
  color: string;
  bio: string;
  interests: string[];
}

export interface Friendship {
  id: string;
  source: string;
  target: string;
  establishedAt?: string;
}

export interface NetworkData {
  nodes: User[];
  edges: Friendship[];
  stats: {
    totalUsers: number;
    totalFriendships: number;
    averageDegree: number;
    graphDensity: number;
    connectedComponentsCount: number;
    isolatedUsersCount: number;
  };
}

export interface Recommendation {
  user: User;
  mutualFriends: User[];
  mutualFriendCount: number;
  degreeOfSeparation: number; // 2 or 3
  recommendationScore: number; // 0 to 100
  scoreBreakdown: {
    mutualFriendsScore: number;
    sharedInterestsScore: number;
    departmentBonus: number;
    degreePenalty: number;
  };
  explanation: string;
  sharedInterests: string[];
}

export interface BFSStep {
  stepIndex: number;
  currentNodeId: string;
  currentNodeName: string;
  queue: string[];
  visited: string[];
  discoveredEdge?: { source: string; target: string };
  currentLevel: number;
  description: string;
}

export interface BFSTraversalResult {
  sourceId: string;
  sourceUser: User;
  steps: BFSStep[];
  traversalOrder: string[];
  levels: { level: number; nodeIds: string[] }[];
  treeEdges: { source: string; target: string }[];
  totalVisited: number;
  unvisitedNodeIds: string[];
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface DFSStep {
  stepIndex: number;
  currentNodeId: string;
  currentNodeName: string;
  action: 'visit' | 'backtrack' | 'explore_neighbor';
  stack: string[];
  visited: string[];
  activeEdge?: { source: string; target: string };
  description: string;
}

export interface DFSTraversalResult {
  sourceId: string;
  sourceUser: User;
  steps: DFSStep[];
  traversalOrder: string[];
  treeEdges: { source: string; target: string }[];
  backtrackEdges: { source: string; target: string }[];
  totalVisited: number;
  unvisitedNodeIds: string[];
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface DegreeCentralityItem {
  user: User;
  rawDegree: number;
  normalizedCentrality: number; // rawDegree / (N - 1)
  rank: number;
  percentile: number;
}

export interface DegreeCentralityResult {
  centralities: DegreeCentralityItem[];
  maxDegreeUser: User;
  averageDegree: number;
  formula: string;
  academicExplanation: string;
}

export interface ConnectedComponent {
  componentId: number;
  name: string;
  color: string;
  nodeIds: string[];
  users: User[];
  edgeCount: number;
  density: number;
  isIsolated: boolean;
}

export interface ConnectedComponentsResult {
  totalComponents: number;
  components: ConnectedComponent[];
  largestComponentSize: number;
  explanation: string;
}
