// routes/contact.js — Save contact form submissions
const router  = require('express').Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');

router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 chars'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: errors.array()[0].msg });
  try {
    await Contact.create(req.body);
    res.status(201).json({ message: 'Message received. We will be in touch shortly.' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
