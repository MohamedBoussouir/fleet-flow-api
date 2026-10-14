// src/controllers/v2/documentController.js
exports.getMissionOrderPresignedUrl = async (req, res, next) => {
    try {
        const tripId = req.params.id;
        res.status(200).json({
            success: true,
            message: `Presigned URL for trip ${tripId} retrieved successfully`,
            data: {
                tripId,
                presignedUrl: "https://minio.local/bucket/mission-order-sample.pdf?token=xyz..."
            }
        });
    } catch (error) {
        next(error);
    }
};