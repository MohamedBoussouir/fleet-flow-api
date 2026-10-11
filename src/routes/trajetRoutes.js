const express = require('express');
const router = express.Router();
const TrajetController = require('../controllers/trajetController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);

// مسار السائق لرؤية رحلاته الخاصة فقط
router.get('/mes-trajets', roleMiddleware('Chauffeur'), TrajetController.getMesTrajets);

// مسار الآدمن لإنشاء وتعيين رحلة
router.post('/', roleMiddleware('Admin'), TrajetController.create);
// مسار تحديث الحالة (مسموح للسائق وللآدمن)
router.patch('/:id/statut', roleMiddleware('Chauffeur', 'Admin'), TrajetController.updateStatut);

router.get('/:id/pdf', roleMiddleware('Chauffeur', 'Admin'), TrajetController.downloadPdf);
module.exports = router;