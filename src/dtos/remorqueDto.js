const Joi = require('joi');

const createRemorqueSchema = Joi.object({
    immatriculation: Joi.string().required(),
    capaciteKg: Joi.number().min(0).required(),
    statut: Joi.string().valid('disponible', 'en_mission', 'en_maintenance').default('disponible')
});

const updateRemorqueSchema = Joi.object({
    capaciteKg: Joi.number().min(0),
    statut: Joi.string().valid('disponible', 'en_mission', 'en_maintenance'),
    isArchived: Joi.boolean()
});

module.exports = { createRemorqueSchema, updateRemorqueSchema };