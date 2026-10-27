/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  User,
  Friendship,
  NetworkData,
  Recommendation,
  BFSTraversalResult,
  BFSStep,
  DFSTraversalResult,
  DFSStep,
  DegreeCentralityResult,
  DegreeCentralityItem,
  ConnectedComponentsResult,
  ConnectedComponent
} from '../types/network';

// Default Academic Demonstration Dataset
export const INITIAL_USERS: User[] = [
  // --- Component 1: Main Engineering & Computing Network (13 users) ---
  {
    id: 'u1',
    name: 'Alice Chen',
    handle: '@alice_c',
    role: 'Lead Algo Researcher',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#3B82F6', // Blue
    bio: 'Passionate about Graph Theory, DAA, and high-performance algorithms.',
    interests: ['Graph Theory', 'Algorithms', 'Distributed Systems', 'C++']
  },
  {
    id: 'u2',
    name: 'Bob Martin',
    handle: '@bob_m',
    role: 'AI Engineer',
    department: 'Artificial Intelligence',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    color: '#8B5CF6', // Violet
    bio: 'Building neural architectures and exploring graph neural networks (GNNs).',
    interests: ['Algorithms', 'Deep Learning', 'Python', 'Graph Theory']
  },
  {
    id: 'u3',
    name: 'Charlie Diaz',
    handle: '@charlie_d',
    role: 'Security Analyst',
    department: 'Cyber Security',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    color: '#10B981', // Emerald
    bio: 'Exploring zero-trust network topologies and cryptography.',
    interests: ['Cryptography', 'Network Security', 'Distributed Systems', 'Linux']
  },
  {
    id: 'u4',
    name: 'Diana Prince',
    handle: '@diana_p',
    role: 'Data Scientist',
    department: 'Data Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    color: '#EC4899', // Pink
    bio: 'Extracting patterns from multi-dimensional social graph datasets.',
    interests: ['Data Mining', 'Python', 'Algorithms', 'Big Data']
  },
  {
    id: 'u5',
    name: 'Ethan Hunt',
    handle: '@ethan_h',
    role: 'Full Stack Architect',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    color: '#F59E0B', // Amber
    bio: 'Crafting responsive social platforms and distributed web services.',
    interests: ['Web Dev', 'TypeScript', 'Distributed Systems', 'Cloud']
  },
  {
    id: 'u6',
    name: 'Fiona Gallagher',
    handle: '@fiona_g',
    role: 'UX Researcher & Designer',
    department: 'Design & Media',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    color: '#6366F1', // Indigo
    bio: 'Bridging algorithmic power with intuitive human-computer interaction.',
    interests: ['UI/UX', 'Web Dev', 'Human Interaction', 'Design Systems']
  },
  {
    id: 'u7',
    name: 'George Clark',
    handle: '@george_c',
    role: 'NLP Researcher',
    department: 'Artificial Intelligence',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    color: '#8B5CF6',
    bio: 'Analyzing semantic knowledge graphs and large language interactions.',
    interests: ['Deep Learning', 'Python', 'Knowledge Graphs', 'Algorithms']
  },
  {
    id: 'u8',
    name: 'Hannah Abbott',
    handle: '@hannah_a',
    role: 'Ethical Hacker',
    department: 'Cyber Security',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    color: '#10B981',
    bio: 'Simulating graph attack vectors and defense algorithms.',
    interests: ['Network Security', 'Cryptography', 'Linux', 'Cloud']
  },
  {
    id: 'u9',
    name: 'Ian Wright',
    handle: '@ian_w',
    role: 'Big Data Engineer',
    department: 'Data Science',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    color: '#EC4899',
    bio: 'Optimizing Spark graph computation pipelines for social telemetry.',
    interests: ['Big Data', 'Distributed Systems', 'Data Mining', 'Python']
  },
  {
    id: 'u10',
    name: 'Julia Roberts',
    handle: '@julia_r',
    role: 'Cloud Architect',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    color: '#3B82F6',
    bio: 'Building resilient microservices and cloud topologies.',
    interests: ['Cloud', 'Distributed Systems', 'TypeScript', 'Web Dev']
  },
  {
    id: 'u11',
    name: 'Kevin Durant',
    handle: '@kevin_d',
    role: 'Product Visualizer',
    department: 'Design & Media',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    color: '#6366F1',
    bio: 'Visualizing complex multi-relational graphs for educational tools.',
    interests: ['Design Systems', 'UI/UX', 'Web Dev', 'Human Interaction']
  },
  {
    id: 'u12',
    name: 'Laura Croft',
    handle: '@laura_c',
    role: 'Competitive Programmer',
    department: 'Computer Science',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    color: '#3B82F6',
    bio: 'Grandmaster on Codeforces. Loves maximum flow and matching problems.',
    interests: ['Algorithms', 'C++', 'Graph Theory', 'Data Mining']
  },
  {
    id: 'u13',
    name: 'Michael Scott',
    handle: '@michael_s',
    role: 'Tech Community Manager',
    department: 'Information Tech',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    color: '#14B8A6',
    bio: 'Connecting tech student bodies, hackathons, and networking dinners.',
    interests: ['Human Interaction', 'Cloud', 'Design Systems', 'Web Dev']
  },

  // --- Component 2: Robotics & Hardware Lab Cluster (5 users - isolated component) ---
  {
    id: 'u14',
    name: 'Nathan Drake',
    handle: '@nathan_d',
    role: 'Robotics Team Lead',
    department: 'Robotics & Automation',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    color: '#EA580C', // Orange
    bio: 'Building autonomous quadrupeds and kinematics planners.',
    interests: ['Robotics', 'Embedded Systems', 'C++', 'Control Theory']
  },
  {
    id: 'u15',
    name: 'Olivia Wilde',
    handle: '@olivia_w',
    role: 'Embedded Firmware Dev',
    department: 'Robotics & Automation',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    color: '#EA580C',
    bio: 'Writing bare-metal drivers for STM32 and RTOS controllers.',
    interests: ['Embedded Systems', 'Robotics', 'C++', 'IoT']
  },
  {
    id: 'u16',
    name: 'Peter Parker',
    handle: '@peter_p',
    role: 'Sensors Specialist',
    department: 'Robotics & Automation',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    color: '#EA580C',
    bio: 'LiDAR, IMU fusion, and Kalman filter optimization.',
    interests: ['IoT', 'Control Theory', 'Robotics', 'Embedded Systems']
  },
  {
    id: 'u17',
    name: 'Quinn Fabray',
    handle: '@quinn_f',
    role: 'Computer Vision Engineer',
    department: 'Robotics & Automation',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    color: '#EA580C',
    bio: 'SLAM and real-time visual-inertial odometry.',
    interests: ['Control Theory', 'Robotics', 'C++', 'Deep Learning']
  },
  {
    id: 'u18',
    name: 'Rachel Green',
    handle: '@rachel_g',
    role: 'Bionics Researcher',
    department: 'Robotics & Automation',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&auto=format&fit=crop&q=80',
    color: '#EA580C',
    bio: 'Myoelectric prosthetic arms with high-precision tactile feedback.',
    interests: ['Robotics', 'IoT', 'Embedded Systems', 'Control Theory']
  }
];

export const INITIAL_FRIENDSHIPS: Friendship[] = [
  // --- Component 1 Friendships (Main Campus Hub) ---
  { id: 'f1', source: 'u1', target: 'u2', establishedAt: '2025-01-15' }, // Alice <-> Bob
  { id: 'f2', source: 'u1', target: 'u3', establishedAt: '2025-01-20' }, // Alice <-> Charlie
  { id: 'f3', source: 'u1', target: 'u4', establishedAt: '2025-02-01' }, // Alice <-> Diana
  { id: 'f4', source: 'u1', target: 'u12', establishedAt: '2025-02-10' }, // Alice <-> Laura
  { id: 'f5', source: 'u2', target: 'u4', establishedAt: '2025-02-14' }, // Bob <-> Diana
  { id: 'f6', source: 'u2', target: 'u7', establishedAt: '2025-02-18' }, // Bob <-> George
  { id: 'f7', source: 'u2', target: 'u5', establishedAt: '2025-02-22' }, // Bob <-> Ethan
  { id: 'f8', source: 'u3', target: 'u8', establishedAt: '2025-03-01' }, // Charlie <-> Hannah
  { id: 'f9', source: 'u3', target: 'u10', establishedAt: '2025-03-05' }, // Charlie <-> Julia
  { id: 'f10', source: 'u4', target: 'u9', establishedAt: '2025-03-10' }, // Diana <-> Ian
  { id: 'f11', source: 'u4', target: 'u7', establishedAt: '2025-03-12' }, // Diana <-> George
  { id: 'f12', source: 'u5', target: 'u6', establishedAt: '2025-03-15' }, // Ethan <-> Fiona
  { id: 'f13', source: 'u5', target: 'u10', establishedAt: '2025-03-18' }, // Ethan <-> Julia
  { id: 'f14', source: 'u6', target: 'u11', establishedAt: '2025-03-22' }, // Fiona <-> Kevin
  { id: 'f15', source: 'u6', target: 'u13', establishedAt: '2025-03-25' }, // Fiona <-> Michael
  { id: 'f16', source: 'u7', target: 'u9', establishedAt: '2025-04-01' }, // George <-> Ian
  { id: 'f17', source: 'u8', target: 'u10', establishedAt: '2025-04-05' }, // Hannah <-> Julia
  { id: 'f18', source: 'u10', target: 'u13', establishedAt: '2025-04-10' }, // Julia <-> Michael
  { id: 'f19', source: 'u11', target: 'u13', establishedAt: '2025-04-15' }, // Kevin <-> Michael
  { id: 'f20', source: 'u12', target: 'u2', establishedAt: '2025-04-20' }, // Laura <-> Bob
  { id: 'f21', source: 'u12', target: 'u3', establishedAt: '2025-04-25' }, // Laura <-> Charlie

  // --- Component 2 Friendships (Robotics Lab Cluster) ---
  { id: 'f22', source: 'u14', target: 'u15', establishedAt: '2025-02-10' }, // Nathan <-> Olivia
  { id: 'f23', source: 'u14', target: 'u16', establishedAt: '2025-02-12' }, // Nathan <-> Peter
  { id: 'f24', source: 'u14', target: 'u17', establishedAt: '2025-02-15' }, // Nathan <-> Quinn
  { id: 'f25', source: 'u15', target: 'u16', establishedAt: '2025-02-18' }, // Olivia <-> Peter
  { id: 'f26', source: 'u16', target: 'u18', establishedAt: '2025-02-20' }, // Peter <-> Rachel
  { id: 'f27', source: 'u17', target: 'u18', establishedAt: '2025-02-25' }  // Quinn <-> Rachel
];

export class GraphEngine {
  private users: Map<string, User> = new Map();
  private adjacency: Map<string, Set<string>> = new Map();
  private friendships: Friendship[] = [];

  constructor(initialUsers = INITIAL_USERS, initialEdges = INITIAL_FRIENDSHIPS) {
    this.reset(initialUsers, initialEdges);
  }

  public reset(users = INITIAL_USERS, edges = INITIAL_FRIENDSHIPS): void {
    this.users.clear();
    this.adjacency.clear();
    this.friendships = [];

    // Add nodes
    for (const u of users) {
      this.users.set(u.id, { ...u });
      this.adjacency.set(u.id, new Set<string>());
    }

    // Add edges
    for (const edge of edges) {
      if (this.users.has(edge.source) && this.users.has(edge.target)) {
        this.addFriendshipInternal(edge.source, edge.target, edge.id, edge.establishedAt);
      }
    }
  }

  private addFriendshipInternal(source: string, target: string, id?: string, establishedAt?: string): boolean {
    if (source === target) return false;
    if (!this.users.has(source) || !this.users.has(target)) return false;

    const sourceNeighbors = this.adjacency.get(source)!;
    const targetNeighbors = this.adjacency.get(target)!;

    if (sourceNeighbors.has(target)) return false; // Already friends

    sourceNeighbors.add(target);
    targetNeighbors.add(source);

    const edgeId = id || `f_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.friendships.push({
      id: edgeId,
      source,
      target,
      establishedAt: establishedAt || new Date().toISOString().split('T')[0]
    });

    return true;
  }

  public getUsers(): User[] {
    return Array.from(this.users.values());
  }

  public getUser(id: string): User | undefined {
    return this.users.get(id);
  }

  public getFriendships(): Friendship[] {
    return [...this.friendships];
  }

  public getNeighbors(userId: string): string[] {
    const set = this.adjacency.get(userId);
    return set ? Array.from(set) : [];
  }

  public areFriends(u1: string, u2: string): boolean {
    const neighbors = this.adjacency.get(u1);
    return neighbors ? neighbors.has(u2) : false;
  }

  public addUser(user: Omit<User, 'id'> & { id?: string }): { success: boolean; user?: User; error?: string } {
    const newId = user.id && !this.users.has(user.id) ? user.id : `u${this.users.size + 1}`;
    if (this.users.has(newId)) {
      return { success: false, error: `User ID "${newId}" already exists.` };
    }

    const newUser: User = {
      ...user,
      id: newId,
      handle: user.handle.startsWith('@') ? user.handle : `@${user.handle}`,
      avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`,
      color: user.color || '#6366F1'
    };

    this.users.set(newUser.id, newUser);
    this.adjacency.set(newUser.id, new Set<string>());

    return { success: true, user: newUser };
  }

  public addFriendship(sourceId: string, targetId: string): { success: boolean; friendship?: Friendship; error?: string } {
    if (sourceId === targetId) {
      return { success: false, error: 'Cannot create a self-loop friendship with oneself.' };
    }

    if (!this.users.has(sourceId) || !this.users.has(targetId)) {
      return { success: false, error: 'One or both users do not exist in the network.' };
    }

    if (this.areFriends(sourceId, targetId)) {
      return { success: false, error: 'A friendship between these two users already exists.' };
    }

    const success = this.addFriendshipInternal(sourceId, targetId);
    if (!success) {
      return { success: false, error: 'Failed to create friendship.' };
    }

    const last = this.friendships[this.friendships.length - 1];
    return { success: true, friendship: last };
  }

  public getNetworkData(): NetworkData {
    const users = this.getUsers();
    const totalUsers = users.length;
    const totalFriendships = this.friendships.length;

    let totalDegrees = 0;
    let isolatedCount = 0;

    for (const [_, neighbors] of this.adjacency.entries()) {
      totalDegrees += neighbors.size;
      if (neighbors.size === 0) isolatedCount++;
    }

    const averageDegree = totalUsers > 0 ? Number((totalDegrees / totalUsers).toFixed(2)) : 0;
    // Graph density for undirected graph: 2 * |E| / (|V| * (|V| - 1))
    const maxPossibleEdges = totalUsers > 1 ? (totalUsers * (totalUsers - 1)) / 2 : 1;
    const graphDensity = totalUsers > 1 ? Number((totalFriendships / maxPossibleEdges).toFixed(4)) : 0;

    const components = this.getConnectedComponents();

    return {
      nodes: users,
      edges: this.friendships,
      stats: {
        totalUsers,
        totalFriendships,
        averageDegree,
        graphDensity,
        connectedComponentsCount: components.totalComponents,
        isolatedUsersCount: isolatedCount
      }
    };
  }

  // --- Breadth-First Search (BFS) ---
  public runBFS(sourceId: string): BFSTraversalResult {
    const sourceUser = this.users.get(sourceId);
    if (!sourceUser) {
      throw new Error(`User with ID ${sourceId} not found.`);
    }

    const visited = new Set<string>();
    const queue: string[] = [];
    const distances = new Map<string, number>();
    const traversalOrder: string[] = [];
    const steps: BFSStep[] = [];
    const treeEdges: { source: string; target: string }[] = [];

    // Initialize BFS
    queue.push(sourceId);
    visited.add(sourceId);
    distances.set(sourceId, 0);

    let stepIndex = 0;
    steps.push({
      stepIndex: stepIndex++,
      currentNodeId: sourceId,
      currentNodeName: sourceUser.name,
      queue: [...queue],
      visited: Array.from(visited),
      currentLevel: 0,
      description: `Starting BFS at root node "${sourceUser.name}" (Level 0). Enqueued root.`
    });

    while (queue.length > 0) {
      const current = queue.shift()!;
      traversalOrder.push(current);
      const currUser = this.users.get(current)!;
      const currDist = distances.get(current)!;

      const neighbors = Array.from(this.adjacency.get(current) || []).sort();

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          distances.set(neighbor, currDist + 1);
          queue.push(neighbor);
          treeEdges.push({ source: current, target: neighbor });

          const neighborUser = this.users.get(neighbor)!;
          steps.push({
            stepIndex: stepIndex++,
            currentNodeId: neighbor,
            currentNodeName: neighborUser.name,
            queue: [...queue],
            visited: Array.from(visited),
            discoveredEdge: { source: current, target: neighbor },
            currentLevel: currDist + 1,
            description: `Discovered "${neighborUser.name}" from "${currUser.name}". Enqueued into Level ${currDist + 1}.`
          });
        }
      }
    }

    // Group nodes by level
    const levelMap = new Map<number, string[]>();
    for (const [nodeId, lvl] of distances.entries()) {
      if (!levelMap.has(lvl)) levelMap.set(lvl, []);
      levelMap.get(lvl)!.push(nodeId);
    }

    const levels = Array.from(levelMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([level, nodeIds]) => ({ level, nodeIds }));

    const unvisitedNodeIds = Array.from(this.users.keys()).filter(id => !visited.has(id));

    return {
      sourceId,
      sourceUser,
      steps,
      traversalOrder,
      levels,
      treeEdges,
      totalVisited: visited.size,
      unvisitedNodeIds,
      explanation: `BFS explores the social network frontier systematically layer-by-layer (Level 1: Direct friends, Level 2: Friends of friends, Level 3: Extended network). This guarantees finding the shortest connection path between any two individuals.`,
      timeComplexity: 'O(V + E) — Visiting each vertex and exploring every incident friendship edge once.',
      spaceComplexity: 'O(V) — Maintaining the FIFO queue and visited discovery hash set.'
    };
  }

  // --- Depth-First Search (DFS) ---
  public runDFS(sourceId: string): DFSTraversalResult {
    const sourceUser = this.users.get(sourceId);
    if (!sourceUser) {
      throw new Error(`User with ID ${sourceId} not found.`);
    }

    const visited = new Set<string>();
    const stack: string[] = [];
    const traversalOrder: string[] = [];
    const steps: DFSStep[] = [];
    const treeEdges: { source: string; target: string }[] = [];
    const backtrackEdges: { source: string; target: string }[] = [];

    let stepIndex = 0;

    const dfsRecursive = (u: string, parent?: string) => {
      visited.add(u);
      traversalOrder.push(u);
      stack.push(u);

      const uUser = this.users.get(u)!;
      if (parent) {
        treeEdges.push({ source: parent, target: u });
      }

      steps.push({
        stepIndex: stepIndex++,
        currentNodeId: u,
        currentNodeName: uUser.name,
        action: 'visit',
        stack: [...stack],
        visited: Array.from(visited),
        activeEdge: parent ? { source: parent, target: u } : undefined,
        description: parent
          ? `DFS traversed forward from "${this.users.get(parent)?.name}" to "${uUser.name}". Pushed to recursion stack.`
          : `Started DFS at initial vertex "${uUser.name}". Pushed to stack.`
      });

      const neighbors = Array.from(this.adjacency.get(u) || []).sort();

      for (const v of neighbors) {
        if (!visited.has(v)) {
          dfsRecursive(v, u);
        }
      }

      // Backtrack
      const popped = stack.pop();
      if (parent) {
        backtrackEdges.push({ source: u, target: parent });
        steps.push({
          stepIndex: stepIndex++,
          currentNodeId: u,
          currentNodeName: uUser.name,
          action: 'backtrack',
          stack: [...stack],
          visited: Array.from(visited),
          activeEdge: { source: u, target: parent },
          description: `All adjacent neighbors of "${uUser.name}" explored. Backtracking back to "${this.users.get(parent)?.name}". Popped from stack.`
        });
      }
    };

    dfsRecursive(sourceId);

    const unvisitedNodeIds = Array.from(this.users.keys()).filter(id => !visited.has(id));

    return {
      sourceId,
      sourceUser,
      steps,
      traversalOrder,
      treeEdges,
      backtrackEdges,
      totalVisited: visited.size,
      unvisitedNodeIds,
      explanation: `DFS explores deep along individual friendship chains before backtracking. In social networks, DFS is instrumental for finding community cycles, verifying network biconnectivity, and tracing deep conversational branches.`,
      timeComplexity: 'O(V + E) — Linear time exploration of vertices and edges.',
      spaceComplexity: 'O(V) — Call stack depth bounded by the longest simple path in the graph.'
    };
  }

  // --- Degree Centrality ---
  public getDegreeCentrality(): DegreeCentralityResult {
    const users = this.getUsers();
    const N = users.length;
    const denominator = N > 1 ? N - 1 : 1;

    const items: DegreeCentralityItem[] = users.map(user => {
      const neighbors = this.adjacency.get(user.id) || new Set();
      const rawDegree = neighbors.size;
      const normalizedCentrality = Number((rawDegree / denominator).toFixed(4));
      return {
        user,
        rawDegree,
        normalizedCentrality,
        rank: 0,
        percentile: 0
      };
    });

    // Sort descending by degree, then by name
    items.sort((a, b) => b.rawDegree - a.rawDegree || a.user.name.localeCompare(b.user.name));

    // Assign rank and percentile
    const maxDegree = items[0]?.rawDegree || 0;
    items.forEach((item, index) => {
      item.rank = index + 1;
      item.percentile = maxDegree > 0 ? Number(((item.rawDegree / maxDegree) * 100).toFixed(1)) : 0;
    });

    const totalDegrees = items.reduce((acc, curr) => acc + curr.rawDegree, 0);
    const averageDegree = N > 0 ? Number((totalDegrees / N).toFixed(2)) : 0;

    return {
      centralities: items,
      maxDegreeUser: items[0]?.user || users[0],
      averageDegree,
      formula: 'C_D(v) = deg(v) / (N - 1)',
      academicExplanation: `Degree Centrality quantifies how connected an individual is by measuring their direct edge incident count deg(v), normalized by the maximum possible connections in an N-node network (N - 1). Users with peak degree centrality act as vital social hubs and information broadcasters.`
    };
  }

  // --- Connected Components ---
  public getConnectedComponents(): ConnectedComponentsResult {
    const visited = new Set<string>();
    const components: ConnectedComponent[] = [];
    const componentColors = ['#4F46E5', '#EA580C', '#059669', '#DB2777', '#7C3AED', '#2563EB'];

    const userIds = Array.from(this.users.keys()).sort();

    let compId = 1;
    for (const uid of userIds) {
      if (!visited.has(uid)) {
        // Run BFS to collect all reachable nodes in this component
        const compNodeIds: string[] = [];
        const queue: string[] = [uid];
        visited.add(uid);

        while (queue.length > 0) {
          const curr = queue.shift()!;
          compNodeIds.push(curr);

          const neighbors = this.adjacency.get(curr) || new Set();
          for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push(neighbor);
            }
          }
        }

        // Count internal edges for this component
        let internalEdges = 0;
        const compSet = new Set(compNodeIds);
        for (const edge of this.friendships) {
          if (compSet.has(edge.source) && compSet.has(edge.target)) {
            internalEdges++;
          }
        }

        const size = compNodeIds.length;
        const maxPossible = size > 1 ? (size * (size - 1)) / 2 : 1;
        const density = size > 1 ? Number((internalEdges / maxPossible).toFixed(3)) : 0;

        const isIsolated = size === 1;
        const color = componentColors[(compId - 1) % componentColors.length];

        const usersInComp = compNodeIds.map(id => this.users.get(id)!).sort((a, b) => a.name.localeCompare(b.name));

        const compName = isIsolated
          ? `Isolated Individual: ${usersInComp[0].name}`
          : compId === 1
          ? `Primary Campus Network (${size} Members)`
          : `Cluster ${compId}: Robotics & Autonomous Lab (${size} Members)`;

        components.push({
          componentId: compId++,
          name: compName,
          color,
          nodeIds: compNodeIds,
          users: usersInComp,
          edgeCount: internalEdges,
          density,
          isIsolated
        });
      }
    }

    // Sort components by size descending
    components.sort((a, b) => b.nodeIds.length - a.nodeIds.length);

    return {
      totalComponents: components.length,
      components,
      largestComponentSize: components[0]?.nodeIds.length || 0,
      explanation: `Connected Components are maximal subgraphs wherein every pair of vertices is connected to each other through paths. In social network analysis, disconnected components identify isolated social silos or external labs where information cannot circulate without bridge relationships.`
    };
  }

  // --- Friend Recommendation Engine ---
  public getRecommendations(sourceId: string): Recommendation[] {
    const sourceUser = this.users.get(sourceId);
    if (!sourceUser) {
      throw new Error(`User with ID ${sourceId} not found.`);
    }

    const directFriends = this.adjacency.get(sourceId) || new Set<string>();

    // Run BFS from sourceId to determine degree of separation (shortest path)
    const distances = new Map<string, number>();
    const queue: string[] = [sourceId];
    distances.set(sourceId, 0);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const currDist = distances.get(curr)!;
      if (currDist >= 3) continue; // Only explore up to 3rd degree

      const neighbors = this.adjacency.get(curr) || new Set();
      for (const neighbor of neighbors) {
        if (!distances.has(neighbor)) {
          distances.set(neighbor, currDist + 1);
          queue.push(neighbor);
        }
      }
    }

    const recommendations: Recommendation[] = [];

    // Consider all nodes at distance 2 and 3 (excluding self and direct friends)
    for (const [candidateId, dist] of distances.entries()) {
      if (candidateId === sourceId) continue;
      if (dist < 2 || dist > 3) continue;
      if (directFriends.has(candidateId)) continue; // Direct friend

      const candidateUser = this.users.get(candidateId);
      if (!candidateUser) continue;

      const candidateNeighbors = this.adjacency.get(candidateId) || new Set<string>();

      // Compute mutual friends (intersection of neighbors)
      const mutualFriendIds: string[] = [];
      for (const fId of directFriends) {
        if (candidateNeighbors.has(fId)) {
          mutualFriendIds.push(fId);
        }
      }

      const mutualFriends = mutualFriendIds.map(id => this.users.get(id)!).filter(Boolean);
      const mutualFriendCount = mutualFriends.length;

      // Compute shared interests
      const sourceInterests = new Set(sourceUser.interests.map(i => i.toLowerCase()));
      const sharedInterests = candidateUser.interests.filter(i => sourceInterests.has(i.toLowerCase()));

      // Academic Scoring Formulation:
      // Score = (Mutual Friends * 20) + (Shared Interests * 10) + (Dept Match Bonus: 12) - (Degree 3 Penalty: 18)
      const mutualFriendsScore = mutualFriendCount * 22;
      const sharedInterestsScore = sharedInterests.length * 9;
      const departmentBonus = sourceUser.department === candidateUser.department ? 12 : 0;
      const degreePenalty = dist === 3 ? 18 : 0;

      let rawScore = 20 + mutualFriendsScore + sharedInterestsScore + departmentBonus - degreePenalty;
      const recommendationScore = Math.min(99, Math.max(15, rawScore));

      // Build academic explanation
      let explanationParts: string[] = [];
      if (mutualFriendCount > 0) {
        const topNames = mutualFriends.slice(0, 2).map(m => m.name).join(', ');
        const othersCount = mutualFriends.length - 2;
        const othersText = othersCount > 0 ? ` and ${othersCount} other${othersCount > 1 ? 's' : ''}` : '';
        explanationParts.push(`${mutualFriendCount} mutual friend${mutualFriendCount > 1 ? 's' : ''} (${topNames}${othersText})`);
      } else {
        explanationParts.push(`Connected through extended network (${dist}rd degree path)`);
      }

      if (sharedInterests.length > 0) {
        explanationParts.push(`Shared interests in ${sharedInterests.join(', ')}`);
      }

      if (sourceUser.department === candidateUser.department) {
        explanationParts.push(`Both in ${sourceUser.department}`);
      }

      const explanation = explanationParts.join(' • ') || `Second-degree connection in campus network.`;

      recommendations.push({
        user: candidateUser,
        mutualFriends,
        mutualFriendCount,
        degreeOfSeparation: dist,
        recommendationScore,
        scoreBreakdown: {
          mutualFriendsScore,
          sharedInterestsScore,
          departmentBonus,
          degreePenalty
        },
        explanation,
        sharedInterests
      });
    }

    // Sort by recommendation score descending, then by mutual friend count descending
    recommendations.sort((a, b) => b.recommendationScore - a.recommendationScore || b.mutualFriendCount - a.mutualFriendCount);

    return recommendations;
  }
}

// Global engine instance for dev/client use
export const defaultGraphEngine = new GraphEngine();
