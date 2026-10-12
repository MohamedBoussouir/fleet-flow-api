const express = require('express');
const router = express.Router();
const MaintenanceController = require('../controllers/maintenanceController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));


router.post('/regles', MaintenanceController.configureRule);
router.get('/alertes', MaintenanceController.getAlertes);
router.patch('/alertes/:id/resoudre', MaintenanceController.resoudreAlerte);

module.exports = router;