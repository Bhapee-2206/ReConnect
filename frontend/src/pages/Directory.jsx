import { useEffect, useState } from 'react';
import { alumniService } from '../services/api';
import { useOutletContext, useLocation } from 'react-router-dom';

export default function Directory() {
  const { profile } = useOutletContext();
  const location = useLocation();
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState('All Batches');
  const [course, setCourse] = useState('All Courses');
  const [company, setCompany] = useState('All Companies');

  async function fetchAlumni() {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const querySearch = searchParams.get('search');

      const filters = {};
      if (batch !== 'All Batches') filters.batch = batch;
      if (course !== 'All Courses') filters.course = course;
      if (company !== 'All Companies') filters.company = company;
      if (querySearch) filters.name = querySearch; // Map search to name for now

      const response = await alumniService.getDirectory(filters);
      setAlumni(response.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAlumni();
  }, [location.search]);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchAlumni();
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this person from your institution? They will lose access to all institutional events and announcements.')) return;
    
    try {
      await alumniService.removeAlumnus(id);
      setAlumni(alumni.filter(p => (p._id || p.id) !== id));
      alert('Alumnus removed successfully.');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error removing alumnus');
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <span className="text-[11px] font-bold tracking-[0.15em] text-primary uppercase mb-2 block">Community Network</span>
            <h2 className="text-4xl font-bold text-on-surface tracking-tight leading-tight">Alumni Directory</h2>
            <p className="text-on-surface-variant mt-2 max-w-lg">Discover and reconnect with professionals from your alma mater across the globe.</p>
        </div>
      </div>

      <section className="bg-surface-container-low rounded-3xl p-6 space-y-6">
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Batch Year</label>
                <input 
                  placeholder="e.g. 2022"
                  value={batch === 'All Batches' ? '' : batch}
                  onChange={(e) => setBatch(e.target.value || 'All Batches')}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Course</label>
                <input 
                  placeholder="e.g. CS"
                  value={course === 'All Courses' ? '' : course}
                  onChange={(e) => setCourse(e.target.value || 'All Courses')}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="md:col-span-1">
                <label className="block text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-2 ml-1">Company</label>
                <input 
                  placeholder="e.g. Google"
                  value={company === 'All Companies' ? '' : company}
                  onChange={(e) => setCompany(e.target.value || 'All Companies')}
                  className="w-full bg-surface-container-lowest border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            <div className="md:col-span-1 flex items-end">
                <button type="submit" className="w-full py-3 bg-primary-fixed-dim text-on-primary-fixed-variant font-bold rounded-xl hover:bg-primary-fixed transition-colors">
                    Apply Filters
                </button>
            </div>
        </form>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4].map(i => <div key={i} className="bg-surface-container-low h-80 animate-pulse rounded-[2rem]"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {alumni.map((person) => (
            <div key={person.id || person._id} className="group bg-surface-container-lowest rounded-[2rem] p-4 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 editorial-shadow">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-6 bg-slate-200">
                    {person.profile_pic ? (
                        <img src={person.profile_pic} alt={person.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-50/50 text-indigo-500/20">
                            <span className="material-symbols-outlined text-7xl">school</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] mt-2">No Image</span>
                        </div>
                    )}
                    <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-tertiary-container text-tertiary-fixed text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">{person.role}</span>
                    </div>
                </div>
                <div className="px-2 pb-2">
                    <h3 className="text-xl font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{person.name || 'Unknown User'}</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="material-symbols-outlined text-[14px] text-primary">mail</span>
                        <p className="text-on-surface-variant text-xs font-medium">{person.email}</p>
                    </div>
                    <p className="text-outline text-[11px] font-bold uppercase tracking-wider mt-2">{person.course || 'Alumnus'}</p>
                    
                    <div className="mt-6 flex items-center justify-between border-t border-surface-container pt-4">
                        <div className="space-y-1">
                            <span className="block text-[9px] font-bold text-outline uppercase">Company</span>
                            <span className="block text-xs font-semibold">{person.company || 'N/A'}</span>
                        </div>
                        <div className="space-y-1 text-right">
                            <span className="block text-[9px] font-bold text-outline uppercase">Batch</span>
                            <span className="block text-xs font-semibold">{person.batch || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>
          ))}
          {alumni.length === 0 && <div className="col-span-full text-center py-10 text-on-surface-variant">No alumni found.</div>}
        </div>
      )}
    </div>
  );
}
