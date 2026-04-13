import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TopNav({ user, profile }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const displayName = profile?.name || user?.email || 'User';
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/directory?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm flex items-center justify-between px-6 py-3 glass-nav">
      <div className="flex items-center gap-8 flex-1">
        <span className="md:hidden text-2xl font-bold text-indigo-700 font-inter tracking-tight">ReConnect</span>
        <form onSubmit={handleSearch} className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full w-96 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input 
            type="text" 
            placeholder="Search the network..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-400"
          />
        </form>
      </div>
      <div className="flex items-center gap-4">
        <button 
          onClick={() => alert("You have no new notifications.")}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <button 
          onClick={() => alert("Help center is under construction. Please contact support via sidebar for assistance.")}
          className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface">{displayName}</p>
            <button onClick={handleLogout} className="text-[10px] font-black uppercase text-primary hover:text-indigo-600 transition-colors">Logout</button>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-surface-container overflow-hidden bg-surface-container-low flex items-center justify-center">
             {profile?.profile_pic ? (
                 <img src={profile.profile_pic} alt="Me" className="w-full h-full object-cover" />
             ) : (
                <span className="material-symbols-outlined text-outline opacity-40">person</span>
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
