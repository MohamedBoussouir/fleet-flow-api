const express = require('express');
const router = express.Router();
const RemorqueController = require('../controllers/remorqueController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const validateDto = require('../middlewares/validateDto');
const { createRemorqueSchema, updateRemorqueSchema } = require('../dtos/remorqueDto');

router.use(authMiddleware);

router.get('/', roleMiddleware(['Admin', 'Chauffeur']), RemorqueController.getAll);
router.get('/:id', roleMiddleware(['Admin', 'Chauffeur']), RemorqueController.getById);


router.post('/', roleMiddleware(['Admin']), validateDto(createRemorqueSchema), RemorqueController.create);
router.put('/:id', roleMiddleware(['Admin']), validateDto(updateRemorqueSchema), RemorqueController.update);
router.patch('/:id/archive', roleMiddleware(['Admin']), RemorqueController.archive);

module.exports = router;