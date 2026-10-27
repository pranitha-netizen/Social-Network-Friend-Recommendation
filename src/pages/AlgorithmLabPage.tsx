/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  Friendship,
  BFSTraversalResult,
  DFSTraversalResult,
  DegreeCentralityResult,
  ConnectedComponentsResult
} from '../types/network';
import { apiClient } from '../services/apiClient';
import { NetworkGraph, GraphViewMode } from '../components/NetworkGraph';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  GitBranch,
  Workflow,
  Activity,
  Layers,
  Sparkles,
  Info,
  Clock,
  Award,
  Link
} from 'lucide-react';

interface AlgorithmLabPageProps {
  users: User[];
  edges: Friendship[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onBridgeCreated?: () => void;
}

type AlgorithmTab = 'bfs' | 'dfs' | 'centrality' | 'components';

export const AlgorithmLabPage: React.FC<AlgorithmLabPageProps> = ({
  users,
  edges,
  selectedUser,
  onSelectUser,
  onBridgeCreated
}) => {
  const [activeTab, setActiveTab] = useState<AlgorithmTab>('bfs');

  // BFS states
  const [bfsResult, setBfsResult] = useState<BFSTraversalResult | null>(null);
  const [bfsCurrentStepIndex, setBfsCurrentStepIndex] = useState<number>(0);
  const [isBfsPlaying, setIsBfsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000);

  // DFS states
  const [dfsResult, setDfsResult] = useState<DFSTraversalResult | null>(null);
  const [dfsCurrentStepIndex, setDfsCurrentStepIndex] = useState<number>(0);
  const [isDfsPlaying, setIsDfsPlaying] = useState<boolean>(false);

  // Centrality states
  const [centralityResult, setCentralityResult] = useState<DegreeCentralityResult | null>(null);
  const [centralitySortBy, setCentralitySortBy] = useState<'degree' | 'name'>('degree');

  // Components states
  const [componentsResult, setComponentsResult] = useState<ConnectedComponentsResult | null>(null);

  const activeUser = selectedUser || users[0] || null;

  // Load BFS
  const loadBFS = async (userId: string) => {
    try {
      const data = await apiClient.getBFS(userId);
      setBfsResult(data);
      setBfsCurrentStepIndex(0);
      setIsBfsPlaying(false);
    } catch (err) {
      console.error('Failed to load BFS:', err);
    }
  };

  // Load DFS
  const loadDFS = async (userId: string) => {
    try {
      const data = await apiClient.getDFS(userId);
      setDfsResult(data);
      setDfsCurrentStepIndex(0);
      setIsDfsPlaying(false);
    } catch (err) {
      console.error('Failed to load DFS:', err);
    }
  };

  // Load Centrality
  const loadCentrality = async () => {
    try {
      const data = await apiClient.getCentrality();
      setCentralityResult(data);
    } catch (err) {
      console.error('Failed to load Centrality:', err);
    }
  };

  // Load Components
  const loadComponents = async () => {
    try {
      const data = await apiClient.getComponents();
      setComponentsResult(data);
    } catch (err) {
      console.error('Failed to load Components:', err);
    }
  };

  useEffect(() => {
    if (activeUser) {
      if (activeTab === 'bfs') loadBFS(activeUser.id);
      if (activeTab === 'dfs') loadDFS(activeUser.id);
    }
    if (activeTab === 'centrality') loadCentrality();
    if (activeTab === 'components') loadComponents();
  }, [activeTab, activeUser?.id]);

  // BFS Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isBfsPlaying && bfsResult) {
      interval = setInterval(() => {
        setBfsCurrentStepIndex(prev => {
          if (prev >= bfsResult.steps.length - 1) {
            setIsBfsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBfsPlaying, bfsResult, playbackSpeed]);

  // DFS Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isDfsPlaying && dfsResult) {
      interval = setInterval(() => {
        setDfsCurrentStepIndex(prev => {
          if (prev >= dfsResult.steps.length - 1) {
            setIsDfsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDfsPlaying, dfsResult, playbackSpeed]);

  const graphViewMode: GraphViewMode =
    activeTab === 'bfs'
      ? 'bfs'
      : activeTab === 'dfs'
      ? 'dfs'
      : activeTab === 'centrality'
      ? 'centrality'
      : 'components';

  const currentBfsStep = bfsResult?.steps[bfsCurrentStepIndex];
  const currentDfsStep = dfsResult?.steps[dfsCurrentStepIndex];

  const centralityRanksMap = React.useMemo(() => {
    if (!centralityResult) return undefined;
    const map = new Map<string, { rank: number; normalized: number; rawDegree: number }>();
    centralityResult.centralities.forEach(c => {
      map.set(c.user.id, {
        rank: c.rank,
        normalized: c.normalizedCentrality,
        rawDegree: c.rawDegree
      });
    });
    return map;
  }, [centralityResult]);

  const componentGroupsMap = React.useMemo(() => {
    if (!componentsResult) return undefined;
    const map = new Map<string, { componentId: number; color: string; name: string }>();
    componentsResult.components.forEach(comp => {
      comp.nodeIds.forEach(id => {
        map.set(id, {
          componentId: comp.componentId,
          color: comp.color,
          name: comp.name
        });
      });
    });
    return map;
  }, [componentsResult]);

  const handleBridgeComponents = async () => {
    if (!componentsResult || componentsResult.components.length < 2) return;
    const comp1User = componentsResult.components[0].nodeIds[0];
    const comp2User = componentsResult.components[1].nodeIds[0];
    try {
      await apiClient.addFriendship(comp1User, comp2User);
      await loadComponents();
      if (onBridgeCreated) onBridgeCreated();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
              Interactive Algorithm Lab
            </span>
            <span className="text-xs text-slate-400">• Design and Analysis of Algorithms</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            DAA Graph Algorithm Workbench
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Step through deterministic graph traversals, inspect memory queues & stacks, and evaluate network topology metrics.
          </p>
        </div>

        {/* Source user dropdown (for BFS/DFS) */}
        {(activeTab === 'bfs' || activeTab === 'dfs') && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-medium">Root Node:</span>
            <select
              value={activeUser?.id || ''}
              onChange={(e) => {
                const u = users.find(x => x.id === e.target.value);
                if (u) onSelectUser(u);
              }}
              className="bg-indigo-50/80 border border-indigo-200 text-indigo-950 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.department})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('bfs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'bfs'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitBranch className="w-4 h-4 text-blue-600" />
          1. Breadth-First Search (BFS)
        </button>

        <button
          onClick={() => setActiveTab('dfs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'dfs'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Workflow className="w-4 h-4 text-violet-600" />
          2. Depth-First Search (DFS)
        </button>

        <button
          onClick={() => setActiveTab('centrality')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'centrality'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-purple-600" />
          3. Degree Centrality
        </button>

        <button
          onClick={() => setActiveTab('components')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === 'components'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-amber-600" />
          4. Connected Components
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Visualization View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <NetworkGraph
            nodes={users}
            edges={edges}
            selectedUserId={activeUser?.id}
            onSelectUser={onSelectUser}
            viewMode={graphViewMode}
            bfsLevels={activeTab === 'bfs' ? bfsResult?.levels : undefined}
            activeStepNodeId={
              activeTab === 'bfs'
                ? currentBfsStep?.currentNodeId
                : activeTab === 'dfs'
                ? currentDfsStep?.currentNodeId
                : undefined
            }
            activeStepEdge={
              activeTab === 'bfs'
                ? currentBfsStep?.discoveredEdge
                : activeTab === 'dfs'
                ? currentDfsStep?.activeEdge
                : undefined
            }
            centralityRanks={centralityRanksMap}
            componentGroups={componentGroupsMap}
          />
        </div>

        {/* Right Algorithm Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* TAB 1: BFS */}
          {activeTab === 'bfs' && bfsResult && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-blue-600" />
                    BFS Traversal Playback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Root: <strong>{bfsResult.sourceUser.name}</strong> • Discovered: {bfsResult.totalVisited}/{users.length} nodes
                  </p>
                </div>
                <span className="font-mono text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md">
                  Step {bfsCurrentStepIndex + 1} of {bfsResult.steps.length}
                </span>
              </div>

              {/* Playback Controls */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsBfsPlaying(!isBfsPlaying)}
                      className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      {isBfsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isBfsPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsBfsPlaying(false);
                        setBfsCurrentStepIndex(prev => Math.min(prev + 1, bfsResult.steps.length - 1));
                      }}
                      disabled={bfsCurrentStepIndex >= bfsResult.steps.length - 1}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-40"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsBfsPlaying(false);
                        setBfsCurrentStepIndex(0);
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3 h-3" />
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="bg-white border border-slate-200 text-slate-700 rounded-md px-1.5 py-0.5 text-[11px]"
                    >
                      <option value={1500}>0.7x</option>
                      <option value={1000}>1.0x</option>
                      <option value={500}>2.0x</option>
                    </select>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-200"
                    style={{
                      width: `${((bfsCurrentStepIndex + 1) / bfsResult.steps.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Active Step State: Queue & Visited */}
              <div className="space-y-3">
                <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-950 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-blue-900">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Step Description:
                  </div>
                  <p className="leading-relaxed">
                    {currentBfsStep?.description}
                  </p>
                </div>

                {/* Queue State */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>FIFO Queue State:</span>
                    <span className="font-mono text-[10px] text-indigo-600 font-semibold">
                      [{currentBfsStep?.queue.length} elements]
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap gap-1.5 min-h-[42px] items-center">
                    {currentBfsStep?.queue.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Queue is empty</span>
                    ) : (
                      currentBfsStep?.queue.map((nodeId, idx) => {
                        const u = users.find(x => x.id === nodeId);
                        return (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold border ${
                              idx === 0
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-white text-slate-700 border-slate-200'
                            }`}
                          >
                            {idx === 0 ? 'Front: ' : ''}
                            {u?.name.split(' ')[0]}
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Level Breakdown */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Discovered Separation Levels:
                  </div>
                  <div className="space-y-1">
                    {bfsResult.levels.map(lvl => (
                      <div
                        key={lvl.level}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <span className="font-semibold text-slate-700">
                          {lvl.level === 0
                            ? 'Root (0 hops)'
                            : lvl.level === 1
                            ? '1st Degree (Direct Friends)'
                            : lvl.level === 2
                            ? '2nd Degree (Friends of Friends)'
                            : `${lvl.level}rd Degree (Extended Network)`}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {lvl.nodeIds.length} user{lvl.nodeIds.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Complexity Box */}
              <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800">Academic Relevance:</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  BFS guarantees finding potential friends in order of shortest path distance.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono mt-2">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <strong>Time:</strong> {bfsResult.timeComplexity}
                  </div>
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <strong>Space:</strong> {bfsResult.spaceComplexity}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DFS */}
          {activeTab === 'dfs' && dfsResult && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-violet-600" />
                    DFS Traversal & Stack Playback
                  </h3>
                  <p className="text-xs text-slate-500">
                    Source: <strong>{dfsResult.sourceUser.name}</strong> • Backtracking Enabled
                  </p>
                </div>
                <span className="font-mono text-xs bg-violet-50 text-violet-700 font-bold px-2 py-0.5 rounded-md">
                  Step {dfsCurrentStepIndex + 1} of {dfsResult.steps.length}
                </span>
              </div>

              {/* Playback Controls */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsDfsPlaying(!isDfsPlaying)}
                      className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      {isDfsPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isDfsPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDfsPlaying(false);
                        setDfsCurrentStepIndex(prev => Math.min(prev + 1, dfsResult.steps.length - 1));
                      }}
                      disabled={dfsCurrentStepIndex >= dfsResult.steps.length - 1}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold disabled:opacity-40"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setIsDfsPlaying(false);
                        setDfsCurrentStepIndex(0);
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="text-[11px] font-bold text-violet-600">
                    Action: {currentDfsStep?.action.toUpperCase()}
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-violet-600 h-1.5 rounded-full transition-all duration-200"
                    style={{
                      width: `${((dfsCurrentStepIndex + 1) / dfsResult.steps.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Step Description */}
              <div className="bg-violet-50/70 border border-violet-100 rounded-xl p-3 text-xs text-violet-950 space-y-1">
                <div className="font-bold flex items-center gap-1 text-violet-900">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  DFS Step Log:
                </div>
                <p className="leading-relaxed">
                  {currentDfsStep?.description}
                </p>
              </div>

              {/* LIFO Stack */}
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                  <span>Call Stack (LIFO):</span>
                  <span className="font-mono text-[10px] text-violet-600 font-semibold">
                    Depth: {currentDfsStep?.stack.length}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col gap-1 max-h-36 overflow-y-auto">
                  {currentDfsStep?.stack.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">Call stack empty</span>
                  ) : (
                    currentDfsStep?.stack.map((nodeId, idx) => {
                      const u = users.find(x => x.id === nodeId);
                      const isTop = idx === currentDfsStep.stack.length - 1;
                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between px-2.5 py-1 rounded-md text-xs font-mono font-semibold border ${
                            isTop
                              ? 'bg-violet-600 text-white border-violet-700'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <span>{isTop ? '▶ TOP: ' : '  '} {u?.name}</span>
                          <span className="text-[10px] opacity-80">{u?.department}</span>
                        </div>
                      );
                    }).reverse()
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-800">Academic Relevance:</div>
                <p className="text-slate-500 leading-relaxed text-[11px]">
                  DFS explores paths deeply before backtracking, useful for cycle detection and connectivity validation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: CENTRALITY */}
          {activeTab === 'centrality' && centralityResult && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    Degree Centrality C_D(v)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Highest Hub: <strong>{centralityResult.maxDegreeUser.name}</strong> • Formula: {centralityResult.formula}
                  </p>
                </div>
                <div className="flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
                  <button
                    onClick={() => setCentralitySortBy('degree')}
                    className={`px-2 py-0.5 rounded-md ${
                      centralitySortBy === 'degree' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    By Degree
                  </button>
                  <button
                    onClick={() => setCentralitySortBy('name')}
                    className={`px-2 py-0.5 rounded-md ${
                      centralitySortBy === 'name' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    By Name
                  </button>
                </div>
              </div>

              <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-purple-950 space-y-1">
                <div className="font-bold text-purple-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  What is Degree Centrality?
                </div>
                <p className="leading-relaxed text-[11px]">
                  {centralityResult.academicExplanation}
                </p>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {[...centralityResult.centralities]
                  .sort((a, b) =>
                    centralitySortBy === 'degree'
                      ? b.rawDegree - a.rawDegree
                      : a.user.name.localeCompare(b.user.name)
                  )
                  .map((item) => (
                    <div
                      key={item.user.id}
                      onClick={() => onSelectUser(item.user)}
                      className="p-2.5 rounded-xl border border-slate-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              item.rank === 1
                                ? 'bg-amber-400 text-amber-950 shadow-xs'
                                : item.rank <= 3
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                            {item.user.name}
                          </span>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            {item.user.department}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-600 font-semibold">{item.rawDegree} edges</span>
                          <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            {item.normalizedCentrality}
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentile}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: COMPONENTS */}
          {activeTab === 'components' && componentsResult && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Connected Components Partitioning
                  </h3>
                  <p className="text-xs text-slate-500">
                    Found <strong>{componentsResult.totalComponents}</strong> disjoint subgraphs
                  </p>
                </div>

                {componentsResult.totalComponents > 1 && (
                  <button
                    onClick={handleBridgeComponents}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition-colors"
                  >
                    <Link className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bridge Components</span>
                  </button>
                )}
              </div>

              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-xs text-amber-950 space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-amber-600" />
                  Academic Definition:
                </div>
                <p className="leading-relaxed text-[11px]">
                  {componentsResult.explanation}
                </p>
              </div>

              <div className="space-y-3">
                {componentsResult.components.map((comp) => (
                  <div
                    key={comp.componentId}
                    className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shadow-xs"
                          style={{ backgroundColor: comp.color }}
                        />
                        <span className="font-bold text-slate-900 text-xs">{comp.name}</span>
                      </div>
                      <span className="font-mono text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                        {comp.nodeIds.length} Vertices • {comp.edgeCount} Edges
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Subgraph Density: <strong className="font-mono text-slate-800">{comp.density}</strong></span>
                      <span>Status: {comp.isIsolated ? 'Isolated Node' : 'Connected Sub-Network'}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {comp.users.map(u => (
                        <div
                          key={u.id}
                          onClick={() => onSelectUser(u)}
                          className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg text-[10px] font-semibold text-slate-700 hover:border-indigo-400 cursor-pointer shadow-xs"
                        >
                          <img src={u.avatar} alt={u.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{u.name.split(' ')[0]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
