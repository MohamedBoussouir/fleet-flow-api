const Remorque = require('../models/Remorque');

class RemorqueController {
  static async create(req, res, next) {
    try {
      const { immatriculation, capaciteKg, statut } = req.body;
      const exist = await Remorque.findOne({ immatriculation });
      if (exist) {
        return res.status(400).json({ message: 'Cette remorque existe déjà' });
      }
      const remorque = await Remorque.create({ immatriculation, capaciteKg, statut });
      return res.status(201).json({ message: 'Remorque créée avec succès', remorque });
    } catch (error) {
      return next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const remorques = await Remorque.find();
      return res.status(200).json(remorques);
    } catch (error) {
      return next(error); // تمرير الخطأ للمعالج العام بشكل صحيح
    }
  }

  static async getById(req, res, next) {
    try {
      const remorque = await Remorque.findById(req.params.id);
      if (!remorque) {
        return res.status(404).json({ message: 'Remorque non trouvée' });
      }
      return res.status(200).json(remorque);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const remorque = await Remorque.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!remorque) {
        return res.status(404).json({ message: 'Remorque non trouvée' });
      }
      return res.status(200).json({ message: 'Remorque mise à jour avec succès', remorque });
    } catch (error) {
      return next(error);
    }
  }

  static async archive(req, res, next) {
    try {
      const remorque = await Remorque.findByIdAndUpdate(
        req.params.id,
        { statut: 'hors-service' },
        { new: true }
      );
      if (!remorque) {
        return res.status(404).json({ message: 'Remorque non trouvée' });
      }
      return res.status(200).json({ message: 'Remorque archivée avec succès', remorque });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = RemorqueController;