import { useState } from 'react';
import { institutionService } from '../services/api';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function Onboarding() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [joinCode, setJoinCode] = useState(null);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await institutionService.create(name);
      setJoinCode(res.data.join_code);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating institution');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(joinCode);
    alert('Join code copied to clipboard!');
  };

  const handleContinue = () => {
    window.location.reload();
  };

  // Show join code after institution is created
  if (joinCode) {
    return (
      <div className="p-8 max-w-2xl mx-auto mt-20">
        <div className="bg-surface-container-lowest p-10 rounded-[2rem] editorial-shadow text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 text-4xl">check_circle</span>
          </div>
          <h2 className="text-3xl font-black text-on-surface">Institution Created!</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Share this unique join code with your alumni so they can register and join your institution directly.
          </p>

          {/* Join Code Display */}
          <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 rounded-2xl p-8 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Institution Join Code</p>
            <div className="text-4xl font-black tracking-[0.4em] text-indigo-700 font-mono">
              {joinCode}
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-xs hover:bg-indigo-200 transition-colors"
            >
              <span className="material-symbols-outlined text-base">content_copy</span>
              Copy Code
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-amber-600 text-lg mt-0.5">warning</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Keep this code safe!</strong> You can always find it in the Admin Management page. Alumni will need this code to register and join your institution.
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-4 primary-gradient text-white font-bold rounded-xl editorial-shadow hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            Continue to Dashboard
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-2xl mx-auto mt-20">
      <div className="bg-surface-container-lowest p-10 rounded-[2rem] editorial-shadow text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
          <span className="material-symbols-outlined text-indigo-600 text-3xl">apartment</span>
        </div>
        <h2 className="text-3xl font-black text-on-surface mb-4">Register your Institution</h2>
        <p className="text-on-surface-variant mb-8">
          You haven't joined an institution yet. Create one to start managing your alumni network. A unique join code will be generated for your alumni.
        </p>
        
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="text-left">
            <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2 ml-1">
              Institution Name
            </label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Stanford University"
              className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 primary-gradient text-white font-bold rounded-xl editorial-shadow hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                Creating...
              </>
            ) : (
              <>
                Launch Institution
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
