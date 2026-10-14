const Joi = require('joi');

const createTrajetSchema = Joi.object({
    siteDepart: Joi.string().required(),
    siteArrivee: Joi.string().required(),
    marchandise: Joi.string().required(),
    dateDepartPrevue: Joi.date().iso().required(),
    dateArriveePrevue: Joi.date().iso().min(Joi.ref('dateDepartPrevue')).required(),
    camionId: Joi.string().required(),
    remorqueId: Joi.string().required(),
    chauffeurId: Joi.string().required()
});

const updateTrajetSchema = Joi.object({
    statut: Joi.string().valid('à faire', 'en cours', 'terminé'),
    kmDepart: Joi.number().min(0),
    kmArrivee: Joi.number().min(0),
    volumeGasoil: Joi.number().min(0),
    coutGasoil: Joi.number().min(0),
    remarques: Joi.string().allow('', null)
}).custom((value, helpers) => {
    // التحقق فقط إذا تم إرسال الحقلين معاً في طلب الـ PATCH
    if (value.kmArrivee !== undefined && value.kmDepart !== undefined) {
        if (value.kmArrivee < value.kmDepart) {
            return helpers.message('Le km d\'arrivée doit être supérieur ou égal au km de départ');
        }
    }
    return value;
});

module.exports = { createTrajetSchema, updateTrajetSchema };