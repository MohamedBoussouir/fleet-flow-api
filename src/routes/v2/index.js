const express = require('express');
const router = express.Router();

const analyticsRoutes = require('./analyticsRoutes');
const documentRoutes = require('./documentRoutes');

router.use('/analytics', analyticsRoutes);
router.use('/', documentRoutes);

router.get('/status', (req, res) => {
    res.json({
        success: true,
        message: 'Fleet TrackPRO API v2 is up and running 🚀',
        timestamp: new Date()
    });
});

module.exports = router;