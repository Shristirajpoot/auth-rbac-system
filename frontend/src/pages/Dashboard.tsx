import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, User as UserIcon, Lock, Unlock, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../services/api';

// Fetchers for React Query
const fetchPublicContent = async () => {
  const { data } = await api.get('/api/public');
  return data;
};

const fetchUserContent = async () => {
  const { data } = await api.get('/api/user');
  return data;
};

const fetchAdminContent = async () => {
  const { data } = await api.get('/api/admin');
  return data;
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Queries
  const publicQuery = useQuery({
    queryKey: ['publicContent'],
    queryFn: fetchPublicContent,
  });

  const userQuery = useQuery({
    queryKey: ['userContent'],
    queryFn: fetchUserContent,
    // Enable only if authenticated (context handles redirects, but double check)
    enabled: !!user,
  });

  const adminQuery = useQuery({
    queryKey: ['adminContent'],
    queryFn: fetchAdminContent,
    // Enable only for admin
    enabled: user?.role === 'ADMIN',
  });

  const handleRefreshAll = () => {
    publicQuery.refetch();
    userQuery.refetch();
    if (user?.role === 'ADMIN') {
      adminQuery.refetch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header / Profile Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-xl shadow-xl">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center shadow-inner">
              <UserIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white">{user?.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  user?.role === 'ADMIN'
                    ? 'bg-purple-550/15 border-purple-500/30 text-purple-400'
                    : 'bg-indigo-550/15 border-indigo-500/30 text-indigo-400'
                }`}>
                  <Shield className="w-3.5 h-3.5 mr-1" />
                  {user?.role}
                </span>
              </div>
              <p className="text-slate-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefreshAll}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-350 hover:text-white rounded-xl border border-slate-700/60 transition-all shadow-md flex items-center justify-center"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center space-x-2 px-5 py-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white text-red-400 font-semibold rounded-xl transition-all shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Public Content (Always Visible) */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:border-slate-700/60 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-xl flex items-center justify-center shadow-md">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-450 bg-sky-500/5 px-2 py-0.5 rounded border border-sky-500/10">
                  Public API
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Public Content</h3>
                <p className="text-slate-400 text-xs mt-1">Available to all visitors, logged in or not.</p>
              </div>
              <div className="border-t border-slate-800/80 pt-4 mt-2 min-h-[100px] flex flex-col justify-center">
                {publicQuery.isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-500">Fetching data...</span>
                  </div>
                ) : publicQuery.isError ? (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Failed to fetch content</span>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm font-medium text-slate-200">
                    {publicQuery.data?.message || JSON.stringify(publicQuery.data)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 mt-4 flex items-center justify-between">
              <span>Endpoint: /api/public</span>
              <span className="flex items-center text-emerald-400">
                <Unlock className="w-3 h-3 mr-1" /> Open Access
              </span>
            </div>
          </div>

          {/* Card 2: User Content Card */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:border-slate-700/60 transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center shadow-md">
                  <UserIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">
                  User Role
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">User Content</h3>
                <p className="text-slate-400 text-xs mt-1">Authorized for users with USER or ADMIN roles.</p>
              </div>
              <div className="border-t border-slate-800/80 pt-4 mt-2 min-h-[100px] flex flex-col justify-center">
                {userQuery.isLoading ? (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-500">Fetching data...</span>
                  </div>
                ) : userQuery.isError ? (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Failed to fetch content</span>
                  </div>
                ) : (
                  <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm font-medium text-slate-200">
                    {userQuery.data?.message || JSON.stringify(userQuery.data)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-500 mt-4 flex items-center justify-between">
              <span>Endpoint: /api/user</span>
              <span className="flex items-center text-indigo-400">
                <Lock className="w-3 h-3 mr-1" /> Protected (U/A)
              </span>
            </div>
          </div>

          {/* Card 3: Admin Content Card (Conditional styling/view) */}
          {user?.role === 'ADMIN' ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between backdrop-blur-xl shadow-lg hover:border-slate-700/60 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center shadow-md">
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded border border-purple-500/10">
                    Admin Role
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Admin Content</h3>
                  <p className="text-slate-400 text-xs mt-1">Strictly restricted to ADMIN users only.</p>
                </div>
                <div className="border-t border-slate-800/80 pt-4 mt-2 min-h-[100px] flex flex-col justify-center">
                  {adminQuery.isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-4">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-slate-500">Fetching data...</span>
                    </div>
                  ) : adminQuery.isError ? (
                    <div className="flex items-center space-x-2 text-red-400 bg-red-500/5 p-3 rounded-lg border border-red-500/10 text-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Failed to fetch content</span>
                    </div>
                  ) : (
                    <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl text-sm font-medium text-slate-200">
                      {adminQuery.data?.message || JSON.stringify(adminQuery.data)}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-[10px] text-slate-500 mt-4 flex items-center justify-between">
                <span>Endpoint: /api/admin</span>
                <span className="flex items-center text-purple-400">
                  <Lock className="w-3 h-3 mr-1" /> Protected (A)
                </span>
              </div>
            </div>
          ) : (
            // Disabled Locked Card for Regular Users (Premium Design Touch)
            <div className="bg-slate-950/20 border border-slate-900 border-dashed rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 z-10">
                <div className="w-10 h-10 bg-slate-900 border border-slate-800 text-slate-500 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-400">Admin Section Locked</h4>
                <p className="text-[11px] text-slate-600 mt-1 max-w-[200px]">
                  Log in with an administrator role to unlock this content and invoke `/api/admin`.
                </p>
              </div>
              <div className="space-y-4 opacity-15 select-none pointer-events-none">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">Admin Role</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold">Admin Content</h3>
                </div>
                <div className="border-t border-slate-800 pt-4 mt-2 min-h-[100px]">
                  <div className="bg-slate-900 p-4 rounded-xl h-14"></div>
                </div>
              </div>
              <div className="text-[10px] text-slate-700 mt-4 flex justify-between select-none opacity-20">
                <span>Endpoint: /api/admin</span>
                <span>Locked</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
