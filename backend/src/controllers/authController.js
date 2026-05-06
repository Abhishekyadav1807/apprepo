const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  return res.status(201).json({ token: tokenFor(user._id), user: { id: user._id, name: user.name, email: user.email } });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  return res.json({ token: tokenFor(user._id), user: { id: user._id, name: user.name, email: user.email } });
};

module.exports = { register, login };
