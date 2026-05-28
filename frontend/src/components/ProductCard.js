// components/ProductCard.js
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ICONS = {
  Antibiotics:'🧬', Cardiovascular:'❤️', Diabetes:'💉',
  Neurology:'🧠', Oncology:'🔬', Vitamins:'🌿', Other:'💊',
};

export default function ProductCard({ product }) {
  const { _id, name, category, description, price, rxRequired, inStock } = product;
  return (
    <div className="pcard card">
      <div className="pcard__top">
        <span className="pcard__icon">{ICONS[category] || '💊'}</span>
        <div className="pcard__badges">
          <span className="badge badge-green">{category}</span>
          {rxRequired && <span className="badge badge-rx">Rx</span>}
        </div>
      </div>
      <div className="pcard__body">
        <h3 className="pcard__name">{name}</h3>
        <p className="pcard__desc">{description.substring(0,110)}…</p>
      </div>
      <div className="pcard__foot">
        <div>
          <span className="pcard__price">${price.toFixed(2)}</span>
          {!inStock && <span className="badge" style={{background:'#fdf0ee',color:'var(--error)',marginLeft:'.5rem'}}>Out of stock</span>}
        </div>
        <Link to={`/products/${_id}`} className="btn btn-outline btn-sm">View →</Link>
      </div>
    </div>
  );
}
