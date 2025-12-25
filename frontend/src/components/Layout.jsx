
import React from 'react';
import { LayoutDashboard, Bell, Share2, MessageSquare, Brain, Map, Activity, LogOut, User } from 'lucide-react';

const Layout = ({ user, activeView, setActiveView, onLogout, children }) => {
    const navItems = [
        { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
        { id: 'alerts', label: 'Alert Feed', icon: Bell },
        { id: 'swarm', label: 'Swarm Network', icon: Share2 },
        { id: 'comms', label: 'Agent Comms', icon: MessageSquare },
        { id: 'quantum', label: 'Quantum Intel', icon: Brain },
        { id: 'map', label: 'Geospatial', icon: Map },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <Activity className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight">SANKET</h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wider">QUANTUM EPIDEMIOLOGY</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-2">Operations</p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 translate-x-1'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-950">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.designation || 'Health Official'}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm transition-colors border border-red-500/20 hover:border-red-500"
                    >
                        <LogOut className="w-4 h-4" />
                        Secure Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <h2 className="text-lg font-semibold text-slate-800">
                        {navItems.find(i => i.id === activeView)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-green-50 border border-green-200 rounded-full flex items-center gap-2 text-xs font-medium text-green-700">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Live Swarm Uplink
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 relative">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
