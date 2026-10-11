const jwt = require('jsonwebtoken');

class JwtService {
  static generateAccessToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '15m'
    });
  }

  static generateRefreshToken(payload) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || 'refreshSecretKey', {
      expiresIn: '7d'
    });
  }

  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refreshSecretKey');
    } catch (error) {
      return null;
    }
  }
}

module.exports = JwtService;