/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Network, GitBranch, UserCheck, Cpu, PlusCircle, BookOpen, RotateCcw } from 'lucide-react';

export type ActivePage = 'home' | 'dashboard' | 'recommendations' | 'algorithms' | 'add' | 'about';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  onResetNetwork: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activePage, onNavigate, onResetNetwork }) => {
  const navItems = [
    { id: 'home' as ActivePage, label: 'Overview', icon: BookOpen },
    { id: 'dashboard' as ActivePage, label: 'Network Graph', icon: Network },
    { id: 'recommendations' as ActivePage, label: 'Recommendations', icon: UserCheck },
    { id: 'algorithms' as ActivePage, label: 'Algorithm Lab', icon: Cpu },
    { id: 'add' as ActivePage, label: 'Add Data', icon: PlusCircle },
    { id: 'about' as ActivePage, label: 'DAA Report', icon: GitBranch },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Project Identity */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  Social Graph DAA
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-200/60 hidden sm:inline-block">
                  Algorithms & Networks
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block">
                Friend Recommendation System • PRANITHA S S (711525BCS120)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Reset baseline + Student ID Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={onResetNetwork}
              title="Reset graph to default 18-user baseline"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-indigo-600 hover:bg-slate-50 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Baseline</span>
            </button>

            <div className="bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-lg text-right hidden sm:block">
              <div className="text-[11px] font-bold text-slate-800 leading-tight">PRANITHA S S</div>
              <div className="text-[10px] text-slate-500 font-mono">711525BCS120</div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="lg:hidden flex items-center justify-between border-t border-slate-100 py-2 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
