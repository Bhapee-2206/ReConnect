import { useEffect, useState } from 'react';
import { announcementService } from '../services/api';
import { useOutletContext } from 'react-router-dom';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);
  
  const { profile } = useOutletContext();
  const isAdmin = profile?.role === 'college_admin';

  async function fetchAnnouncements() {
    if (!profile?.institution_id) {
        setLoading(false);
        return;
    }
    try {
      const response = await announcementService.getAll();
      setAnnouncements(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, [profile]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await announcementService.create(newTitle, newContent);
      setShowModal(false);
      setNewTitle('');
      setNewContent('');
      fetchAnnouncements();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error posting announcement');
    }
    setCreating(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
            <span className="text-[10px] font-bold text-indigo-700 tracking-[0.2em] uppercase mb-2 block">Network Updates</span>
            <h2 className="text-4xl font-bold text-on-surface tracking-tight mb-2">Announcements</h2>
            <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">
                Stay informed with the latest news, success stories, and critical updates from the ReConnect alumni community.
            </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-200/50 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Post Announcement
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-surface-container-lowest rounded-[2rem] w-full max-w-2xl p-8 editorial-shadow">
            <h3 className="text-2xl font-bold mb-6">New Announcement</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Title</label>
                <input 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Content</label>
                <textarea 
                  required
                  rows="5"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/20"
                ></textarea>
              </div>
              <div className="flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 rounded-xl font-bold text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating}
                  className="px-8 py-2 bg-primary text-white rounded-xl font-bold editorial-shadow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {creating ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading announcements...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {announcements.length > 0 ? (
                <div className="md:col-span-12 flex flex-col gap-8">
                    {announcements.map((announcement) => (
                        <article key={announcement.id} className="bg-surface-container-low rounded-[2rem] p-8 transition-colors hover:bg-surface-container-high cursor-pointer editorial-shadow">
                            <time className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3 block">
                                {new Date(announcement.created_at).toLocaleDateString()}
                            </time>
                            <h4 className="text-xl font-bold text-on-surface mb-3">{announcement.title}</h4>
                            <p className="text-on-surface-variant text-sm whitespace-pre-wrap">{announcement.content}</p>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="md:col-span-12 text-center py-10 text-on-surface-variant">No announcements available.</div>
            )}
        </div>
      )}
    </div>
  );
}
