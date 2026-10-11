const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
    camionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camion',
        required: true
    },
    type: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, 
        enum: ['vidange', 'freins', 'generale', 'pneus']
    },
    intervalleKm: {
        type: Number,
        required: true,
        default: 10000 
    },
    dernierKmEffectue: {
        type: Number,
        default: 0
    },
    statut: {
        type: String,
        enum: ['ok', 'alerte', 'en_cours'],
        default: 'ok'
    }
}, { timestamps: true });

module.exports = mongoose.model('Maintenance', maintenanceSchema);