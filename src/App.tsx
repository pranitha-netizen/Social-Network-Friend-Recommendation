/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActivePage } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { RecommendationPage } from './pages/RecommendationPage';
import { AlgorithmLabPage } from './pages/AlgorithmLabPage';
import { AddDataPage } from './pages/AddDataPage';
import { AboutProjectPage } from './pages/AboutProjectPage';
import { apiClient } from './services/apiClient';
import { User, NetworkData } from './types/network';
import { Loader2 } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchNetwork = useCallback(async () => {
    try {
      const data = await apiClient.getNetwork();
      setNetworkData(data);
      if (!selectedUser && data.nodes.length > 0) {
        setSelectedUser(data.nodes[0]);
      } else if (selectedUser) {
        // Keep selected user updated if node data changed
        const updated = data.nodes.find(u => u.id === selectedUser.id);
        if (updated) setSelectedUser(updated);
      }
    } catch (err) {
      console.error('Failed to fetch network:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    fetchNetwork();
  }, []);

  const handleResetNetwork = async () => {
    setLoading(true);
    await apiClient.resetNetwork();
    const data = await apiClient.getNetwork();
    setNetworkData(data);
    if (data.nodes.length > 0) {
      setSelectedUser(data.nodes[0]);
    }
    setLoading(false);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
      <Navbar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onResetNetwork={handleResetNetwork}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && !networkData ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-700">Loading Social Network Topology...</p>
            <p className="text-xs text-slate-400">Initializing graph adjacency structures</p>
          </div>
        ) : (
          <>
            {activePage === 'home' && (
              <HomePage
                onNavigate={setActivePage}
                networkData={networkData}
              />
            )}

            {activePage === 'dashboard' && (
              <DashboardPage
                networkData={networkData}
                selectedUser={selectedUser}
                onSelectUser={handleUserSelect}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'recommendations' && (
              <RecommendationPage
                users={networkData?.nodes || []}
                selectedUser={selectedUser}
                onSelectUser={handleUserSelect}
                onFriendshipCreated={fetchNetwork}
              />
            )}

            {activePage === 'algorithms' && (
              <AlgorithmLabPage
                users={networkData?.nodes || []}
                edges={networkData?.edges || []}
                selectedUser={selectedUser}
                onSelectUser={handleUserSelect}
                onBridgeCreated={fetchNetwork}
              />
            )}

            {activePage === 'add' && (
              <AddDataPage
                users={networkData?.nodes || []}
                friendships={networkData?.edges || []}
                onDataChanged={fetchNetwork}
              />
            )}

            {activePage === 'about' && <AboutProjectPage />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
