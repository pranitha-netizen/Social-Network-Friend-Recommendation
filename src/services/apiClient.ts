/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  NetworkData,
  Recommendation,
  BFSTraversalResult,
  DFSTraversalResult,
  DegreeCentralityResult,
  ConnectedComponentsResult,
  User,
  Friendship
} from '../types/network';
import { defaultGraphEngine } from './graphEngine';

class ApiClient {
  private async fetchOrFallback<T>(url: string, fallbackFn: () => T): Promise<T> {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`API call ${url} failed, using local engine fallback:`, err);
      return fallbackFn();
    }
  }

  public async getNetwork(): Promise<NetworkData> {
    return this.fetchOrFallback('/api/network', () => defaultGraphEngine.getNetworkData());
  }

  public async getRecommendations(userId: string): Promise<{ userId: string; recommendations: Recommendation[]; count: number }> {
    return this.fetchOrFallback(`/api/recommendations/${encodeURIComponent(userId)}`, () => {
      const recs = defaultGraphEngine.getRecommendations(userId);
      return { userId, recommendations: recs, count: recs.length };
    });
  }

  public async getBFS(userId: string): Promise<BFSTraversalResult> {
    return this.fetchOrFallback(`/api/bfs/${encodeURIComponent(userId)}`, () => defaultGraphEngine.runBFS(userId));
  }

  public async getDFS(userId: string): Promise<DFSTraversalResult> {
    return this.fetchOrFallback(`/api/dfs/${encodeURIComponent(userId)}`, () => defaultGraphEngine.runDFS(userId));
  }

  public async getCentrality(): Promise<DegreeCentralityResult> {
    return this.fetchOrFallback('/api/centrality', () => defaultGraphEngine.getDegreeCentrality());
  }

  public async getComponents(): Promise<ConnectedComponentsResult> {
    return this.fetchOrFallback('/api/components', () => defaultGraphEngine.getConnectedComponents());
  }

  public async addUser(userData: {
    name: string;
    handle?: string;
    role?: string;
    department: string;
    bio?: string;
    interests?: string[];
    color?: string;
    avatar?: string;
  }): Promise<{ message: string; user: User }> {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add user');
      }
      return data;
    } catch (err: any) {
      const res = defaultGraphEngine.addUser({
        ...userData,
        handle: userData.handle || `@${userData.name.toLowerCase().replace(/\s+/g, '_')}`,
        role: userData.role || 'Member',
        bio: userData.bio || '',
        interests: userData.interests || ['Tech'],
        color: userData.color || '#6366F1',
        avatar: userData.avatar || ''
      });
      if (!res.success || !res.user) {
        throw new Error(res.error || err.message || 'Failed to add user');
      }
      return { message: 'User added successfully (local)', user: res.user };
    }
  }

  public async addFriendship(source: string, target: string): Promise<{ message: string; friendship: Friendship }> {
    try {
      const res = await fetch('/api/friendships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, target })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add friendship');
      }
      return data;
    } catch (err: any) {
      const res = defaultGraphEngine.addFriendship(source, target);
      if (!res.success || !res.friendship) {
        throw new Error(res.error || err.message || 'Failed to create friendship');
      }
      return { message: 'Friendship created successfully (local)', friendship: res.friendship };
    }
  }

  public async resetNetwork(): Promise<{ message: string }> {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      return await res.json();
    } catch {
      defaultGraphEngine.reset();
      return { message: 'Network reset to baseline' };
    }
  }
}

export const apiClient = new ApiClient();
