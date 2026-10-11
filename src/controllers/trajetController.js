const Trajet = require('../models/Trajet');
const AvailabilityService = require('../services/availabilityService');
const PdfService = require('../services/pdfService');
class TrajetController {
    // 1. إنشاء مسار بواسطة الآدمن
    static async create(req, res) {
        try {
            const { siteDepart, siteArrivee, marchandise, dateDepartPrevue, dateArriveePrevue, camionId, remorqueId, chauffeurId } = req.body;

            const check = await AvailabilityService.checkAvailability({
                camionId,
                remorqueId,
                chauffeurId,
                dateDepart: dateDepartPrevue,
                dateArrivee: dateArriveePrevue
            });

            if (!check.available) {
                return res.status(409).json({ message: check.message });
            }

            const trajet = await Trajet.create({
                siteDepart,
                siteArrivee,
                marchandise,
                dateDepartPrevue,
                dateArriveePrevue,
                camionId,
                remorqueId,
                chauffeurId
            });

            res.status(201).json({ message: 'Trajet créé et assigné avec succès', trajet });
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }

    // 2. قائمة رحلات السائق الحالي
    static async getMesTrajets(req, res) {
        try {
            const trajets = await Trajet.find({ chauffeurId: req.user.id })
                .populate('camionId', 'immatriculation modele')
                .populate('remorqueId', 'immatriculation')
                .populate('chauffeurId', 'nom email');

            res.status(200).json(trajets);
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }

    // 3. تحديث حالة الرحلة والعدادات (updateStatut)
    static async updateStatut(req, res) {
        try {
            const { id } = req.params;
            const { statut, kmDepart, kmArrivee, volumeGasoil, coutGasoil, remarques } = req.body;

            const trajet = await Trajet.findById(id);
            if (!trajet) {
                return res.status(404).json({ message: 'Trajet non trouvé' });
            }

            // التحقق من أن السائق يعدل رحلته الخاصة فقط (إذا كان المستخدم Chauffeur)
            if (req.user && req.user.role === 'Chauffeur' && trajet.chauffeurId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Accès refusé: Ce trajet ne vous appartient pas' });
            }

            // الانتقال: à faire -> en cours
            if (statut === 'en cours') {
                if (trajet.statut !== 'à faire') {
                    return res.status(400).json({ message: 'Transition invalide: Le trajet doit être "à faire" pour démarrer' });
                }
                trajet.statut = 'en cours';
                if (kmDepart !== undefined) {
                    trajet.kmDepart = Number(kmDepart);
                }
            }
            // الانتقال: en cours -> terminé
            else if (statut === 'terminé') {
                if (trajet.statut !== 'en cours') {
                    return res.status(400).json({ message: 'Transition invalide: Le trajet doit être "en cours" pour être terminé' });
                }

                const departKm = trajet.kmDepart || 0;
                const arriveeKm = Number(kmArrivee);

                if (kmArrivee === undefined || isNaN(arriveeKm) || arriveeKm <= departKm) {
                    return res.status(400).json({
                        message: 'Le kilométrage d\'arrivée doit être strictement supérieur au kilométrage de départ'
                    });
                }

                trajet.statut = 'terminé';
                trajet.kmArrivee = arriveeKm;
                if (volumeGasoil !== undefined) trajet.volumeGasoil = Number(volumeGasoil);
                if (coutGasoil !== undefined) trajet.coutGasoil = Number(coutGasoil);
                if (remarques !== undefined) trajet.remarques = remarques;

                // حساب الاستهلاك: (Volume / Distance) * 100
                const distance = arriveeKm - departKm;
                if (distance > 0 && trajet.volumeGasoil > 0) {
                    trajet.consommationMoyenne = parseFloat(((trajet.volumeGasoil / distance) * 100).toFixed(2));
                }
            } else {
                return res.status(400).json({ message: 'Statut invalide' });
            }

            await trajet.save();
            return res.status(200).json({ message: 'Statut du trajet mis à jour avec succès', trajet });
        } catch (error) {
            return res.status(500).json({ message: 'Erreur serveur', error: error.message });
        }
    }

    static async downloadPdf(req, res) {
        try {
            const { id } = req.params;

            const trajet = await Trajet.findById(id)
                .populate('camionId', 'immatriculation modele')
                .populate('remorqueId', 'immatriculation capaciteKg')
                .populate('chauffeurId', 'nom email');

            if (!trajet) {
                return res.status(404).json({ message: 'Trajet non trouvé' });
            }

            // التحقق من الصلاحيات: السائق لا يمكنه تحميل إلا وثيقة رحلته
            if (req.user && req.user.role === 'Chauffeur' && trajet.chauffeurId._id.toString() !== req.user.id) {
                return res.status(403).json({ message: 'Accès interdit: Ce trajet ne vous appartient pas' });
            }

            // إعداد ترويسة الـ PDF
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=ordre-mission-${trajet._id}.pdf`);

            PdfService.generateOrdreDeMission(
                trajet,
                (chunk) => res.write(chunk),
                () => res.end()
            );
        } catch (error) {
            res.status(500).json({ message: 'Erreur serveur lors de la génération du PDF', error: error.message });
        }
    }
}

module.exports = TrajetController;