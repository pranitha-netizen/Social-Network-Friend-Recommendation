/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IncomingMessage, ServerResponse } from 'http';
import { defaultGraphEngine } from '../services/graphEngine.ts';

export function handleApiRequest(req: IncomingMessage, res: ServerResponse): boolean {
  const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  if (!pathname.startsWith('/api')) {
    return false;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  // GET /api/network
  if (req.method === 'GET' && pathname === '/api/network') {
    try {
      const data = defaultGraphEngine.getNetworkData();
      res.statusCode = 200;
      res.end(JSON.stringify(data));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
    return true;
  }

  // GET /api/centrality
  if (req.method === 'GET' && pathname === '/api/centrality') {
    try {
      const centrality = defaultGraphEngine.getDegreeCentrality();
      res.statusCode = 200;
      res.end(JSON.stringify(centrality));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
    return true;
  }

  // GET /api/components
  if (req.method === 'GET' && pathname === '/api/components') {
    try {
      const components = defaultGraphEngine.getConnectedComponents();
      res.statusCode = 200;
      res.end(JSON.stringify(components));
    } catch (err: any) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
    }
    return true;
  }

  // GET /api/recommendations/:userId
  const recMatch = pathname.match(/^\/api\/recommendations\/([^\/]+)$/);
  if (req.method === 'GET' && recMatch) {
    const userId = decodeURIComponent(recMatch[1]);
    try {
      const recommendations = defaultGraphEngine.getRecommendations(userId);
      res.statusCode = 200;
      res.end(JSON.stringify({ userId, recommendations, count: recommendations.length }));
    } catch (err: any) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: err.message || 'User not found' }));
    }
    return true;
  }

  // GET /api/bfs/:userId
  const bfsMatch = pathname.match(/^\/api\/bfs\/([^\/]+)$/);
  if (req.method === 'GET' && bfsMatch) {
    const userId = decodeURIComponent(bfsMatch[1]);
    try {
      const bfsResult = defaultGraphEngine.runBFS(userId);
      res.statusCode = 200;
      res.end(JSON.stringify(bfsResult));
    } catch (err: any) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: err.message || 'User not found' }));
    }
    return true;
  }

  // GET /api/dfs/:userId
  const dfsMatch = pathname.match(/^\/api\/dfs\/([^\/]+)$/);
  if (req.method === 'GET' && dfsMatch) {
    const userId = decodeURIComponent(dfsMatch[1]);
    try {
      const dfsResult = defaultGraphEngine.runDFS(userId);
      res.statusCode = 200;
      res.end(JSON.stringify(dfsResult));
    } catch (err: any) {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: err.message || 'User not found' }));
    }
    return true;
  }

  // POST /api/users
  if (req.method === 'POST' && pathname === '/api/users') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (!payload.name || !payload.department) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Name and department are required fields.' }));
          return;
        }

        const result = defaultGraphEngine.addUser({
          name: payload.name.trim(),
          handle: payload.handle ? payload.handle.trim() : `@${payload.name.toLowerCase().replace(/\s+/g, '_')}`,
          role: payload.role?.trim() || 'Student / Engineer',
          department: payload.department.trim(),
          avatar: payload.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(payload.name)}`,
          color: payload.color || '#6366F1',
          bio: payload.bio?.trim() || 'Connected member in academic network.',
          interests: Array.isArray(payload.interests)
            ? payload.interests
            : typeof payload.interests === 'string'
            ? payload.interests.split(',').map((s: string) => s.trim()).filter(Boolean)
            : ['Algorithms', 'Networks']
        });

        if (!result.success) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: result.error }));
          return;
        }

        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'User added successfully', user: result.user }));
      } catch (e: any) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON request payload: ' + e.message }));
      }
    });
    return true;
  }

  // POST /api/friendships
  if (req.method === 'POST' && pathname === '/api/friendships') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { source, target } = payload;
        if (!source || !target) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Both "source" and "target" user IDs are required.' }));
          return;
        }

        const result = defaultGraphEngine.addFriendship(source, target);
        if (!result.success) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: result.error }));
          return;
        }

        res.statusCode = 201;
        res.end(JSON.stringify({ message: 'Friendship created successfully', friendship: result.friendship }));
      } catch (e: any) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Invalid JSON request payload: ' + e.message }));
      }
    });
    return true;
  }

  // POST /api/reset
  if (req.method === 'POST' && pathname === '/api/reset') {
    defaultGraphEngine.reset();
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Network restored to baseline dataset.' }));
    return true;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: `Endpoint ${pathname} not found` }));
  return true;
}
