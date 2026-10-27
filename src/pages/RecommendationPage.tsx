/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Recommendation, NetworkData } from '../types/network';
import { apiClient } from '../services/apiClient';
import confetti from 'canvas-confetti';
import {
  UserCheck,
  Users,
  Sparkles,
  RefreshCw,
  Filter,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  UserPlus,
  GitBranch,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface RecommendationPageProps {
  users: User[];
  selectedUser: User | null;
  onSelectUser: (user: User) => void;
  onFriendshipCreated: () => void;
}

export const RecommendationPage: React.FC<RecommendationPageProps> = ({
  users,
  selectedUser,
  onSelectUser,
  onFriendshipCreated
}) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [depthFilter, setDepthFilter] = useState<'ALL' | '2' | '3'>('ALL');
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const activeUser = selectedUser || users[0] || null;

  const loadRecommendations = async (userId: string) => {
    setLoading(true);
    setActionMessage(null);
    try {
      const data = await apiClient.getRecommendations(userId);
      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeUser) {
      loadRecommendations(activeUser.id);
    }
  }, [activeUser?.id]);

  const handleConnect = async (targetUserId: string, targetName: string) => {
    if (!activeUser) return;
    setConnectingUserId(targetUserId);
    setActionMessage(null);

    try {
      await apiClient.addFriendship(activeUser.id, targetUserId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
      setActionMessage({
        text: `Successfully formed friendship between ${activeUser.name} and ${targetName}! Graph updated.`,
        type: 'success'
      });
      // Refresh network state in parent
      onFriendshipCreated();
      // Reload recommendations for updated graph
      await loadRecommendations(activeUser.id);
    } catch (err: any) {
      setActionMessage({
        text: err.message || 'Failed to create friendship',
        type: 'error'
      });
    } finally {
      setConnectingUserId(null);
    }
  };

  // Filter recommendations by connection depth
  const filteredRecommendations = recommendations.filter(rec => {
    if (depthFilter === '2') return rec.degreeOfSeparation === 2;
    if (depthFilter === '3') return rec.degreeOfSeparation === 3;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Source User Selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-700 font-bold text-xs">
              Algorithmic Recommendation Engine
            </span>
            <span className="text-xs text-slate-400">• Multi-Hop BFS & Mutual Friend Ranking</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">
            People {activeUser?.name ? `${activeUser.name.split(' ')[0]} May Know` : 'You May Know'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked candidates discovered via 2nd and 3rd degree graph separation, weighted by shared mutual friends and common interests.
          </p>
        </div>

        {/* Source user dropdown & refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <span>Source Person:</span>
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

          <button
            onClick={() => activeUser && loadRecommendations(activeUser.id)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors disabled:opacity-50"
            title="Refresh recommendations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs animate-in fade-in ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span className="font-medium">{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold hover:underline opacity-80"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Criteria Breakdown Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        {/* Depth Filter Tabs */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter By Separation:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setDepthFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                depthFilter === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Depths ({recommendations.length})
            </button>
            <button
              onClick={() => setDepthFilter('2')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                depthFilter === '2'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2nd Degree Only ({recommendations.filter(r => r.degreeOfSeparation === 2).length})
            </button>
            <button
              onClick={() => setDepthFilter('3')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                depthFilter === '3'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3rd Degree Only ({recommendations.filter(r => r.degreeOfSeparation === 3).length})
            </button>
          </div>
        </div>

        {/* Scoring Formula Tooltip */}
        <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
          <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
          <span>Formula: Score = (Mutuals × 22) + (Interests × 9) + DeptBonus - DistPenalty</span>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-sm space-y-3">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-700">Traversing graph topology...</p>
          <p className="text-xs text-slate-400">Computing shortest paths and mutual neighbor sets</p>
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/90 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-slate-800">
              No Eligible Recommendations Found
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {activeUser?.name} is either already directly connected to everyone in their connected component, or resides in an isolated network cluster with no 2nd or 3rd degree candidates.
            </p>
          </div>
          <div className="text-xs text-indigo-600 font-medium">
            Try choosing another source user or add a cross-component bridge friendship!
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map((rec) => {
            const isConnecting = connectingUserId === rec.user.id;
            return (
              <div
                key={rec.user.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={rec.user.avatar}
                          alt={rec.user.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: rec.user.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                          {rec.user.name}
                        </h3>
                        <p className="text-[11px] font-mono text-slate-400">{rec.user.handle}</p>
                        <p className="text-[10px] font-semibold text-slate-600 mt-0.5">
                          {rec.user.department}
                        </p>
                      </div>
                    </div>

                    {/* Degree Badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        rec.degreeOfSeparation === 2
                          ? 'bg-violet-50 text-violet-700 border-violet-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {rec.degreeOfSeparation === 2 ? '2nd Degree' : '3rd Degree'}
                    </span>
                  </div>

                  {/* Recommendation Score Meter */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        Match Score
                      </span>
                      <span className="font-bold text-indigo-600 font-mono text-sm">
                        {rec.recommendationScore}%
                      </span>
                    </div>

                    {/* Score Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${rec.recommendationScore}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Mutuals: +{rec.scoreBreakdown.mutualFriendsScore} pts</span>
                      {rec.scoreBreakdown.degreePenalty > 0 && (
                        <span className="text-amber-600">Depth penalty: -{rec.scoreBreakdown.degreePenalty} pts</span>
                      )}
                    </div>
                  </div>

                  {/* Mutual Friends Section */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-indigo-600" />
                        Mutual Friends ({rec.mutualFriendCount})
                      </span>
                    </div>

                    {rec.mutualFriendCount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-2 overflow-hidden">
                          {rec.mutualFriends.slice(0, 3).map(mf => (
                            <img
                              key={mf.id}
                              src={mf.avatar}
                              alt={mf.name}
                              title={`${mf.name} (${mf.department})`}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-600 truncate max-w-[180px]">
                          {rec.mutualFriends.map(m => m.name.split(' ')[0]).join(', ')}
                        </span>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-400 italic">
                        Connected through 3-hop social traversal.
                      </p>
                    )}
                  </div>

                  {/* Algorithmic Reason / Explanation */}
                  <div className="bg-indigo-50/50 rounded-xl p-2.5 border border-indigo-100/70 text-[11px] text-slate-700 leading-relaxed">
                    <span className="font-bold text-indigo-900">Why recommended:</span>{' '}
                    {rec.explanation}
                  </div>
                </div>

                {/* Card Actions: Connect Button */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleConnect(rec.user.id, rec.user.name)}
                    disabled={isConnecting}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs shadow-indigo-600/20 transition-colors disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {isConnecting ? 'Forming Edge...' : 'Add Friend'}
                  </button>
                  <button
                    onClick={() => onSelectUser(rec.user)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors"
                    title="Inspect candidate node"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
