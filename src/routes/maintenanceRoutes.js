const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

// مسار ضبط قواعد الصيانة
router.post('/regles', MaintenanceController.configureRule);

router.get('/alertes', MaintenanceController.getAlertes);

module.exports = router;