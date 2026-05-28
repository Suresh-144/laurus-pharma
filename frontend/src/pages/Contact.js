// pages/Contact.js
import { useState } from 'react';
import './Contact.css';

const INFO = [
  { icon:'📍', label:'Head Office', val:'Genome Valley, Hyderabad, Telangana 500 078, India' },
  { icon:'📞', label:'Phone', val:'+91 40 2312 1000' },
  { icon:'✉️', label:'Email', val:'info@laurus.com' },
  { icon:'🕐', label:'Business Hours', val:'Mon – Fri: 9 AM – 6 PM IST' },
];

export default function Contact() {
  const [form, setForm]       = useState({ name:'', email:'', subject:'', message:'' });
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => { setForm(f => ({...f,[k]:e.target.value})); setErrors(er => ({...er,[k]:''})); };

  // Client-side validation
  const validate = () => {
    const e = {};
    if (!form.name.trim())                         e.name    = 'Name is required';
    if (!/\S+@\S+\.\S+/.test(form.email))          e.email   = 'Valid email required';
    if (!form.subject.trim())                      e.subject = 'Subject is required';
    if (form.message.trim().length < 10)           e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault(); setApiError(''); setSuccess('');
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const r = await fetch('/api/contact', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setSuccess(d.message);
      setForm({ name:'', email:'', subject:'', message:'' });
    } catch(err) { setApiError(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="contact-page page-enter">
      {/* Header */}
      <div className="contact-header">
        <div className="container">
          <span className="eyebrow" style={{color:'rgba(255,255,255,.6)'}}>Get in Touch</span>
          <h1 style={{color:'#fff',marginBottom:'.5rem'}}>Contact Us</h1>
          <p style={{color:'rgba(255,255,255,.65)',maxWidth:'480px'}}>
            Whether you're a healthcare professional, distributor, or researcher — we're here to help.
          </p>
        </div>
      </div>

      <div className="container" style={{padding:'3rem 1.5rem'}}>
        <div className="contact-grid">

          {/* Info panel */}
          <div>
            <h3 style={{marginBottom:'1.5rem'}}>Reach Out Directly</h3>
            <div style={{display:'flex',flexDirection:'column',gap:'1.25rem',marginBottom:'2rem'}}>
              {INFO.map(i => (
                <div key={i.label} className="info-row">
                  <span className="info-icon">{i.icon}</span>
                  <div>
                    <p style={{fontFamily:'var(--font-head)',fontSize:'.75rem',fontWeight:700,color:'var(--muted)',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:'.2rem'}}>{i.label}</p>
                    <p style={{fontSize:'.9rem'}}>{i.val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="map-placeholder">
              <span>📍 Hyderabad, India</span>
            </div>
          </div>

          {/* Form panel */}
          <div className="card" style={{padding:'2rem'}}>
            <h3 style={{marginBottom:'1.5rem'}}>Send a Message</h3>

            {success  && <div className="alert alert-success">{success}</div>}
            {apiError && <div className="alert alert-error">{apiError}</div>}

            <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1.1rem'}} noValidate>
              <div className="grid-2">
                <div className={`field ${errors.name?'error':''}`}>
                  <label>Name</label>
                  <input value={form.name} onChange={set('name')} placeholder="Dr. Jane Smith"/>
                  {errors.name && <span className="err-msg">{errors.name}</span>}
                </div>
                <div className={`field ${errors.email?'error':''}`}>
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="jane@hospital.org"/>
                  {errors.email && <span className="err-msg">{errors.email}</span>}
                </div>
              </div>
              <div className={`field ${errors.subject?'error':''}`}>
                <label>Subject</label>
                <input value={form.subject} onChange={set('subject')} placeholder="Product enquiry / Partnership / Other"/>
                {errors.subject && <span className="err-msg">{errors.subject}</span>}
              </div>
              <div className={`field ${errors.message?'error':''}`}>
                <label>Message</label>
                <textarea value={form.message} onChange={set('message')} placeholder="Please provide as much detail as possible…" rows={5}/>
                {errors.message && <span className="err-msg">{errors.message}</span>}
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Sending…' : 'Send Message →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
