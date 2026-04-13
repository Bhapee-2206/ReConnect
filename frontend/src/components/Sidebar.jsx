import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar({ profile }) {
  const activeClass = "flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium transition-all duration-300 ease-in-out";
  const inactiveClass = "flex items-center gap-3 px-3 py-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-200 rounded-lg transition-all duration-300 ease-in-out text-sm";
  const isAdmin = profile?.role === 'college_admin';

  return (
    <aside className="h-screen w-60 fixed left-0 top-0 bg-slate-50 border-r border-slate-200 flex-col p-3 z-[60] hidden md:flex">
      <div className="mb-8 px-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
            <img src="/logo.png" className="w-full h-full object-cover" alt="Logo" />
        </div>
        <div>
            <h1 className="text-lg font-black text-indigo-700 tracking-tight">ReConnect</h1>
            <p className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Alumni Network</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-sm">Dashboard</span>
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
            <span className="material-symbols-outlined">admin_panel_settings</span>
            <span className="text-sm">Admin Management</span>
          </NavLink>
        )}
        <NavLink to="/directory" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
          <span className="material-symbols-outlined">group</span>
          <span className="text-sm">Alumni Directory</span>
        </NavLink>
        <NavLink to="/announcements" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
          <span className="material-symbols-outlined">campaign</span>
          <span className="text-sm">Announcements</span>
        </NavLink>
        <NavLink to="/events" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
          <span className="material-symbols-outlined">event</span>
          <span className="text-sm">Events</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
          <span className="material-symbols-outlined">person</span>
          <span className="text-sm">My Profile</span>
        </NavLink>
      </nav>
      <div className="mt-auto border-t border-slate-200 pt-4 space-y-1">
        <button className="w-full mb-4 py-3 bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-sm hover:opacity-90 transition-opacity">
          Invite Peer
        </button>
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-indigo-600 text-sm transition-all">
          <span className="material-symbols-outlined text-lg">contact_support</span>
          <span>Support</span>
        </a>
        <a href="#" className="flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-indigo-600 text-sm transition-all">
          <span className="material-symbols-outlined text-lg">policy</span>
          <span>Privacy</span>
        </a>
      </div>
    </aside>
  );
}
