
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, signOutUser } from './firebase';
import { OFFICIAL_WHITELIST } from './services/api';

// Pages
import Login from './pages/Login';
import ASHA from './pages/ASHA';
import Dashboard from './pages/Dashboard';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check Local Storage first for fast load
    const savedUser = localStorage.getItem('sanket_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setLoading(false);
    }

    // 2. Sync with Firebase
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Validation Logic
        const storedRaw = localStorage.getItem('sanket_user');
        if (!storedRaw) {
          // If no local session, wait for explicit login action unless strictly necessary (auto-login optimization)
          setLoading(false);
          return;
        }

        const stored = JSON.parse(storedRaw);

        // Security Check for Officials during session resume
        if (stored.role === 'official') {
          const email = (fbUser.email || '').toLowerCase();
          if (!OFFICIAL_WHITELIST.has(email)) {
            await handleLogout();
            localStorage.setItem('unauthorized_official', '1');
            return;
          }
        }

        const mappedUser = {
          id: fbUser.uid,
          name: fbUser.displayName || stored.name || fbUser.email,
          email: fbUser.email,
          role: stored.role,
          village: stored.village,
          designation: stored.designation
        };

        setCurrentUser(mappedUser);
        localStorage.setItem('sanket_user', JSON.stringify(mappedUser));
      } else {
        // No firebase user, but maybe local state exists (expired session?)
        // Ideally we verify token, but for prototype we trust local until explicit logout or 401
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('sanket_user', JSON.stringify(user));
  };

  const handleLogout = async () => {
    try { await signOutUser(); } catch (_) { }
    setCurrentUser(null);
    localStorage.removeItem('sanket_user');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-slate-500">Initializing Quantum Uplink...</div>;

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentUser.role === 'official') {
    // Second line of defense
    if (!OFFICIAL_WHITELIST.has((currentUser.email || '').toLowerCase())) {
      handleLogout();
      return <Login onLogin={handleLogin} />;
    }
    return <Dashboard user={currentUser} onLogout={handleLogout} />;
  }

  if (currentUser.role === 'asha') {
    return <ASHA user={currentUser} onLogout={handleLogout} />;
  }

  return <Login onLogin={handleLogin} />;
};

export default App;
