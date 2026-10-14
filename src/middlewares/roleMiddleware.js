const roleMiddleware = (...roles) => {

  const allowedRoles = roles.flat();

  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      
      return res.status(403).json({ message: 'Accès interdit: Permissions insuffisantes' });
    }
    next();
  };
};

module.exports = roleMiddleware;