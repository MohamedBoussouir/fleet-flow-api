const Joi = require('joi');

const createRegleSchema = Joi.object({
    camionId: Joi.string().required(), // أضف هذا السطر هنا لكي يقبله النظام
    type: Joi.string().required(),
    periodiciteKm: Joi.number().min(1).required(),
    seuilAlerteKm: Joi.number().min(1).max(Joi.ref('periodiciteKm')).required()
});

const resoudreAlerteSchema = Joi.object({
    statut: Joi.string().valid('resolue').required(),
    commentaire: Joi.string().required()
});

module.exports = { createRegleSchema, resoudreAlerteSchema };