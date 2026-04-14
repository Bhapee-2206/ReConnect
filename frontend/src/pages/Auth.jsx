import { useState } from 'react';
import { authService, institutionService } from '../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

// mode: 'login' | 'register' | 'join'
export default function Auth() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode');
  const [mode, setMode] = useState(initialMode === 'register' || initialMode === 'join' ? initialMode : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const response = await authService.login(email, password);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');

      } else if (mode === 'register') {
        const response = await authService.register(email, password);
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');

      } else if (mode === 'join') {
        // Step 1: register the account
        const response = await authService.register(email, password);
        localStorage.setItem('token', response.data.token);
        // Step 2: immediately join institution by code
        await institutionService.joinByCode(joinCode);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const modeConfig = {
    login: {
      heading: 'Welcome Back',
      sub: 'Enter your credentials to access the portal.',
      btn: 'Access Network',
    },
    register: {
      heading: 'Create Admin Account',
      sub: 'Register as an institution admin. You\'ll set up your institution next.',
      btn: 'Create Account',
    },
    join: {
      heading: 'Join an Institution',
      sub: 'Register and enter your institution\'s unique join code to connect as an alumnus.',
      btn: 'Join & Enter',
    },
  };

  const cfg = modeConfig[mode];

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-6">
      <main className="w-full max-w-6xl flex flex-col md:flex-row bg-surface-container-lowest rounded-[2rem] overflow-hidden editorial-shadow min-h-[700px]">

        {/* Left Panel */}
        <section className="hidden md:flex md:w-1/2 relative overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <img
              alt="Diverse alumni network group"
              className="w-full h-full object-cover opacity-60"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVLlnQG7HvOOFb9N4KaOHxbNt9TIRyXhIgpKnqDCbMybcTHuAC_hTCMGUT2sRvFQDI1YPNgDMmn3CTLz_op8GsfdwLY2pRpTcfHC-8EW3mLpSSuErB4V_BTuC2uPqV7IxDeTN-a1nctAXwzJ4quT8L44prn6CmWsuTQ7mKjAEY-3FFQOZhTbuHpzM6Hh-5qM7lZERwpgIStHcwPhizzf6nWLguBJpx0kI8ahGuzkNtBgz0PRvWKMsbOWOwCJ6rLW21L9s2wT6P_auj"
            />
          </div>
          <div className="relative z-10 p-16 flex flex-col justify-between h-full w-full bg-gradient-to-t from-primary/80 to-transparent">
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tighter mb-4">ReConnect</h1>
              <p className="text-primary-fixed-dim text-lg font-medium max-w-sm leading-relaxed">
                Reignite professional bonds and discover exclusive opportunities within your elite alumni ecosystem.
              </p>
            </div>
            <div className="space-y-6">
              {/* Role cards */}
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-3">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Two Ways to Join</p>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-white text-base">shield_person</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Institution Admin</p>
                    <p className="text-white/60 text-xs">Register → create institution → share join code</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-white text-base">group</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Alumni Member</p>
                    <p className="text-white/60 text-xs">Register → enter your institution's join code</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Panel */}
        <section className="w-full md:w-1/2 p-8 md:p-14 flex flex-col justify-center bg-surface-container-lowest">
          <div className="max-w-md w-full mx-auto">

            {/* Mobile logo */}
            <div className="md:hidden mb-10">
              <h2 className="text-3xl font-black text-primary tracking-tight">ReConnect</h2>
              <p className="text-on-surface-variant text-sm mt-1">The Alumni Network</p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl mb-8">
              {[
                { key: 'login', label: 'Sign In' },
                { key: 'register', label: 'Admin Register' },
                { key: 'join', label: 'Join as Alumni' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setMode(key); setError(null); }}
                  className={`flex-1 py-2.5 text-[11px] font-bold rounded-lg transition-all duration-200 ${
                    mode === key
                      ? 'bg-primary text-white shadow-md'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-on-surface tracking-tight mb-1">{cfg.heading}</h3>
              <p className="text-on-surface-variant text-sm">{cfg.sub}</p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                  {mode === 'join' ? 'Your Email' : 'Institutional Email'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="name@alumni.edu"
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-0 focus:bg-surface-container-lowest transition-all border-b-2 border-transparent focus:border-primary text-on-surface placeholder-outline/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant">
                    Password
                  </label>
                  {mode === 'login' && (
                    <a href="#" className="text-[0.65rem] font-bold uppercase tracking-widest text-primary hover:underline">
                      Forgot?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-0 focus:bg-surface-container-lowest transition-all border-b-2 border-transparent focus:border-primary text-on-surface placeholder-outline/50"
                  />
                </div>
              </div>

              {/* Join Code — only in 'join' mode */}
              {mode === 'join' && (
                <div className="space-y-2">
                  <label className="block text-[0.65rem] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                    Institution Join Code
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-lg">vpn_key</span>
                    <input
                      type="text"
                      id="joinCode"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      required
                      maxLength={8}
                      placeholder="e.g. ABCD1234"
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-xl focus:ring-0 focus:bg-surface-container-lowest transition-all border-b-2 border-transparent focus:border-primary text-on-surface placeholder-outline/50 font-mono tracking-[0.3em] uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-on-surface-variant ml-1 mt-1">
                    Ask your institution admin for the 8-character join code.
                  </p>
                </div>
              )}

              {/* Remember Me */}
              {mode === 'login' && (
                <div className="flex items-center gap-3 px-1">
                  <div className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" id="remember" className="sr-only peer" />
                    <div className="w-10 h-5 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </div>
                  <label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer">Keep me signed in</label>
                </div>
              )}

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 primary-gradient text-white font-bold rounded-xl editorial-shadow hover:scale-[1.01] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {cfg.btn}
                      <span className="material-symbols-outlined text-lg">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Info box for join mode */}
            {mode === 'join' && (
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-indigo-600 text-lg mt-0.5">info</span>
                  <p className="text-xs text-indigo-700 leading-relaxed">
                    Already registered? <button onClick={() => setMode('login')} className="font-bold underline underline-offset-2">Sign in</button> then visit the Join Institution page from the sidebar.
                  </p>
                </div>
              </div>
            )}

          </div>
        </section>
      </main>

      <footer className="fixed bottom-8 w-full text-center pointer-events-none opacity-40">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-outline">
          © 2026 ReConnect Digital Systems • Secure Protocol Activated
        </p>
      </footer>
    </div>
  );
}
