import { useEffect, useState } from 'react';
import { eventService } from '../services/api';
import { useOutletContext } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLoc, setNewLoc] = useState('');

  const { profile } = useOutletContext();
  const isAdmin = profile?.role === 'college_admin';

  async function fetchEvents() {
    if (!profile?.institution_id) {
        setLoading(false);
        return;
    }
    try {
      const response = await eventService.getAll();
      setEvents(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEvents();
  }, [profile]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    
    try {
      await eventService.create({
        title: newTitle,
        description: newDesc,
        date: newDate,
        location: newLoc
      });
      setShowModal(false);
      setNewTitle('');
      setNewDesc('');
      setNewDate('');
      setNewLoc('');
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.msg || 'Error creating event');
    }
    setCreating(false);
  };

  const handleRegister = async (eventId) => {
    setRegistering(true);
    try {
      await eventService.register(eventId);
      alert("Successfully registered for the event!");
    } catch (err) {
      alert(err.response?.data?.msg || "Could not register!");
    }
    setRegistering(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
                <h2 className="text-4xl font-bold tracking-tight text-on-surface mb-4">Upcoming Events</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed">
                Discover opportunities to reconnect with your peers, share insights, and foster growth within our global alumni community.
                </p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-br from-primary to-primary-container text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-indigo-200/50 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Create Event
              </button>
            )}
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
          <div className="bg-surface-container-lowest rounded-[2rem] w-full max-w-2xl p-8 editorial-shadow my-8">
            <h3 className="text-2xl font-bold mb-6">Create New Event</h3>
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Event Title</label>
                <input required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Description</label>
                <textarea required rows="4" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Date & Time</label>
                  <input required type="datetime-local" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Location</label>
                  <input required value={newLoc} onChange={(e) => setNewLoc(e.target.value)} className="w-full bg-surface-container-low border-none rounded-xl py-3 px-4" />
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 rounded-xl text-on-surface-variant">Cancel</button>
                <button type="submit" disabled={creating} className="px-8 py-2 bg-primary text-white rounded-xl font-bold">{creating ? 'Creating...' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div>Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {events.map((evt) => (
                <article key={evt.id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden hover:shadow-xl transition-all editorial-shadow p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Event</span>
                    </div>
                    <h4 className="text-xl font-bold mb-3">{evt.title}</h4>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-3">{evt.description}</p>
                    <div className="space-y-2 mb-6 mt-auto">
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-base">calendar_month</span>
                            {new Date(evt.date).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                            <span className="material-symbols-outlined text-base">pin_drop</span>
                            {evt.location}
                        </div>
                    </div>
                    <button 
                      onClick={() => handleRegister(evt.id)}
                      disabled={registering}
                      className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                        Register
                    </button>
                </article>
            ))}
            {events.length === 0 && <div className="col-span-full py-10 text-on-surface-variant">No events available.</div>}
        </div>
      )}
    </div>
  );
}
