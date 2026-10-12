const Pneu = require('../models/Pneu');

class PneuController {
  static async create(req, res) {
    try {
      const pneu = await Pneu.create(req.body);
      res.status(201).json({ message: 'Pneu ajouté avec succès', pneu });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  static async getByCamion(req, res) {
    try {
      const { camionId } = req.query;
      const filter = camionId ? { camionId } : {};
      const pneus = await Pneu.find(filter).populate('camionId', 'immatriculation modele');
      res.status(200).json(pneus);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
  static async update(req, res) {
    try {
      const pneu = await Pneu.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!pneu) {
        return res.status(404).json({ message: 'Pneu non trouvé' });
      }
      return res.status(200).json({ message: 'Pneu mis à jour avec succès', pneu });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
}

module.exports = PneuController;