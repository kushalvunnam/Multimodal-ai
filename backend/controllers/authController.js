const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const setTokenCookie = (req, res, token) => {
  const origin = req.get ? req.get('origin') : '';
  const isCrossSite = origin && (origin.includes('vercel.app') || origin.includes('netlify.app'));
  const secureCookie = isCrossSite || process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
  res.cookie('token', token, {
    httpOnly: true,
    secure: secureCookie,
    // Vercel frontend -> Render API is cross-site, so production auth must use SameSite=None.
    sameSite: secureCookie ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: { message: 'Please provide name, email, and password' } });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, error: { message: 'Password must be at least 8 characters long' } });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, error: { message: 'An account with this email already exists.' } });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });

    const token = generateToken(user._id, user.role);
    setTokenCookie(req, res, token);

    res.status(201).json({
      success: true,
      token, user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ success: false, error: { message: 'Server error during signup: ' + error.message } });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: { message: 'Please provide email and password' } });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ success: false, error: { message: 'Invalid credentials' } });

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    setTokenCookie(req, res, token);

    res.json({
      success: true,
      token, user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Signin Error:', error);
    res.status(500).json({ success: false, error: { message: 'Server error during signin: ' + error.message } });
  }
};

exports.signout = (req, res) => {
  const origin = req.get ? req.get('origin') : '';
  const isCrossSite = origin && (origin.includes('vercel.app') || origin.includes('netlify.app'));
  const secureCookie = isCrossSite || process.env.COOKIE_SECURE === 'true' || process.env.NODE_ENV === 'production';
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: secureCookie,
    sameSite: secureCookie ? 'none' : 'lax',
    path: '/'
  });
  res.json({ success: true, message: 'User logged out' });
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -resetPasswordToken -resetPasswordExpires');
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Server error fetching user' } });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    const genericResponse = 'If an account exists for this email, password reset instructions will be sent.';

    if (!user) return res.json({ success: true, message: genericResponse });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    await user.save();
    console.log(`Reset token for ${email}: ${resetToken}`);
    res.json({ success: true, message: genericResponse });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Server error processing forgot password' } });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ success: false, error: { message: 'Invalid token or password too short' } });
    }

    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ success: false, error: { message: 'Invalid or expired reset token' } });

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Server error resetting password' } });
  }
};






