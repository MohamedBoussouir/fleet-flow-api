const JwtService = require('../services/jwtService');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1. التحقق من وجود الهيدر وأن يبدأ بـ Bearer
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false,
      message: 'Accès refusé: Aucun token fourni ou format incorrect' 
    });
  }

  // 2. استخراج التوكن
  const token = authHeader.split(' ')[1];

  try {
    
    const decoded = JwtService.verifyAccessToken(token);
    
    
    req.user = decoded; 
    next();
    
  } catch (error) {
   
    let message = 'Token invalide';
    
    if (error.name === 'TokenExpiredError') {
      message = 'Le token a expiré';
    } else if (error.name === 'JsonWebTokenError') {
      message = 'Token malformé ou falsifié';
    }

    return res.status(401).json({ 
      success: false,
      message: message 
    });
  }
};

module.exports = authMiddleware;