const Joi = require('joi');


const createCamionSchema = Joi.object({
    immatriculation: Joi.string().required().messages({
        'string.empty': 'L\'immatriculation est obligatoire',
        'any.required': 'L\'immatriculation est obligatoire'
    }),
    modele: Joi.string().required().messages({
        'string.empty': 'Le modèle est obligatoire',
        'any.required': 'Le modèle est obligatoire'
    }),
    kilometrageTotal: Joi.number().min(0).default(0).messages({
        'number.base': 'Le kilométrage doit être un nombre',
        'number.min': 'Le kilométrage ne peut pas être négatif'
    }),
    statut: Joi.string().valid('disponible', 'en_mission', 'en_maintenance').default('disponible')
});


const updateCamionSchema = Joi.object({
    kilometrageTotal: Joi.number().min(0),
    statut: Joi.string().valid('disponible', 'en_mission', 'en_maintenance'),
    isArchived: Joi.boolean()
});

module.exports = {
    createCamionSchema,
    updateCamionSchema
};