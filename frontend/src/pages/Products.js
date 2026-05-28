// pages/Products.js — Public product catalogue
import { useState, useEffect, useCallback } from 'react';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = ['All','Antibiotics','Cardiovascular','Diabetes','Neurology','Oncology','Vitamins','Other'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page,  setPage]  = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [query,    setQuery]    = useState(''); // committed search term

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({ page });
      if (query) params.set('search', query);
      if (category !== 'All') params.set('category', category);
      const r = await fetch(`/api/products?${params}`);
      if (!r.ok) throw new Error('Failed to load products');
      const d = await r.json();
      setProducts(d.products); setTotal(d.total); setPages(d.pages);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [page, query, category]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = e => { e.preventDefault(); setQuery(search); setPage(1); };
  const handleCat    = c => { setCategory(c); setPage(1); };

  return (
    <div className="products-page page-enter">
      {/* ── Page header ── */}
      <div className="products-header">
        <div className="container">
          <span className="eyebrow" style={{color:'rgba(255,255,255,.6)'}}>Catalogue</span>
          <h1 style={{color:'#fff',marginBottom:'.5rem'}}>Our Products</h1>
          <p style={{color:'rgba(255,255,255,.65)',maxWidth:'540px'}}>
            Browse our range of pharmaceutical compounds, APIs, and finished formulations.
          </p>
        </div>
      </div>

      <div className="container" style={{paddingTop:'2rem',paddingBottom:'3rem'}}>
        {/* ── Controls ── */}
        <div className="products-controls">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or description…"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="cat-pills">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => handleCat(c)}
                className={`cat-pill ${category === c ? 'active' : ''}`}>{c}</button>
            ))}
          </div>
        </div>

        {/* ── Results info ── */}
        <p className="text-muted mb-2" style={{fontSize:'.88rem'}}>
          {loading ? 'Loading…' : `${total} product${total !== 1 ? 's' : ''} found`}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        {/* ── Grid ── */}
        {loading
          ? <div className="flex-center" style={{height:300}}><div className="spinner"/></div>
          : products.length === 0
            ? <div className="empty-state"><span>🔍</span><p>No products match your search.</p></div>
            : <div className="grid-3">{products.map(p => <ProductCard key={p._id} product={p}/>)}</div>
        }

        {/* ── Pagination ── */}
        {pages > 1 && (
          <div className="pagination">
            <button disabled={page<=1}     onClick={() => setPage(p=>p-1)} className="btn btn-outline btn-sm">← Prev</button>
            <span className="text-muted">Page {page} of {pages}</span>
            <button disabled={page>=pages} onClick={() => setPage(p=>p+1)} className="btn btn-outline btn-sm">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
