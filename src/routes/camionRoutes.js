const express = require('express');
const router = express.Router();
const CamionController = require('../controllers/camionController');

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validateDto = require('../middlewares/validateDto');


const { createCamionSchema, updateCamionSchema } = require('../dtos/camionDto');


router.use(authMiddleware);
router.use(roleMiddleware('Admin'));


router.post('/', validateDto(createCamionSchema), CamionController.create);


router.get('/', CamionController.getAll);
router.get('/:id', CamionController.getById);


router.put('/:id', validateDto(updateCamionSchema), CamionController.update);


router.patch('/:id/archive', validateDto(updateCamionSchema), CamionController.archive);

module.exports = router;