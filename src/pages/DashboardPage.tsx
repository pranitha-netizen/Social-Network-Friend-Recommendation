/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { User, Friendship, NetworkData } from '../types/network';
import { NetworkGraph } from '../components/NetworkGraph';
import { ActivePage } from '../components/Navbar';
import {
  Users,
  GitBranch,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  Search,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface DashboardPageProps {
  networkData: NetworkData | null;
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onNavigate: (page: ActivePage) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  networkData,
  selectedUser,
  onSelectUser,
  onNavigate
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = networkData?.nodes || [];
  const edges = networkData?.edges || [];
  const stats = networkData?.stats;

  // Filter users by search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      u =>
        u.name.toLowerCase().includes(term) ||
        u.handle.toLowerCase().includes(term) ||
        u.department.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // Compute selected user's direct friends
  const directFriends = useMemo(() => {
    if (!selectedUser) return [];
    const friendIds = new Set<string>();
    edges.forEach(e => {
      if (e.source === selectedUser.id) friendIds.add(e.target);
      if (e.target === selectedUser.id) friendIds.add(e.source);
    });
    return users.filter(u => friendIds.has(u.id));
  }, [selectedUser, edges, users]);

  // Fallback if no user selected
  const activeUser = selectedUser || users[0] || null;

  return (
    <div className="space-y-6">
      {/* Top Header & Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs">
              Interactive Graph Canvas
            </span>
            <span className="text-xs text-slate-400">• D3.js Force Simulation</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            Social Network Topology Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any node or choose from the dropdown to inspect its neighborhood, direct friends, and network position.
          </p>
        </div>

        {/* User Search & Dropdown Picker */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44"
            />
          </div>

          <select
            value={activeUser?.id || ''}
            onChange={(e) => {
              const u = users.find(x => x.id === e.target.value);
              if (u) onSelectUser(u);
            }}
            className="bg-indigo-50/70 border border-indigo-200/80 text-indigo-950 font-semibold text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: D3 Canvas (left 8 cols) & User Profile / Stats (right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas */}
        <div className="lg:col-span-8 space-y-4">
          <NetworkGraph
            nodes={users}
            edges={edges}
            selectedUserId={activeUser?.id}
            onSelectUser={onSelectUser}
            viewMode="default"
          />

          {/* Quick tips bar */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Tip: Drag nodes to rearrange • Scroll to zoom in/out • Click on any node to select
            </span>
            <button
              onClick={() => onNavigate('algorithms')}
              className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
            >
              Analyze in Algorithm Lab
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Selected User Inspector & Global Stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected User Card */}
          {activeUser && (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={activeUser.avatar}
                      alt={activeUser.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
                    />
                    <div
                      className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                      style={{ backgroundColor: activeUser.color }}
                      title="Profile node color"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">
                      {activeUser.name}
                    </h3>
                    <p className="text-xs font-mono text-slate-400">{activeUser.handle}</p>
                    <p className="text-[11px] font-semibold text-indigo-600 mt-0.5">
                      {activeUser.department}
                    </p>
                  </div>
                </div>

                <span className="px-2 py-1 bg-slate-100 text-slate-700 font-mono text-[10px] rounded-md font-semibold">
                  ID: {activeUser.id}
                </span>
              </div>

              {/* Bio & Role */}
              <div className="text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                <div className="font-semibold text-slate-800 text-[11px] mb-1">
                  Role: {activeUser.role}
                </div>
                <p className="italic text-slate-500">"{activeUser.bio}"</p>
              </div>

              {/* Interests Tags */}
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Interests & Tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeUser.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-50 text-indigo-700 text-[11px] font-medium px-2 py-0.5 rounded-md border border-indigo-100"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Connections List */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    Direct Friends ({directFriends.length})
                  </span>
                  <span className="text-[10px] text-slate-400">deg(v) = {directFriends.length}</span>
                </div>

                {directFriends.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No direct connections (Isolated Node).</p>
                ) : (
                  <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                    {directFriends.map(friend => (
                      <div
                        key={friend.id}
                        onClick={() => onSelectUser(friend)}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={friend.avatar}
                            alt={friend.name}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                              {friend.name}
                            </div>
                            <div className="text-[10px] text-slate-400">{friend.department}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-600 font-semibold group-hover:underline">
                          Inspect
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Action Buttons */}
              <div className="border-t border-slate-100 pt-4 space-y-2">
                <button
                  onClick={() => onNavigate('recommendations')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm shadow-indigo-600/20 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Recommend Friends for {activeUser.name.split(' ')[0]}
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onNavigate('algorithms')}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium text-xs transition-colors"
                  >
                    <GitBranch className="w-3 h-3 text-indigo-600" />
                    BFS Traversal
                  </button>
                  <button
                    onClick={() => onNavigate('algorithms')}
                    className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-violet-50 hover:text-violet-600 text-slate-700 font-medium text-xs transition-colors"
                  >
                    <Activity className="w-3 h-3 text-violet-600" />
                    Centrality Rank
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Network Graph Statistics */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Real Graph Dataset Statistics
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-medium text-slate-500">Total Users (|V|)</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {stats?.totalUsers || users.length}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-medium text-slate-500">Total Friendships (|E|)</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {stats?.totalFriendships || edges.length}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-medium text-slate-500">Average Degree</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {stats?.averageDegree || 0}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[10px] font-medium text-slate-500">Graph Density</div>
                <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">
                  {stats?.graphDensity || 0}
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/70 p-3 rounded-xl border border-indigo-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-semibold text-indigo-900">Connected Components</div>
                <div className="text-xs text-indigo-700">
                  {stats?.connectedComponentsCount || 1} distinct network clusters
                </div>
              </div>
              <button
                onClick={() => onNavigate('algorithms')}
                className="text-[11px] font-semibold text-indigo-600 hover:underline"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
