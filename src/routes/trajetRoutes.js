const express = require('express');
const router = express.Router();
const TrajetController = require('../controllers/trajetController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


const validateDto = require('../middlewares/validateDto');
const { createTrajetSchema, updateTrajetSchema } = require('../dtos/trajetDto');


router.use(authMiddleware);


router.get('/mes-trajets', roleMiddleware('Chauffeur'), TrajetController.getMesTrajets);


router.post('/', roleMiddleware('Admin'), validateDto(createTrajetSchema), TrajetController.create);


router.patch('/:id/statut', roleMiddleware('Chauffeur', 'Admin'), validateDto(updateTrajetSchema), TrajetController.updateStatut);


router.get('/:id/pdf', roleMiddleware('Chauffeur', 'Admin'), TrajetController.downloadPdf);

module.exports = router;