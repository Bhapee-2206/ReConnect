import { useEffect, useState } from 'react';
import { authService } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    course: '',
    batch: '',
    company: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await authService.getUser();
        const data = response.data;
        setProfile({
          name: data.name || '',
          email: data.email,
          course: data.course || '',
          batch: data.batch || '',
          company: data.company || '',
          role: data.role || ''
        });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await authService.updateProfile({
        name: profile.name,
        course: profile.course,
        batch: profile.batch,
        company: profile.company
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error saving profile: " + (err.response?.data?.msg || "Server error"));
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10">Loading profile...</div>;

  return (
    <main className="flex-1 p-6 md:p-10 bg-surface-container-low">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">My Profile</h2>
            <p className="text-on-surface-variant mt-2 max-w-2xl">Manage your professional identity and how you appear to fellow alumni across the network.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-4 space-y-6">
                <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center text-center editorial-shadow">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md bg-slate-200 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[80px] text-slate-400">person</span>
                    </div>
                    <h3 className="text-xl font-bold text-on-surface">{profile.name || "Your Name"}</h3>
                    {profile.role && (
                      <span className="mt-2 inline-flex items-center px-3 py-1 bg-tertiary-container text-tertiary-fixed text-xs font-bold rounded-full tracking-wider uppercase">
                          {profile.role}
                      </span>
                    )}
                </div>
            </section>

            <section className="lg:col-span-8">
                <div className="bg-surface-container-lowest rounded-xl p-8 md:p-10 editorial-shadow">
                    <form className="space-y-8" onSubmit={handleSave}>
                        <div>
                            <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-indigo-600">badge</span>
                                Personal Information
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Full Name</label>
                                    <input 
                                      className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-on-surface" 
                                      type="text" 
                                      name="name"
                                      value={profile.name}
                                      onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Email Address</label>
                                    <input 
                                      className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 transition-all text-on-surface-variant cursor-not-allowed" 
                                      type="email" 
                                      value={profile.email}
                                      disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-indigo-600">school</span>
                                Academic History
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Course</label>
                                    <input 
                                      className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-on-surface" 
                                      type="text" 
                                      name="course"
                                      value={profile.course}
                                      onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Batch Year</label>
                                    <input 
                                        className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-on-surface" 
                                        type="text" 
                                        name="batch"
                                        value={profile.batch}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <h4 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-indigo-600">work</span>
                                Professional Details
                            </h4>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider pl-1">Current Company</label>
                                    <input 
                                        className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:bg-surface-container-lowest focus:ring-0 focus:border-b-2 focus:border-primary transition-all text-on-surface" 
                                        type="text" 
                                        name="company"
                                        value={profile.company}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex flex-col sm:flex-row gap-4 items-center justify-end">
                            <button disabled={saving} className="w-full sm:w-auto px-10 py-3 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all text-sm" type="submit">
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
      </div>
    </main>
  );
}
