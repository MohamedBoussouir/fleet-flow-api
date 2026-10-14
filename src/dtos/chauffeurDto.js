const Joi = require('joi');

const updateStatutChauffeurSchema = Joi.object({
    statut: Joi.string().valid('actif', 'suspendu').required()
});

module.exports = { updateStatutChauffeurSchema };