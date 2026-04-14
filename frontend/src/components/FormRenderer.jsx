import { useState } from 'react';

export default function FormRenderer({ config = [], onSubmit, loading, profile }) {
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
    if (errors[id]) {
        const newErrors = { ...errors };
        delete newErrors[id];
        setErrors(newErrors);
    }
  };

  const handleCheckboxChange = (id, option, checked) => {
    const current = answers[id] || [];
    let updated;
    if (checked) {
        updated = [...current, option];
    } else {
        updated = current.filter(o => o !== option);
    }
    handleChange(id, updated);
  };

  const validate = () => {
    const newErrors = {};
    config.forEach(q => {
      if (q.required && (!answers[q.id] || (Array.isArray(answers[q.id]) && answers[q.id].length === 0))) {
        newErrors[q.id] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(answers);
    }
  };

  return (
    <div className="space-y-10">
      <header className="border-b border-surface-container pb-6">
        <h4 className="text-2xl font-bold mb-2">Registration Form</h4>
        <p className="text-on-surface-variant text-sm">Please provide the details requested by the organizer below.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {profile && (
          <>
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <label className="block text-sm font-bold text-on-surface">Full Name <span className="text-error ml-1">*</span></label>
              <input 
                disabled
                value={profile.name || 'User'}
                className="w-full bg-surface-container-lowest border-2 border-surface-container rounded-2xl py-4 px-6 text-on-surface-variant cursor-not-allowed opacity-70"
              />
            </div>
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <label className="block text-sm font-bold text-on-surface">Email Address <span className="text-error ml-1">*</span></label>
              <input 
                disabled
                value={profile.email || 'No email provided'}
                className="w-full bg-surface-container-lowest border-2 border-surface-container rounded-2xl py-4 px-6 text-on-surface-variant cursor-not-allowed opacity-70"
              />
            </div>
          </>
        )}

        {config.map(q => (
          <div key={q.id} className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
            <label className="block text-sm font-bold text-on-surface">
              {q.label}
              {q.required && <span className="text-error ml-1">*</span>}
            </label>
            
            <div className="relative">
              {q.type === 'text' && (
                <input 
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`w-full bg-surface-container-low border-2 rounded-2xl py-4 px-6 focus:ring-4 transition-all ${errors[q.id] ? 'border-error ring-error/10' : 'border-transparent focus:ring-primary/10 focus:bg-surface-container-lowest'}`}
                  placeholder="Enter your answer"
                />
              )}

              {q.type === 'textarea' && (
                <textarea 
                  rows="4"
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`w-full bg-surface-container-low border-2 rounded-2xl py-4 px-6 focus:ring-4 transition-all ${errors[q.id] ? 'border-error ring-error/10' : 'border-transparent focus:ring-primary/10 focus:bg-surface-container-lowest'}`}
                  placeholder="Type your response here..."
                ></textarea>
              )}

              {q.type === 'dropdown' && (
                <select 
                  value={answers[q.id] || ''}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={`w-full bg-surface-container-low border-2 rounded-2xl py-4 px-6 focus:ring-4 transition-all appearance-none ${errors[q.id] ? 'border-error ring-error/10' : 'border-transparent focus:ring-primary/10 focus:bg-surface-container-lowest'}`}
                >
                  <option value="">Select an option</option>
                  {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}

              {q.type === 'radio' && (
                <div className="space-y-3 p-4 bg-surface-container-low rounded-2xl">
                  {q.options.map(o => (
                    <label key={o} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="radio"
                        name={q.id}
                        checked={answers[q.id] === o}
                        onChange={() => handleChange(q.id, o)}
                        className="w-5 h-5 text-primary border-surface-container-high focus:ring-primary"
                      />
                      <span className="text-on-surface group-hover:text-primary transition-colors">{o}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.type === 'checkbox' && (
                <div className="space-y-3 p-4 bg-surface-container-low rounded-2xl">
                  {q.options.map(o => (
                    <label key={o} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox"
                        checked={(answers[q.id] || []).includes(o)}
                        onChange={(e) => handleCheckboxChange(q.id, o, e.target.checked)}
                        className="w-5 h-5 text-primary border-surface-container-high rounded focus:ring-primary"
                      />
                      <span className="text-on-surface group-hover:text-primary transition-colors">{o}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {errors[q.id] && (
              <p className="text-xs text-error font-medium flex items-center gap-1 animate-bounce">
                <span className="material-symbols-outlined text-sm">warning</span>
                {errors[q.id]}
              </p>
            )}
          </div>
        ))}

        <div className="pt-6 border-t border-surface-container">
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
                <>Submit & Register <span className="material-symbols-outlined">arrow_forward</span></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
