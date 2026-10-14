const Joi = require('joi');

const createPneuSchema = Joi.object({
    numeroSerie: Joi.string().required(),
    camionId: Joi.string().required(),
    position: Joi.string().required(),
    kilometrageUsure: Joi.number().min(0).default(0),
    seuilUsureKm: Joi.number().min(0).default(60000),
    etat: Joi.string().valid('bon', 'a_surveiller', 'critique').default('bon')
});

const updatePneuSchema = Joi.object({
    kilometrageUsure: Joi.number().min(0),
    etat: Joi.string().valid('bon', 'a_surveiller', 'critique')
});

module.exports = { createPneuSchema, updatePneuSchema };