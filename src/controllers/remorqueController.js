const Remorque = require('../models/Remorque');

class RemorqueController {
  static async create(req, res) {
    try {
      const { immatriculation, capaciteKg, statut } = req.body;
      const exist = await Remorque.findOne({ immatriculation });
      if (exist) {
        return res.status(400).json({ message: 'Cette remorque existe déjà' });
      }
      const remorque = await Remorque.create({ immatriculation, capaciteKg, statut });
      res.status(201).json({ message: 'Remorque créée avec succès', remorque });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const remorques = await Remorque.find();
      res.status(200).json(remorques);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
}

module.exports = RemorqueController;