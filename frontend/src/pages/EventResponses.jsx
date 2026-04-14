import { useState, useEffect } from 'react';
import { eventService } from '../services/api';

export default function EventResponses({ event, onClose }) {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResponses() {
      try {
        const res = await eventService.getResponses(event.id || event._id);
        setResponses(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchResponses();
  }, [event]);

  // Simple analytics computation
  const totalRegistrations = responses.length;
  const growthRate = responses.filter(r => {
    const today = new Date();
    const regDate = new Date(r.created_at);
    return regDate.toDateString() === today.toDateString();
  }).length;

  // Extract form headers: 
  // If native form exists, use form_config labels. 
  // Otherwise, use keys from the first response (Google Form).
  const isNative = event.has_custom_form && event.form_config?.length > 0;
  
  const headers = isNative 
    ? event.form_config.map(q => ({ id: q.id, label: q.label }))
    : (responses.length > 0 && responses[0].form_responses 
        ? Object.keys(responses[0].form_responses).map(key => ({ id: key, label: key.replace(/_/g, ' ') })) 
        : []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[150] flex items-center justify-center p-4 md:p-10">
      <div className="bg-surface-container-lowest w-full max-w-6xl h-full max-h-[90vh] rounded-[2.5rem] overflow-hidden flex flex-col editorial-shadow">
        
        {/* Header */}
        <header className="p-8 border-b border-surface-container flex justify-between items-center bg-surface-container-low">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">Analytics HUB</span>
              <h2 className="text-2xl font-bold">{event.title}</h2>
            </div>
            <p className="text-on-surface-variant text-sm">
              {isNative ? 'Native ReConnect Registration Intelligence.' : 'Real-time Google Form response analysis.'}
            </p>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full hover:bg-surface-container-high transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-40">Loading analytics...</div>
          ) : (
            <div className="space-y-10">
              
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary text-white p-6 rounded-3xl shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Total Participants</p>
                  <p className="text-4xl font-black">{totalRegistrations}</p>
                </div>
                <div className="bg-surface-container-high p-6 rounded-3xl">
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">New Today</p>
                  <p className="text-4xl font-black">{growthRate}</p>
                </div>
                <div className="bg-emerald-500 text-white p-6 rounded-3xl shadow-lg">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Sync Status</p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-pulse">sync</span>
                    <p className="text-2xl font-bold">Live</p>
                  </div>
                </div>
              </div>

              {/* Responses Table */}
              <section>
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-xl font-bold">Detailed Submissions</h3>
                  <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">download</span>
                    Export CSV
                  </button>
                </div>
                
                <div className="bg-surface-container-low rounded-3xl overflow-hidden border border-surface-container">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-surface-container-high text-[10px] uppercase tracking-widest font-bold text-on-surface-variant">
                          <th className="px-6 py-4">Participant</th>
                          {headers.map(h => (
                            <th key={h.id} className="px-6 py-4">{h.label}</th>
                          ))}
                          <th className="px-6 py-4">Submitted At</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {responses.map((res) => (
                          <tr key={res._id || res.id} className="border-b border-surface-container last:border-none hover:bg-surface-container-lowest transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {res.user_id?.profile_picture ? (
                                  <img src={res.user_id.profile_picture} className="w-8 h-8 rounded-full object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {(res.user_id?.name || 'G').charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold">{res.user_id?.name || 'Guest'}</p>
                                  <p className="text-[10px] text-on-surface-variant">{res.email}</p>
                                </div>
                              </div>
                            </td>
                            {headers.map(h => (
                              <td key={h.id} className="px-6 py-4 text-on-surface-variant">
                                {res.form_responses && res.form_responses[h.id] 
                                  ? (Array.isArray(res.form_responses[h.id]) ? res.form_responses[h.id].join(', ') : String(res.form_responses[h.id]))
                                  : '-'}
                              </td>
                            ))}
                            <td className="px-6 py-4 text-[10px] text-on-surface-variant">
                              {new Date(res.created_at).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        {responses.length === 0 && (
                          <tr>
                            <td colSpan={headers.length + 2} className="px-6 py-20 text-center text-on-surface-variant italic">
                              No submissions received yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
