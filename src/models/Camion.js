const mongoose = require('mongoose');

const camionSchema = new mongoose.Schema({
  immatriculation: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  modele: {
    type: String,
    required: true,
    trim: true
  },
  kilometrageTotal: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  statut: {
    type: String,
    enum: ['disponible', 'en_mission', 'en_maintenance'],
    default: 'disponible'
  }
}, { timestamps: true });

module.exports = mongoose.model('Camion', camionSchema);