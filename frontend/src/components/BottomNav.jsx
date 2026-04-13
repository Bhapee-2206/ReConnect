import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const activeClass = "flex flex-col items-center gap-1 p-2 text-indigo-700";
  const inactiveClass = "flex flex-col items-center gap-1 p-2 text-slate-400";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 z-[70] px-4 py-2 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        <span className="material-symbols-outlined">dashboard</span>
        <span className="text-[10px] font-medium">Home</span>
      </NavLink>
      <NavLink to="/directory" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        <span className="material-symbols-outlined">group</span>
        <span className="text-[10px] font-medium">Directory</span>
      </NavLink>
      <NavLink to="/announcements" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        <span className="material-symbols-outlined">campaign</span>
        <span className="text-[10px] font-medium">News</span>
      </NavLink>
      <NavLink to="/events" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        <span className="material-symbols-outlined">event</span>
        <span className="text-[10px] font-medium">Events</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
        <span className="material-symbols-outlined">person</span>
        <span className="text-[10px] font-medium">Profile</span>
      </NavLink>
    </nav>
  );
}
