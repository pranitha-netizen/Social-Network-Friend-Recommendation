/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, GraduationCap, Code2, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 py-10 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Project Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Network className="w-4 h-4" />
              </div>
              <span className="font-bold text-slate-900 text-base">
                Social Network Friend Recommendation
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Design and Analysis of Algorithms (DAA) Laboratory Project. Simulates graph traversal and centrality metrics to compute multi-hop friend recommendations, community detection, and topological graph statistics.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Breadth-First Search • Depth-First Search • Degree Centrality • Connected Components</span>
            </div>
          </div>

          {/* Col 2: Academic Credentials */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Student Details
            </h4>
            <div className="text-xs space-y-1 text-slate-600">
              <p><span className="text-slate-400">Student:</span> <strong className="text-slate-800">PRANITHA S S</strong></p>
              <p><span className="text-slate-400">Register No:</span> <strong className="font-mono text-slate-800">711525BCS120</strong></p>
              <p><span className="text-slate-400">Subject:</span> Design and Analysis of Algorithms (DAA)</p>
              <p><span className="text-slate-400">Category:</span> Graphs & Networks</p>
            </div>
          </div>

          {/* Col 3: Technology Stack */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-600" />
              Tech Stack
            </h4>
            <div className="text-xs space-y-1 text-slate-600">
              <p>• Interactive Visualization: <strong className="text-slate-800">D3.js (Force-Directed)</strong></p>
              <p>• Graph Logic & Traversal: <strong className="text-slate-800">Graph Theory & REST API</strong></p>
              <p>• Frontend Framework: <strong className="text-slate-800">React 19 & Tailwind CSS v4</strong></p>
              <p>• Data Model: <strong className="text-slate-800">Adjacency Graph & JSON</strong></p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} PRANITHA S S (711525BCS120). Academic DAA Project Submission.</p>
          <p className="flex items-center gap-1 text-slate-500">
            Simulating real-world LinkedIn & Facebook recommendation topologies
          </p>
        </div>
      </div>
    </footer>
  );
};
