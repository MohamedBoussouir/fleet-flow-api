const Camion = require('../models/Camion');

class CamionController {
  // إضافة شاحنة جديدة
  static async create(req, res) {
    try {
      const { immatriculation, modele, kilometrageTotal, statut } = req.body;
      const exist = await Camion.findOne({ immatriculation });
      if (exist) {
        return res.status(400).json({ message: 'Cette immatriculation existe déjà' });
      }

      const camion = await Camion.create({ immatriculation, modele, kilometrageTotal, statut });
      res.status(201).json({ message: 'Camion créé avec succès', camion });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // جلب جميع الشاحنات
  static async getAll(req, res) {
    try {
      const camions = await Camion.find();
      res.status(200).json(camions);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // جلب شاحنة واحدة بالـ ID
  static async getById(req, res) {
    try {
      const camion = await Camion.findById(req.params.id);
      if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
      res.status(200).json(camion);
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // تعديل شاحنة
  static async update(req, res) {
    try {
      const camion = await Camion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!camion) return res.status(404).json({ message: 'Camion non trouvé' });
      res.status(200).json({ message: 'Camion mis à jour', camion });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
  static async archive(req, res, next) {
    try {
      const camion = await Camion.findByIdAndUpdate(
        req.params.id,
        { statut: 'hors-service' },
        { new: true }
      );

      if (!camion) {
        return res.status(404).json({ message: 'Camion non trouvé' });
      }

      return res.status(200).json({
        message: 'Camion archivé avec succès',
        camion
      });
    } catch (error) {
      next(error);
    }
  }
}


module.exports = CamionController;