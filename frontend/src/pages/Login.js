// pages/Login.js
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({...f, [k]: e.target.value}));

  const handleSubmit = async e => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      login(d.user, d.token);
      navigate(d.user.role === 'admin' ? '/admin' : '/');
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card card">
        <div className="auth-brand">✦ Laurus</div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="text-muted mb-3" style={{textAlign:'center'}}>Sign in to your account</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} required autoComplete="email"/>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} required autoComplete="current-password"/>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary btn-full" style={{marginTop:'.5rem'}}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>

        {/* Demo hint */}
        <div className="demo-hint">
          <strong>Demo admin:</strong> admin@laurus.com / admin123
        </div>
      </div>
    </div>
  );
}
