import { useEffect, useState } from 'react';
import { announcementService, eventService, alumniService } from '../services/api';
import { useOutletContext, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState({ alumni: 0, events: 0, announcements: 0 });
  const [loading, setLoading] = useState(true);
  const { profile } = useOutletContext();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      if (!profile?.institution_id) {
        setLoading(false);
        return;
      }

      try {
        const [annRes, eveRes, almRes] = await Promise.all([
          announcementService.getAll(),
          eventService.getAll(),
          alumniService.getDirectory()
        ]);

        setStats({
          announcements: annRes.data.length,
          events: eveRes.data.length,
          alumni: almRes.data.length
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadStats();
  }, [profile]);

  if (loading) return <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] animate-pulse">
    <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
    <div className="h-4 w-32 bg-surface-container rounded-full"></div>
  </div>;

  if (!profile?.institution_id) return <div className="p-8 text-center space-y-4">
    <span className="material-symbols-outlined text-6xl text-outline opacity-20">domain_disabled</span>
    <h3 className="text-xl font-bold">Institution not setup.</h3>
    <p className="text-on-surface-variant">Please contact your administrator or join an institution.</p>
  </div>;

  const isAdmin = profile.role === 'college_admin' || profile.role === 'admin';
  const isProfileIncomplete = !profile?.name || !profile?.profile_pic || (!isAdmin && (!profile?.course || !profile?.batch));

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {isProfileIncomplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                    <span className="material-symbols-outlined">person_edit</span>
                </div>
                <div>
                    <h4 className="text-sm font-black text-amber-900">Complete Your Professional Identity</h4>
                    <p className="text-xs text-amber-800/80">Missing details like your profile picture or academic history make it harder for alumni to find you.</p>
                </div>
            </div>
            <button 
                onClick={() => navigate('/profile')}
                className="px-5 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-amber-600/20 hover:bg-amber-700 transition-all flex-shrink-0"
            >
                Complete Now
            </button>
        </div>
      )}
      {/* Welcome Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-indigo-700 min-h-[260px] flex items-center p-8 text-white">
        <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-bold tracking-wider uppercase">Member Spotlight</span>
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight">Welcome back. Your network is waiting.</h2>
            <p className="text-indigo-100 text-sm leading-relaxed font-medium">There are new opportunities and networking events matching your profile today. Ready to reconnect?</p>
            <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => navigate('/events')}
                  className="px-6 py-3 bg-white text-indigo-700 rounded-lg font-bold text-xs shadow-xl hover:scale-[0.98] transition-transform"
                >
                    View Opportunities
                </button>
                <button 
                  onClick={() => navigate('/profile')}
                  className="px-6 py-3 bg-indigo-600/50 text-white rounded-lg font-bold text-xs backdrop-blur-md border border-white/20 hover:bg-indigo-600 transition-colors"
                >
                    Update Profile
                </button>
            </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-lowest p-6 rounded-2xl editorial-shadow group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                    <span className="material-symbols-outlined text-xl">groups</span>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-label uppercase tracking-widest text-on-surface-variant font-bold text-[10px]">Total Alumni</p>
                <h3 className="text-2xl font-black text-on-surface">{stats.alumni}</h3>
            </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl editorial-shadow group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-label uppercase tracking-widest text-on-surface-variant font-bold text-[10px]">Upcoming Events</p>
                <h3 className="text-2xl font-black text-on-surface">{stats.events}</h3>
            </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-2xl editorial-shadow group hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-start justify-between mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <span className="material-symbols-outlined text-xl">notification_important</span>
                </div>
            </div>
            <div className="space-y-1">
                <p className="text-label uppercase tracking-widest text-on-surface-variant font-bold text-[10px]">Announcements</p>
                <h3 className="text-2xl font-black text-on-surface">{stats.announcements}</h3>
            </div>
        </div>
      </section>
    </div>
  );
}
