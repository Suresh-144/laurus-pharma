// pages/Register.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ name:'', email:'', password:'', confirm:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6)       return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      login(d.user, d.token);
      navigate('/');
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card card">
        <div className="auth-brand">✦ Laurus</div>
        <h2 className="auth-title">Create account</h2>
        <p className="text-muted mb-3" style={{textAlign:'center'}}>Join the Laurus platform</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="field">
            <label>Full Name</label>
            <input value={form.name} onChange={set('name')} required maxLength={60}/>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} required autoComplete="email"/>
          </div>
          <div className="field">
            <label>Password <span style={{fontWeight:400,textTransform:'none'}}>(min 6 chars)</span></label>
            <input type="password" value={form.password} onChange={set('password')} required autoComplete="new-password"/>
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password"/>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{marginTop:'.5rem'}}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>

        <p className="auth-switch">Already have an account? <Link to="/login">Log In</Link></p>
      </div>
    </div>
  );
}
