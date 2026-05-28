// pages/Product.js — Single product detail
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ICONS = {
  Antibiotics:'🧬', Cardiovascular:'❤️', Diabetes:'💉',
  Neurology:'🧠', Oncology:'🔬', Vitamins:'🌿', Other:'💊',
};

export default function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then(d => setProduct(d))
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex-center" style={{height:'60vh'}}><div className="spinner"/></div>;
  if (error)   return <div className="container section"><div className="alert alert-error">{error}</div><Link to="/products" className="btn btn-outline mt-2">← Back</Link></div>;

  const { name, category, description, usage, dosage, price, rxRequired, inStock } = product;

  return (
    <div className="page-enter" style={{background:'var(--cream)',minHeight:'80vh'}}>
      {/* Breadcrumb */}
      <div style={{background:'var(--white)',borderBottom:'1px solid var(--border)',padding:'.75rem 0'}}>
        <div className="container" style={{fontSize:'.85rem',color:'var(--muted)'}}>
          <Link to="/products" style={{color:'var(--green)'}}>Products</Link> › {name}
        </div>
      </div>

      <div className="container section-sm">
        <div style={{display:'grid',gridTemplateColumns:'1fr 2fr',gap:'2.5rem',alignItems:'start'}}>

          {/* Left: visual + quick facts */}
          <div>
            <div style={{
              background:'var(--green)',borderRadius:'10px',
              padding:'2.5rem',textAlign:'center',fontSize:'4rem',
              marginBottom:'1.25rem',boxShadow:'0 2px 16px rgba(26,58,46,.10)'
            }}>
              {ICONS[category]||'💊'}
            </div>
            <div className="card" style={{padding:'1.25rem'}}>
              <h3 style={{marginBottom:'.75rem',fontSize:'1rem'}}>Quick Info</h3>
              {[
                ['Category', category],
                ['Price',    `$${price.toFixed(2)}`],
                ['Dosage',   dosage || 'See label'],
                ['Prescription', rxRequired ? 'Required' : 'Not required'],
                ['Availability', inStock ? 'In stock' : 'Out of stock'],
              ].map(([k,v]) => (
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'.5rem 0',borderBottom:'1px solid var(--border)',fontSize:'.88rem'}}>
                  <span style={{color:'var(--muted)'}}>{k}</span>
                  <strong style={{color: k==='Availability' && !inStock ? 'var(--error)' : 'var(--ink)'}}>{v}</strong>
                </div>
              ))}
              <Link to="/contact" className="btn btn-primary btn-full mt-3">Enquire →</Link>
            </div>
          </div>

          {/* Right: details */}
          <div>
            <div style={{display:'flex',gap:'.75rem',flexWrap:'wrap',marginBottom:'1rem'}}>
              <span className="badge badge-green">{category}</span>
              {rxRequired && <span className="badge badge-rx">Prescription Required</span>}
              {!inStock && <span className="badge" style={{background:'#fdf0ee',color:'var(--error)'}}>Out of Stock</span>}
            </div>
            <h1 style={{marginBottom:'.5rem'}}>{name}</h1>
            <p style={{fontFamily:'var(--font-head)',fontSize:'1.75rem',fontWeight:700,color:'var(--green)',marginBottom:'1.5rem'}}>
              ${price.toFixed(2)}
            </p>

            <section style={{marginBottom:'1.75rem'}}>
              <h3 style={{marginBottom:'.6rem',color:'var(--muted)',fontSize:'.75rem',letterSpacing:'.1em',textTransform:'uppercase',fontFamily:'var(--font-head)'}}>Description</h3>
              <p style={{lineHeight:1.8}}>{description}</p>
            </section>

            <section style={{marginBottom:'1.75rem'}}>
              <h3 style={{marginBottom:'.6rem',color:'var(--muted)',fontSize:'.75rem',letterSpacing:'.1em',textTransform:'uppercase',fontFamily:'var(--font-head)'}}>Usage Instructions</h3>
              <p style={{lineHeight:1.8}}>{usage}</p>
            </section>

            {dosage && (
              <section>
                <h3 style={{marginBottom:'.6rem',color:'var(--muted)',fontSize:'.75rem',letterSpacing:'.1em',textTransform:'uppercase',fontFamily:'var(--font-head)'}}>Dosage Form</h3>
                <p>{dosage}</p>
              </section>
            )}

            <div style={{marginTop:'2rem',padding:'1rem 1.25rem',background:'#fef9ec',borderRadius:'10px',border:'1px solid #f0d88a',fontSize:'.85rem',color:'#7a5a10'}}>
              ⚠️ This information is for healthcare professionals only. Always follow your physician's guidance.
            </div>

            <Link to="/products" className="btn btn-outline mt-3">← Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
