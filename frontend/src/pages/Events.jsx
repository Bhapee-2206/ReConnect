import { useEffect, useState } from 'react';
import { eventService } from '../services/api';
import { useOutletContext } from 'react-router-dom';
import EventResponses from './EventResponses';
import FormBuilder from '../components/FormBuilder';
import FormRenderer from '../components/FormRenderer';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newLoc, setNewLoc] = useState('');
  const [newFormUrl, setNewFormUrl] = useState('');
  const [newHasCustomForm, setNewHasCustomForm] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const [activeForm, setActiveForm] = useState(null);
  const [activeNativeForm, setActiveNativeForm] = useState(null);
  const [activeResponses, setActiveResponses] = useState(null);

  const { profile } = useOutletContext();
  const isAdmin = profile?.role === 'college_admin';

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventService.getAll();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [profile]);

  const handleEdit = (evt) => {
    setEditingEvent(evt);
    setNewTitle(evt.title);
    setNewDesc(evt.description);
    setNewDate(new Date(evt.date).toISOString().slice(0, 16));
    setNewLoc(evt.location);
    setNewFormUrl(evt.google_form_url || '');
    setNewHasCustomForm(evt.has_custom_form);
    setQuestions(evt.form_config || []);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const payload = {
        title: newTitle,
        description: newDesc,
        date: newDate,
        location: newLoc,
        google_form_url: newFormUrl,
        has_custom_form: newHasCustomForm,
        form_config: questions
      };

      if (editingEvent) {
        await eventService.update(editingEvent.id || editingEvent._id, payload);
      } else {
        await eventService.create(payload);
      }
      
      handleCloseModal();
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.msg || `Error ${editingEvent ? 'updating' : 'creating'} event`);
    } finally {
      setCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    setNewTitle('');
    setNewDesc('');
    setNewDate('');
    setNewLoc('');
    setNewFormUrl('');
    setNewHasCustomForm(false);
    setQuestions([]);
  };

  const handleRegister = async (event) => {
    if (registeringId) return;
    const eventId = event.id || event._id;
    console.log("Registering for event:", eventId);
    setRegisteringId(eventId);
    try {
      await eventService.register(eventId);
      alert("Successfully registered for " + event.title);
      setActiveNativeForm(null);
    } catch (err) {
      alert(err.response?.data?.msg || "Could not register!");
    } finally {
      setRegisteringId(null);
    }
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 md:p-12 editorial-shadow animate-in zoom-in-95 duration-300">
            <h3 className="text-3xl font-black mb-6">{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="p-6 bg-surface-container-low rounded-3xl border border-surface-container">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-bold">Event Registration Type</h4>
                    <p className="text-xs text-on-surface-variant">Choose how you want to collect registration data.</p>
                  </div>
                  <div className="flex bg-surface-container-high p-1 rounded-xl">
                    <button 
                      type="button"
                      onClick={() => { setNewHasCustomForm(false); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${!newHasCustomForm ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'}`}
                    >
                      Standard
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setNewHasCustomForm(true); }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${newHasCustomForm ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'}`}
                    >
                      Custom Native
                    </button>
                  </div>
                </div>
                
                {newHasCustomForm ? (
                   <div className="mt-6 border-t border-surface-container pt-6">
                      <FormBuilder questions={questions} setQuestions={setQuestions} />
                   </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                     <label className="block text-[10px] font-bold uppercase text-on-surface-variant">External Google Form (Optional)</label>
                    <input 
                      placeholder="Paste Google Form link if using one..." 
                      value={newFormUrl} 
                      onChange={(e) => setNewFormUrl(e.target.value)}
                      className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 text-sm" 
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4">
                <button type="button" onClick={handleCloseModal} className="px-6 py-2 rounded-xl text-on-surface-variant">Cancel</button>
                <button type="submit" disabled={creating} className="px-8 py-2 bg-primary text-white rounded-xl font-bold">
                  {creating ? (editingEvent ? 'Updating...' : 'Creating...') : (editingEvent ? 'Save Changes' : 'Create')}
                </button>
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
                <article key={evt.id || evt._id} className="group bg-surface-container-lowest rounded-3xl overflow-hidden hover:shadow-xl transition-all editorial-shadow p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${evt.is_external ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {evt.is_external ? 'External Form' : 'Standard'}
                        </span>
                        {isAdmin && (
                          <button 
                            onClick={() => setActiveResponses(evt)}
                            className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
                            title="View Responses"
                          >
                            <span className="material-symbols-outlined text-lg">analytics</span>
                          </button>
                        )}
                    </div>
                    <h4 className="text-xl font-bold mb-3">{evt.title}</h4>
                    <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{evt.description}</p>
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
                    
                    {isAdmin ? (
                      <button 
                        onClick={() => handleEdit(evt)}
                        className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl shadow-sm hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                        Edit Event
                      </button>
                    ) : (
                      <>
                        {evt.google_form_url ? (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const url = new URL(evt.google_form_url);
                              url.searchParams.append('entry.12345678', profile.email);
                              setActiveForm(url.toString());
                            }}
                            className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl shadow-md hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                          >
                            Register
                          </button>
                        ) : (
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setActiveNativeForm(evt);
                            }}
                            disabled={registeringId === (evt.id || evt._id)}
                            className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {registeringId === (evt.id || evt._id) ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              'Register'
                            )}
                          </button>
                        )}
                      </>
                    )}

                </article>
            ))}
        </div>
      )}

      {/* NATIVE FORM OVERLAY */}
      {activeNativeForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[200] flex items-center justify-end animate-in fade-in duration-500">
            <div className="w-full max-w-2xl h-full bg-surface-container-lowest p-8 md:p-12 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-500">
                <button 
                    onClick={() => setActiveNativeForm(null)}
                    className="mb-8 w-12 h-12 rounded-full hover:bg-surface-container-high flex items-center justify-center transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <FormRenderer 
                    loading={!!registeringId}
                    config={activeNativeForm.form_config || []} 
                    profile={profile}
                    onSubmit={async (responses) => {
                        const eventId = activeNativeForm.id || activeNativeForm._id;
                        setRegisteringId(eventId);
                        try {
                            await eventService.register(eventId, responses);
                            alert("Successfully registered for " + activeNativeForm.title);
                            setActiveNativeForm(null);
                        } catch (err) {
                            alert(err.response?.data?.msg || "Registration failed");
                        } finally {
                          setRegisteringId(null);
                        }
                    }} 
                />
            </div>
        </div>
      )}

      {/* IMMERSIVE FORM MODAL */}
      {activeForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-[200] flex items-center justify-center p-0 md:p-10 animate-in fade-in duration-500">
          <div className="w-full max-w-4xl h-full bg-white rounded-none md:rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative">
            <button 
              onClick={() => setActiveForm(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/10 hover:bg-black/20 rounded-full flex items-center justify-center z-10"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="flex-1">
              <iframe 
                src={activeForm} 
                className="w-full h-full border-none" 
                title="Google Form"
              >
                Loading form...
              </iframe>
            </div>
            <div className="p-4 bg-surface-container-lowest text-center border-t border-surface-container text-xs text-on-surface-variant">
              Submit the form above to complete your registration. ReConnect will sync your response automatically.
            </div>
          </div>
        </div>
      )}

      {/* RESPONSES DASHBOARD MODAL */}
      {activeResponses && (
        <EventResponses 
          event={activeResponses} 
          onClose={() => setActiveResponses(null)} 
        />
      )}
    </div>
  );
}
