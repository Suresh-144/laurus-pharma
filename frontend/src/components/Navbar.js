// components/Navbar.js
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container flex-between" style={{ height: '100%' }}>

        {/* Brand */}
        <Link to="/" className="navbar__brand" onClick={() => setOpen(false)}>
          <span className="navbar__leaf">✦</span> Laurus
        </Link>

        {/* Desktop links */}
        <div className="navbar__links">
          <NavLink to="/"         end  className={({isActive}) => isActive ? 'nl active' : 'nl'}>Home</NavLink>
          <NavLink to="/products"      className={({isActive}) => isActive ? 'nl active' : 'nl'}>Products</NavLink>
          <NavLink to="/contact"       className={({isActive}) => isActive ? 'nl active' : 'nl'}>Contact</NavLink>
          {isAdmin && <NavLink to="/admin" className={({isActive}) => isActive ? 'nl active nl--admin' : 'nl nl--admin'}>Admin</NavLink>}
        </div>

        {/* Auth */}
        <div className="navbar__auth">
          {user ? (
            <>
              <span className="navbar__user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Log in</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className={`navbar__burger ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span/><span/><span/>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="navbar__drawer">
          <NavLink to="/"         end  onClick={() => setOpen(false)} className="nd">Home</NavLink>
          <NavLink to="/products"      onClick={() => setOpen(false)} className="nd">Products</NavLink>
          <NavLink to="/contact"       onClick={() => setOpen(false)} className="nd">Contact</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={() => setOpen(false)} className="nd">Admin Panel</NavLink>}
          <div style={{marginTop:'1rem', display:'flex', gap:'.75rem'}}>
            {user
              ? <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
              : <><Link to="/login"    className="btn btn-outline btn-sm" onClick={() => setOpen(false)}>Log in</Link>
                  <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>Register</Link></>
            }
          </div>
        </div>
      )}
    </nav>
  );
}
