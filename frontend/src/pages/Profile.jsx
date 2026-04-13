import { useEffect, useState } from 'react';
import { authService, institutionService } from '../services/api';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    course: '',
    batch: '',
    company: '',
    role: '',
    institution_id: null,
    profile_pic: ''
  });
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = profile.role === 'college_admin' || profile.role === 'admin';

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await authService.getUser();
        const userData = userRes.data;
        setProfile({
          name: userData.name || '',
          email: userData.email,
          course: userData.course || '',
          batch: userData.batch || '',
          company: userData.company || '',
          role: userData.role || '',
          institution_id: userData.institution_id,
          profile_pic: userData.profile_pic || ''
        });

        if (userData.institution_id) {
          const instRes = await institutionService.getMy();
          setInstitution(instRes.data);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) { // 1MB limit for Base64 efficiency
          alert("Image is too large. Please select an image under 1MB.");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profile_pic: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const updateData = {
        name: profile.name,
        profile_pic: profile.profile_pic
      };

      // Only include alumni fields for alumni
      if (!isAdmin) {
        updateData.course = profile.course;
        updateData.batch = profile.batch;
        updateData.company = profile.company;
      }

      await authService.updateProfile(updateData);
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error saving profile: " + (err.response?.data?.msg || "Server error"));
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 flex flex-col items-center justify-center animate-pulse"><div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div><p className="text-sm font-bold text-outline">Loading profile...</p></div>;

  return (
    <main className="flex-1 p-6 md:p-10 bg-surface-container-lowest">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-4xl font-black text-on-surface tracking-tighter">Profile Settings</h2>
                <p className="text-on-surface-variant mt-2 max-w-2xl">
                    {isAdmin 
                        ? "Manage your administrative identity and institutional oversight." 
                        : "Manage your professional identity and how you appear to fellow alumni."}
                </p>
            </div>
            {isAdmin && (
                <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">verified_user</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Certified Administrator</span>
                </div>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <section className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm border border-surface-container">
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-6 border-8 border-surface-container-lowest shadow-2xl bg-surface-container flex items-center justify-center relative">
                        {profile.profile_pic ? (
                            <img src={profile.profile_pic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[80px] text-outline opacity-40">person</span>
                        )}
                        <label htmlFor="profile-upload" className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all">
                            <span className="material-symbols-outlined text-sm">camera_alt</span>
                            <input 
                              id="profile-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageChange}
                            />
                        </label>
                    </div>
                    <h3 className="text-2xl font-black text-on-surface">{profile.name || "Set Your Name"}</h3>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] mt-1">{profile.role.replace('_', ' ')}</p>
                    
                    {institution && (
                        <div className="mt-8 w-full p-4 bg-surface-container-low rounded-2xl text-left space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-outline">Institution</span>
                            <p className="text-xs font-bold text-on-surface truncate">{institution.name}</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="lg:col-span-8">
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-surface-container">
                    <form className="space-y-10" onSubmit={handleSave}>
                        {/* Section: Personal */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 border-b border-surface-container pb-4">
                                <span className="material-symbols-outlined text-primary">account_circle</span>
                                <h4 className="text-lg font-black text-on-surface tracking-tight">Identity Details</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1 group-focus-within:text-primary transition-colors">Full Name</label>
                                    <input 
                                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold" 
                                      type="text" 
                                      name="name"
                                      placeholder="e.g. John Doe"
                                      value={profile.name}
                                      onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Primary Email</label>
                                    <input 
                                      className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 transition-all text-on-surface-variant cursor-not-allowed opacity-60 font-medium" 
                                      type="email" 
                                      value={profile.email}
                                      disabled
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Institutional (Admin Only) */}
                        {isAdmin && institution && (
                            <div className="space-y-6 pt-2 animate-fade-in">
                                <div className="flex items-center gap-3 border-b border-surface-container pb-4">
                                    <span className="material-symbols-outlined text-primary">account_balance</span>
                                    <h4 className="text-lg font-black text-on-surface tracking-tight">Organizational Access</h4>
                                </div>
                                <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Managed Institution</p>
                                            <p className="text-sm font-bold text-on-surface">{institution.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">Join Code</p>
                                            <p className="text-sm font-mono font-bold text-on-surface tracking-widest">{institution.join_code}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant mt-6 leading-relaxed italic">
                                        You are registered as the primary administrator for this institution. Institutional details can be modified in the Admin Management section.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Section: Alumni (Alumni Only) */}
                        {!isAdmin && (
                            <>
                                <div className="space-y-6 pt-2">
                                    <div className="flex items-center gap-3 border-b border-surface-container pb-4">
                                        <span className="material-symbols-outlined text-primary">school</span>
                                        <h4 className="text-lg font-black text-on-surface tracking-tight">Academic History</h4>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Course / Major</label>
                                            <input 
                                              className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold" 
                                              type="text" 
                                              name="course"
                                              placeholder="e.g. B.Tech Computer Science"
                                              value={profile.course}
                                              onChange={handleChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Batch Year</label>
                                            <input 
                                                className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold" 
                                                type="text" 
                                                name="batch"
                                                placeholder="e.g. 2018-2022"
                                                value={profile.batch}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 pt-2">
                                    <div className="flex items-center gap-3 border-b border-surface-container pb-4">
                                        <span className="material-symbols-outlined text-primary">work</span>
                                        <h4 className="text-lg font-black text-on-surface tracking-tight">Employment Stack</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Current Company</label>
                                        <input 
                                            className="w-full bg-surface-container-low border-none rounded-2xl py-4 px-5 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-semibold" 
                                            type="text" 
                                            name="company"
                                            placeholder="e.g. Google"
                                            value={profile.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-10">
                            <button 
                                disabled={saving} 
                                className="w-full bg-primary text-white py-5 px-8 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-primary/30 hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-50" 
                                type="submit"
                            >
                                {saving ? "Synchronizing..." : "Save Profile Details"}
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
