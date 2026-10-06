const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.requireAuth = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // Fallback to Authorization header if cookies aren't used
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required' } });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // We only attach minimal info from JWT, but we can load user if needed
    // req.user = await User.findById(decoded.userId).select('-passwordHash -resetPasswordToken');
    
    req.user = { id: decoded.userId, role: decoded.role };

    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
};
