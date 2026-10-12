const express = require('express');
const router = express.Router();
const CamionController = require('../controllers/camionController');

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

router.post('/', CamionController.create);
router.get('/', CamionController.getAll);
router.get('/:id', CamionController.getById);
router.put('/:id', CamionController.update);
router.patch('/:id/archive', CamionController.archive);

module.exports = router;