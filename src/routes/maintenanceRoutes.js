const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const validateDto = require('../middlewares/validateDto');
const { createRegleSchema, resoudreAlerteSchema } = require('../dtos/maintenanceDto');

router.use(authMiddleware);

// مسار عرض التنبيهات متاح للأدمن والسائقين
router.get('/alertes', roleMiddleware(['Admin', 'Chauffeur']), MaintenanceController.getAlertes);

// مسار إنشاء القواعد للأدمن فقط
router.post('/regles', roleMiddleware(['Admin']), validateDto(createRegleSchema), MaintenanceController.configureRule);

// مسار حل التنبيه للأدمن فقط
router.patch('/alertes/:id/resoudre', roleMiddleware(['Admin']), validateDto(resoudreAlerteSchema), MaintenanceController.resoudreAlerte);

module.exports = router;