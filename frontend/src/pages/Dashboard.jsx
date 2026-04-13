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

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (!profile?.institution_id) return <div className="p-8">Institution not setup.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
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
