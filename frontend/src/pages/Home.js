// pages/Home.js — Landing page
import { Link } from 'react-router-dom';
import './Home.css';

const STATS = [
  { n:'50+',  l:'Years of Research' },
  { n:'200+', l:'Active Compounds' },
  { n:'80+',  l:'Countries Served' },
  { n:'99.8%',l:'Quality Assurance' },
];
const PILLARS = [
  { icon:'🔬', title:'Research-Led Innovation', body:'Over 12% of revenue reinvested annually into drug discovery, API synthesis, and novel delivery systems.' },
  { icon:'🏭', title:'World-Class Manufacturing', body:'GMP-certified facilities in Hyderabad and Visakhapatnam with rigorous quality control at every stage.' },
  { icon:'🌍', title:'Global Distribution', body:'Reaching patients across 80+ countries through partnerships with leading hospital networks and pharmacies.' },
  { icon:'❤️', title:'Patient-First Philosophy', body:'Every molecule we develop is guided by one question: does this meaningfully improve a patient\'s quality of life?' },
  { icon:'🌿', title:'Sustainable Practices', body:'Green chemistry, zero liquid discharge plants, and a commitment to carbon neutrality by 2035.' },
  { icon:'🤝', title:'Trusted Partnerships', body:'Collaborating with WHO, academia, and healthcare systems to ensure equitable access to essential medicines.' },
];

export default function Home() {
  return (
    <div className="home page-enter">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg-circle hero__bg-circle--1" />
        <div className="hero__bg-circle hero__bg-circle--2" />
        <div className="container hero__inner">
          <div className="hero__text">
            <span className="hero__eyebrow">Precision Medicine Since 1974</span>
            <h1 className="hero__h1">
              Science that<br/>
              <em className="hero__accent">heals the world.</em>
            </h1>
            <p className="hero__sub">
              Laurus Pharmaceuticals develops and manufactures high-quality active pharmaceutical
              ingredients and finished dosage forms trusted by clinicians in 80+ countries.
            </p>
            <div className="hero__actions">
              <Link to="/products" className="btn btn-gold">Explore Products</Link>
              <Link to="/contact"  className="btn btn-outline" style={{borderColor:'rgba(255,255,255,.5)',color:'#fff'}}>Contact Us</Link>
            </div>
          </div>
          <div className="hero__visual">
            <div className="hero__pill-stack">
              {['💊','🧬','🔬','🌿','❤️'].map((e,i) => (
                <div key={i} className="hpill" style={{animationDelay:`${i*.18}s`}}>{e}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-bar__grid">
            {STATS.map(s => (
              <div key={s.l} className="stat">
                <span className="stat__n">{s.n}</span>
                <span className="stat__l">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="section mission">
        <div className="container">
          <div className="grid-2" style={{alignItems:'center', gap:'4rem'}}>
            <div>
              <span className="eyebrow">Our Mission</span>
              <h2 style={{marginBottom:'1.25rem'}}>Making life-saving medicines accessible to everyone</h2>
              <p style={{color:'var(--muted)',lineHeight:1.8,marginBottom:'1rem'}}>
                Founded in Hyderabad in 1974, Laurus has grown from a small API manufacturer into
                a fully integrated pharmaceutical company operating across the entire drug value chain —
                from raw material synthesis to branded formulations.
              </p>
              <p style={{color:'var(--muted)',lineHeight:1.8,marginBottom:'1.75rem'}}>
                Our portfolio spans oncology, cardiovascular, anti-retroviral, and metabolic therapies,
                with a pipeline of over 40 molecules in various stages of regulatory review.
              </p>
              <Link to="/products" className="btn btn-primary">Browse Catalogue →</Link>
            </div>
            <div className="mission__cards">
              {[
                { n:'FDA',  l:'Approved Facilities',  c:'🏛️' },
                { n:'WHO',  l:'Prequalified Products', c:'🌐' },
                { n:'ISO',  l:'9001:2015 Certified',   c:'✅' },
              ].map(c => (
                <div key={c.n} className="cert-card">
                  <span style={{fontSize:'1.75rem'}}>{c.c}</span>
                  <div>
                    <strong style={{fontFamily:'var(--font-head)'}}>{c.n}</strong>
                    <p style={{fontSize:'.82rem',color:'var(--muted)'}}>{c.l}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="section pillars">
        <div className="container">
          <div className="text-center mb-3">
            <span className="eyebrow">Why Laurus</span>
            <h2>Built on six core pillars</h2>
          </div>
          <div className="grid-3">
            {PILLARS.map((p,i) => (
              <div key={i} className="pillar card" style={{animationDelay:`${i*.07}s`}}>
                <span className="pillar__icon">{p.icon}</span>
                <h3 className="pillar__title">{p.title}</h3>
                <p className="pillar__body">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-strip">
        <div className="container flex-between" style={{flexWrap:'wrap',gap:'1.5rem'}}>
          <div>
            <h2 style={{color:'#fff',marginBottom:'.4rem'}}>Ready to partner with Laurus?</h2>
            <p style={{color:'rgba(255,255,255,.7)'}}>Our business development team is here to help.</p>
          </div>
          <div style={{display:'flex',gap:'1rem'}}>
            <Link to="/contact"  className="btn btn-gold">Get in Touch</Link>
            <Link to="/products" className="btn btn-outline" style={{borderColor:'rgba(255,255,255,.5)',color:'#fff'}}>Our Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
