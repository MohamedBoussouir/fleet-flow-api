
const express = require('express');
const router = express.Router();
const RapportController = require('../controllers/rapportController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));


router.get('/global', RapportController.getGlobalReport);
router.get('/camions/:id', RapportController.getVehicleReport);

module.exports = router;