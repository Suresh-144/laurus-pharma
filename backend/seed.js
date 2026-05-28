// seed.js — Run once: node seed.js
// Creates an admin user and 8 sample products
require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Product = require('./models/Product');

const products = [
  { name:'Amoxicillin 500mg', category:'Antibiotics', description:'Broad-spectrum penicillin antibiotic effective against many bacterial infections.', usage:'Take one capsule every 8 hours with or without food. Complete the full course.', dosage:'500mg capsule', price:12.50, rxRequired:true },
  { name:'Metformin 850mg', category:'Diabetes', description:'First-line oral medication for type 2 diabetes that lowers blood glucose levels.', usage:'Take with meals to reduce GI side effects. Do not crush or chew tablets.', dosage:'850mg tablet', price:8.75, rxRequired:true },
  { name:'Atorvastatin 20mg', category:'Cardiovascular', description:'Statin medication that reduces LDL cholesterol and risk of cardiovascular events.', usage:'Take once daily at the same time each day. Can be taken with or without food.', dosage:'20mg tablet', price:15.00, rxRequired:true },
  { name:'Vitamin D3 1000IU', category:'Vitamins', description:'Essential fat-soluble vitamin supporting bone health, immune function, and mood.', usage:'Take one tablet daily with a meal containing fat for best absorption.', dosage:'1000IU softgel', price:9.99, rxRequired:false },
  { name:'Salbutamol Inhaler', category:'Other', description:'Short-acting bronchodilator for rapid relief of asthma and bronchospasm symptoms.', usage:'2 puffs as needed, up to 4 times daily. Shake well before use.', dosage:'100mcg/dose', price:22.00, rxRequired:true },
  { name:'Lisinopril 10mg', category:'Cardiovascular', description:'ACE inhibitor for hypertension and heart failure management.', usage:'Take once daily. May cause dizziness initially — rise slowly from sitting.', dosage:'10mg tablet', price:11.25, rxRequired:true },
  { name:'Sertraline 50mg', category:'Neurology', description:'SSRI antidepressant prescribed for depression, anxiety, OCD, and PTSD.', usage:'Take once daily, morning or evening. Full effect seen after 4–6 weeks.', dosage:'50mg tablet', price:18.50, rxRequired:true },
  { name:'Omega-3 Fish Oil 1000mg', category:'Vitamins', description:'High-quality fish oil supplement supporting cardiovascular and brain health.', usage:'Take 2 capsules daily with meals. Store in a cool, dry place after opening.', dosage:'1000mg softgel', price:14.99, rxRequired:false },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laurus');
  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);

  const admin = await User.create({ name:'Admin', email:'admin@laurus.com', password:'admin123', role:'admin' });
  await Product.insertMany(products.map(p => ({ ...p, createdBy: admin._id })));

  console.log('✅ Seed complete');
  console.log('   Admin → admin@laurus.com / admin123');
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
