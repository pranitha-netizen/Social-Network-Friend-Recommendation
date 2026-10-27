/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Code2,
  Workflow,
  GitBranch,
  Activity,
  Layers,
  Sparkles,
  CheckCircle2,
  Share2,
  Cpu,
  ShieldAlert,
  Rocket
} from 'lucide-react';

export const AboutProjectPage: React.FC = () => {
  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Academic Header Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-indigo-900/40 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-indigo-300" />
          <span>Academic Project Report • Course: Design and Analysis of Algorithms (DAA)</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Social Network Friend Recommendation
        </h1>

        {/* Student Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-indigo-900/60 text-xs">
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">Student Name</span>
            <strong className="text-white text-sm font-bold">PRANITHA S S</strong>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">Register Number</span>
            <strong className="text-white text-sm font-mono font-bold">711525BCS120</strong>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
            <span className="text-slate-400 block text-[11px]">Project Category</span>
            <strong className="text-indigo-300 text-sm font-bold">Graphs & Networks</strong>
          </div>
        </div>
      </section>

      {/* 1. Problem Statement & Objectives */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            1. Problem Statement & Motivation
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            In modern online social networks (OSNs) containing millions of active participants, users frequently encounter cold-start disconnects and experience friction discovering relevant professional peers or classmates. Platforms like LinkedIn, Facebook, and Instagram rely critically on graph-theoretic link prediction and graph traversal algorithms to surface high-affinity recommendations known as <em>"People You May Know"</em>.
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Without automated graph-based recommendation systems, social networks remain fragmented, graph density stagnates, and user retention drops. The fundamental algorithmic challenge is to explore the graph frontier efficiently, identify candidates at degree 2 and 3 of separation, and rank them using quantifiable topological features (mutual friends, Jaccard coefficients, and shared contextual attributes) without exhaustive O(V!) combinatorial searches.
          </p>
        </div>

        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Project Objectives</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Simulate an undirected social graph G = (V, E) with realistic student & researcher profiles.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Implement level-synchronized Breadth-First Search (BFS) to identify 2nd and 3rd degree connections.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Implement Depth-First Search (DFS) with backtracking to explore path connectivity and cycles.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Calculate normalized Degree Centrality C_D(v) to identify network hubs and key connectors.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Detect Connected Components to uncover disconnected departmental clusters and isolated nodes.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Render interactive force-directed graph physics using D3.js with dynamic node/edge mutations.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 2. Algorithmic Formulations & Complexity Analysis */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Workflow className="w-5 h-5 text-indigo-600" />
          2. Algorithms Used & Complexity Analysis
        </h2>

        {/* Complexity Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold">
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Primary Role</th>
                <th className="py-2.5 px-3">Time Complexity</th>
                <th className="py-2.5 px-3">Space Complexity</th>
                <th className="py-2.5 px-3">Data Structure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Breadth-First Search (BFS)</td>
                <td className="py-2.5 px-3">Level-by-level frontier exploration & shortest hop distance</td>
                <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">FIFO Queue + Visited Set</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Depth-First Search (DFS)</td>
                <td className="py-2.5 px-3">Deep path traversal, cycle detection, biconnectivity</td>
                <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">LIFO Call Stack</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Degree Centrality</td>
                <td className="py-2.5 px-3">Hub & influencer identification via normalized degrees</td>
                <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">Adjacency List Degree Array</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Connected Components</td>
                <td className="py-2.5 px-3">Partitioning graph into maximal connected subgraphs</td>
                <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">O(V + E)</td>
                <td className="py-2.5 px-3 font-mono">O(V)</td>
                <td className="py-2.5 px-3">Disjoint Traversal / Forest</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900">Friend Recommendation</td>
                <td className="py-2.5 px-3">Heuristic link scoring based on mutual neighbors & interests</td>
                <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">O(deg(u) · avg_deg)</td>
                <td className="py-2.5 px-3 font-mono">O(candidates)</td>
                <td className="py-2.5 px-3">Candidate Map & Priority Queue</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Detailed Algorithm Deep Dives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-blue-600" />
              BFS Traversal & Level Separation Logic
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              BFS maintains an array <code>distances[v]</code> and a FIFO queue <code>Q</code>. Enqueuing starts at source <code>s</code> with <code>distances[s] = 0</code>. For every vertex popped, adjacent unvisited neighbors are assigned <code>distances[v] = distances[u] + 1</code>. Nodes with <code>distances[v] == 2</code> represent Friends of Friends (FoF), and <code>distances[v] == 3</code> represent extended contacts.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" />
              Degree Centrality Mathematical Formulation
            </h4>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Degree Centrality is defined as:
              <br />
              <code className="font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1 inline-block">
                C_D(v) = deg(v) / (N - 1)
              </code>
              <br />
              Where <code>deg(v)</code> is the degree of vertex <code>v</code>, and <code>N</code> is the total number of vertices in the network. A normalized score of 1.0 represents a vertex connected to every other member.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Technology Stack & Implementation Architecture */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-indigo-600" />
          3. Technology Stack & Implementation
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Frontend Framework</span>
            <p className="text-slate-500">React 19, TypeScript, and modern functional components with memoization.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Interactive Visuals</span>
            <p className="text-slate-500">D3.js (Force-Directed Simulation, d3.zoom, collision physics, SVG filters).</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Styling Architecture</span>
            <p className="text-slate-500">Tailwind CSS v4 with custom navy, violet, and soft purple academic palette.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="font-bold text-slate-900 block">Backend & Graph API</span>
            <p className="text-slate-500">Graph Theory REST API providing BFS, DFS, Centrality, and Recommendation endpoints.</p>
          </div>
        </div>
      </section>

      {/* 4. Real-World Applications & Comparison */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-600" />
          4. Real-World Applications in Industry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
            <span className="font-bold text-blue-950 block text-sm">LinkedIn</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Classifies network relationships explicitly into 1st, 2nd, and 3rd degree connections using BFS distance bounds. Displays "X mutual connections" as social proof.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-2">
            <span className="font-bold text-indigo-950 block text-sm">Facebook (Meta)</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Calculates "People You May Know" via triangle-closing heuristics, Jaccard similarity of friend lists, and community affiliation clustering.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
            <span className="font-bold text-purple-950 block text-sm">X (Twitter)</span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Uses SimRank and Random Walk with Restart (RWR) graph algorithms to surface accounts followed by influential accounts you follow.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Limitations & Future Scope */}
      <section className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-indigo-600" />
          5. Limitations & Future Scope
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 space-y-2">
            <span className="font-bold text-rose-950 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Current Limitations
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li>Graph is currently undirected and unweighted (all friendships have uniform weight).</li>
              <li>Calculations run in real-time memory rather than distributed graph frameworks (e.g., Apache Spark GraphX).</li>
              <li>Temporal decay (recent interactions carrying higher weight) is not modeled.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <span className="font-bold text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Future Scope & Enhancements
            </span>
            <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
              <li>Weighted edges modeling interaction frequency (chat messages, shared projects).</li>
              <li>Graph Neural Networks (GNNs / Node2Vec) for high-dimensional topological embeddings.</li>
              <li>Betweenness Centrality & Closeness Centrality calculation for bottleneck detection.</li>
              <li>Community detection algorithms such as Louvain Modularity or Girvan-Newman.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Student Certification Sign-Off */}
      <div className="p-6 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900">Project Authentication & Verification</div>
          <div className="text-slate-500 text-[11px]">
            Designed, implemented, and verified for Design and Analysis of Algorithms Coursework.
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-900">PRANITHA S S</div>
          <div className="font-mono text-slate-500">Register No: 711525BCS120</div>
        </div>
      </div>
    </div>
  );
};
