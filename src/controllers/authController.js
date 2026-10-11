const User = require('../models/User');
const JwtService = require('../services/jwtService');

class AuthController {
  static async register(req, res) {
    try {
      const { nom, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      const newUser = await User.create({ nom, email, password, role });
      res.status(201).json({
        message: 'Utilisateur créé avec succès',
        user: { id: newUser._id, nom: newUser.nom, email: newUser.email, role: newUser.role }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email et mot de passe requis' });
      }

      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      
      if (user.statut === 'suspendu') {
        return res.status(403).json({ message: 'Compte suspendu, contactez votre administrateur' });
      }

     
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Identifiants invalides' });
      }

      
      const payload = {
        id: user._id,
        role: user.role
      };

      const accessToken = JwtService.generateAccessToken(payload);
      const refreshToken = JwtService.generateRefreshToken(payload);

     
      res.status(200).json({
        message: 'Connexion réussie',
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          nom: user.nom,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
}

module.exports = AuthController;