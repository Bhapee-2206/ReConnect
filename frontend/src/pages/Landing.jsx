import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-container-lowest overflow-hidden font-inter selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-surface-container flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-white">webhook</span>
          </div>
          <span className="text-2xl font-black tracking-tighter text-on-surface">ReConnect</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="hidden sm:block text-sm font-bold text-on-surface-variant hover:text-primary transition-colors"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-on-surface text-surface py-2.5 px-6 rounded-full text-sm font-bold hover:scale-105 transition-transform"
          >
            Join Network
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary animate-fade-in">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span className="text-[11px] font-black uppercase tracking-widest">Next-Gen Alumni Platform</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-on-surface leading-[0.95]">
              Bridges built <br />
              <span className="text-primary italic font-serif serif-italic">beyond</span> <br />
              graduation.
            </h1>
            
            <p className="text-xl text-on-surface-variant leading-relaxed max-w-lg">
              The premier SaaS solution for institutions to nurture, track, and empower their professional network long after the final bell.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="bg-primary text-white py-4 px-10 rounded-2xl font-bold text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 transition-all group"
              >
                Launch Institution
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-white border-2 border-surface-container py-4 px-10 rounded-2xl font-bold text-lg text-on-surface hover:bg-surface-container-low transition-colors"
              >
                Join as Alumni
              </button>
            </div>

            <div className="flex items-center gap-6 pt-10 border-t border-surface-container">
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-surface-container-lowest bg-surface-container overflow-hidden">
                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                        </div>
                    ))}
                </div>
                <div>
                    <p className="text-sm font-bold text-on-surface">5,000+ Alumni</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">Connected globally</p>
                </div>
            </div>
          </div>

          <div className="relative">
            {/* Abstract Visual Representing Network */}
            <div className="relative z-10 bg-gradient-to-br from-primary to-indigo-600 rounded-[3rem] aspect-square overflow-hidden shadow-2xl rotate-3 scale-95 md:scale-100">
                <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px'}}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 border-2 border-white/20 rounded-full animate-ping"></div>
                    <div className="absolute w-48 h-48 border-2 border-white/40 rounded-full"></div>
                    <span className="material-symbols-outlined text-white text-8xl">hub</span>
                </div>
            </div>
            {/* Floating Cards */}
            <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl animate-float hidden md:block z-20">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-lg">monetization_on</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-outline">Donations</p>
                        <p className="text-lg font-black">$24.5k raised</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="bg-surface-container-low py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-on-surface tracking-tighter leading-none">The standard for alumni engagement.</h2>
                <p className="text-on-surface-variant max-w-xl mx-auto">Everything you need to manage events, track professional growth, and maintain institutional heritage.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    {icon: 'manage_accounts', title: 'Admin Control', desc: 'Powerful multi-tenant dashboard for institution-wide management.'},
                    {icon: 'share_location', title: 'Global Directory', desc: 'Real-time alumni database filterable by geography, batch, and company.'},
                    {icon: 'event_available', title: 'Event Hub', desc: 'Seamless event creation, registration, and attendance tracking.'}
                ].map((f, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-surface-container shadow-sm hover:shadow-xl transition-all">
                        <span className="material-symbols-outlined text-primary text-4xl mb-6">{f.icon}</span>
                        <h3 className="text-xl font-bold mb-2 text-on-surface">{f.title}</h3>
                        <p className="text-on-surface-variant leading-relaxed text-sm">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 border-t border-surface-container text-center">
        <div className="flex flex-col items-center gap-6">
            <span className="text-lg font-black tracking-tighter text-on-surface opacity-50">ReConnect</span>
            <div className="flex gap-8 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                <a href="#" className="hover:text-primary">Contact</a>
                <a href="#" className="hover:text-primary">Privacy</a>
                <a href="#" className="hover:text-primary">Twitter</a>
            </div>
            <p className="text-[10px] text-outline uppercase font-black tracking-[0.3em]">
                © 2026 ReConnect Digital Systems
            </p>
        </div>
      </footer>
    </div>
  );
}
