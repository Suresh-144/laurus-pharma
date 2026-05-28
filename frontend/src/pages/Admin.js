// pages/Admin.js — Full product management (admin only)
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const CATS = ['Antibiotics','Cardiovascular','Diabetes','Neurology','Oncology','Vitamins','Other'];
const EMPTY = { name:'', category:'Antibiotics', description:'', usage:'', dosage:'', price:'', inStock:true, rxRequired:false };

export default function Admin() {
  const { user, authFetch } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing,  setEditing]  = useState(null); // null = create mode
  const [form, setForm]         = useState(EMPTY);
  const [formErr, setFormErr]   = useState('');
  const [saving, setSaving]     = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [msg, setMsg]           = useState('');

  // Load all products (admin sees all)
  const load = useCallback(async () => {
    setLoading(true);
    const r = await fetch('/api/products?limit=100');
    const d = await r.json();
    setProducts(d.products || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const flash = text => { setMsg(text); setTimeout(() => setMsg(''), 3500); };

  const openCreate = () => { setEditing(null); setForm(EMPTY); setFormErr(''); setFormOpen(true); };
  const openEdit   = p  => {
    setEditing(p._id);
    setForm({ name:p.name, category:p.category, description:p.description,
              usage:p.usage, dosage:p.dosage||'', price:p.price, inStock:p.inStock, rxRequired:p.rxRequired });
    setFormErr(''); setFormOpen(true);
  };
  const closeForm  = () => { setFormOpen(false); setEditing(null); };

  const set = k => e => setForm(f => ({...f, [k]: e.target.type==='checkbox' ? e.target.checked : e.target.value}));

  const handleSave = async e => {
    e.preventDefault(); setFormErr(''); setSaving(true);
    try {
      const body = { ...form, price: parseFloat(form.price) };
      const url  = editing ? `/api/products/${editing}` : '/api/products';
      const r    = await authFetch(url, { method: editing ? 'PUT' : 'POST', body });
      const d    = await r.json();
      if (!r.ok) throw new Error(d.error);
      flash(editing ? 'Product updated ✓' : 'Product created ✓');
      closeForm(); load();
    } catch(e) { setFormErr(e.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this product permanently?')) return;
    setDeleteId(id);
    try {
      const r = await authFetch(`/api/products/${id}`, { method:'DELETE' });
      if (!r.ok) { const d = await r.json(); throw new Error(d.error); }
      flash('Product deleted');
      load();
    } catch(e) { alert(e.message); }
    finally { setDeleteId(null); }
  };

  return (
    <div className="admin-page page-enter">
      {/* Header */}
      <div className="admin-header">
        <div className="container flex-between" style={{flexWrap:'wrap',gap:'1rem'}}>
          <div>
            <h1 style={{color:'#fff',marginBottom:'.2rem'}}>Admin Panel</h1>
            <p style={{color:'rgba(255,255,255,.65)',fontSize:'.9rem'}}>Logged in as <strong style={{color:'#fff'}}>{user?.name}</strong></p>
          </div>
          <button className="btn btn-gold" onClick={openCreate}>+ Add Product</button>
        </div>
      </div>

      <div className="container" style={{padding:'2rem 1.5rem 3rem'}}>
        {msg && <div className="alert alert-success">{msg}</div>}

        {/* ── Product Form Modal ── */}
        {formOpen && (
          <div className="modal-overlay" onClick={e => e.target===e.currentTarget && closeForm()}>
            <div className="modal-box card">
              <div className="flex-between" style={{marginBottom:'1.5rem'}}>
                <h2 style={{fontSize:'1.3rem'}}>{editing ? 'Edit Product' : 'New Product'}</h2>
                <button onClick={closeForm} style={{fontSize:'1.4rem',color:'var(--muted)',lineHeight:1}}>×</button>
              </div>

              {formErr && <div className="alert alert-error">{formErr}</div>}

              <form onSubmit={handleSave} style={{display:'flex',flexDirection:'column',gap:'1rem'}}>
                <div className="grid-2">
                  <div className="field">
                    <label>Product Name *</label>
                    <input value={form.name} onChange={set('name')} required maxLength={120}/>
                  </div>
                  <div className="field">
                    <label>Category *</label>
                    <select value={form.category} onChange={set('category')}>
                      {CATS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field">
                  <label>Description * (max 800 chars)</label>
                  <textarea value={form.description} onChange={set('description')} required maxLength={800} rows={3}/>
                </div>

                <div className="field">
                  <label>Usage Instructions * (max 600 chars)</label>
                  <textarea value={form.usage} onChange={set('usage')} required maxLength={600} rows={2}/>
                </div>

                <div className="grid-2">
                  <div className="field">
                    <label>Dosage Form</label>
                    <input value={form.dosage} onChange={set('dosage')} placeholder="e.g. 500mg tablet"/>
                  </div>
                  <div className="field">
                    <label>Price (USD) *</label>
                    <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} required/>
                  </div>
                </div>

                <div style={{display:'flex',gap:'2rem'}}>
                  <label style={{display:'flex',alignItems:'center',gap:'.5rem',cursor:'pointer',fontSize:'.9rem'}}>
                    <input type="checkbox" checked={form.inStock} onChange={set('inStock')}/> In Stock
                  </label>
                  <label style={{display:'flex',alignItems:'center',gap:'.5rem',cursor:'pointer',fontSize:'.9rem'}}>
                    <input type="checkbox" checked={form.rxRequired} onChange={set('rxRequired')}/> Prescription Required
                  </label>
                </div>

                <div style={{display:'flex',gap:'.75rem',marginTop:'.5rem'}}>
                  <button type="submit" disabled={saving} className="btn btn-primary">
                    {saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
                  </button>
                  <button type="button" onClick={closeForm} className="btn btn-outline">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Product Table ── */}
        {loading
          ? <div className="flex-center" style={{height:300}}><div className="spinner"/></div>
          : products.length === 0
            ? <div className="empty-state"><span>📦</span><p>No products yet. Add your first one!</p></div>
            : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Rx</th>
                      <th style={{width:'130px'}}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          <strong>{p.name}</strong>
                          {p.dosage && <span className="tag" style={{marginLeft:'.5rem'}}>{p.dosage}</span>}
                        </td>
                        <td><span className="badge badge-green">{p.category}</span></td>
                        <td style={{fontFamily:'var(--font-head)',fontWeight:700,color:'var(--green)'}}>${p.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge ${p.inStock ? 'badge-green' : 'badge-rx'}`}>
                            {p.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </td>
                        <td>{p.rxRequired ? '✅' : '—'}</td>
                        <td>
                          <div style={{display:'flex',gap:'.5rem'}}>
                            <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>Edit</button>
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={deleteId === p._id}
                              onClick={() => handleDelete(p._id)}
                            >{deleteId === p._id ? '…' : 'Del'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
        }
      </div>
    </div>
  );
}
