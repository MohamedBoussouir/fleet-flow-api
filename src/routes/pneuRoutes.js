const express = require('express');
const router = express.Router();
const PneuController = require('../controllers/pneuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.post('/', PneuController.create);
router.get('/', PneuController.getByCamion);
router.put('/:id', PneuController.update);

module.exports = router;