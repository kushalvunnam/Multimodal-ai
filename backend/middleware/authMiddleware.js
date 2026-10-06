// Mock Auth Middleware for Phase 6
exports.requireAuth = (req, res, next) => {
  // In a real app, verify JWT here.
  req.user = { id: 'user-123', name: 'Demo User' };
  next();
};
