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
  const [previewImage, setPreviewImage] = useState('');

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
        setPreviewImage(userData.profile_pic || '');

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
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
           // Create a canvas to resize/compress
           const canvas = document.createElement('canvas');
           const MAX_WIDTH = 400;
           const MAX_HEIGHT = 400;
           let width = img.width;
           let height = img.height;

           if (width > height) {
             if (width > MAX_WIDTH) {
               height *= MAX_WIDTH / width;
               width = MAX_WIDTH;
             }
           } else {
             if (height > MAX_HEIGHT) {
               width *= MAX_HEIGHT / height;
               height = MAX_HEIGHT;
             }
           }

           canvas.width = width;
           canvas.height = height;
           const ctx = canvas.getContext('2d');
           ctx.drawImage(img, 0, 0, width, height);
           
           // Convert to smaller Base64 (JPEG with 0.7 quality)
           const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
           setPreviewImage(compressedBase64);
           setProfile(prev => ({ ...prev, profile_pic: compressedBase64 }));
        };
        img.src = reader.result;
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <h2 className="text-4xl font-black text-on-surface tracking-tighter">Profile Settings</h2>
                <p className="text-on-surface-variant mt-2 max-w-2xl">
                    {isAdmin 
                        ? "Institution Control & Administrative Identity" 
                        : "Professional Identity & Network Presence"}
                </p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Redesigned Profile Card */}
            <section className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center shadow-2xl shadow-indigo-500/5 border border-surface-container relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary to-indigo-600 opacity-10"></div>
                    
                    <div className="relative z-10 w-44 h-44 rounded-[2rem] overflow-hidden border-8 border-white shadow-xl bg-surface-container flex items-center justify-center group/img mt-4">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="material-symbols-outlined text-[80px] text-outline opacity-40">person</span>
                        )}
                        <label htmlFor="profile-upload" className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-[2px]">
                            <span className="material-symbols-outlined text-3xl mb-1">photo_camera</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
                            <input 
                              id="profile-upload" 
                              type="file" 
                              accept="image/*" 
                              className="hidden" 
                              onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    <div className="text-center mt-8 space-y-2 relative z-10">
                        <h3 className="text-2xl font-black text-on-surface tracking-tight leading-none">{profile.name || "Set Your Name"}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{profile.role.replace('_', ' ')}</p>
                    </div>

                    {institution && (
                        <div className="mt-10 w-full p-6 bg-surface-container-low rounded-3xl text-left border border-surface-container relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-sm">hub</span>
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-outline">Network Base</span>
                            </div>
                            <p className="text-sm font-bold text-on-surface leading-snug">{institution.name}</p>
                            <div className="mt-4 pt-4 border-t border-surface-container flex justify-between items-center">
                                <span className="text-[9px] font-bold text-outline uppercase tracking-widest">Join Code</span>
                                <span className="text-xs font-mono font-black text-primary">{institution.join_code}</span>
                            </div>
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
