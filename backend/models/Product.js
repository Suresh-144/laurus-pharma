// models/Product.js — Pharmaceutical product schema
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true, maxlength: 120 },
  category:    { 
    type: String, required: true,
    enum: ['Antibiotics','Cardiovascular','Diabetes','Neurology','Oncology','Vitamins','Other']
  },
  description: { type: String, required: true, maxlength: 800 },
  usage:       { type: String, required: true, maxlength: 600 },
  dosage:      { type: String, default: '' },
  price:       { type: Number, required: true, min: 0 },
  inStock:     { type: Boolean, default: true },
  rxRequired:  { type: Boolean, default: false }, // prescription required?
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
