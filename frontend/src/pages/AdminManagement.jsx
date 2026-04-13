import { useState, useEffect } from 'react';
import { alumniService, institutionService } from '../services/api';
import { useOutletContext } from 'react-router-dom';

export default function AdminManagement() {
  const { profile } = useOutletContext();
  const [email, setEmail] = useState('');
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [institution, setInstitution] = useState(null);
  const [copied, setCopied] = useState(false);

  async function fetchInstitution() {
    if (!profile?.institution_id) return;
    try {
      const res = await institutionService.getMy();
      setInstitution(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchInvitations() {
    if (!profile?.institution_id) return;
    try {
      const response = await alumniService.getInvitations();
      setInvitations(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchInstitution();
    fetchInvitations();
  }, [profile]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await alumniService.invite(email);
      alert("Invitation sent successfully!");
      setEmail('');
      fetchInvitations();
    } catch (err) {
      alert(err.response?.data?.msg || "Error inviting alumnus");
    }
    setLoading(false);
  };

  const handleCopyCode = () => {
    if (institution?.join_code) {
      navigator.clipboard.writeText(institution.join_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10">
      <header>
        <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Institution Admin</h2>
        <p className="text-on-surface-variant">Manage your institution and invite alumni to join the network.</p>
      </header>

      {/* Join Code Card */}
      {institution?.join_code && (
        <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 text-white editorial-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">Your Institution Join Code</p>
              <div className="text-3xl md:text-4xl font-black tracking-[0.3em] font-mono">{institution.join_code}</div>
              <p className="text-indigo-200 text-sm max-w-md">
                Share this code with your alumni. They can use it during registration to join <strong className="text-white">{institution.name}</strong>.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shrink-0 ${
                copied 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white/15 text-white border border-white/20 hover:bg-white/25 backdrop-blur-sm'
              }`}
            >
              <span className="material-symbols-outlined text-base">{copied ? 'check' : 'content_copy'}</span>
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </section>
      )}

      {/* Invite Alumni */}
      <section className="bg-surface-container-low rounded-3xl p-8 editorial-shadow">
        <h3 className="text-xl font-bold mb-6">Invite Alumni by Email</h3>
        <form onSubmit={handleInvite} className="flex flex-col md:flex-row gap-4">
          <input 
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alumni@email.com"
            className="flex-1 bg-surface-container-lowest border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary/20"
          />
          <button 
            type="submit"
            disabled={loading}
            className="px-10 py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Alumnus'}
          </button>
        </form>
      </section>

      {/* Invitations Table */}
      <section>
        <h3 className="text-xl font-bold mb-6">Recent Invitations</h3>
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden editorial-shadow">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">
                <th className="px-8 py-4">Email</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Sent At</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invitations.map((inv) => (
                <tr key={inv.id} className="border-b border-surface-container last:border-none">
                  <td className="px-8 py-4 font-medium">{inv.email}</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-on-surface-variant">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-8 py-10 text-center text-on-surface-variant">No invitations sent yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
