import { useState } from 'react';

const QUESTION_TYPES = [
  { value: 'text', label: 'Short Text', icon: 'short_text' },
  { value: 'textarea', label: 'Long Text', icon: 'notes' },
  { value: 'dropdown', label: 'Dropdown', icon: 'arrow_drop_down_circle' },
  { value: 'radio', label: 'Single Choice', icon: 'radio_button_checked' },
  { value: 'checkbox', label: 'Multiple Choice', icon: 'check_box' },
];

export default function FormBuilder({ questions, setQuestions }) {
  const [activeTab, setActiveTab] = useState('editor');

  const addQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type: 'text',
      label: '',
      required: false,
      options: ['Option 1']
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, updates) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const addOption = (qId) => {
    const q = questions.find(q => q.id === qId);
    updateQuestion(qId, { options: [...q.options, `Option ${q.options.length + 1}`] });
  };

  const updateOption = (qId, index, value) => {
    const q = questions.find(q => q.id === qId);
    const newOptions = [...q.options];
    newOptions[index] = value;
    updateQuestion(qId, { options: newOptions });
  };

  const removeOption = (qId, index) => {
    const q = questions.find(q => q.id === qId);
    updateQuestion(qId, { options: q.options.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex bg-surface-container-high p-1 rounded-xl w-fit">
        <button 
          onClick={(e) => { e.preventDefault(); setActiveTab('editor'); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'editor' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'}`}
        >
          Build Form
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); setActiveTab('preview'); }}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'preview' ? 'bg-primary text-white shadow-md' : 'text-on-surface-variant'}`}
        >
          Live Preview
        </button>
      </div>

      {activeTab === 'editor' ? (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={q.id} className="bg-surface-container-low border border-surface-container p-6 rounded-2xl relative group animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Question {index + 1}</span>
                <button 
                  type="button"
                  onClick={() => removeQuestion(q.id)}
                  className="w-8 h-8 rounded-full hover:bg-error/10 text-error flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant ml-1">Label</label>
                  <input 
                    placeholder="e.g. Dietary Requirements"
                    value={q.label}
                    onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                    className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant ml-1">Type</label>
                  <select 
                    value={q.type}
                    onChange={(e) => updateQuestion(q.id, { type: e.target.value })}
                    className="w-full bg-surface-container-lowest border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20"
                  >
                    {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {(q.type === 'dropdown' || q.type === 'radio' || q.type === 'checkbox') && (
                <div className="space-y-2 mt-4 pl-4 border-l-2 border-surface-container-high">
                  <label className="text-[10px] font-bold uppercase text-on-surface-variant">Options</label>
                  {q.options.map((opt, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                       <input 
                        value={opt}
                        onChange={(e) => updateOption(q.id, optIndex, e.target.value)}
                        className="flex-1 bg-surface-container-lowest border-none rounded-lg py-2 px-3 text-xs"
                      />
                      <button 
                        type="button"
                        disabled={q.options.length <= 1}
                        onClick={() => removeOption(q.id, optIndex)}
                        className="text-error/60 hover:text-error disabled:opacity-0"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline pt-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span> Add Option
                  </button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-end gap-2">
                <span className="text-[10px] font-bold uppercase text-on-surface-variant">Required</span>
                <button 
                  type="button"
                  onClick={() => updateQuestion(q.id, { required: !q.required })}
                  className={`w-10 h-5 rounded-full transition-all relative ${q.required ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${q.required ? 'left-5.5' : 'left-0.5'}`}></div>
                </button>
              </div>
            </div>
          ))}

          <button 
            onClick={(e) => { e.preventDefault(); addQuestion(); }}
            className="w-full py-4 border-2 border-dashed border-surface-container-high rounded-3xl text-on-surface-variant font-bold hover:bg-surface-container-low hover:border-primary/30 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add Another Question
          </button>
        </div>
      ) : (
        <div className="p-8 bg-surface-container-lowest rounded-3xl border border-surface-container space-y-8">
           <h4 className="text-xl font-bold border-b border-surface-container pb-4">Registration Details</h4>
           {questions.length === 0 ? (
             <p className="text-center text-on-surface-variant italic py-10">No questions added yet. Every form starts with Name & Email by default.</p>
           ) : (
             <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 grayscale pointer-events-none">
                   <div>
                     <label className="block text-xs font-bold uppercase tracking-widest mb-2">Participant Name</label>
                     <input disabled className="w-full bg-surface-container-low rounded-xl py-3 px-4" placeholder="Your Full Name" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold uppercase tracking-widest mb-2">Email Address</label>
                     <input disabled className="w-full bg-surface-container-low rounded-xl py-3 px-4" placeholder="name@alumni.edu" />
                   </div>
                </div>
                {questions.map(q => (
                  <div key={q.id}>
                    <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                      {q.label || 'Untitled Question'}
                      {q.required && <span className="text-error ml-1">*</span>}
                    </label>
                    {q.type === 'text' && <input className="w-full bg-surface-container-low rounded-xl py-3 px-4" />}
                    {q.type === 'textarea' && <textarea rows="3" className="w-full bg-surface-container-low rounded-xl py-3 px-4"></textarea>}
                    {q.type === 'dropdown' && (
                      <select className="w-full bg-surface-container-low rounded-xl py-3 px-4">
                        {q.options.map(o => <option key={o}>{o}</option>)}
                      </select>
                    )}
                    {q.type === 'radio' && (
                      <div className="space-y-2">
                        {q.options.map(o => (
                          <div key={o} className="flex items-center gap-2">
                            <input type="radio" className="w-4 h-4 text-primary" />
                            <span className="text-sm">{o}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {q.type === 'checkbox' && (
                      <div className="space-y-2">
                        {q.options.map(o => (
                          <div key={o} className="flex items-center gap-2">
                            <input type="checkbox" className="w-4 h-4 text-primary rounded" />
                            <span className="text-sm">{o}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
}
