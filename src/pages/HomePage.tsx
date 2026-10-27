/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Network,
  Users,
  GitFork,
  Activity,
  Layers,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Share2,
  Workflow
} from 'lucide-react';
import { ActivePage } from '../components/Navbar';
import { NetworkData } from '../types/network';

interface HomePageProps {
  onNavigate: (page: ActivePage) => void;
  networkData: NetworkData | null;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, networkData }) => {
  const stats = networkData?.stats || {
    totalUsers: 18,
    totalFriendships: 27,
    averageDegree: 3.0,
    graphDensity: 0.176,
    connectedComponentsCount: 2,
    isolatedUsersCount: 0
  };

  const algorithmCards = [
    {
      title: 'Breadth-First Search (BFS)',
      badge: 'Shortest Distance & Separation',
      complexity: 'Time: O(V + E) | Space: O(V)',
      description:
        'Explores friends layer by layer (1st, 2nd, and 3rd degree). BFS guarantees the shortest friendship hop path and forms the foundation of modern recommendation engines.',
      icon: GitFork,
      color: 'from-blue-600 to-cyan-500',
      actionPage: 'algorithms' as ActivePage,
      realWorld: 'Powers LinkedIn "2nd & 3rd degree connections" and Facebook "People You May Know".'
    },
    {
      title: 'Depth-First Search (DFS)',
      badge: 'Path Exploration & Cycles',
      complexity: 'Time: O(V + E) | Space: O(V)',
      description:
        'Traverses deep down individual friendship trails before backtracking. Identifies closed social loops, verifies network connectivity, and detects community boundaries.',
      icon: Workflow,
      color: 'from-indigo-600 to-violet-600',
      actionPage: 'algorithms' as ActivePage,
      realWorld: 'Used in cycle detection, relationship triangulation, and cluster path tracing.'
    },
    {
      title: 'Degree Centrality',
      badge: 'Influence & Hub Metrics',
      complexity: 'C_D(v) = deg(v) / (N - 1)',
      description:
        'Quantifies a user’s social prominence and connectivity within the network by normalizing their degree against the theoretical maximum possible degree.',
      icon: Activity,
      color: 'from-purple-600 to-pink-600',
      actionPage: 'algorithms' as ActivePage,
      realWorld: 'Identifies super-connectors, campus influencers, and bridge individuals across departments.'
    },
    {
      title: 'Connected Components',
      badge: 'Community & Cluster Detection',
      complexity: 'O(V + E) via Disjoint Search',
      description:
        'Partitions the graph into isolated subgraphs with no inter-connecting edges. Proves how distinct groups or separate campus labs remain detached without social bridges.',
      icon: Layers,
      color: 'from-amber-500 to-orange-600',
      actionPage: 'algorithms' as ActivePage,
      realWorld: 'Reveals isolated student silos and prompts strategic bridging friend recommendations.'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          {/* Academic Banner Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-md">
            <GraduationCap className="w-4 h-4 text-indigo-300" />
            <span>DAA Mini Project • PRANITHA S S • Reg No: 711525BCS120</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Social Network <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300">
                Friend Recommendation System
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              An interactive simulation and algorithmic study demonstrating how graph traversal, centrality analysis, and mutual friend topology power recommendation engines in platforms like LinkedIn and Facebook.
            </p>
          </div>

          {/* Call to actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:translate-y-[-1px]"
            >
              <Network className="w-4 h-4" />
              Explore Network Graph
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('recommendations')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 backdrop-blur-md transition-all"
            >
              <Users className="w-4 h-4" />
              Generate Friend Recommendations
            </button>
            <button
              onClick={() => onNavigate('algorithms')}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-transparent hover:bg-white/5 text-indigo-200 hover:text-white font-medium text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              Run BFS & DFS Traversal
            </button>
          </div>

          {/* Quick Real-Time Metric Pills */}
          <div className="pt-6 border-t border-indigo-900/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold text-white font-mono">{stats.totalUsers}</div>
              <div className="text-xs text-indigo-200">Network Vertices (|V|)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">{stats.totalFriendships}</div>
              <div className="text-xs text-indigo-200">Friendship Edges (|E|)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">{stats.averageDegree}</div>
              <div className="text-xs text-indigo-200">Average Degree deg(v)</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white font-mono">{stats.connectedComponentsCount}</div>
              <div className="text-xs text-indigo-200">Connected Components</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Graph Concept & How It Works */}
      <section className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Algorithmic Recommendation Architecture
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              How the graph engine discovers candidates through multi-hop path traversal.
            </p>
          </div>
          <button
            onClick={() => onNavigate('dashboard')}
            className="self-start md:self-auto text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            Launch Live D3 Visualizer
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Step Diagram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
              1°
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Level 1: Direct Friends</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The source user’s immediate friendship circle (distance = 1). In the recommendation engine, direct friends are filtered out as they are already established connections.
            </p>
            <div className="text-[11px] font-mono text-indigo-700 bg-white/80 p-2 rounded-lg border border-indigo-200/60">
              dist(source, v) == 1 (Exclude from targets)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-violet-50/60 border border-violet-100 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center font-bold text-sm">
              2°
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Level 2: Friends of Friends (Primary)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Individuals sharing at least one mutual friend with the source user (distance = 2). Ranked highest because mutual friends establish high social trust and shared contexts.
            </p>
            <div className="text-[11px] font-mono text-violet-700 bg-white/80 p-2 rounded-lg border border-violet-200/60">
              Score = |Mutual(u, v)| × 22 + Interests
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              3°
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Level 3: Extended Network</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Users reachable via 3 hops. Recommended when shared departmental domains or strong matching academic interests exist, with a small distance penalty applied.
            </p>
            <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded-lg border border-slate-200">
              dist(source, v) == 3 (Degree penalty: -18)
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Algorithms Grid */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Core DAA Algorithms
          </div>
          <h2 className="text-2xl font-bold text-slate-900">
            Interactive Algorithmic Demonstrations
          </h2>
          <p className="text-sm text-slate-500">
            Explore deterministic step-by-step visualizations on real graph data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {algorithmCards.map((algo, idx) => {
            const Icon = algo.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${algo.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {algo.complexity}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {algo.title}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                      {algo.badge}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {algo.description}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-800">Application:</strong> {algo.realWorld}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate(algo.actionPage)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/btn"
                  >
                    Open Live Simulation
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <span className="text-[11px] text-slate-400">Step-by-step playback</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* College Project Meta Card */}
      <section className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-6 sm:p-8 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">
              Department of Computer Science & Engineering
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            DAA Mini Project Submission
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Prepared by <strong>PRANITHA S S</strong> (Register No: <strong>711525BCS120</strong>). Built according to standard graph theory models, verified time complexities, and full interactive visual inspection.
          </p>
        </div>

        <button
          onClick={() => onNavigate('about')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all shrink-0"
        >
          Read Complete DAA Project Report
        </button>
      </section>
    </div>
  );
};
