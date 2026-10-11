const Trajet = require('../models/Trajet');
const Camion = require('../models/Camion');
const Remorque = require('../models/Remorque');
const User = require('../models/User');
const Pneu = require('../models/Pneu');

class AvailabilityService {
  static async checkAvailability({ camionId, remorqueId, chauffeurId, dateDepart, dateArrivee }) {
    // 1. التحقق من السائق: غير معلق ولديه دور Chauffeur
    const chauffeur = await User.findById(chauffeurId);
    if (!chauffeur || chauffeur.role !== 'Chauffeur') {
      return { available: false, message: 'Chauffeur introuvable ou rôle invalide' };
    }
    if (chauffeur.statut === 'suspendu') {
      return { available: false, message: 'Le chauffeur est suspendu et ne peut pas être assigné' };
    }

    // 2. التحقق من الشاحنة: موجودة وليست في صيانة
    const camion = await Camion.findById(camionId);
    if (!camion) return { available: false, message: 'Camion introuvable' };
    if (camion.statut === 'en_maintenance') {
      return { available: false, message: 'Le camion est actuellement en maintenance' };
    }

    // 3. التحقق من إطارات الشاحنة: عدم تجاوز حد التآكل
    const pneusCamion = await Pneu.find({ camionId });
    const pneuUse = pneusCamion.find(p => p.kilometrageUsure >= p.seuilUsureKm || p.etat === 'a_remplacer');
    if (pneuUse) {
      return { available: false, message: `Alerte: Un ou plusieurs pneus du camion dépassent le seuil d'usure (${pneuUse.numeroSerie})` };
    }

    // 4. التحقق من المقطورة: موجودة وليست في صيانة
    const remorque = await Remorque.findById(remorqueId);
    if (!remorque) return { available: false, message: 'Remorque introuvable' };
    if (remorque.statut === 'en_maintenance') {
      return { available: false, message: 'La remorque est actuellement en maintenance' };
    }

    // 5. فحص تداخل المواعيد (Chevauchement) مع رحلات نشطة (à faire / en cours)
    const start = new Date(dateDepart);
    const end = new Date(dateArrivee);

    const overlapFilter = {
      statut: { $in: ['à faire', 'en cours'] },
      $or: [         { camionId },         { remorqueId },         { chauffeurId }       ],$and: [
        { dateDepartPrevue: { $lt: end } },
        { dateArriveePrevue: { $gt: start } }
      ]
    };

    const conflictingTrajet = await Trajet.findOne(overlapFilter);
    if (conflictingTrajet) {
      return { 
        available: false, 
        message: 'Conflit d\'assignation: Le camion, la remorque ou le chauffeur est déjà assigné sur cette période' 
      };
    }

    return { available: true };
  }
}

module.exports = AvailabilityService;