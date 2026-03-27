const jwt = require('jsonwebtoken');

// Protect routes - Verify JWT
exports.protect = (req, res, next) => {
  let token;

  // 1. Get token from cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // 2. Check if token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized - No token found' });
  }

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach user to request (id and role)
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized - Invalid token' });
  }
};

// Admin access only
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, message: 'Access denied - Admin only' });
  }
};