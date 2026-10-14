// src/routes/v2/analyticsRoutes.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../../controllers/v2/analyticsController'); // عدل المسار بحسب مكان وجود الـ Controller لديك

// مسار تقييم أداء السائقين واستهلاك الوقود
router.get('/drivers/eco-performance', analyticsController.getEcoPerformance);

// مسار ماتريس صحة الإطارات
router.get('/tires/health-matrix', analyticsController.getTireHealthMatrix);

// مسار حساب الأرباح وتقارير الـ ESG والانبعاثات
router.get('/trips/financial-esg', analyticsController.getFinancialESG);
router.get('/fleet/utilization-trends', analyticsController.getFleetUtilization);

module.exports = router;