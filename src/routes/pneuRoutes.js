const express = require('express');
const router = express.Router();
const PneuController = require('../controllers/pneuController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const validateDto = require('../middlewares/validateDto');
const { createPneuSchema, updatePneuSchema } = require('../dtos/pneuDto');


router.use(authMiddleware);
router.use(roleMiddleware('Admin'));


router.post('/', validateDto(createPneuSchema), PneuController.create);


router.get('/', PneuController.getByCamion);


router.put('/:id', validateDto(updatePneuSchema), PneuController.update);

module.exports = router;