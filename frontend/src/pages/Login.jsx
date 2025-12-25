
import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Stethoscope } from 'lucide-react';
import { signInWithGooglePopup, signOutUser } from '../firebase';
import { OFFICIAL_WHITELIST } from '../services/api';

const Login = ({ onLogin }) => {
    const [role, setRole] = useState('asha'); // asha | official
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', village: 'Dharavi', phone: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Check for previous unauthorized attempt flags
        try {
            if (localStorage.getItem('unauthorized_official') === '1') {
                setError('This email is not authorized as a Health Official.');
                localStorage.removeItem('unauthorized_official');
            }
        } catch (_) { }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        const emailLower = (formData.email || '').toLowerCase();

        if (role === 'official' && !OFFICIAL_WHITELIST.has(emailLower)) {
            setError('Access Denied: This email is not in the official registry.');
            return;
        }

        // Simulate Auth Success
        onLogin({
            id: Math.random().toString(36).substring(2, 11),
            name: formData.name || 'User',
            email: formData.email,
            role,
            village: formData.village,
            phone: formData.phone
        });
    };

    const loginWithGoogle = async () => {
        try {
            setError(null);
            const cred = await signInWithGooglePopup();
            const fbUser = cred.user;
            const emailLower = (fbUser.email || '').toLowerCase();

            if (role === 'official' && !OFFICIAL_WHITELIST.has(emailLower)) {
                await signOutUser();
                setError('Access Denied: Google Account not authorized for Official Access.');
                return;
            }

            onLogin({
                id: fbUser.uid,
                name: fbUser.displayName || 'User',
                email: fbUser.email,
                role,
                village: formData.village, // Default for new google users
                phone: formData.phone,
            });
        } catch (e) {
            setError('Google Sign-In failed or was cancelled.');
        }
    };

    const quickDemo = (demoType) => {
        const demos = {
            'asha': { id: 'd1', name: 'Priya ASHA', email: 'priya@sanket.in', role: 'asha', village: 'Dharavi' },
            'official': { id: 'd2', name: 'Dr. Rao', email: 'rao@gov.in', role: 'official', designation: 'DHO Mumbai' }
        };
        onLogin(demos[demoType]);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-500 rounded-full blur-[120px] opacity-10"></div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative z-10">

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4 transform rotate-3 hover:rotate-6 transition-transform">
                        <Activity className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">SANKET</h1>
                    <p className="text-blue-200 mt-1 font-medium">Quantum Epidemiology Network</p>
                </div>

                {/* Role Switcher */}
                <div className="grid grid-cols-2 gap-2 bg-slate-950/50 p-1.5 rounded-xl mb-8">
                    <button
                        onClick={() => { setRole('asha'); setError(null); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all
              ${role === 'asha' ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Stethoscope className="w-4 h-4" /> Field Agent
                    </button>
                    <button
                        onClick={() => { setRole('official'); setError(null); }}
                        className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all
              ${role === 'official' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ShieldCheck className="w-4 h-4" /> Official
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isSignup && (
                        <input type="text" placeholder="Full Name" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    )}
                    <input type="email" placeholder="Email Address" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <input type="password" placeholder="Password" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                    {isSignup && role === 'asha' && (
                        <>
                            <input type="text" placeholder="Village" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" value={formData.village} onChange={e => setFormData({ ...formData, village: e.target.value })} />
                            <input type="tel" placeholder="Phone Number" className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </>
                    )}

                    <button type="submit" className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95
            ${role === 'asha' ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:to-emerald-400' : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-400'}`}>
                        {isSignup ? 'Register New Agent' : 'Access System'}
                    </button>
                </form>

                <div className="mt-4">
                    <button onClick={loginWithGoogle} className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" /><path fill="#EA4335" d="M12 4.81c1.6 0 3.03.55 4.15 1.62l3.11-3.11C17.45 1.51 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                        Continue with Google
                    </button>
                </div>

                {/* Login <-> Signup toggle */}
                <div className="mt-4 text-center">
                    <button
                        type="button"
                        onClick={() => setIsSignup(!isSignup)}
                        className="text-blue-300 hover:text-white text-sm font-medium"
                    >
                        {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                    </button>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-xs text-slate-500 text-center mb-4 uppercase tracking-wider">Fast Track Access</p>
                    <div className="flex gap-2">
                        <button onClick={() => quickDemo('asha')} className="flex-1 py-2 bg-teal-500/10 text-teal-300 border border-teal-500/30 rounded-lg text-xs font-mono hover:bg-teal-500/20">Demo ASHA</button>
                        <button onClick={() => quickDemo('official')} className="flex-1 py-2 bg-blue-500/10 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-mono hover:bg-blue-500/20">Demo Official</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
