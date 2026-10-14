// src/routes/v2/documentRoutes.js
const express = require('express');
const router = express.Router();
const documentController = require('../../controllers/v2/documentController');

router.get('/trips/:id/mission-order-url', documentController.getMissionOrderPresignedUrl);

module.exports = router;