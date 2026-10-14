const Maintenance = require('../models/Maintenance');
const Camion = require('../models/Camion');
const Pneu = require('../models/Pneu');

class MaintenanceController {
  // 1. مسار: POST /api/maintenances/rules (Configurer Règles de Maintenance)
  static async configureRule(req, res) {
    try {
      const { camionId, type, intervalleKm, dernierKmEffectue } = req.body;

      const rule = await Maintenance.create({
        camionId,
        type,
        intervalleKm,
        dernierKmEffectue: dernierKmEffectue || 0
      });

      res.status(201).json({ message: 'Règle de maintenance configurée avec succès', rule });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }

  // 2. مسار: GET /api/maintenances/alertes (Consulter les Alertes de Maintenance Actives)
  static async getAlertes(req, res) {
    try {
      const alertes = [];

      // أ. فحص صيانة الشاحنات بحسب الكيلومترات
      const rules = await Maintenance.find().populate('camionId', 'immatriculation modele kilometrageTotal');
      for (const rule of rules) {
        if (!rule.camionId) continue;
        const kmParcouruDepuisDerniere = rule.camionId.kilometrageTotal - rule.dernierKmEffectue;

        if (kmParcouruDepuisDerniere >= rule.intervalleKm) {
          alertes.push({
            type: 'MAINTENANCE_VEHICULE',
            vehicule: rule.camionId.immatriculation,
            maintenanceType: rule.type,
            kmActuel: rule.camionId.kilometrageTotal,
            kmDepasse: kmParcouruDepuisDerniere - rule.intervalleKm,
            message: `Le camion ${rule.camionId.immatriculation} a dépassé le seuil pour: ${rule.type}`
          });
        }
      }

      // ب. فحص الإطارات التي بلغت أو تجاوزت حد التآكل seuilUsureKm
      const pneusAlertes = await Pneu.find({
        $or: [
          { $expr: {$gte: ['$kilometrageUsure', '$seuilUsureKm'] } },
          { etat: 'a_remplacer' }
        ]
      }).populate('camionId', 'immatriculation');

      pneusAlertes.forEach(pneu => {
        alertes.push({
          type: 'USURE_PNEU',
          vehicule: pneu.camionId ? pneu.camionId.immatriculation : 'N/A',
          pneuNumeroSerie: pneu.numeroSerie,
          usureActuelle: pneu.kilometrageUsure,
          seuil: pneu.seuilUsureKm,
          message: `Le pneu ${pneu.numeroSerie} doit être remplacé immédiatement`
        });
      });

      res.status(200).json({
        totalAlertes: alertes.length,
        alertes
      });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
  }
  static async resoudreAlerte(req, res, next) {
    try {
      const alerte = await Maintenance.findByIdAndUpdate(
        req.params.id,
        { statut: 'resolue' }, 
        { new: true }
      );

      if (!alerte) {
        return res.status(404).json({ message: 'Alerte non trouvée' });
      }

      return res.status(200).json({
        message: 'Alerte résolue avec succès',
        alerte
      });
    } catch (error) {
      
      return next(error);
    }
  }
}

module.exports = MaintenanceController;