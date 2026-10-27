/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Friendship } from '../types/network';
import { apiClient } from '../services/apiClient';
import confetti from 'canvas-confetti';
import {
  UserPlus,
  Link,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Users,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

interface AddDataPageProps {
  users: User[];
  friendships: Friendship[];
  onDataChanged: () => void;
}

export const AddDataPage: React.FC<AddDataPageProps> = ({
  users,
  friendships,
  onDataChanged
}) => {
  // Add User Form State
  const [userName, setUserName] = useState('');
  const [userHandle, setUserHandle] = useState('');
  const [userDept, setUserDept] = useState('Computer Science');
  const [userRole, setUserRole] = useState('Student Researcher');
  const [userInterests, setUserInterests] = useState('Algorithms, Graph Theory, Python');
  const [userBio, setUserBio] = useState('Interested in graph algorithms and social networks.');
  const [userColor, setUserColor] = useState('#6366F1');

  // Add Friendship Form State
  const [friendSource, setFriendSource] = useState(users[0]?.id || '');
  const [friendTarget, setFriendTarget] = useState(users[1]?.id || '');

  // Notifications
  const [userSuccess, setUserSuccess] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);
  const [friendSuccess, setFriendSuccess] = useState<string | null>(null);
  const [friendError, setFriendError] = useState<string | null>(null);

  const departmentsList = [
    'Computer Science',
    'Artificial Intelligence',
    'Data Science',
    'Cyber Security',
    'Design & Media',
    'Robotics & Automation',
    'Information Tech'
  ];

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserSuccess(null);
    setUserError(null);

    if (!userName.trim()) {
      setUserError('Full Name is required.');
      return;
    }

    try {
      const interestsArray = userInterests
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const res = await apiClient.addUser({
        name: userName.trim(),
        handle: userHandle.trim() || undefined,
        department: userDept,
        role: userRole.trim(),
        interests: interestsArray.length > 0 ? interestsArray : ['DAA', 'Graphs'],
        bio: userBio.trim(),
        color: userColor
      });

      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
      setUserSuccess(`User "${res.user.name}" created with ID ${res.user.id}!`);
      setUserName('');
      setUserHandle('');
      onDataChanged();
    } catch (err: any) {
      setUserError(err.message || 'Failed to add user');
    }
  };

  const handleAddFriendship = async (e: React.FormEvent) => {
    e.preventDefault();
    setFriendSuccess(null);
    setFriendError(null);

    if (!friendSource || !friendTarget) {
      setFriendError('Please select both users.');
      return;
    }

    if (friendSource === friendTarget) {
      setFriendError('Self-loop friendships are not permitted in undirected social graphs.');
      return;
    }

    // Check existing
    const exists = friendships.some(
      f =>
        (f.source === friendSource && f.target === friendTarget) ||
        (f.source === friendTarget && f.target === friendSource)
    );
    if (exists) {
      setFriendError('A friendship relationship between these two users already exists.');
      return;
    }

    try {
      const res = await apiClient.addFriendship(friendSource, friendTarget);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      const u1 = users.find(u => u.id === friendSource)?.name || friendSource;
      const u2 = users.find(u => u.id === friendTarget)?.name || friendTarget;
      setFriendSuccess(`Friendship established between ${u1} and ${u2}! Graph edge added.`);
      onDataChanged();
    } catch (err: any) {
      setFriendError(err.message || 'Failed to add friendship');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
            Dynamic Graph Modification
          </span>
          <span className="text-xs text-slate-400">• Real-Time Graph Topology Update</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">
          Add Nodes & Friendship Edges
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Insert new vertices or undirected edges into the social graph. All traversals, statistics, and recommendations immediately recalculate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* FORM 1: ADD USER */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add New User (Vertex)</h2>
              <p className="text-xs text-slate-500">Insert an academic node into the graph</p>
            </div>
          </div>

          {userSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{userSuccess}</span>
            </div>
          )}

          {userError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{userError}</span>
            </div>
          )}

          <form onSubmit={handleAddUser} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Handle</label>
                <input
                  type="text"
                  placeholder="@maya_l"
                  value={userHandle}
                  onChange={(e) => setUserHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <input
                  type="text"
                  placeholder="e.g. AI Scholar"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={userDept}
                onChange={(e) => setUserDept(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {departmentsList.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interests (Comma-separated)</label>
              <input
                type="text"
                placeholder="Algorithms, Machine Learning, Web Dev"
                value={userInterests}
                onChange={(e) => setUserInterests(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bio</label>
              <textarea
                rows={2}
                placeholder="Short academic bio..."
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Node Color Accent</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={userColor}
                  onChange={(e) => setUserColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200"
                />
                <span className="font-mono text-slate-500">{userColor}</span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-xs shadow-indigo-600/20 transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Add User to Graph
            </button>
          </form>
        </div>

        {/* FORM 2: ADD FRIENDSHIP */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Link className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Friendship (Edge)</h2>
              <p className="text-xs text-slate-500">Connect two existing network vertices</p>
            </div>
          </div>

          {friendSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{friendSuccess}</span>
            </div>
          )}

          {friendError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{friendError}</span>
            </div>
          )}

          <form onSubmit={handleAddFriendship} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                First User (Source Vertex) <span className="text-rose-500">*</span>
              </label>
              <select
                value={friendSource}
                onChange={(e) => setFriendSource(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.department} ({u.handle})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Second User (Target Vertex) <span className="text-rose-500">*</span>
              </label>
              <select
                value={friendTarget}
                onChange={(e) => setFriendTarget(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} — {u.department} ({u.handle})
                  </option>
                ))}
              </select>
            </div>

            {/* Validation notes */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-violet-600" />
                Graph Constraints:
              </div>
              <p>• Undirected graph: creates symmetric bidirectional adjacency.</p>
              <p>• Self-loops (u == v) and duplicate edges (u, v) ∈ E are rejected.</p>
              <p>• Connecting members from different components merges the clusters!</p>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-xs shadow-violet-600/20 transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Link className="w-4 h-4" />
              Establish Friendship Edge
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
