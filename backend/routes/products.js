// routes/products.js — Public read, admin write
const router  = require('express').Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const validate = (req, res) => {
  const e = validationResult(req);
  if (!e.isEmpty()) return res.status(400).json({ error: e.array()[0].msg });
  return null;
};

const productRules = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 120 }),
  body('category').notEmpty().withMessage('Category required'),
  body('description').trim().notEmpty().withMessage('Description required').isLength({ max: 800 }),
  body('usage').trim().notEmpty().withMessage('Usage required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
];

// GET /api/products — public; supports ?category=&search=&page=
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1 } = req.query;
    const limit = 9; // manageable page size
    const filter = {};
    if (category) filter.category = category;
    if (search)   filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    res.json({ products, total, pages: Math.ceil(total / limit), page: +page });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/products/:id — public
router.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).lean();
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/products — admin only
router.post('/', protect, adminOnly, productRules, async (req, res) => {
  const err = validate(req, res); if (err) return;
  try {
    const p = await Product.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT /api/products/:id — admin only
router.put('/:id', protect, adminOnly, productRules, async (req, res) => {
  const err = validate(req, res); if (err) return;
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json(p);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/products/:id — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
