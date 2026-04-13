import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import BottomNav from './BottomNav';
import { authService } from '../services/api';

export default function Layout() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
        setLoading(false);
        return;
      }

      try {
        const response = await authService.getUser();
        const profileData = response.data;
        setUser(profileData);
        setProfile(profileData);
        
        if (profileData && !profileData.institution_id && window.location.pathname !== '/onboarding') {
          navigate('/onboarding');
        }
      } catch (err) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setLoading(false);
    }

    getUser();
  }, [navigate, window.location.pathname]);

  const refreshProfile = async () => {
      try {
          const response = await authService.getUser();
          setUser(response.data);
          setProfile(response.data);
      } catch (err) {
          console.error("Error refreshing profile:", err);
      }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading session...</div>;
  }

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col md:flex-row">
      <Sidebar profile={profile} />
      <main className="md:ml-60 w-full flex-1 flex flex-col min-h-screen transition-all duration-300">
        <TopNav user={user} profile={profile} />
        <div className="flex-1 pb-20 md:pb-0">
          <Outlet context={{ user, profile, refreshProfile }} />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
