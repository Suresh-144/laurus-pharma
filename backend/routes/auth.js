// routes/auth.js — Register, login, get current user
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper: run validators and return 400 on failure
const validate = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });
  return null;
};

// POST /api/auth/register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 60 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be ≥ 6 chars'),
], async (req, res) => {
  const err = validate(req, res); if (err) return;
  try {
    if (await User.findOne({ email: req.body.email }))
      return res.status(409).json({ error: 'Email already in use' });

    const user = await User.create(req.body);
    res.status(201).json({ token: user.signToken(), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password required'),
], async (req, res) => {
  const err = validate(req, res); if (err) return;
  try {
    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user || !(await user.matchPassword(req.body.password)))
      return res.status(401).json({ error: 'Invalid credentials' });

    res.json({ token: user.signToken(), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/auth/me — returns current user (requires token)
router.get('/me', protect, (req, res) => {
  const { _id: id, name, email, role } = req.user;
  res.json({ id, name, email, role });
});

module.exports = router;
