// components/Footer.js
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__brand">✦ Laurus</div>
            <p className="footer__tag">Precision medicine for a healthier world.</p>
            <p className="footer__copy text-muted">© {new Date().getFullYear()} Laurus Pharmaceuticals Ltd.</p>
          </div>
          <div>
            <p className="footer__head">Navigate</p>
            <div className="footer__links">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <p className="footer__head">Account</p>
            <div className="footer__links">
              <Link to="/login">Log In</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div>
            <p className="footer__head">Contact</p>
            <div className="footer__links" style={{color:'var(--muted)'}}>
              <span>Hyderabad, Telangana</span>
              <span>info@laurus.com</span>
              <span>+91 40 2312 1000</span>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="text-muted" style={{fontSize:'.8rem'}}>
            All medicines listed are for informational purposes. Consult a licensed physician before use.
          </span>
        </div>
      </div>
    </footer>
  );
}
