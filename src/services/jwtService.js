const jwt = require('jsonwebtoken');

class JwtService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key_here', {
      expiresIn: '15m'
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'your_jwt_secret_key_here', {
      expiresIn: '7d'
    });
  }

  static verifyAccessToken(token) {
    try {
      
      return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');
    } catch (error) {
      
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'your_jwt_secret_key_here');
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtService;