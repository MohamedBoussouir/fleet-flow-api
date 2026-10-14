// src/controllers/v2/analyticsController.js
const Trajet = require('../../models/Trajet');

// 1. حساب أداء السائقين واستهلاك الوقود (Eco-Performance) باستخدام Aggregation Pipeline
exports.getEcoPerformance = async (req, res, next) => {
    try {
        const ecoPerformanceData = await Trajet.aggregate([
            {
                $lookup: {
                    from: 'chauffeurs', // اسم مجموعة السائقين في قاعدة بيانات MongoDB
                    localField: 'chauffeur', // الحقل المرتبط بالرحلة
                    foreignField: '_id',
                    as: 'chauffeurInfo'
                }
            },
            {
                $unwind: '$chauffeurInfo'
            },
            {
                $group: {
                    _id: '$chauffeur',
                    nomChauffeur: { $first: '$chauffeurInfo.nom' },
                    prenomChauffeur: { $first: '$chauffeurInfo.prenom' },
                    totalTrajets: { $sum: 1 },
                    totalDistanceKm: { $sum: '$distance' }, // تأكد أن حقل المسافة في المودل يسمى distance
                    totalCarburantConsomme: { $sum: '$consommationCarburant' } // حقل استهلاك الوقود
                }
            },
            {
                $project: {
                    _id: 1,
                    nomChauffeur: 1,
                    prenomChauffeur: 1,
                    totalTrajets: 1,
                    totalDistanceKm: 1,
                    totalCarburantConsomme: 1,
                    // حساب معدل الاستهلاك لكل 100 كيلومتر (مؤشر كفاءة الوقود)
                    ecoScoreLitersPer100Km: {
                        $cond: [
                            { $gt: ['$totalDistanceKm', 0] },
                            { $multiply: [{ $divide: ['$totalCarburantConsomme', '$totalDistanceKm'] }, 100] },
                            0
                        ]
                    }
                }
            },
            {
                $sort: { ecoScoreLitersPer100Km: 1 } // الترتيب تصاعدياً (الأقل استهلاكاً للوقود هو الأكثر كفاءة)
            }
        ]);

        res.status(200).json({
            success: true,
            count: ecoPerformanceData.length,
            message: 'Eco-performance analytics calculated successfully via MongoDB Aggregation 🚀',
            data: ecoPerformanceData
        });

    } catch (error) {
        next(error);
    }
};

// 2. تحليل صحة وماتريس الإطارات (Tire Health Matrix)
exports.getTireHealthMatrix = async (req, res, next) => {
    try {
        // سنضيف منطق الإطارات هنا لاحقاً
        res.status(200).json({ success: true, message: 'Tire health matrix retrieved successfully', data: [] });
    } catch (error) {
        next(error);
    }
};

// 3. تقارير الأرباح وتكاليف الـ ESG والانبعاثات
exports.getFinancialESG = async (req, res, next) => {
    try {
        // سنضيف منطق الـ ESG هنا لاحقاً
        res.status(200).json({ success: true, message: 'Financial & ESG analytics retrieved successfully', data: [] });
    } catch (error) {
        next(error);
    }
};
exports.getFleetUtilization = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Fleet utilization trends retrieved successfully',
            data: []
        });
    } catch (error) {
        next(error);
    }
};